# How to: Python ETL-pipeline på nais 101

## Disposisjon
* Introduksjon
  * Hva skal vi gjøre i denne guiden?
  * Hvorfor bruke nais til dette?
* Viktige konsepter å forstå
  * Docker/containers
  * Kubernetes og nais
  * CI/CD
  * Hemmeligheter
* En enkel ETL-pipeline
  * Lese fra en kilde (dataprodukt i GCP)
  * Test-drevet transformasjonsutvikling
  * Skrive til et nytt dataprodukt
* Pipeline
  * Dockerfile
  * naisjob.yaml
  * Github Action
* Drift av pipeline
  * Monitorering
  * Alerts
* Oppsummering

## Introduksjon
I denne guiden viser vi hvordan vi kan lage en data pipeline ("ETL-pipeline") i python og sette denne i produksjon på nais.
Vi vil i eksempelet lese data fra et dataprodukt som ligger på [datamarkedsplassen](../finne-data/navdata.md),
gjøre noen enkle transformasjoner, og skrive data tilbake til en tabell i BigQuery. 
Vi vil skrive tester for transformasjonene våre, slik at vi er trygge på at de gjør det de skal også når vi endrer koden i fremtiden.
Til slutt vil vi pakke koden vår inn i en kjørende container som vi setter i produksjon. 
Vi vil sette pipelinen vår til å kjøre én gang i døgnet ved hjelp av en [naisjob](https://docs.nais.io/naisjob/).

Målgruppen for denne guiden er datautviklere som kan litt python og skal lage data pipelines.

Ved å bruke nais som plattform for pipelinen vår får vi mye gratis. 
Vi får et robust og veltestet kjøretidsmiljø, tilgang på logger og metrikker og alerts, i tillegg til enkle provisjoneringsmekanismer for BigQuery-datasett og hemmeligheter og slikt.


## Grunnleggende konsepter
### Docker / containere
Alle applikasjoner (og data pipelinen vi skal lage er i praksis en applikasjon) må pakkes inn i en container for å kunne kjøre på nais.
En "container" i denne konteksten betyr at vi pakker inn koden vår sammen med alle avhengigheter koden måtte ha. 
I praksis trenger et pythonscript et operativsystem med python installert, samt alle biblioteker vi skal benytte. 
Vi kommer til å lage en container som inneholder et Linux-basert operativsystem, python 3.9 samt alle bibliotekene vi har definert i vår `requirements.txt`.

### Hemmeligheter

### Kubernetes, nais og applikasjonsmanifestet
*For en utfyllende beskrivelse av nais bør man lese seg litt opp på [nais-dokumentasjonen](https://docs.nais.io/).*

Enhver applikasjon må kjøre et sted. I NAV kjører vi applikasjonene våre på [kubernetes](https://kubernetes.io/), 
som er et virtualiseringslaget på toppen av "stålet", altså datamaskinene som står i en datahall et sted. 
Kubernetes er et veldig kraftig verktøy, men det er også ganske komplisert å konfigurere og å bruke. 
Dette er der nais kommer inn: vi har i praksis skjult mye av kompleksiteten ved å gjøre en del default-valg, 
og gjort det mulig å sette en applikasjon i produksjon på kubernetes [kun med noen få linjer konfigurasjon](https://docs.nais.io/basics/application/).

Konfigurasjonen man må skrive for at en applikasjon skal kunne kjøre på nais kalles et [applikasjonsmanifest.](https://docs.nais.io/nais-application/application/)
For nais-apper kalles dette manifestet som regel `nais.yaml`. 

### CI/CD-pipeline




