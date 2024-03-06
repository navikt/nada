---
title: Allowlist for Knada tjenester
---

Vi krever at brukerne eksplisitt allowlister hoster de ønsker å snakke med fra tjenester i knada-clusteret. 

Brukerne allowlister trafikk ved å angi enten DNS navn eller IP adresse, samt porten for den hosten de ønsker å åpne mot. 
Dette blir så inkludert i en annotasjon på pod-ressursen til Jupyterhub/Airflow workeren i Knada-clusteret.
I Knada-clusteret kjører det en Kubernetes Admission webhook - [knep](https://github.com/navikt/knep) - som oppretter [Network Policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/) basert på hostene angitt i `allowlist` annotasjonen til Jupyterhub og Airflow pod ressurser.

Du angir hostene du har lyst til å allowliste på formatet `<ip-adresse>`:`<port>`.
Dersom port utelates vil vi bruke `443` som standardport.

Eksempler:

- 35.235.240.1:3307
- oracle.db.no:1521
- google.com

For å konfigurere allowlist for Jupyterhub se [Trafikk fra notebooks](./notebook/knada-notebook.md#trafikk-fra-notebooks).
For å konfigurere allowlist for Airflow se [Trafikk ut fra Airflow](./airflow/knada-airflow.md#trafikk-ut-fra-airflow).

### Standardåpninger for Jupyterhub

- `*.googleapis.com` (for secret manager, google storage buckets, bigquery etc.)
- `github.com` (for lesing av repo med kode)
- `pypi.org` (installasjon av pakker)
- `files.pythonhosted.org` (installasjon av pakker)
- `pypi.python.org` (installasjon av pakker)

### Standardåpninger for Airflow

- `*.googleapis.com` (for secret manager, google storage buckets, bigquery etc.)
- `github.com` (for lesing av repo med kode)

Dersom man bruker [dataverk-airflow](https://pypi.org/project/dataverk-airflow) vil det avhengig av hvilken operator og opsjoner man bruker også bli lagt på nødvendige åpninger. Se [repo](https://github.com/navikt/dataverk-airflow#allow-list) for dokumentasjon på hva som settes for ulike operatorer.


## GCP cloudsql postgres
For å allowliste tilgang til en cloudsql postgres database på GCP kreves det åpning mot public IP adressen til databaseinstansen.
Public IP for database instansen finner du ved å gå til [cloud console](https://console.cloud.google.com/sql/instances) -> klikke på database instansen -> `Public IP address`

For cloudsql postgres databaser er det nødvendig å åpne for to porter (`443` og `3307`) for IPen til database instansen.
Du må dermed legge til to separate allowlist innslag for dette:

- `<ip>:3307`
- `<ip>:443`