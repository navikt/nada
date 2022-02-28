# Produkter i NADA-plattformen

|Produkt|Funksjon|Adresse|Status|
|---|---|---|---|
|NADA docs|Dokumentasjon av plattformtjenestene våre|`docs.knada.io`|Allment tilgjengelig (AT)|
|NAV Data|Markedsplass for deling av dataprodukter i NAV|`data.intern.nav.no`|Allment tilgjengelig (AT)|
|Knada-clusteret|On-prem jupyter notebooks og Airflow - til utforskning, analyse og arbeid med data samt orkestrering av data pipelines.|`[dittnavn].jupyter.adeo.no`|Under avvikling|
|`knada-gcp`|Notebooks i GCP med tilgang til on-prem data (erstatter Knada-clusteret)|[Doc](https://docs.knada.io/prosessere-data/notebooks#server-med-tilgang-til-on-prem)|Allment tilgjengelig (AT)|
|Metabase|GUI-basert dashboardverktøy for å lage visualiseringer|`metabase.intern.nav.no`|Allment tilgjengelig (AT)|
|Amplitude|Brukerinnsikt, analyse av brukeradferd|`analytics.amplitude.com/nav`|Allment tilgjengelig (AT)|
|Datakatalogen|Katalog over data som finnes i NAV|`data.nav.no` <br/> <code><del>data.intern.nav.no</del></code>|Under avvikling (**)|
|Begrepskatalogen|Søkbar oversikt over begreper samt eksport av begreper|`data.nav.no` <br/> <code><del>data.intern.nav.no</del></code>| Uavklart (***)|
|Datapakker|Historiefortelling med data, publisering av statiske dokumenter med visualiseringer|`data.nav.no` <br/> `datapakker.intern.nav.no`|Uavklart (***)|
|~~Arx-as-a-Service~~|Anonymisering og analyse av reidentifikasjonsrisiko|N/A|Avviklet|


*Vi ønsker å avvikle on-prem jupyter notebooks og Airflow på sikt til fordel for tilsvarende funksjonalitet i sky.
Vi har foreløpig ikke kartlagt hvilke konsekvenser dette vil ha eller laget en plan for hvordan vi kan støtte brukernes behov for tilgang til onpremdata fra skyplattformen, så vi regner derfor tjenesten fortsatt for å være AT.

**Datakatalogens data.intern.nav.no vil erstattes av NAV Data. Den eksterne siden data.nav.no har vi foreløpig ikke noen plan for.

***Begrepskatalogen og datapakker vil bli skilt ut av datakatalogen slik at disse kan leve videre på siden. Foreløpig uavklart når og hvordan dette vil skje.
