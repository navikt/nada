For brukere av Nada sine tjenester har vi lagd en oversikt over programmeringsspråk, rammeverk, og verktøy som man bør ha kjennskap til.
Denne oversikten er ikke ment som en uttømmende liste over hva du må kunne for å bruke våre tjenester.
Den er heller ment som en oversikt over hva som kan være nyttig for å bruke Nada sine tjenester effektivt og trygt.

## Programmeringsspråk
SQL brukes til å lage dataprodukter i BigQuery og til å analysere data enten i Metabase eller gjennom en Jupyter Notebook.

Nesten alle brukere av KNADA bruker [Python](https://www.python.org/) som sitt programmeringsspråk, men vi har også støtte for [R](https://www.r-project.org/).
Ellers bruker de fleste databasene man jobber med [SQL](https://en.wikipedia.org/wiki/SQL), dette inkluderer BigQuery, Oracle, og Postgres.

- Python
- R
- SQL

Vi anbefaler at du setter deg inn i SQL for å lage dataprodukter/analysere data i Metabase, og Python dersom du skal analysere data i Jupyter notebooks, eller Airflow.

## Rammeverk

- [Airflow](https://pypi.org/project/apache-airflow/)
    - [Dataverk Airflow](https://pypi.org/project/dataverk-airflow/)
- [Pandas](https://pypi.org/project/pandas/)
    - Pandas is a Python package that provides fast, flexible, and expressive data structures designed to make working with "relational" or "labeled" data both easy and intuitive.
- [Plotly](https://pypi.org/project/plotly/)
    - Bibliotek for å enkelt plotte diagrammer og grafer, mye brukt med [datafortellinger](/analyse/datafortellinger) via Quarto.
- [Quarto](/analyse/datafortellinger)
- [DBT](https://www.getdbt.com/)
    - Rammeverk for å gjøre ETL operasjoner.
- [Docker](https://friendly-disco-4bc2d71d.pages.github.io/teknisk/Docker.html)
    - Kan være nyttig når du trenger noe mer enn Knada tilbyr, for eksempel tredjepartsrammeverk som Plotly og Pandas.
- Pythonbiblioteker for å koble seg til din database (Oracle, Postgres, Redis)
- Pip for å installere tredjepartspakker for Python (https://pypi.org/project/pip/)

## IDE/verktøy

- [Datastream](/dataprodukter/dele/dataoverføring/#datastream)
  - Brukes for å enkelt og automatisk flytte data fra Postgres til BigQuery, kun støttet i GCP.
- [Naisjob](/dataprodukter/dele/dataoverføring/#naisjob)
  - NAIS-plattformen tilbyr skedulering av workloads med deres Naisjob-ressurs.
- [Metabase](/analyse/metabase)
  - Brukes av både avanserte og mindre tekniske brukere for å analysere data registrert på Markedsplassen
- [Jupyter notebooks](/analyse/notebook/)
    - Notebooks er en interaktiv Python IDE i nettleseren din.
- [Knada VM](/analyse/knada-vm/)
    - Et alternativ til Jupyter notebooks som lar deg skrive Pythonkoden på din lokale maskin, og kjøre analysen i Knada.
- [Airflow](/analyse/airflow/knada-airflow)
    - Airflow er et verktøy for å orkestrere, skedulere og monitorere datapipelines.

- [Soda](/dataprodukter/kvalitetssikring/)
    - Rammeverk for å kontrollere datakvalitet
- Google integrasjoner og verktøy
    - [Gcloud CLI](https://cloud.google.com/sdk/docs)
        - For innlogging og administrasjon fra terminalen
    - [BigQuery](https://cloud.google.com/bigquery/docs)
    - [Google Secret Manager](https://cloud.google.com/secret-manager/docs)

## Oppsummering

Hvis du har lyst til å raskt komme i gang med

- å lage et dataprodukt så har vi flere [oppskrifter](/dataprodukter/) basert på hvor datakilden er.
- utforskende analyse av dine on-prem datakilder, så anbefaler vi at du starter med en [Jupyter notebook](/analyse/notebook/knada-notebook) i Knada.
- utforskende analyse av data i skyen, så anbefaler vi [Managed notebook](/analyse/notebook/managed-notebook) i GCP.
- utforskende analyse av data i skyen når du *ikke kan python*, så anbefaler vi [Metabase](/analyse/metabase)
- dele tilgangsstyrte eller åpne dashboard med interaktivitet, så anbefaler vi [Metabase](/analyse/metabase).
- dele analyserapporter så bør du starte med [Quarto](/analyse/datafortellinger/), og publisere den på Datamarkedsplassen.
