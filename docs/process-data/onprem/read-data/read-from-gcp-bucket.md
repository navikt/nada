---
title: Read GCP buckets from onprem Jupyterhub/Airflow
---

In order to read GCP buckets from onprem Jupyterhub/Airflow you need to create a 
[GCP Service account](https://cloud.google.com/iam/docs/service-accounts) used for authentication. 

## Create Service Account

1. Go to [IAM & Admin](https://console.cloud.google.com/iam-admin/serviceaccounts)
2. Press `CREATE NEW SERVICE ACCOUNT`
3. Enter `Service account name` and `Service account description`
4. Press `DONE`
5. Note the email address the created service account gets

## Gi access to bucket for service account
1. Go to [Cloud Storage](https://console.cloud.google.com/storage/browser)
2. Find the bucket you want to give the service accounten access to
3. Press `PERMISSIONS`
4. Press `ADD`
5. Under `New members` enter the email created in [Opprett Service account](#opprett-service-account)
6. Give the following access:
    - `Storage Object Admin`
    - `Storage Legacy Bucket Reader`, or `Storage Legacy Bucket Writer` if you need write permissions to the bucket

## Create service account key
1. Go to [IAM & Admin](https://console.cloud.google.com/iam-admin/serviceaccounts) 
2. Press the service accounten created in [Opprett Service account](#opprett-service-account)
3. Press `KEYS`
4. Press `ADD KEY`
5. And finally `Create new key` with key type `JSON`

:::info
This key must be stored as a secret in vault, for guide see [here](../vault.md).
:::

## Code example for reading from bucket
````python
from google.cloud import storage
from dataverk_vault import api as vault_api
from google.oauth2 import service_account
vault_api.set_secrets_as_envs()

creds = service_account.Credentials.from_service_account_info(json.loads(os.environ["<navnet du ga hemmeligheten i vault>"]))
client = storage.Client(creds.project_id, credentials=creds)
bucket = client.get_bucket("<navn på bucket>")
blob = bucket.blob("<navn på blob i bucket>")
data = blob.download_as_string()
````
