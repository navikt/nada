

## Union i Nav
Et prosjekt i Union får automatisk opprettet tre domains i Union: `development`, `staging` og `production`.
Dette er separate Kubernetes namespaces som sørger for isolasjon.

For å komme igang be #dataplattform i Slack for å få opprettet og tilgang til det aktuelle prosjektet i Union

Addressen til Union (kontrollplanet) er `https://union.data.nav.no/`. Her kan du administrere Union prosjektene dine, som trigge tasks og sjekke status på kjøringer og logger.

Innad i et prosjekt er det mulig å sett opp bestemte roller, dvs. hva hver enkelt teammedlem har lov til å gjøre.
Dette kan være nyttig for å skille mellom ulike profiler innad i et team, eksempelvis kan man ha noen med en administrator rolle, andre som skal ha lov til å opprette og trigge Union tasks, mens andre igjen kun skal ha lov til å sjekke status på kjøringer/logger.
Dette er noe vi ønsker å se litt an basert på erfaringer fra bruk, før vi eventuelt lager føringer for dette. 

## Python
Jobb helst i virtuelle python miljøer. Slik oppretter du et uv-miljø for bruk med Union:

1. [Installer uv](https://docs.astral.sh/uv/getting-started/installation/)
2. Opprett virtuelt miljø med `uv venv`
3. Kjør kommandoen `source .venv/bin/activate` for å aktivere det virtuelle miljøet for den aktive terminalsesjonen (dette må gjøre hver gang du åpner en ny terminal)
4. Installer flyte med `uv pip install flyte==2.2.4` (versjon 2.2.4 er den som er installert i vårt base image per nå)
5. Kjør kommandoen `gcloud auth login --update-adc` for å autentisere med Google Cloud.
6. Kjør kommandoen `gcloud auth configure-docker europe-west1-docker.pkg.dev` for å kunne pushe docker images til vårt registry.

Nå er du klar for å ta i bruk Union!

## Team-spesifikk konfigurasjon 
Når du kjører en task i Union (kubernetes pod i Union clusteret) så er den i utgangspunktet isolert fra alle andre systemer og kilder. Tilganger styres av **service accounts**. Tasken har oftest behov for å nå feks:

- Google APIer (BigQuery, storage buckets etc.)
- Interne kilder i NAV (datavarehus, Oracle-baser, interne APIer etc.)
- Eksterne APIer (github, eksterne datakilder etc.)

Union skal være mest mulig selvbetjent, samtidig som sikkerheten ivaretas.
Du kan derfor:

- Opprette så mange service accounts du vil per miljø (dev, prod osv.)
- Bestemme hva disse får lov til å snakke med (både internt og eksternt)
- Bruke dem i tasks i Union (Kubernetes)

Service accounter du eller teamet ditt har opprettet kan finnes på: [union-console.data.nav.no](https://union-console.data.nav.no).

For hvert miljø i prosjektet ditt lager du et manifest (fil) av type `UnionTeamServiceAccounts` slik som beskrevet under. Dette oppretter og gir tilgang til service accountene:

### Eksempel på manifest

```yaml
apiVersion: data.nav.no/v1alpha1
kind: UnionTeamServiceAccounts
metadata:
  name: test-team-development
spec:
  project: test-team
  domain: development
  serviceAccounts:
    - name: sa1
      externalAllowlist:
        - host: github.com 
      internalAllowlist:
        - host: dmv04-scan.adeo.no
    - name: sa2
      internalAllowlist:
        - host: dmv09-scan.adeo.no
```

Når dette deployes vil dette skje:

- Det opprettes 2 service accounts i Kubernetes (sa1 og sa2)
- For hver av disse opprettes det også en Google service account. Navnet på denne vil få et tilfeldig suffiks, f.eks `sa1-development-ca4ec@nav-data-union-restricted-prod.iam.gserviceaccount.com`. Derfor må du gå til [union-console.data.nav.no](https://union-console.data.nav.no), der vil du finne Google service accounten tilhørende `sa1`.
- Disse kan få tilgang til Google-tjenester som BigQuery og Storage buckets. 
    - Dere kan selv styre disse tilgangene i deres egne Google prosjekter, men det er noen manuelle steg som må gjøres av plattformteamet. Ta kontakt på #airflow-til-union eller #dataplattform for dette.
- Du kan koble service account til en Union task.

Når en task bruker en service account, får den:

- tilgang til Google-tjenester den har fått tildelt
- tilgang til hostene definert i `internalAllowlist` og `externalAllowlist`.

Manifestet kan deployes ved hjelp av vår felles github action [navikt/union-config](https://github.com/navikt/union-config) som tar som input manifest filen over med input parameteren `manifest`.
Se [her](https://github.com/navikt/dataplattform-ci/blob/e959d9d61553a4bcc782d32da7a76e8cd23eddda/.github/workflows/test-apply-utsa.yaml) for et eksempel på en slik github action.

## Skrive Union tasks
Under er et enkelt eksempel på en Union workflow. Den består av én task (hello) som returnerer en streng, og en hovedtask task (main) som kaller denne. Slik kan man koble flere tasks sammen til en workflow.

Hver task kjører i sin egen isolerte container ([pod](https://kubernetes.io/docs/concepts/workloads/pods/)) i Kubernetes. Det eneste som skal til for å gjøre en Python-funksjon om til en Union task, er å dekorere den med `@env.task`.

I Union definerer du altså workflows direkte i Python, uten behov for et eget "orkestreringsspråk" (slik man ofte har i andre orkestreringsverktøy). Flyten styres med vanlig funksjonskall, som gjør det lett å lese og strukturere logikken.

```python
import flyte

env = flyte.TaskEnvironment(
    name="env",
    image=flyte.Image.from_base(
      image_uri="europe-west1-docker.pkg.dev/nav-data-images-prod/nav-union-images/flyte:3.12-base"
    )
    .clone(
        registry="europe-west1-docker.pkg.dev/nav-data-images-prod/nav-union-images",
        name="flyte",
        extendable=True,
    ).with_pip_packages(
        "google-cloud-secret-manager",
        "google-cloud-storage",
        "oracledb",
    ),
)


@env.task
def hello() -> str:
    return "ok"


@env.task()
async def main():
    hello()
```

Det som skiller Union litt fra for eksempel Airflow, er at én workflow faktisk består av flere isolerte kjøringer (pods), og ikke én prosess som styrer alt. Hver task får sitt eget miljø og kjører uavhengig. Dette gjør det enklere å skalere og isolere feil, men det betyr også at man må tenke litt annerledes rundt hvordan man deler data mellom tasks, og hvordan man håndterer logging og feilsøking.

Konfigurasjonen av TaskEnvironment definerer containermiljøet som tasken kjører i. Dette er nærmere beskrevet i [Task environment](#task-environment) under.

### Task environment

Et `TaskEnvironment` beskriver kjøremiljøet som en task kjører i, altså containeren som koden din faktisk kjøres i.

Her spesifiserer du hvilke avhengigheter som må være tilgjengelige, for eksempel Python-biblioteker eller filer som skal inkluderes i imaget som brukes av containeren. Avhengigheter kan legges til med `with_pip_packages()` slik som vist i eksempelet over.

Du kan definere flere `TaskEnvironment` i samme workflow. Dette gjør det mulig å skreddersy kjøremiljøet per task, i stedet for å måtte samle alle avhengigheter i ett felles miljø.

Ta helst utgangspunkt i Dataplattforms base image for tasks. Dette imaget er basert på et [python chainguard image](https://images.chainguard.dev/directory/image/python/overview), er tilpasset for bruk med Flyte, og bygges daglig av Dataplattform i [navikt/union-images](https://github.com/navikt/union-images).


### Opplasting og kjøring av Union tasks
Kommandoene under tar utgangspunkt i at workflowen beskrevet over i [Oppsett av Union tasks](#oppsett-av-union-tasks) er lagret som filen `workflow.py` lokalt.

For å trigge en workflow, kjør:
```bash
flyte run --domain development workflow.py main
```

For å laste opp en workflow, kjør:
```bash
flyte deploy --domain development --all workflow.py
```

Se [Union dokumentasjon](https://www.union.ai/docs/v2/union/user-guide/) for mer informasjon om oppsett, samt opplasting og administrasjon, av Union tasks.

### Eksempler
Se [navikt/union-demo](https://github.com/navikt/union-demo) for eksempler på workflows og tasks med både [v1](https://www.union.ai/docs/v1/flyte/user-guide/introduction/) og [v2](https://www.union.ai/docs/v2/flyte/user-guide/flyte-2/) versjonene av Flyte.


### Oppsett Windows og Union

#### Installer python
1. Åpne `ledetekst`
  - Skriv `python` og trykk enter, dersom python ikke er installert sendes du da til `Microsoft store`
  - Trykk `få` for å installere Python

#### Installer uv
1. Åpne `ledetekst`
2. Du gi brukeren din tillatelse til å installere uv
```bash
powershell -c "Set-ExecutionPolicy RemoteSigned -scope CurrentUser"
```
3. Installer uv
```bash
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

#### Sett opp virtuelt python miljø med uv

_*NB! Viktig at du restarter ledetekst sesjonen etter at du har installert uv i steget [Installer uv](#installer-uv) før du fortsetter*_

1. Lag det virtuelle miljøet
```bash
uv venv
```
2. Aktiver det virtuelle miljøet (_*dette må gjøres hver gang du åpner en ny ledetekst sesjon*_)
```bash
.venv\Scripts\activate
```

#### Installer flyte
1. Installer python biblioteket
```bash
uv pip install flyte
```
2. Opprett flyte config
```bash
flyte create config --endpoint union.data.nav.no --org union-nav --project dataplattform --domain 
development
```
3. Test at du får autentisert deg mot flyte
```bash
flyte get project
```
