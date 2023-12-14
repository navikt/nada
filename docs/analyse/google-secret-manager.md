# Google Secret Manager
Google Secret Manager er en tjeneste som gir en sikker og praktisk metode for å lagre API-nøkler, passord, sertifikater og annen sensitiv data.

## Secrets i NAIS team-prosjekt
Har du hemmeligheter i et eget NAIS team-prosjekt som du ønsker å bruke fra Airflow, så må du gi service accounten for KNADA (denne finner du i [Knorten](https://knorten.knada.io)) tilgang til hemmeligheter i ditt team-prosjekt.

## Secrets i KNADA
I og med at noen av brukerne i KNADA ikke er knyttet til et NAIS team-prosjekt, tilbyr KNADA Google Secret Manager enten for team eller enkeltpersoner.

Hvert team som blir opprettet i KNADA igjennom Knorten vil få opprettet sin team-hemmelighet i Google Secret Manager, denne er kun tilgjengelig fra Airflow.
Hver enkelt KNADA-bruker har også muligheten til å bestille sin egen personlige hemmelighet i Google Secret Manager.
Denne er tenkt brukt til å lagre hemmeligheter som kun du skal ha tilgang til.

## Få tilgang

Det blir automatisk opprettet en hemmelighet for et team i Knorten, og alle medlemmer av teamet har tilgang.
Personlige hemmeligheter må man selv aktivt opprette, og dette gjør man under [Personlige tjenester](https://knorten.knada.io/oversikt).

## Legge til en ny hemmelighet

Det er en lenke fra Knorten til teamets og din personlige secret manager.
Dokumentasjon for bruk av Google Secret Manager finner man hos [Google Cloud](https://cloud.google.com/secret-manager/docs/creating-and-accessing-secrets).
En viktig ting å merke seg er at man skiller mellom en `secret` og `version`.
For man har kun tilgang til en hemmelighet/`secret` igjennom Knorten, men denne kan ha forskjellige `version`.
Vi anbefaler uansett ikke at man har forskjellige hemmeligheter i forskjellige `version`, da dette fort kan bli uoversiktlig.
Det vi anbefaler er å legge alle hemmelighetene deres som en liste i en `version`.
Da kan man lett lese de inn i Python.

## Lese hemmeligheter fra Google Secret Manager

For å lese hemmelighter fra Google Secret Manager må du installere Python-biblioteket [google-cloud-secret-manager](https://pypi.org/project/google-cloud-secret-manager/).


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

