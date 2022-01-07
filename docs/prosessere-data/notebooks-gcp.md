---
title: Notebooks med tilgang til on-prem
---

Et teamprosjekt i GCP har av sikkerhetsmessige årsaker ikke tilgang til datakilder on-prem.
All den tid mange relevante datakilder kun er tilgjengelig on-premises, er det etablert en løsning for å nå disse datakildene via et eget prosjekt.

## Lage notebook
1. Ta kontakt med oss i [#nada](https://nav-it.slack.com/archives/CGRMQHT50) for å få tilgang til dette prosjektet.
1. Gå til [knada-gcp Google console](https://console.cloud.google.com/vertex-ai/workbench/list/instances?orgonly=true&project=knada-gcp&supportedpurview=organizationId)
2. Velg `New Notebook` og velg `Customize`
3. Fyll inn alle obligatoriske felter:
   - Notebook name - Navn på kladdeboka
   - Region - europe-west1 (Belgium)
   - Zone - En sone innenfor regionen
   - Environment - Velg et miljø som passer ditt behov/språk
   - Machine type og GPU - Hvor kraftig maskin du trenger
4. Ekspander `Networking`
   - Under `External IP` velg none
4. Ekspander `Permission`
   - Under `Access to JupyterLab` velg 
      - `Single user only` 
5. Trykk `Create`
6. Når maskinen er ferdig laget, kan du trykke på `Open jupyterlab` for å få tilgang.

## Credentials og hemmeligheter.
Det anbefales å lagre brukernavn, passord o.l. for notebooken din i [Secret manager](https://console.cloud.google.com/security/secret-manager?project=knada-gcp).
1. Gå til [Secret manager](https://console.cloud.google.com/security/secret-manager?project=knada-gcp)
1. Legg inn relevante verdier i din hemmelighet.


For at notebooken skal kunne bruke din personlige bruker når den henter hemmeligheter fra secret manager, må du gi den tilgang til det ved å kjøre følgende kommando fra en notebook-terminal:
```gcloud auth application-default login```
Deretter legge inn secret-manager-pakken:
```
pip install google-cloud-secret-manager
```

Du kan nå kjøre følgende kode i din notebook for å hente hemmeligheten.
```python
from google.cloud import secretmanager
secrets = secretmanager.SecretManagerServiceClient()

resource_name = f"projects/knada-gcp/secrets/<navn på hemmelighet>/versions/latest"
secret = secrets.access_secret_version(name=resource_name)
secret.payload.data.decode('UTF-8')
```


## Maskintype og GPU
Det er du som vet best hva du trenger, derfor er det ingen begrensninger på hva du kan velge av maskin og GPU.
Bare husk at det kan bli veldig kostbart hvis du lar en maskin (med mye minne og GPU) stå uten at den blir brukt.

## Stoppe en maskin
Har du en maskin du ikke trenger for en periode, men ikke ønsker å [slette](#slette-en-maskin), så kan du stoppe den.
Velg maskinen i [oversikten](https://console.cloud.google.com/ai-platform/notebooks/instances) og trykk `STOP` i toppen.

## Slette en maskin
Har du en maskin du ikke trenger lenger, så kan du slette den.
Velg maskinen i [oversikten](https://console.cloud.google.com/ai-platform/notebooks/instances) og trykk `DELETE` i toppen.
