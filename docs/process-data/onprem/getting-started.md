---
title: Getting started
---

On-prem we offer [JupyterHub](jupyterhub.md) for performing data analysis in Jupyter Notebooks, and [Airflow](airflow.md)
to schedule and administrate datapipelines.

## Secrets

We use Vault for secrets on-prem, see [vault-iac/doc/knada](https://github.com/navikt/vault-iac/blob/master/doc/knada.md)
for documentation on how to set this up for your Jupyterhub/Airflow namespaces.

See [import secrets in Jupyterhub and Airflow](vault/#import-the-secrets-in-jupyterhub-and-airflow) to learn how to import 
the secrets in Jupyterhub/Airflow.
