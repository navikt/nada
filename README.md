# NADA dokumentasjon

NADA sin dokumentasjon om [Datamarkedsplassen](https://data.ansatt.nav.no) og [KNADA](https://knorten.knada.io).

Tilgjengelig på [docs.knada.io](https://docs.knada.io).

## Development

This website is built using [Zensical](https://zensical.org/).

### Prerequisites

Install [uv](https://astral.sh/uv/).

```bash
curl -LsSL https://astral.sh/uv/install.sh | sh
```

### Install

```bash
uv sync
```

### Local Development

```bash
uv run zensical serve
```

This command starts a local development server on localhost:8000. Most changes are reflected live without having to restart the server.

### Build

```bash
uv run zensical build
```
or

```bash
source .venv/bin/activate
zensical build
```

This command generates static content into the `site` directory and can be served using any static contents hosting service.

### Deployment

A push to `main` triggers a deployment workflow.
