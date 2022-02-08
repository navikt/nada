---
title: Datafortelling
---

## Installer datastory bibliotek
````bash
pip install datastory
````

## API adresser
For å publisere en datafortelling må man angi en api adressen det skal publiseres til.

- For [dev-miljøet](https://data.dev.intern.nav.no) er denne adressen `https://nada.ekstern.dev.nav.no/api`
- For [prod-miljøet](https://data.intern.nav.no) er denne adressen `https://data.intern.nav.no/api`

I kodeeksemplene som følger brukes dev adressen.

## Lage datafortelling
````python
import os
from datastory import DataStory

ds = DataStory("Min datafortelling")

ds.header("Overskrift")
ds.markdown("Liten introbeskrivelse til datafortellingen")
ds.header("Underoverskrift", level=2)
ds.markdown("Mer fyldig beskrivelse av innholdet")
ds.header("Figur 1 tittel", level=3)
ds.plotly(fig_plotly)
ds.markdown("Beskrivelse av figur 1")
ds.header("Figur 2 tittel", level=3)
ds.vega(fig_vega)
ds.markdown("Beskrivelse av figur 2")

ds.publish(url="https://nada.ekstern.dev.nav.no/api")
````

## Oppdatere eksisterende datafortelling
For å oppdatere en publisert datafortelling programmatisk må man autentisere seg med et token. 
Dette tokenet blir generert når man publiserer en draft og kan hentes ut fra nav data [her](https://data.dev.intern.nav.no/user/stories).
Når du har fått hentet ut oppdateringstokenet kan du erstatte siste kodelinje i eksempelet over (dvs. `ds.publish()`) med en metode som i stedet oppdaterer datafortellingen.

````python
ds.update(token="mitt-token", url="https://nada.ekstern.dev.nav.no/api")
````

:::info
Dersom man ønsker å unngå å sette api adressen til nav data som input parameter til `ds.publish()` og `ds.update()` metodene kan man i stedet sette det som miljøvariabel, f.eks. 
````python
os.environ["DATASTORY_URL"] = "https://nada.ekstern.dev.nav.no/api"
````
:::
