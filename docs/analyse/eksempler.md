# Kodeeksempler

## R

### Lese fra Google Cloud Storage bucket
1. Autentiser deg med `gcloud auth login --update-adc`
2. Installer følgende pakker
````R
install.packages("googleCloudStorageR")
install.packages("gargle")
````
3. Les fra bucket
````R
library(googleCloudStorageR)
library(gargle)

scope <-c("https://www.googleapis.com/auth/cloud-platform")
token <- token_fetch(scopes = scope)

gcs_auth(token = token)

gcs_global_bucket("my-bucket")
obj <- gcs_get_object("file.txt")
````
