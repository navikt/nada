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

### Sette opp nbstripout i notebook

For å unngå at output celler fra jupyter notebooks blir pushet sammen med kode til github anbefaler vi å installere [nbstripout](https://github.com/kynan/nbstripout) på repoet ditt. Dette verktøyet sørger for at output celler i jupyter notebooks utelates fra kode commits.

For å installere, gjør som følger:
- `pip install nbstripout`
- Kjør kommandoen `nbstripout --install --global` fra lokalt repository
