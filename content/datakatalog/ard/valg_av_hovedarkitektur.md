# Velg av hovedarkitektur

## Status

Denne ADRen er fortsatt under utarbeidelse.

## Kontekst

### Bagrunn

NAV er en sammensatt virksomhet med et stort antall av alle typer entiteter: mange teams, folk og roller; mange systemer, applikasjoner og APIer; mange prosesser, behandlinger og hjemler osv. Informasjon om disse entitetene er ofte knyttet sammen via forskjellige type relasjoner (et team består av et knippe medlemmer, og har ofte ansvar for et/flere system som igjen består av en håndfull mindre applikasjoner, osv). 

Forskjellige behov i virksomheten behøver forskjellige uttrekk av disse entitene og deres sammenhenger. Det er også viktig for virksomheten at vi vet om vi snakker om samme entitet eller ikke i forskjellige sammenhenger. 

Et eksempel på sammenhenger som mange til stadighet har nytte av å kjenne til:
- Hva heter Teamet og hvem er dets medlemmer
- Hvilke systemer og applikasjoner teamet ansvar for
- Hvilke github-repoer styrer de, for å merge PR inn i master og deploye nye versjoner av applikasjonene
- Hvordan kan man best kontakte team/folk når applikasjonene deres opplever feil og ustabilitet
- Hvilke dashboards og logger finnes for applikasjonene, og hvor finner man evt mer informasjon 
- Hvilke data ligger i systemene, hvilke behandlinger gjøres mot disse dataene og hvilke hjemler er behandlingene knyttet til
- Osv

Tilsvarende gjelder for alle de andre entitetstypene - de brukes og refereres til i mange forskjellige kontekster.

Virksomheten har altså mange behov knyttet til å se hvordan alle disse entitetene forholder seg til hverandre, og i dag er denne dataen spredt over mange kilder, gjerne utdatert/upålitelig eller kankje ikke tilgjengelige i det hele tatt.

DDD tilsier at et domene skal eie både sine applikasjoner og sin data. Dette betyr at forskjellige entitetstyper vil bli mastret forskjellige steder i NAV. 

Det er f.eks naturlig at medarbeidere enten mastres i Agresso eller i Azure AD(for å få med eksterne). Andre entiteter kan mastres i andre løsninger. Noen entiteter, som f.eks "Teams" har vi i dag ingen god løsning for(men det jobbes med det).

For å kunne realisere det fulle potensialet i katalogtjenestene, så trenger vi et løsning som kan knytte alle entiteter og deres relasjon sammen i én [graf](https://en.wikipedia.org/wiki/Graph_(abstract_data_type)), samtidig som vi muliggjør at enkelte entitetstyper mastres i eget domene.

## Løsingsalternativer

### A) En sentral graf-tjeneste med innebygget støtte for enkel mastring av entiter

Noen entitetstyper er i dag allerede godt mastret i egne domener (som i Agresso). Slike kilder kan vi lage enkle integrasjoner mot, fortrinnsvis konsumering av hendelser via Kafka, slik at vi får speilet informasjonen i grafen.

Andre entitetstyper manger gode løsninger, og for de så mener vi at det er hensiktsmessig for katalogtjenestene å kunne tilby en form for plugins-basert tilnærming slik at nye entitetstyper kan mastres rett i grafløsningen. Hver entitetstype vil da kunne få en egen plugin som f.eks ivaretar domene-spesifikke valideringer av entitetens metadata der vanlig schema-validering ikke er tilstrekkelig. Som et minimum vil dette inkludere et enkelt API for å kunne opprette, endre og slette entiteter av en gitt type.

### B) En sentral graf-tjeneste uten støtte for mastring av entiteter

Som A, men uten muligheten for å mastre entiteter i løsning (ikke API/plugins).

## Beslutning

What is the change that we're proposing and/or doing?

## Konsekvenser

What becomes easier or more difficult to do because of this change?
