---
title: Airflow
---

[Apache Airflow](https://airflow.apache.org/docs/apache-airflow/stable/index.html) er et verktøy for å orkestrere,
skedulere og monitorere datapipelines. Web-grensesnittet til Airflow gir brukeren enkel tilgang til å lese logger fra
de ulike stegene i pipelinen, trigge datapipelines manuelt og sjekke statistikk på tidligere kjøringer.

En datapipeline i Airflow, eller DAG (Directed Acyclic Graph), er et sett med oppgaver man ønsker å kjøre som beskriver
rekkefølge og avhengigheter mellom oppgavene. Disse DAG-ene beskrives programmatisk i python filer og legges i et Github
repo som periodisk synkroniseres med Airflow instansen. Nedenfor ser du en en grafisk representasjon av flyten i en DAG:

![Flyten i en Airflow DAG](/img/dag-eksempel.png)

KNADA plattformen tilbyr team eller enkeltpersoner å sette opp airflow instanser i sine egne k8s namespacer i
KNADA clusteret.

For mer informasjon om Airflow, se [Airflow docs](https://airflow.apache.org/docs/apache-airflow/stable/index.html)

## Konfigurasjon
For å sette opp Airflow må man lage en pull request til [navikt/knada-airflow](https://github.com/navikt/knada-airflow)
og legge til en yaml-fil med følgende innhold i katalogen _configs_:

````bash
namespace: <namespace>
ingress: <ingress>
users:
  - <Brukerident 1>
  - <Brukerident 2>
  - ...
dagsRepo: <dagsRepo>
````

Ved hver ny pull request (og endringer) blir sjekker kjørt automatisk.
Når disse sjekkene er godkjente (lyser grønt), kan du selv merge inn din pull request.
Du trenger altså _ikke_ vente på godkjenning.

### namespace
Settes til navnet på namespacet hvor Airflow instansen skal settes opp. Som regel det samme som JupyterHub-en din.

### ingress
Blir prefikset for adressen til Airflow web grensesnittet, altså https://_prefiks_-airflow.knada.adeo.no. Dette
kan i grunn settes til hva man vil, men det vanligste har vært å sette det til det samme som namespace navnet.

### user
List opp de identene som skal ha tilgang til airflow instansen.

### dagsRepo
Repoet under NAVIKT-orgen på Github som inneholder Python-filer med DAG-er.

:::caution repoet må eksistere
Repoet trenger ikke inneholde noen DAG-er når Airflow instansen settes opp, men repoet **må eksistere**.
:::

En gang i minuttet vil DAG-ene som ligger i repoet bli synkronisert til Airflow instansen.

#### Eksempler på DAGs repoer
- [nada-dags](https://github.com/navikt/nada-dags) inneholder en rekke eksempler på hvordan å ta i bruk ulike operators i Airflow.
- [opendata-dags](https://github.com/navikt/opendata-dags) er DAG-ene Opendata bruker for å lage datapakker.

### dagsRepoBranch
Du kan også spesifisere en branch som Airflow skal synkronisere mot.

**default:** main

### repoSyncTime
Hvor ofte (i sekunder) Airflow skal synkronisere mot repoet ditt.

**default:** 60

### dvApiEndpoint
Ved datapakke-publisering bruker dataverk denne parameteren for å sette api-adressen som datakatalogen skal hente
innholdet fra for datapakkevisningen.


### dvBucketEndpoint
Ved datapakke-publisering bruker dataverk denne parameteren for å avgjøre hvilken datakatalog som innholdet i 
datapakken (ressursfiler og visualiseringer) skal publiseres til.

:::caution ekstern publisering
Dersom man ikke spesifiserer `dvApiEndpoint` og `dvBucketEndpoint` vil datapakker publiseres til den 
interne datakatalogen. Den *eneste* grunnen til å endre disse parameterene er dersom man ønsker å publisere 
datapakker fra AirFlow til den åpne datakatalogen data.nav.no. 
Merk også at dersom disse parameterene først settes til ekstern publisering så vil alle datapakker som publiseres fra denne AirFlow-instansen være 
åpent tilgjengelig fra internett.
:::

## Dataverk-Airflow
[Dataverk-Airflow](https://github.com/navikt/dataverk-airflow) er et wrapperbibliotek som gjør det enklere å
bruke [KubernetesPodOperator](https://airflow.apache.org/docs/apache-airflow/stable/kubernetes.html) i KNADA clusteret.

Biblioteket inneholder wrapper-funksjoner for å kjøre Jupyter notebooks, Python scripts, BigQuery kommandoer og
DBT transformasjoner i separate Kubernetes pod-er. Se [README](https://github.com/navikt/dataverk-airflow/blob/master/README.md)
på repoet for eksempler.
