---
title: Notebooks
---

Det er også støtte for [Jupyter Notebooks](https://jupyter.org/) i GCP, og disse finner man under [AI Platform (doc)](https://cloud.google.com/ai-platform/docs/technical-overview), sammen med en del andre verktøy.
Du finner den offisielle dokumentasjonen for AI Platform Notebooks hos [cloud.google.com](https://cloud.google.com/ai-platform/notebooks/docs).

Nedenfor har vi laget en liten steg-for-steg guide for å komme i gang.

## Guide

1. Gå til [AI Platform/Notebooks](https://console.cloud.google.com/ai-platform/notebooks/instances)
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

## Autentisering med brukers credentials på hubben

1. I Jupyterlab, åpne en terminal
2. Kjør kommandoen `gcloud auth login --update-adc`
3. Gå til lenken som vises i terminalen og logg inn med nav-bruker
4. Etter at du har logget inn kopierer du verifikasjonskoden du får inn i terminalen

Etter å ha utført stegene over vil du i notebooks kunne jobbe med dine private google credentials mot kilder.

## Maskin type og GPU
Det er du som vet best hva du trenger, derfor er det ingen begrensninger på hva du kan velge av maskin og GPU.
Bare husk at det kan bli veldig kostbart hvis du lar en maskin (med mye minne og GPU) stå uten at den blir brukt.

## Stoppe en maskin
Har du en maskin du ikke trenger for en periode, men ikke ønsker å [slette](#slette-en-maskin), så kan du stoppe den.
Velg maskinen i [oversikten](https://console.cloud.google.com/ai-platform/notebooks/instances) og trykk `STOP` i toppen.

## Slette en maskin
Har du en maskin du ikke trenger lenger, så kan du slette den.
Velg maskinen i [oversikten](https://console.cloud.google.com/ai-platform/notebooks/instances) og trykk `DELETE` i toppen.
