# How to: Python ETL-pipeline på nais 101

## Disposisjon
* Introduksjon
  * Hva skal vi gjøre i denne guiden?
  * Hvorfor bruke nais til dette?
* Viktige konsepter å forstå
  * Docker/containers
  * Kubernetes og nais
  * CI/CD
  * Hemmeligheter
* En enkel ETL-pipeline
  * E: Lese fra en kilde (dataprodukt i GCP)
  * T: Test-drevet transformasjonsutvikling
  * L: Skrive til et nytt dataprodukt
* Pipeline
  * Dockerfile
  * naisjob.yaml
  * Github Action
* Drift av pipeline
  * Monitorering
  * Alerts
* Oppsummering

## Introduksjon
I denne guiden viser vi hvordan vi kan lage en data pipeline ("ETL-pipeline") i python og sette denne i produksjon på nais.
Vi vil i eksempelet lese data fra et dataprodukt som ligger på [datamarkedsplassen](../finne-data/navdata.md),
gjøre noen enkle transformasjoner, og skrive data tilbake til en tabell i BigQuery. 
Vi vil skrive tester for transformasjonene våre, slik at vi er trygge på at de gjør det de skal også når vi endrer koden i fremtiden.
Til slutt vil vi pakke koden vår inn i en kjørende container som vi setter i produksjon. 
Vi vil sette pipelinen vår til å kjøre én gang i døgnet ved hjelp av en [naisjob](https://docs.nais.io/naisjob/).

Målgruppen for denne guiden er datautviklere som kan litt python og skal lage data pipelines.

Ved å bruke nais som plattform for pipelinen vår får vi mye gratis. 
Vi får et robust og veltestet kjøretidsmiljø, tilgang på logger og metrikker og alerts, i tillegg til enkle provisjoneringsmekanismer for BigQuery-datasett og hemmeligheter og slikt.


## Grunnleggende konsepter
### Docker / containere
Alle applikasjoner (og data pipelinen vi skal lage er i praksis en applikasjon) må pakkes inn i en container for å kunne kjøre på nais.
En "container" i denne konteksten betyr at vi pakker inn koden vår sammen med alle avhengigheter koden måtte ha. 
I praksis trenger et pythonscript et operativsystem med python installert, samt alle biblioteker vi skal benytte. 
Vi kommer til å lage en container som inneholder et Linux-basert operativsystem, python 3.9 samt alle bibliotekene vi har definert i vår `requirements.txt`.

### Hemmeligheter

### Kubernetes, nais og applikasjonsmanifestet
*For en utfyllende beskrivelse av nais bør man lese seg litt opp på [nais-dokumentasjonen](https://docs.nais.io/).*

Enhver applikasjon må kjøre et sted. I NAV kjører vi applikasjonene våre på [kubernetes](https://kubernetes.io/), 
som er et virtualiseringslaget på toppen av "stålet", altså datamaskinene som står i en datahall et sted. 
Kubernetes er et veldig kraftig verktøy, men det er også ganske komplisert å konfigurere og å bruke. 
Dette er der nais kommer inn: vi har i praksis skjult mye av kompleksiteten ved å gjøre en del default-valg, 
og gjort det mulig å sette en applikasjon i produksjon på kubernetes [kun med noen få linjer konfigurasjon](https://docs.nais.io/basics/application/).

Konfigurasjonen man må skrive for at en applikasjon skal kunne kjøre på nais kalles et [applikasjonsmanifest.](https://docs.nais.io/nais-application/application/)
For nais-apper kalles dette manifestet som regel `nais.yaml`. 

### CI/CD-pipeline
CI/CD (continous integration/deployment) gjør at *team* raskt kan publisere endringer på en tryggere måte.
Noe av dette får vi utbytte av uavhengig av hva vi aktivt velger å gjøre.
Eksempelvis vil det være sjekker av hvorvidt credentials er inkludert i repoet. 
For å få fullt utbytte av CI/CD må vi i tillegg aktivt inkludere en del innhold.
Enhetstester er et eksempel på dette, der CI-løpet vil trigge alle testene som er inkludert i repoet.
Dersom noen av testene ikke returnerer verdien som forventes under forutsetningene lagt inn i testen, vil utvikler umiddelbart få tilbakemelding og pipelinen stanses.

### Hemmeligheter
Kommer!

## En enkel ETL-pipeline
Vi illustrerer hvordan ETL kan gjøres i python gjennom et veldig enkelt eksempel der vi bruker packagen pandas.

### E: Lese fra en kilde
"Extract"-delen av vår ETL består i å lese data fra en BigQuery-tabell.  
Vi gjør dette på følgende måte:
````
import pandas as pd # Tredjepartsbibliotek spesifiseres i docker-imaget

SQL_QUERY = "select * from table_x"

df = pd.read_gbq(SQL_QUERY) # Leser tabellen inn til minnet (hvor er dataene i sky egentlig?)
````

Pandas støtter lesing fra et bredt spekter dokumentert [her](https://pandas.pydata.org/docs/reference/io.html).

### T: Test-drevet transformasjon
I det enkle eksempelet vårt består "transform"-delen at vi skal endre kolonne-headere til lower-case.
Vi bruker funksjonen rename_to_lower:
````
def rename_to_lower(df, columns_to_rename):
    """
    Docstring
    """
    column_mapper = {col: col.lower() for col in columns_to_rename)
    df.rename(column_mapper, axis=1, inplace=True)
    
    return df
````

...som vi forventer skal returnere en bestemt output for en gitt input.
Den logikken vil vi teste med en enhetstest gjennom unittest-modulen:

````
import unittest

import numpy as np
import pandas as pd

class TestRenameColumns(unittest.TestCase):
       
    def test_rename_from_upper(self):
        df = pd.DataFrame({'A': [1, 2], 'B': [1, 2]})
        cols_to_rename = ['A', 'B']
        df_renamed = rename_to_lower(df, cols_to_rename)
        actual = list(df_renamed.columns)
        expected = ['a', 'b']

        self.assertEqual(actual, expected)
        
````
...som gjør oss *litt* tryggere på at funksjonen gjør det den skal.
Om vi dekker de mest relevante variasjonene i input, kan teamet med større trygghet:
1. Utvikle ny kode
2. Gjøre endringer i eksisterende kode

I praksis består transformasjonene som regel av flere steg enn dette. 
Dersom vi faktoriserer koden i mindre deler, gjør vi jobben vår med testing veldig mye enklere.
Det vil da være færre variasjoner å ta hensyn til, siden vi tester hver enkelt del separat.
Når vi "syr sammen" koden til slutt, må vi også teste denne delen av koden.
Disse testene vil dog være mindre omfattende siden vi allerede har testet hver enkelt del av totalen.

I tillegg til *enhetstestene* som skrives, bør vi også teste om det er avhengigheter til andre komponenter.
Disse *integrasjonstestene* vil gjøre at teamet er tryggere på at endringer som gjøres ikke har negative konsekvenser for avhengigheter til vår del.

### L: Skrive til et nytt dataprodukt
Siste steg i ETL-en er å laste dataene.
I vårt eksempel skal vi skrive til BigQuery, men det er mulig å skrive til de flest, vanlige kildeformater.
Vi gjør dette på følgende måte:
````
import pandas as pd
...
# Extract, transform
...
DESTINATION_TABLE = tabell_y
df.to_gbq(tabell_y)

````
