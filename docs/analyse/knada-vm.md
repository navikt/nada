# KNADA VM
Du kan sette opp én [virtuell maskin](https://cloud.google.com/compute/docs/instances) per team i `knada-gcp` gjennom [Knorten](https://knorten.knada.io). Denne maskinen vil ha tilgang til on-premise kilder på lik linje som [Notebooks](./notebook/knada-notebook.md) og [Airflow](./airflow/knada-airflow.md).

!!! warn "Merk: Selv om hvert teammedlem får sitt eget hjemmeområde på den virtuelle maskinen vil alle ha tilgang til å aksessere hverandres områder da hvert teammedlem gis eier-rettigheter for VMen."

## Koble til VM i knada-gcp fra VS Code lokalt

Du kan koble deg til VMen med SSH fra VS Code lokalt som følger:

1. Installer extension `Remote - SSH` i VS Code.
2. Hvis du ikke har gjort det i dag, kjør kommandoen `gcloud auth login --update-adc`. Hvis dette ikke fungerer last ned gcloud CLI https://cloud.google.com/sdk/docs/install-sdk og prøv igjen.
3. Kjør kommandoen `gcloud compute ssh --project knada-gcp --zone europe-west1-b <instance>` Erstatt `<instance>` med navnet på VM instansen din, denne finner du for teamet ditt på `oversikt` siden i [Knorten](https://knorten.knada.io/oversikt) under `Compute`. Denne kommandoen vil også generere SSH nøkler.
4. Kjør så kommandoen `gcloud compute ssh --project knada-gcp --zone europe-west1-b <instance> --dry-run`. Erstatt `<instance>` med navnet på VM instansen din slik som i punkt 4.
5. Outputen fra kommandoen i (4) inneholder en del ting du trenger fylle inn i ssh-configen din. Under er et eksempel på hvordan en slik ssh config skal se ut.
````
Host knada-vm
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
Erstatt ${HOSTNAME}, ${PROXYCOMMAND} og ${USERNAME} med verdiene du får ut av dry-run kommandoen over og lagre filen under `~/.ssh/config`. Merk: ${USERNAME} skal kun være det før `@` i output fra kommandoen over, ${HOSTNAME} er det som begynner med `compute.` og ${PROXYCOMMAND} er alt etter ProxyCommand til --verbosity=warning. 

I VS Code trykk cmnd+shift+P (mac) eller cntrl+shift+P (windows) og skriv inn og velg `Remote - SSH: Connect to host...` og velg så hosten `knada-vm`.

I [denne guiden](https://medium.com/@albert.brand/remote-to-a-vm-over-an-iap-tunnel-with-vscode-f9fb54676153) dokumenterer de hvordan denne ssh-configen kan fylles ut automagisk når man legger til en ny host i VS Code. Gjør man dette må man alikevel inn å manuelt endre ting i ssh configen i etterkant, så det anbefales å ta utgangspunkt i eksempelet i punkt 5 over når ssh configen skal lages.

## Installasjon av databasedrivere
For å bruke python biblioteker til å lese fra postgres og oracle kreves det at drivere for det er installert på notebook serveren.

For å gjøre det enkelt for dere å komme i gang har vi lagd to scripts som begge må kjøres med root privilegier.

Kjør derfor først kommandoen:
```
sudo -i
```

### Postgres
Trenger du Postgres, lim inn følgende i terminalen din:
```bash
apt-get update && apt-get install -yq --no-install-recommends libpq-dev
```

### Oracle
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

curl https://download.oracle.com/otn_software/linux/instantclient/215000/oracle-instantclient-basic-21.9.0.0.0-1.x86_64.rpm > /tmp/oracle-instantclient-basic-21.9.0.0.0-1.x86_64.rpm

alien -i /tmp/oracle-instantclient-basic-21.9.0.0.0-1.x86_64.rpm && \
    rm -rf /var/cache/yum && \
    rm -f /tmp/oracle-instantclient-basic-21.9.0.0.0-1.x86_64.rpm && \
    echo "/usr/lib/oracle/21.9/client64/lib" > /etc/ld.so.conf.d/oracle-instantclient21.9.conf && \
    /usr/sbin/ldconfig

PATH=$PATH:/usr/lib/oracle/21.9/client64/bin
```

!!! info "Nå vil skriptet installere versjon 21.9 av oracle klienten. Dersom du i stedet ønsker en annen versjon kan editere skriptet over med den versjonen du ønsker. Du finner en liste over tilgjengelige versjoner av oracle klienten [her](https://www.oracle.com/cis/database/technologies/instant-client/linux-x86-64-downloads.html)."

### Lese fra TDV
Hvis du skal lese TDV data fra VM i `knada-gcp` må du selv installere drivere og biblioteker som er nødvendig. Dette kan gjøres som følger:

1. Last opp TDV driveren til VMen: Denne finnes i repoet [navikt/knada-tdv](https://github.com/navikt/knada-tdv) (`libcomposite85_x64.so`). Merk deg stien du lagrer denne driveren på da den må refereres til i steg 4.
2. Installer `unixodbc-dev`: `sudo apt-get install unixodbc-dev`
3. Installer python biblioteket `pyodbc`: `pip install pyodbc`
4. Følg eksempelet i [dataseksjonens guide](https://reimagined-umbrella-50bfbf70.pages.github.io/kompetanse/guider/hente_data_fra_tdv.html) for å lese fra TDV.