## Flytte data til BigQuery

For å flytte data til BigQuery må man først ha tilgang til et prosjekt i GCP.
Et sånt prosjekt er typisk et NAIS-team, les mer om det i [NAIS-dokumentasjonen](https://doc.nais.io/basics/teams/#gcp-team-projects).
For å få tilgang til GCP må man [legge til Google Cloud Platform i myapps.microsoft.com](https://account.activedirectory.windowsazure.com/r#/addApplications).

!!! note "wip"
    Usikker om vi ønsker avsnitt her, eller [tabs](https://squidfunk.github.io/mkdocs-material/reference/content-tabs/), eller kanskje [grid](https://squidfunk.github.io/mkdocs-material/reference/grids/#using-card-grids)?

### Postgres
Team bruker i hovedsak Federated Query til å flytte data fra Postgres til BigQuery.
Dette gjøres på følgende måte:

1. [Få tilgang til databasen](dele/få-tilgang.md#postgres-gcp) 
2. [Sett opp en dataoverføring](dele/dataoverføring.md)

!!! question "Hvordan har andre team løst dette?"
    - [Team Flex sitt oppsett med Terraform](https://github.com/navikt/flex-bigquery-terraform)
    - [Digihot sitt oppsett]()

### Kafka
Per i dag er det ikke plattformstøtte for å flytte data fra Kafka til BigQuery, men det er noen team som har gjort dette på egen hånd.

!!! question "Hvordan har andre team løst dette?"
    - [Dagpenger sitt oppsett med Kafka Connect](https://github.com/navikt/dp-kafka-connect/)
        - [Kubernetes-operator](https://github.com/navikt/dp-kafka-connect-operator/)
    - [Digihot sitt oppsett]()

### Onprem
Plattformen tilbyr to måter å flytte data fra onprem til BigQuery:

1. [Naisjobs](dele/dataoverføring.md#naisjob)
2. [Knorten](../analyse/komigang.md#knorten)

For å lese fra databaser onprem og for å få tilgang til å skrive til BigQuery fra onprem kan du [følge dokumentasjonen](dele/få-tilgang.md#f-tilgang-til-data-on-prem).

!!! question "Hvordan har andre team løst dette?"
    - [ereg dataprodukt](https://github.com/navikt/dataprodukt-register-ereg)
    - [aareg dataprodukt](https://github.com/navikt/dataprodukt-register-aareg)
    - [paw dataprodukt](https://github.com/navikt/dataprodukt_paw)


## Opprett et dataprodukt

1. [Legg til et dataprodukt på markedsplassen](dele/dataprodukt.md)
2. (Valgfritt) [Gi tilgang til datasett](tilgangsstyring.md)