Vi kan overvåke om BigQuery-tabellene står til forventningene våre gjennom [Soda (ekstern lenke)](https://www.soda.io).
Sjekker evalueres, Slack-varslinger sendes og resultater tilgjengeliggjøres når dere endrer bittelitt config i [navikt/dp-nada-soda](https://github.com/navikt/dp-nada-soda) og deployer Naisjoben.

Sjekkene defineres i Yaml.

Se for eksempel sjekken vi gjør for å se om tabellen `vedtak` er oppdatert siste døgn ved å se på observasjonene i kolonnen `innsamlet`:

```
checks for vedtak:
  - freshness(innsamlet) < 1d
```

[Dokumentasjonen til Soda](https://docs.soda.io/soda-cl/soda-cl-overview.html) beskriver godt hvilke sjekker som kommer ut av boksen og hvordan dere kan lage egendefinerte.

## Oppsett av Dependabot for å automatisk holde Soda-imaget oppdatert
Dersom dependabot ikke kan konfigureres for docker imager som ligger i google artifact registry pusher vi Soda-imaget vårt både til GAR og GHCR med samme tag.
Men ettersom vi kun kan deploye på nais-platformen med imager lagret i GAR kan følgende fremgangsmåte benyttes for automatisk å holde Soda-imaget oppdatert.

1. Opprett en dummy Dockerfil på rot i repoet ditt, for eksempel `Dockerfile.dummy` med følgende innhold:

```dockerfile
FROM ghcr.io/navikt/nada-soda/soda:2025.06.03-10.46-b16fa04
```
2. Opprett eller editer eksisterende `dependabot.yaml` i `.github`-mappen i repoet med følgende innhold:

```yaml
version: 2

registries:
  ghcr:
    type: docker-registry
    url: ghcr.io
    username: user
    password: ${{ secrets.READER_TOKEN }}

updates:
  - package-ecosystem: "docker"
    registries:
      - ghcr
    directory: "/"
    schedule:
      interval: "daily"
```
3. Opprett så en github action `.github/workflows/bump_soda_image.yaml` med følgende innhold:

```yaml
name: Update Soda Image Tag
on: 
  push:
    branches:
      - 'main'
    paths:
      - 'Dockerfile.dummy'

permissions:
  contents: write

jobs:
  deploy:
    name: Update Soda Image Tag
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Commit tag changes
        run: |
          newtag=$(awk -F "FROM ghcr.io/navikt/nada-soda/soda:" '{print $2}' Dockerfile.dummy)
          sed -i "s|image: .*|image: europe-north1-docker.pkg.dev/nais-management-233d/nada/nada-soda:${newtag}|g" .nais/naisjob.yaml
          git config --global user.email ${{ github.actor }}@users.noreply.github.com
          git config --global user.name ${{ github.actor }}
          git add .nais/naisjob.yaml
          git commit -m "Updated Soda image tag to ${newtag}"
          git push
```

(forutsetter at manifestet til naisjobben ligger i `.nais/naisjob.yaml`, endre dette om nødvendig)
4. Legg til en `workflow_run` trigger for github actionen som deployer naisjobben:

```yaml
...
on:
...
  workflow_run:
    workflows:
      - Update Soda Image Tag
    types:
      - completed
---
```