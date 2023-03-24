---
title: KNADA airflow
---

[Apache Airflow](https://airflow.apache.org/docs/apache-airflow/stable/index.html) er et verktøy for å orkestrere,
skedulere og monitorere datapipelines.
Web-grensesnittet til Airflow gir brukeren enkel tilgang til å lese logger fra de ulike stegene i pipelinen, trigge datapipelines manuelt og sjekke statistikk på tidligere kjøringer.

En datapipeline i Airflow, eller DAG (Directed Acyclic Graph), er et sett med oppgaver man ønsker å kjøre som beskriver rekkefølge og avhengigheter mellom oppgavene.
Disse DAG-ene beskrives programmatisk i python filer og legges i et Github repo som periodisk synkroniseres med Airflow instansen.
Nedenfor ser du en en grafisk representasjon av flyten i en DAG:

````mermaid
flowchart LR
    A(email_start) --> C(waiting_1)
    B(slack_start) --> C(waiting_1)
    C --> D(fetch_styrk)
    C --> E(fetch_nace)
    C --> F(fetch_pam)
    D --> G(waiting_2)
    E --> G(waiting_2)
    F --> G(waiting_2)
    G --> H(transform_styrk)
    G --> I(transform_nace)
    G --> J(transform_pam)
    H --> K(waiting_3)
    I --> K(waiting_3)
    J --> K(waiting_3)
    K --> L(slack_success)
    K --> M(email_success)
````

NADA tilbyr team eller enkeltpersoner å sette opp Airflow instanser i KNADA gjennom [Knorten](https://knorten.knada.io).

For mer informasjon om Airflow, se [Airflow docs](https://airflow.apache.org/docs/apache-airflow/stable/index.html)

### Oppsett av repo for DAGs
For å bruke KNADA Airflow kreves det at det lages et Github repo under `navikt` organisasjonen på Github som inneholder Python-filer med DAGer. 

En gang i minuttet vil DAGene som ligger i repoet bli synkronisert til Airflow instansen.

#### Eksempler på DAGs repoer
- [nada-dags](https://github.com/navikt/nada-dags) NADA sin lekekasse for DAGs.
- [opendata-dags](https://github.com/navikt/opendata-dags) inneholder eksempler på DAGs.
- [sykefravar-dags](https://github.com/navikt/sykefravar-dags) inneholder en rekke eksempler på hvordan å ta i bruk ulike operators i Airflow.

## Konfigurasjon av Airflow-workere
I KNADA er Airflow konfigurert til å bruke [Kubernetes Executor](https://airflow.apache.org/docs/apache-airflow/stable/core-concepts/executor/kubernetes.html).
Dette innebærer at hver task i en Airflow DAG vil spinne opp og kjøre en egen worker i en separat [Kubernetes pod](https://kubernetes.io/docs/concepts/workloads/pods/). Det gjør at man står fritt til å selv spesifisere miljøet til Airflow-workeren. Se [Image for Airflow-workere](#image-for-airflow-workere), [Ressursbehov for Airflow-workere](#ressursbehov-for-airflow-workere) og [Trafikk fra Airflow-workere](#trafikk-fra-airflow-workere) for eksempler på hvordan å overstyre standard instillingene som Airflow workeren vil kjøre med.

!!! info "Merk: Hovedcontaineren som worker-poden bruker vil alltid hete `base`, så dersom en ønsker å overskrive noe som gjelder spesifikt for denne containeren må man referere til den med navn som i eksemplene under."

### Image for Airflow-workere
Som standard vil airflow workere kjøre med et [dockerimage](https://github.com/navikt/knada-images/pkgs/container/knada-airflow-base) som bygges av NADA. Dette imaget inneholder drivere for oracle, postgres og TDV, men inneholder __**ikke et stort utvalg av python biblioteker**__. Dersom du har spesifikke behov for biblioteker som ikke er en del av dette imaget er det beste om du bygger et eget image som tar utgangspunkt i vårt. Se [bygge eget worker image](#bygge-eget-worker-image) for guide på hvordan å dette kan gjøres. Under følger et eksempel på hvordan å overstyre imaget som hovedcontaineren til Airflow workeren skal bruke:

```python
from airflow import DAG
from airflow.utils.dates import days_ago
from airflow.operators.python_operator import PythonOperator
from kubernetes import client as k8s

def myfunc():
    print("kjør task")

with DAG('min-dag', start_date=days_ago(1), schedule_interval=None) as dag:
    run_this = PythonOperator(
        task_id='test',
        python_callable=myfunc,
        executor_config={
           "pod_override": k8s.V1Pod(
               spec=k8s.V1PodSpec(
                   containers=[
                      k8s.V1Container(
                         name="base",
                         image="ghcr.io/navikt/mitt-airflow-image:v1"
                      )
                   ]
               )
           )
        },
        dag=dag
    )
```

### Ressursbehov for Airflow-workere
Dersom en ikke spesifiserer ressursbehov for Airflow taskene sine vil de kjøre med standard instillinger som er `512 MB` minne og `0.5` vCPU. Dette kan man enkelt overstyre for alle operators gitt at de tar utgangspunkt i [BaseOperatoren](https://airflow.apache.org/docs/apache-airflow/stable/_api/airflow/models/baseoperator/index.html#airflow.models.baseoperator.BaseOperator) til Airflow. Under følger et eksempel på hvordan ressursbehov for en task endres til `2GB` minne og `2` vCPU:

```python
from airflow import DAG
from airflow.utils.dates import days_ago
from airflow.operators.python_operator import PythonOperator
from kubernetes import client as k8s

def myfunc():
    print("kjør task")

with DAG('min-dag', start_date=days_ago(1), schedule_interval=None) as dag:
    run_this = PythonOperator(
        task_id='test',
        python_callable=myfunc,
        executor_config={
           "pod_override": k8s.V1Pod(
               spec=k8s.V1PodSpec(
                   containers=[
                      k8s.V1Container(
                         name="base",
                         resources={
                           "requests": {
                               "cpu": "2",
                               "memory": "2Gi"
                           }
                         }
                      )
                   ]
               )
           )
        },
        dag=dag
    )
```

### Trafikk fra Airflow-workere

!!! info "Det følgende er foreløpig en valgfri feature som må enables gjennom Knorten. Dersom det ikke gjøres er det ingen begrensninger på trafikk fra airflow workere"

I podene hvor airflow workeren kjører blokkeres i utgangspunktet all trafikk ut, med følgende unntak:

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
    res = requests.get("https://ssb.no/api")
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
                metadata=k8s.V1ObjectMeta(annotations={"allowlist": "ssb.no,db.adeo.no:1521"})
            )
        },
    dag=dag)
    
    slack >> run_this
```

`allowlist` er en kommaseparert liste med hostnavn og port på formatet `hostnavn:port`.
Dersom man ikke angir port vil vi bruke `443` som standardport.
Vi har en controller kjørende i KNADA som vil lage en `NetworkPolicy` som tillater trafikk ut fra poden mot de hostene som legges til.
Når jobben er ferdig vil tilgangene bli fjernet.

#### For KubernetesPodOperators laget med dataverk-airflow
Man kan også sette allowlist for KubernetesPodOperators som lages med `dataverk-airflow` som i eksempelet under.

```python
from airflow import DAG
from dataverk_airflow.knada_operators import create_knada_nb_pod_operator

with DAG('dag', start_date=days_ago(1), schedule_interval=None) as dag:
    task = create_knada_nb_pod_operator(dag=dag,
                                        name="knada-pod-operator",
                                        repo="navikt/repo",
                                        nb_path="notebooks/mynb.ipynb",
                                        retries=1,
                                        allowlist=["ssb.no", "db.adeo.no:1521"],
                                        branch="main")
```

## Airflow metrikker i Grafana

Nå kan man lage Grafana-dashboard i [grafana.nais.io](https://grafana.nais.io) med metrikker fra Airflow.
Airflow har egen [dokumentasjon](https://airflow.apache.org/docs/apache-airflow/stable/administration-and-deployment/logging-monitoring/metrics.html#counters) for hvilke metrikker som blir delt.
Metrikkene bruker Google sitt [Monitoring Query Language](https://cloud.google.com/monitoring/mql), så det enkleste er nok å bruke nedtrekksmenyene i Grafana når man lager spørringer.
Vi har lagd et enkelt [eksempel-dashboard](https://grafana.nais.io/d/dPaDzl-4z/knada-airflow) som man kan bruke som inspirasjon på hva man kan følge med på.

!!! info "Dette er foreløpig et eksperiment, så si i fra hvis det er nyttig. Hvis det er ingen som trenger dette så vil vi fjerne dette."

## Bygge eget Airflow worker image
Følgende guide antar at docker er installert på maskinen din og at brukeren din er autentisert mot GitHub Container Registry. Se enten installasjon av [colima](https://github.com/abiosoft/colima) eller [docker desktop](https://docs.docker.com/get-docker/) for å sette opp docker.

Eksempelet under viser hvordan man kan installere en egendefinert liste med python biblioteker i et image for airflow, dersom en følger eksempelet vil dette imaget ta utgangspunkt i vårt base image og inneholde nødvendige drivere for oracle, postgres og TDV.

#### Lag først en `requirements.txt` fil, f.eks.
```
backoff==2.0.1
cx_Oracle==8.3.0
datastory>=0.1.12
google-cloud-bigquery>3.0.0
google-cloud-storage==2.4.0
great-expectations==0.15.34
influxdb==5.3.1
```

#### Lag så en `Dockerfile` i samme mappe som `requirements.txt` filen
```
FROM europe-west1-docker.pkg.dev/knada-gcp/knada/airflow-papermill:2023-03-22-fb1c4a4

COPY requirements.txt .

RUN pip install -r requirements.txt
```

#### Bygg og push imaget til GitHub Container Registry

```bash
docker build -t ghcr.io/navikt/mitt-airflow-image:v1 .
docker push ghcr.io/navikt/mitt-airflow-image:v1
```

!!! info "Merk: Imaget som airflow workeren skal bruke må ha apache-airflow installert. Dette vil følge med dersom en tar utgangspunkt i vårt image over, men dersom man bygger et eget image fra scratch må man selv installere dette biblioteket med `pip install apache-airflow>=2.5.1`"
