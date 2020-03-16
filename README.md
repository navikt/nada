---

NADA dokumentasjon

---

* [Om NADA](/content/about/README.md)

* [Om NADA på Confluence](https://confluence.adeo.no/pages/viewpage.action?pageId=338181121)

## Frontend: Felles komponenter

Frontend applikasjonene er bygget i React med [Base Web React UI Framework](https://baseweb.design/)

Felleskomponenter:

* [Repo med egne komponenter](https://github.com/navikt/data-catalog-components)
* [Storybook for egne komponenter](https://navikt.github.io/data-catalog-components). Visuell presentasjon og dokumentasjon av komponentene 

## Datakatalog

### Applikasjoner

* [Ekstern datakatalog: Beta](https://dataverk.nav.no)
* [Ekstern datakatalog: Test](https://dataverk-q.nav.no)
* [Intern datakatalog: Prod](https://data-search.nais.adeo)
* [Intern datakatalog: Test](https://data-search.nais.preprod.local)

### API'er
  [https://dv-resource-rw-api.nais.adeo.no/dcat](https://dv-resource-rw-api.nais.adeo.no/dcat). Elastic search index for datakatalogen
  
  Repo:
  * [Cosmos DB API. Apache TinkerPop basert graf database)](https://github.com/navikt/data-catalog-api). Cosmos DB API. Cosmos DB benyttes som lager for metadata for datakatalogen
  * [RDF API](https://github.com/navikt/data-catalog-rdf). API som Felles datakalog bruker for å laste data
  
### Repoer
* [Tekster (markdown](https://github.com/navikt/data-catalog-markdown). 'About' tekster som brukes i viewer applikasjonene.
* [Tabell viewer](https://github.com/navikt/data-catalog-table-viewer). Visning av databasetabeller inkl dataprofilering
* [Kafka viewer](https://github.com/navikt/data-catalog-kafka-viewer)
* [Begrep viewer](https://github.com/navikt/data-catalog-term-viewer)
* [Datasett viewer](https://github.com/deetly/datapackage-viewer)
 * [Datasett NAV theming](https://github.com/navikt/dataverk-tools). Python bibliotek for NAV theming av grafiske fremstillinger av data.

* [Viewer template](https://github.com/navikt/data-catalog-api-viewer). Template for utvikling av nye viewer applikasjoner

* [Grafdatabase i postgres med connexion swagger API](https://github.com/navikt//data-catalog-graph). Backend API for datakatalogen
  * [API Test](https://data-catalog-graph.nais.preprod.local)
  * [API Prod](https://data-catalog-graph.nais.adeo.no)
  
* [Python script for å hente, laste og indeksere data](navikt/data-catalog-indexers). Skedulerte skript for å hente data fra ulike kilder, laste til graf databasen og indeksere i Elastic Search

* [API Proxy](https://github.com/navikt/dataverk-proxy)


### Utvikling
* [Trello](https://trello.com/b/kd4dRGH9/data-catalog)
* [Arkitektur]
* [Brukerhistorier](./stories.md)
* [Møtereferater](https://github.com/navikt/data-catalog-notes)


## Analyseplattform
* [NaisFlow](https://kubeflow.adeo.no) er Kubeflow på NAIS. En plattform for analyse og maskinlæring i jupyter notebooks.
  * [Repo for docker images for kubeflow](https://github.com/navikt/kubeflow-dataverk-base)
  
* [Dataverk](https://github.com/navikt/dataverk). Python bibliotek for lesing og skriving av data i NAV.
  * [Dataverk Vault](https://github.com/navikt/dataverk-vault). Bibliotek med api mot vault for secrets handling og database credential generering for dataverk
  * [Dataverk API](https://github.com/navikt/dataverk-api). Dataverk web-API for å lese ressursfiler fra ceph bucket storage og metadata fra elastic search index.
  * [Test ML på Kubeflow](https://github.com/navikt/kubeflow-ml-test). Eksempelprosjekt med åpne data

## Behandlingskatalog

* [Applikasjon](https://behandlingskatalog.nais.adeo.no). Behandlingskatalogen
* [Applikasjon Test](https://behandlingskatalog.nais.preprod.local). Behandlingskatalogen (Test)

* [API](https://behandlingskatalog.nais.adeo.no). Swagger API
* [API Test](https://behandlingskatalog.nais.preprod.local). Swagger API (Test)

* [Repo Backend](https://github.com/navikt/data-catalog-backend). Backend Repo

## Kafka

* [Kafka](/content/kafka/README.md)


## Dataverk: Serverless ETL, ML og produksjon av dataprodukter med Python, Dask og Jupyter Notebooks

[Dataverk](./DATAVERK.md)


