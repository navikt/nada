### Lese hemmeligheter inn i jupyter/airflow miljø

Hvert team i knada-gke har sin egen secret i [Google Secret Manager](https://console.cloud.google.com/security/secret-manager). For å lese fra denne secreten i jupyterhub/airflow i knada-gke.

````bash
pip install google-cloud-secret-manager
````

````python
import os
from google.cloud import secretmanager
secrets = secretmanager.SecretManagerServiceClient()

resource_name = f"{os.environ['KNADA_TEAM_SECRET']}/versions/latest"
secret = secrets.access_secret_version(name=resource_name)
data = secret.payload.data.decode('UTF-8')
````
