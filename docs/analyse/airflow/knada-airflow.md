---
title: Airflow i KNADA
---

[Apache Airflow](https://airflow.apache.org/docs/apache-airflow/stable/index.html) er et verktøy for å orkestrere, skedulere og monitorere datapipelines.
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


## Kom i gang

NADA tilbyr team eller enkeltpersoner å sette opp Airflow instanser i KNADA gjennom [Knorten](https://knorten.knada.io).

For mer informasjon om Airflow, se [Airflow docs](https://airflow.apache.org/docs/apache-airflow/stable/index.html)

!!! warning "Vær oppmerksom på at alt av logger fra en Airflow task vil skrives til en [bucket](https://cloud.google.com/storage/docs/buckets) i `knada-gcp` prosjektet, og være tilgjengelig etterpå for Airflow og direkte for NADA som er admins i `knada-gcp`. Vær derfor forsiktig så ikke sensitiv informasjon skrives til stdout i koden som kjøres."

### Github repo for DAGs

For å bruke Airflow i KNADA kreves det et Git-repo under `navikt` organisasjonen på Github.com som inneholder Python-filer med DAGer. 

Hvert minutt vil Github repoet bli synkronisert til Airflow instansen, og Airflow vil lese DAGene definert i repoet.

#### Eksempler på DAGs repoer

- [nada-dags](https://github.com/navikt/nada-dags) NADA sin eksempler for DAGer.
- [knada-dags](https://github.com/navikt/knada-dags) NADA sin lekekasse for DAGer, fungerende og ikke fungerende DAGer.
- [Dataverk Airflow](https://github.com/navikt/dataverk-airflow/tree/main/tests-integration) eksempel på intergrasjonstester av Airflow som kjører i Github.
- [sykefravar-dags](https://github.com/navikt/sykefravar-dags) Team Sykefravær sine DAGer.

## Konfigurasjon av Airflow

I KNADA er Airflow konfigurert til å bruke [Kubernetes Executor](https://airflow.apache.org/docs/apache-airflow/stable/core-concepts/executor/kubernetes.html).
Dette innebærer at hver task i en Airflow DAG vil spinne opp og kjøre en egen worker i en separat [Kubernetes pod](https://kubernetes.io/docs/concepts/workloads/pods/).
Det gjør at man står fritt til å selv spesifisere miljøet til Airflow-workeren.
Nedenfor har vi listet opp noen av de konfigurasjonen vi tror er nyttig å vite om.

!!! info "Merk: Hovedcontaineren som worker-poden bruker vil alltid hete `base`, så dersom en ønsker å overskrive noe som gjelder spesifikt for denne containeren må man referere til den med navn som i eksemplene under."

### Docker image for Airflow

Ut av boksen bruker Airflow Docker images eid av Nada, disse er definert i [navikt/knada-images](https://github.com/navikt/knada-images/).
Disse Docker imagene kommer med drivere for Oracle, og Postgres, men inneholder __**ikke et stort utvalg av Python biblioteker**__. 
Du finner en oppdatert liste i [navikt/knada-images](https://github.com/navikt/knada-images/).
Dersom du har behov som ikke er dekket av oppsettet vår må du lage dine egne Docker images, og bruke de i stedet.
Se [bygge eget worker image](#bygge-eget-airflow-worker-image) for guide på hvordan å dette kan gjøres. 
Under følger et eksempel på hvordan å overstyre imaget som hovedcontaineren til Airflow workeren skal bruke:

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

Har du behov for at hele Airflow instansen skal bruke ditt Docker image så spesifiseres det i Knorten.

### Ressursbehov for Airflow

Dersom en ikke spesifiserer ressursbehov for Airflow taskene sine vil de kjøre med standard instillinger som er `512 MB` minne, `0.5` vCPU, og `1Gi` disk (`ephemeral-storage`).
Dette kan man enkelt overstyre for alle operators gitt at de tar utgangspunkt i [BaseOperator](https://airflow.apache.org/docs/apache-airflow/stable/_api/airflow/models/baseoperator/index.html#airflow.models.baseoperator.BaseOperator) til Airflow.
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

### Trafikk ut fra Airflow

For å skallsikre Airflow har man muligheten til å skru på allow list for teamets tjenester.
Dette innebærer for Airflow at man i hvert task må spesifisere hvilke eksterne tjenester (les: tjenester utenfor Airflow) man skal snakke med.
Vi har stengt av muligheten for eksterne tjenester å snakke *inn* til Airflow.

I podene hvor Airflow tasken kjører blokkeres i utgangspunktet all trafikk *ut*, med følgende unntak:

- github.com: Airflow vil alltid trenge å hente repoet som koden ligger i
- storage.googleapis.com: Airflow skriver loggene til en Google Cloud Storage bucket
- Knaudit: tjeneste som logger hvilke jobber som kjøres for hvert team til Oracle for DVH

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
Når jobben er ferdig vil tilgangene bli fjernet.

#### Allow list ved bruk av Dataverk Airflow

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

## API-tilgang til Airflow

Har man behov for at en ekstern tjeneste skal snakke med API-et til Airflow trenger Nada å konfigurere noe på "baksiden" og lage en service bruker for dere.
Ta kontakt i [Slack#nada](https://nav-it.slack.com/archives/CGRMQHT50), så fikser vi dette for dere.
Vi vil ta opprette en service account for deres Airflow, og lage en ekstern adresse (som tilgangsstyres med Cloud Armor).

Et typisk scenario for dette er å la IWS styre jobber i Airflow.
Akkurat dette scenarioet er også dokumentert i [Confluence/Analytisk Plattform](https://confluence.adeo.no/display/DEP/Airflow+i+knada-gke).

## Airflowmetrikker i Grafana

Man kan nå lage Grafana-dashboard i [grafana.nais.io](https://grafana.nais.io) med metrikker fra Airflow.
Airflow har egen [dokumentasjon](https://airflow.apache.org/docs/apache-airflow/stable/administration-and-deployment/logging-monitoring/metrics.html#counters) for hvilke metrikker som blir delt.
Metrikkene bruker Google sitt [Monitoring Query Language](https://cloud.google.com/monitoring/mql), så det enkleste er nok å bruke nedtrekksmenyene i Grafana når man lager spørringer.
Vi har lagd et enkelt [eksempel-dashboard](https://grafana.nais.io/d/dPaDzl-4z/knada-airflow) som man kan bruke som inspirasjon på hva man kan følge med på.

## Bygge eget Airflow worker image

I noen tilfeller har du kanskje flere avhengigheter enn det vi tilbyr i standard Airflow-oppsett.
For å legge til ekstra avhengigheter kan du benytte et [Github template](https://github.com/navikot/knemplate/) som vi har opprettet, for å lage et eget repo.
Når du har opprettet repoet og lagt til avhengighetene du ønsker i `requirements.txt` vil arbeidsflyten som allerede er definert generere et Dockerimage som kan benyttes som [Docker image for Airflow](#docker-image-for-airflow).

NB: Hvis du bygger image *lokalt på en nyere Mac* så er det viktig at du bygger imaget for riktig plattform.
Legg til `--platform linux/amd64` i `docker build` kommandoen.

## KubernetesPodOperator

Dersom du har behov for å bruke Kubernetes Pod Operators så har vi et eksempel i [nada-dags](https://github.com/navikt/nada-dags/blob/main/dags/kubernetes_pod_operator.py) som fortsatt lar deg klone et annet repo, og installere Python-pakker ved oppstart.

## Audit logs av tasks

Som et risikoreduserendetiltak logger vi hvem som kjører hvilke jobber i KNADA ned til Datavarehus.
Dette er for at Datavarehus skal ha bedre kontroll på hvem som snakker med de.
Selve tjenesten heter [knaudit](https://github.com/nais/knaudit#knaudit), og det er kun Datavarehus og NADA som har tilgang til disse loggene.

Eksempel på hva vi logger:

```json
{"commit_sha1":["d19dcf695f043c6eff6b0cc2478b58d45299ca97"],"hostname":["mycsvdag-starting-fc8dfe28afae414da33a5d2a57db85d1"],"run_id":["scheduled__2023-05-03T05:30:00+00:00"],"timestamp":["2023-05-03T05:35:11.000Z"],"git_repo":["github.com/navikt/test-team-dag"],"ip":["321.312.312.321"],"namespace":["team-test-ncnv"],"task_id":["starting"],"git_branch":["main"],"dag_id":["MyCSVDAG"],"triggered_by":["airflow"]}
```

Hvis det er en manuell kjøring så vil `triggered_by` være satt til NAV-ident for den innlogget Airflow-bruker.
