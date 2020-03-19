# Plattform for analyse og maskinlæring



## Hva er produktet?

Plattformen bygger på Kubeflow. Kubeflow er tilgjengelig på NAIS. 


## Hva kan det brukes til?

#### Analytisk arbeid: 

Hente data: 

- Python biblioteket dataverk inneholder metoder som gjør det enekelt å lese data fra ulike typer interne datakilder til en pandas dataframe.  

Bearbeide og sammenstille data: 

- Jupyter notebooks på Kubeflow 

Analysere data: 

- Jupyter notebooks på Kubeflow  

Presentere resultatene: Produsere og publisere data

- Dataverk biblioteket understøtter sammenstilling og publisering av datapakker.

#### Maskinlæring: Utvikling, trening og produksjonssetting av modeller

Kubeflow Pipelines kan brukes til bygge maskinlæringspipelines.

Vi har som mål å gjøre Tensorflow Extended (TFX) tilgjengelig på plattformen.

#### Ad-hoc og automatisert publisering av data og statistikk:

Dataverk biblioteket understøtter sammenstilling og publisering av datapakker.

Pipelines på Kubeflow kan brukes til å sette opp jobber som publiserer data og statistikk periodisk eller ved trigget av en hendelse


## Hvordan komme i gang?

### Kubeflow på NAIS

Logg inn her: https://kubeflow.adeo.no

Brukerstøtte: #naisflow

[Om Kubeflow på NAIS](kubeflow/README.md)

### Dataverk

Dataverk er et python bibliotek med diverse ulike verktøy/metoder. Den største delen av verktøysamlingen dreier seg om hente ut og skrive data til/fra ulike typer databaser/datalager. Det finnes også metoder for anonymisering og prikking av data. Og metoder for å lage og publisere datapakker.

Kom igang: pip install dataverk

Brukerstøtte: #datakatalog-intern

[Brukerdokumentasjon](https://dataverk.readthedocs.io/en/latest)

[Om dataverk](dataverk/README.md)


## Kontaktinformasjon

Kontakt oss på  #naisflow


### Litt om arkitektur

![Hovedkomponenter](Analyseplattform.png)





