---
title: Publisering av datapakker
---

Eksempelet under viser hvordan man kan publisere datapakker til datapakke-katalogen i dev (https://data.dev.intern.nav.no). API-adressen for prod er `https://datakatalog-api.intern.nav.no`.


## Lag en ny datapakke
```
curl -X 'POST' -d @datapackage.json 'https://datakatalog-api.dev.intern.nav.no/v1/datapackage'
```

### Respons
```
{
  "id": "1c9c6c7c40812e207946632dcc4be58f",
  "status": "Successfully created datapackage my datapackage"
}
```

!!! info "Merk deg IDen som returneres. Du trenger denne dersom du ønsker å oppdatere datapakken"


## Last opp view og ressursfil
```
curl -X PUT -F files=@resource.csv -F files=@testfig.json https://datakatalog-api.dev.intern.nav.no/v1/datapackage/1c9c6c7c40812e207946632dcc4be58f/attachments
```

## Oppdater en datapakke
```
curl -X 'PUT' -d @datapakke.json 'https://datakatalog-api.dev.intern.nav.no/v1/datapackage/1c9c6c7c40812e207946632dcc4be58f'
```

## Eksempel på en datapakke json som inneholder en visualisering
```
{
  "title": "Echarts demo data package",
  "description": "Echarts demo data package",
  "views": [
    {
      "title": "Echart demofigure",
      "description": "This is a test figure",
      "specType": "echart",
      "spec": { option: {
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: [150, 230, 224, 218, 135, 147, 260],
            type: 'line'
        }]
      }
    }
  ]
}
```
### Echarts dekker mange forskjellige [visualiseringstyper](https://echarts.apache.org/examples/en/index.html)


## Eksempel på en datapakke json som inkluderer en nedlastbar fil og en referanse til en visualisering

Når man inkluderer en eller flere figurer som inneholder mye data burde du lagre visualiseringsdata (`spec`) som separate filer og referere til disse i datapakke json, f.eks.
```
{
  "title": "my data package",
  "description": "this is my data package",
  "views": [
    {
      "title": "Test figure",
      "description": "This is a test figure",
      "specType": "plotly",
      "spec": {
        "url": "testfigure.json"
      }
    }
  ],
  "resources": [
    {
      "name": "resource",
      "description": "This is a test resource",
      "path": "resource.csv",
      "format": "csv",
      "dsv_separator": ";"
    }
  ]
}
```
