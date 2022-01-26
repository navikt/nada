---
title: Notebooks
---

Vi tilbyr [Jupyter Notebooks](https://jupyter.org/) i GCP.
Disse finner man under [Vertex AI/Workbench  (doc)](https://cloud.google.com/vertex-ai/docs/workbench), sammen med en del andre verktøy.


## To typer Notebook-servere

Et teamprosjekt i GCP har av sikkerhetsmessige årsaker ikke tilgang til datakilder on-prem.
All den tid mange relevante datakilder kun er tilgjengelig on-premises, er det etablert en løsning for å nå disse datakildene via et eget prosjekt.

Notebook server i GCP har ikke tilgang til følgende tjenester:

* Aiven-tjenester (Kafka, OpenSearch)
* API-tjenester i NAIS-clustere
* Datapakker
* Kafka (on-prem)

### Team-prosjekt server

1. Gå til [Vertex-AI/Workbench](https://console.cloud.google.com/vertex-ai/workbench/instances)
2. Velg `New Notebook` og velg `Customize`
3. Fyll inn alle obligatoriske felter:
   - Notebook name - Navn på kladdeboka
   - Region - Velg en av de europeiske
   - Zone - En sone innenfor regionen du valgte
   - Environment - Velg et miljø som passer ditt behov/språk
   - Machine type og GPU - Hvor kraftig maskin du trenger
4. Ekspander `Permission`
   - Under `Access to JupyterLab` velg 
      - `Single user only` hvis det kun er du som skal ha tilgang til hubben
      - `Service account` hvis alle med tilgang til gcp prosjektet skal ha tilgang
5. Trykk `Create`
6. Når maskinen er klar til bruk kan du trykke på `Open JupyterLab`

### Server med tilgang til on-prem

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

## Autentisering med brukers credentials på serveren

1. I Jupyterlab, åpne en terminal
2. Kjør kommandoen `gcloud auth login --update-adc`
3. Gå til lenken som vises i terminalen og logg inn med NAV-bruker
4. Etter at du har logget inn kopierer du verifikasjonskoden du får inn i terminalen

Etter å ha utført stegene over vil du i din Notebook kunne jobbe med dine private Google credentials mot kilder.

## Credentials og hemmeligheter.
Det anbefales å bruke [Secret manager](https://console.cloud.google.com/security/secret-manager?project=knada-gcp) som erstatning for Vault.
1. Gå til [Secret manager](https://console.cloud.google.com/security/secret-manager?project=knada-gcp)
1. Legg inn relevante verdier i din hemmelighet.


For at notebooken skal kunne bruke din personlige bruker når den henter hemmeligheter fra secret manager, må du gi den tilgang til det ved å kjøre følgende kommando fra en notebook-terminal:
```bash
# Hvis du ikke har gjort dette fra før
gcloud auth application-default login
```

Deretter legge inn secret-manager-pakken:

```bash
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

Har du flere hemmeligheter, som du gjerne skulle hatt som miljøvariabler i din Notebook, kan du bytte ut siste linje med følgende:
```
os.environ.update(dict([line.split("=") for line in secret.payload.data.decode('UTF-8').splitlines()]))
```

Dette fordrer at du har hemmelighetene dine i følgende format:
```
key=value
key2=value
```

Eksempel:
```
ORACLE_USERNAME=e152435
ORACLE_PASSWORD=asdfløkjamsfwoie23$9283/$lkmsdfl)(23$wio/3
```

Da kan du hente de ut med for eksempel:
```python
print(os.environ["ORACLE_USERNAME"])
```

## Bruk av hostnavn på onprem-tjenester
I dette prosjektet støtter vi ikke navneoppslag mot on-premises.
Det betyr at databasenavn må oversettes til ip-adresser i Notebooks.
Man kan finner ip-adressen til en database ved å pinge hostnavnet fra f.eks. utviklerimage:
```
$ ping dm08db01.adeo.no
> PING dm08db01.adeo.no (10.x.x.x): 56 data bytes
```

Vi har også lagd en liste over de åpningen vi har (og ip-adressene) over i [navikt/pig/nada](https://github.com/navikt/pig/blob/master/nada/doc/knada-gcp.md#brannmur%C3%A5pninger).

For å bruke IP i stedet for en vanlig adresse så er det bare å bytte direkte.
Så hvis følgende er den "vanlige" kode-snutten din:
```python
dsnStr = cx_Oracle.makedsn('dm08db01.adeo.no','1521',service_name='DWH_HA')
```

så kan du heller skrive
```python
dsnStr = cx_Oracle.makedsn('10.x.x.x','1521',service_name='DWH_HA')
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

## Oppsett for Oracle og Postgres drivere
For å gjøre det enkelt for dere å komme i gang, har vi lagd to scripts som begge må kjøres med root privilegier.

Kjør først kommandoen:
```bash
sudo -i
```
for å kunne kjøre skriptene som root.

Trenger du Oracle lim inn følgende i terminalen din:
```bash

apt-get update && apt-get install -yq --no-install-recommends \
    build-essential \
    curl \
    alien \
    libaio1 \
    libaio-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

curl https://download.oracle.com/otn_software/linux/instantclient/185000/oracle-instantclient18.5-basic-18.5.0.0.0-3.x86_64.rpm > /tmp/oracle-instantclient18.5-basic-18.5.0.0.0-3.x86_64.rpm

alien -i /tmp/oracle-instantclient18.5-basic-18.5.0.0.0-3.x86_64.rpm && \
    rm -rf /var/cache/yum && \
    rm -f /tmp/oracle-instantclient18.5-basic-18.5.0.0.0-3.x86_64.rpm && \
    echo "/usr/lib/oracle/18.5/client64/lib" > /etc/ld.so.conf.d/oracle-instantclient18.5.conf && \
    /usr/sbin/ldconfig

PATH=$PATH:/usr/lib/oracle/18.5/client64/bin
```

Trenger du Postgres, lim inn følgende i terminalen din:
```bash
apt-get update && apt-get install -yq --no-install-recommends libpq-dev
```
