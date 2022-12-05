### Lese hemmeligheter inn i jupyter/airflow miljø

Hvert team i 

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
