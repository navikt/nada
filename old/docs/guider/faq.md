---
title: FAQ
---

## Hvordan få en Google-bruker?
Alle nada-tjenester i sky krever at du har en Google-bruker utsted av NAV tilknyttet din @nav.no-epostadresse.
Alle som er medlem av et [NAIS team](https://docs.nais.io/basics/teams/) har dette fra før av.
Andre må gi seg selv tilgang via [My Apps](https://myapps.microsoft.com/). 
Trykk på de tre prikkene (...) oppe til høyre og "Be om nye apper (+)". 
Velg _Google Cloud Plattform_.
Det kan ta opp til 40 minutter før dette er synkronisert slik at du kan logge deg inn.

## Hvordan snakke med BigQuery fra lokal maskin?

Da må du autentisere deg med Google, dette kan gjøres via [gcloud-cli](https://cloud.google.com/sdk/docs/install).
Kjør følgende kommando `gcloud auth login --update-adc`.
Du vil da bli spurt om å logge inn via nettleseren din.
Når dette er gjort kan du snakke med BigQuery via for eksempel `pandas-gbq` Python-modulen.

## Hvordan snakke med Vault fra on-prem Naisjob?

Når man kjører en Naisjob i on-prem og har hemmeligheter i Vault må disse bli hentet ved oppstart av jobben.
Dette kan løses ved bruk av Vault-config i [applikasjonsmanifestet](https://docs.nais.io/naisjob/reference/#vault).
Da vil hemmelighetene dine lastes inn som filer som du kan lese fra din kode.
Ønsker du å ha de som miljøvariabler så kan dere bruke [navikt/baseimages](https://github.com/navikt/baseimages/), som har støtte for å transformere Vault-hemmeligheter som slutter på `.env` til miljøvariabler.

## Hvordan opprette nytt BigQuery datasett fra on-prem?

Hvis du bruker Naisjob i GCP så kan du sette dette opp via [applikasjonsmanifestet](https://docs.nais.io/naisjob/reference/#gcpbigquerydatasets), og da blir tilganger for din Naisjob satt opp automatisk.
For on-prem kan du følge [Creating datasets](https://cloud.google.com/bigquery/docs/datasets) fra Google.


## Hvordan få tilgang til BigQuery fra en Naisjob i on-prem?

For å kunne snakke med BigQuery trenger dere et token for en service account som har tilgang til å lese BigQuery.
Følg guiden [Createing a service account](https://cloud.google.com/iam/docs/creating-managing-service-accounts#iam-service-accounts-create-console) hos Google, og så følger dere guiden [Creating service account keys](https://cloud.google.com/iam/docs/creating-managing-service-account-keys).

Når dette er gjort så ender dere opp med en JSON-fil som er hemmeligheten dere trenger å legge inn i Vault, som igjen da blir eksponert i jobben deres. For at Pandas eller andre rammeverk skal plukke denne opp automatisk så må den være eksponert som en miljøvariabel som heter `GOOGLE_APPLICATION_CREDENTIALS`.

## Hvordan kan jeg sjekke etter sårbarheter i biblioteker jeg installerer på notebook servere på GCP?
NADA tilbyr ikke noen automatisk sjekk av hva som installeres på hver enkelt notebook server i GCP og det er opp til hver enkelt bruker selv å avgjøre om et bibliotek kan tas i bruk.

Det finnes flere verktøy en kan bruke som sjekker etter kjente sårbarheter i tredjeparts biblioteker i en rekke programmeringsspråk. Det mest kjente verktøyet for dette er [snyk](https://snyk.io/) som blant annet støtter python.

For å sjekke etter sårbarheter i python biblioteker med snyk kan man:

- enten opprette et github repo og legge en requirements.txt fil med alle biblioteker man ønsker å installere og legge til repoet under [navikt organisasjonen på snyk](https://app.snyk.io/org/navikt/projects). Da vil det kontinuerlig kjøres sjekker etter sårbarheter i bibliotekene listet opp i requirements.txt.
- eventuelt kan man bruke [kommandolinjeverktøyet](https://docs.snyk.io/snyk-cli/install-the-snyk-cli) til å sjekke et bibliotek manuelt før installasjon.
