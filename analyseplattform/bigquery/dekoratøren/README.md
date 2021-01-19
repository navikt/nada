# Svar fra "Fant du det du lette etter"
Alle svar skrives til bigquery tabellen _dekoratoren.dekorator_svar_ i _dataplattform_ prosjektet på GCP.

## Få tilgang til data
Ønsker du å lese disse dataene kan du melde behovet i [#data-catalog-intern](https://nav-it.slack.com/archives/CQ9SV9DNE).


Du vil få en serviceaccount nøkkel med tilgang til bigquery datasettet og kan da videre bruke
et [klientbibliotek](https://cloud.google.com/bigquery/docs/reference/libraries) i det språket man selv ønsker.
Under følger et eksempel i python:
````python
import os
from google.cloud import bigquery

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "/sti/til/google/credentials.json"

bq_client = bigquery.Client()
result = bq_client.query("SELECT * FROM dekoratoren.dekorator_svar")

df = result.to_dataframe()
````

## Metrikker i Amplitude
Klikk blir registrert på eventet 'tilbakemelding' i amplitude.  
For å skille svarene på eventer som kommer fra chatbot Frida, la vi på propertien ```kilde: 'footer'``` den 19.01.2021.  
Følgende blir logget:     
Klikk på ja-knapp logger ```{ kilde: 'footer', svar: 'ja' }```  
Klikk på nei-knapp logger ```{ kilde: 'footer', svar: 'nei' }```  
Klikk på 'send svar'-knapp logger ```{ kilde: 'footer', fritekst: 'besvart' }```  
Klikk på avbryt-knapp logger ```{ kilde: 'footer', fritekst: 'ingen kommentar' }```  

### Eksempel på dashboard:  
https://analytics.amplitude.com/nav/chart/ys0z6wc?source=space  
https://analytics.amplitude.com/nav/chart/e4sq1fo?source=space  


