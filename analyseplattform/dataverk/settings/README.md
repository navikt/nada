# Settingsfil for dataverk

Dataverk krever en settings.json fil hvor man angir konfigurerbare innstillinger som vil variere fra
bruker til bruker. I denne filen kan man spesifisere kildene man ønsker å lese data fra, 
og datalageret samt elastic search indeksen man ønsker å publisere datapakker til.

## Eksempel
````python
{
  "index_connections": {
    "elastic_host": "${ELASTIC_HOST}",
    "index": "${ES_INDEX}"
  },

  "db_connection_strings": {
    "oracle_database": "${ORACLE_CONNECTION_STRING}",
    "postgres_database": "${POSTGRES_CONNECTION_STRING}"
  }
}
````
Eksemplet over tar utgangspunkt i at man jobber fra en jupyter notebook server på nais plattformen
med vault integrasjon satt opp for kubernetes namespacet.

Hvis du har lagt inn følgende hemmeligheter i vault
````bash
ELASTIC_HOST="https://min-elastic-search-host.no"
ELASTIC_INDEX="index"
ORACLE_CONNECTION_STRING="oracle://user:pass@host:port/db"
POSTGRES_CONNECTION_STRING="postgres://user:pass@host:port/db"
````
vil disse verdiene bli hentet og erstatte placeholderne ved runtime når dataverk 
parser settings.json filen. Se [kubeflow getting started](kubeflow/getting_started.md) for å komme i gang med kubeflow.

Dersom man bruker dataverk utenfor et jupyter notebook miljø på nais og ikke har satt 
opp vault integrasjonen selv må hemmeligheter legges inn i settings.json filen direkte.

## Fullstendig eksempel
Under følger et eksempel med alle de mulige konfigurasjonene man per nå kan spesifisere i settings.json.
````python
{
  "index_connections": {
    "elastic_host": "${ELASTIC_HOST}",
    "index": "${ES_INDEX}"
  },

  "db_connection_strings": {
    "oracle_database": "${ORACLE_CONNECTION_STRING}",
    "postgres_database": "${POSTGRES_CONNECTION_STRING}"
  },
  
  "bucket_storage": {
    "gcs": {
      "credentials": "${GOOGLE_APPLICATION_CREDENTIALS}"
    }
  },
  
  "kafka": {
    "brokers": ["${KAFKA_BROKER1}",
                "${KAFKA_BROKER2}",
                "${KAFKA_BROKER3}"],
    "group_id": "my_group",
    "security_protocol": "SASL_SSL",
    "sasl_mechanism": "PLAIN",
    "sasl_plain_username": "${SASL_USERNAME}",
    "sasl_plain_password": "${SASL_PASSWORD}",
    "schema_registry": "${SCHEMA_REGISTRY_ADDRESS}",
    "ssl_cafile": "${CA_FILE_PATH}"
  }
}
````

### Feltdefinisjoner
- **index_connections**:
  - datatype: dict
  - definisjon: Konfigurasjon for elastic search index
  - felter:
    - elastic_host:
        - datatype: string
        - definisjon: Hostadresse til elastic search
    - index:
        - datatype: string
        - definisjon: Navn på elastic search index
- **db_connection_strings**:
  - datatype: dict
  - definisjon: Valgfritt antall connection strings for databasetilkoblinger
- **bucket_storage**:
  - datatype: dict
  - definisjon: Innstillinger for bucket storage kilder
  - felter:
    - gcs
        - datatype: dict
        - definisjon: Tilkoblingsinnstillinger for google cloud storage
        - felter:
            - credentials:
                - datatype: string/dict
                - definisjon: Google client credential objekt. Kan angis som enten en sti til 
                en .json fil, som en json-streng eller som en python dict.
- **kafka**:
  - datatype: Dict
  - definisjon: 
  - felter:
    - brokers
        - datatype: list
        - definisjon: Liste over kafka brokers
    - group_id
        - datatype: string
        - definisjon: Kafka consumer group id
    - security_protocol:
        - datatype: string
        - definisjon: Sikkerhetsprotokoll
    - sasl_mechanism:
        - datatype: string
        - definisjon: Autentiseringsmekanisme for kafka
    - sasl_plain_username: 
        - datatype: string
        - definisjon: Brukernavn for autentisering
    - sasl_plain_password:
        - datatype: string
        - definisjon: Passord for autentisering   
    - schema_registry:
        - datatype: string
        - definisjon: Adresse til skjemaregister 
    - ssl_cafile:
        - datatype: string
        - definisjon: Sti til ca-bundle i containermiljø

## Referanser til settings fil i kode
Databasetilkoblingene som spesifiseres i settings.json må eksplisitt refereres til i koden når de
skal benyttes.

### Eksempel
settings.json:
````python
{
  "db_connection_strings": {
    "oracle_database": "${ORACLE_CONNECTION_STRING}"
  }
}
````
kode:
````python
from dataverk import Client
dv = Client()

df = dv.read_sql("oracle_database", "SELECT * FROM some.table")
````