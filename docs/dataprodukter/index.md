## Flytte data til BigQuery

For å flytte data til BigQuery må man først ha tilgang til et prosjekt i GCP.
Et sånt prosjekt er typisk et NAIS-team, les mer om det i [NAIS-dokumentasjonen](https://doc.nais.io/basics/teams/#gcp-team-projects).
For å få tilgang til GCP må man [legge til Google Cloud Platform i myapps.microsoft.com](https://account.activedirectory.windowsazure.com/r#/addApplications).

=== "Postgres"
    Team bruker i hovedsak [Federated Query](dele/dataoverføring.md#federated-query) til å flytte data fra Postgres til BigQuery.
    Dette gjøres på følgende måte:

    1. [Få tilgang til databasen](dele/få-tilgang.md#postgres-gcp) 
    2. [Sett opp en dataoverføring](dele/dataoverføring.md)

    !!! question "Hvordan har andre team løst dette?"
        - [Team Flex sitt oppsett](https://github.com/navikt/flex-bigquery-terraform)
            - Satt opp med Terraform
        - [Digihot sitt oppsett](https://github.com/navikt/hm-statistikk)
            - Kommandolinjeverktøy for å enkelt opprette [BigQuery dataset, connection](dele/dataoverføring.md#federated-query), og [scheduled query](dele/dataoverføring.md#kjøre-spørring-på-tidsintervall)
        - [Team Risks sitt oppsett](https://github.com/navikt/helse-risk-flytte-data)
            - Benytter [Naisjob](dele/dataoverføring.md#naisjob) for å flytte data
=== "Kafka"
    Per i dag er det ikke plattformstøtte for å flytte data fra Kafka til BigQuery, men det er noen team som har gjort dette på egen hånd.

    !!! question "Hvordan har andre team løst dette?"
        - [Dagpenger sitt oppsett med Kafka Connect](https://github.com/navikt/dp-kafka-connect/)
            - [Kubernetes-operator](https://github.com/navikt/dp-kafka-connect-operator/)
        - [Digihot sin sink fra Kafka](https://github.com/navikt/hm-bigquery-sink)
=== "Onprem"
    Plattformen tilbyr to måter å flytte data fra onprem til BigQuery:

    1. [Naisjobs](dele/dataoverføring.md#naisjob)
    2. [Knorten](../analyse/komigang.md#knorten)

    For å lese fra databaser onprem og for å få tilgang til å skrive til BigQuery fra onprem kan du [følge dokumentasjonen](dele/få-tilgang.md#f-tilgang-til-data-on-prem).

    !!! question "Hvordan har andre team løst dette?"
        - [ereg dataprodukt](https://github.com/navikt/dataprodukt-register-ereg)
        - [aareg dataprodukt](https://github.com/navikt/dataprodukt-register-aareg)
        - [paw dataprodukt](https://github.com/navikt/dataprodukt_paw)
        - [Helse Arbeidsgivers Naisjob som henter data fra Postgres](https://github.com/navikt/helsearbeidsgiver-flytte-data)


## Opprett et dataprodukt

1. [Legg til et dataprodukt på markedsplassen](dele/dataprodukt.md)
2. (Valgfritt) [Gi tilgang til datasett](tilgangsstyring.md)