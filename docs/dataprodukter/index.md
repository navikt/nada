## Flytte data til BigQuery

For å flytte data til BigQuery må man først ha tilgang til et prosjekt i GCP.
Et sånt prosjekt er typisk et NAIS-team, les mer om det i [NAIS-dokumentasjonen](https://doc.nais.io/basics/teams/#gcp-team-projects).
For å få tilgang til GCP må man [legge til Google Cloud Platform i myapps.microsoft.com](https://account.activedirectory.windowsazure.com/r#/addApplications).

### Data på innsiden og på utsiden
`Data på innsiden` = Teamets interne modell for å levere verdi til brukerne innenfor domenet og endres typisk ofte.

`Data på utsiden` = Analytiske data som er mer stabile: Kan være begrenset til eget bruk i teamet.

Teamene velger selv hvordan de etablerer skillet mellom innsiden og utsiden.
Noen team velger å flytte mer av data på innsiden ut til BigQuery, og så sammenstille og bearbeide data videre til analytiske produkter i BigQuery.
"Råsonen" er der fortsatt en del av teamets interne modell.
Figuren under illustrerer hvordan arkitekturen kan se ut.

````mermaid
flowchart BT
classDef tittel_styling font-weight:bold,font-size:14pt,margin:1em
subgraph intern[Intern modell]

subgraph Postgres-db
A[(Tabell 1)]
B[(Tabell 2)]
end

subgraph Oracle-db on-prem
C[(Tabell n)]
end

subgraph Annen kilde
C_1[(Kafka)]
C_2[(DB2)]
end

X[Naisjob for <br> å flytte data]
X_1[Datastream for <br>å strømme endringer]
X_2[Federated Query <br> for å flytte data]
X_3[Nais-app for å <br> flytte data]

subgraph BigQuery: Råsone
D[(Tabell 1)]
E[(Tabell 2)]
F[(Tabell 3)]
F_2[Tabell m]
end
Y(Sammenstilling og bearbeiding)
Z(Bearbeiding)
Z_1(Sammenstilling og bearbeiding)
end
class intern tittel_styling

subgraph outside["Data på utsiden (BigQuery)"]
subgraph Dataprodukt 1
H[(Tabell X)]
end
subgraph Dataprodukt 2
I[(View Y)]
end
subgraph Dataprodukt m
I_1[(View Z)]
end
end
class outside tittel_styling

A --> X_1
B --> X_2
C_1 --> X_3
C --> X
X --> D
X_1 --> E
X_2 --> F
X_3 --> F_2
D --> Y
E --> Y
F --> Z
F --> Z_1
F_2 --> Z_1
Y --> H
Z --> I
Z_1 --> I_1

````



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
        - [Team Sykmelding sitt oppsett](https://github.com/navikt/teamsykmelding-gcp-infra)
            - Satt opp Datastream med Terraform. Laster over alle endringer for aktuelle kolonner i Postgres (change data capture)
        - [Team Risks sitt oppsett](https://github.com/navikt/helse-risk-flytte-data)
            - Benytter [Naisjob](dele/dataoverføring.md#naisjob) for å flytte data
=== "Kafka"
    Kodeeksempler på hvordan du kan flytte data fra Kafka til BigQuery på NAIS finner du ved å følge [denne lenken](dele/dataoverføring.md#kafka-til-bigquery).

    !!! question "Hvordan har andre team løst dette?"
        - [Dagpenger sitt oppsett med Kafka Connect](https://github.com/navikt/dp-kafka-connect/)
            - [Kubernetes-operator](https://github.com/navikt/dp-kafka-connect-operator/)
        - [Digihot sin sink fra Kafka](https://github.com/navikt/hm-bigquery-sink)
        - [Bømlo sitt oppsett: Kafka -> Postgres -> BigQuery ](https://github.com/navikt/helse-dataprodukter)

=== "Onprem"
    Plattformen tilbyr to måter å flytte data fra onprem til BigQuery:

    1. [Naisjobs](dele/dataoverføring.md#naisjob)
    2. [Knorten](../analyse/kom-i-gang.md#knada)

    For å lese fra databaser onprem og for å få tilgang til å skrive til BigQuery fra onprem kan du [følge dokumentasjonen](dele/få-tilgang.md#f-tilgang-til-data-on-prem).

    !!! question "Hvordan har andre team løst dette?"
        - [ereg dataprodukt](https://github.com/navikt/dataprodukt-register-ereg)
        - [aareg dataprodukt](https://github.com/navikt/dataprodukt-register-aareg)
        - [paw dataprodukt](https://github.com/navikt/dataprodukt_paw)
        - [Helse Arbeidsgivers Naisjob som henter data fra Postgres](https://github.com/navikt/helsearbeidsgiver-flytte-data)


## Opprett et dataprodukt

1. [Legg til et dataprodukt på markedsplassen](dele/dataprodukt.md)
2. (Valgfritt) [Gi tilgang til datasett](tilgangsstyring.md)