## Datakatalog

Datakatalogen har to hovedformål: 

* Gjøre data fra NAV tilgjengelig for interne og eksterne brukere på en brukervennlig måte. Dette gjør vi gjennom https://data.nav.no samt ved å gjøre metadata om data og dataprokter tilgjengelig i [Felles datakatalog](https://fellesdatakatalog.digdir.no/)

* Øke produktivitetet til analytikere og data scientister i NAV. Dette gjør vi ved å berike og indeksere data ressurser (begreper, tabell, strømmer, data visualiseringer og andre dataprodukter) og å gjøre disse lett å finne i et søkegrensesnitt i en intern datakatalog: data.adeo.no

### Brukergrupper og ønskemål

![Brukergrupper](brukergrupper.png)

## Arkitektur

Data leses fra kilder (pull) med tjenester som samtidig oppdaterer en søkeindeks (ElasticSearch) og et metadatalager (graf modell). 
Tjenestene som henter og lagrer metadata kan f.eks implementeres i en notebook. Tjenestene kan kjøres automatisk ved gitte tidspunkter i Kubeflow.

Alternativt kan en ekstern tjenste levere data (push) som en strøm, via et REST kall eller på annen måte.

Metadata fra datakatalogen kan presenters i en 'viewer' applikasjon som er skreddersydd for metadata typen. Vi har utviklet viewere for databasetabeller, Kafka topics, begreper, datapakker. Viewer applikasjonene bygger på felleskomponenter for å gjøre det enkelt både å videreutikle disse og å lage nye 'viewere' for nye typer metadata.

Metadata kan også presenteres på andre måter. One-off og add-hoc visninger kan f.eks. presentere som datapakker. Metadata kan også benyttes som datakilde i andre applikasjoner.

Overordnet arkitektur

![Hovedkomponenter](overordnet_arkitektur.png)


Datamodell

![Datamodell](databasemodell_konseptuell.png)

### Arkitekturbeslutninger

 * [Valg av hovedarkitektur](arkitektur/valg_av_hovedarkitektur.md)
 * [Valg av database](arkitektur/valg_av_database.md)

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
* [Brukerhistorier](./stories.md)
* [Møtereferater](https://github.com/navikt/data-catalog-notes)

