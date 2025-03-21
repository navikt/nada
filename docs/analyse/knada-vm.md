# KNADA VM

Vi tilbyr private [virtuelle maskiner](https://cloud.google.com/compute/docs/instances) gjennom [Knorten](https://knorten.knada.io), disse kjører i GCP prosjektet `knada-gcp`.
Denne maskinen vil ha tilgang til on-premise kilder på lik linje som [Notebooks](./notebook/knada-notebook.md) og [Airflow](./airflow/knada-airflow.md) som kjører _i_ KNADA.

Siden dette er en privat maskin stiller vi høyere krav til bruk av maskinene.
Blant annet er du medansvarlig for å holde maskinen oppdatert!
Dette betyr at du må sette deg inn i hvordan man [vedlikeholder](#vedlikehold) en Debian GNU/Linux maskin.

Det samme gjelder for pakker og applikasjoner du installerer.
Du må selv aktivt holde disse oppdatert!

Hvis du syns dette blir for mye ansvar så anbefaler vi heller [Jupyter notebooks](../notebook/knada-notebook).

Som med Jupyter notebook har man muligheter til å laste ned data til lokal maskin, derfor må man være ekstra obs på at man ikke gjør noe utenfor det behandlingsgrunnlaget man har.

Man bør være bevist på hva man skriver _inn_ i terminalen (det man skriver _ut_ i terminalen forsvinner så fort man avslutter shellet).
For eksempel bør man ikke skrive brukernavn og passord direkte i terminalen, men heller bruke konfigurasjons-filer. Enda bedre er det å hente hemmeligheter fra [Google Secret Manager](https://cloud.google.com/secret-manager/docs).
Det kan også være fornuftig å konfigurere shellet til å slette historikken når man logger ut.
Hvis man bruker `bash` kan man legge til `history -c` i `.bash_logout`.

## Vedlikehold

For Debian (selve maskinen/OSet) så kan man lese [Keeping your Debian system up-to-date](https://www.debian.org/doc/manuals/debian-faq/uptodate.en.html), men i korte trekk handler det om å kjøre `aptitude update` etterfulgt av `aptitude full-upgrade`.
Dette vil holde OSet oppdatert, og oppdatere pakker installert via `aptitude` (aka `apt install`).

For å sikre oss at dette faktisk skjer, så går det en jobb natt til mandag som oppdatere alle maskiner som er _skrudd på_!
Er du en av de som er flink og skrur av maskinen din når du ikke bruker den, så må du dessverre selv påse at den blir oppdatert.

For Python bør man regelmessig kjøre `pip list --outdated` for å se hva slags pakker man trenger å oppgradere.
Enda bedre er å ha en `requirements.txt` (eller tilsvarende for Poetry eller lignende verktøy) sjekket inn i Github, og la [Dependabot](https://docs.github.com/en/code-security/dependabot) gjøre jobben.
Husk også å følge med på nye Python-versjoner!
Det finnes en god oversikt hos [Python developers guide](https://devguide.python.org/versions/).
Per dags dato bør *ingen* være på noe lavere enn 3.8, og man bør jobbe med å komme seg vekk fra 3.8 da den har EOL (end of life) oktober 2024.

## Koble til VM med SSH

For å koble deg til en VM i `knada-gcp` trenger du å opprette et SSH nøkkelpar og hente ut noe informasjon om instansen som må fylles inn i SSH-configen lokalt (`~/.ssh`).

1. Logg inn med `gcloud auth login` (trengs kun å kjøres en gang om dagen).
For å gjøre dette må gcloud være installer (se dokumentasjon hos [cloud.google.com](https://cloud.google.com/sdk/docs/install)).
2. Kjør kommandoen `gcloud compute ssh --project knada-gcp --zone europe-north1-b <instance>`.
Erstatt `<instance>` med navnet på VM instansen din, denne finner du etter du har logget inn i [Knorten](https://knorten.knada.io/oversikt) under `Compute`.
Denne kommandoen vil også generere SSH-nøkler.
3. Lukk terminalen fra (2) og kjør så kommandoen `gcloud compute ssh --project knada-gcp --zone europe-north1-b <instance> --dry-run` __**lokalt på maskinen din**__.
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
  ControlPersist 5m
```

Se SSH sin egen [dokumentasjon](https://man.openbsd.org/ssh_config.5) for mer informasjon om de forskjellige variablene.

## Trafikk ut av VM

Vi har tatt i bruk brannmurer for å hindre uønsket trafikk ut av VMene.
Dette er konfigurert via Terraform i [knada-gcp](https://github.com/navikt/knada-gcp), og vi tilbyr ikke en individuell løsning.
Derfor er vi litt mer restriktiv med hva vi åpner for.

Se [allowlisting#knadavm](https://github.com/navikt/knada-gcp/blob/main/modules/knadavm/main.tf) for en oversikt over åpningene vi tilbyr for Knada VM.

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

For å bruke python biblioteker til å lese fra postgres kreves det at drivere for det er installert på den virtuelle maskinen.
For å gjøre det enkelt for dere å komme i gang har vi lagd et script som må kjøres med root privilegier.

Kjør derfor først kommandoen:

```
sudo -i
```

#### Postgres

Trenger du Postgres, lim inn følgende i terminalen din:

```bash
apt-get update && apt-get install -yq --no-install-recommends libpq-dev
```
