## Federated Query
### Bruksområde
Federated Query brukes typisk til å lese data fra en postgres-database i GCP, transformere disse og skrive til BigQuery.

### Sett opp external connection
Følg [Google sin guide](https://cloud.google.com/bigquery/docs/cloud-sql-federated-queries#setting-up-cloud-sql-database-connections) til hvordan legge til en Cloud SQL databasekobling.

### Opprett eget datasett for dataproduktet
Følg [Google sin guide](https://cloud.google.com/bigquery/docs/datasets)
Foreløpig kan vi ikke gjenbruke datasett som har blitt opprettet av en nais-applikasjon, da denne overstyrer tilgangene vi oppretter senere i denne guiden.

###Lag en Google serviceaccount for federated query
Følg [Google sin guide](https://cloud.google.com/iam/docs/creating-managing-service-accounts).
Gi serviceaccounten følgende tilganger på prosjektnivå:

- BigQuery Connection User
- BigQuery Job User
- BigQuery Metadata Viewer

### Gi tilganger til serviceaccount på dataset
Følg [Google sin guide](https://cloud.google.com/bigquery/docs/dataset-access-controls)
Serviceaccounten trenger rollen "BigQuery Data Editor"

### Sett opp spørringen som henter data via external connection
Ved å f.eks. bruke [Google Cloud Console](https://console.cloud.google.com) kan vi lage en ny spørring.
Velg riktig prosjekt, gå inn på BigQuery og klikk "Compose New Query" til høyre.

Eksempelspørring:
```sql
SELECT * FROM EXTERNAL_QUERY(
'europe-north1.<connection_name>',
'''

-- Lag en variabel for varsjonering 
WITH constants (version) as (
values (now())
)

-- Legg inn rader fra Postgres-tabellen med et felt for version-variablen vi definerte over.
SELECT id::text, name, "group", pii, created, last_modified, "type"::text, version
FROM dataproducts,constants
''');
```

### Kjør spørring på tidsintervall
For å kjøre spørringen på intervall, så kan du i Query Explorer i Cloud Console velge å definere en "Schedule".

For å få lov til å sette opp eller oppdatere en schedule må din personlige bruker ha noen rettigheter også. Disse er for det meste dekket av Bigquery Admin, men hvis du setter opp jobben med en servicebruker (anbefalt) må du også ha tilgang til denne, for eksempel via en midlertidig Service Account Admin.

Klikk "Schedule" og "Create new schedule"

![Schedule knapp eksempel](scheduled.png)

```
name: et passende navn 
repeats: Det som passer produktet
dataset name: datasettet som ble laget tidligere i guiden
table name: navn på produkt-tabell
advanced options:
- service account: service account som ble laget tidligere i guiden
```



## Naisjob
NAIS-plattformen tilbyr skedulering av workloads med deres [naisjob-ressurs](https://doc.nais.io/naisjob).
Denne ressurstypen er en abstraksjon på Kubernetes sin [Cronjob](https://kubernetes.io/docs/konsepter/workloads/controllers/cron-jobs/) som gir deg de samme konfigurasjonsmulighetene som man får med NAIS applikasjoner, eksempelvis muligheten til å provisjonere buckets, postgres/BigQuery og kafka-brukere, samt injeksjon av hemmeligheter i kjøremiljøet til jobben ved runtime.

### Bruksområde
Naisjob egner seg godt dersom du trenger å skedulere kjøring av kode, f.eks. periodisk oppdatering av [dataprodukter](../dataprodukt.md) eller [datafortellinger](../../analyse/datafortellinger.md).

### Sette opp naisjob
Se [naisjob doc](https://doc.nais.io/naisjob/#naisjob) for doc på hvordan naisjobs settes opp.
