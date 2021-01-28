# Svar fra "Fant du det du lette etter"
Alle svar skrives til bigquery tabellen _dekoratoren.tilbakemeldinger_ i _dataplattform_ prosjektet på GCP.

## Få tilgang til data
Ønsker du å lese disse dataene kan du melde behovet i [#data-catalog-intern](https://nav-it.slack.com/archives/CQ9SV9DNE).


Du vil få en serviceaccount nøkkel med tilgang til bigquery datasettet og kan da videre bruke
et [klientbibliotek](https://cloud.google.com/bigquery/docs/reference/libraries) i det språket man selv ønsker.
Under følger et eksempel i python:
````python
import os
from google.cloud import bigquery

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "/sti/til/google/credentials.json"

bq_client = bigquery.Client()
result = bq_client.query("SELECT * FROM dekoratoren.tilbakemeldinger")

df = result.to_dataframe()
````
