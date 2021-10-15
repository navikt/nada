---
title: Deletion of published datapackages
---

### Internal datapackages (data.intern.nav.no)

1 Go to the data catalog api swagger
````
https://datakatalog-api.intern.nav.no/docs
````

2 Delete datapackage
```
DELETE /v1/datapackage/{id}
```


### External packages (data.nav.no)
1 Go to the data catalog api swagger
````
https://dv-api-ekstern.prod-gcp.nais.io/swagger/ui
````

2 Delete datapackage
````
DELETE /dp/{bucket}/{id}
````

_bucket_ must be set to *nav-opendata* for external datapackages (`data.nav.no`).
