---
title: Tilgangsstyring på Dataplassen
---

Det er teamet som eier tilgangsstyringen på sine dataprodukter og har ansvar for å gi tilgang til riktige grupper, personer eller [servicebrukere](../dataplassen/lag-serviceaccount.md). Du kan se hvilke grupper du er medlem av [her](https://groups.google.com/my-groups). Tilgangene styres ved å legge til e-poster via grensesnittet på [Dataplassen](https://data.intern.nav.no), som automatisk oppdaterer tilgangen på BigQuery-tabellen. Eier av produktet velger om brukerne skal ha fri tilgang, eller ha mulighet til å gi seg selv tilgang. Ved fri tilgang er det eier som bestemmer hvor lenge tilgangen skal gjelde, og i motsatt fall bestemmer bruker varighet samtidig som de gir seg selv tilgang. Eier kan enkelt se alle gitte tilganger og fjerne dem ved behov.

Tilganger som gis via dataplassen er `BigQuery Data Viewer` på tabellnivå og `BigQuery Metadata Viewer` på datasettnivå. Disse sørger for at du kan henholdsvis lese tabellen og se metadata om datasettet tabellen ligger i. Merk at `BigQuery Metadata Viewer` vil eksponere metadata om alle tabeller i datasettet, men gir ikke mulighet til å se datainnholdet i de andre tabellene.