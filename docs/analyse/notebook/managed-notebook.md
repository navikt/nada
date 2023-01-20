---
title: Google managed notebooks
---

Det er to ulike typer GCP prosjekt som kan brukes dersom en ønsker å jobbe i [Google managed notebook servere](https://cloud.google.com/vertex-ai/docs/workbench/introduction):

- [Team-prosjekt server](#team-prosjekt-server): Dette er notebooks som kjøres i teamets GCP prosjekt for formål hvor man _**ikke**_ har behov for å nå onprem kilder
- [Knada-gcp server](#knada-gcp-server): Dette er notebooks som kjøres i `knada-gcp` prosjektet for formål der det er behov for tilgang til kilder som ligger onprem

Oppskriftene under (for [Team-prosjekt server](#team-prosjekt-server) og [Knada-gcp server](#knada-gcp-server)) er forslag til innstillinger som vil passe for de fleste brukere. Der hvor det ikke eksplisitt nevnes at man skal sette noe kan man la default verdien stå. Det er mange ulike konfigurasjonsmuligheter for disse notebook serverene og man står fritt til å sette den opp med de innstillingene man ønsker selv. Men merk særlig det som presiseres under [Maskintype og GPU](#maskintype-og-gpu). Det er også fornuftig å [skru av](#stoppe-en-maskin) disse notebook serveren på slutten av arbeidsdagen med mindre man skal ha noe kjørende der utenfor arbeidstid.

## Team-prosjekt server
Dette vil være en notebook server som settes opp i GCP prosjektet til teamet ditt. 

#### Oppsett
1. Velg riktig prosjekt for teamet ditt i [GCP Cloud console](https://console.cloud.google.com). Dette velger du i nedtrekksmenyen øverst til venstre.
2. Gå så til [Vertex-AI/Workbench](https://console.cloud.google.com/vertex-ai/workbench/instances)
3. Velg `New Notebook` og velg `Customize`
4. Under `Properties`spesifiser følgende:
    - Notebook name - Navn på kladdeboka
    - Region - europe-west1 (Belgium)
    - Zone - En sone innenfor regionen
5. Under `Environment` spesifiser følgende
    - Environment - med mindre man har spesielle behov kan man her velge et av python miljøene
5. Ekspander `Permission`
    - Under `Access to JupyterLab` velg
        - `Single user only` hvis det kun er du som skal ha tilgang til hubben
        - `Service account` hvis alle med tilgang til gcp prosjektet skal ha tilgang
6. Trykk `Create`
7. Når maskinen er ferdig laget, kan du finne og trykke på `Open Jupyterlab` for din notebook server fra [Workbench](https://console.cloud.google.com/vertex-ai/workbench/user-managed) for å få tilgang.


## Knada-gcp server
Dette vil være en notebook server som settes opp i `knada-gcp` prosjektet. Det er et GCP prosjekt satt opp spesifikt for at man skal _**kunne nå onprem kilder**_ fra analyseverktøy på GCP. Dersom man ikke har behov for det anbefales det å heller sette opp en [Team-prosjekt server](#team-prosjekt-server).

#### Oppsett
1. Ta kontakt med oss i [#nada](https://nav-it.slack.com/archives/CGRMQHT50) for å få tilgang til dette prosjektet.
2. Gå til `Vertex AI` i [knada-gcp i Google console](https://console.cloud.google.com/vertex-ai/workbench/list/instances?orgonly=true&project=knada-gcp&supportedpurview=organizationId)
3. Velg `New Notebook` og velg `Customize`
4. Under `Properties`spesifiser følgende:
    - Notebook name - Navn på kladdeboka
    - Region - europe-west1 (Belgium)
    - Zone - En sone innenfor regionen
5. Under `Environment` spesifiser følgende
    - Environment - med mindre man har spesielle behov kan man her velge et av python miljøene
5. Under `Networking`
   - Fjern avhukingen av `Enable external IP address`
6. Under `Permission and security`
    - Fjern avhukingen `Use Compute Engine default service account` og lim inn service accounten knyttet til din bruker, se [her](#personlig-service-account-og-secret-manager-hemmelighet-for-brukerteam) for informasjon om hvor denne finnes
7. Trykk `Create` nederst
8. Når maskinen er ferdig laget, kan du finne og trykke på `Open Jupyterlab` for din notebook server fra [Workbench](https://console.cloud.google.com/vertex-ai/workbench/user-managed?project=knada-gcp) for å få tilgang.

#### Personlig service account og secret manager hemmelighet for bruker/team
For å enklere styre tilgang oppretter vi en unik service account og en secret manager hemmelighet for hver ulike bruker/gruppe som legges til i knada-gcp prosjektet. Disse blir opprettet når man tar kontakt med oss i (1) [her](#server-med-tilgang-til-on-prem).

Du vil finne igjen service accounten [her](https://console.cloud.google.com/iam-admin/serviceaccounts?project=knada-gcp) og hemmeligheten [her](https://console.cloud.google.com/security/secret-manager?project=knada-gcp).


## Maskintype og GPU
Det er du som vet best hva du trenger, derfor er det ingen begrensninger på hva du kan velge av maskin og GPU. Bare husk at det kan bli veldig kostbart hvis du lar en maskin (med mye minne og GPU) stå uten at den blir brukt.


## Stoppe en maskin
Har du en maskin du ikke trenger for en periode, men ikke ønsker å [slette](#slette-en-maskin), så kan du stoppe den. Velg [maskinen](https://console.cloud.google.com/vertex-ai/workbench/instances) i oversikten og trykk `STOP` i toppen.


## Slette en maskin
Har du en maskin du ikke trenger lenger, så kan du slette den. Velg [maskinen](https://console.cloud.google.com/vertex-ai/workbench/instances) i oversikten og trykk `DELETE` i toppen.
