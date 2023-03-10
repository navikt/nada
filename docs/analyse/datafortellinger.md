---
title: Datafortelling
---
Datafortellinger brukes til å dele innsikt i form av statiske dokumenter.
Datafortellinger kan kan enkelt deles med andre i NAV gjennom Markedsplassen.

## Lage quarto
Se dokumentasjon på [Quarto sine sider](https://quarto.org).

## Oppdater eksisterende quarto
For å oppdatere en eksisterende quarto fortelling må man først generere ressursfilene på nytt med `quarto render <file>`.

Deretter må man hente ut id for quartoen man ønsker å oppdatere og team-tokenet fra [markedsplassen](https://data.intern.nav.no).

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

res = requests.put(f"https://{ENV}/quarto/update/{QUARTO_ID}",
                  headers={"Authorization": f"Bearer {QUARTO_TOKEN}"},
                  files={"file": index_buffer})

res.raise_for_status()

index_buffer.close()
```


## Datastory-biblioteket
!!!warning "Datafortellinger laget med datastory-biblioteket vil fases ut. Eksisterende datafortellinger vil leve videre en stund, men vi vil om kort tid stenge muligheten til å lage nye."

## Installer datastory bibliotek
````bash
pip install datastory
````

## API adresser
For å publisere en datafortelling må man angi api adressen det skal publiseres til.

- For [dev-miljøet](https://data.dev.intern.nav.no) er adressen `https://nada.ekstern.dev.nav.no/api`
- For [prod-miljøet](https://data.intern.nav.no) er adressen `https://nada.intern.nav.no/api`

I kodeeksemplene som følger brukes dev adressen.

## Lage utkast til datafortelling
````python
from datastory import DataStory

ds = DataStory("Min datafortelling")

ds.header("Overskrift")
ds.markdown("Liten introbeskrivelse til datafortellingen")
ds.header("Underoverskrift", level=2)
ds.markdown("Mer fyldig beskrivelse av innholdet")
ds.header("Figur 1 tittel", level=3)
ds.plotly(fig_plotly.to_json())
ds.markdown("Beskrivelse av figur 1")
ds.header("Figur 2 tittel", level=3)
ds.vega(fig_vega)
ds.markdown("Beskrivelse av figur 2")

ds.publish(url="https://nada.ekstern.dev.nav.no/api")
````

Når man kaller `ds.publish()` i eksempelet over vil det bli opprettet en kladd til en datafortelling, se [her](#publisere-datafortelling) 
for å se hvordan man publiserer en datafortelling fra en kladd.

## Publisere datafortelling
Publisering av en datafortelling gjøres fra kladd-visningen i datamarkedsplassen som følger:

1. Logg inn
2. Trykk lagre
![kladd](datafortelling-utkast.png)
3. Velg hvilket av dine team som skal eie datafortellingen
4. Velg om du skal lage en ny eller overskrive en eksisterende datastory

## Programmatisk oppdatere eksisterende datafortelling
For å oppdatere en publisert datafortelling programmatisk må man autentisere seg med et token. 
Dette tokenet blir generert når man publiserer en kladd og kan hentes ut ved å gå til den publiserte datafortellingen og fra [kebab menyen](https://uxplanet.org/choose-correct-menu-icon-for-your-navigation-7ffc22df80ac#160b) velge `vis token`.
Når du har fått hentet ut oppdateringstokenet kan du erstatte siste kodelinje i eksempelet over (dvs. `ds.publish()`) med en metode som i stedet oppdaterer datafortellingen.

````python
ds.update(token="mitt-token", url="https://nada.ekstern.dev.nav.no/api")
````

Dersom man ønsker å unngå å sette api adressen til Markedsplassen som input parameter til `ds.publish()` og `ds.update()` metodene kan man i stedet sette det som miljøvariabel, f.eks.
````python
import os
os.environ["DATASTORY_URL"] = "https://nada.ekstern.dev.nav.no/api"
````
