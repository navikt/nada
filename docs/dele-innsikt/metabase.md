---
title: Metabase
---

[Metabase](https://www.metabase.com/) er en opensource plattform for moderne datautforskning og visualisering.

## Kom igang

Metabase for interne data i NAV er tilgjengelig på [metabase.intern.nav.no](https://metabase.intern.nav.no/).

Velg "Logg inn med Google" og bruk din @nav.no-epostadresse (forutsetter at du har en [Google-bruker tilknyttet din @nav-adresse](https://docs.knada.io/guider/faq#hvordan-f%C3%A5-en-google-bruker).)


## Finne dataprodukter i metabase

Dataprodukter som er åpne for alle i NAV synkroniseres automatisk til metabase og åpnes for alle brukere. For alle andre dataprodukter må eier velge `Legg til i metabase` for at det skal dukke opp. I dette tilfellet vil kun de som eksplisitt har bedt om tilgang til dataproduktet via sin personlige bruker ha tilgang til databasen i metabase. Det vil også opprettes en tilgangsstyrt mappe med samme navn som dataproduktet. Innholdet i spørsmål og dashboards som ligger i denne mappen vil bare være synlig for de som har tilgang til mappen. 

## Hvor skal spørsmål og dashboards lagres?

Tilgangen knyttet til mappen elementene er lagret i bestemmer hvem som kan se dem. Metabase har to toppnivå:

- Personal collections: Her kan du lagre alt som ikke skal være synlig for andre enn deg selv.
- Our analytics: Alt som skal være synlig for andre lagres her. Helst i mapper relatert til det aktuelle dataproduktet. 

Det er mulig å flytte elementer mellom mapper etter behov.

## FAQ
Q: Jeg har nettopp lagt til en ny kolonne i BigQuery-tabellen min. Hvorfor dukker den ikke opp i metabase?  
A: Metabase kjører en daglig synk for sjekke om skjemaet har endret seg. Det vil derfor ta litt tid før det dukker opp i metabase automatisk. Dersom du trenger det i metabase med en gang kan noen i nadateamet enkelt trigge synken manuelt.
