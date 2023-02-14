---
title: Knada airflow
---

[Apache Airflow](https://airflow.apache.org/docs/apache-airflow/stable/index.html) er et verktøy for å orkestrere,
skedulere og monitorere datapipelines. Web-grensesnittet til Airflow gir brukeren enkel tilgang til å lese logger fra
de ulike stegene i pipelinen, trigge datapipelines manuelt og sjekke statistikk på tidligere kjøringer.

En datapipeline i Airflow, eller DAG (Directed Acyclic Graph), er et sett med oppgaver man ønsker å kjøre som beskriver
rekkefølge og avhengigheter mellom oppgavene. Disse DAG-ene beskrives programmatisk i python filer og legges i et Github
repo som periodisk synkroniseres med Airflow instansen. Nedenfor ser du en en grafisk representasjon av flyten i en DAG:

![Flyten i en Airflow DAG](dag-eksempel.png)

NADA tilbyr team eller enkeltpersoner å sette opp airflow instanser i sine egne k8s namespacer via [knorten](https://knorten.knada.io).

For mer informasjon om Airflow, se [Airflow docs](https://airflow.apache.org/docs/apache-airflow/stable/index.html)

### Oppsett av repo for DAGs
For å bruke Knada airflow kreves det at det lages et github repo under `navikt` organisasjonen på Github som inneholder Python-filer med DAGer. 

En gang i minuttet vil DAGene som ligger i repoet bli synkronisert til Airflow instansen.

#### Eksempler på DAGs repoer
- [opendata-dags](https://github.com/navikt/opendata-dags) inneholder eksempler på DAGs.
- [sykefravar-dags](https://github.com/navikt/sykefravar-dags) inneholder en rekke eksempler på hvordan å ta i bruk ulike operators i Airflow.

## Dataverk-Airflow
[Dataverk-Airflow](https://github.com/navikt/dataverk-airflow) er et wrapperbibliotek som gjør det enklere å
bruke [KubernetesPodOperator](https://airflow.apache.org/docs/apache-airflow/stable/kubernetes.html) i KNADA clusteret.

Biblioteket inneholder wrapper-funksjoner for å kjøre Jupyter notebooks og Python scripts i separate Kubernetes podder. Se [README](https://github.com/navikt/dataverk-airflow/blob/master/README.md)
på repoet for eksempler.

## Trafikk fra airflow-workere
I knada-gke er airflow konfigurert til å bruke [Kubernetes Executor](https://airflow.apache.org/docs/apache-airflow/stable/core-concepts/executor/kubernetes.html). Dette innebærer at hver task i en airflow dag vil spinne opp og kjøre en egen worker i en separat [kubernetes pod](https://kubernetes.io/docs/concepts/workloads/pods/). Fra disse poddene vil i utgangspunktet all trafikk ut nektes, med unntak av følgende:

- github.com: workeren vil alltid trenge å hente repoet som koden ligger i
- storage.googleapis.com: workeren skriver airflow loggene til en google cloud storage bucket

Utover dette er man nødt til å eksplisitt spesifisere hvilke kilder man trenger å snakke med (gjelder både interne og eksterne addresser) for hver enkelt task i en DAG. Dette gjør man ved å legge på en `allowlist` annotasjon på pod ressursen med hostnavnet og porten på det man trenger å nå, som eksemplifisert under:

````python
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
````

Her er `allowlist` er en kommaseparert liste med hostnavn og port på formatet `hostnavn:port`. Dersom man ikke angir port vil det defaulte til `443`. Vi har en controller kjørende i clusteret som vil lage en nettverkspolicy som tillater trafikk ut fra podden som spinner opp til de hostene som legges til, som igjen vil fjernes når tasken er ferdig.
