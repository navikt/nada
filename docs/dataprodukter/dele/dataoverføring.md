## Flytte data fra Postgres til BigQuery 
### Datastream
Google tilbyr Datastream for å strømme data fra f.eks. Postgres til BigQuery.
Vi har laget et forenklet oppsett som er tilgjengelig i dette repoet:

[Link til github-repo for oppsett av Datastream](https://github.com/navikt/nada-datastream)

Dere trenger å gjøre en enkel database-migrasjon, kjøre et script èn gang og så har dere oppdaterte data i BigQuery klare for analyse.
Mønsteret vi legger opp til er at team flytter data ut til en "landingssone" kun teamet har tilgang til før transformasjoner gjøres og tabeller/view er klare for bruk internt i teamet eller deling, se figuren under.
````mermaid
flowchart LR
    A[(Postgres 1)] --> C(Datastream)  
    B[(Postgres 2)] --> C

    C --> D
    C --> E
    D --transformasjon--> F
    E --transformasjon--> G

  
    subgraph BigQuery
       D[(Tabell 1)]
       E[(Tabell 2)]

       F[(Dataprodukt 1)] 
       G[(Dataprodukt 2)]
    end
````

### Federated query

Federated query brukes typisk til å lese data fra en postgres-database i GCP, transformere disse og skrive til BigQuery.

```mermaid
graph TD
postgres[(Postgres)] --Spørring mot Postgres-database i GCP--> federated_query[Federated query]
federated_query --Ytterligere transformasjoner kan gjøres i BigQuery--> BQ_query[BQ-query]
Schedule --Regelbasert styring av kjøringen--> BQ_query
BQ_query --Tabell skrives til BigQuery--> BigQuery[(BigQuery-tabell)]
```

For å sette opp federated query:

1. [Følg Google sin guide for å sette opp Cloud SQL databasetilkobling](https://cloud.google.com/bigquery/docs/cloud-sql-federated-queries#setting-up-cloud-sql-database-connections)
2. Gi generert service account roller for å kunne utføre external queries
    * Når man i (1) aktiverer `BigQuery Connection API` blir det automatisk generert en service account på formatet `service-<projectNumber>@gcp-sa-bigqueryconnection.iam.gserviceaccount.com`. Denne må gis følgende roller i prosjektet:
        - `Bigquery Connection Admin`
        - `Cloud SQL Client`
    !!! info "`projectNumber` over er prosjektnummeret, ikke prosjekt ID. Du finner prosjektnummer [her](https://console.cloud.google.com/welcome)."

3. [Følg Google sin guide for å opprette et BigQuery dataset](https://cloud.google.com/bigquery/docs/datasets)
    * Merk at _dataset_ i denne konteksten er noe annet enn [datasett i markedsplassen](../dataprodukt.md#hva-er-et-datasett)
    * Foreløpig kan vi ikke gjenbruke datasets som har blitt opprettet av en nais-applikasjon, da denne overstyrer tilgangene vi oppretter senere i denne guiden
4. [Følg Google sin guide for å lage en Google servicebruker for å kjøre en skedulert federated query](https://cloud.google.com/iam/docs/creating-managing-service-accounts)
    * Gi serviceaccounten følgende tilganger på prosjektnivå:
        - _BigQuery Connection User_
        - _BigQuery Job User_
        - _BigQuery Metadata Viewer_
5. [Følg Google sin guide for å gi tilganger til servicebrukeren på datasett](https://cloud.google.com/bigquery/docs/dataset-access-controls)
    * Serviceaccounten trenger rollen _BigQuery Data Editor_

Etter at servicebrukeren har tilgang til datasettet kan man sette opp en spørring som henter data via _external connection_.

Gjennom [Google Cloud Console](https://console.cloud.google.com) kan man velge prosjektet som datasettet tilhører, gå inn på BigQuery og klikke "Compose New Query" til høyre.

Eksempelvis:
```sql
SELECT * FROM EXTERNAL_QUERY(
'europe-north1.<connection_name>',
'''

-- Lag en variabel for versjonering 
WITH constants (version) as (
    values (now())
)

-- Legg inn rader fra Postgres-tabellen med et felt for version-variablen vi definerte over.
SELECT 
    id::text, 
    name, 
    "group", 
    pii, 
    created, 
    last_modified, 
    "type"::text, 
    version
FROM dataproducts, constants
''');
```

#### Kjøre spørring på tidsintervall

For å kjøre en spørring på intervall, så kan du i Query Explorer i Cloud Console velge å definere en "Schedule".

For å få lov til å sette opp eller oppdatere en schedule må din personlige bruker ha noen rettigheter også. 
Disse er for det meste dekket av Bigquery Admin, men hvis du setter opp jobben med en servicebruker (anbefalt) må du også ha tilgang til denne, for eksempel via en midlertidig Service Account Admin.

Klikk "Schedule" og "Create new schedule"


* Name: et passende navn 
* Repeats: Det som passer produktet
* Dataset name: datasettet som ble laget tidligere
* Table name: navn på produkt-tabell
* Advanced options:
    - Service account: servicebrukeren som ble laget tidligere
    
## Flytte data fra Kafka til BigQuery
For å ta data fra en Kafka-strøm til BigQuery, trenger du å sette opp en applikasjon.
[Under](#kode-eksempler) følger enkle eksempler på hvordan å lese fra Kafka og skrive til BigQuery i forskjellige programmeringsspråk. 
Alle eksemplene forutsetter at en på forhånd har laget datasettet BigQuery tabellen skal opprettes i og at man har tilgang til å skrive til/opprette tabeller i datasettet.
Opprettelsen av datasettet og tilgangene ordnes automatisk når appen deployes til GCP-clusterne til nais med [nais.yaml](https://doc.nais.io/nais-application/application/#kafka). 

### Kodeeksempler
Eksemplene tar ikke hensyn til autentisering mot Kafka så det antas at man kan lese fra kafka topicet anonymt. For mer informasjon om oppsett av app og autentisering for Kafka i NAV, se [nais docs](https://doc.nais.io/persistence/kafka/application/).

!!!info "Topicet det leses fra i eksemplene har JSON schema og inneholder fire felter: et tekstfelt, et boolean felt, et numerisk felt og et timestamp."

=== "Python"
    Avhengigheter:
    ````
    pip install google-cloud-bigquery kafka-python
    ````
    Kode:
    ````python
    from kafka import KafkaConsumer
    from google.cloud import bigquery
    import json

    def create_kafka_consumer(topic: str, kafka_brokers: []) -> KafkaConsumer:
        return KafkaConsumer(
            topic,
            bootstrap_servers=kafka_brokers,
            api_version=(0, 10),
            auto_offset_reset='earliest',
            enable_auto_commit=True,
            value_deserializer=lambda x: json.loads(x.decode('utf-8'))
        )


    def create_bq_table_if_not_exists(bq_client: bigquery.Client, project_id: str, dataset_id: str, table: str) -> bigquery.Table:
        table_uri = f"{project_id}.{dataset_id}.{table}"

        schema = [
            bigquery.SchemaField("stringValue", "STRING", mode="REQUIRED"),
            bigquery.SchemaField("booleanValue", "BOOLEAN"),
            bigquery.SchemaField("numericValue", "INTEGER"),
            bigquery.SchemaField("timestampValue", "TIMESTAMP"),
        ]

        table = bigquery.Table(table_uri, schema=schema)
        return bq_client.create_table(table, exists_ok=True)


    if __name__ == "__main__":
        project_id = "PROJECT" # erstatt med prosjekt id
        dataset_id = "DATASET" # erstatt med dataset id
        table_name = "TABLE" # erstatt med tabellnavn
        bq_client = bigquery.Client(project=project_id)
        table_id = create_bq_table_if_not_exists(bq_client, project_id, dataset_id, table_name)

        topic_name = "TOPIC" # erstatt med topic navn
        kafka_brokers = ["BROKER1"] # erstatt med liste av brokere
        consumer = create_kafka_consumer(topic_name, kafka_brokers)
        for mesg in consumer:
            print(mesg.value)
            errors = bq_client.insert_rows_json(table_id, [mesg.value])
            if errors != []:
                raise Exception(errors)
    ````

=== "Kotlin"
    Avhengigheter:
    ````
    implementation("com.google.cloud:google-cloud-bigquery:2.22.0")
    implementation("org.apache.kafka:kafka-clients:3.4.0")
    ````

    Kode:
    ````kotlin
    import com.fasterxml.jackson.databind.JsonNode
    import com.fasterxml.jackson.databind.ObjectMapper
    import com.google.cloud.bigquery.*
    import java.time.Duration
    import java.util.*
    import org.apache.kafka.clients.consumer.ConsumerRecords
    import org.apache.kafka.clients.consumer.KafkaConsumer
    import java.time.LocalDateTime
    import java.time.temporal.ChronoUnit
    
    fun main() {
    
        val bigQueryClient = BigQueryClient()
    
        val tableId = bigQueryClient.getOrCreateBigQueryTable("TABLE" /* erstatt med tabellnavn */)
    
        val kafkaConsumer = createKafkaConsumer()
    
        while (true) {
            val records: ConsumerRecords<String?, String?> = kafkaConsumer.poll(Duration.ofMillis(100))
            for (record in records) {
                storeRecordInBigQuery(record, bigQueryClient, tableId)
            }
        }
    }
    
    private fun setupBigQueryClient(): BigQueryClient {
    val bqClient = BigQueryClient(projectId, datasetId)
    return bqClient
    }
    
    fun createKafkaConsumer(): KafkaConsumer<String, String> {
    val topicName = "TOPIC" // erstatt med navn på Kafka topic
    val kafkaBrokers = "BROKERS" // erstatt med navn på brokers
    val props = Properties()
    props.setProperty("bootstrap.servers", kafkaBrokers)
    props.setProperty("group.id", "mygroup")
    props.setProperty("auto.offset.reset", "earliest")
    props.setProperty("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer")
    props.setProperty("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer")
    
        val consumer = KafkaConsumer<String, String>(props)
        consumer.subscribe(Arrays.asList(topicName))
    
        return consumer
    }
    
    private fun storeRecordInBigQuery(record: ConsumerRecord<String? String?>, bigQueryClient: BigQueryClient, tableId: Unit) {
    System.out.printf(
    "offset = %d, key = %s, value = %s%n",
    record.offset(),
    record.key(),
    record.value()
    )
    val value = ObjectMapper().readValue(record.value(), JsonNode::class.java)
    bigQueryClient.insert(tableId, value)
    }
    
    class BigQueryClient() {
    private val projectId = "PROJECT" // erstatt med prosjektets id
    private val datasetId = "DATASET" // erstatt med datasett id
    private val bigQuery = BigQueryOptions.newBuilder()
    .setProjectId(projectId)
    .build()
    .service
    
        fun getOrCreateTable(tableName: String): TableId {
            val tableId = TableId.of(datasetId, tableName)
            val table = bigQuery.getTable(tableId)
            return if (table != null) {
                table.tableId
            }
            else {
                return createTable(tableName)
            }
        }
    
        private fun createTable(tableName: String): TableId {
            val schema = Schema.of(
                Field.newBuilder("stringValue", StandardSQLTypeName.STRING).setMode(Field.Mode.REQUIRED).build(),
                Field.of("booleanValue", StandardSQLTypeName.BOOL),
                Field.of("numericValue", StandardSQLTypeName.INT64),
                Field.of("timestampValue", StandardSQLTypeName.TIMESTAMP),
            )
    
            val tableId = TableId.of(datasetId, tableName)
            val tableDefinition = StandardTableDefinition.of(schema)
            val tableInfo = TableInfo.newBuilder(tableId, tableDefinition).build()
    
            return bigQuery.create(tableInfo).tableId
        }
    
        fun insert(tableId: TableId, value: JsonNode) {
            val row = InsertAllRequest.RowToInsert.of(mapOf(
                value.use("stringValue") { textValue() },
                value.use("booleanValue") { booleanValue() },
                value.use("numericValue") { intValue() },
                value.use("timestampValue") { LocalDateTime.parse(asText()).truncatedTo(ChronoUnit.MICROS).toString() },
            ))
    
            val table = bigQuery.getTable(tableId)
            val rows = listOf(row)
            val response = table.insert(rows)
            when {
                response.hasErrors() -> throw RuntimeException(
                    "Lagring i BigQuery feilet: '${response.insertErrors}'"
                )
            }
        }
    }
    
    fun <T> JsonNode.use(key: String, transform: JsonNode.() -> T): Pair<String, T?> = key to get(key)?.let {
    transform(it)
    }
    ````

=== "Go"
    Avhengigheter:
    ````
    go get "cloud.google.com/go/bigquery"
    go get "github.com/confluentinc/confluent-kafka-go/kafka"
    go get "google.golang.org/api/googleapi"
    ````

    Kode:
    ````go
    package main

    import (
        "context"
        "encoding/json"
        "fmt"
        "os"

        "cloud.google.com/go/bigquery"
        "github.com/confluentinc/confluent-kafka-go/kafka"
        "golang.org/x/xerrors"
        "google.golang.org/api/googleapi"
    )

    type mesg struct {
        StringValue    string `json:"stringValue"`
        BooleanValue   bool   `json:"booleanValue"`
        NumericValue   int    `json:"numericValue"`
        TimestampValue string `json:"timestampValue"`
    }

    const (
        kafkaBroker = "BROKER" // erstatt med kafka broker
        topicName   = "TOPIC" // erstatt med navn på topic

        projectID = "PROJECT" // erstatt med prosjekt id
        datasetID = "DATASET" // erstatt med dataset id
        tableName = "TABLE" // erstatt med navn på tabell
    )

    func main() {
        ctx := context.Background()
        consumer, err := createKafkaConsumer()
        if err != nil {
            panic(err)
        }
        defer consumer.Close()

        bqClient, err := bigquery.NewClient(ctx, projectID)
        if err != nil {
            panic(err)
        }
        defer bqClient.Close()

        table, err := createTableIfNotExists(ctx, bqClient)
        if err != nil {
            panic(err)
        }
        inserter := table.Inserter()

        for {
            event := consumer.Poll(100)
            switch e := event.(type) {
            case *kafka.Message:
                data := mesg{}
                if err := json.Unmarshal(e.Value, &data); err != nil {
                    panic(err)
                }
                fmt.Println(data)
                if err := inserter.Put(ctx, data); err != nil {
                    panic(err)
                }
            case kafka.Error:
                fmt.Fprintf(os.Stderr, "%% Error: %v\n", e)
            default:
                continue
            }
        }
    }

    func createKafkaConsumer() (*kafka.Consumer, error) {
        consumer, err := kafka.NewConsumer(&kafka.ConfigMap{
            "bootstrap.servers": kafkaBroker,
            "group.id":          "mygroup",
            "auto.offset.reset": "earliest",
        })
        if err != nil {
            return nil, err
        }

        err = consumer.SubscribeTopics([]string{topicName}, nil)
        if err != nil {
            return nil, err
        }

        return consumer, nil
    }

    func createTableIfNotExists(ctx context.Context, bqClient *bigquery.Client) (*bigquery.Table, error) {
        schema := bigquery.Schema{
            {Name: "stringValue", Type: bigquery.StringFieldType},
            {Name: "booleanValue", Type: bigquery.BooleanFieldType},
            {Name: "numericValue", Type: bigquery.IntegerFieldType},
            {Name: "timestampValue", Type: bigquery.TimestampFieldType},
        }

        metadata := &bigquery.TableMetadata{
            Schema: schema,
        }

        tableRef := bqClient.Dataset(datasetID).Table(tableName)
        if err := tableRef.Create(ctx, metadata); err != nil {
            var e *googleapi.Error
            if ok := xerrors.As(err, &e); ok {
                if e.Code == 409 {
                    // already exists
                    return tableRef, nil
                }
            }
            return nil, err
        }

        return tableRef, nil
    }
    ````

## Naisjob

NAIS-plattformen tilbyr skedulering av workloads med deres [naisjob-ressurs](https://doc.nais.io/naisjob).

Denne ressurstypen er en abstraksjon på Kubernetes sin [Cronjob](https://kubernetes.io/docs/konsepter/workloads/controllers/cron-jobs/) som gir deg de samme konfigurasjonsmulighetene som man får med NAIS applikasjoner, eksempelvis muligheten til å provisjonere buckets, postgres/BigQuery og kafka-brukere, samt injeksjon av hemmeligheter i kjøremiljøet til jobben ved runtime.

### Bruksområde
Naisjob egner seg godt dersom du trenger å skedulere kjøring av kode, f.eks. periodisk oppdatering av [dataprodukter](../dataprodukt.md) eller [datafortellinger](../../analyse/datafortellinger.md).
