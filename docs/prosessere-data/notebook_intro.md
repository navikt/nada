---
title: Notebooks
---

Vi tilbyr [Jupyter Notebooks](https://jupyter.org/) i GCP.
Disse finner man under [Vertex AI/Workbench  (doc)](https://cloud.google.com/vertex-ai/docs/workbench), sammen med en del andre verktøy.
Du gir deg selv tilgang til GCP i [myapps](https://myapps.microsoft.com).

I GCP jobber man i det som kalles prosjekter, og hvert team har sitt eget prosjekt.
Den enkleste måten å komme i gang er å bli en del av et team, og jobbe i deres GCP prosjekt.

Har man behov for noe mer privat, kan man få opprettet sitt eget _on-demand_-prosjekt, som skal være et midlertidig GCP prosjekt, for en spesifikk analyse man jobber med.
Så bistår man flere teams, er det meningen at man skal ha forskjellige prosjekter.


Man kan til enhver tid se hvilke prosjekter man er medlem av ved å gå til [GCP Billing](https://console.cloud.google.com/billing/projects?project=&folder=&organizationId=139592330668).

Så hvis man skal jobbe i et team prosjekt, så kan man gå direkte til [GCP Dashboard](https://console.cloud.google.com/projectselector2/home/dashboard) og velge teamet sitt under **select project**.

## Tilgang til kildesystem

Et teamprosjekt i GCP har av sikkerhetsmessige årsaker ikke tilgang til datakilder on-prem.
All den tid mange relevante datakilder kun er tilgjengelig on-prem, er det etablert en løsning for å nå disse datakildene via et eget GCP-prosjekt (KNADA-GCP).

Notebook-server i GCP har ikke tilgang til følgende tjenester:

* Aiven-tjenester (Kafka, OpenSearch)
* API-tjenester i NAIS-clustere
* Datapakker
* Kafka (on-prem)

## Maskintype og GPU
Det er du som vet best hva du trenger, derfor er det ingen begrensninger på hva du kan velge av maskin og GPU.
Bare husk at det kan bli veldig kostbart hvis du lar en maskin (med mye minne og GPU) stå uten at den blir brukt.

## Stoppe en maskin
Har du en maskin du ikke trenger for en periode, men ikke ønsker å [slette](#slette-en-maskin), så kan du stoppe den.
Velg maskinen i [oversikten](https://console.cloud.google.com/ai-platform/notebooks/instances) og trykk `STOP` i toppen.

## Slette en maskin
Har du en maskin du ikke trenger lenger, så kan du slette den.
Velg maskinen i [oversikten](https://console.cloud.google.com/ai-platform/notebooks/instances) og trykk `DELETE` i toppen.
