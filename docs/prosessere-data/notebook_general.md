
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

!!! warning "Stegene over vil ikke fungere for PyCharm og andre JetBrains IDEer da disse krever at GCP-VMen du kobler deg til har en ekstern IP, noe vi ikke tillater for notebook servere i `knada-gcp` prosjektet."

## Lese fra TDV i notebook miljø
Hvis du skal lese TDV data fra notebook i `knada-gcp` prosjektet må du selv installere drivere og biblioteker som er nødvendig. Dette kan gjøres som følger:

1. Last opp TDV driveren til notebook serveren: Denne finnes i repoet [navikt/knada-tdv](https://github.com/navikt/knada-tdv) (`libcomposite85_x64.so`). Merk deg stien du lagrer denne driveren på da den må refereres til i steg 4.
2. Fra terminal på notebook server, installer `unixodbc-dev`: `sudo apt-get install unixodbc-dev`
3. Fra terminal på notebook server, installer python biblioteket `pyodbc`: `pip install pyodbc`
4. Følg eksempelet i [dataseksjonens guide](https://reimagined-umbrella-50bfbf70.pages.github.io/kompetanse/guider/hente_data_fra_tdv.html) for å lese fra TDV.

!!! info "Steg 1-3 over er ikke nødvendig dersom man jobber fra en onprem jupyterhub da disse har installert drivere og biblioteker fra før dersom man velger `Jupyterlab JKBL edition` når man starter notebook serveren."
