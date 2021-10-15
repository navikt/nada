---
title: Settings file
---

Dataverk requires a settings.json file where you specify configurable settings which vary from user 
to user. In this file you can specify the sources you wish to read data from, and the storage sink and 
elastic search index you wish to publish data packages to.

## Examples

### With vault
````python
{
  "db_connection_strings": {
    "oracle_database": "${ORACLE_CONNECTION_STRING}",
    "postgres_database": "${POSTGRES_CONNECTION_STRING}"
  }
}
````
The above example requires that you are working **from a jupyter notebook server on NAIS with [vault](../../onprem/vault.md) 
integration set up for the namespace**.

To use the settings file above the following secrets must be stored in vault as key/value pairs:
````bash
ORACLE_CONNECTION_STRING: "oracle://user:pass@host:port/db"
POSTGRES_CONNECTION_STRING: "postgres://user:pass@host:port/db"
````

When dataverk parses the settings.json file the secret values will be fetched and replace the placeholder values in the 
settings.json file. E.g. ${ELASTIC_HOST} will be replaced with "https://min-elastic-search-host.no" in the settings object 
dataverk loads and uses.

### Without vault
If you are using dataverk outside of Jupyterhub without vault integration the secrets must be written to the settings.json 
file directly:
````python
{
  "db_connection_strings": {
    "oracle_database": "oracle://user:pass@host:port/db",
    "postgres_database": "postgres://user:pass@host:port/db"
  }
}
````

## Full example
Below is a full example of a settings.json with all possible configurations.
````python
{
  "db_connection_strings": {
    "oracle_database": "${ORACLE_CONNECTION_STRING}",
    "postgres_database": "${POSTGRES_CONNECTION_STRING}"
  },
  
  "kafka": {
    "brokers": ["${KAFKA_BROKER1}",
                "${KAFKA_BROKER2}",
                "${KAFKA_BROKER3}"],
    "group_id": "my_group",
    "security_protocol": "SASL_SSL",
    "sasl_mechanism": "PLAIN",
    "sasl_plain_username": "${SASL_USERNAME}",
    "sasl_plain_password": "${SASL_PASSWORD}",
    "schema_registry": "${SCHEMA_REGISTRY_ADDRESS}",
    "ssl_cafile": "${CA_FILE_PATH}"
  }
}
````

## Reference settings file in code

### Read from databases
In code you reference the database connections in the settings object as follows.

settings.json:
````python
{
  "db_connection_strings": {
    "oracle_database": "${ORACLE_CONNECTION_STRING}"
  }
}
````
Code:
````python
from dataverk import Client
dv = Client()

df = dv.read_sql("oracle_database", "SELECT * FROM some.table")
````

#### Postgres
See [postgres connections](postgres.md) to learn how to configure postgres connections for Jupyterhub/Airflow.

## Field definitions
- **index_connections**:
  - datatype: dict
  - definition: Configuration for the elastic search index
  - fields:
    - elastic_host:
        - datatype: string
        - definition: Elastic search host address 
    - index:
        - datatype: string
        - definition: Elastic search index name
- **db_connection_strings**:
  - datatype: dict
  - definition: Connection strings for databases
- **kafka**:
  - datatype: Dict
  - definition: 
  - felter:
    - brokers
        - datatype: list
        - definition: List of kafka brokers
    - group_id
        - datatype: string
        - definition: Kafka consumer group id
    - security_protocol:
        - datatype: string
        - definition: Security protocol used
    - sasl_mechanism:
        - datatype: string
        - definition: Authentication mechanism for kafka
    - sasl_plain_username: 
        - datatype: string
        - definition: Username for authentication
    - sasl_plain_password:
        - datatype: string
        - definition: Password for authentication
    - schema_registry:
        - datatype: string
        - definition: Schema registry address
    - ssl_cafile:
        - datatype: string
        - definition: Path to ca-bundle in container environment
