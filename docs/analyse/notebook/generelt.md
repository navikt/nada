---
title: Generelt for notebooks
---

## Sette opp nbstripout i notebook
> nbstripout er et verktøyet som sørger for at output celler i Jupyter notebooks utelates fra Git commits.

For å unngå at output celler fra Jupyter notebooks blir pushet sammen med kode til Github anbefaler vi å installere [nbstripout](https://github.com/kynan/nbstripout) for repoet ditt.
Dette verktøyet må installeres alle stedet du har repoet sjekket ut.

For å installere, gjør som følger:

- `pip install nbstripout --user`
- Kjør kommandoen `nbstripout --install --global` fra repoet ditt lokalt

## Autentisering

Vi anbefaler alle å lære seg å bruke sin personlige bruker fra Jupyter notebooks, dette for å sikre seg at man bruker kun de tilgangene man selv skal ha.

### Personlig bruker
1. I notebooken, åpne en terminal
2. Kjør kommandoen `gcloud auth login --update-adc`
3. Gå til lenken som vises i terminalen og logg inn med NAV-bruker
4. Etter at du har logget inn kopierer du verifikasjonskoden du får inn i terminalen

Etter å ha utført stegene over vil du i din notebook kunne jobbe med dine private Google credentials mot kilder.
Denne tilgangen er kun midlertidig, og man må gjøre dette hver dag.

### Service account
En fersk notebook (både [KNADA notebook](./knada-notebook.md) og [managed notebook](./managed-notebook.md)) vil automatisk autentisere seg mot GCP-tjenester med service accountens credentials.
Det betyr at man er tilkoblet GCP med en service accounten ut av boksen når man starter opp en notebook.
Bruker du denne service accounten, så er det denne brukeren som må få tilgang til kildene du skal snakke med.
Hvis du på et tidspunkt har logget på GCP med din personlige bruker fra notebooken må du bytte tilbake til service accounten.

Det gjør du slik:

1. Sjekk hvilken bruker som er aktiv med `gcloud auth list`.
2. Hvis det er din personlige, velg service accounten ved å kjøre `gcloud config set account <eposten til service accounten din>`.
3. Fjern tilgangen til din personlige bruker ved å kjøre `gcloud auth application-default revoke --account <din personlige nav-epost>`.

## Tilpasse Oracle connector for raskere spørringer
Ved å justere `arraysize` og `prefetchrows` kan spørringer mot databaser onprem forbedres markant!
Se dokumentasjonen til [cx_Oracle-biblioteket](https://cx-oracle.readthedocs.io/en/latest/user_guide/tuning.html#tuningfetch) for mer informasjon.

## Jupyter extensions

Du kan installere extensions til Jupyter selv på samme måte som du installere Python pakker.
Etter man har installert en extension må du stoppe notebooken og starte den på nytt.

Eksempel for `Git-extension` i KNADA:

```
pip install --upgrade jupyterlab jupyterlab-git --user
```
