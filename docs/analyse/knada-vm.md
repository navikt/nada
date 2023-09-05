# KNADA VM

Vi tilbyr private [virtuelle maskiner](https://cloud.google.com/compute/docs/instances) gjennom [Knorten](https://knorten.knada.io), disse kjører i GCP prosjektet `knada-gcp`.
Denne maskinen vil ha tilgang til on-premise kilder på lik linje som [Notebooks](./notebook/knada-notebook.md) og [Airflow](./airflow/knada-airflow.md) som kjører _i_ KNADA.

## Koble til VM med SSH

For å koble deg til en VM i `knada-gcp` trenger du å opprette et SSH nøkkelpar og hente ut noe informasjon om instansen som må fylles inn i SSH-configen lokalt (`~/.ssh`).

1. Logg inn med `gcloud auth login --update-adc` (trengs kun å kjøres en gang om dagen).
For å gjøre dette må gcloud være installer (se dokumentasjon hos [cloud.google.com](https://cloud.google.com/sdk/docs/install)).
2. Kjør kommandoen `gcloud compute ssh --project knada-gcp --zone europe-north1-b <instance>`.
Erstatt `<instance>` med navnet på VM instansen din, denne finner du etter du har logget inn i [Knorten](https://knorten.knada.io/oversikt) under `Compute`.
Denne kommandoen vil også generere SSH-nøkler.
3. Kjør så kommandoen `gcloud compute ssh --project knada-gcp --zone europe-north1-b <instance> --dry-run`.
Erstatt `<instance>` med navnet på VM instansen din slik som i punkt (2).
4. Outputen fra kommandoen i (3) inneholder en del ting du trenger fylle inn i SSH-configen din.
Under er et eksempel på hvordan en slik SSH-config skal se ut.

=== "MAC"
    ````
    Host knada-vm
        HostName {HOSTNAME}
        IdentityFile ~/.ssh/google_compute_engine
        CheckHostIP no
        HostKeyAlias {HOSTNAME}
        IdentitiesOnly yes
        UserKnownHostsFile ~/.ssh/google_compute_known_hosts
        ProxyCommand {PROXYCOMMAND}
        ProxyUseFdpass no
        User {USERNAME}
    ````

    Erstatt {HOSTNAME}, {PROXYCOMMAND} og {USERNAME} med verdiene du får ut av dry-run kommandoen over og lagre filen under `~/.ssh/config`.
    Merk: {USERNAME} skal kun være det før `@` i output fra kommandoen over, {HOSTNAME} er det som begynner med `compute.` og {PROXYCOMMAND} er alt etter ProxyCommand til og med `--verbosity=warning`.

=== "Windows"
    ````
    Host knada-vm
        HostName {HOSTNAME}
        IdentityFile C:\\Users\\{USERNAME}\\.ssh\\google_compute_engine
        CheckHostIP no
        HostKeyAlias {HOSTNAME}
        IdentitiesOnly yes
        UserKnownHostsFile C:\\Users\\{USERNAME}\\.ssh\\google_compute_known_hosts
        ProxyCommand "C:\\Users\\{USERNAME}\\AppData\\Local\\Google\\Cloud SDK\\google-cloud-sdk\\bin\\..\\platform\\bundledpython\\python.exe" "-S" "C:\\Users\\{USERNAME}\\AppData\\Local\\Google\\Cloud SDK\\google-cloud-sdk\\lib\\gcloud.py" compute start-iap-tunnel {INSTANS} %p --listen-on-stdin --project=knada-gcp --zone=europe-north1-b --verbosity=warning
        ProxyUseFdpass no
        User {USERNAME}
    ````

    Erstatt {HOSTNAME}, {PROXYCOMMAND} og {USERNAME} med verdiene du får ut av dry-run kommandoen over og lagre filen under `~/.ssh/config`.
    Merk: {USERNAME} skal kun være det før `@` i output fra kommandoen over, {HOSTNAME} er det som begynner med `compute.` og {INSTANS} som du finner i [Knorten](https://knorten.knada.io/oversikt) under `Compute`.


### Fra VS Code

1. Installer extension `Remote - SSH` i VS Code.
2. I VS Code trykk cmnd+shift+P (mac) eller cntrl+shift+P (windows) og skriv inn og velg `Remote - SSH: Connect to host...` og velg så hosten `knada-vm`.

### Fra IntelliJ/Pycharm

1. I oppstartsvinduet velg `SSH` under `Remote Development`
2. Klikk `New Connection`
3. Åpne `SSH Configurations` ved å trykke på tannhjulet til høyre for `Connection` feltet
4. I `SSH Configurations` vinduet trykk `+` for å legge til en ny konfigurasjon.
5. Spesifiser så følgende og klikk `OK`
    - `Host` settes til `knada-vm`
    - `User name` settes til brukernavnet på maskinen din lokalt
    - `Authentication type` settes til `OpenSSH config and authentication agent`
6. Trykk på `Check Connection and Continue` (dette tar fort litt tid første gangen)
7. Når vinduet `Choose IDE and Project` dukker opp sett `Project directory`.
Dette skal settes til ditt hjemmeområde på serveren `/home/<brukernavn>`, trykk på browse ikonet til høyre for boksen for å lete det opp
8. Klikk så `Download and Start IDE`

### SSH multiplexing aka gjenbruk av koblinger

For å optimalisere tilkobling mot VMen kan man bruke SSH multiplexing.
Dette er kjekt mot KNADA VM for da man slipper å autentisere seg for hver tilkobling.
Med bruk av `ControlPersists` kan man si hvor lenge forbindelsen skal leve etter at man kobler fra siste gang.
Så hvis du SSH-er inn, skrur av tilkoblingen så vil du kunne starte VSCode innen 5 minutter og den vil kunne gjennbruke samme tilkobling.
Hvis man ikke ønsker at alle SSH tilkoblinger skal bruke multiplexing kan du bruke legge linjene (minus `Host *`) under `Host knada-vm`.

```
Host *
  ControlMaster auto
  ControlPath ~/.ssh/sockets/%r@%h-%p
  ControlPersist 300
```


## Oppsett av VM

### Python

Den virtuelle maskinen kommer med python 3.9 installert, men mangler installasjon av [pip]().
Installasjon av `pip` på VMen kan gjøres med

````bash
sudo apt install python3-pip
````

### R

R kan installeres som følger

````bash
sudo apt update -y && sudo apt install -y r-base
````

#### Nyttige R biblioteker for interaksjon med google APIer

- [gargle](https://gargle.r-lib.org/): Bibliotek for enklere håndtering av autentisering mot google APIer
- [googleCloudStorageR](https://cran.r-project.org/web/packages/googleCloudStorageR/vignettes/googleCloudStorageR.html): Bibliotek for å lese/skrive filer til `Google Cloud Storage`.
Se [eksempel](./eksempler.md#lese-fra-google-cloud-storage-bucket)
- [bigrquery](https://github.com/r-dbi/bigrquery): Bibliotek for å lese skrive data til `BigQuery`

Alle disse kan lastes ned og installeres av deg.

### Installasjon av databasedrivere

For å bruke python biblioteker til å lese fra postgres og oracle kreves det at drivere for det er installert på den virtuelle maskinen.
For å gjøre det enkelt for dere å komme i gang har vi lagd to scripts som begge må kjøres med root privilegier.

Kjør derfor først kommandoen:

```
sudo -i
```

#### Postgres

Trenger du Postgres, lim inn følgende i terminalen din:

```bash
apt-get update && apt-get install -yq --no-install-recommends libpq-dev
```

#### Oracle

1. Lag en tom fil og kall den setup_nb.sh
2. Lim inn følgene kodesnutt:

```bash
apt-get update && apt-get install -yq --no-install-recommends \
    build-essential \
    curl \
    alien \
    libaio1 \
    libaio-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

curl https://download.oracle.com/otn_software/linux/instantclient/219000/oracle-instantclient-basic-21.9.0.0.0-1.x86_64.rpm > /tmp/oracle-instantclient-basic-21.9.0.0.0-1.x86_64.rpm

alien -i /tmp/oracle-instantclient-basic-21.9.0.0.0-1.x86_64.rpm && \
    rm -rf /var/cache/yum && \
    rm -f /tmp/oracle-instantclient-basic-21.9.0.0.0-1.x86_64.rpm && \
    echo "/usr/lib/oracle/21.9/client64/lib" > /etc/ld.so.conf.d/oracle-instantclient21.9.conf && \
    /usr/sbin/ldconfig

PATH=$PATH:/usr/lib/oracle/21.9/client64/bin
```
3. Gjør scriptet/kodesnutten kjørbar:
```
chmod +x setup_nb.sh
sudo ./setup_nb.sh
```

!!! info "Nå vil skriptet installere versjon 21.9 av oracle klienten. Dersom du i stedet ønsker en annen versjon kan editere skriptet over med den versjonen du ønsker. Du finner en liste over tilgjengelige versjoner av oracle klienten [her](https://www.oracle.com/cis/database/technologies/instant-client/linux-x86-64-downloads.html)."

### Lese fra TDV

Hvis du skal lese TDV data fra VM i `knada-gcp` må du selv installere drivere og biblioteker som er nødvendig.
Dette kan gjøres som følger:

1. Last opp TDV driveren til VMen: Denne finnes i repoet [navikt/knada-images](https://github.com/navikt/knada-images) under `TDV/driver/libcomposite86_x64.so`.
Merk deg stien du lagrer denne driveren på da den må refereres til i steg 4.
2. Installer `unixodbc-dev`: `sudo apt-get install unixodbc-dev`
3. Installer python biblioteket `pyodbc`: `pip install pyodbc`
4. Følg eksempelet i [dataseksjonens guide](https://dataseksjonen.intern.nav.no/kompetanse/guider/hente_data_fra_tdv.html) for å lese fra TDV.
