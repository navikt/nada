# Kodeeksempler

## Python

### Cloud SQL IAM Database authentication
For å slippe å opprette og bruke [builtin users](https://cloud.google.com/sql/docs/postgres/create-manage-users) i sql databaser på GCP bør man i stedet bruke [Cloud SQL IAM database authentication](https://cloud.google.com/sql/docs/postgres/authentication) når man skal koble seg til Cloud SQL databaser for analyse. Da vil man unngå å måtte lese inn passordet for brukeren fra hemmelighet i koden.

Eksemplene som følger forutsetter:

- At følgende python biblioteker er installert:
    ````
    cloud-sql-python-connector
    pandas
    pg8000
    sqlalchemy
    ````

- At den personlige brukeren eller IAM service accounten har rollene `Cloud SQL Instance User` og `Cloud SQL Client` i GCP prosjektet som eier database instansen du skal koble deg mot. Dette er prosjektnivå roller du gir gjennom [IAM](https://console.cloud.google.com/iam-admin/iam) i GCP prosjektet.

- At den personlige brukeren eller IAM service accounten er lagt til som en `Cloud IAM` bruker på database instansen. Se [her](https://cloud.google.com/sql/docs/postgres/add-manage-iam-users#creating-a-database-user) for hvordan å legge til dette.

- Enten manuelt eller med databasemigrasjon må man gi brukeren/service accounten tilgang til å lese fra tabellene i databasen.
    - For å gi tilgang til personlige brukere:
        ````sql
        GRANT SELECT ON ALL TABLES IN SCHEMA public to cloudsqliamuser;
        ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO cloudsqliamuser;
        ````
    - For å gi tilgang til IAM service accounter:
        ````sql
        GRANT SELECT ON ALL TABLES IN SCHEMA public to cloudsqliamserviceaccount;
        ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO cloudsqliamserviceaccount;
        ````    

#### Lese med personlig bruker
Hvis du ikke har gjort det i dag, kjør først kommandoen `gcloud auth login --update-adc`
````python
import os

from google.cloud.sql.connector import Connector
import pg8000
import pandas as pd
import sqlalchemy

instance_connection_name = "prosjektID:region:instans" # Erstatt med database instansen du skal koble deg til
db_iam_user = "epost@nav.no" # Erstatt med din nav epost
db_name = "navn" # Erstatt med navn på databasen

connector = Connector()

def getconn() -> pg8000.dbapi.Connection:
    conn: pg8000.dbapi.Connection = connector.connect(
        instance_connection_name,
        "pg8000",
        user=db_iam_user,
        db=db_name,
        enable_iam_auth=True,
    )
    return conn

engine = sqlalchemy.create_engine(
    "postgresql+pg8000://",
    creator=getconn)

query = "SELECT * FROM table"
df = pd.read_sql_query(query, engine)
````

#### Lese med service account
Dette eksempelet er ment for airflow tasks i KNADA og _**vil ikke fungere**_ fra notebooks da disse ikke har en binding mot en IAM service account. For notebooks i KNADA, se [Lese med personlig bruker](#lese-med-personlig-bruker).

````python
import os

from google.cloud.sql.connector import Connector
import pg8000
import pandas as pd
import sqlalchemy

instance_connection_name = "prosjektID:region:instans" # Erstatt med database instansen du skal koble deg til
db_iam_user = "sa@prosjekt.iam" # Merk: Brukernavnet her skal settes til service account eposten uten .gserviceaccount.com. Altså er service account eposten din mitt-team@knada-gcp.iam.gserviceaccount.com så blir brukernavnet mitt-team@knada-gcp.iam
db_name = "database" # Erstatt med databasenavn

connector = Connector()

def getconn() -> pg8000.dbapi.Connection:
    conn: pg8000.dbapi.Connection = connector.connect(
        instance_connection_name,
        "pg8000",
        user=db_iam_user,
        db=db_name,
        enable_iam_auth=True,
    )
    return conn

engine = sqlalchemy.create_engine(
    "postgresql+pg8000://",
    creator=getconn)

query = "SELECT * FROM table"
df = pd.read_sql_query(query, engine)
````

## R

### Lese fra Google Cloud Storage bucket
1. Autentiser deg med `gcloud auth login --update-adc`
2. Installer følgende pakker
````R
install.packages("googleCloudStorageR")
install.packages("gargle")
````
3. Les fra bucket
````R
library(googleCloudStorageR)
library(gargle)

scope <-c("https://www.googleapis.com/auth/cloud-platform")
token <- token_fetch(scopes = scope)

gcs_auth(token = token)

gcs_global_bucket("my-bucket")
obj <- gcs_get_object("file.txt")
````
