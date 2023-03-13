NADA er et plattformteam med ansvar for KNADA, [markedsplassen](https://data.intern.nav.no) og [Metabase](analyse/metabase.md).

KNADA er en plattform som tilbyr verktøy for å lese data fra kilder i sky og onprem før bearbeiding av data, enten i form av analyse eller transformasjon og deling av data.
Dataprodukter på markedsplassen kan analyseres i [notebook](analyse/notebook/index.md) og [Metabase](analyse/metabase.md).
Innsikten kan deles som [datafortellinger](analyse/datafortellinger.md) eller som Metabase-dashboard.

På markedsplassen kan team registrere egne og finne andres [dataprodukter](dataprodukter/dataprodukt.md) og [datasett](dataprodukter/dataprodukt.md#hva-er-et-datasett) samt datafortellinger.
Metabase-dashboard kan også deles direkte på markedsplassen.

### Kontakt oss

* [Slack (#nada)](https://nav-it.slack.com/archives/CGRMQHT50)
* Brukerforum (annenhver torsdag i partallsuker, kl. 0900 på Zoom.)

### Ordliste
#### NADA-plattformen 
Verktøyene beskrevet i [dokumentasjonen](docs.knada.io). Plattformen består av verktøy for å lage, tilgjengeliggjøre og bruke data analytisk.

#### Datamarkedsplassen 
Vårt finn.no der produsenter viser og forvalter data og innsikt, mens konsumenter finner og ber om tilgang til data.

#### Dataprodukt 
En samling av ett eller flere datasett som teamet mener hører sammen. Dataproduktet inneholder en overordnet beskrivelse og har en eier med et tilhørende kontaktpunkt.

#### Datasett 
Del av et dataprodukt. Består av data, metadata og kode. Data er i dag tilgjengelig i form av views/tabeller på BigQuery.

#### BigQuery
Database hostet av Google som er tilgjengelig for team på GCP. 

#### Metabase
Dashboard-verktøy integrert med datasettene på markedsplassen. Brukes både av data scientister, utviklere og produktledere.

#### Datafortellinger 
Analyser med en "rød tråd". Datafortellinger lages som regel av data scientister. Tidligere har dette vært implementert gjennom vårt egenutviklede Datastory. Fra nå er det Quarto som gjelder.

#### Knorten
Portalen for å administrere team som bruker KNADA. Her kan man sette opp Airflow og Jupyter automatisk.

#### KNADA 
Analyseplattform bygd på Kubernetes i GCP der Jupyter Notebook og Airflow kjører. Det er åpninger mot FSS som gjør at dere kan gjøre jobbe med data derfra og kombinere med data i sky.

#### Airflow
Orkestrering av jobber. Brukes i dag både til å skedulere enkle jobber og til å håndtere mer kompelske jobber med avhengigheter. Brukes både av data scientister og data engineers i datavarehus.

#### Jupyter Notebook 
Verktøyet alle data scientistene bruker. Enkelt å kjøre mindre bolker av kode og visualisere resultater i nettleseren.