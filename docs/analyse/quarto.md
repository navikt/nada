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

Eksemplene tar utgangspunkt i at det er filen `index.html` som skal lastes opp og at man kjører kommandoene fra samme mappe som filen ligger.

#### Med curl

```bash
curl -X PUT -F file=@index.html \
    https://${ENV}/quarto/update/${QUARTO_ID} \
    -H 'Authorization:Bearer ${QUARTO_TOKEN}'
```

#### Med python
```python
import requests

index_buffer = open("index.html", "rb")

res = requests.put(f"https://${ENV}/quarto/update/{QUARTO_ID}",
                  headers={"Authorization": f"Bearer {QUARTO_TOKEN}"},
                  files={"file": index_buffer})

res.raise_for_status()

index_buffer.close()
```
