---
title: Sletting av datapakker
---

### Interne datapakker (datapakker.intern.nav.no)

1 Gå til intern datapakke katalog swagger
````
https://datakatalog-api.intern.nav.no/docs
````

2 Slett datapakke
```
DELETE /v1/datapackage/{id}
```


### Eksterne datapakker (data.nav.no)
1 Gå til ekstern datapakke katalog swagger
````
https://dv-api-ekstern.prod-gcp.nais.io/swagger/ui
````

2 Slett datapakke
````
DELETE /dp/{bucket}/{id}
````

_bucket_ must be set to *nav-opendata* for external data packages (`data.nav.no`).
