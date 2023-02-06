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

Det er mulig å flytte elementer mellom mapper etter behov.

## FAQ
Q: Jeg har nettopp lagt til en ny kolonne i BigQuery-tabellen min. Hvorfor dukker den ikke opp i metabase?  
A: Metabase kjører en synk hver time for å sjekke om skjemaet har endret seg. Det vil derfor ta litt tid før det dukker opp i metabase automatisk. Dersom du trenger det i metabase med en gang kan noen i NADA-teamet enkelt trigge synken manuelt.

Q: Filter-verdier i metabase er ikke oppdatert?  
A: Metabase kjører en daglig sync mot hele tabellen i BigQuery for å finne ut av hvilke verdier som finnes. Dette brukes bl.a. til å generere `options` i filter.

Q: Hvorfor får jeg ikke joinet datasett som er åpent tilgjengelig?  
A: Du kan det! Men du må gjøre det med `SQL query`. Et alternativ er å joine tabeller i BigQuery, lage et nytt datasett og legge dette til i Metabase.

Q: Kan jeg koble sammen datasett som er tilgangsbegrenset?  
A: Slik Metabase er satt opp, er det en unik service-bruker per tilgangsbegrensede datasett. 
Det er mulig å gjøre dette i metabase ved å be datasetteier om å gi tilgang til service-account, men vi anbefaler å lage et view i BigQuery. 