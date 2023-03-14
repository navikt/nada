# Ordliste

## Datamarkedsplassen 
Vårt finn.no der produsenter viser og forvalter data og innsikt, mens konsumenter finner og ber om tilgang til data.

### Dataprodukt 
En samling av ett eller flere [datasett](dataprodukter/dataprodukt.md#hva-er-et-datasett) som teamet mener hører sammen. Dataproduktet inneholder en overordnet beskrivelse og har en eier med et tilhørende kontaktpunkt. [Les mer om dataprodukt](dataprodukter/dataprodukt.md).

#### Datasett 
En del av et dataprodukt. Består av data, metadata og kode. Data er i dag tilgjengelig i form av views/tabeller på BigQuery.

### BigQuery
Database hostet av Google som er tilgjengelig for team på GCP. [Les om hvordan man kan flytte data til BigQuery](dataprodukter/index.md#flytte-data-til-bigquery).

### Metabase
Dashboard-verktøy integrert med datasettene på markedsplassen. Brukes både av data scientister, utviklere og produktledere. [Les mer om Metabase](analyse/metabase.md).

### Datafortellinger 
Analyser med en "rød tråd". Datafortellinger lages som regel av data scientister. Tidligere har dette vært implementert gjennom vårt egenutviklede Datastory. Fra nå er det Quarto som gjelder. [Les mer om datafortellinger](analyse/datafortellinger.md).

## KNADA 
Analyseplattform bygd på Kubernetes i GCP der Jupyter Notebook og Airflow kjører. Det er åpninger mot FSS som gjør at man kan jobbe med data derfra og kombinere med data i sky.

### Knorten
Portalen for å administrere team som bruker KNADA. Her kan man sette opp Airflow og Jupyter automatisk. [https://knorten.knada.io/](https://knorten.knada.io/) (krever naisdevice).

### Airflow
Orkestrering av jobber. Brukes i dag både til å skedulere enkle jobber og til å håndtere mer komplekse jobber med avhengigheter. Brukes både av data scientister og data engineers i datavarehus. [Les mer om Airflow i KNADA](analyse/airflow/knada-airflow.md).

### Jupyter Notebook 
Verktøyet alle data scientistene bruker. Enkelt å kjøre mindre bolker av kode og visualisere resultater i nettleseren. [Les mer om Notebooks i KNADA](analyse/notebook/knada-notebook.md).