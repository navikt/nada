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

!!! warning "Vær oppmerksom på at alt av logger fra en airflow task vil skrives til en [bucket](https://cloud.google.com/storage/docs/buckets) i `knada-gcp` prosjektet og være tilgjengelig etterpå gjennom airflow og direkte for de som har tilgang til bucketene. Vær derfor forsiktig så ikke sensitiv informasjon skrives til stdout i koden som kjøres."

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
Som standard vil airflow workere kjøre med et [dockerimage](https://github.com/navikt/knada-images/pkgs/container/knada-airflow-base) som bygges av NADA. Dette imaget inneholder drivere for oracle, postgres og TDV, men inneholder __**ikke et stort utvalg av python biblioteker**__. Dersom du har spesifikke behov for biblioteker som ikke er en del av dette imaget er det beste om du bygger et eget image som tar utgangspunkt i vårt. Se [bygge eget worker image](#bygge-eget-airflow-worker-image) for guide på hvordan å dette kan gjøres. Under følger et eksempel på hvordan å overstyre imaget som hovedcontaineren til Airflow workeren skal bruke:

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
Dersom en ikke spesifiserer ressursbehov for Airflow taskene sine vil de kjøre med standard instillinger som er `512 MB` minne, `0.5` vCPU, og `1Gi` disk (`ephemeral-storage`).
Dette kan man enkelt overstyre for alle operators gitt at de tar utgangspunkt i [BaseOperatoren](https://airflow.apache.org/docs/apache-airflow/stable/_api/airflow/models/baseoperator/index.html#airflow.models.baseoperator.BaseOperator) til Airflow.
Under følger et eksempel på hvordan ressursbehov for en task endres til `2GB` minne,`2` vCPU, og `5Gi` disk:

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
                               "memory": "2Gi",
                               "ephemeral-storage": "5Gi"
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

#### For operators laget med Dataverk-Airflow

Man kan også sette `allowlist` for operators som lages med [dataverk-airflow](https://github.com/navikt/dataverk-airflow#dataverk-airflow) som i eksempelet under.

```python
from airflow import DAG
from airflow.utils.dates import days_ago
from dataverk_airflow import notebook_operator

with DAG('dag', start_date=days_ago(1), schedule_interval=None) as dag:
    task = notebook_operator(dag=dag,
                             name="knada-pod-operator",
                             repo="navikt/repo",
                             nb_path="notebooks/mynb.ipynb",
                             allowlist=["ssb.no", "db.adeo.no:1521"])
```

## Airflow metrikker i Grafana

Nå kan man lage Grafana-dashboard i [grafana.nais.io](https://grafana.nais.io) med metrikker fra Airflow.
Airflow har egen [dokumentasjon](https://airflow.apache.org/docs/apache-airflow/stable/administration-and-deployment/logging-monitoring/metrics.html#counters) for hvilke metrikker som blir delt.
Metrikkene bruker Google sitt [Monitoring Query Language](https://cloud.google.com/monitoring/mql), så det enkleste er nok å bruke nedtrekksmenyene i Grafana når man lager spørringer.
Vi har lagd et enkelt [eksempel-dashboard](https://grafana.nais.io/d/dPaDzl-4z/knada-airflow) som man kan bruke som inspirasjon på hva man kan følge med på.

!!! info "Dette er foreløpig et eksperiment, så si i fra hvis det er nyttig. Hvis det er ingen som trenger dette så vil vi fjerne dette."

## Bygge eget Airflow worker image

I noen tilfeller har du kanskje flere avhengigheter enn det vi tilbyr i standard Airflow-oppsett.

For å legge til ekstra avhengigheter kan du benytte et [Github template](https://github.com/navikt/knemplate/) som vi har opprettet, for å lage et eget repo.
Når du har opprettet repoet og lagt til avhengighetene du ønsker i `requirements.txt` vil arbeidsflyten som allerede er definert generere et Dockerimage som kan benyttes som [Image for Airflow workere](#image-for-airflow-workere).

NB: Hvis du bygger image *lokalt på en nyere Mac* så er det viktig at du bygger imaget for riktig plattform.
Legg til `--platform linux/amd64` i `docker build` kommandoen.

## Kubernetes pod operators eksempel
Dersom du har behov for å bruke Kubernetes Pod Operators så tilbyr vi en [eksempel modul](https://github.com/navikt/nada-dags/tree/main/common) man kan ta utgangspunkt i og inkludere i sitt eget DAGs repo. Dette eksempelet gjør det mulig å ha airflow tasker som kjører kode i form av et python script eller en jupyter notebook fra et annet repo enn det DAGen er definert i.

Eksempelet inneholder en [initcontainer](https://github.com/navikt/nada-dags/blob/main/common/initcontainers.py#L5) som kjører [før](https://github.com/navikt/nada-dags/blob/main/common/podop_factory.py#L113) hovedcontaineren til jobben. Denne initcontaineren vil klone et [selvvalgt repo](https://github.com/navikt/nada-dags/blob/main/common/podop_factory.py#L23) som så blir mountet inn i hovedcontaineren i mappen `/workspace`.

Eksempelet innholder også notifikasjoner ved feil som kan enables ved å angi parametere for [slack kanal](https://github.com/navikt/nada-dags/blob/main/common/podop_factory.py#L28) og/eller [epost](https://github.com/navikt/nada-dags/blob/main/common/podop_factory.py#L27). Angis disse så vil man få generelle notifikasjoner ved feil på enten [epost](https://github.com/navikt/nada-dags/blob/main/common/notifications.py#L11) eller [slack](https://github.com/navikt/nada-dags/blob/main/common/notifications.py#L22).

Brukere står fritt til å bruke eller ta utgangspunkt i og modifisere denne modulen for sitt eget formål.
