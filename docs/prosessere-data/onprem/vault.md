---
title: Vault
---

For lagring av hemmeligheter som skal brukes i Jupyterhub/Airflow i knada clusteret brukes 
[vault](https://github.com/navikt/vault-iac/tree/master/doc) på samme måte som applikasjoner gjør i de øvrige onprem 
clusterne i NAV.


## Oppsett av vault for onprem Jupyterhub og Airflow
For å sette opp vault for et nytt Jupyterhub/Airflow namespace kreves det en PR til 
[navikt/vault-iac](https://github.com/navikt/vault-iac). Hva denne PRen skal bestå av er avhengig av om du skal
opprette vault område for et [team namespace](#team-namespace) eller et [enkeltbruker namespace](#enkeltbruker-namespace).


### Team namespace
For team namespace gjøres følgende:

1. Hvis den ikke allerede eksisterer, opprett mappen `terraform/teams/<team-navn>`
2. Hvis den ikke allerede eksisterer, opprett en `<team-navn>.yml` fil i mappen `terraform/teams/<team-navn>`
3. I yml-filen legges følgende inn:

````
name: <team-navn>
group_id: <gruppe-id>
kubeflow:
  - namespace: <jupyter-namespace>
````

#### name
Navnet på teamet

#### group_id
`group_id` finner du ved å gå til 
[AAD gruppen](https://aad.portal.azure.com/#blade/Microsoft_AAD_IAM/GroupsManagementMenuBlade/AllGroups) 
og leter opp teamet ditt.

#### kubeflow[].namespace
Navnet på Jupyterhub/Airflow namespacet. Skal teamet ha tilgang til vault for flere Jupyterhub/Airflow namespacer så 
legger man bare til flere i listen under `kubeflow`.

### Enkeltbruker namespace
For enkeltbruker namespace gjøres følgende:

1. Opprett mappen `terraform/users/<navn>`
2. Hvis den ikke allerede eksisterer, opprett en `<navn>.yml` fil i mappen `terraform/users/<navn>`
3. I yml-filen legges følgende inn:

````
email: <nav-epost>
kubeflow:
  - namespace: <jupyter-namespace>
````

#### email
NAV-eposten til brukeren

#### kubeflow[].namespace
Navnet på Jupyterhub/Airflow namespacet. Skal personen ha tilgang til vault for flere Jupyterhub/Airflow namespacer så 
legger man bare til flere i listen under `kubeflow`.


:::info
Etter at pull requesten er godkjent og merget inn vil det ta 5-10 minutter før endringene i vault 
er synkronisert.
:::


## Legg inn hemmeligheter for Jupyterhub/Airflow namespacet
For å legge inn hemmeligheter gå til https://vault.adeo.no og logg inn med `OIDC`.

1. Velg `kv/prod/kubeflow`
2. Trykk `Create secret +`
3. Under `Path for this secret` skriv namespacet du satte 
[over](#oppsett-av-vault-for-onprem-jupyterhub-og-airflow).

Deretter kan man legge inn hemmeligheter som key/value verdier, altså hvor `key` er navnet på
hemmeligheten som du skal bruke for å referere til den senere og `value` er verdien.


## Bruke hemmeligheter i Jupyterhub/Airflow
Hvis du f.eks. har lagt inn en hemmelighet som heter `DB_PASSWORD` i vault kan denne nå hentes inn
i Jupyterhub/Airflow med følgende kode 

````python
import os
from dataverk_vault import api as vault_api

vault_api.set_secrets_as_envs()

my_secret = os.environ["DB_PASSWORD"]
````
