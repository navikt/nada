---
title: Generelt for notebooks
---

### Sette opp nbstripout i notebook
For å unngå at output celler fra jupyter notebooks blir pushet sammen med kode til github anbefaler vi å installere [nbstripout](https://github.com/kynan/nbstripout) på repoet ditt lokalt. Dette verktøyet sørger for at output celler i jupyter notebooks utelates fra kode commits.

For å installere, gjør som følger:

- `pip install nbstripout --user`
- Kjør kommandoen `nbstripout --install --global` fra repoet ditt lokalt

### Autentisering

#### Personlig bruker
1. I Jupyterlab, åpne en terminal
2. Kjør kommandoen `gcloud auth login --update-adc`
3. Gå til lenken som vises i terminalen og logg inn med NAV-bruker
4. Etter at du har logget inn kopierer du verifikasjonskoden du får inn i terminalen

Etter å ha utført stegene over vil du i din Notebook kunne jobbe med dine private Google credentials mot kilder.
Denne tilgangen er kun midlertidig, og man må gjøre dette hver dag.

#### Service account
En fersk notebook (både [knada notebook](./knada-notebook.md) og [managed notebook](./managed-notebook.md)) vil automatisk autentisere seg mot gcp-tjenester med service accountens credentials. Det betyr at det er service accounten som trenger tilgang til eksempelvis en bigquery-tabell, og ikke din personlige bruker. Hvis du på et tidspunkt har logget på gcp med din personlige bruker fra notebooken (som beskrevet [her](#personlig-bruker)), må du bytte tilbake til service accounten. Det gjør du slik:

1. Sjekk hvilken bruker som er aktiv med `gcloud auth list`.
2. Hvis det er din personlige, velg service accounten ved å kjøre `gcloud config set account <eposten til service accounten din>`.
3. Fjern tilgangen til din personlige bruker ved å kjøre `gcloud auth application-default revoke --account <din personlige nav-epost>`.

#### Tilpasse connector for raskere spørringer
Ved å justere `arraysize` og `prefetchrows` kan spørringer fra databaser on-prem forbedres markant.
Se for eksempel dokumentasjonen av [cx_Oracle-biblioteket](https://cx-oracle.readthedocs.io/en/latest/user_guide/tuning.html#tuningfetch).
