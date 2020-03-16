# Velg av hovedarkitektur

## Status

Denne ADRen er fortsatt under utarbeidelse.

## Kontekst

NAV er en sammensatt virksomhet med et stort antall av alle typer entiteter: mange teams, folk og roller, mange systemer, applikasjoner og APIer, mange prosesser, behandlinger og hjemler osv. Informasjon om disse entitetene er ofte knyttet sammen via relasjoner (et team består av et knippe medlemmer, og har typisk ansvar for et system som består av en håndfull mindre applikasjoner, osv). I mange forskjellige situasjone så behøver forskjellige utsnitt av disse entitene, og deres sammenhenger. Det er også viktig for virksomheten at vi vet om vi snakker om samme entitet eller ikke i forskjellige sammenhenger. Et eksempel kan være at "Team Dagpenger" refereres til på en forutsigbar måte i forskjellige kontekster:
- Knyttet til github repoer og rettighet til å merge PR inn i master og deploye nye versjoner av applikasjonene
- Hvilke medlemmer som er i teamet og som kontaktes når når applikasjonene opplever feil og ustabilitet
- Hvilke kanaler de kan nåes på, og hvor man finner informasjon om de
- Hvilke dashboards og logger de eier/har tilgang til
- Mye mer

Tilsvarende gjelder for alle de andre entitetstypene - de brukes og refereres til i mange forskjellige kontekster.

Virksomheten har mange behov knyttet til å se hvordan alle disse entitetene forholder seg til hverandre, og i dag er slike oversikter enten ikke tilgjengelige i det hele tatt, spredt over mange kilder eller ofte utdatert.

## Beslutning

What is the change that we're proposing and/or doing?

## Konsekvenser

What becomes easier or more difficult to do because of this change?
