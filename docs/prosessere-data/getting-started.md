---
title: Kom i gang
sidebar_position: 0
---

Vi jobber med å lage en moderne analyseplattform på Google Cloud Platform (GCP), hvor vi ønsker å tilby alle de mulighetene skyen gir oss.
Fra fritt valg av ressurser, til alskens rammeverk.

I GCP jobber man i det som kalles prosjekter, og hvert team har sitt eget prosjekt.
Så den enkleste måten å komme i gang er å bli en del av et team, og jobbe i deres GCP prosjekt.

Har man behov for noe mer privat, kan man få opprettet sitt eget _on-demand_-prosjekt, som skal være et midlertidig GCP prosjekt, for en spesifikk analyse man jobber med.
Så bistår man flere teams, er det meningen at man skal ha forskjellige prosjekter.

## Prosjekter

Man kan til enhver tid se hvilke prosjekter man er medlem av ved å gå til [GCP Billing](https://console.cloud.google.com/billing/projects?project=&folder=&organizationId=139592330668).

Så hvis man skal jobbe i et team prosjekt, så kan man gå direkte til [GCP Dashboard](https://console.cloud.google.com/projectselector2/home/dashboard) og velge teamet sitt under **select project**.

### On-demand prosjekt

For å få opprettet sitt eget GCP _on-demand_-prosjekt trenger man kun å legge til et nytt object i fila [`terraform/on-demand.tf`](https://github.com/navikt/knada-on-demand-projects/blob/main/terraform/on-demand.tf).
Dette gjøres via en Pull Request.

Av informasjon trenger vi navn på prosjektet (for eks. `team-analyse`, og e-posten til brukeren som skal ha tilgang.

:::info
Navnet må være unikt!
:::

I filen `terraform/on-demand.td` legger du til følgende under `locals.projects`:
```
{
  name  = "ditt-prosjekt-navn",
  email = "din-navn-e-post@nav.no"
}
```

Etter du er ferdig skal det se sånn ut:
```
locals {
  projects = [
    {
      name = "ditt-prosjekt-navn",
      email = "din@nav.no"
    }
  ]
}
```


Disse prosjektene får de samme tilgangene (pluss noen flere) som et NAIS teamprosjekt, som betyr at det er bare noe få tilganger man har ut av boksen.
Har man behov for flere tilganger, må man selv gi seg de man trenger.
Dokumentasjon for dette finner man på [doc.nais.io](https://doc.nais.io/basics/teams/#access-management).

## Kultur

For at vi skal få en best mulig analyseplattform, er det viktig at vi bygger opp en kultur rundt dette, og dette er ikke noe vi på Dataplattform kan gjøre alene.
Vi er avhengig av dere for å få den beste og mest praktisk sikre plattformen vi kan ha!

### Skal
- Bruke midlertidige tilganger til data
- Bruke midlertidige koblingsnøkler (mellom bruker og data)
- Bruke datatransformasjoner som kode, med tester, versjonskontroll og dokumentasjon (bruk av dbt eller tilsvarende verktøy)
- Ha kontroll på hvem som har tilgang til data

### Skal ikke
- Legge til rette eller bruke personlige langtidslevende brukere
- Bruke personlige brukere i pipelines/jobs
- Kun ha data lagret i GCP

## Backup (TODO)

> På grunn av de potensielle sårbarhetene må brukerne gjøres oppmerksomme på deres ansvar. Restrisiko aksepteres gitt at dokumentasjon gjenspeiler at team må ta ansvar for backup, være nøye med tilganger, og ta nødvendige grep for å sikre at kritiske tjenester ikke har GCP/internett som en single point of failure.
