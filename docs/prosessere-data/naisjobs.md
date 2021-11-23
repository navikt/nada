---
title: Naisjobs
---

NAIS plattformen tilbyr skedulering av workloads med deres [naisjob](https://doc.nais.io/naisjob) ressurs. Denne ressurstypen er en abstraksjon på kubernetes sin [cronjob](https://kubernetes.io/docs/konsepter/workloads/controllers/cron-jobs/) som gir deg de samme konfigurasjonsmulighetene som man får med NAIS applikasjoner, eksempelvis muligheten til å provisjonere buckets, postgres/BigQuery og kafka-brukere, samt injeksjon av hemmeligheter i kjøremiljøet til jobben ved runtime.

## Bruksområde
Naisjobs egner seg godt dersom du trenger å skedulere kjøring av kode, f.eks. periodisk oppdatering av [dataprodukter](../konsepter/dataprodukt.md) eller [datafortellinger](../konsepter/datafortelling.md).

## Sette opp naisjob
Se [naisjob doc](https://doc.nais.io/naisjob/#naisjob) for doc på hvordan naisjobs settes opp.

## Eksempler på bruk av naisjobs
- [ereg dataprodukt](https://github.com/navikt/dataprodukt-register-ereg)
- [aareg dataprodukt](https://github.com/navikt/dataprodukt-register-aareg)
- [paw dataprodukt](https://github.com/navikt/dataprodukt_paw)
