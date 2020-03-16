# Velge database

## Status

Vi har i dag en graf datamodell implementert i Postgres

## Kontekst

Det er krevende å utvikle et gode spørringer. Det er krevende å drifte databasen og garantere oppetid. 

Azure og AWS tilbyr begge grafdatabaser med Apache TinkerPop modell.  

## Decision

Vi har valgt å bruke en skybasert dataserver. Da NAV har avtale med Azure velger vi å bruke denne.

## Consequences

What becomes easier or more difficult to do because of this change?
