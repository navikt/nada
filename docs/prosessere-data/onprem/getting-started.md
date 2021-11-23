---
title: Getting started
sidebar_position: 0
---

On-prem tilbyr vi [JupyterHub](jupyterhub.md) for analysering med Jupyter Notebooks, og [Airflow](airflow.md) for å automatisere, og administrere kjøring av analyser.

## Hemmeligheter

Vi bruker Vault for hemmeligheter on-prem, se [vault-iac/doc/knada](https://github.com/navikt/vault-iac/blob/master/doc/knada.md)
for dokumentasjon på hvordan dette settes opp for ditt Jupyterhub/Airflow namespace.

Se [import secrets in Jupyterhub and Airflow](vault/#import-the-secrets-in-jupyterhub-and-airflow) for hvordan hemmeligheter kan importeres til Jupyterhub/Airflow.
