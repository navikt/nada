---
title: Cloud Function
---

C
Cloud Functions is a lightweight compute solution for developers to create single-purpose, stand-alone functions that respond to Cloud events without the need to manage a server or runtime environment. Learn more

Følgende beskriver hvordan man kan automatisere skriving til Google BigQuery
ved hjelp av [Google Cloud Functions](https://developers.google.com/learn/topics/functions) og [Google Cloud Scheduler](https://cloud.google.com/scheduler).

Du finner den offisielle dokumentasjonen hos [cloud.google.com](https://cloud.google.com/functions/docs).

I denne guiden leser vi STYRK-koder (Standard for yrkesklassifisering) fra Statistisk sentralbyrå (SSB) sitt åpne API og oppretter en tabell i BigQuery med alle kodene.

## Sett opp Cloud Function
For å sette opp en Cloud Function gjennom Google Cloud Platform konsollet (GCP), går du først til [Cloud Functions](https://console.cloud.google.com/functions/) og så trykker `CREATE FUNCTION`.

Følgende må spesifiseres:
1. `Function name` - navn på funksjonen
2. `Region` - må være i Europa
4. `Trigger type` - settes til `HTTP`
5. `Authentication` - settes til `Require Authentication`
6. Huk av for `Require HTTPS`

Funksjoner i Cloud Functions er standard _timeout_ satt til ett minutt og allokert minne satt til 256 MB.
Har du andre behov kan det spesifiseres under `VARIABLES, NETWORKING AND ADVANCED SETTINGS`.
Dette kan maks økes til ni minutter og 4GiB.

:::info
Før man går videre er det lurt å notere seg URLen man skal gjøre et POST kall til for å trigge
funksjonen. Denne står under `Trigger`.
:::

Trykk til slutt `SAVE` og `NEXT`.

I neste steg spesifisere man hva slags kjøretidsmiljø man ønsker og koden som skal kjøre.
I vårt eksempel bruker vi Python 3.8.

````python
def write_styrk_to_bq(request):
    import requests
    import json
    from google.cloud import bigquery
    from google.cloud import storage

    # Hent styrk koder fra eksternt api
    res = requests.get("https://data.ssb.no/api/klass/v1/versions/33")
    res.raise_for_status()
    styrk_koder = res.json()["classificationItems"]

    # Må konvertere dict til newline delimited json format før innlasting til bigquery
    styrk_newline_delimited_json = ""
    for styrk_kode in styrk_koder:
        styrk_newline_delimited_json += json.dumps(styrk_kode) + "\n"

    # Skriv styrk koder til gcs bucket nada-analyse
    client = storage.Client()
    bucket = client.get_bucket("nada-analyse")
    blob = bucket.blob("arbeid/styrk.json")
    blob.upload_from_string(styrk_newline_delimited_json)

    # Lag/overskriv tabellen arbeid.styrk i bigquery med data fra arbeid/styrk.json blob i nada-analyse bucket
    bq_client = bigquery.Client()
    dataset_ref = bq_client.dataset("arbeid")
    table_ref = dataset_ref.table("styrk")
    job_config = bigquery.LoadJobConfig(
        schema=[
            bigquery.SchemaField("code", "STRING"),
            bigquery.SchemaField("parentCode", "STRING"),
            bigquery.SchemaField("level", "STRING"),
            bigquery.SchemaField("name", "STRING"),
            bigquery.SchemaField("shortName", "STRING"),
            bigquery.SchemaField("notes", "STRING"),
        ],
        write_disposition=bigquery.WriteDisposition.WRITE_TRUNCATE,
        source_format=bigquery.SourceFormat.NEWLINE_DELIMITED_JSON,
    )

    load_job = bq_client.load_table_from_uri("gs://nada-analyse/arbeid/styrk.json", table_ref, job_config=job_config)
    load_job.result()

    return "Great success!"
````

requirements.txt:
````python
requests==2.23.0
google-cloud-bigquery==2.1.0
google-cloud-storage==1.32.0
````

Trykk `deploy`

## Opprett cloud function invoker service account
En cloud scheduler jobb som skal trigge en cloud function må bruke en service account med
noen spesifikke rettigheter, for å opprette denne gjør som følger:

1. Gå til `IAM & Admin`
2. Opprett service account med rollene:
    - `Cloud Functions Invoker`
    - `Cloud Scheduler Admin`

:::info
Noter deg .iam.gserviceaccount.com eposten som service accounten får
:::

## Automatisere med cloud scheduler
For å automatisere en cloud function med cloud scheduler går man til `Cloud scheduler` i GCP
konsollen og trykker `CREATE JOB`.

Følgende må spesifiseres
1. `Name` for jobben
5. `Frequency` (cron streng)
6. `Timezone` settes til `Central European Standard Time (CET)`
7. `Target` til `HTTP`
8. `URL` settes til Trigger URLen til cloud function generert over
9. `HTTP method` settes til POST (default valgt)
10. Sett Auth header til `Add OIDC token` og lim inn serviceaccount eposten generert over i feltet `Service account`

:::info
Body spesifiseres dersom du skal sende en request body med POST kallet til funksjonen
:::

Trykk til slutt `CREATE`
