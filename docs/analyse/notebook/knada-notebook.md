---
title: KNADA notebooks
---

KNADA notebooks bestilles gjennom [Knorten](https://knorten.knada.io).
Disse notebookene kjører i et managed Kubernetes cluster i GCP som driftes av NADA.

## Installasjon av Python-pakker
For KNADA notebooks vil det kun være de Python-pakkene som blir lagret under `user`-stien som blir persistert når Notebook-en slås av.
Derfor er det nødvendig å bruke `--user` flagget når du installere Python-pakker.

```bash
pip install google-cloud-bigquery --user
```

Glemmer du å bruke `--user`, så blir pakkene installert globalt, og de vil forsvinne når notebook-en din blir skrudd av.
Har du behov for å ha globalt installerte pakker anbefaler vi at du bruker ditt eget [Jupyter notebook image](#eget-image-for-jupyter-notebook).

## Automatisk avslåing av notebook
For å spare ressurser vil en Jupyter notebook automatisk blir skrudd av etter en times inaktivitet.
Har man behov for lengre levetid kan man spesifisere dette gjennom Knorten i feltet `Cull Timeout`.

## Python-miljø
Når man logger inn i Jupyter så får man mulighet til å velge hvilket Python miljø man ønsker i sin notebook.
Vi følger [Python Release Cycle](https://devguide.python.org/versions/) for imagene våre, det betyr at vi lager et image per Python-versjon som ikke har statusen _end-of-life_, og som også er støttet av Jupyter (se [Docker Hub](https://hub.docker.com/r/jupyter/base-notebook/tags)).
Samtlige av image-ene man kan velge mellom kommer med drivere for oracle, postgres og TDV installert.

### Eget image for Jupyter notebook
Har du behov for noe mer enn det vi tilbyr ut av boksen kan du lage ditt eget Jupyter notebook image.
Ta gjerne utgangspunkt i [vårt image](https://github.com/navikt/knada-images/pkgs/container/knada-images%2Fjupyter) med den Python-versjonen du ønsker. Gjør du det får du drivere for oracle, postgres og TDV, samt de vanligste kommandolinjeverktøyene som er hendige å ha i en notebook allerede installert.

Når du har laget et image kan du selv spesifisere at det er dette imaget som skal brukes for teamet ditt i Knorten.

#### Eksempel på Dockerfile
La oss si at du har en `requirements.txt` fil med Python-pakker som under:

```python
backoff==2.0.1
cx_Oracle==8.3.0
datastory>=0.1.12
google-cloud-bigquery>3.0.0
google-cloud-storage==2.4.0
great-expectations==0.15.34
influxdb==5.3.1
```

Da kan du med følgende `Dockerfile` installere disse pakkene når du bygger ditt image:

```dockerfile
FROM ghcr.io/navikt/knada-images/jupyter:2023-06-16-738148c-3.10

USER root

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

USER $NB_USER
```

#### Lagring av image
Du kan selv velge om du ønsker å lagre imaget ditt i [GAR](https://cloud.google.com/artifact-registry/docs/docker/pushing-and-pulling) eller i [GHCR](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry). I dette [repoet](https://github.com/navikt/knada-image-eksempel) er det eksempler på hvordan å bygge et docker image og pushe til begge to docker repositories. Begge pipelinene bygger image med samme [Dockerfile](https://github.com/navikt/knada-image-eksempel/blob/main/Dockerfile) og [requirements.txt](https://github.com/navikt/knada-image-eksempel/blob/main/requirements.txt).

Når du så har bygget image ditt finner du det igjen ved å:

- For GAR - Gå til [nais management](https://console.cloud.google.com/artifacts/browse/nais-management-233d) og let opp teamet ditt.
- For GHCR - Gå til [packages](https://github.com/orgs/navikt/packages) og søk på repo navnet ditt.

### Lese hemmeligheter fra Google Secret Manager

Hvert team i Knorten har sitt eget område for hemmeligheter i [Google Secret Manager](https://console.cloud.google.com/security/secret-manager).
For å lese disse hemmelighetene i en notebook trenger man å ha installert pakken `google-cloud-secret-manager`.

```bash
pip install --user google-cloud-secret-manager
```

Koden nedenfor henter alle hemmelighentene fra ditt område og legger de inn i en variabel som heter `data`.

```python
import os
from google.cloud import secretmanager
secrets = secretmanager.SecretManagerServiceClient()

resource_name = f"{os.environ['KNADA_TEAM_SECRET']}/versions/latest"
secret = secrets.access_secret_version(name=resource_name)
data = secret.payload.data.decode('UTF-8')
```

Har du hemmeligheter i et eget team-prosjekt så må du gi service accounten for KNADA tilgang til hemmeligheter i ditt team-prosjekt.
Navn på service accounten finner du i Knorten.

## Restarte server
For manuelt å restarte en Jupyter notebook går man til kontrollpanelet ved å velge `File` -> `Hub Control Panel` -> `Stop My Server`. Etter at serveren er stoppet vil man så kunne trykke `Start My Server`.

!!! info "Dersom jupyterhubben din har fryst seg og du ikke har mulighet til å gjøre det over kan du gå direkte til kontroll panelet hvis du går til stien `/hub/home` i nettleseren"

## Trafikk fra notebooks
!!! info "Det følgende er foreløpig en valgfri feature som må enables gjennom Knorten. Dersom det ikke gjøres er det ingen begrensninger på trafikk fra notebooks"

Man må eksplisitt oppgi hvilke hoster man ønsker å snakke med fra notebooks i KNADA. Dette spesifiserer du gjennom knorten.

Tilsvarende som for [airflow](../airflow/knada-airflow/#trafikk-fra-airflow-workere) legger du inn hostnavn og port på formatet `hostnavn:port`. Dersom man ikke angir port vil vi bruke `443` som standardport.
Vi har en controller kjørende i KNADA som vil lage en `NetworkPolicy` som tillater trafikk ut fra notebooken mot de hostene som legges til.
Når notebooken din slås av vil tilgangene bli fjernet.