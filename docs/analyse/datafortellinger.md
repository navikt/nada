---
title: Datafortelling
---
Datafortellinger brukes til å dele innsikt i form av statiske dokumenter.
Datafortellinger kan enkelt deles med andre i NAV gjennom Datamarkedsplassen.

## Installere Quarto

### Lokal maskin
Følge installasjonsoppskriften på [quarto.org/docs](https://quarto.org/docs/get-started/).
Husk å hold Quarto oppdatert.

### KNADA VM
Vi anbefaler å følge guiden [Tarball Installation On Linux](https://quarto.org/docs/download/tarball.html).
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

## Lage Quarto
Se [Get Started](https://quarto.org/docs/get-started/) på Quarto sine sider.

I eksemplene under må følgende byttes ut med reelle verdier:

- `${ENV}` 
    - For `knada` VMer og jupyter notebooks/airflow i `knada-clusteret` settes dette til *datamarkedsplassen.intern.dev.nav.no* for dev og *datamarkedsplassen.intern.nav.no* for prod
    - Ellers settes det til *data.ekstern.dev.nav.no* for dev og *data.nav.no* for prod
- `${STORY_ID}` - erstatt med ID på datafortellingen
- `${TEAM_TOKEN}` - erstatt med team-token fra Datamarkedsplassen
- `${TEAM_ID}` - erstatt med team ID for teamet ditt i [teamkatalogen](https://teamkatalog.intern.nav.no)

## Registrere Quarto i Datamarkedsplassen
Når man skal registrere en quarto datafortelling i [Datamarkedsplassen](https://data.intern.nav.no) kan man enten gjøre dette gjennom [brukergrensesnittet](#registrer-gjennom-brukergrensesnitt) eller [programmatisk](#registrer-programmatisk).

### Registrer gjennom brukergrensesnitt
1. Gå til [data.intern.nav.no](https://data.intern.nav.no) for prod eller [data.intern.dev.nav.no](https://data.intern.dev.nav.no) for dev.
2. Logg inn
3. Klikk hamburgermeny og velg `Legg til ny datafortelling`
4. Fyll inn metadata om datafortellingen
5. Velg fil(er) du ønsker å laste opp
6. Trykk `Lagre`

!!! info "Dersom du kun ønsker å registere en tom datafortelling som siden skal oppdateres programmatisk kan man droppe steg (5) over"

### Registrer programmatisk
Du kan også programmatisk registrere en datafortelling.

Request body parametere:

- `name` (obligatrisk): Navn på datafortellingen
- `description`: Beskrivelse av datafortellingen
- `teamID`: ID i [teamkatalogen](https://teamkatalog.nav.no) for teamet som eier datafortellingen. Nødvendig å spesifisere dersom datafortellingen skal sorteres riktig i produktområdevisningen på [data.intern.nav.no](https://data.intern.nav.no)
- `id`: Kan spesifiseres dersom du ønsker å spesifisere ID for datafortellingen selv. Dersom den utelates genereres det en ny.

Headers for requesten

- `bearer token` (obligatorisk): Team tokenet for teamet som skal eie datafortellingen

!!! info "Merk: IDen for datafortellingen blir returnert når man gjør en POST til `/quarto/create`. Denne må så brukes når datafortellingen skal oppdateres etterpå."

#### Med curl
```bash
$ curl -X POST \
    -d '{"name": "min datafortelling", "description": "min beskrivelse", "teamID": "<team-id>", "id": "${STORY_ID}"}' \
    -H "Authorization: Bearer ${TEAM_TOKEN}" \
    https://${ENV}/quarto/create
```

#### Med python
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

### Oppdater eksisterende Quarto
For å oppdatere en eksisterende Quarto fortelling må man først generere ressursfilene på nytt med `quarto render <file>`.

Deretter må man hente ut ID for Quartoen man ønsker å oppdatere og team-tokenet fra [Datamarkedsplassen](https://data.intern.nav.no).

Eksemplene tar utgangspunkt i at det er filen `index.html` som skal lastes opp og at man kjører kommandoene fra samme mappe som filen ligger.

#### Med curl

```bash
curl -X PUT -F index.html=@index.html \
    "https://${ENV}/quarto/update/${QUARTO_ID}" \
    -H "Authorization:Bearer ${TEAM_TOKEN}"
```

##### Flere filer

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

#### Med python

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

### Oppdatere Quarto med Naisjob

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

#### Andre eksempler med Naisjob
- [fia](https://github.com/navikt/fia-datafortelling): Mer avansert eksempel med produksjonssatt datafortelling
