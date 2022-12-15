# NADA dokumentasjon

NADA sin dokumentasjon om [Markedsplassen](https://data.intern.nav.no) og [Knada](knorten.knada.io).

Tilgjengelig på [docs.knada.io](https://docs.knada.io).

## Development

This website is built using [MkDocs](https://www.mkdocs.org/).

### Install
```
$ pip install mkdocs mkdocs-pymdownx-material-extras mkdocs-build-plantuml-plugin
```

### Local Development

```
$ mkdocs serve
```

This command starts a local development server on localhost:8000. Most changes are reflected live without having to restart the server.

### Build

```
$ mkdocs build
```

This command generates static content into the `site` directory and can be served using any static contents hosting service.

### Deployment

Pull request via github action.
