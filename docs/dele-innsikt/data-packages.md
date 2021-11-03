---
title: Datapakker
---


## Hvorfor datapakker

Med datapakker (tidligere kalt datapakker) kan du lage og publisere datapakker direkte fra notebooks eller skript. Du kan kombinere datavisualiseringer med 
formattert tekst, tabeller, bilder, html og PDFer til å lage en datapakker. Den enkleste veien til å lage datapakker er ved å bruke notebooks. Se <a href="https://deetly.github.io/docs/intro.html">deetly</a> for eksempler og getting started dokumentasjon.

## Lage datapakker med notebooks

```python
import deetly
from dataverk import Client
```

### Definer metadata

```python
# Lag en datapakker
metadata = {
    "name":"Hello world"
}
ds = deetly.story(metadata)
```

### Legg til innhold i datapakker

Innhold kan være tekst som vist i dette eksempelet. Men innhold kan også være markdown, datavisualiseringer eller dashboards. Flere eksempler kan finnes på <a href="https://deetly.github.io/docs/intro.html">deetly</a>. Du kan legge til flere innholdselementer i en datapakker.

```python
# Legg en tekst til i datapakkeren
ds.text("Glad you are here!")
```

### Publiser til NAV datapakke katalog

Med naisdevice installert og kjørende kan du publisere til datapakke-katalogen direkte fra maskinen din. I dette tilfellet trenger du å definere noen miljøvariabler for å publisere enten til test (<a href="https://datapakker.dev.intern.nav.no">https://data.dev.intern.nav.no</a>) eller prod (<a href="https://datapakker.intern.nav.no">https://data.intern.nav.no</a>).

Når man jobber i notebooks på .jupyter.adeo.no er det ikke nødvendig å sette disse.

#### For dataverk >=0.4.7

```python
import os
# publish to test: https://data.dev.intern.nav.no
os.environ['DATAVERK_HOST'] = 'https://datakatalog-api.dev.intern.nav.no'

# publish to prod: https://data.intern.nav.no
#os.environ['DATAVERK_HOST'] = 'https://datakatalog-api.intern.nav.no'

# publish from onprem
os.environ['DATAVERK_ENVIRONMENT'] = 'nais'
```

#### For dataverk <0.4.7

```python
import os
# publish to test: https://data.dev.intern.nav.no
os.environ['DATAVERK_ES_HOST'] = 'https://datakatalog-api.dev.intern.nav.no/v1/index'
os.environ['DATAVERK_BUCKET_ENDPOINT'] = 'https://dv-api-intern.dev-gcp.nais.io/storage'
os.environ['DATAVERK_API_ENDPOINT'] = 'https://data.dev.intern.nav.no/api'

# publish to prod: https://data.intern.nav.no
#os.environ['DATAVERK_ES_HOST'] = 'https://datakatalog-api.intern.nav.no/v1/index'
#os.environ['DATAVERK_BUCKET_ENDPOINT'] = 'https://dv-api-intern.prod-gcp.nais.io/storage'
#os.environ['DATAVERK_API_ENDPOINT'] ='https://data.intern.nav.no/api'

# publish from onprem
os.environ['DATAVERK_BUCKET'] ='nav-interndata'
os.environ['DATAVERK_STORAGE_SINK'] = 'nais'
```

Alt er nå satt. Når du nå kaller publish() metoden vil datapakker din umiddelbart være tilgjengelig i datapakke-katalogen.

```python
Client().publish(ds)
```


## Publisering av datapakker utenom notebooks

Det er også mulig å publisere datapakker med andre programmeringsspråk og uten å bruke notebooks.

En datapakke er bare en deklarativ spesifikasjon i JSON format. Datapakken kan også inneholde data og/eller referanser til datakilder.

Datapakke JSON objektet inneholder:

* metadata
* en liste av 0-n data 'ressurser'
* en liste av 0-n innholdselement deklarasjoner (='views')

Eksempelet under inneholder et view av type markdown og ingen data ressurser:

```json
{
    "name": "Hello world", 
    "issued": "2021-03-03T19:23:34.160098", 
    "modified": "2021-03-03T19:23:34.160098", 
    "title": "Hello world", 
    "id": "aae98ae8214549d11861eb9fd7234ba5", 
    "views": [
        {
            "name": "Hello World",
            "description": "", 
            "specType": "markdown", 
            "spec": {"markdown": "Hello World"}
        }
    ]
}
```


### Publisering av datapakker via api

Når man publiserer en datapakke vil JSON deklarasjonen sammen med eventuelle ressursfiler bli skrevet til filer i en bucket store via et API. Filene kan så akksesseres av 
en "datapakke-viewer" front-end applikasjon.

Det følgende eksempelet viser hvordan man publiserer en datapakke JSON fil til dev miljøet (https://datapakker.dev.intern.nav.no)

For å publisere til prod må du bruke API adressen: https://datakatalog-api.intern.nav.no.

### Lag en ny datapakke
```
curl -X 'POST' -H "Content-Type: application/json" -d @datapakke.json 'https://datakatalog-api.dev.intern.nav.no/v1/datapackage'
```

Hvis alt går bra vil du da få en respons med IDen til datapakken din:

```
{
  "id": "1c9c6c7c40812e207946632dcc4be58f",
  "status": "Successfully created datapackage min datapakke"
}
```

:::info
Merk deg IDen som returneres. Du trenger denne dersom du ønsker å oppdatere datapakken
:::

### Legg til view og ressursfiler

```
curl -X PUT -F files=@resource.csv -F files=@testfigur.json https://datakatalog-api.dev.intern.nav.no/v1/datapackage/1c9c6c7c40812e207946632dcc4be58f/attachments
```

### Oppdatering av datapakke

```
curl -X 'PUT' -H "Content-Type: application/json" -d @datapakke.json 'https://datakatalog-api.dev.intern.nav.no/v1/datapackage/1c9c6c7c40812e207946632dcc4be58f'
```

### Eksempel datapackage.json som inkluderer en data visualisering

```json
{
  "title": "Echarts demo datapakke",
  "description": "Echarts demo datapakke",
  "views": [
    {
      "title": "Echart demofigur",
      "description": "Dette er en testfigur",
      "specType": "echart",
      "spec": { 
          "option": 
            {
                "xAxis": {
                    "type": "category",
                    "data": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
                },
                "yAxis": {
                    "type": "value"
                },
                "series": [{
                    "data": [150, 230, 224, 218, 135, 147, 260],
                    "type": "line"
                }]
            }
        }
    }
  ]
}
```

## Eksempel datapackage.json som inkluderer referanser til en datafil og en plotly figur

Når du inkluderer figurer som inneholder store datamengder kan du redusere lastetiden til datapakken hvis du lagrer figurens spesifikasjon som separate filer og inkluderer bare URLen i datapackage.json

```json
{
  "title": "Plotly demo datapakke",
  "description": "Datapakke med et plotly view og en nedlastbar fil",
  "views": [
    {
      "title": "Testfigur",
      "description": "Dette er en testfigur",
      "specType": "plotly",
      "spec": {
        "url": "testfigur.json"
      }
    }
  ],
  "resources": [
    {
      "name": "resource",
      "description": "dette er en testressurs",
      "path": "resource.csv",
      "format": "csv",
      "dsv_separator": ";"
    }
  ]
}
```

### Publisering til data.nav.no

Hvis datapakken skal publiseres offentlig må man legge ved metadata som følger DCAT-AP-NO standarden. Eksempel:

```json
metadata = {
    "name":"Hello unique world", 
    "title": "Hello world", 
    "description": "Friendly greeting",
    "keywords": ["greeting"],
    "scope": "team hello",
    "author": "team hello",
    "publisher": {"name": "team hello", "email": "hello@world" },
    "license": {"name": "MIT", "email": "https://opensource.org/licenses/MIT"},
    "contactPoint": {"name": "team hello", "email": "hello@world" },
    "temporal": {"from": "2000-01-01", "to": "2030-01-01"},
    "spatial": "Norge"
    }
```

Ta kontakt i #nada på Slack dersom du trenger hjelp.
