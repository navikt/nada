---
title: Postgres
---

## Postgres connections from Jupyterhub/Airflow
Connections to postgres databases from Jupyterhub/Airflow requires som additional configuration compared to other 
database connections. The reason for this is that postgres credentials have a TTL of 24 hours and one must periodically 
fetch new passwords when the old ones expire.

If you follow the guide below, dataverk will automatically fetch new password via the vault api when needed. 

#### 1. Set up postgres access for Jupyterhub/Airflow namespace
Depending on whether you are working from a personal or a team namespace in Jupyterhub/Airflow you need to create a 
pull request in [navikt/vault-iac](https://github.com/navikt/vault-iac). See
[setup for teams](https://github.com/navikt/vault-iac/blob/master/doc/knada.md#setup-for-teams) or 
[setup for personal users](https://github.com/navikt/vault-iac/blob/master/doc/knada.md#setup-for-individual-users) 
for guides.

:::info 
After the pull request has been approved and merged you have to wait for 5-10 minutes before the changes in vault 
is synchronized.
:::

#### 2. Add connection string in vault
Add the connection string and the vault path for the database as key/value pairs under the path for the Jupyterhub/Airflow 
namespace, e.g.
````bash
POSTGRES_CREDENTIALS: "postgres://user:pass@<host>:<port>/<database>"
POSTGRES_CREDS_PATH: "postgresql/preprod-fss/creds/<database>-<role>"
````

You can find _host_, _port_ and _database_ above in [navikt/database-iac](https://github.com/navikt/database-iac).

_Role_ is the role ([admin, user eller readonly](https://github.com/navikt/database-iac/blob/master/README.md)) the provisioned user shall have.

Note: The authentication part of the connection string (*user:pass* above) must be present.
It does not matter what you enter as dataverk will replace the values with valid credentials when you attempt to do a SQL query, 
but there must be a default value in the connection string stored in vault.

#### 3. Settings file
As with other secrets (described [here](README.md)) the following must be added in the settings.json file 
dataverk uses.
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
${POSTGRES_CREDENTIALS} and ${POSTGRES_CREDS_PATH} will be replaced with the corresponding values in vault when dataverk 
parses the settings.json file.

#### 4. Read from postgres
You can now use dataverk to read from postgres in the same way as with other databases, i.e.:
````python
from dataverk import Client

dv = Client()

df = dv.read_sql("postgres_database", "SELECT * FROM table")
````
