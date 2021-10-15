---
title: Cloud Scheduler
---

> With [Google Cloud Scheduler](https://cloud.google.com/scheduler) you set up scheduled units of work to be executed at defined times or regular intervals. These work units are commonly known as cron jobs. Typical use cases might include sending out a report email on a daily basis, updating some cached data every 10 minutes, or updating some summary information once an hour.

You can find the official documentation for Cloud Scheduler at [cloud.google.com](https://cloud.google.com/scheduler/docs).


## Example
This guide requires that you have completed the guide in [Cloud Functions](cloud-functions#eksempel) and created a Cloud Function. 
We now use Cloud Scheduler to trigger this cloud function periodically.

### Create service account
1. Go to `IAM & Admin`
2. Create service account with the following roles:
    - `Cloud Functions Invoker`
    - `Cloud Scheduler Admin`
3. Note the .iam.gserviceaccount.com email of the service accounten

### Create a Cloud Scheduler
From [Cloud scheduler](https://console.cloud.google.com/cloudscheduler) press `CREATE JOB`.

The following must be specified:
1. `Name`
2. `Frequency` - [cron](https://en.wikipedia.org/wiki/Cron) string
3. `Timezone` - set to `Central European Standard Time (CET)`
4. `Target` - set to `HTTP`
5. `URL` - set to the Trigger URL of the [Cloud Function](cloud-functions#eksempel) created earlier
6. `HTTP method` - set to POST
7. Set Auth header to `Add OIDC token` and enter the service account email created in [Create service account](#create-service-account)

Finally, press `CREATE`.

You have now created a job that triggers your cloud function periodically.
