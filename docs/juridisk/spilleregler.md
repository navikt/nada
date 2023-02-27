---
title: Spilleregler
---
Spillereglene er laget for å hjelpe teamene å gjøre rett hva gjelder juss.
Dette er ikke en uttømmende liste over regler, men heller en slags FAQ; spørsmål og svar om deling og bruk av data.


## Hva må jeg som **produsent** dokumentere om dataene jeg behandler?
Produksjon av data dekker innlesing, bearbeiding og lagring av data på `BigQuery` *før* eventuell deling utenfor teamet.
Denne behandlingen av personopplysninger dokumenteres sammen med eksisterende registrering i [Behandlingskatalogen](https://behandlingskatalog.nais.adeo.no/) knyttet til systemet der data oppstår.
I beskrivelsen av behandlingen må det fremkomme at data registreres på Markedsplassen og til hvilket formål.
Formålet med delingen av data kan her være tjenesteutvikling og/eller statistikkproduksjon.
Om behandlingsgrunnlaget er forskjellig fra opprinnelig registrering, må dette oppgis.
Informasjon om hvilke opplysningstyper som inngår i datasettet oppgis ved registrering på markedsplassen.

## Er det begrensninger på hvilke data vi kan flytte til sky?
Nei.

## Kan jeg dele data med fødselsnummer?
Ja, men det må foreligge et behandlingsgrunnlag, se [_Hva må jeg som produsent dokumentere om dataene jeg behandler?_](#hva-ma-jeg-som-produsent-dokumentere-om-dataene-jeg-behandler).
Det er viktig at data beskrives slik at konsumenter vet hva de forholder seg til.

## Hvordan fjerner jeg personopplysninger?
Det finnes teknikker for anonymisering av data.
[Ta kontakt med Team Ansvarlig Data og AI (TADA) på Slack](https://nav-it.slack.com/archives/C03CXENSLMV) for bistand.
Metoden for anonymisering dokumenteres ved registrering av datasett.

## Hvordan er ansvarsdelingen mellom produsent og konsument ved deling av data?
En typisk situasjon er slik: Team _Sko_ har behov for tilgang til produksjonsdata med personopplysninger fra team _Hanske_

1. Det forutsettes at team _Sko_ har gjennomført GPA og evt. PVK, hvor de blant annet dokumenterer hjemmel og formål med analysen.
2. Team _Hanske_, som eier produksjonsdata, mottar forespørsel om produksjonsdata og verifiserer at det foreligger GPA/PVK (referanse til PVK er registrert i behandlingskatalogen).
En viktig presisering er at team _Hanske_ kun skal verfisere at GPA/PVK samt behandlingsgrunnlag foreligger—ikke selve innholdet.
1. Dersom team _Hanske_ ikke har filtrert ut kode 6 og 7 fra datagrunnlaget, skal team _Sko_ informeres om det.
2. Team _Sko_ overtar behandlingsansvaret for datasettet som er delt eller utlevert, og personidentifiserende informasjon i datagrunnlaget fjernes i den grad det er mulig.

Dersom konsumenten skal koble datasett med personopplysninger sammen med andre kilder, må konsumenten være spesielt oppmerksom på personvernrisikoen.
Produsenten er ikke forventet å kunne hensynta dette ved vurdering av tilgangsforespørsel.

## Har vi retningslinjer i forbindelse med Schrems II-dommen?

Svaret til dette spørsmålet må holdes internt, men du kan [lese svaret på retningslinjer for Schrems II-dommen på Slack](https://nav-it.slack.com/archives/CGRMQHT50/p1650979093246669?thread_ts=1648108682.804329&cid=CGRMQHT50).


*[FAQ]: frequently asked questions
*[GPA]: grunnleggende personvernanalyse
*[PVK]: personvernkonsekvensvurdering
