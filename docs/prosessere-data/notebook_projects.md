Det er tre ulike typer prosjekt som kan brukes til å kjøre notebooks:

1. Team-prosjekt server: Majoriteten bruker dette. Dette er notebooks som skal eies av team
2. On-demand prosjekter: Kan brukes dersom kun enkeltpersoner skal ha tilgang til prosjektet
3. Server med tilgang til on-prem: Brukes der det er behov for tilgang til kilder som ligger on-prem

## Team-prosjekt server

1. Gå til [Vertex-AI/Workbench](https://console.cloud.google.com/vertex-ai/workbench/instances)
2. Velg `New Notebook` og velg `Customize`
3. Fyll inn alle obligatoriske felter:
    - Notebook name - Navn på kladdeboka
    - Region - Velg en av de europeiske
    - Zone - En sone innenfor regionen du valgte
    - Environment - Velg et miljø som passer ditt behov/språk
    - Machine type og GPU - Hvor kraftig maskin du trenger
4. Ekspander `Permission`
    - Under `Access to JupyterLab` velg
        - `Single user only` hvis det kun er du som skal ha tilgang til hubben
        - `Service account` hvis alle med tilgang til gcp prosjektet skal ha tilgang
5. Trykk `Create`
6. Når maskinen er klar til bruk kan du trykke på `Open JupyterLab`

## On-demand prosjekt

For å få opprettet sitt eget GCP _on-demand_-prosjekt trenger man kun å legge til et nytt object i fila [`terraform/on-demand.tf`](https://github.com/navikt/knada-on-demand-projects/blob/main/terraform/on-demand.tf).
Dette gjøres via en Pull Request.

Av informasjon trenger vi navn på prosjektet (for eks. `team-analyse`, og e-posten til brukeren som skal ha tilgang.

!!! info "Navnet må være unikt"

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

## Server med tilgang til on-prem

1. Ta kontakt med oss i [#nada](https://nav-it.slack.com/archives/CGRMQHT50) for å få tilgang til dette prosjektet.
2. Gå til [knada-gcp Google console](https://console.cloud.google.com/vertex-ai/workbench/list/instances?orgonly=true&project=knada-gcp&supportedpurview=organizationId)
3. Velg `New Notebook` og velg `Customize`
4. Fyll inn alle obligatoriske felter:
   - Notebook name - Navn på kladdeboka
   - Region - europe-west1 (Belgium)
   - Zone - En sone innenfor regionen
   - Environment - Velg et miljø som passer ditt behov/språk
   - Machine type og GPU - Hvor kraftig maskin du trenger
5. Ekspander `Networking`
   - Under `External IP` velg none
6. Ekspander `Permission`
   - Under `Identity and API access`
      - Avhuk `Use Compute Engine default service account` og lim inn service accounten knyttet til din bruker, se [her](#personlig-service-account-og-secret-manager-hemmelighet-for-brukerteam) for informasjon om hvor denne finnes
7. Trykk `Create`
8. Når maskinen er ferdig laget, kan du trykke på `Open jupyterlab` for å få tilgang.
