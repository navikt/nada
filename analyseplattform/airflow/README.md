# Airflow på knada
Apache airflow er et verktøy for å orkestrere, skedulere og monitorere datapipelines. Web-grensesnittet til airflow gir 
brukeren enkel tilgang til å lese logger fra de ulike stegene i pipelinen, trigge datapipelines manuelt og sjekke
statistikk på tidligere kjøringer. 


En datapipeline i airflow, eller DAG (Directed Acyclic Graph), er et sett med oppgaver man ønsker å kjøre som beskriver
rekkefølge og avhengigheter mellom oppgavene. Disse DAGene beskrives programmatisk i python filer og legges i et github
repo som periodisk synkroniseres med airflow instansen. Under er en grafisk representasjon av en slik DAG i airflow:

![Airflow DAG](dag-eksempel.PNG)

Knada plattformen tilbyr team eller enkeltpersoner å sette opp airflow instanser i sine egne k8s namespacer i 
knada clusteret. For mer informasjon om airflow, se [airflow docs](https://airflow.apache.org/docs/apache-airflow/stable/index.html)

## Forutsetninger for å ta i bruk airflow i knada cluster
Eneste forutsetning for å ta i bruk airflow er at man har tilgang til enten et personlig eller team namespace i knada
clusteret. For å få dette må man ha satt opp enten kubeflow eller jupyterhub, se [her](../kubeflow/README.md) 

## Oppsett
For å sette opp airflow må man lage en pull request til [navikt/knada-airflow](https://github.com/navikt/knada-airflow) 
og legge til en yaml-fil med følgende innhold i mappen _airflows_: 

````bash
namespace: <namespace>
ingress: <ingress>
users:
  - <Brukerident 1>
  - <Brukerident 2>
  - ...
dagsRepo: <dagsRepo>
````

_namespace_ over settes til navnet på namespacet hvor airflow instansen skal settes opp.

_ingress_ blir prefikset for adressen til airflow web grensesnittet, altså https://_prefiks_-airflow.knada.adeo.no. Dette 
kan i grunn settes til hva man vil, men det vanligste har vært å sette det til det samme som namespace navnet. 

Under users så lister man opp identene til de som skal ha tilgang til airflow instansen.

_dagsRepo_ er repoet på github som inneholder python-filer med DAGs. 
Repoet trenger ikke inneholde noen DAGer når airflow instansen settes opp, men repoet **må eksistere**.  
*Merk også: repoet må ligge under navikt-orgen på github.*

### DAGs repo
En gang i minuttet vil DAGene som ligger i repoet som spesifiseres under oppsett over synkroniseres til 
airflow instansen.

#### Eksempler på dags repoer 
- [Eksempel dags](https://github.com/navikt/nada-dags) inneholder en rekke eksempler på hvordan å ta i bruk ulike
operators i airflow.
- [Opendata dags](https://github.com/navikt/opendata-dags) er DAGs repoet brukt for opendata datapakker.
