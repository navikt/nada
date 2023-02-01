---
title: Google managed notebooks
---

> Vertex AI Workbench is a Jupyter notebook-based development environment for the entire data science workflow. 
> You can interact with Vertex AI and other Google Cloud services from within a Vertex AI Workbench instance's Jupyter notebook.

Du finner den offisielle dokumentasjonen for Managed notebook servere hos [cloud.google.com](https://cloud.google.com/vertex-ai/docs/workbench/introduction).

Det er to ulike typer GCP prosjekt som kan brukes dersom en ønsker å jobbe i [Google managed notebooks](https://cloud.google.com/vertex-ai/docs/workbench/introduction):

- _Team-prosjekt notebook_: Dette er notebooks som kjøres i teamets GCP prosjekt for formål hvor man _**ikke**_ har behov for å nå onprem kilder
- _Knada-gcp notebook_: Dette er notebooks som kjøres i `knada-gcp` prosjektet for formål der det er behov for tilgang til kilder som ligger onprem

Oppskriftene under (for [Team-prosjekt notebook](#team-prosjekt-server) og [Knada-gcp notebook](#knada-gcp-managed-server)) er _forslag til innstillinger_ som vil passe for de fleste brukere.
Der hvor det ikke eksplisitt nevnes at man skal sette noe kan man la defaultverdien stå.

Det er mange ulike konfigurasjonsmuligheter for notebook serverene og man står fritt til å sette de opp med innstillinger man ønsker selv, men merk særlig det som presiseres under [Maskintype og GPU](#maskintype-og-gpu).
Det er også kostnadsbesparende å [skru av](#stoppe-en-maskin) notebook-serveren på slutten av arbeidsdagen med mindre man trenger å ha noe kjørende der utenfor arbeidstid.

=== "Team-prosjekt notebook"

    !!! info inline end "Team-prosjekt"
        Dette vil være en notebook server som settes opp i GCP prosjektet til teamet ditt.
        Man kan til enhver tid se hvilke prosjekter man er medlem av ved å gå til [GCP Billing](https://console.cloud.google.com/billing/projects?project=&folder=&organizationId=139592330668).

    1. Velg riktig prosjekt for teamet ditt i [GCP Cloud console](https://console.cloud.google.com). Dette velger du i nedtrekksmenyen øverst til venstre.
    2. Gå så til [Vertex-AI/Workbench](https://console.cloud.google.com/vertex-ai/workbench/instances)
    3. Velg _New Notebook_ og velg _Customize_
    4. Under _Properties_, spesifiser følgende:
        - _Notebook name_ - Navn på kladdeboka
        - _Region_ - **europe-west1 (Belgium)**
        - _Zone_ - En sone innenfor regionen
    5. Under _Environment_ spesifiser følgende
        - _Environment_ - med mindre man har spesielle behov kan man her velge et av python miljøene
    6. Under _Permission and security_
        - Under _Access to JupyterLab_ velg
            - _Single user only_ hvis det kun er du som skal ha tilgang til hubben
            - _Service account_ hvis alle med tilgang til gcp prosjektet skal ha tilgang
    7. Trykk _Create_ nederst
    8. Når maskinen er ferdig laget, kan du finne og trykke på _Open Jupyterlab_ for din notebook-server fra [Workbench](https://console.cloud.google.com/vertex-ai/workbench/user-managed) for å få tilgang.


=== "Knada-gcp managed notebook"
    !!! warning inline end "`knada-gcp`-prosjekt" 
        Dette vil være en notebook-server som settes opp i `knada-gcp`, som er et prosjekt i GCP satt opp spesifikt for å **kunne nå onprem-kilder** fra analyseverktøy på GCP.
        Dersom man ikke har behov for å nå onprem-kilder anbefales det å sette opp _team-prosjekt notebook_.

    1. Ta kontakt med oss i [#nada på Slack](https://nav-it.slack.com/archives/CGRMQHT50) for å få tilgang til dette prosjektet.
    2. Gå til [Vertex AI i knada-gcp i Google Console](https://console.cloud.google.com/vertex-ai/workbench/list/instances?orgonly=true&project=knada-gcp&supportedpurview=organizationId)
    3. Velg _New Notebook_ og velg **Customize**
    4. Under _Properties_, spesifiser følgende:
        - _Notebook name_ - Navn på kladdeboka
        - _Region_ - **europe-west1 (Belgium)**
        - _Zone_ - En sone innenfor regionen
    5. Under _Environment_, spesifiser følgende
        - _Environment_ - med mindre man har spesielle behov kan man her velge et av python miljøene
    6. Under _Networking_
        - Fjern avhukingen av _Enable external IP address_
    7. Under _Permission and security_
        - Fjern avhukingen _Use Compute Engine default service account_ og lim inn [service accounten knyttet til din bruker](#personlig-service-account-og-secret-manager-hemmelighet-for-bruker-eller-team-i-knada-gcp)
    8. Trykk _Create_ nederst
    9. Når maskinen er ferdig laget, kan du finne og trykke på _Open Jupyterlab_ for din notebook-server fra [Workbench](https://console.cloud.google.com/vertex-ai/workbench/user-managed?project=knada-gcp) for å få tilgang.


## Personlig service account og Secret Manager-hemmelighet for bruker eller team i knada-gcp
For å enklere styre tilgang oppretter vi en unik service account og en Secret Manager-hemmelighet for hver bruker og gruppe som legges til i `knada-gcp` prosjektet.
Ta kontakt med oss i [#nada på Slack](https://nav-it.slack.com/archives/CGRMQHT50) for å få opprettet disse.

Du vil finne igjen service accounten i [IAM Admin i Google Console](https://console.cloud.google.com/iam-admin/serviceaccounts?project=knada-gcp) og hemmeligheten i [Secret Manager i Google Console](https://console.cloud.google.com/security/secret-manager?project=knada-gcp).

## Maskintype og GPU
Det er du som vet best hva du trenger, derfor er det ingen begrensninger på hva du kan velge av maskin og GPU.
Bare husk at det kan bli veldig kostbart hvis du lar en maskin (med mye minne og GPU) stå uten at den blir brukt.


## Stoppe en maskin
Har du en maskin du ikke trenger for en periode, men ikke ønsker å [slette](#slette-en-maskin), så kan du stoppe den.

[Velg maskinen i Vertex AI](https://console.cloud.google.com/vertex-ai/workbench/instances) i oversikten og trykk _STOP_ i toppen.


## Slette en maskin
Har du en maskin du ikke trenger lenger, så kan du slette den.

[Velg maskinen i Vertex AI](https://console.cloud.google.com/vertex-ai/workbench/instances) i oversikten og trykk _DELETE_ i toppen.
