# Datakatalog


## Hva er produktet?

Datakatalogen gir oversikt over og informasjon om data og dataprodukter i NAV. Det er tre ulike innganger til katalogen:

* [Åpne data](https://data.nav.no). Dette er et utsnitt av data og dataprodukter som er offentlig tilgjengelige.

* [Intern datakatalog](https://data.adeo.no). Inneholder i tillegg til offentlig tilgjengelige data og dataprodukter også data og dataprodukter som kun er tilgjengelige internt i NAV

* [Felles datakatalog](https://fellesdatakatalog.digdir.no). Metadata om data og dataprodukter 

Datakatalogen har to hovedformål: 

* Gjøre data fra NAV tilgjengelig for interne og eksterne brukere på en brukervennlig måte. 

* Øke produktivitetet til analytikere og data scientister i NAV. Dette gjør vi ved å berike og indeksere data ressurser (begreper, tabell, strømmer, data visualiseringer og andre dataprodukter) og å gjøre disse lett å finne i et søkegrensesnitt.


## Hvem er dette laget for?

![Brukergrupper](brukergrupper.png)


## Hvordan komme i gang?

Som bruker av data: Gå til [søkesiden](data.adeo.no) 

Som produsent av data:

* Jeg har en database og ønsker at deler av innholdet skal bli tilgjengelig i katalogen: Ta kontakt med #datakatalog-intern på Slack så hjelper vi deg i gang.

* Jeg har en kafka topic og ønsker at den skal skal bli tilgjengelig i katalogen: Ta kontakt med #datakatalog-intern på Slack så finner vi sammen ut av hvordan det kan løses 

* Jeg har et API og ønsker at det skal skal bli tilgjengelig i katalogen: Ta kontakt med #datakatalog-intern på Slack så hjelper vi deg i gang.

* Jeg har ønsker å publisere et datasett eller en datapakke: Ta kontakt med #datakatalog-intern på Slack så hjelper vi deg i gang.


## Kontaktinformasjon

Ta kontakt med #datakatalog-intern på Slack


## Litt om arkitektur

Data leses fra kilder (pull) med tjenester som samtidig oppdaterer en søkeindeks (ElasticSearch) og et metadatalager (graf modell). 
Tjenestene som henter og lagrer metadata kan f.eks implementeres i en notebook. Tjenestene kan kjøres automatisk ved gitte tidspunkter i Kubeflow.

Alternativt kan en ekstern tjenste levere data (push) som en strøm, via et REST kall eller på annen måte.

Metadata fra datakatalogen kan presenters i en 'viewer' applikasjon som er skreddersydd for metadata typen. Vi har utviklet viewere for databasetabeller, Kafka topics, begreper, datapakker. Viewer applikasjonene bygger på felleskomponenter for å gjøre det enkelt både å videreutikle disse og å lage nye 'viewere' for nye typer metadata.

Metadata kan også presenteres på andre måter. One-off og ad-hoc visninger kan f.eks. presentere som datapakker. Metadata kan også benyttes som datakilde i andre applikasjoner.

### Overordnet arkitektur


![Hovedkomponenter](overordnet_arkitektur.png)


### Domenemodell. Kun ment som illustrasjon. Grafen inneholder også andre typer noder og forbindelser   


![Datamodell](databasemodell_konseptuell.png)


### Kobling mot andre domener


![Graf databasel](datakatalog_domene_graf.png)


### Arkitekturbeslutninger

 * [Valg av hovedarkitektur](arkitektur/valg_av_hovedarkitektur.md)
 * [Valg av database](arkitektur/valg_av_database.md)
 * [Pseudonymisering](arkitektur/pseudonymisering.md)


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
* [Theming](https://github.com/navikt/dataverk-tools). Python bibliotek for NAV theming av grafiske fremstillinger av data.

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

