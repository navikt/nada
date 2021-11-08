---
title: Lage dataprodukt
---

Den første typen [dataprodukt](data-products.md) som støttes av NAV Data er *tabell* eller *view* i *BigQuery*. 
Denne tabellen/viewet vil kunne bli direkte aksessert av konsumenter av dataproduktet. 

Det er mange ulike måter å lage et dataprodukt på. Plattformen har i dag best støtte for:

- [nais-job](https://doc.nais.io/naisjob/)

I tillegg har vi sett at dataprodukter kan lages på andre måter, som for eksempel:

- skrive rett til bigquery fra applikasjonen hvor dataene oppstår
- en kafkakonsument som leser en topic og skriver til bigquery
- federated queries fra postgresql til bigquery
- ulike former for ETL-jobber

Vi jobber kontinuerlig med å videreutvkle støtte for ulike måter å lage dataprodukter på. 
Vi tar gjerne feedback på dette.