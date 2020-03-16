## Fjerning av publiserte datapakker

1 Gå til swagger APIet fra utviklerimage
````
### Interne pakker (FSS)
Gå til:
https://dv-resource-rw-api.nais.adeo.no/swagger/ui

### Eksterne pakker (SBS)
Gå til:
https://dv-resource-rw-api.nais.oera.no/swagger/ui
````

2 Fjern ressursene til datapakken
```
DELETE /<bucket>/<datapakke-id>
```

3 Fjern dokumentet fra elastic search index
```
DELETE /index/<index-navn>/id/<doc-id>
```
