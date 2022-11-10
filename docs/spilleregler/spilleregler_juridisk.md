---
title: Juridiske spilleregler
---
De juridiske spillereglene er laget for å hjelpe teamene å gjøre rett hva gjelder juss.
Dette er ikke en uttømmende liste over regler.
Istedet bør dette ses på som et ressurssenter som veileder og svarer ut spørsmål som typisk dukker opp ved deling og bruk av data.

Det er et stort potensiale i å utforske og bruke data til å svare på problemstillinger i NAV.
Disse dataene inneholder ofte personopplysninger med ulik grad av sensitivitet.
Det er derfor  etablert prinsipper og regler som hjelper oss å få verdi ut av dataene samtidig som verdien i personvernet ivaretas.

## Hva må jeg som **produsent** dokumentere om dataene jeg behandler?
Produksjon av data dekker innlesing, bearbeiding og lagring av data på `BigQuery` *før* eventuell deling utenfor teamet.
Denne behandlingen av personopplysninger dokumenteres sammen med eksisterende registrering i `behandlingskatalogen` knyttet til systemet der data oppstår.
I beskrivelsen av behandlingen må det fremkomme at data registreres på markedsplassen og til hvilket formål.
Om behandlingsgrunnlaget er forskjellig fra opprinnelig registrering, må dette oppgis.
Informasjon om hvilke opplysningstyper som inngår i datasettet oppgis ved registrering på markedsplassen.

NAV har ikke en egen hjemmel for å bruke data til innsiktsarbeid.
Formålet med delingen av data er tjenesteutvikling og/eller statistikkproduksjon.

## Er det begrensninger på hvilke data vi kan flytte til sky?
Nei.

## Kan jeg dele data med fødselsnummer?
Ja, men det må foreligge et behandlingsgrunnlag (se under).
Det er viktig at data beskrives slik at konsumenter vet hva de forholder seg til.

## Hvordan fjerner jeg personopplysninger?
Det finnes teknikker for anonymisering av data.
Ta kontakt med [`Team Ansvarlig Data og AI (TADA)`](https://nav-it.slack.com/archives/C03CXENSLMV) for bistand.
Metoden for anonymisering dokumenteres ved registrering av datasett.

## Hvordan er ansvarsdelingen mellom produsent og konsument ved deling av data?
En typisk situasjon er slik: Team (A) har behov for tilgang til produksjonsdata med personopplysninger fra annet team (B)

1. Det forutsettes at team A har gjennomført grunnleggende personvernanalyse (GPA) og evt. personvernkonsekvensvurdering (PVK), hvor de blant annet dokumenterer hjemmel og formål med analysen.
2. Team som eier produksjonsdata (B), mottar forespørsel om produksjonsdata, verifiserer at det foreligger GPA/PVK (referanse til PVK er registrert i behandlingskatalogen).
En viktig presisering er at Team B kun skal verfisere at GPA/PVK samt behandlingsgrunnlag foreligger -- ikke selve innholdet.
3. Dersom Team B ikke har filtrert ut kode 6 og 7 fra datagrunnlaget, skal team A informeres om det.
4. Team A overtar behandlingsansvaret for datasettet som er delt eller utlevert, og personidentifiserende informasjon i datagrunnlaget fjernes i den grad det er mulig.

Dersom konsumenten skal koble datasett med personopplysninger sammen med andre kilder, må konsumenten være spesielt oppmerksom på personvernrisikoen.
Produsenten er ikke forventet å kunne hensynta dette ved vurdering av tilgangsforespørsel.

## Retningslinjer ifm Schrems II-dommen
Disse finnes [her](https://nav-it.slack.com/archives/CGRMQHT50/p1650979093246669?thread_ts=1648108682.804329&cid=CGRMQHT50).