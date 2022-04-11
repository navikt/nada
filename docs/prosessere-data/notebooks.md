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
2. Gå til [knada-gcp Google console](https://console.cloud.google.com/vertex-ai/workbench/list/instances?orgonly=true&project=knada-gcp&supportedpurview=organizationId)
3. Velg `New Notebook` og velg `Customize`
4. Fyll inn alle obligatoriske felter:
   - Notebook name - Navn på kladdeboka
   - Region - europe-west1 (Belgium)
   - Zone - En sone innenfor regionen
   - Environment - Velg et miljø som passer ditt behov/språk
   - Machine type og GPU - Hvor kraftig maskin du trenger
5. Ekspander `Networking`
   - Under `External IP` velg none
6. Ekspander `Permission`
   - Under `Identity and API access`
      - Avhuk `Use Compute Engine default service account` og lim inn service accounten knyttet til din bruker, se [her](#personlig-service-account-og-secret-manager-hemmelighet-for-brukerteam) for informasjon om hvor denne finnes
7. Trykk `Create`
8. Når maskinen er ferdig laget, kan du trykke på `Open jupyterlab` for å få tilgang.

#### Personlig service account og secret manager hemmelighet for bruker/team
For å enklere styre tilgang oppretter vi en unik service account og en secret manager hemmelighet for hver ulike bruker/gruppe som legges til i knada-gcp prosjektet. Disse blir opprettet når man tar kontakt med oss i (1) [her](#server-med-tilgang-til-on-prem).

Du vil finne igjen service accounten [her](https://console.cloud.google.com/iam-admin/serviceaccounts?project=knada-gcp) og hemmeligheten [her](https://console.cloud.google.com/security/secret-manager?project=knada-gcp).

## Autentisering med brukers credentials på serveren

1. I Jupyterlab, åpne en terminal
2. Kjør kommandoen `gcloud auth application-default login`
3. Gå til lenken som vises i terminalen og logg inn med NAV-bruker
4. Etter at du har logget inn kopierer du verifikasjonskoden du får inn i terminalen

Etter å ha utført stegene over vil du i din Notebook kunne jobbe med dine private Google credentials mot kilder.
Denne tilgangen er kun midlertidig, og man må gjøre dette hver dag.

## Credentials og hemmeligheter.
Det anbefales å bruke [Secret manager](https://console.cloud.google.com/security/secret-manager?project=knada-gcp) som erstatning for Vault.
1. Gå til [Secret manager](https://console.cloud.google.com/security/secret-manager?project=knada-gcp)
1. Legg inn relevante verdier i din hemmelighet.

For at notebooken skal kunne bruke din personlige bruker når den henter hemmeligheter fra secret manager, må du gi den tilgang til det ved å følge stegene i [Autentisering med brukers credentials på serveren](#autentisering-med-brukers-credentials-på-serveren).

Deretter må du installere Python sin Google Cloud Secret Manager pakke:

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

Har du flere verdier i den samme hemmeligheten i secret manager kan du parse den og hente ut de ulike verdiene. Under følger eksempler på hvordan dette kan lagres i en [python dictionary](#i-dictionary) eller som [miljøvariabler](#som-miljøvariabler) dersom hemmeligheten din i secret manager er på følgende format:
```
key=value
key2=value
```

Eksempel:
```
ORACLE_USERNAME=e152435
ORACLE_PASSWORD=asdfløkjamsfwoie23$9283/$lkmsdfl)(23$wio/3
```

### I dictionary
```
secrets = dict([line.split("=") for line in secret.payload.data.decode('UTF-8').splitlines()])
```

### Som miljøvariabler
```
os.environ.update(dict([line.split("=") for line in secret.payload.data.decode('UTF-8').splitlines()]))
```

Da kan du hente de ut med for eksempel:
```python
print(os.environ["ORACLE_USERNAME"])
```

### Hemmeligheter for on-prem Postgres

Hvis du har behov for å snakke med Postgres on-prem må du enten opprette en statisk (5000 timer) brukernavn, heller hente nytt passord hver 24 time.
For å kunne hente statiske brukere må du gjøre endring på database-oppsettet, ta en titt på [database-iac/doc](https://github.com/navikt/database-iac#static-credentials) for hvordan dette gjøres.

Uavhengig om hvilken type bruker du trenger må du følge dokumentasjonen til [vault-iac/postgres](https://github.com/navikt/vault-iac/blob/master/doc/databases/postgres.md#developer-access) for å hente ut brukernavn og passord.

Begge deler kan gjøres via [Vault CLI](https://www.vaultproject.io/docs/commands) lokalt eller via [Vault Browser terminal](https://vault.adeo.no) (se bilde for hvor du finner knappen).

![Vault nettleser terminal](/img/vault-cli-browser.png)

Når du har hentet ut hemmeligheten fra Vault må du legge det inn i Google Secret manager som beskrevet [ovenfor](#credentials-og-hemmeligheter).

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

curl https://download.oracle.com/otn_software/linux/instantclient/215000/oracle-instantclient-basic-21.5.0.0.0-1.x86_64.rpm > /tmp/oracle-instantclient-basic-21.5.0.0.0-1.x86_64.rpm

alien -i /tmp/oracle-instantclient-basic-21.5.0.0.0-1.x86_64.rpm && \
    rm -rf /var/cache/yum && \
    rm -f /tmp/oracle-instantclient-basic-21.5.0.0.0-1.x86_64.rpm && \
    echo "/usr/lib/oracle/21.5/client64/lib" > /etc/ld.so.conf.d/oracle-instantclient21.5.conf && \
    /usr/sbin/ldconfig

PATH=$PATH:/usr/lib/oracle/21.5/client64/bin
```

Trenger du Postgres, lim inn følgende i terminalen din:
```bash
apt-get update && apt-get install -yq --no-install-recommends libpq-dev
```

## Publisere datapakker fra GCP prosjekter
For å publisere datapakker til [datapakker.intern.nav.no](https://datapakker.intern.nav.no) fra gcp prosjekter kreves det at installert versjon av dataverk er
`>= 0.4.16` (for å oppdatere nåværende versjon kjør `pip install dataverk -U`). 

I tillegg må to miljøvariabler settes:
- DATAVERK_HOST settes til `https://data-catalog-es-api.nav.no`
- DATAVERK_ES_TOKEN (si ifra i [#nada](https://nav-it.slack.com/archives/CGRMQHT50) dersom du trenger denne)

Eksempel på hvordan å sette disse miljøvariablene i python
````python
import os

os.environ["DATAVERK_HOST"] = "https://data-catalog-es-api.nav.no"
os.environ["DATAVERK_ES_TOKEN"] = "token"
````

## Koble til notebook server i knada-gcp fra VS Code lokalt
Du kan koble deg til VMen som notebook serveren din kjører på med SSH fra VS Code lokalt som følger:
1. Først trenger du å få `owner` rettighet på VM instansen. Dette får du ved å ta kontakt i [#nada](https://nav-it.slack.com/archives/CGRMQHT50).
2. Installer extension `Remote - SSH` i VS Code.
3. Hvis du ikke har gjort det i dag, kjør kommandoen `gcloud auth login --update-adc`.
4. Kjør kommandoen `gcloud compute ssh --project knada-gcp --zone europe-west1-b <instance> --dry-run`. Erstatt `<instance>` med navnet på VM instansen din, denne finner du [her](https://console.cloud.google.com/compute/instances?project=knada-gcp). Denne kommandoen vil også generere ssh nøkler.
5. Outputen fra kommandoen i (4) inneholder en del ting du trenger fylle inn i ssh-configen din. Under er et eksempel på hvordan en slik ssh config skal se ut.
````
Host gcp-notebook
  HostName ${HOSTNAME}
  IdentityFile ~/.ssh/google_compute_engine
  CheckHostIP no
  HostKeyAlias ${HOSTNAME}
  IdentitiesOnly yes
  UserKnownHostsFile ~/.ssh/google_compute_known_hosts
  ProxyCommand ${PROXYCOMMAND}
  ProxyUseFdpass no
  User ${USERNAME}
````
Erstatt ${HOSTNAME}, ${PROXYCOMMAND} og ${USERNAME} med verdiene du får ut av dry-run kommandoen over og lagre filen under `~/.ssh/config`. Merk: ${USERNAME} skal kun være det før `@` i output fra kommandoen over, ${HOSTNAME} er det som begynner med `compute.`
6. I VS Code trykk cmnd+shift+P (mac) eller cntrl+shift+P (windows) og skriv inn og velg `Remote - SSH: Connect to host...` og velg så hosten `gcp-notebook`.

I [denne guiden](https://medium.com/@albert.brand/remote-to-a-vm-over-an-iap-tunnel-with-vscode-f9fb54676153) dokumenterer de hvordan denne ssh-configen kan fylles ut automagisk når man legger til en ny host i VS Code. Gjør man dette må man alikevel inn å manuelt endre ting i ssh configen i etterkant, så det anbefales å ta utgangspunkt i eksempelet i punkt 5 over når ssh configen skal lages.

:::info
Stegene over vil ikke fungere for PyCharm og andre JetBrains IDEer da disse krever at GCP-VMen du kobler deg til har en ekstern IP, noe vi ikke tillater for notebook servere i `knada-gcp` prosjektet.
:::
