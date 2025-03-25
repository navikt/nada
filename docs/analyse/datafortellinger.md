---
title: Datafortelling
---
Datafortellinger brukes til å dele innsikt i form av statiske dokumenter.
Datafortellinger kan enkelt deles med andre i NAV gjennom Datamarkedsplassen.

## Installere Quarto

### Lokal maskin
Følge installasjonsoppskriften på [quarto.org/docs](https://quarto.org/docs/get-started/).
Husk å hold Quarto oppdatert.

### Knast
Vi anbefaler å følge guiden [Tarball Installation On Linux](https://quarto.org/docs/download/tarball.html). For å laste ned binæren trenger du følgende åpninger:
- github.com/quarto-dev/quarto-cli/releases/download/*
- objects.githubusercontent.com/*

Igjen må man selv huske å holde Quarto oppdatert.

### Docker image
Vi anbefaler å bruke kommandoen nedenfor i din `Dockerfile` for å installere Quarto.
Denne vil hente ned siste versjon av Quarto hver gang Docker-imaget blir bygd.

```
# jq, wget, og tar må være installert for at kommandoen nedenfor skal fungere
RUN cd /app && \
    QUARTO_VERSION=$(curl https://api.github.com/repos/quarto-dev/quarto-cli/releases/latest | jq '.tag_name' | sed -e 's/[\"v]//g') && \
    wget https://github.com/quarto-dev/quarto-cli/releases/download/v${QUARTO_VERSION}/quarto-${QUARTO_VERSION}-linux-amd64.tar.gz && \
    tar -zxvf quarto-${QUARTO_VERSION}-linux-amd64.tar.gz && \
    mv /app/quarto-${QUARTO_VERSION} /app/quarto
ENV PATH="${PATH}:/app/quarto/bin"
```

## Team tokens
For å programmatisk lage eller oppdatere datafortellinger trenger man å autentisere seg med et team token. For å finne team token for teamene du er medlem av kan du gå til [Mine team tokens](https://data.ansatt.nav.no/user/tokens) i Datamarkedsplassen (krever innlogging). Det er forskjellig tokens for dev og prod, så dersom du ønsker å lage eller oppdatere en datafortelling i dev finner du tokens [i dev versjonen](https://data.intern.dev.nav.no/user/tokens) av Datamarkedsplassen. Samme token brukes både for intern og ekstern publisering av datafortellinger.

### Rotere token
Dersom du har behov for å rotere team tokenet til et av teamene dine (f.eks. dersom du har eksponert tokenet ved et uhell) kan dette gjøres fra [Mine team tokens](https://data.ansatt.nav.no/user/tokens) i Datamarkedsplassen.

## Lage Datafortelling
Man kan publisere datafortellinger enten [internt](#internt) for NAV ansatte eller [eksternt](#eksternt).

### Internt
For datafortellinger som kun skal være tilgjengelig for ansatte i NAV kan kan man publisere denne til den interne [datamarkedsplassen](https://data.ansatt.nav.no).

I eksemplene som følger må følgende byttes ut med reelle verdier:

- `${ENV}` 
    - For `knada` VMer og jupyter notebooks/airflow i `knada-clusteret` settes dette til *datamarkedsplassen.intern.dev.nav.no* for dev og *datamarkedsplassen.intern.nav.no* for prod
    - Ellers settes det til *data.ekstern.dev.nav.no* for dev og *data.nav.no* for prod
- `${STORY_ID}` - erstatt med ID på datafortellingen
- `${TEAM_TOKEN}` - erstatt med team-token fra Datamarkedsplassen
- `${TEAM_ID}` - erstatt med team ID for teamet ditt i [teamkatalogen](https://teamkatalog.intern.nav.no)

Se [Get Started](https://quarto.org/docs/get-started/) på Quarto sine sider for å komme i gang med utvikling av datafortellingen.

#### Registrere Quarto i Datamarkedsplassen
Når man skal registrere en quarto datafortelling i [Datamarkedsplassen](https://data.ansatt.nav.no) kan man enten gjøre dette gjennom [brukergrensesnittet](#registrer-gjennom-brukergrensesnitt) eller [programmatisk](#registrer-programmatisk).

##### Registrer gjennom brukergrensesnitt
1. Gå til [data.ansatt.nav.no](https://data.ansatt.nav.no) for prod eller [data.intern.dev.nav.no](https://data.intern.dev.nav.no) for dev.
2. Logg inn
3. Klikk hamburgermeny og velg `Legg til ny datafortelling`
4. Fyll inn metadata om datafortellingen
5. Velg fil(er) du ønsker å laste opp
6. Trykk `Lagre`

!!! info "Dersom du kun ønsker å registere en tom datafortelling som siden skal oppdateres programmatisk kan man droppe steg (5) over"

##### Registrer programmatisk
Du kan også programmatisk registrere en datafortelling.

Request body parametere:

- `name` (obligatrisk): Navn på datafortellingen
- `description`: Beskrivelse av datafortellingen
- `teamID`: ID i [teamkatalogen](https://teamkatalog.nav.no) for teamet som eier datafortellingen. Nødvendig å spesifisere dersom datafortellingen skal sorteres riktig i produktområdevisningen på [data.ansatt.nav.no](https://data.ansatt.nav.no)
- `id`: Kan spesifiseres dersom du ønsker å spesifisere ID for datafortellingen selv. Dersom den utelates genereres det en ny.

Headers for requesten

- `bearer token` (obligatorisk): Team tokenet for teamet som skal eie datafortellingen

!!! info "Merk: IDen for datafortellingen blir returnert når man gjør en POST til `/quarto/create`. Denne må så brukes når datafortellingen skal oppdateres etterpå."

###### Med curl
```bash
$ curl -X POST \
    -d '{"name": "min datafortelling", "description": "min beskrivelse", "teamID": "<team-id>", "id": "${STORY_ID}"}' \
    -H "Authorization: Bearer ${TEAM_TOKEN}" \
    https://${ENV}/quarto/create
```

###### Med python
```python
import requests

res = requests.post(f"https://${ENV}/quarto/create", headers={"Authorization": "bearer ${TEAM_TOKEN}"}, json={
    "name": "min quarto",
    "description": "min beskrivelse",
    "teamID": "<team-id>",
    "id": "${STORY_ID}"
})

story_id = res.json()["id"]
```

#### Oppdater eksisterende intern datafortelling
For å oppdatere en eksisterende Quarto fortelling må man først generere ressursfilene på nytt med `quarto render <file>`.

Deretter må man hente ut ID for Quartoen man ønsker å oppdatere og team-tokenet fra [Datamarkedsplassen](https://data.ansatt.nav.no).

Eksemplene tar utgangspunkt i at det er filen `index.html` som skal lastes opp og at man kjører kommandoene fra samme mappe som filen ligger.

##### Med curl

```bash
curl -X PUT -F index.html=@index.html \
    "https://${ENV}/quarto/update/${QUARTO_ID}" \
    -H "Authorization:Bearer ${TEAM_TOKEN}"
```

###### Flere filer

```bash
#!/bin/bash
set -e

FILES=""
for file in <mappe med filene>/*
do
  FILES+=" -F $file=@$file"
done

curl -X PUT $FILES "https://${ENV}/quarto/update/${QUARTO_ID}" \
    -H "Authorization:Bearer ${TEAM_TOKEN}"
```

##### Med python

```python
import os
import requests

# A list of file paths to be uploaded
files_to_upload = [
    "PATH/index.html"
    "PATH/SUB/FOLDER/some.html"
]

multipart_form_data = {}
for file_path in files_to_upload:
    file_name = os.path.basename(file_path)
    with open(file_path, 'rb') as file:
        # Read the file contents and store them in the dictionary
        file_contents = file.read()
        multipart_form_data[file_name] = (file_name, file_contents)

# Send the request with all files in the dictionary
response = requests.put( f"https://{ENV}/quarto/update/{QUARTO_ID}", 
                        headers={"Authorization": f"Bearer {TEAM_TOKEN}"},
                        files=multipart_form_data)
response.raise_for_status()
```

#### Oppdatere Quarto med Naisjob

For å produksjonsette oppdatering av en Quarto Datafortelling med Naisjob er det noe konfigurasjon man må spesifisere i NAIS manifestet og Dockerfilen til jobben.

- `quarto render` resulterer i at det genereres noen filer som må lagres midlertidig i containermiljøet før publisering til Datamarkedsplassen. Man er derfor nødt til å legge til annotasjon i Naisjob manifestet for å tillate skriving til filsystemet i containeren
````yaml
metadata:
  annotations:
    nais.io/read-only-file-system: "false"
````
- All utgående trafikk fra Naisjobben vil by default stoppes, så man må legge til en outbound access policy til Markedsplass hosten man skal publisere til (dev/prod)
````yaml
spec:
  accessPolicy:
    outbound:
      external:
        - host: data.ekstern.dev.nav.no # for dev
        - host: data.nav.no # for prod
````
- I Dockerfilen må man lage en bruker med userid 1069 å velge denne brukeren
````Dockerfile
RUN groupadd -g 1069 python && \
    useradd -r -u 1069 -g python python

USER python
````

Repoet [navikt/nada-quarto](https://github.com/navikt/nada-quarto) har et fullstendig eksempel nødvendig oppsett, se spesielt

- [Naisjob manifest](https://github.com/navikt/nada-quarto/blob/main/naisjob.yaml)
- [Dockerfile](https://github.com/navikt/nada-quarto/blob/main/Dockerfile)
- [Publiseringsskript](https://github.com/navikt/nada-quarto/blob/main/publish.sh)
- [Nødvendige python biblioteker som må installeres](https://github.com/navikt/nada-quarto/blob/main/requirements.txt)

I eksempelet hentes team-tokenet fra en [kubernetes secret](https://kubernetes.io/docs/concepts/configuration/secret/) i clusteret og settes som miljøvariabelen `NADA_TOKEN`.

##### Andre eksempler med Naisjob

- [fia](https://github.com/navikt/fia-datafortelling): Mer avansert eksempel med produksjonssatt datafortelling

### Eksternt
Følgende beskriver hvordan man kan publisere datafortellinger eksternt på `data.nav.no`.

For eksempler på datafortellinger publisert eksternt, se:

- [NAVs omverdensanalyse 2023–2035](https://data.nav.no/fortelling/omverdensanalyse) 
    - repo: [navikt/oma_2023](https://github.com/navikt/oma_2023)
- [Utviklingstrekk i Folketrygden](https://data.nav.no/fortelling/utviklingstrekkfolketrygden)
    - repo: [navikt/Utviklingstrekk](https://github.com/navikt/Utviklingstrekk)
- [Veileder for generativ kunstig intelligens](https://data.nav.no/fortelling/ki)
    - repo: [navikt/GKI-veil-bakgrunn](https://github.com/navikt/GKI-veil-bakgrunn)

I eksemplene som følger må følgende byttes ut med reelle verdier:

- `${ENV}` 
    - *data.ekstern.dev.nav.no* for dev og *data.nav.no* for prod
- `${STORY_ID}` - erstatt med ID på datafortellingen
- `${TEAM_TOKEN}` - erstatt med team-token fra Datamarkedsplassen

#### Registere ekstern datafortelling
Vi støtter foreløpig kun programmatisk registrering av eksterne datafortellinger.

Request body parametere:

- `title`: Navn på datafortellingen
- `slug`: Dersom du selv ønsker å bestemme `slug` i URLen til datafortellingen
- `team`: Navn på teamet som eier datafortellingen. Dette tilsvarer navnet som gjelder for tokenet du henter fra https://data.ansatt.nav.no/user/tokens (eventuelt https://data.intern.dev.nav.no/user/tokens for dev)
- `published`: Dette flagget indikerer om datafortellingen skal listes opp på index siden til `data.nav.no`.

Dersom en ikke oppgir verken `title` eller `slug` når datafortellingen registreres så vil det være den genererte UUIDen til datafortellingen som vil brukes for URLen til datafortellingen.

Headers for requesten

- `bearer token` (obligatorisk): Team tokenet for teamet som skal eie datafortellingen

!!! info "Merk: IDen for den genererte datafortellingen blir returnert når man gjør en POST til `/api/v1/story`. Denne må så brukes når datafortellingen skal oppdateres senere."

##### Med curl
```bash
$ curl -X POST \
    -d '{"title": "Min datafortelling om noe", "slug": "min-datafortelling", "team": "<team-navn>"}' \
    -H "Authorization: Bearer ${TEAM_TOKEN}" \
    https://${ENV}/api/v1/story
```

##### Med python
```python
import requests

res = requests.post(f"https://${ENV}/api/v1/story", headers={"Authorization": "bearer ${TEAM_TOKEN}"}, json={
    "title": "Min datafortelling om noe",
    "slug": "min-datafortelling",
    "team": "<team-navn>"
})

story_id = res.json()["id"]
```

#### Oppdatere en ekstern datafortelling

##### Med curl
```bash
curl -X PUT -F index.html=@index.html \
    "https://${ENV}/api/v1/story/${STORY_ID}" \
    -H "Authorization:Bearer ${TEAM_TOKEN}"
```

###### Flere filer

```bash
#!/bin/bash
set -e

FILES=""
for file in <mappe med filene>/*
do
  FILES+=" -F $file=@$file"
done

curl -X PUT $FILES "https://${ENV}/api/v1/story/${STORY_ID}" \
    -H "Authorization:Bearer ${TEAM_TOKEN}"
```

##### Med python

```python
import os
import requests

# A list of file paths to be uploaded
files_to_upload = [
    "PATH/index.html"
    "PATH/SUB/FOLDER/some.html"
]

multipart_form_data = {}
for file_path in files_to_upload:
    file_name = os.path.basename(file_path)
    with open(file_path, 'rb') as file:
        # Read the file contents and store them in the dictionary
        file_contents = file.read()
        multipart_form_data[file_name] = (file_name, file_contents)

# Send the request with all files in the dictionary
response = requests.put( f"https://{ENV}/api/v1/story/{STORY_ID}", 
                        headers={"Authorization": f"Bearer {TEAM_TOKEN}"},
                        files=multipart_form_data)
response.raise_for_status()
```

### Oppdatere datafortelling med GitHub action
Vi har laget en egen GitHub action - [navikt/story-upload](https://github.com/navikt/story-upload) - som kan brukes dersom man ønsker å lagre datafortellingen sin i et GitHub repo. 
Denne actionen vil publisere innholdet til en [gcs bucket](https://cloud.google.com/storage/docs/buckets) som NADA hoster datafortellinger fra. 
Man kan bruke actionen til å publisere både interne datafortellinger på `data.ansatt.nav.no` og eksterne datafortellinger på `data.nav.no`.

!!! info "Se [README for github action](https://github.com/navikt/story-upload/blob/main/README.md#example-usage) for beskrivelse av de ulike konfigurerbare input parameterene til actionen"

Under er et eksempel på hvordan å sette opp en enkel github action workflow som oppdaterer en datafortelling __**internt i dev løsningen til datamarkedsplassen**__ (dvs. `data.intern.dev.nav.no`) ved hver push til `main`.
For å bruke actionen må det eksistere en datafortelling som man ønsker å oppdatere. Dersom det ikke finnes en datafortelling så må denne registeres først, se [her](#registrere-quarto-i-datamarkedsplassen) for å registrere en intern datafortelling, eller [her](#registere-datafortelling) for å registrere en ekstern. 


Erstatt `${STORY_ID}` i eksempelet med IDen på datafortellingen du ønsker å oppdatere. Eksempelet tar også utgangspunkt i at team tokenet for teamet som eier datafortellingen er lagt inn som [secret på github repoet](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions#creating-secrets-for-an-environment) med nøkkel `TEAM_TOKEN`. 
Token for teamet ditt finner du ved å gå til https://data.ansatt.nav.no/user/tokens (eventuelt https://data.intern.dev.nav.no/user/tokens for dev).

```yaml
name: Eksempel på opplasting av datafortelling

on: 
  push:
    branches:
      - main

jobs:
  oppdater-datafortelling:
    name: Oppdater datafortelling
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: navikt/story-upload@v1
        with:
          id: ${STORY_ID}
          dir: src
          team_token: ${{ secrets.TEAM_TOKEN }}
          env: dev
          public: "false"
```

### Knatch
[Knatch](https://github.com/navikt/knatch) - Knada batch - er et kommandolinjeverktøy tiltenkt å forenkle opplasting av datafortellinger til både den [interne datamarkedsplassen](https://data.ansatt.nav.no) og eksterne datafortellinger på `data.nav.no`.

Det er særlig nyttig i tilfeller hvor en ønsker å laste opp datafortellinger som består av flere filer da `knatch` tar som inputargument en mappe og vil automatisk dele opp filene i mappen og laste de opp i batcher til datamarkedsplassen. Størrelsen på batchene kan du spesifisere med flagget `--batch-size`, dersom det utelates vil datafortellingen lastes opp i batcher på 10 filer.

#### Installasjon
```bash
pip install knatch
```

#### Eksempler på bruk
`Knatch` kan brukes til å oppdatere en datafortelling både [internt i NAV](#publisering-til-intern-markedsplass) og [eksternt](#publisering-eksternt).

Begge eksemplene tar utgangspunkt i følgende:

- Du har allerede opprettet en datafortelling du ønsker å oppdatere, se [her](#registrere-quarto-i-datamarkedsplassen) for å registrere en intern datafortelling, eller [her](#registere-datafortelling) for å registrere en ekstern. Erstatt `<id>` i eksemplene under med IDen til den eksisterende datafortellingen.
- Du har hentet ut team tokenet for teamet som eier datafortellingen. Erstatt `<token>` i eksemplene under med dette tokenet.

##### Publisering til intern markedsplass
I eksempelet under publiseres det til dev-løsingen til den __**interne**__ datamarkedsplassen (`datamarkedsplassen.intern.dev.nav.no`). Dersom en i stedet ønsker å publisere til prod så må `--host` flagget settes til `datamarkedsplassen.intern.nav.no`.

```bash
knatch <id> sti/til/mappe/med/filer <token> --host datamarkedsplassen.intern.dev.nav.no
```


##### Publisering eksternt
I eksempelet under publiseres det til dev-løsingen for ekstern publisering (`data.ekstern.dev.nav.no`). Dersom en i stedet ønsker å publisere til prod så må `--host` flagget settes til `data.nav.no`.

```bash
knatch <id> sti/til/mappe/med/filer <token> --host data.ekstern.dev.nav.no --path api/v1/story
```
