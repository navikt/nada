Som en bruker av Nada sine tjenester har vi lagd en oversikt over programmeringsspråk, rammeverk, og verktøy som man bør ha kjennskap til.
Denne oversikten er ikke ment som en uttømmende liste over hva du må kunne for å bruke våre tjenester.
Den er heller ment som en oversikt over hva som kan være nyttig for å bruke Nada sine tjenester effektivt og trygt.

## Programmeringsspråk

Nesten alle brukere av KNADA bruker [Python](https://www.python.org/) som sitt programmeringsspråk, men vi har også støtte for [R](https://www.r-project.org/).
Ellers bruker de fleste databasene man jobber med [SQL](https://en.wikipedia.org/wiki/SQL), dette inkluderer BigQuery, Oracle, og Postgres.

- Python
- SQL
- R

Vi anbefaler at du setter deg inn i både Python og SQL.

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

## IDE/verktøy

- [Datastream](/dataprodukter/dele/dataoverføring/#datastream)
    - Brukes for å enkelt og automatisk flytte data fra Postgres til BigQuery, kun støttet i GCP.
- [Jupyter notebooks](/analyse/notebook/)
    - Notebooks er en interaktiv Python IDE i nettleseren din.
- [Knada VM](/analyse/knada-vm/)
    - Et alternativ til Jupyter notebooks som lar deg skrive Pythonkoden på din lokale maskin, og kjøre analysen i Knada.
- [Airflow](/analyse/airflow/knada-airflow)
    - Airflow er et verktøy for å orkestrere, skedulere og monitorere datapipelines.
- [Naisjob](/dataprodukter/dele/dataoverføring/#naisjob)
    - NAIS-plattformen tilbyr skedulering av workloads med deres Naisjob-ressurs.
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
- å lage en datafortelling så bør du starte med [Quarto](/analyse/datafortellinger/), og publisere den på Datamarkedsplassen.
- utforskende analyse av dine on-prem datakilder, så anbefaler vi at du starter med en [Jupyter notebook](/analyse/notebook/knada-notebook) i Knada.
- utforskende analyse av dine datakilder i skyen, så anbefaler vi [Managed notebook](/analyse/notebook/managed-notebook) i GCP.
- flytte data fra Postgres i GCP til BigQuery, så anbefaler vi deg å se på [Datastream](/dataprodukter/dele/dataoverføring#datastream).
