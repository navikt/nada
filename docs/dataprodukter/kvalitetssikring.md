Vi kan overvåke om BigQuery-tabellene står til forventningene våre gjennom [Soda (ekstern lenke)](https://www.soda.io).
Sjekker evalueres, Slack-varslinger sendes og resultater tilgjengeliggjøres når dere setter opp en Naisjobb basert på [navikt/dp-nada-soda](https://github.com/navikt/dp-nada-soda).

Det finnes to image-varianter — velg basert på hvilken versjon av Soda dere bruker:

| GAR-image (bruk i naisjob) | Soda-versjon |
|----------------------------|-------------|
| `europe-north1-docker.pkg.dev/nais-management-233d/nada/nada-soda:<tag>` | v3 (SodaCL) |
| `europe-north1-docker.pkg.dev/nais-management-233d/nada/nada-soda-contracts:<tag>` | v4 (Contracts) |

Se [navikt/nada-soda](https://github.com/navikt/nada-soda) for tilgjengelige tags og migrasjonsinfo fra v3 til v4.

## Soda v3 (SodaCL)

Sjekkene defineres i YAML med én fil per BigQuery-datasett. Filnavnet (uten `.yaml`) må matche datasource-navnet i config-filen.

Se for eksempel sjekken vi gjør for å se om tabellen `vedtak` er oppdatert siste døgn:

```yaml
checks for vedtak:
  - freshness(innsamlet) < 1d
```

[Dokumentasjonen til Soda SodaCL](https://docs.soda.io/soda-cl/soda-cl-overview.html) beskriver hvilke sjekker som kommer ut av boksen og hvordan dere kan lage egendefinerte.

Se konkrete eksempler på config og sjekk-filer i [navikt/dp-nada-soda/.nais/dev/soda/](https://github.com/navikt/dp-nada-soda/tree/main/.nais/dev/soda).

## Soda v4 (Contracts)

v4 bruker et nytt format kalt [Data Contracts](https://docs.soda.io/reference/contract-language-reference). De viktigste endringene fra v3:

- **Én fil per tabell** (v3 hadde én fil per datasett med flere tabeller)
- **Nytt config-format** for data source — `dataset` flyttes fra config til kontrakt-filen
- **Nytt image**: `nada-soda-contracts` i stedet for `nada-soda`

Eksempel på en enkel kontrakt:

```yaml
dataset: <datasource_name>/<gcp-project-id>/<bq-dataset>/<table>

checks:
  - row_count:
      threshold:
        must_be_greater_than_or_equal_to: 1

columns:
  - name: id
    checks:
      - missing:
```

Se konkrete eksempler på config og kontrakt-filer i [navikt/dp-nada-soda/.nais/dev/soda-contracts/](https://github.com/navikt/dp-nada-soda/tree/main/.nais/dev/soda-contracts).

## Oppsett av Dependabot for å automatisk holde Soda-imaget oppdatert

Siden Dependabot ikke støtter GAR direkte, publiserer vi Soda-imagene til både GAR og GHCR med samme tag. Følgende fremgangsmåte holder GAR-taggen i naisjob-manifestet oppdatert automatisk.

1. Opprett en dummy Dockerfil `Dockerfile.dummy` på rot i repoet:

```dockerfile
FROM ghcr.io/navikt/nada-soda/soda-contracts:<tag>
```

2. Opprett eller editer `.github/dependabot.yaml`:

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

3. Opprett `.github/workflows/bump_soda_image.yaml` som oppdaterer GAR-taggen i naisjob-manifestet når dummy-filen endres:

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
  actions: write

jobs:
  update-soda:
    name: Update Soda Image Tag
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Commit tag changes
        run: |
          newtag=$(awk -F "FROM ghcr.io/navikt/nada-soda/soda-contracts:" '{print $2}' Dockerfile.dummy)
          sed -i "s|image: .*nada-soda-contracts:.*|image: europe-north1-docker.pkg.dev/nais-management-233d/nada/nada-soda-contracts:${newtag}|g" .nais/naisjob.yaml

          git config --global user.email ${{ github.actor }}@users.noreply.github.com
          git config --global user.name ${{ github.actor }}
          git add .nais/naisjob.yaml
          git diff --staged --quiet || git commit -m "Updated Soda image tag to ${newtag}"
          git push
```

(Tilpass stien til naisjob-manifestet etter deres oppsett.)