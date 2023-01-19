---
title: Google managed notebooks
---

Det er to ulike typer GCP prosjekt som kan brukes dersom en ønsker å jobbe i [Google managed notebook servere](https://cloud.google.com/vertex-ai/docs/workbench/introduction):

- [Team-prosjekt server](#team-prosjekt-server): Dette er notebooks som kjøres i teamets GCP prosjekt for formål hvor man _**ikke**_ har behov for å nå onprem kilder
- [Knada-gcp server](#knada-gcp-server): Dette er notebooks som kjøres i `knada-gcp` prosjektet for formål der det er behov for tilgang til kilder som ligger onprem


## Team-prosjekt server

### Oppsett
1. Gå til [Vertex-AI/Workbench](https://console.cloud.google.com/vertex-ai/workbench/instances)
2. Velg `New Notebook` og velg `Customize`
3. Fyll inn alle obligatoriske felter:
    - Notebook name - Navn på kladdeboka
    - Region - Velg en av de europeiske
    - Zone - En sone innenfor regionen du valgte
    - Environment - Velg et miljø som passer ditt behov/språk
    - Machine type og GPU - Hvor kraftig maskin du trenger
4. Ekspander `Permission`
    - Under `Access to JupyterLab` velg
        - `Single user only` hvis det kun er du som skal ha tilgang til hubben
        - `Service account` hvis alle med tilgang til gcp prosjektet skal ha tilgang
5. Trykk `Create`
6. Når maskinen er klar til bruk kan du trykke på `Open JupyterLab`


## Knada-gcp server
1. Ta kontakt med oss i [#nada](https://nav-it.slack.com/archives/CGRMQHT50) for å få tilgang til dette prosjektet.
2. Gå til [knada-gcp Google console](https://console.cloud.google.com/vertex-ai/workbench/list/instances?orgonly=true&project=knada-gcp&supportedpurview=organizationId)
3. Velg `New Notebook` og velg `Customize`
4. Fyll inn alle obligatoriske felter:
   - Notebook name - Navn på kladdeboka
   - Region - europe-west1 (Belgium)
   - Zone - En sone innenfor regionen
   - Environment - Velg et miljø som passer ditt behov/språk
   - Machine type og GPU - Hvor kraftig maskin du trenger
5. Ekspander `Networking`
   - Under `External IP` velg none
6. Ekspander `Permission`
   - Under `Identity and API access`
      - Avhuk `Use Compute Engine default service account` og lim inn service accounten knyttet til din bruker, se [her](../notebook_knada/#personlig-service-account-og-secret-manager-hemmelighet-for-brukerteam) for informasjon om hvor denne finnes
7. Trykk `Create`
8. Når maskinen er ferdig laget, kan du trykke på `Open jupyterlab` for å få tilgang.


## Maskintype og GPU
Det er du som vet best hva du trenger, derfor er det ingen begrensninger på hva du kan velge av maskin og GPU. Bare husk at det kan bli veldig kostbart hvis du lar en maskin (med mye minne og GPU) stå uten at den blir brukt.


## Stoppe en maskin
Har du en maskin du ikke trenger for en periode, men ikke ønsker å [slette](#slette-en-maskin), så kan du stoppe den. Velg [maskinen](https://console.cloud.google.com/vertex-ai/workbench/instances) i oversikten og trykk `STOP` i toppen.


## Slette en maskin
Har du en maskin du ikke trenger lenger, så kan du slette den. Velg [maskinen](https://console.cloud.google.com/vertex-ai/workbench/instances) i oversikten og trykk `DELETE` i toppen.