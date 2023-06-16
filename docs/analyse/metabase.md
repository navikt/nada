---
title: Metabase
---

[Metabase](https://www.metabase.com/) er en opensource plattform for moderne datautforskning og visualisering.

## Kom igang

Metabase for interne data i NAV er tilgjengelig på [metabase.intern.nav.no](https://metabase.intern.nav.no/).
Innloggingen gjøres med SSO.

## Hvordan fungerer tilgangsstyring i metabase?
Datasett er ved registrering kun tilgjengelig for teamet som eier data.
Dersom teamet legger til datasettet i Metabase (`Legg til i metabase` på markedsplassen), vil det være tilgjengelig for de samme som har tilgang til datasettet på markedsplassen.
Når datasettet legges til i metabase, vil det opprettes en database og en folder i metabase.
Begge deler er tilgangsbegrenset.

Datasett som er åpne for alle i NAV (`all-users@nav.no`) synkroniseres automatisk til metabase og åpnes for alle brukere.

Tilgangsbegrensede elementer i åpent tilgjengelige dashboards vil fortsatt være tilgangsbegrenset.
Det betyr at om du inkluderer data som kun er tilgjengelig for ditt team inn i et åpent dashboards, vil folk utenfor teamet få beskjed om at de ikke har tilgang til akkurat det dataene.

## Hvor skal spørsmål og dashboards lagres?
Tilgangen knyttet til mappen elementene er lagret i bestemmer hvem som kan se dem. Metabase har to toppnivå:

- Personal collections: Her kan du lagre alt som ikke skal være synlig for andre enn deg selv.
- Our analytics: Alt som skal være synlig for andre lagres her. Helst i mapper relatert til det aktuelle dataproduktet.

Det er mulig å flytte elementer mellom mapper etter behov, men husk at det er tilgangen til mappen som bestemmer hvem som kan se spørsmål og dashboard.

## Administere datamodell
Når et datasett legges til i metabase vil appen gi hvert felt en semantisk type som den tror passer. Hvis metabase gjetter feil kan det føre til problemer som at du ikke kan summere tall, filtrere på en kategori eller bruke tidsfunksjoner. Dette kan endres i adminmenyen:

1. Trykk på tannhjulet oppe til høyre og gå inn i `Admin settings`. Her finner du alle datasett du har tilgang til via Datamarkedsplassen.
2. Velg tabellen du ønsker å administrere. 
3. Her kan du for hvert felt gjøre endringer som å velge semantisk type og filtertype utifra hva du selv ønsker. Merk at disse endringene vil gjelde for alle som bruker dette datasettet til å lage spørsmål. 

Er du usikker på hvilken type som passer kan du prøve deg fram eller velge en av disse:

- Kategori: `Entity name` eller `Category`
- Tid: `Creation timestamp` eller `Creation date`
- Tall: `Quantity`


## Synkronisering av skjemaendringer
Dersom du gjør endringer på skjemaet til en tabell i BigQuery vil det ta inntil en time før metabase oppdager endringen av seg selv. Du kan trigge denne synken selv via adminmenyen:

1. Trykk på tannhjulet oppe til høyre og gå inn i `Admin settings`. Her finner du alle datasett du har tilgang til via Datamarkedsplassen.
2. Velg tabellen du ønsker å synkronisere og trykk på det nye tannhjulet som dukker opp i høyre hjørne.
3. Trykk på `Re-scan this table`.
4. Det kan være nødvendig å åpne nettleser på nytt for at den skal få med seg endringen.


## FAQ
Q: Jeg har nettopp lagt til en ny kolonne i BigQuery-tabellen min. Hvorfor dukker den ikke opp i metabase?  
A: Metabase kjører en synk hver time for å sjekke om skjemaet har endret seg. Det vil derfor ta litt tid før det dukker opp i metabase automatisk. Dersom du trenger det i metabase med en gang, følg oppskriften for  synkronisering av skjemaendringer over.

Q: Filter-verdier i metabase er ikke oppdatert?  
A: Metabase kjører en daglig sync mot hele tabellen i BigQuery for å finne ut av hvilke verdier som finnes. Dette brukes bl.a. til å generere `options` i filter. Disse vil også oppdateres med `Re-scan this table` som forklart over.

Q: Hvorfor får jeg ikke joinet datasett som er åpent tilgjengelig?  
A: Du kan det! Men du må gjøre det med `SQL query`. Et alternativ er å joine tabeller i BigQuery, lage et nytt datasett og legge dette til i Metabase.

Q: Kan jeg koble sammen datasett som er tilgangsbegrenset?  
A: Slik Metabase er satt opp, er det en unik service-bruker per tilgangsbegrensede datasett. 
Det er mulig å gjøre dette i metabase ved å be datasetteier om å gi tilgang til service-account, men vi anbefaler å lage et view i BigQuery. 