# Registrere dataprodukt
Etter at teamet har laget BigQuery-tabellene med analytiske data, kan disse registreres på [Markedsplassen](https://data.intern.nav.no).
Dette gjøres ved at man registrerer `datasettet` som del av et `dataprodukt`.

## I: Dataprodukt
Dataproduktet er en samling av et eller flere datasett som naturlig hører sammen.
Teamet velger selv hvilke tabeller som naturlig hører sammen, men tabellene må være i samme GCP-prosjekt.
Dataprodukter registreres på Markedsplassen under `Legg til nytt dataprodukt` i headeren.
Der oppgis navn, beskrivelse, team i Teamkatalogen samt kontaktpunkt til teamet.

## II: Datasett
Datasett legges til ved at man klikker seg inn på et `dataprodukt` på [Markedsplassen](https://data.intern.nav.no).
Under `Legg til datasett` kan man registrere den aktuelle tabellen fra BigQuery sammen med metadata som gjør det enklere for teamet å beholde oversikten.
Metadata gjør det også enklere for folk utenfor teamet å finne dataene.
Beskrivelser av kolonnene i tabellen kan legges inn i [BigQuery-konsollet](https://console.cloud.google.com/bigquery).