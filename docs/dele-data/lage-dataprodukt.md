---
title: Lage dataprodukt
---

Et dataprodukt tar utgangspunkt i en datakilde som kan være så mangt.
Per i dag støtter NAV Data kun BigQuery som kilde, men flere kilder vil bli lagt til etter nødvendighet.

Teamet som eier datakilden er selv nødt til å finne passende løsning for opprettelse og vedlikehold av datakilden.

## Anbefalinger

### BigQuery for data
Vi anbefaler at data lagres i BigQuery.
BigQuery støtter tilgangsstyring og teamet kan velge å bruke Views for å lage dataprodukter av et subset av kildedataen.

### Naisjob for prosessering
[Naisjob](https://doc.nais.io/naisjob/) er en tjeneste i NAIS som lar deg kjøre kode èn gang eller på en tidsplan.
Naisjob støtter å opprette BigQuery datasett og sørger for at jobben har tilgang til dette.
