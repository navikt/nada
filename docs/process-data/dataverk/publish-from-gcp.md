---
title: Publish datapackages from GCP projects
---

When setting up [on-demand GCP projects](https://github.com/navikt/knada-on-demand-projects) some
dataverk configuration is automatically stored as secrets in [Google Secret Manager](https://cloud.google.com/secret-manager/docs) 
in the created project. These configuration values needs to be imported and set as environment variables 
in order to use dataverk to publish datapackages from GCP.

To simplify this, we have developed a python library [dataverk-gsm](https://github.com/navikt/dataverk-gsm) 
which can be used as follows:
````python
from dataverk_gsm import api as gsm_api

gsm_api.set_secrets_as_envs()
````

:::info
In order to publish datapackages to the internal data catalog from GCP projects it is required that installed 
version of dataverk is >=0.4.4
:::
