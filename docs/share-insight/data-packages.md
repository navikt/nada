---
title: Data packages
---


## Why datapackages?

With datapackages you can create and publish datastories directly from notebooks or scripts. You can combine data visualizations with formatted text, tables, images, html and PDFs to create your datastory. The easiest way to create datapackages is using notebooks. See <a href="https://deetly.github.io/docs/intro.html">deetly</a> for examples and getting started documentation.

## Creating datapackages with notebooks

```python
import deetly
from dataverk import Client
```

### Define metadata


```python
# Create the data story
metadata = {
    "name":"Hello world"
}
ds = deetly.story(metadata)
```

### Add content to the story

Content can be text as shown in this example. But content can also be markdown, data visualizations or dashbards. More examples can be found on <a href="https://deetly.github.io/docs/intro.html">deetly</a>. You can add multiple content items to a story.

```python
# Add a text section to the story
ds.text("Glad you are here!")
```

### Publish to NAV datacatalog

With naisdevice installed and running you can publish to the internal datakatalog directly from your desktop. In this case you need to define some environment variables to publish to either test (<a href="https://data.dev.intern.nav.no">https://data.dev.intern.nav.no</a>) or prod (<a href="https://data.intern.nav.no">https://data.intern.nav.no</a>). 

When working in jupyter.adeo.no these are not necessary.   

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

All is now set. After you call the publish() method your story will immediately be be available in the datacatalog.

```python
Client().publish(ds)
```


## Publishing datapackages without using notebooks

It is also possible to publish data stories using other languages than Python and without using notebooks.

A datapackage is just a declarative specification in JSON format. The package can also contain data and/or references to data sources.

The datapackage JSON object contains:

* metadata
* a list of 0-n data 'resources'
* a list of 0-n content item declarations (='views')

Basic example contain only one view of type markdown and noe data  resources:

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


### Publishing a datapackage via API


When publishing a datapackage the JSON declaration along with eventual resource file are written to files in bucket store via and API. The files can then be accessed by a 'datapackage viewer' front-end application.

The following example shows how to publish a datapackage JSON file to the dev environment (https://data.dev.intern.nav.no)

To publish to prod you would have used the API address: https://datakatalog-api.intern.nav.no.

### Create a new datapackage
```
curl -X 'POST' -H "Content-Type: application/json" -d @datapakke.json 'https://datakatalog-api.dev.intern.nav.no/v1/datapackage'
```

If all goes well you wil get a respons containing the id of your datapackage:

```
{
  "id": "1c9c6c7c40812e207946632dcc4be58f",
  "status": "Successfully created datapackage min datapakke"
}
```

:::info
Take note of the ID. You will need this if you would like to update the datapackage
:::

### Adding a view and ressourcefiles

```
curl -X PUT -F files=@resource.csv -F files=@testfigur.json https://datakatalog-api.dev.intern.nav.no/v1/datapackage/1c9c6c7c40812e207946632dcc4be58f/attachments
```

### Updating a datapackage

```
curl -X 'PUT' -H "Content-Type: application/json" -d @datapakke.json 'https://datakatalog-api.dev.intern.nav.no/v1/datapackage/1c9c6c7c40812e207946632dcc4be58f'
```

### Example datapackage.json which includes a data visualization

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

## Example datapackage.json including references to a data file and a plotly figure

When including figures which contain large amounts of data you can reduce the load time of the datapackage by storing the figures (spec) as separate files and including just the url's in the datapackage.json. 


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



### Publishing to data.nav.no

If the datapackage is to be published to the public data catalog you must provide metadata following the DCAT-AP-NO standard. Example:

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

A full description of required and optional metadata fields is available at [metadata](process-data/dataverk/metadata.md)

If you get stuck or need more info please contact #knada on Slack
