---
title: Quarto
---

## Oppdater eksisterende quarto
For å oppdatere en eksisterende quarto fortelling må man først generere ressursfilene på nytt med `quarto render <file>`.

Deretter må man hente ut id for quartoen man ønsker å oppdatere og team tokenet fra [markedsplassen](https://data.intern.nav.no). 

I eksemplene under må følgende byttes ut med reelle verdier:

- `${ENV}` - erstatt med nada.dev.intern.nav.no for dev og nada.intern.nav.no for prod
- `${QUARTO_ID}` - erstatt med id på quarto
- `${QUARTO_TOKEN}` - erstatt med team token fra markedsplassen

Eksemplene tar også utgangspunkt i at det er de to filene `index.html` og `file.html` som skal lastes opp og at man kjører kommandoene fra samme mappe som filene ligger.

#### Med curl

```bash
curl -X PUT -F file=@index.html -F file2=@file.html \
    https://${ENV}/quarto/update/${QUARTO_ID} \
    -H 'Authorization:Bearer ${QUARTO_TOKEN}'
```

#### Med python
```python
import requests

indexb = open("index.html", "rb")
fileb = open("file.html", "rb")

res = requests.put("https://${ENV}/quarto/update/${QUARTO_ID}",
                  headers={"Authorization": "Bearer ${QUARTO_TOKEN}"},
                  files={"file": datab, "file2": fileb})

res.raise_for_status()

datab.close()
fileb.close()
```
