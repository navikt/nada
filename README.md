# NADA dokumentasjon

NADA sin dokumentasjon om [Datamarkedsplassen](https://data.ansatt.nav.no) og [KNADA](https://knorten.knada.io).

Tilgjengelig på [docs.knada.io](https://docs.knada.io).

## Development

This website is built using [MkDocs](https://www.mkdocs.org/).

### Install

```
$ poetry install
```
or
```
$ pip install mkdocs mkdocs-pymdownx-material-extras mkdocs-build-plantuml-plugin
```

### Local Development

```
$ poetry run mkdocs serve
```

```
$ mkdocs serve
```

This command starts a local development server on localhost:8000. Most changes are reflected live without having to restart the server.

### Build

```
$ poetry run mkdocs build
```
or

```
$ mkdocs build
```

This command generates static content into the `site` directory and can be served using any static contents hosting service.

### Deployment

A push to `main` triggers a deployment workflow.
