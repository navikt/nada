---
title: Kom i gang
---

For å komme i gang med analysering tilbyr NADA dokumentasjon på hvordan man kan ta i bruk Jupyter Notebooks og Airflow i teamprosjektene på GCP, se [Jupyter notebook](./notebook/index.md) og [Airflow](./airflow/knada-airflow.md) for mer informasjon.

Dersom man har behov for å nå onprem kilder tilbyr vi også analyseverktøy for dette i KNADA.

## KNADA

KNADA er NADA sin analyseplattform kjørende i GCP med kobling til datakilder i onprem.
Man må ha [Naisdevice](https://docs.nais.io/device/) for å nå tjenester i Knada.
Tilgang til Jupyter Notebooks og Airflow i KNADA bestilles i [Knorten](https://knorten.knada.io).

Gjennom Knorten oppretter man et team for en eller flere personer.
Man kan så installere [Jupyter notebook](./notebook/knada-notebook.md) eller [Airflow](./airflow/knada-airflow.md).
Teamadministreringen skjer igjennom Knorten.

### Tilgang utenfor Utvikling og data

Hvis du eller noen i teamet ditt ikke tilhører Utvikling og data (U&D) må de manuelt bli lagt til Azure AD-gruppen [`knada-gw-access`](https://myaccount.microsoft.com/groups/8166af3f-25e5-473a-98f4-86030aa7ba27).
Dette er en gruppe alle kan bli medlem av, og vi ønsker bare å ha en god oversikt over hvem som ikke tilhører U&D.
Ta kontakt i [Slack#dataplattform](https://nav-it.slack.com/archives/CGRMQHT50) for bistand.
