---
title: Datafortelling
---
Datafortellinger brukes til å dele innsikt i form av statiske dokumenter.
Datafortellinger kan kan enkelt deles med andre i NAV gjennom Markedsplassen.

## Lage quarto
Se dokumentasjon på [Quarto sine sider](https://quarto.org).

## Oppdater eksisterende Quarto
For å oppdatere en eksisterende Quarto fortelling må man først generere ressursfilene på nytt med `quarto render <file>`.

Deretter må man hente ut ID for Quartoen man ønsker å oppdatere og team-tokenet fra [markedsplassen](https://data.intern.nav.no).

I eksemplene under må følgende byttes ut med reelle verdier:

- `${ENV}` 
    - For `knada` VMer og jupyter notebooks/airflow i `knada-clusteret` settes dette til *nada.intern.dev.nav.no* for dev og *nada.intern.nav.no* for prod
    - Ellers settes det til *data.ekstern.dev.nav.no* for dev og *data.nav.no* for prod
- `${QUARTO_ID}` - erstatt med ID på Quarto
- `${TEAM_TOKEN}` - erstatt med team-token fra markedsplassen

!!!warning "API adressene over gjelder ikke for VMer satt opp i `knada-gcp` eller jupyter notebooks/airflow i `knada` clusteret. Her skal adressen "

Eksemplene tar utgangspunkt i at det er filen `index.html` som skal lastes opp og at man kjører kommandoene fra samme mappe som filen ligger.

### Med curl

```bash
curl -X PUT -F index.html=@index.html \
    "https://${ENV}/quarto/update/${QUARTO_ID}" \
    -H "Authorization:Bearer ${TEAM_TOKEN}"
```

#### Flere filer

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

### Med python

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
        multipart_form_data[file_path] = (file_name, file_contents)

# Send the request with all files in the dictionary
response = requests.put( f"https://{ENV}/quarto/update/{QUARTO_ID}", 
                        headers={"Authorization": f"Bearer {TEAM_TOKEN}"},
                        files=multipart_form_data)
    
print(response.status_code)
```

### Oppdatere Quarto med Naisjob

For å produksjonsette oppdatering av en Quarto Datafortelling med Naisjob er det noe konfigurasjon man må spesifisere i NAIS manifestet og Dockerfilen til jobben.

- `quarto render` resulterer i at det genereres noen filer som må lagres midlertidig i containermiljøet før publisering til Markedsplassen. Man er derfor nødt til å legge til annotasjon i Naisjob manifestet for å tillate skriving til filsystemet i containeren
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

#### Andre eksempler
- [fia](https://github.com/navikt/fia-datafortelling): Mer avansert eksempel med produksjonssatt datafortelling


## Datastory-biblioteket
!!!warning "Datafortellinger laget med datastory-biblioteket vil fases ut. Eksisterende datafortellinger vil leve videre en stund, men vi vil om kort tid stenge muligheten til å lage nye."

## Installer datastory bibliotek
````bash
pip install datastory
````

## API adresser
For å publisere en datafortelling må man angi api adressen det skal publiseres til.

- for [dev-miljøet](https://data.dev.intern.nav.no)
    - fra `knada` VMer samt jupyter notebooks/airflow i `knada` clusteret er adressen `https://nada.intern.dev.nav.no/api`
    - ellers er adressen `https://data.ekstern.dev.nav.no/api`
- for [prod-miljøet](https://data.intern.nav.no) 
    - fra `knada` VMer samt jupyter notebooks/airflow i `knada` clusteret er adressen `https://nada.intern.nav.no/api`
    - ellers er adressen `https://data.nav.no/api`

I kodeeksemplene som følger brukes dev adressen.

## Lage utkast til datafortelling
````python
from datastory import DataStory

ds = DataStory("Min datafortelling")

ds.header("Overskrift")
ds.markdown("Liten introbeskrivelse til datafortellingen")
ds.header("Underoverskrift", level=2)
ds.markdown("Mer fyldig beskrivelse av innholdet")
ds.header("Figur 1 tittel", level=3)
ds.plotly(fig_plotly.to_json())
ds.markdown("Beskrivelse av figur 1")
ds.header("Figur 2 tittel", level=3)
ds.vega(fig_vega)
ds.markdown("Beskrivelse av figur 2")

ds.publish(url="https://data.ekstern.dev.nav.no/api")
````

Når man kaller `ds.publish()` i eksempelet over vil det bli opprettet en kladd til en datafortelling, se [her](#publisere-datafortelling) 
for å se hvordan man publiserer en datafortelling fra en kladd.

## Publisere datafortelling
Publisering av en datafortelling gjøres fra kladd-visningen i datamarkedsplassen som følger:

1. Logg inn
2. Trykk lagre
![kladd](datafortelling-utkast.png)
3. Velg hvilket av dine team som skal eie datafortellingen
4. Velg om du skal lage en ny eller overskrive en eksisterende datastory

## Programmatisk oppdatere eksisterende datafortelling
For å oppdatere en publisert datafortelling programmatisk må man autentisere seg med et token. 
Dette tokenet blir generert når man publiserer en kladd og kan hentes ut ved å gå til den publiserte datafortellingen og fra [kebab menyen](https://uxplanet.org/choose-correct-menu-icon-for-your-navigation-7ffc22df80ac#160b) velge `vis token`.
Når du har fått hentet ut oppdateringstokenet kan du erstatte siste kodelinje i eksempelet over (dvs. `ds.publish()`) med en metode som i stedet oppdaterer datafortellingen.

````python
ds.update(token="mitt-token", url="https://nada.intern.dev.nav.no/api")
````

Dersom man ønsker å unngå å sette api adressen til Markedsplassen som input parameter til `ds.publish()` og `ds.update()` metodene kan man i stedet sette det som miljøvariabel, f.eks.
````python
import os
os.environ["DATASTORY_URL"] = "https://nada.intern.dev.nav.no/api"
````
