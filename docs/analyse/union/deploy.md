# Deploy tasks med GitHub Actions

Bruk [denne reusable workflowen](https://github.com/navikt/union-deploy) til å deploye Flyte tasks som er definert i en Python-fil, til Union fra repositoryets CI-pipeline.

## Forutsetninger

Før deploy:

- GitHub-repositoryet må være registrert med Union-prosjektet du vil deploye til. Kontakt dataplattform-teamet hvis det ikke er registrert, eller hvis du er usikker.
- Dependency-filen må inkludere `flyte`.
- Tasken må være definert i en Python-fil (`.py`).

## Deploy fra CI

Opprett en workflow, for eksempel `.github/workflows/deploy.yaml`, i repositoryet som inneholder tasken:

```yaml
name: Deploy Union task

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  deploy:
    permissions:
      contents: read
      id-token: write
    uses: navikt/union-deploy/.github/workflows/deploy.yaml@v1
    with:
      flyte-task-file: ./tasks/my_task.py
      dependency-file: ./pyproject.toml
      union-project: my-union-project
      union-domain: development
```

Tilpass filstiene, prosjektet, domenet og triggeren til repositoryet ditt.

Disse permissions kreves for at workflowen skal kunne sjekke ut repositoryet og autentisere mot plattformen uten langtidslevende credentials.

```yaml
    permissions:
      contents: read
      id-token: write
```

## Inputs

| Input | Påkrevd | Beskrivelse |
| --- | --- | --- |
| `flyte-task-file` | Ja | Sti til Python-filen som inneholder én eller flere Flyte tasks, for eksempel `./tasks/my_task.py`. |
| `dependency-file` | Ja | Sti til `pyproject.toml` eller en `requirements*.txt`-fil, for eksempel `./requirements.txt`. Dependencies installeres fra mappen filen ligger i. |
| `union-project` | Ja | Union-prosjektet som er registrert for dette GitHub-repositoryet. Kun bokstaver, tall og bindestreker er tillatt. |
| `union-domain` | Ja | Måldomene: `development`, `staging` eller `production`. |
| `python-version` | Nei | Python-versjonen som skal brukes med en requirements-fil, for eksempel `3.12`. Med `pyproject.toml` konfigurerer du i stedet Python i prosjektet. |

Workflowen installerer dependencies for prosjektet slik at den kan importere task-definisjonen og kjøre Flytes deploy-kommando. Dette bygger ikke task-imaget i GitHub Actions. Union bygger imaget som skal deployes, ved hjelp av sin remote image builder.

Slik velger du Python-versjon når du bruker en requirements-fil:

```yaml
    with:
      flyte-task-file: ./tasks/my_task.py
      dependency-file: ./requirements.txt
      union-project: my-union-project
      union-domain: development
      python-version: "3.12"
```

## Feilsøking

- **Feil ved autentisering eller permissions:** Kontroller at GitHub-repositoryet er registrert med verdien som sendes til `union-project`, og at begge permissions fra eksempelet er angitt.
- **`flyte` er ikke installert:** Legg til `flyte` i `pyproject.toml`- eller requirements-filen.
- **Task- eller dependency-filen finnes ikke:** Stiene er relative til roten av repositoryet. Kontroller stavemåten og plasseringen til begge filene.
- **Ugyldig domene:** Bruk nøyaktig `development`, `staging` eller `production`.
- **Dependencies avviker fra lokalmiljøet:** Workflowen tar foreløpig ikke hensyn til `uv.lock`. Når du bruker `pyproject.toml`, løses dependencies på nytt gjennom vår interne PyPI-proxy. Det kan føre til at andre versjoner velges enn i den lokale lockfilen. Dette vil kunne endres når en ny PyPI-proxy (Artifact Keeper) er klar. Da vil vi kreve at `uv.lock`-filer bygges med denne proxyen.
