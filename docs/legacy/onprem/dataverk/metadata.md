---
title: Metadata
---

### Mandatory fields

- **title**:
  - datatype: String
  - definition: Datapackage title
- **description**:
  - datatype: String
  - definition: Datapackage description

### Recommended fields
- **author**:
  - datatype: String
  - definition: Datapackage author
- **publisher**:
  - datatype: String
  - definition: Datapackage publisher
- **license**:
  - datatype: Dict
  - definition: Datapackage license
  - fields:
    - name:
        - datatype: String
        - definition: License name
    - url:
        - datatype: String
        - definition: Address for license definition
- **contactPoint**:
  - datatype: Dict
  - definition: Contact information for datapackage
  - fields:
    - name:
        - datatype: String
        - definition: Name of contact
    - email:
        - datatype: String
        - definition: Email address for contact
- **temporal**:
  - datatype: Dict
  - definition: Time period covered in datapackage
  - fields:
    - from:
        - datatype: String
        - definition: Start date in format ISO 8601
    - to:
        - datatype: String
        - definition: End date in format ISO 8601
- **bucket**:
  - datatype: String
  - definition: Bucket where resources published with dataverk is stored  
- **store**:
  - datatype: String
  - definition: Data storage type
  - options:
    - nais
    - gcs
    - local
- **format**:
  - datatype: String
  - definition: Filter parameter in data catalog, must be set to "datapackage"
- **readme**:
  - datatype: String
  - definition: Detailed description of datapackage
- **repo**:
  - datatype: String
  - definition: Link to github repository containing notebook/script used to create datapackage
- **notebook**:
  - datatype: String
  - definition: Direct link to jupyterhub notebook used to create datapackage
- **language**:
  - dataype: String
  - definition: Language used in datapackage
- **accrualPeriodicity**:
  - datatype: String
  - definition: Datapackage update frequency
- **keyword**:
  - datatype: List
  - definition: List of keywords used for search in elastic search index
- **theme**:
  - datatype: List
  - definition: List of themes the datapackage covers
- **issued**:
  - datatype: String
  - definition: Date the datapackage was first published on ISO 8601 format
- **modified**:
  - datatype: String
  - definition: Date the datapackage was last updated on ISO 8601 format
- **spatial**
  - datatype: String
  - definition: The geographical area the datapackage covers
- **accessRights**:
  - datatype: String
  - definition: Access rights level
  - options:
    - internal
    - open
    - restricted
- **provenance**:
  - datatype: String
  - definition: Datapackage origin

### Optional fields
- **versionInfo**:
  - datatype: String
  - definition: Datapackage version number

## Example
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
    "bucket": "nav-interndata"
}
```
