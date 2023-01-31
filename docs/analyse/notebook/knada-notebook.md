---
title: Knada notebooks
---
Knada notebooks settes opp gjennom [Knorten](https://knorten.knada.io). Disse notebook serverene kjører i et k8s cluster som driftes av NADA.

### Installasjon av pakker
For Knada notebooks vil det kun være det du som bruker lagrer under stien `/home/jovyan` som blir persistert når notebooken slås av. Derfor er det nødvendig å bruke `--user` flagget når python pakker skal installeres. F.eks.

````
pip install google-cloud-bigquery --user
````

Globalt installerte pakker vil disse forsvinne neste gang du starter notebooken din. Dersom du trenger å installere pakker globalt, se [lage eget image for jupyterhub](#lage-eget-image-for-jupyterhub).

### Automatisk avslåing av jupyterhub
For å spare ressurser vil jupyterhubber skrus av automatisk etter en times inaktivitet, men man kan øke denne timeouten selv ved å spesifisere `Cull Timeout` gjennom [knorten](https://knorten.knada.io).

### Jupyterhub image
Ved oppstart av jupyterhub får man mulighet til å velge hvilket python miljø man ønsker. Vi følger [Python Release Cycle](https://devguide.python.org/versions/) for Jupyterhub, det betyr at vi lager et image per Python-versjon som ikke har status end-of-life. Dessverre kan vi  ikke tilby det nyeste da vi må følge det [Jupyterhub tilbyr](https://hub.docker.com/r/jupyter/base-notebook/tags). Samtlige av imagene man kan velge mellom kommer med drivere for oracle, postgres og TDV installert.

Se [lage eget image for jupyterhub](#lage-eget-image-for-jupyterhub) hvis du heller ønsker å bygge og bruke ditt eget dockerimage for jupyterhubben.

#### Lage eget image for jupyterhub
For å bygge sitt eget image anbefaler vi å ta utgangspunkt i et av våre [imager](https://github.com/navikt/knada-images/pkgs/container/knada-jupyterhub) med python versjonen du ønsker. Gjør du det tar du utgangspunkt i et image der det allerede er installert drivere for oracle, postgres og TDV, samt de vanligste kommandolinjeverktøyene som er hendige å ha i en notebook.

Når du har laget et image kan du selv spesifisere at det er dette imaget som skal brukes for teamet ditt i [knorten](https://knorten.knada.io).

##### Eksempel på Dockerfile
La oss si at du har en `requirements.txt` fil med python biblioteker som under

````python
backoff==2.0.1
cx_Oracle==8.3.0
datastory>=0.1.12
google-cloud-bigquery>3.0.0
google-cloud-storage==2.4.0
great-expectations==0.15.34
influxdb==5.3.1
````

````bash
FROM ghcr.io/navikt/knada-jupyterhub:2022-12-19-2214959-3.10

USER root

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

USER $NB_USER
````

### Lese hemmeligheter inn i jupyter/airflow miljø

Hvert team i Knorten har sin egen secret i [Google Secret Manager](https://console.cloud.google.com/security/secret-manager). For å lese fra denne secreten i jupyterhub/airflow i KNADA-GKE.

````bash
pip install google-cloud-secret-manager
````

````python
import os
from google.cloud import secretmanager
secrets = secretmanager.SecretManagerServiceClient()

resource_name = f"{os.environ['KNADA_TEAM_SECRET']}/versions/latest"
secret = secrets.access_secret_version(name=resource_name)
data = secret.payload.data.decode('UTF-8')
````
