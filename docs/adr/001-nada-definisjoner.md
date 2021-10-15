---
title: 001 / NADA // definisjoner
---

## Kontekst

Vi mangler en god oversikt over definisjoner som blir brukt i NADA-kontekst.

## Avgjørelse

Mål 1. Produsere data
Mål 2. Forbruke data

### / Datasamling //

En datasamling består av et eller flere dataprodukter.


### / Dataprodukt //

Et dataprodukt skal følge de seks egenskapene nedenfor:

- Discoverable
- Adressable
- Trustworthy and truthful (defined & monitored SLOs)
- Self-describing semantics & syntax
- Interoperable (governed by open standards)
- Secure and governed by global access control

Kilde: https://martinfowler.com/articles/data-monolith-to-mesh.html#DomainDataAsAProduct

Et dataprodukt kan inngå i en datasamling.
Et dataprodukt består av metadata og datakilde.
Det er på dette nivået tilganger til datakilden styres.
Et dataprodukt skal ha et skjema, og være dokumentert.


### / Datakilde //

En datakilde er direkte knyttet til et dataprodukt.
NADA støtter følgende datakilder:

- BigQuery view/table
- Fil i en Bucket
- Snowflake table

En datakilde vil typisk bli produsert og oppdatert av en pipeline.


### / Datafortelling //

En datafortelling er en visualisering av data.
Kan inneholde lenker til dataprodukt.


### / Pipeline //

En pipeline er produksjon av en eller flere datakilder.


## Oppsummering

Produksjon av datakilder vil ikke bli styrt av plattformen, men NADA kan komme med anbefalinger på hvordan man bør sette opp en pipeline.

![NADA sine definisjoner og sammenhenger](/img/adr-001.png)