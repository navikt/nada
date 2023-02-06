---
title: Jupyterhub
---

For analyser så anbefaler Dataplattform at man bruker [Jupyter notebooks](https://jupyter.org/).

Din JupyterHub blir lagd basert på en konfigurasjon i [navikt/knada-jupyterhub](https://github.com/navikt/knada-jupyterhub)-repoet.
I repoet kan du legge til din egen konfigurasjon i `/configs` katalogen. 

For å kunne sette opp en ny hub må man lage en Pull Request til dette repoet.
Da vil man også få generert en kryptert nøkkel som brukes av JupyterHub internt.
Derfor er det viktig at man har linjeskift på slutten av konfigurasjonen.

Ved hver ny pull request (og endringer) blir sjekker kjørt automatisk.
Når disse sjekkene er godkjente (lyser grønt) og du har fått en approval fra én av kodeeierne, kan du merge inn endringen.

Nedenfor ser du et eksempel på det man minimum trenger å fylle ut.
Med denne konfigurasjonen får man en hub med 2GB minne, og 0.5 CPU.
Hub-en kan nåes på `https://kyrre.jupyter.adeo.no` og det er kun bruker `e152435` som kan logge inn.

`/configs/kyrre.yaml`
```
namespace: kyrre-havik-eriksen
ingress: kyrre
users:
  - e152435
```

Alle verdier kan endres etter behov.

## Konfigurasjon

### Namespace
Hvilket `namespace` hub-en skal kjøre i.
Endrer du denne vil det bli opprettet en ny hub, og den gamle vil fortsatt leve.
Se [Slette en hub](#slette-en-hub) nedenfor hvis du bytter namespace.

### Ingress
Hvilken adresse du kan nå hub-en på.
Det du setter i `ingress` blir slått sammen med `.jupyter.adeo.no`.

### Users
Dette er en liste over hvem som skal ha tilgang til å kunne logge inn på hub-en.
Her bruker vi NAV-identen (med små bokstaver).

### Egne miljøvariabler
Har du behov for egne miljøvariabler, kan de legges under `extraEnvs` i konfigurasjonen din:
```
extraEnvs:
  - "hello: world"
```

Hver linje må starte med `-`/bindestrek, og være innen for anførselstegn.
Dette fordi den blir tolket som en ren streng, og ikke som en nøkkel og verdi.

### Jupyter i stedet for JupyterLabs
Om du ønsker å bruke Jupyter i stedet for JupyterLabs kan du legge til følgende i konfigurasjonen din:
```
jupyterLabs: false
```

### Endre ressurser
Har du behov for mer/mindre ressurser enn det som er default, kan du bruke variablene `memoryLimit` og `cpuLimit` i din konfigurasjon.

```
memoryLimit: 10GB
cpuLimit: 1
```

Hvis jupyterhub serveren du endrer ressurskonfigurasjonen for kjører når du endrer `memoryLimit`/`cpuLimit` må du restarte serveren 
for at endringene skal tre i kraft. For å restarte serveren se [Restarte jupyterhub server](#restarte-jupyterhub-server)

!!! info "Jupyterhub følger strengt med på hvor mye ressurser du bruker, og vil drepe kernel hvis du bruker mer enn du har bedt om."


## Restarte jupyterhub server
For å restarte serveren gjøres følgende:

1. Gå til `https://<ingress>.jupyter.adeo.no/home`
2. Trykk `Stop My Server`
3. Når du igjen får muligheten til å starte serveren trykker du `Start My Server`

## Slette en hub
Vi har ingen automatikk for sletting av hub-er, så dette må gjøres manuelt av en av administratorene.
Ta kontakt i [#knada](https://nav-it.slack.com/archives/CGRMQHT50).

## Fjerne brukere
For å fjerne brukere fra et jupyterhub namespace gjør som følger:

- Fjern identen(e) fra `users` listen i konfigurasjonsfilen under `/config` i [iac-repoet](https://github.com/navikt/knada-jupyterhub)
- Logg inn på hubens admin side (`https://<ingress>.jupyter.adeo.no/hub/admin`) og slett brukeren(e) fra databasen.

## Remote Jupyterhub tilkoblingen
Ønsker du å koble til remote Jupyterhub fra Visual Studio Code lokalt, gjør som følger:

### Lag Jupyterhub API token
1. Gå til `https://<ingress>.jupyter.adeo.no/home`
2. Trykk `token` øverst til venstre
3. Trykk `Request new API token`
4. Lagre det genererte tokenet lokalt

### Koble til fra Visual Studio Code
Når du har laget et API token kan du koble deg til Jupyterhub serveren.

1. Installer Jupyter extension for Visual Studio Code
![Jupyter extension](/img/jupyter-extension.png)
2. Trykk `cntrl+shift+P` (windows) eller `cmd+shift+P` (mac)
3. Søk etter `Jupyter: Specify local or remote Jupyter server for connections`
4. Velg `Existing`
5. Skriv inn URIen til den kjørende jupytehrub serveren, 
dvs. `https://<ingress>.jupyter.adeo.no/user/<nav-ident>/?token=<token>`. Erstatt ingress og NAV ident, og token med 
tokenet generert i [Create Jupyterhub API token](#create-jupyterhub-api-token)
6. Logg inn med NAV ident og passord
