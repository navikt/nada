# Veikart

## Nå: NAV Data
**Hva:** Markedsplass for deling av dataprodukter i datamesh

**Sentrale brukergrupper:** Team som vil dele data, team og analytikere som vil bruke data

**Hypoteser/ideer som skal prøves:**
- metadatastore for dataprodukter
- funksjonalitet for tilgangsstyring på dataprodukter i bigquery

## Neste: Avvikle datakatalogen
**Hva:** Bryte ut elementene som skal videreføres. Finne ut hva vi gjør med `data.nav.no`.

**Sentrale brukergrupper:** Brukere av data.nav.no, brukere av begreper, brukere og produsenter av datapakker

**Hypoteser/ideer:**
- Datapakker er en egen tjeneste
- Begreper er en egen tjeneste
- Team, personer, produktområder ivaretas av teamkatalogen
- Øvrig innhold i datakatalogen kan scrappes

## Nær framtid: Dashboard
**Hva:** Finne ut hvilke(t) dashboardverktøy vi ønsker å ha i plattformen, om noe

**Hypoteser/ideer:**
- Superset
- Looker
- Metabase
- Redash

## Senere: Avvikle on-prem Knada
**Hva:** Skru av on-pªrem notebooks og airflow-tjeneste til fordel for sky

**Hypoteser/ideer:**
- Notebooks i sky er bedre enn on-prem-tjenesten vår
- Vi må gjøre det mulig å aksessere data fra on-prem PG og on-prem Oracle fra notebooks i sky
