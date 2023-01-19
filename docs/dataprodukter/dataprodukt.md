Et dataprodukt består av ett eller flere _datasett_, samt en overordnet beskrivelse og et konsept om hvem som eier dataproduktet.
For å opprette et dataprodukt, kan du [gjøre det på Markedsplassen](https://data.intern.nav.no/dataproduct/new) (krever innlogging).

## Hva er et datasett?

_Datasett_ er et konsept i markedsplassen som beskriver en ekstern ressurs, pluss ekstra metadata.
I dag kan en ekstern ressurs kun være en tabell eller et view i BigQuery.

### Metadata i et datasett

Et datasett inneholder

- en beskrivelse
- en peker til en tabell eller et view i BigQuery; den eksterne ressursen
- informasjon om hvem som har lesetilgang til den eksterne ressursen, og hvem som har søkt om tilgang
- hvorvidt det eksisterer personopplysninger i den eksterne ressursen
- lenke til kildekode for det som genererer dataen som finnes i den eksterne ressursen

### Tilgangsstyring

Et datasett er i utgangspunktet tilgangsstyrt.
Det betyr at ingen kan se dataen uten at eier har godkjent en søknad om tilgang.
[Les mer om tilgangsstyring](tilgangsstyring.md).