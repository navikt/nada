---
title: Metabase
---

[Metabase](https://www.metabase.com/) er en opensource plattform for moderne datautforskning og visualisering.

## Kom igang

Metabase for interne data i NAV er tilgjengelig på [metabase.ansatt.nav.no](https://metabase.ansatt.nav.no/).
Innloggingen gjøres med SSO.

## Hvordan fungerer tilgangsstyring i Metabase?

!!!warning "Med unntak av `all-users@nav.no` så støtter vi ikke at gruppetilganger gitt gjennom Datamarkedsplassen synkroniseres til Metabase. For å få tilgang i Metabase må derfor hver enkelt bruker gis individuell tilgang til datasettet i Datamarkedsplassen. Dette inkluderer også eiere av datasettet."

Dersom teamet legger til datasettet i Metabase (`Legg til i Metabase` på Datamarkedsplassen), vil det være tilgjengelig for de samme som har tilgang til datasettet på Datamarkedsplassen.
Når datasettet legges til i Metabase, vil det opprettes en database (`I` i figuren under) og en collection (`II` i figuren under) i Metabase.
Begge deler er tilgangsbegrenset.
Tilgangsstyringen gjelder både for å lese Dashboard og for å lage dem.

````mermaid
flowchart BT
subgraph Dataprodukt
subgraph Datasett 1
A{Tilganger}
B[(BigQuery-tabell)]
end
end

subgraph Metabase
subgraph II: Tilgangsstyrt collection
C[Dashboard]
D[Questions]
end
E[(I: Database)]
F{Metabase-tilganger}
end

subgraph Annen collection
G[Questions]
H[Dashboard]

end

A --Tilganger til Metabase er <br> er de samme som i BigQuery--> F
B --> E
F --> D
D --> C
G --Personer med tilgang til <br> collectionen har tilgang til <br> *resultatet* fra questionen <br> om den ligger i samme collection. <br> De kan ikke endre questionen <br> eller se data i underliggende tabell--> H
E --> F
F --Kan kun bruke data <br> andre steder om personen <br> har tilgang--> G
````

Datasett som er åpne for alle i NAV (`all-users@nav.no`) synkroniseres automatisk til Metabase og åpnes for alle brukere.

Tilgangsbegrensede elementer i åpent tilgjengelige dashboards vil fortsatt være tilgangsbegrenset.
Det betyr at om du inkluderer data som kun er tilgjengelig for ditt team inn i et åpent dashboards, vil folk utenfor teamet få beskjed om at de ikke har tilgang til akkurat det dataene.

## Hvor skal spørsmål og dashboards lagres?
Tilgangen knyttet til mappen elementene er lagret i bestemmer hvem som kan se dem. Metabase har to toppnivå:

- Personal collections: Her kan du lagre alt som ikke skal være synlig for andre enn deg selv.
- Our analytics: Alt som skal være synlig for andre lagres her. Helst i mapper relatert til det aktuelle dataproduktet.

Det er mulig å flytte elementer mellom mapper etter behov, men husk at det er tilgangen til mappen som bestemmer hvem som kan se spørsmål og dashboard.

## Administere datamodell
Når et datasett legges til i Metabase vil appen gi hvert felt en semantisk type som den tror passer. Hvis Metabase gjetter feil kan det føre til problemer som at du ikke kan summere tall, filtrere på en kategori eller bruke tidsfunksjoner. Dette kan endres i adminmenyen:

1. Trykk på tannhjulet oppe til høyre og gå inn i `Admin settings`. Her finner du alle datasett du har tilgang til via Datamarkedsplassen.
2. Velg tabellen du ønsker å administrere. 
3. Her kan du for hvert felt gjøre endringer som å velge semantisk type og filtertype utifra hva du selv ønsker. Merk at disse endringene vil gjelde for alle som bruker dette datasettet til å lage spørsmål. 

Er du usikker på hvilken type som passer kan du prøve deg fram eller velge en av disse:

- Kategori: `Entity name` eller `Category`
- Tid: `Creation timestamp` eller `Creation date`
- Tall: `Quantity`


## Synkronisering av skjemaendringer
Dersom du gjør endringer på skjemaet til en tabell i BigQuery vil det ta inntil en time før Metabase oppdager endringen av seg selv. Du kan trigge denne synken selv via adminmenyen:

1. Trykk på tannhjulet oppe til høyre og gå inn i `Admin settings`. Her finner du alle datasett du har tilgang til via Datamarkedsplassen.
2. Velg tabellen du ønsker å synkronisere og trykk på det nye tannhjulet som dukker opp i høyre hjørne.
3. Trykk på `Re-scan this table`.
4. Det kan være nødvendig å åpne nettleser på nytt for at den skal få med seg endringen.


## FAQ
Q: Jeg får ikke logget inn. Hva kan jeg gjøre?  
A: Dersom du ikke har vært logget inn i Metabase på lang tid kan brukeren din bli deaktivert. Da må du ta kontakt med #nada på Slack.

Q: Jeg har nettopp lagt til en ny kolonne i BigQuery-tabellen min. Hvorfor dukker den ikke opp i Metabase?  
A: Metabase kjører en synk hver time for å sjekke om skjemaet har endret seg. Det vil derfor ta litt tid før det dukker opp i Metabase automatisk. Dersom du trenger det i Metabase med en gang, følg oppskriften for  synkronisering av skjemaendringer over.

Q: Filter-verdier i Metabase er ikke oppdatert?  
A: Metabase kjører en daglig sync mot hele tabellen i BigQuery for å finne ut av hvilke verdier som finnes. Dette brukes bl.a. til å generere `options` i filter. Disse vil også oppdateres med `Re-scan this table` som forklart over.

Q: Hvorfor får jeg ikke joinet datasett som er åpent tilgjengelig?  
A: Du kan det! Men du må gjøre det med `SQL query`. Et alternativ er å joine tabeller i BigQuery, lage et nytt datasett og legge dette til i Metabase.

Q: Kan jeg koble sammen datasett som er tilgangsbegrenset?  
A: Slik Metabase er satt opp, er det en unik service-bruker per tilgangsbegrensede datasett. 
Det er mulig å gjøre dette i Metabase ved å be datasetteier om å gi tilgang til service-account, men vi anbefaler å lage et view i BigQuery. 

Q: Jeg har tilgang til et datasett i Datamarkedsplassen gjennom å være medlem av en AD-gruppe og får lest data direkte fra BigQuery, hvorfor har jeg da ikke tilgang til samme datasett i Metabase?  
A: I Metabase leses data fra kilden med en service-bruker og ikke din personlige bruker.
Vi har ikke synkronisering av AD-grupper til Metabase, så for å få samme tilgang i Metabase må hver enkelt person legges til manuelt for å inkluderes i korrekt tilgangsgruppe i Metabase.
