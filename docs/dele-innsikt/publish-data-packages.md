---
title: Publish data packages 
---

The example below show how one can publish data packages to the data catalog in dev (https://data.dev.intern.nav.no). The 
API address for prod is `https://datakatalog-api.intern.nav.no`.


## Create a new data package
```
curl -X 'POST' -d @datapackage.json 'https://datakatalog-api.dev.intern.nav.no/v1/datapackage'
```

### Response
```
{
  "id": "1c9c6c7c40812e207946632dcc4be58f",
  "status": "Successfully created datapackage my datapackage"
}
```

:::info
Store the ID in the response object from the POST request above, this must be used as reference for the data package to 
update it later.
:::

## Upload view and resource file
```
curl -X PUT -F files=@resource.csv -F files=@testfig.json https://datakatalog-api.dev.intern.nav.no/v1/datapackage/1c9c6c7c40812e207946632dcc4be58f/attachments
```

## Update a data package
```
curl -X 'PUT' -d @datapakke.json 'https://datakatalog-api.dev.intern.nav.no/v1/datapackage/1c9c6c7c40812e207946632dcc4be58f'
```

## Example on data package json including a visualization
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
### Echarts covers a variety of [different visualization types](https://echarts.apache.org/examples/en/index.html)


## Example on data package json including a downloadable file and a reference to a visualization 

When including one or more figures that contain a lot of data you should store the visualization data (`spec`) as 
separate files and reference these in the data package json, e.g. 
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
