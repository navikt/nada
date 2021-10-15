---
title: Register data products
---

Content items can be registered in the datacatalog by push or pull

## 1. Push

Content can be registered in the interne data catalog  (data.intern.nav.no)

* [API](https://datakatalog-api.intern.nav.no/v1/index)
* [Swagger docs](https://datakatalog-api.intern.nav.no/docs)

## Metadata fields

Metadata is published as JSON object with the following fields:

### Required fields

| Navn | Format | Merknad | Default verdi |
| :---  | :--- | :--- | :--- |
| name  | String | Feltet brukes som id og default tittel. Må være unik i datakatalogen. | TODO: generere feilmelding ved POST med eksisterende name |
| type | 'parquet', 'bigquery', 'datapackage', 'api', 'begrep'. 'godkjent_begrep', 'tabell', 'tableau', 'kafka_topic', 'purpose', 'person', 'team', 'nais_team' | Innholdstype. Brukes for å gruppere innholdet i katalogens venstremeny og for å bestemme hvordan innholdet skal vises i katalogen  | innhold vises i default view dersom type ikke er oppgitt |
| uri | String | Full adresse til datasettet |  |

### Fields which must be provided when the default values are not sufficient

| Navn | Format | Merknad | Default verdi |
| :--- | :--- | :--- | :--- |
| accessRights | 'restricted', 'internal' eller 'open' | Informasjon om hvem som har tilgang eller sikkerhetsstatus. | internal |
| pii | 'true' eller 'false' | Informasjon om dataproduktet inneholder personidentifiserende informasjon. | false |

### Fields which must be provided for data products

| Navn | Format | Merknad | Default verdi |
| :--- | :--- | :--- | :--- |
| team | String | Nais/deployment teamet som eier dataproduktet | TODO: validere mot teams.yml ? |

### Recommended fields

| Navn | Format | Merknad | Eksempel | Default verdi |
| :--- | :--- | :--- | :--- | :--- |
| title  | String | | name |
| description  | String | Kan være ren tekst eller markdown | | TODO: skal vi vise readme fra repo dersom description ikke er oppgitt? |
| repo | String | Lenke til github repository | https://github.com/repo | |
| slack | String | Slack kanal der brukere kan kontakte dataprodukt eiere | #knada | |
| keyword |  String or list of strings | Disse nøkkelordene/tags er søkbare og valgbare i datakatalogen |  |
| theme |  String | Tema. Vises i nederste del av datakatalogen venstremeny og i den nasjonale datakatalogen data.norge.no. Bruk gjerne et tema som finnes der fra før. | | |

### Other fiels which you may use

| Navn | Format | Merknad | Eksempel | Default verdi |
| :--- | :---  | :--- | :--- | :--- |
| temporal | Dict | Perioden dataproduktet dekker. Start og sluttdator. Formattert som to ISO 8601 datoer \(eller  datetimes\) seeparert med slash. | {"from": "2020", "to": "2020"} or {"from": "2020-06", "to": "2020-06"} | {"from": "_
current year_", "to": "_current year_"} |
| language | String | To eller tre bokstavkode. | NO | NO |
| creator | Dict | Den som er ansvarlig for dataproduktet. \(person, team, område\). | NAV | |
| publisher | Dict | Den som er ansvarlig for dataproduktet. \(person, team, område, organisasjon\). | NAV. | {"name": "NAV"} | {"name": "NAV"} |
| license | Dict | Licence title and/or URI | {"name": "MIT","uri":"https://.."} |  |
| rights | String | A statement that concerns all rights not addressed with `license` or `accessRights`, such as copyright statements. | Copyright 2020, NAV | Copyright _
year_, NAV |
| periodicity | String | Hvor ofte innholdstypen blir oppdatert | Månedlig | |
| provenance | String | Eier og forvalter av datasett | NAV | NAV |
| contactPoint | Dict | Kontaktpunkt med kontaktopplysninger | {"name": "NAV", "email": "someone@nav.no"} | |
| author | String | Forfatter av datasett | someone@nav.no | |
| readme | String | Utvidet beskrivelse av dataprodukt | Kan være ren tekst eller markdown | |
| spatial | String | Geografisk dekningsområde | Norge | |
| modified | String | Dato for seneste publisering, blir lagt til automatisk dersom det ikke spesifiseres | 2021-03-16T15:16:10 | |
| issued | String | Dato for første publisering, blir lagt til automatisk dersom det ikke spesifiseres | 2021-03-16T15:16:10 | |

### Example Data Products

```json
{
    "title": "Tittel til dataprodukt",
    "description": "Beskrivelse av dataproduktet",
    "uri": "",
    "repo": "https://github.com/navikt/mitt-nye-dataprodukt.git",
    "pii": "false",
    "periodicity": "daily",
    "contactPoint": [
      {
        "name": "Kjerne Kar",
        "email": "kjerne.kar@nav.no"
      }
    ],
    "author": "Kjerne Kar",
    "long_description": "Lengre beskrivelse av dataproduktet",
    "accessRights": "internal",
    "keyword": [
      "enhetsregister"
    ],
    "theme": "Arbeid",
    "temporal": {
    },
    "language": "NO",
    "datasets": [
      {
        "gcpProject": "gcp-project",
        "dataset": "dataset",
        "table": "table",
        "title": "a tittle",
        "description": "a description",
        "sources": [
          "source.team-postgres-db.important_table",
          "id-til-kafka-topic"
        ],
        "long_description": "a long description",
        "spatial": "Norge",
        "accessRights": "",
        "accessGroups": {
          "canRead": [
            "gruppe-som-default-har-tilgang-til-å-lese"
          ],
          "canRequest": [
            "gruppe-som-har-tilgang-til-å-be om tilgang"
          ]
        },
        "keyword": [
          "ereg"
        ]
      }
    ]
}
```

* [Data Lineage](https://en.wikipedia.org/wiki/Data_lineage) includes the data origin, what happens to it and where it
  moves over time. Data lineage gives visibility while greatly simplifying the ability to trace errors back to the root
  cause in a data analytics process.

### Example

```
curl -v -d '{"id":"1337","title":"kyrre-test","description":"finner du meg, så slett meg", "format": "parquet","uri":"https://min-bucket.gcp"}' -X POST https://datakatalog-api.intern.nav.no/v1/index
```

### Testing

For testing please use the dev/test environment.

https://datakatalog-api.dev.intern.nav.no/docs

## 2. Pull

The following content types are pulled automatically into the catalog with crawlers

* Aiven Kafka topics som har metadata i topic.yml
* Begreper fra JIRA begrepskatalogen
* Teamkatalogen
* Active Directory (person, grupper, avdeling)
* Tableau server
* Oracle & Postgres databaser
* Amplitude
* NAIS apper inkludert info fra Github & Nora
* API [portalen](https://api-portal.nav.no/)

Crawler code: [github](https://github.com/navikt/nada-crawlers-and-indexers/tree/master/crawlers)

Please contact #knada on Slack if you have content you would like to have registered

