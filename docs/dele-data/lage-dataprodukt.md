---
title: Lage dataprodukt
---

Den første typen [dataprodukt](dataprodukt.md) som støttes av NAV Data er *tabell* i *BigQuery*. 
Denne tabellen vil kunne bli direkte aksessert av konsumenter av dataproduktet. 

Det er mange ulike måter å lage et dataprodukt på. Plattformen har dokumentert følgende metoder:

- [nais-job](../prosessere-data/skedulering/naisjobs.md)
- [scheduled query](../prosessere-data/skedulering/scheduled-query.md)

I tillegg har vi sett at dataprodukter kan lages på andre måter, som for eksempel:

- skrive rett til bigquery fra applikasjonen hvor dataene oppstår
- en kafkakonsument som leser en topic og skriver til bigquery
- ulike former for ETL-jobber

Vi jobber kontinuerlig med å videreutvikle støtte for ulike måter å lage dataprodukter på. 
Vi tar gjerne feedback på dette.
