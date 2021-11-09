# Bruk av federated queries og automatiske spørringer

## Sett opp external connection
Lag en ny PostgreSQL bruker og gi den tilgang til databasen:

```sql
GRANT ALL PRIVILEGES ON TABLE dataproducts TO "<username>";
```

Følg [Google sin guide](https://cloud.google.com/bigquery/docs/cloud-sql-federated-queries#setting-up-cloud-sql-database-connections) til hvordan legge til en Cloud SQL database kobling.

## Lag en bigquery tabell for produktet
Lag en ny tabell for lagring av versjonert data for produktet. Eksempelet under passer til spørringen i neste seksjon:
```sql
CREATE TABLE IF NOT EXISTS nada-dev-db2e.demo.dataproducts (
  id	STRING,
  name	STRING,
  `group`	STRING,
  pii	BOOLEAN,
  created	TIMESTAMP,
  last_modified	TIMESTAMP,
  type	STRING
);
```

## Kopier data til en BigQuery

Ved å f.eks. bruke [Google Cloud Console](https://console.cloud.google.com) kan vi lage en ny spørring.
Velg riktig prosjekt, gå inn på BigQuery og klikk "Compose New Query" til høyre.

Eksempelspørring:

```sql
-- Lag en variabel for versjonering
DECLARE version DEFAULT FORMAT_DATETIME("%F %X", CURRENT_DATETIME());

-- Legg inn rader fra PostgreSQL som nye rader i BigQuery tabellen, med et felt for `version` variabelen vi definerte i starten.
INSERT INTO nada-dev-db2e.demo.dataproducts
SELECT *, version
FROM EXTERNAL_QUERY(
  'europe-north1.bq-nada-backend',
  '''SELECT id::text, name, "group", pii, created, last_modified, "type"::text
  FROM dataproducts''');
```

## Kjør spørring på tidsintervall
### Lag en service account for kjøring av spørringen

For å kjøre spørringen på intervall, så kan du i Query Explorer i Cloud Console velge å definere en "Schedule".

![Schedule knapp eksempel](scheduled.png)

Klikk "Schedule" og "Create new schedule", fyll inn data og vær obs på å sette "Processing location" i bunn til "Finland (europe-north1)".
