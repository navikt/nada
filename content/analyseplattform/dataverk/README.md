# Dataverk: Python pakke for dataaksess, ETL og publisering av datapakker

* [Github Repo](https://github.com/navikt/dataverk).

* [Dataverk Vault Repo](https://github.com/navikt/dataverk-vault). Bibliotek med api mot vault for secrets handling og database credential generering for dataverk

* [Dataverk API Repo](https://github.com/navikt/dataverk-api). Dataverk web-API for å lese ressursfiler fra ceph bucket storage og metadata fra elastic search index.


## Brukergrupper

![Brukergrupper](./docs/brukergrupper.svg)

## Mulige plattformkomponenter for analyse & ML

![Komponenter](./docs/plattform.svg)


## Serverless ETL, ML og produksjon av dataprodukter med Python, Dask og Jupyter Notebooks

### Hovedkomponenter

ETL koden utvikles i en Jupyter Notebook. Koden kan kjøres enten ved at notebook'en konverteres til python (notebook2script) eller direkte med Papermill (excute_notebook)

Altentive måter å kjøre koden:
- kjøre lokalt i Jupyter
- konvertere notebook til Python og kjøre i Python
- kjøre lokalt med Papermill
- pakke kode og ressurfiler i et dockerimage som kan skeduleres med kubernetes jobs eller Airflow
- kjøre med Papermill i Airflow (hente ressursfiler fra github repo, S3/Ceph eller GCS) 


![Hovedkomponenter](./docs/komponenter.svg)

### Høynivå arkitektur på NAIS/Kubernetes

![Høynivå arkitektur](./docs/dataverk.svg)


### Design docs & Brukerreiser
[Design docs](https://docs.google.com/presentation/d/1f6BO91pCkE_TryQyWelxbUWoU16Qi3IaX_Kx1w7qG04/edit?usp=sharing)



