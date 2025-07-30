## Python med uv

Vi oppfordrer brukere av Knast maskiner å bruke [uv](https://github.com/astral-sh/uv) for oppsett av virtuelle python miljøer og installasjon av pakker.
Under følger en oppskrift for å sette opp et slikt virtuelt miljø for å kunne kjøre python kode i en isolert kontekst.
For mer informasjon om `uv`, se [deres dokumentasjon](https://docs.astral.sh/uv/).

### Opprettelse et nytt virtuelt miljø med spesifisert python versjon

!!!info "Merk for å installere en annen python versjon kan det være at du må tillate utgående trafikk for å hente ressursene du trenger. Denne allowlistingen gjør du selv for [Knast maskinen din i datamarkedsplassen](https://data.ansatt.nav.no/user/workstation) under `Åpninger mot internett` fanen. Hvis det ikke kommer tydelig frem av feilmeldingen hvilke hoster du ikke når vil du i denne fanen også kunne se alle blokkerte nettverkskall gjort fra maskinen din mot internett."

```bash
# Setter opp et nytt venv og installerer python 3.11
uv venv --python 3.11 myvenv

# Aktiverer det virtuelle miljøet i gjeldende shell
source myvenv/bin/activate
```

### Låsing og installasjon av avhengigheter i virtuelt miljø

Tar her utgangspunkt i at bruker har en requirements fil som heter `requirements.in` som inneholder en liste over avhengighetene det er behov for.

```bash
# Låser avhengigheter og lagrer i requirements.txt
uv pip compile requirements.in -o requirements.txt

# Installerer avhengigheter fra requirements.txt
uv pip sync requirements.txt
```

### Bruke det virtuelle miljøet i en notebook-kontekst

For å bruke det virtuelle miljøet for notebooken konteksten din velger du `Select another kernel` -> `Python environments` -> `myvenv`.

Hvis ikke det virtuelle miljøet dukker opp i listen over kan du legge til det manuelt ved å kjøre følgende kommando:

```bash
ipython kernel install --name myvenv --user
```

### Vedlikehold av Python-pakker og versjoner

Man bør regelmessig kjøre `uv pip list --outdated` for å se hva slags pakker man trenger å oppgradere. Enda bedre er å ha en `requirements.txt` (eller tilsvarende for Poetry eller lignende verktøy) sjekket inn i Github, og la Dependabot gjøre jobben. Husk også å følge med på nye Python-versjoner! Det finnes en god oversikt hos [Python developers guide](https://devguide.python.org/). Per dags dato bør ingen være på noe lavere enn 3.9, og man bør jobbe med å komme seg vekk fra 3.9 da den har EOL (end of life) oktober 2025.

## Autentisering mot GitHub

Vi anbefaler å bruke [gh cli](https://cli.github.com/manual/) for å autentisere seg mot GitHub.
Dette kommandolinjeverktøyet kommer preinstallert i Knast-miljøet ditt.
For å autentisere deg mot GitHub kjører du `gh auth login` fra en terminal på Knast-maskinen din og følger instruksjonene som kommer opp.

## GitHub Copilot

!!!info "GitHub Copilot fungerer, men GitHub Copilot Chat støttes foreløpig ikke."

Brannmuråpninger er allerede inkludert i de sentralt administrerte åpningene, så om du bruker disse, så skal det være OK.

I tillegg må du sørge for at extensions bruker proxy. Gå til `File->Preferences->Settings` og søk etter `http.proxySupport`. Denne må du sette til `on`.

Høyreklikk på tannhjulet nederst til venstre og huk av for `Accounts`. Nå skal du kunne trykke på ikonet som dukker opp over tannhjulet og velge `Sign in to GitHub to use GitHub Copilot ` og deretter følge anvisningene nederst i høyre hjørne. Når du er innlogget i GitHub, så skal Copilot fungere.
