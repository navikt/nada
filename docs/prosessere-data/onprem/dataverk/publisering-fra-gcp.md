---
title: Publisere fra GCP prosjekter
---

Når man har satt opp et [on-demand GCP projekt](https://github.com/navikt/knada-on-demand-projects) så vil noe
dataverk konfigurasjon bli lagret som hemmeligheter i [Google Secret Manager](https://cloud.google.com/secret-manager/docs) 
i det opprettede prosjektet. Disse konfigurasjonsverdiene må importeres og settes som miljøvariabler for at dataverk skal fungere når datapakker skal 
publiseres fra GCP.

For å forenkle dette har vi utviklet et python biblioted [dataverk-gsm](https://github.com/navikt/dataverk-gsm) som kan brukes som følger:
````python
from dataverk_gsm import api as gsm_api

gsm_api.set_secrets_as_envs()
````

:::info
For å kunne publisere datapakker fra GCP prosjekter må installert versjon av dataverk >= 0.4.4
:::
