---
title: BigQuery - decorator
---
## Responses from "Fant du det du lette etter"
All responses are written to the bigquery table _dekoratoren.tilbakemeldinger_ in the _dataplattform_ project on GCP.

## Get access to data
Reach out in [#data-catalog-intern](https://nav-it.slack.com/archives/CQ9SV9DNE) if you want access to this data.

You will receive a service account key with read access to the bigquery data set which can used with a 
[klientbibliotek](https://cloud.google.com/bigquery/docs/reference/libraries) in the language you choose.

Below is an example in Python:
````python
import os
from google.cloud import bigquery

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "/sti/til/google/credentials.json"

bq_client = bigquery.Client()
result = bq_client.query("SELECT * FROM dekoratoren.tilbakemeldinger")

df = result.to_dataframe()
````
