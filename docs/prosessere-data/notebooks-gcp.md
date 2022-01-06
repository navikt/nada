---
title: Notebooks med tilgang til on-prem
---

Et teamprosjekt i GCP har av sikkerhetsmessige årsaker ikke tilgang til datakilder on-prem.
All den tid mange relevante datakilder kun er tilgjengelig on-premises, er det etablert en løsning for å nå disse datakildene via et eget prosjekt.
Ta kontakt med oss i [#nada](https://nav-it.slack.com/archives/CGRMQHT50) for å få tilgang til dette prosjektet.
I motsetning til notebooks i team-prosjekter, er disse notebookene på private nett og uten mulighet for tilkobling direkte fra internett.
Det vil derfor være behov for noen ekstra steg for å kunne nå notebooken.

## Lage notebook
1. Gå til [knada-gcp Google console](https://console.cloud.google.com/vertex-ai/workbench/list/instances?orgonly=true&project=knada-gcp&supportedpurview=organizationId)
2. Velg `New Notebook` og velg `Customize`
3. Fyll inn alle obligatoriske felter:
   - Notebook name - Navn på kladdeboka
   - Region - europe-west1 (Belgium)
   - Zone - En sone innenfor regionen
   - Environment - Velg et miljø som passer ditt behov/språk
   - Machine type og GPU - Hvor kraftig maskin du trenger
4. Ekspander `Networking`
   - Under `External IP` velg none
4. Ekspander `Permission`
   - Under `Access to JupyterLab` velg 
      - `Single user only` 
5. Trykk `Create`
6. Når maskinen er ferdig laget, kjører du følgende kommandoer for å tilgjengeliggjøre den via naisdevice (eller analyktiker desktop):
```bash
gcloud compute --project "knada-gcp" ssh  "<navn på notebook>"

sudo -i

echo "c.ServerApp.ip = '*'
c.ServerApp.token = "<et godt personlig passord>"
c.ServerApp.allow_remote_access = True
" >> /home/jupyter/.jupyter/jupyter_notebook_config.py

systemctl restart jupyter
```

## Åpne notebook
Siden notebooken ikke er tilgjengelig på internett, må vi benytte den private adressen til notebookserveren.
Denne finner du ved å trykke på din notebook i [Google console](https://console.cloud.google.com/vertex-ai/workbench/list/instances?project=knada-gcp)
Der finner du `Primary internal IP` under `Network interfaces`
Bruk denne ip-adressen når du skal åpne din notebook.
Eks. `https://10.6.5.4:8080`


## Credentials og hemmeligheter.
For at notebooken skal bruke din personlige bruker når den henter hemmeligheter, må du logge inn og sette 

## Maskin type og GPU
Det er du som vet best hva du trenger, derfor er det ingen begrensninger på hva du kan velge av maskin og GPU.
Bare husk at det kan bli veldig kostbart hvis du lar en maskin (med mye minne og GPU) stå uten at den blir brukt.

## Stoppe en maskin
Har du en maskin du ikke trenger for en periode, men ikke ønsker å [slette](#slette-en-maskin), så kan du stoppe den.
Velg maskinen i [oversikten](https://console.cloud.google.com/ai-platform/notebooks/instances) og trykk `STOP` i toppen.

## Slette en maskin
Har du en maskin du ikke trenger lenger, så kan du slette den.
tVelg maskinen i [oversikten](https://console.cloud.google.com/ai-platform/notebooks/instances) og trykk `DELETE` i toppen.
