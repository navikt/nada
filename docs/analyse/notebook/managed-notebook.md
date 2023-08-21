---
title: Google managed notebooks
---

> Vertex AI Workbench is a Jupyter notebook-based development environment for the entire data science workflow. 
> You can interact with Vertex AI and other Google Cloud services from within a Vertex AI Workbench instance's Jupyter notebook.

Du finner den offisielle dokumentasjonen for managed notebooks hos [cloud.google.com](https://cloud.google.com/vertex-ai/docs/workbench/introduction).

Nedenfor har vi et _forslag til innstillinger_ som passer for de fleste brukere.

Det er mange ulike konfigurasjonsmuligheter for notebooks og man står fritt til å sette de opp med de innstillingene man selv ønsker, men merk særlig det som presiseres under [maskintype og GPU](#maskintype-og-gpu).

Det er også kostnadsbesparende å [skru av notebooken](#stoppe-en-maskin) på slutten av arbeidsdagen med mindre man trenger å ha noe kjørende utenfor arbeidstid.

=== "Team-prosjekt notebook"

    !!! info inline end "Team-prosjekt"
        Dette vil være en notebook server som settes opp i GCP prosjektet til teamet ditt.
        Man kan til enhver tid se hvilke prosjekter man er medlem av ved å gå til [GCP Billing](https://console.cloud.google.com/billing/projects?project=&folder=&organizationId=139592330668).

    1. Velg riktig prosjekt for teamet ditt i [GCP Cloud console](https://console.cloud.google.com). Dette velger du i nedtrekksmenyen øverst til venstre.
    2. Gå så til [Vertex-AI/Workbench](https://console.cloud.google.com/vertex-ai/workbench/instances)
    3. Velg _New Notebook_ og velg _Customize_
    4. Under _Properties_, spesifiser følgende:
        - _Notebook name_ - Navn på kladdeboka
        - Velg region og zone i Europe
    5. Under _Environment_ spesifiser følgende
        - _Environment_ - med mindre man har spesielle behov kan man her velge et av Python-miljøene
    6. Under _Permission and security_
        - Under _Access to JupyterLab_ velg
            - _Single user only_ hvis det kun er du som skal ha tilgang til notebooken
            - _Service account_ hvis alle i teamet skal ha tilgang
    7. Trykk _Create_ nederst
    8. Når maskinen er ferdig laget, kan du finne og trykke på _Open Jupyterlab_ for din notebook fra [Workbench](https://console.cloud.google.com/vertex-ai/workbench/user-managed) for å få tilgang.

## Maskintype og GPU
Det er du som vet best hva du trenger, derfor er det ingen begrensninger på hva du kan velge av maskin og GPU.
Bare husk at det kan bli veldig kostbart hvis du lar en maskin (med mye minne og GPU) stå uten at den blir brukt.

Merk også at notebooks som kjører i regionen north/Finland ikke har tilgang til GPU.

## Stoppe en maskin
Vi anbefaler alle å stoppe maskinene utenom arbeidstid og når de ikke er i bruk.
Stopping er ikke det samme som sletting, så alt er der når du starter den opp igjen.

[Velg maskinen i Vertex AI](https://console.cloud.google.com/vertex-ai/workbench/instances) i oversikten og trykk _STOP_ i toppen.


## Slette en maskin
Har du en maskin du ikke trenger lenger, så kan du slette den.

[Velg maskinen i Vertex AI](https://console.cloud.google.com/vertex-ai/workbench/instances) i oversikten og trykk _DELETE_ i toppen.

## Installasjon av databasedrivere
For å bruke python biblioteker til å lese fra postgres og oracle kreves det at drivere for det er installert på notebook serveren. Dersom man bruker en [Knada Notebook](./knada-notebook.md) så kommer det miljøet man jobber i der allerede med disse driverne installert. Men dersom man jobber i en GCP Managed Notebook må man manuelt installere disse driverne.

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
