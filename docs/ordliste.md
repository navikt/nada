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

### Metabase
[Metabase](analyse/metabase.md) er et dashboard-verktøy integrert med datasettene på markedsplassen. 
Brukes både av data scientister, utviklere og produktledere.

### Datafortellinger 
[Datafortellinger](analyse/datafortellinger.md) er analyser med en "rød tråd". 
De lages som regel av data scientister.
Tidligere har dette vært implementert gjennom vårt egenutviklede Datastory.
Fra nå er det Quarto som gjelder.

## KNADA 
KNADA er en analyseplattform bygd på Kubernetes i GCP der Jupyter Notebook og Airflow kjører.
Det er åpninger mot FSS som gjør at man kan jobbe med data derfra og kombinere med data i sky.

### Knorten
Knorten er portalen for å administrere team som bruker KNADA.
Her kan man sette opp Airflow og Jupyter automatisk.
[https://knorten.knada.io (krever naisdevice)](https://knorten.knada.io/).

### Airflow
[Airflow](analyse/airflow/knada-airflow.md) orkestrerer jobber. 
Brukes i dag både til å skedulere enkle jobber og til å håndtere mer komplekse jobber med avhengigheter.
Brukes både av data scientister og data engineers i datavarehus.

### Jupyter Notebook 
[Notebooks](analyse/notebook/knada-notebook.md) er verktøyet alle data scientistene bruker.
Enkelt å kjøre mindre bolker av kode og visualisere resultater i nettleseren.