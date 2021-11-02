---
title: Cloud Composer
---

> Cloud Composer is a managed Apache Airflow service that helps you create, schedule, 
monitor and manage workflows. Cloud Composer automation helps you create Airflow environments quickly and use 
Airflow-native tools, such as the powerful Airflow web interface and command line tools, so you can focus on your 
workflows and not your infrastructure.

Du finner den offisielle dokumentasjonen for Cloud Composer hos [cloud.google.com](https://cloud.google.com/composer/docs/concepts/overview).

## Opprett ny composer instans
For å sette opp en ny Cloud Composer instans gjennom Google Cloud Platform konsollen (GCP), 
går du først til [Cloud Composer](https://console.cloud.google.com/composer) og trykker `CREATE`

Følgende må spesifiseres
1. `Name` - navn på Cloud Composer instansen
2. `Location` - regionen hvor instansen settes opp (må velge Europa)
3. Trykk `CREATE`

:::info
Når man setter opp Cloud Composer så opprettes det automatisk en [bucket](https://cloud.google.com/storage/docs/introduction)
som er knyttet til Composer instansen.
Før neste steg er det viktig å notere seg navnet på bucketen som blir opprettet. Det gjøres ved å gå til 
[Cloud Storage](https://console.cloud.google.com/storage) i konsollen og finne bucketen som har `goog-composer-environment` labels.
:::


## Oppsett av github repo for DAGS
I bucketen som opprettes når man setter opp Cloud Composer i [Opprett ny composer instans](cloud-composer#opprett-ny-composer-instans) 
blir det automatisk laget en mappe som heter `dags`. Denne mappen inneholder beskrivelsene av datapipelinene (DAGs) som man kan 
orkestrere med Cloud Composer og dette synkroniseres kontinuerlig med instansen.


For å ha revisjonskontroll på disse pipelinebeskrivelsene lønner det seg å sette opp en synkronisering mot et github repo. Under
følger en oppskrift for dette.


### Lag service account
1. Gå til [Google IAM](https://console.cloud.google.com/iam-admin/serviceaccounts)
og trykk på `CREATE SERVICE ACCOUNT`
2. Fyll in `Service account name` og en `Service account description`
4. Gi service accounten følgende rettigheter til bucketen opprettet i [Opprett ny composer instans](cloud-composer#opprett-ny-composer-instans):
    - `Storage Legacy Bucket Writer`
    - `Storage Object Admin`

:::info
Merk deg eposten som den nyopprettede service accounten får
:::

### Last ned service account nøkkel
1. Gå til [Google IAM](https://console.cloud.google.com/iam-admin/serviceaccounts)
2. Trykk på service accounten opprettet i [Lag service account](cloud-composer#lag-service-account)
3. Trykk på `KEYS`
4. Trykk `ADD KEY` -> `Create new key` -> `JSON`
5. Ta vare på nøkkelen som blir lastet ned

### Lag repo
1. Opprett github repo under navikt-organisasjonen
2. Opprett følgende to secrets i github repoet:
    - `Name` satt til GCS_CREDS og `Value` til innholdet i JSON-nøkkelen lastet ned i [Last ned service account nøkkel](cloud-composer#last-ned-service-account-nøkkel)
    - `Name` satt til PROJECT_ID og `Value` til GCP prosjektets id (finnes [her](https://console.cloud.google.com/home/dashboard))

### Oppsett av repo
1. Lag en mappe med navn `dags` i repoet
2. Lag filen .github/workflows/sync-gcs-bucket.yaml med innhold som følger

````
name: Sync-GCS-bucket

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
    - uses: actions/checkout@v2
    - uses: GoogleCloudPlatform/github-actions/setup-gcloud@master
      with:
        service_account_key: ${{ secrets.GCS_CREDS }}
        project_id: ${{ secrets.PROJECT_ID }}
        export_default_credentials: true
    - name: Sync dags to gcs bucket
      run: gsutil cp -r dags gs://BUCKET
````

:::info
Erstatt BUCKET i workflowen over med navnet på bucketen som ble opprettet i 
[Opprett ny composer instans](cloud-composer#opprett-ny-composer-instans)
:::

Ved push til main branch vil denne workflowen laste opp innholdet i `dags` mappen i repoet til gcs bucketen 
som igjen synkroniseres med Cloud Composer instansen.

## Legg til DAGs
Nå er man klar til å begynne å legge til DAGs. Eksempler på dags finnes i repoet 
[navikt/composer-dags](https://github.com/navikt/composer-dags)

## Synkronisere requirements.txt i repo mot cloud composer miljø
1. Legg en `requirements.txt` fil i repoet
2. Lag filen `.github/workflows/update-requirements.yaml` med innhold som følger

````
name: Update-composer-dependencies

on:
  push:
    branches:
      - main
    paths:
      - 'requirements.txt'
      - '.github/workflows/update-requirements.yaml'

jobs:
  update-composer-requirements:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: GoogleCloudPlatform/github-actions/setup-gcloud@master
      with:
        service_account_key: ${{ secrets.GCS_CREDS }}
        project_id: ${{ secrets.PROJECT_NAME }}
        export_default_credentials: true
    - name: Update requirements.txt
      continue-on-error: true
      run: |
        gcloud composer environments update COMPOSER_INSTANS --update-pypi-packages-from-file requirements.txt --location LOCATION --project ${GCLOUD_PROJECT}
````

Erstatt `COMPOSER_INSTANS` med navnet på composer instansen din og `LOCATION` med 
navnet på lokasjonen composeren kjører. Begge disse verdiene finner du 
[her](https://console.cloud.google.com/composer/environments).
