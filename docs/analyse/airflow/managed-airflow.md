---
title: Google managed Airflow (Cloud Composer)
---

> Cloud Composer is a managed Apache Airflow service that helps you create, schedule, monitor and manage workflows.
> Cloud Composer automation helps you create Airflow environments quickly and use Airflow-native tools, such as the powerful Airflow web interface and command line tools, so you can focus on your workflows and not your infrastructure.

Du finner den offisielle dokumentasjonen for Cloud Composer hos [cloud.google.com](https://cloud.google.com/composer/docs/concepts/overview).

## Opprett ny Composer instans
For å sette opp en ny Cloud Composer instans gjennom Google Cloud Platform konsollen (GCP),
gå til [Cloud Composer](https://console.cloud.google.com/composer), trykk `CREATE` og velg `Composer 2`

Følgende må spesifiseres

1. `Name` - navn på Cloud Composer instansen
2. `Location` - regionen hvor instansen settes opp (må velge Europa)
3. Trykk `CREATE`

!!! info "Når man setter opp Cloud Composer så opprettes det automatisk en [bucket](https://cloud.google.com/storage/docs/introduction) som er knyttet til Composer instansen. Før neste steg er det viktig å notere seg navnet på bucketen som blir opprettet. Det gjøres ved å gå til [Cloud Storage](https://console.cloud.google.com/storage) i konsollen og finne bucketen som har `goog-composer-environment` labels."

## Github repo for DAGS
I bucketen som opprettes når man setter opp Cloud Composer i [Opprett ny composer instans](cloud-composer#opprett-ny-composer-instans) blir det automatisk laget en katalog som heter `dags`.
Denne katalogen inneholder beskrivelsene av datapipelinene (DAGs) som man kan orkestrere med Cloud Composer og dette synkroniseres kontinuerlig med instansen.

### Github synk mot Composer bucket
For å ha revisjonskontroll på disse pipelinebeskrivelsene lønner det seg å sette opp en synkronisering mot et Github repo.

#### Lag service account
1. Gå til [Google IAM](https://console.cloud.google.com/iam-admin/serviceaccounts)
og trykk på `CREATE SERVICE ACCOUNT`
2. Fyll in `Service account name` og en `Service account description`
4. Gi service accounten følgende rettigheter til bucketen opprettet i [Opprett ny composer instans](cloud-composer#opprett-ny-composer-instans):
    - `Storage Legacy Bucket Writer`
    - `Storage Object Admin`

!!! info "Merk deg eposten som den nyopprettede service accounten får."

#### Last ned service account nøkkel
1. Gå til [Google IAM](https://console.cloud.google.com/iam-admin/serviceaccounts)
2. Trykk på service accounten opprettet i [Lag service account](cloud-composer#lag-service-account)
3. Trykk på `KEYS`
4. Trykk `ADD KEY` -> `Create new key` -> `JSON`
5. Ta vare på nøkkelen som blir lastet ned

#### Lag et Github repo
1. Opprett github repo under navikt-organisasjonen (eller bruk et du har fra før)
2. Opprett følgende to secrets i Github repoet:
    - `Name` satt til _GCP_CREDENTIALS_ og `Value` til innholdet i JSON-nøkkelen lastet ned i [Last ned service account nøkkel](cloud-composer#last-ned-service-account-nøkkel)
    - `Name` satt til _PROJECT_ID_ og `Value` til ID-en GCP team-prosjektet (finnes [her](https://console.cloud.google.com/home/dashboard))

#### Oppsett av Github repo
1. Lag en katalog med navn `dags` i repoet
2. Lag filen .github/workflows/sync-gcs-bucket.yaml med innhold som følger

````
name: Sync DAG-bucket

on:
  push:
    branches:
      - main
    paths:
      - '.github/workflows/sync-gcs.yaml'
      - 'dags/**'

jobs:
  sync-gcs-bucket:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: "google-github-actions/auth@v1"
      with:
        credentials_json: "${{ secrets.GCP_CREDENTIALS }}"
    - name: "Set up Cloud SDK"
    - uses: google-github-actions/setup-gcloud@v1
    - name: "Specify GCP project"
      run: "gcloud config set project {{ secrets.PROJECT_ID }}"
    - name: "Sync DAGs to GCS bucket"
      run: gsutil cp -r dags gs://BUCKET
````

!!! info "Erstatt BUCKET i workflowen over med navnet på bucketen som ble opprettet i [Opprett ny composer instans](cloud-composer#opprett-ny-composer-instans)"


Ved push til main branch vil denne workflowen laste opp innholdet i `dags` katalogen i repoet til GCS bucketen 
som igjen blir synkronisert  med Cloud Composer instansen.
