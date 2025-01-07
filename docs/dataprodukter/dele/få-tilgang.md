## Få tilgang til data i sky

### Postgres GCP
For å lage dataprodukter med data fra databaser i sky trenger man først og fremst en bruker for å lese data fra databasen.
Selv om det er teknisk mulig å benytte database-brukernavn og passord fra applikasjoner som har tilgang er dette ikke anbefalt.
Oppretting av egen bruker for dette behovet er anbefalt. Det fins to metoder for å opprette bruker.

#### nais-cli
Man kan benytte [`nais-cli`](https://doc.nais.io/operate/cli/index.html) som har en egen kommando for tilgang til postgres-databaser i sky.
For å opprette en bruker med `select` privilegier, [se dokumentasjon for `users add`](https://docs.nais.io/operate/cli/reference/postgres/#users-add)

#### Manuelt
For manuell opprettelse av bruker må du først opprette personlig tilgang til databasen.
[Følg instruksjonene i NAIS-dokumentasjonen](https://docs.nais.io/persistence/postgres/#personal-database-access) for å koble til.
Når du er inne i databasen, oppretter du og gir tilgang til databasebrukeren med kommandoene nedenfor.

```plpgsql
CREATE USER <brukernavn> WITH ENCRYPTED PASSWORD '<passord>';
GRANT CONNECT ON DATABASE <databasenavn> TO <brukernavn>;
GRANT USAGE ON SCHEMA public TO <brukernavn>;
```

Videre kan du gi brukeren rettigheter til å lese alle tabeller:
```plpgsql
GRANT SELECT ON ALL TABLES IN SCHEMA public TO <brukernavn>;
```

eller utvalgte tabeller:
```plpgsql
GRANT SELECT ON <tabellnavn> TO <brukernavn>;
```

## Få tilgang til data on-prem

### Hvordan snakke med Vault fra on-prem Naisjob?
Når man kjører en Naisjob i on-prem og har hemmeligheter i Vault må disse bli hentet ved oppstart av jobben.
Dette kan løses ved bruk av Vault-config i [applikasjonsmanifestet](https://docs.nais.io/naisjob/reference/#vault).
Da vil hemmelighetene dine lastes inn som filer som du kan lese fra din kode.
Ønsker du å ha de som miljøvariabler så kan dere bruke [navikt/baseimages](https://github.com/navikt/baseimages/), som har støtte for å transformere Vault-hemmeligheter som slutter på `.env` til miljøvariabler.

### Hvordan få tilgang til BigQuery fra en Naisjob i on-prem?
For å kunne snakke med BigQuery trenger dere et token for en service account som har tilgang til å lese BigQuery.
Følg guiden [Creating a service account](https://cloud.google.com/iam/docs/creating-managing-service-accounts#iam-service-accounts-create-console) hos Google, og så følger dere guiden [Creating service account keys](https://cloud.google.com/iam/docs/creating-managing-service-account-keys).

Når dette er gjort så ender dere opp med en JSON-fil som er hemmeligheten dere trenger å legge inn i Vault, som igjen da blir eksponert i jobben deres. For at Pandas eller andre rammeverk skal plukke denne opp automatisk så må den være eksponert som en miljøvariabel som heter `GOOGLE_APPLICATION_CREDENTIALS`.
