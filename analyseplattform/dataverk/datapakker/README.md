# Datapakker


## Metadata

### Obligatoriske felter

- **title**:
  - datatype: String
  - definisjon: Tittel på datapakke
- **description**:
  - datatype: String
  - definisjon: Beskrivelse av datapakke
- **author**:
  - datatype: String
  - definisjon: Datapakkens forfatter
- **publisher**:
  - datatype: String
  - definisjon: Utgiver av datapakken
- **license**:
  - datatype: Dict
  - definisjon: Lisensen datapakken er distribuert under
  - felter:
    - name:
        - datatype: String
        - definisjon: Navn på lisens
    - url:
        - datatype: String
        - definisjon: Adresse til lisens definisjon
- **contactPoint**:
  - datatype: Dict
  - definisjon: Kontakt informasjon for datapakken
  - felter:
    - name:
        - datatype: String
        - definisjon: Navn på kontakt
    - email:
        - datatype: String
        - definisjon: Epost adresse for kontakt
- **temporalResolution**:
  - datatype: Dict
  - definisjon: Tidsperiode datapakken dekker
  - felter:
    - from:
        - datatype: String
        - definisjon: Startdato på format ISO 8601
    - to:
        - datatype: String
        - definisjon: Sluttdato på format ISO 8601
- **bucket**:
  - datatype: String
  - definisjon: Navn på bucket hvor ressursfiler publisert med dataverk blir lagret
- **store**:
  - datatype: String
  - definisjon: Datalagertype
  - alternativer:
    - nais
    - gs
    - local
- **format**:
  - datatype: String
  - definisjon: Filtrerings parameter, må settes til "datapackage"

### Anbefalte felter
- **readme**:
  - datatype: String
  - definisjon: Detaljert beskrivelse av datapakken
- **repo**:
  - datatype: String
  - definisjon: Lenke til notebook i github
- **notebook**:
  - datatype: String
  - definisjon: Lenke til notebook i kubeflow
- **language**:
  - dataype: String
  - definisjon: Språk benyttet i datapakken
- **accrualPeriodicity**:
  - datatype: String
  - definisjon: Oppdateringsfrekvens for datapakke
- **keyword**:
  - datatype: List
  - definisjon: Liste av nøkkelord brukt for søk i ElasticSearch index
- **theme**:
  - datatype: List
  - definisjon: Liste av temaer datapakken omhandler
- **issued**:
  - datatype: String
  - definisjon: Dato datapakken ble først publisert på format ISO 8601
- **modified**:
  - datatype: String
  - definisjon: Dato datapakken ble sist endret på format ISO 8601
- **spatial**
  - datatype: String
  - definisjon: Geografisk område datapakken omhandler
- **accessRights**:
  - datatype: String
  - definisjon: Tilgangsrettigheter
- **provenance**:
  - datatype: String
  - definisjon: Datapakkens opphav

### Valgfri felter
- **versionInfo**:
  - datatype: String
  - definisjon: Versjonsnummer til datapakken

### Eksempel
```python
metadata = {
    "title": "Datapakkens tittel",
    "description": "Beskrivelse av datapakken",
    "readme": "Detaljert beskrivelse av datapakken",
    "accessRights": "Open", 
    "issued": "2020-05-11",
    "modified": "2020-05-12",
    "language": "Norsk", 
    "periodicity": "Daglig",
    "temporal": {
                "from": "2020-05-11", 
                "to": "2020-05-12"
                },
    "author": "Navn på forfatter",
    "publisher": {
                "name": "Arbeids- og velferdsetaten (NAV)", 
                "url": "https://www.nav.no"
                 }, 
    "contactpoint": {
                "name": "Navn på forfatter", 
                "email": "fornavn.etternavn@nav.no"
                    },
    "license": {
                "name": "CC BY 4.0", 
                "url": "http://creativecommons.org/licenses/by/4.0/deed.no"
               },
    "keyword":  ["NAV",
                "AAP",
                "Sykemeldinger"
                 ],
    "spatial": "Norge",
    "theme": ["Åpne data"],
    "format": "datapackage",
    "provenance": "NAV",
    "store": "nais",
    "bucket": "nav-opendata"
}
```
