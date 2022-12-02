### Lese fra BigQuery

For å lese en tabell fra et dataprodukt må enten din private bruker eller en service account gis tilgang [gjennom markedsplassen](./tilgang.md#søke-tilgang). I tillegg må brukeren du leser med ha rollen [BigQuery User](https://cloud.google.com/bigquery/docs/access-control#bigquery.user) i prosjektet som skal ta kostnaden for spørringen din. _Merk: den trenger ikke ha denne rollen i prosjektet hvor dataene du ønsker å lese ligger._

#### Eksempelkode
Kodeeksempelet under forutsetter at følgende python pakker er installert i miljøet du jobber:

- google-cloud-bigquery
- db-dtypes
- pandas

````python
import pandas as pd
from google.cloud.bigquery import Client

PROJECT_ID = "" # prosjekt id for prosjektet som skal belastes for spørringen din
TABLE_URI = "" # full uri for tabellen du skal lese, på formatet prosjekt.datasett.tabell

client = Client(project=PROJECT_ID)

job = client.query(f"SELECT * FROM `{TABLE_URI}`")
df = job.to_dataframe()
df.head()
````
