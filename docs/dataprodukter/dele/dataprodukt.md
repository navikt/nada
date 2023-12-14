# Registrere dataprodukt
Etter at teamet har laget BigQuery-tabellene med analytiske data, kan disse registreres på [Datamarkedsplassen](https://data.intern.nav.no).
Dette gjøres ved at man registrerer `datasettet` som del av et `dataprodukt`.

## I: Dataprodukt
Dataproduktet er en samling av et eller flere datasett som naturlig hører sammen.
Teamet velger selv hvilke tabeller som naturlig hører sammen, men tabellene må være i samme GCP-prosjekt.
Dataprodukter registreres på Datamarkedsplassen under `Legg til nytt dataprodukt` i headeren.
Der oppgis navn, beskrivelse, team i Teamkatalogen samt kontaktpunkt til teamet.

## II: Datasett
Datasett legges til ved at man klikker seg inn på et `dataprodukt` på [Datamarkedsplassen](https://data.intern.nav.no).
Under `Legg til datasett` kan man registrere den aktuelle tabellen fra BigQuery sammen med metadata som gjør det enklere for teamet å beholde oversikten.
Metadata gjør det også enklere for folk utenfor teamet å finne dataene.
Beskrivelser av kolonnene i tabellen kan legges inn i [BigQuery-konsollet](https://console.cloud.google.com/bigquery).


### Pseudonymisering av datasett
Team har ofte data om enkeltpersoner der vi trenger identifikatorer for å kunne koble tabeller sammen og følge personer over tid.
Vi tilbyr en løsning for å registrere BigQuery-views der valgte kolonner pseudonymiseres.
Pseudonymiserte views baserer seg på en hvilken som helst BigQuery-tabell/view i teamets prosjekt.
Ved registrering av `datasett`, kan du velge å pseudonymisere tabellen.
Du må velge minst èn kolonne som skal pseudonymiseres.
Vi oppretter et eget view i teamets prosjekt der kolonnene er pseuodnymisert.
