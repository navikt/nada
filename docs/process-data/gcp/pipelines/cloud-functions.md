---
title: Cloud Function
---

> [Cloud Functions](https://developers.google.com/learn/topics/functions) is a lightweight compute solution for developers to create single-purpose, stand-alone functions that respond to Cloud events without the need to manage a server or runtime environment. Learn more

You can find the official documentation for Cloud Functions at [cloud.google.com](https://cloud.google.com/functions/docs). 

For convenience, we have created a simple example on how to read a source and write to [BigQuery] (https://cloud.google.com/bigquery/docs) using Cloud Functions

## Example
In this guide we read STYRK codes (Classification of occupations) from Statistics Norway (SSB) and create a table in BigQuery with all the codes. 

### Create a Cloud Function
In order to set up a Cloud Function in the Google Cloud Platform console, go to [Cloud Functions](https://console.cloud.google.com/functions/) and press `CREATE FUNCTION`.

The following must be specified:
1. `Function name`
2. `Region` - Europe is required
4. `Trigger type` - set to `HTTP`
5. `Authentication` - set to `Require Authentication`
6. Enable `Require HTTPS`

Cloud Functions have a standard _timeout_ set to one minute and memory limit set to 256 MB. This can be edited under  
`VARIABLES, NETWORKING AND ADVANCED SETTINGS`. Maximum limits are nine minutes and 4 GiB.

:::info
Before advancing to the next step you should note the trigger URL which is shown under `Trigger`.  
:::

Finally press `SAVE` and `NEXT`.

In the next step you must specify the environment, in our example we use Python 3.8.

````python
def write_styrk_to_bq(request):
    import requests
    import json
    from google.cloud import bigquery
    from google.cloud import storage

    # Fetch STYRK codes from external API
    res = requests.get("https://data.ssb.no/api/klass/v1/versions/33")
    res.raise_for_status()
    styrk_koder = res.json()["classificationItems"]

    # Must convert dict to newline delimited json format before loading
    styrk_newline_delimited_json = ""
    for styrk_kode in styrk_koder:
        styrk_newline_delimited_json += json.dumps(styrk_kode) + "\n"

    # Write STYRK codes to gcs bucket nada-analyse
    client = storage.Client()
    bucket = client.get_bucket("nada-analyse")
    blob = bucket.blob("arbeid/styrk.json")
    blob.upload_from_string(styrk_newline_delimited_json)

    # Create/overwrite table arbeid.styrk in bigquery with data from the arbeid/styrk.json blob in nada-analyse bucket
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

Press `deploy`.

### Test the function

You can test your Cloud Function by expanding the action drop down menu and choosing `Test Function` as shown below.

![Test yout fnnction with Test Function](/img/qs-python-test-function.png)

## Schedule with Cloud Scheduler

If you want your Cloud Function to be triggered periodically, see [Cloud Scheduler](cloud-scheduler).
