# Registrere dataprodukt

For å dele et dataprodukt med andre kan teamet registrere dataproduktet på [markedsplassen](https://data.intern.nav.no).
For at en bruker på [markedsplassen](https://data.intern.nav.no) skal være mest mulig selvbetjent er det viktig at teamet skriver en fyldig beskrivelse av dataproduktet. 
Beskrivelsen av et BigQuery dataprodukt kan for eksempel inneholde:
- Introduksjon til tabellen
- Transformasjoner gjort på tabellen
- Hvor ofte dataene oppdateres


I tillegg anbefaler vi å legge inn beskrivelser av kolonnene i tabellen i [BigQuery-konsollet](https://console.cloud.google.com/bigquery) som synces til NAV Data.


### Tilgangsstyring

Det er teamet som eier tilgangsstyringen på sine dataprodukter og har ansvar for å gi tilgang til riktige grupper, personer eller [servicebrukere](../dataplassen/lag-serviceaccount.md).
Her skilles det på to nivåer:

- Har tilgang
- Kan gi seg selv tilgang

Tilgangene styres via grensesnittet i [NAV Data](https://data.intern.nav.no), som automatisk oppdaterer tilgangen i gcp-prosjektet.
