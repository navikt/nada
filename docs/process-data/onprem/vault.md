---
title: Vault
---

For secrets in Jupyterhub/Airflow, [vault](https://github.com/navikt/vault-iac/tree/master/doc) is used 
in the same way as for applications in the other onprem clusters.

## Setup vault for onprem Jupyterhub and Airflow
In order to set up vault for a new Jupyterhub/Airflow namespace one must create a pull request in 
[navikt/vault-iac](https://github.com/navikt/vault-iac). See [Team namespace](#team-namespace) for setting up vault for 
team namespaces and [Single-user namespace](#single-user-namespace) for setting up vault for single-user namespaces.

### Team namespace
For a team namespace do the following:

1. If it does not exist, create the folder `terraform/teams/<team-name>`
2. If it does not exist, create the file `<team-name>.yml` in the folder `terraform/teams/<team-name>`
3. In the yml file add the following content:

````
name: <team-name>
group_id: <group-id>
kubeflow:
  - namespace: <jupyter-namespace>
````

#### name
Team name

#### group-id
You can locate the `group-id` if you go to  
[AAD groups](https://aad.portal.azure.com/#blade/Microsoft_AAD_IAM/GroupsManagementMenuBlade/AllGroups) 
and search for your team.

#### kubeflow[].namespace
List of names of Jupyterhub/Airflow namespaces.

### Single-user namespace
For single-user namespaces do the following:

1. Create folder `terraform/users/<navn>`
2. Create a `<name>.yml` file in the folder `terraform/users/<name>`
3. In the yml file add the following content:

````
email: <nav-email>
kubeflow:
  - namespace: <jupyter-namespace>
````

#### nav-email
NAV email for user

#### kubeflow[].namespace
List of names of Jupyterhub/Airflow namespaces.

:::info
After the pull request is approved and merged one must wait for 10-15 minutes before the changes in vault are synchronized.
:::

## Adding and administrating secrets is vault
After the pull request to [navikt/vault-iac](https://github.com/navikt/vault-iac) has been merged you can add and administrate 
your secrets by logging into [vault](https://vault.adeo.no) using `OIDC`.

## Import the secrets in Jupyterhub and Airflow
If you have stored a secret called e.g. `DB_PASSWORD` in vault this can now be imported and set as an environment variable 
in Jupyterhub/Airflow as follows:

````python
import os
from dataverk_vault import api as vault_api

vault_api.set_secrets_as_envs()

my_secret = os.environ["DB_PASSWORD"]
````

## Vault integration with dataverk
For docs on how to use secrets in vault together with dataverk, see [here](../dataverk/settings/README.md).
