### Postgress GCP
Tilkobling til postgress-databaser i GCP er beskrevet i [nais-dokumentasjonen](https://doc.nais.io/persistence/postgres/#personal-database-acces)

### Hvordan snakke med Vault fra on-prem Naisjob?
Når man kjører en Naisjob i on-prem og har hemmeligheter i Vault må disse bli hentet ved oppstart av jobben.
Dette kan løses ved bruk av Vault-config i [applikasjonsmanifestet](https://docs.nais.io/naisjob/reference/#vault).
Da vil hemmelighetene dine lastes inn som filer som du kan lese fra din kode.
Ønsker du å ha de som miljøvariabler så kan dere bruke [navikt/baseimages](https://github.com/navikt/baseimages/), som har støtte for å transformere Vault-hemmeligheter som slutter på `.env` til miljøvariabler.

### Hvordan få tilgang til BigQuery fra en Naisjob i on-prem?
For å kunne snakke med BigQuery trenger dere et token for en service account som har tilgang til å lese BigQuery.
Følg guiden [Createing a service account](https://cloud.google.com/iam/docs/creating-managing-service-accounts#iam-service-accounts-create-console) hos Google, og så følger dere guiden [Creating service account keys](https://cloud.google.com/iam/docs/creating-managing-service-account-keys).

Når dette er gjort så ender dere opp med en JSON-fil som er hemmeligheten dere trenger å legge inn i Vault, som igjen da blir eksponert i jobben deres. For at Pandas eller andre rammeverk skal plukke denne opp automatisk så må den være eksponert som en miljøvariabel som heter `GOOGLE_APPLICATION_CREDENTIALS`.
