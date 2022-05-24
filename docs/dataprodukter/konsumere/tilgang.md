### Søke tilgang
Tilganger til dataprodukter håndteres av teamene som eier dataproduktene.
Tilganger søkes ved å klikke seg inn på aktuelt produkt i markedsplassen.
Produktteamene mottar forespørslene i markedsplassen og kan godkjenne/avslå forespørslene der.


### <a name="service_account"></a> Tilgang med service account til dataprodukter på dataplassen
1. Lag service account under ditt prosjekt i gcp konsollen som beskrevet [her](https://cloud.google.com/iam/docs/creating-managing-service-accounts)
2. Gi den opprettede service accounten rollen `bigquery.user` i [IAM](https://console.cloud.google.com/iam-admin) i GCP konsollen
3. Søk om tilgang på ordinær måte