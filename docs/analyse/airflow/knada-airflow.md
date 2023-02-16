---
title: KNADA airflow
---

[Apache Airflow](https://airflow.apache.org/docs/apache-airflow/stable/index.html) er et verktøy for å orkestrere,
skedulere og monitorere datapipelines.
Web-grensesnittet til Airflow gir brukeren enkel tilgang til å lese logger fra de ulike stegene i pipelinen, trigge datapipelines manuelt og sjekke statistikk på tidligere kjøringer.

En datapipeline i Airflow, eller DAG (Directed Acyclic Graph), er et sett med oppgaver man ønsker å kjøre som beskriver rekkefølge og avhengigheter mellom oppgavene.
Disse DAG-ene beskrives programmatisk i python filer og legges i et Github repo som periodisk synkroniseres med Airflow instansen.
Nedenfor ser du en en grafisk representasjon av flyten i en DAG:

![Flyten i en Airflow DAG](dag-eksempel.png)

NADA tilbyr team eller enkeltpersoner å sette opp Airflow instanser i KNADA gjennom [Knorten](https://knorten.knada.io).

For mer informasjon om Airflow, se [Airflow docs](https://airflow.apache.org/docs/apache-airflow/stable/index.html)

### Oppsett av repo for DAGs
For å bruke KNADA Airflow kreves det at det lages et Github repo under `navikt` organisasjonen på Github som inneholder Python-filer med DAGer. 

En gang i minuttet vil DAGene som ligger i repoet bli synkronisert til Airflow instansen.

#### Eksempler på DAGs repoer
- [nada-dags](https://github.com/navikt/nada-dags) NADA sin lekekasse for DAGs.
- [opendata-dags](https://github.com/navikt/opendata-dags) inneholder eksempler på DAGs.
- [sykefravar-dags](https://github.com/navikt/sykefravar-dags) inneholder en rekke eksempler på hvordan å ta i bruk ulike operators i Airflow.

## Dataverk-Airflow
[Dataverk-Airflow](https://github.com/navikt/dataverk-airflow) er et wrapperbibliotek som gjør det enklere å
bruke [KubernetesPodOperator](https://airflow.apache.org/docs/apache-airflow/stable/kubernetes.html) i KNADA.

Biblioteket inneholder wrapper-funksjoner for å kjøre Jupyter notebooks og Python scripts i egne Kubernetes poder. Se [README](https://github.com/navikt/dataverk-airflow/blob/master/README.md)
på repoet for eksempler.

## Trafikk fra Airflow-workere
I KNADA er Airflow konfigurert til å bruke [Kubernetes Executor](https://airflow.apache.org/docs/apache-airflow/stable/core-concepts/executor/kubernetes.html).
Dette innebærer at hver task i en Airflow DAG vil spinne opp og kjøre en egen worker i en separat [Kubernetes pod](https://kubernetes.io/docs/concepts/workloads/pods/).
Poder har i utgangspunktet all trafikk ut blokkert, med følgende unntak:

- github.com: workeren vil alltid trenge å hente repoet som koden ligger i
- storage.googleapis.com: workeren skriver Airflow loggene til en Google Cloud Storage bucket

Utover dette er man nødt til å eksplisitt spesifisere hvilke kilder man trenger å snakke med (gjelder både interne og eksterne addresser) for hver enkelt task i en DAG.
Dette gjør man ved å legge på en `allowlist` annotasjon på pod ressursen med hostnavnet og porten på det man trenger å nå.

```python
from airflow import DAG
from airflow.utils.dates import days_ago
from airflow.operators.python_operator import PythonOperator
from airflow.contrib.operators.slack_webhook_operator import SlackWebhookOperator
from kubernetes import client as k8s
import os
import logging

def myfunc():
    import requests
    res = requests.get("https://data.ssb.no")
    res.raise_for_status()

with DAG('min-dag', start_date=days_ago(1), schedule_interval=None) as dag:
    slack = SlackWebhookOperator(
        http_conn_id=None,
        task_id="slack-message",
        webhook_token=os.environ["SLACK_TOKEN"],
        message="start min-dag",
        channel="#minkanal",
        link_names=True,
        executor_config={
            "pod_override": k8s.V1Pod(
                metadata=k8s.V1ObjectMeta(annotations={"allowlist": "hooks.slack.com"})
            )
        }
    )

    run_this = PythonOperator(
        task_id='test',
        python_callable=myfunc,
        executor_config={
            "pod_override": k8s.V1Pod(
                metadata=k8s.V1ObjectMeta(annotations={"allowlist": "data.ssb.no,db.adeo.no:1521"})
            )
        },
    dag=dag)
    
    slack >> run_this
```

`allowlist` er en kommaseparert liste med hostnavn og port på formatet `hostnavn:port`.
Dersom man ikke angir port vil vi bruke `443` som standardport.
Vi har en controller kjørende i KNADA som vil lage en `NetworkPolicy` som tillater trafikk ut fra poden mot de hostene som legges til.
Når jobben er ferdig vil tilgangene bli fjernet.
