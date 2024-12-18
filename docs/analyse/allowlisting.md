Vi krever at eksplisitt spesifiserer hvilke eksterne tjenester man skal kommunisere med per tjeneste man bruker i Knada.
Åpninger er basert på IP-adresser eller DNS (nettadresser), samt porten for den hosten de ønsker å åpne mot.

Du angir hostene du har lyst til å allowliste på formatet `<ip-adresse>`:`<port>`.
Dersom port utelates vil vi bruke `443` som standardport.

Eksempler:

- 35.235.240.1:3307
- oracle.db.no:1521
- google.com

For å konfigurere allowlist for Jupyterhub se [Trafikk fra notebooks](./notebook/knada-notebook.md#trafikk-fra-notebooks).
For å konfigurere allowlist for Airflow se [Trafikk ut fra Airflow](./airflow/knada-airflow.md#trafikk-ut-fra-airflow).

## Standardåpninger for Jupyterhub

- `*.googleapis.com`(for Secret manager, Storage buckets, BigQuery etc.)
- `github.com` (for lesing av repo med kode)
- `europe-north1-python.pkg.dev` (pypi proxy for installasjon av pakker)

## Standardåpninger for Airflow

- `*.googleapis.com` (for Secret manager, Storage buckets, BigQuery etc.)
- `github.com` (for lesing av repo med kode)

Dersom man bruker [dataverk-airflow](https://pypi.org/project/dataverk-airflow) vil det avhengig av hvilken operator og opsjoner man bruker også bli lagt på nødvendige åpninger. Se [repo](https://github.com/navikt/dataverk-airflow#allow-list) for dokumentasjon på hva som settes for ulike operatorer.

## Standardåpninger for KnadaVM

- `private.googleapis.com` (for Secret manager, Storage buckets, BigQuery etc.)
- Cloudflare (for Quarto)
- Fastly CDN (for Pypi)
- SSH mot Github.com
- Knada CoreDNS
- Alle onprem kilder som er tilgjengelig fra Knada

Komplett oversikt finner man i [navikt/knada-gcp](https://github.com/navikt/knada-gcp/blob/main/knada-vm.tf).


## GCP CloudSQL Postgres

For å få tilgang til en CloudSQL Postgres database på GCP kreves det åpning mot den offentlige IP adressen til databaseinstansen.
Den offentlige adressen for en database finner du i [Cloud console](https://console.cloud.google.com/sql/instances).
Finn database instansen din i listen, og finn adressen under `Public IP address`.

For CloudSQL Postgres databaser er det nødvendig å åpne både port `443` og `3307`.
Du må dermed legge til to separate innslag for dette:

- `<ip>:3307`
- `<ip>:443`

## Teknisk løsning

I Kubernetes bruker vi [Network Policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/) for å styre trafikken inn og ut til pods (les: apper).
Ved å spesifisere annotasjonen `allowlist` på en pod så vil tjenesten [Knep](https://github.com/navikt/knep) lage `NetworkPolicy` basert på listen av `host:port`.
