---
title: Datafortelling
---

## Installer datastory bibliotek
````bash
pip install datastory
````

## Lage datafortelling
````python
import os
from datastory import DataStory

os.environ["DATASTORY_URL"] = "https://data.dev-gcp.nais.io/api/story" # dev

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

ds.publish()
````
