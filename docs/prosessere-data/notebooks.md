---
title: Notebooks
---

Det er også støtte for [Jupyter Notebooks](https://jupyter.org/) i GCP, og disse finner man under [AI Platform (doc)](https://cloud.google.com/ai-platform/docs/technical-overview), sammen med en del andre verktøy.
Du finner den offisielle dokumentasjonen for AI Platform Notebooks hos [cloud.google.com](https://cloud.google.com/ai-platform/notebooks/docs).

Nedenfor har vi laget en liten steg-for-steg guide for å komme i gang.

## Guide

1. Gå til [AI Platform/Notebooks](https://console.cloud.google.com/ai-platform/notebooks/instances)
2. Velg `New Instance` og velg `Customize Instance`
3. Fyll inn alle obligatoriske felter:
   - Instance name - Navn på kladdeboka
   - Region - Velg en av de europeiske
   - Zone - En sone innenfor regionen du valgte
   - Environment - Velg et miljø som passer ditt behov/språk
   - Machine type og GPU - Hvor kraftig maskin du trenger
4. Trykk `Create`
5. Når maskinen er klar til bruk kan du trykke på `Open JupyterLab`

## Maskin type og GPU
Det er du som vet best hva du trenger, derfor er det ingen begrensninger på hva du kan velge av maskin og GPU.
Bare husk at det kan bli veldig kostbart hvis du lar en maskin (med mye minne og GPU) stå uten at den blir brukt.

## Stoppe en maskin
Har du en maskin du ikke trenger for en periode, men ikke ønsker å [slette](#slette-en-maskin), så kan du stoppe den.
Velg maskinen i [oversikten](https://console.cloud.google.com/ai-platform/notebooks/instances) og trykk `STOP` i toppen.

## Slette en maskin
Har du en maskin du ikke trenger lenger, så kan du slette den.
Velg maskinen i [oversikten](https://console.cloud.google.com/ai-platform/notebooks/instances) og trykk `DELETE` i toppen.
