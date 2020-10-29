## Postgres tilkoblinger fra kubeflow
Tilkobling til postgres databaser fra kubeflow krever noe mer oppsett enn øvrige databasetilkoblinger.
Årsaken til dette er at postgres credentials har TTL på 24 timer og man trenger periodisk
å hente nye credentials fra vault etter denne tidsperioden.

Følges oppskriften under vil dataverk håndtere fornying av credentials automatisk ved å hente nye 
via http apiet til vault når de gamle blir ugyldig.

#### 1. Sett opp tilganger for kubeflow namespace
Avhengig av om man jobber fra et personlig eller et team namespace i kubeflow får man tilgang til postgres 
databaser ved å opprette en pull request i [navikt/vault-iac](https://github.com/navikt/vault-iac).

Merk: Etter at pull requesten er godkjent og merget inn vil det ta 5-10 minutter før endringene i vault 
er synkronisert.

##### Tilgang personlig bruker
For å få tilgang til en postgres database fra et personlig kubeflow namespace må man opprette eller 
editere en bruker [her](https://github.com/navikt/vault-iac/tree/master/terraform/users).

F.eks.
````bash
email: ola.nordmann@nav.no
kubeflow:
  - namespace: ola-nordmann
postgresql:
  dev-fss:
    - database_name: <databasenavn_dev>
      permission_level: <rolle>
  prod-fss:
    - database_name: <databasenavn_prod>
      permission_level: <rolle>
````

I eksempelet over er _database_name_ navnet på databasen du ønsker tilgang til. Dette finner man i 
[navikt/database-iac](https://github.com/navikt/database-iac). _Rolle_ vil være rollen ([admin, user eller readonly](https://github.com/navikt/database-iac/blob/master/README.md)) som brukeren som provisjoneres skal ha.

##### Tilgang team
For å få tilgang til en postgres database fra et team namespace i kubeflow må man opprette eller 
editere teamtilgang [her](https://github.com/navikt/vault-iac/tree/master/terraform/teams).

F.eks.
````bash
name: mitt-team
group_id: <gruppe-id>
postgresql:
  dev-fss:
    - database_name: <databasenavn>
      permission_level: <rolle>
kubeflow:
  - namespace: <namespace>
    extra_policies:
      - postgresql_preprod-fss_<databasenavn>_<rolle>
````

I eksempelet over vil _gruppe-id_ være IDen til 
[AAD gruppen](https://aad.portal.azure.com/#blade/Microsoft_AAD_IAM/GroupsManagementMenuBlade/AllGroups), 
_databasenavn_ navnet på [databasen](https://github.com/navikt/database-iac) 
du ønsker tilgang til, _namespace_ navnet på kubeflow namespacet og _rolle_ være rollen ([admin, user eller readonly](https://github.com/navikt/database-iac/blob/master/README.md)) som brukeren som provisjoneres skal ha. NB! _rolle_ må matche permission_level som er spesifisert for teamet.

#### 2. Legg til connection string i vault
I vault legges connection string til databasen inn som key/value par under stien 
til kubeflow namespacet som beskrevet [her](README.md).

F.eks.
````bash
POSTGRES_CREDENTIALS: "postgres://user:pass@<hostname>:<port>/<database>"
POSTGRES_CREDS_PATH: "postgresql/preprod-fss/creds/<database>-<rolle>"
````

_Host_, _port_ og _database_ over finner man i 
[navikt/database-iac](https://github.com/navikt/database-iac).

_Rolle_ være rollen ([admin, user eller readonly](https://github.com/navikt/database-iac/blob/master/README.md)) som brukeren som provisjoneres skal ha.

Merk: Autentiseringsdelen av connection strengen (*user:pass* over) må være med. Det spiller ingen rolle
hva man setter dette til da dataverk vil bytte det ut med gyldige credentials når man forsøker å gjøre
en spørring, men det må stå en verdi her som default.

#### 3. Settingsfil
Som med andre secrets (beskrevet [her](README.md)) må følgende legges til i 
setting.json filen dataverk benytter.
````python
{
  "db_connection_strings": {
    "postgres_database": "${POSTGRES_CREDENTIALS}"
  },
  
  "db_vault_path": {
    "postgres_database": "${POSTGRES_CREDS_PATH}"
  }
}
````
${POSTGRES_CREDENTIALS} og ${POSTGRES_CREDS_PATH} vil så erstattes med verdien i vault når dataverk parser settings.json filen.

#### 4. Les fra postgres
Etter at alt over er konfigurert kan man bruke dataverk til å lese fra postgres databasen på samme måte som
andre databaser, dvs.:
````python
from dataverk import Client

dv = Client()

df = dv.read_sql("postgres_database", "SELECT * FROM table")
````
