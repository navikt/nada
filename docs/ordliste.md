# Ordliste

## Datamarkedsplassen 
Datamarkedsplassen er vårt finn.no, der produsenter viser og forvalter data og innsikt, mens konsumenter finner og ber om tilgang til data.

### Dataprodukt 
Et [dataprodukt](dataprodukter/dataprodukt.md) er en samling av ett eller flere datasett som teamet mener hører sammen. 
Dataproduktet inneholder en overordnet beskrivelse og har en eier med et tilhørende kontaktpunkt. 

#### Datasett 
Et [datasett](dataprodukter/dataprodukt.md#hva-er-et-datasett) er en del av et dataprodukt. 
Det består av data, metadata og kode.
Data er i dag tilgjengelig i form av views/tabeller på BigQuery.

### BigQuery
[BigQuery](dataprodukter/index.md#flytte-data-til-bigquery) er en database hostet av Google som er tilgjengelig for team på GCP. 
BigQuery-tabeller/views kan brukes som datasett.

### Metabase
[Metabase](analyse/metabase.md) er et dashboard-verktøy integrert med datasettene på datamarkedsplassen.

### Datafortellinger 
[Datafortellinger](analyse/datafortellinger.md) er analyser med en "rød tråd".
Tidligere har dette vært implementert gjennom vårt egenutviklede Datastory.
Fra nå er det Quarto som gjelder.

## KNADA 
KNADA er en kodebasert analyseplattform bygd på Kubernetes i GCP der vi tilbyr Jupyter Notebook og Airflow.
KNADA tilbyr åpning mot on-prem FSS, som gjør det mulig å kombinere med data i sky.

### Knorten
Knorten er portalen for å administrere team som bruker KNADA.
Her kan man sette opp Airflow og Jupyter automatisk.
[https://knorten.knada.io (krever naisdevice)](https://knorten.knada.io/).

### Airflow
[Airflow](analyse/airflow/knada-airflow.md) er et orkestreringsverktøy for å kjøre jobber. 
Brukes i dag både til å skedulere enkle jobber og til å håndtere mer komplekse jobber med avhengigheter.
Brukes både av data scientister og data engineers i datavarehus.

### Jupyter Notebook 
[Jupyter Notebook](analyse/notebook/knada-notebook.md) er et webbasert utviklerverktøy for å drive med kodebasert utforsking av data i on-prem eller sky.
Støtter Python.
Gjør det enkelt å kjøre mindre bolker av kode og visualisere resultater i nettleseren.