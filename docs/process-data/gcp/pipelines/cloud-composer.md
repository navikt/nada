---
title: Cloud Composer
---

> Cloud Composer is a managed Apache Airflow service that helps you create, schedule, 
monitor and manage workflows. Cloud Composer automation helps you create Airflow environments quickly and use 
Airflow-native tools, such as the powerful Airflow web interface and command line tools, so you can focus on your 
workflows and not your infrastructure.

You can find the official documentation for Cloud Composer at [cloud.google.com](https://cloud.google.com/composer/docs/concepts/overview).

## Create a new composer instance
To create a new composer instance, go to [Cloud Composer](https://console.cloud.google.com/composer) and press `CREATE`

The following must be specified:
1. `Name`
2. `Location` - the region where the instance is created (must choose Europa)
3. Press `CREATE`

:::info
Creating a new Cloud Composer will automatically create a [bucket](https://cloud.google.com/storage/docs/introduction) 
for the composer instance. Before advancing to the next step it is important to note the name of the bucket created. 
You can find the bucket [here](https://console.cloud.google.com/storage) by locating the bucket with `goog-composer-environment` labels.
:::


## Set up repository for DAGS
In the bucket created in [Create a new composer instance](cloud-composer#create-a-new-composer-instance) there is a folder called `dags`. 
This folder contains the datapipeline descriptions (DAGs) which you can orchestrate with Cloud Composer.  

In order to have revision control for these pipeline descriptions it is recommended to set up a synchronization with a github 
repository. 

### Lag service account
1. Go to [Google IAM](https://console.cloud.google.com/iam-admin/serviceaccounts)
and press `CREATE SERVICE ACCOUNT`
2. Enter `Service account name` og en `Service account description`
4. Give the service account the following access rights to the bucket created in [Opprett ny composer instans](cloud-composer#create-a-new-composer-instance):
    - `Storage Legacy Bucket Writer`
    - `Storage Object Admin`

:::info
Note the service account email created
:::

### Download service account key
1. Go to [Google IAM](https://console.cloud.google.com/iam-admin/serviceaccounts)
2. Press the service account created in [Lag service account](cloud-composer#lag-service-account)
3. Press `KEYS`
4. Press `ADD KEY` -> `Create new key` -> `JSON`
5. Store the key locally

### Create repository
1. Create a github repository under the navikt organization
2. Create the following two secrets:
    - `Name` set to GCS_CREDS and `Value` to the content in the JSON key downloaded in [Download service account key](cloud-composer#download-service-account-key)
    - `Name` set to PROJECT_ID and `Value` to the GCP project id (found [here](https://console.cloud.google.com/home/dashboard))

### Repository content
1. Create a folder called `dags` in the repository
2. Create the file .github/workflows/sync-gcs-bucket.yaml with content as follows

````
name: Sync-GCS-bucket

on:
  push:
    branches:
      - main
    paths:
      - '.github/workflows/sync-gcs.yaml'
      - 'dags/**'

jobs:
  sync-gcs-bucket:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: GoogleCloudPlatform/github-actions/setup-gcloud@master
      with:
        service_account_key: ${{ secrets.GCS_CREDS }}
        project_id: ${{ secrets.PROJECT_ID }}
        export_default_credentials: true
    - name: Sync dags to gcs bucket
      run: gsutil cp -r dags gs://BUCKET
````

:::info
Replace BUCKET in the workflow above with the name of the bucket created in  
[Create a new composer instance](cloud-composer#create-a-new-composer-instance)
:::

On push to main branch this workflow will upload the content of the `dags` folder in the repository to the gcs bucket 
which is synchronized with the Cloud Composer instance.

## Add DAGs
You are now ready to start adding DAGs. Example dags can be found in [navikt/composer-dags](https://github.com/navikt/composer-dags) 


## Synchronize the requirements.txt in the repository with the cloud composer environment
1. Add `requirements.txt` file in the repository
2. Create the file `.github/workflows/update-requirements.yaml` with content as follows

````
name: Update-composer-dependencies

on:
  push:
    branches:
      - main
    paths:
      - 'requirements.txt'
      - '.github/workflows/update-requirements.yaml'

jobs:
  update-composer-requirements:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: GoogleCloudPlatform/github-actions/setup-gcloud@master
      with:
        service_account_key: ${{ secrets.GCS_CREDS }}
        project_id: ${{ secrets.PROJECT_NAME }}
        export_default_credentials: true
    - name: Update requirements.txt
      continue-on-error: true
      run: |
        gcloud composer environments update COMPOSER_INSTANCE --update-pypi-packages-from-file requirements.txt --location LOCATION --project ${GCLOUD_PROJECT}
````

Replace `COMPOSER_INSTANCE` with the name of your composer instance and `LOCATION` with 
name of the location where the composer runs. Both of these values can be found  
[here](https://console.cloud.google.com/composer/environments).
