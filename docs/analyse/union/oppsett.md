---
title: Union i Nav
---

# Kom i gang med Union
[Union](https://www.union.ai/docs/v2/union/user-guide/) (basert på Union.ai / Flyte) er på vei til å erstatte Airflow som standard verktøy for orkestrering av datapipelines i Nav.

Hvis du har erfaring med Airflow fra før, vil mange av konseptene være kjente, men implementert på en litt annen måte – blant annet ved at workflows defineres direkte i Python og at hver task ut av boksen kjører i et isolert containermiljø på Kubernetes.

Denne dokumentasjonen er ment som en enkel guide for å komme i gang med Union og viser hvordan du kan sette opp et lokalt utviklingsmiljø, konfigurere et github repo for Continuous Integration (CI) mot Union, samt hvordan å opprette, laste opp og trigge Union tasks.

## Union i Nav
Et prosjekt i Union får automatisk opprettet tre domains i Union: `development`, `staging` og `production`.
Dette er separate Kubernetes namespaces som sørger for isolasjon mellom de ulike domenene.

Addressen til Union (kontrollplanet) er `https://union.data.nav.no/`. Her kan du administrere Union prosjektene dine, trigge tasks og sjekke status på kjøringer og logger.

Innad i et prosjekt er det mulig å sett opp bestemte roller, dvs. hva hver enkelt teammedlem har lov til å gjøre.
Dette kan være nyttig for å skille mellom ulike profiler innad i et team, eksempelvis kan man ha noen med en administrator rolle, andre som skal ha lov til å opprette og trigge Union tasks, mens andre igjen kun skal ha lov til å sjekke status på kjøringer/logger.
Dette er noe vi ønsker å se litt an basert på erfaringer fra bruk, før vi eventuelt lager føringer for dette. 

### Opprettelse av team prosjekt
For å komme i gang spør i [#dataplattform](https://nav-it.slack.com/archives/CGRMQHT50) på Slack for å få opprettet nytt prosjekt i Union.
Du trenger da å oppgi følgende:

- Ønsket navn på union prosjekt
- Liste med brukere som skal ha tilgang til prosjektet
- Github repo(er) som via GitHub actions skal ha tilgang til å gjøre endringer på team spesifikk konfigurasjon i Union samt opplasting av tasks.

### Union-oppsett på lokal maskin

=== "MAC/Linux"
    #### Installer uv
      ```bash
      curl -LsSf https://astral.sh/uv/install.sh | sh
      ```
    #### Sett opp virtuelt python miljø med uv
      1. Lag det virtuelle miljøet
      ```bash
      uv venv
      ```
      2. Aktiver det virtuelle miljøet (_*dette må gjøres hver gang du åpner en ny terminal sesjon*_)
      ```bash
      .venv/bin/activate
      ```
    #### Installer flyte
      1. Installer python biblioteket
      ```bash
      uv pip install flyte
      ```
      2. Opprett flyte config
      ```bash
      flyte create config --endpoint union.data.nav.no --org union-nav --project <prosjekt-navn> --domain 
      development
      ```
      _*NB! Viktig at du erstatter `<prosjekt-navn>` med navnet på prosjektet ditt i kommandoen over*_ 
      3. Test at du får autentisert deg mot flyte
      ```bash
      flyte get project
      ```

=== "Windows"
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

      _*NB! Viktig at du restarter ledetekst sesjonen etter at du har installert uv før du fortsetter*_
    #### Sett opp virtuelt python miljø med uv
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
      flyte create config --endpoint union.data.nav.no --org union-nav --project <prosjekt-navn> --domain 
      development
      ```
      _*NB! Viktig at du erstatter `<prosjekt-navn>` med navnet på prosjektet ditt i kommandoen over*_ 
      3. Test at du får autentisert deg mot flyte
      ```bash
      flyte get project
      ```

### Oppsett for Github repo
```bash
.
├── .github
│   ├── dependabot.yml
│   └── workflows
│       └── union-config.yaml
├── .union
│   └── utsa.yaml
└── tasks
    └── example
        ├── requirements.txt
        └── task.py
```

Over er et forslag til en struktur på et Github repo som brukere kan ta utgangspunkt i.
Dette forslaget dekker 

- [Oppsett av team-spesifikk konfigurasjon](#team-spesifikk-konfigurasjon-unionutsayaml)
- [Opplasting av team-spesifikk konfigurasjon](#github-action-for-opplasting-av-union-config-githubworkflowsunion-configyaml)
- [Eksempel på en task]()
- [Oppsett av sårbarhetsmonitorering for avhengigheter til Union tasks]().

#### Team-spesifikk konfigurasjon (`.union/utsa.yaml`)
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

##### Eksempel på manifest

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
      cloudSQL:
        - ip: 34.33.34.33
    - name: sa2
      internalAllowlist:
        - host: dmv09-scan.adeo.no
```

Når dette deployes vil følgende skje:

- Det opprettes 2 service accounts i Kubernetes (sa1 og sa2)
- For hver av disse opprettes det også en Google service account. Navnet på denne vil få et tilfeldig suffiks, f.eks `sa1-development-ca4ec@nav-data-union-restricted-prod.iam.gserviceaccount.com`. Derfor må du gå til [union-console.data.nav.no](https://union-console.data.nav.no), der vil du finne Google service accounten tilhørende `sa1`.
- Disse kan få tilgang til Google-tjenester som BigQuery og Storage buckets. 
    - Dere kan selv styre disse tilgangene i deres egne Google prosjekter, men det er noen manuelle steg som må gjøres av plattformteamet. Ta kontakt på #airflow-til-union eller #dataplattform for dette.
- Du kan koble service account til en Union task.

Når en task bruker en service account, får den:

- tilgang til Google-tjenester den har fått tildelt
- tilgang til hostene definert i `internalAllowlist`, `externalAllowlist` og `cloudSQL`.

Manifestet kan deployes ved hjelp av vår felles github action [navikt/union-config](https://github.com/navikt/union-config) som tar som input manifest filen over med input parameteren `manifest`.
Se [her](https://github.com/navikt/dataplattform-ci/blob/e959d9d61553a4bcc782d32da7a76e8cd23eddda/.github/workflows/test-apply-utsa.yaml) for et eksempel på en slik github action.

##### HTTPS-egress

For å gi en service account tilgang til å nå en ekstern eller intern host, legg den til i `externalAllowlist` eller `internalAllowlist` i din `UnionTeamServiceAccounts`:

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
```

**Koden din skal koble til via `http://`, ikke `https://`.** Plattformen håndterer kryptering for deg — trafikken er kryptert internt i plattformen og sikres når den forlater til omverdenen. Du trenger ikke å forholde deg til sertifikater eller TLS-konfigurasjon.

```python
requests.get("http://github.com", allow_redirects=False)
```

**Skru av automatisk redirect-følging.** Noen hosts redirecter forespørsler til en annen URL, for eksempel et kanonisk domene eller en bestemt sti. Plattformen kan ikke følge disse redirectene automatisk på dine vegne, så bruk `allow_redirects=False` og kall den endelige destinasjons-URLen direkte for å sikre pålitelig oppførsel.


##### TCP-egress

For TCP-tilkoblinger, for eksempel mot databaser, brukes `internalAllowlist` på samme måte. TCP-egress krever ingen spesiell håndtering i koden utover å bruke riktig host og port.

Merk at TCP-egress foreløpig ikke støttes i `externalAllowlist` — det er kun tilgjengelig for interne hosts via `internalAllowlist`.

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
      internalAllowlist:
        - host: dmv04-scan.adeo.no
```

#### Github Action for opplasting av Union config (`.github/workflows/union-config.yaml`)
Når man i [Opprettelse av prosjekt](#opprettelse-av-team-prosjekt) angir repoer som tilhører et Union prosjekt så gir man github actions i dette repositoriet lov til å deploye [team-spesifikk union config](#team-spesifikk-konfigurasjon-unionutsayaml) til Union.

For å deploye dette brukes vår github action [navikt/union-config](https://github.com/navikt/union-config) som eksempelet under:
```yaml
name: Apply Union configuration

on:
  push:
    branches:
      - main
    paths:
      - '.union/utsa.yaml'
      - '.github/workflows/union-config.yaml'

jobs:
  apply-union-config:
    name: Apply Union configuration
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write

    steps:
      - name: Checkout
        uses: actions/checkout@9c091bb21b7c1c1d1991bb908d89e4e9dddfe3e0 # v7.0.0

      - uses: navikt/union-config@v2
        name: Apply utsa prod
        with:
          manifest: .union/utsa.yaml
```

Hver gang endringer på konfigurasjonfilen `.union/utsa.yaml` pushes til repoets `main` branch så vil denne github actionen sørger for at disse endringene rulles ut i Union.

#### Oppsett av dependabot for sårbarhetsmonitorering av Union task avhengigheter
Vi anbefaler oppsett av [dependabot](https://docs.github.com/en/code-security/tutorials/secure-your-dependencies/dependabot-quickstart) for github repoer med Union tasks som automatisk oppretter pull requests med versjonsoppdateringer av avhengigheter.

Dette kan enkelt konfigureres ved å opprette filen `.github/dependabot.yml` med følgende innhold:
```yaml
version: 2
updates:
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
    groups:
      gh:
        patterns:
        - '*'

  - package-ecosystem: "pip"
    directory: "/tasks/example"
    schedule:
      interval: "weekly"
    groups:
      example-task-pip:
        patterns:
        - '*'
```

Denne dependabot konfigurasjonen er satt opp til å se etter github actions versjonoppdateringer, samt å monitorere avhengigheter for Union tasken under `tasks/eksempel` og vil automatisk opprette pull request dersom det er nye versjoner av avhengighetene angitt i `tasks/eksempel/requirements.txt`.

#### Eksempel task
Under er et enkelt eksempel på en Union workflow. Den består av én task (hello) som returnerer en streng, og en hovedtask task (main) som kaller denne. Slik kan man koble flere tasks sammen til en workflow.

Hver task kjører i sin egen isolerte container ([pod](https://kubernetes.io/docs/concepts/workloads/pods/)) i Kubernetes. Det eneste som skal til for å gjøre en Python-funksjon om til en Union task, er å dekorere den med `@env.task`.

I Union definerer du altså workflows direkte i Python, uten behov for et eget "orkestreringsspråk" (slik man ofte har i andre orkestreringsverktøy). Flyten styres med vanlig funksjonskall, som gjør det lett å lese og strukturere logikken.

```python
import flyte

env = flyte.TaskEnvironment(
    name="my_environment",
    pod_template=flyte.PodTemplate(
        pod_spec=k8s.V1PodSpec(
            service_account_name="sa1",
            containers=[k8s.V1Container(name="primary")]
        )
    ),
    image=flyte.Image.from_base(
      image_uri="europe-west1-docker.pkg.dev/nav-data-images-prod/nav-union-images/flyte:3.13-base"
    )
    .clone(
        registry="europe-west1-docker.pkg.dev/nav-data-images-prod/nav-union-images",
        name="flyte",
        extendable=True,
    )
    .with_env_vars({
      "UV_KEYRING_PROVIDER": "subprocess", 
    })
    .with_pip_packages(
        "pandas",
        "numpy",
        "oracledb",
        "sqlalchemy",
        index_url=(
            "https://oauth2accesstoken@"
            "europe-west1-python.pkg.dev/nav-data-images-prod/pypi/simple/"
        ),
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

Under `pod_template` i eksempelet over setter `service_account_name` til service accounten man ønsker at dette `TaskEnvironment`-et skal bruke. Der må man spesifisere en av teamets service accounts som er opprettet i [teamets union konfigurasjon](#team-spesifikk-konfigurasjon-unionutsayaml).

##### Task environment

Et `TaskEnvironment` beskriver kjøremiljøet som en task kjører i, altså containeren som koden din faktisk kjøres i.

Her spesifiserer du hvilke avhengigheter som må være tilgjengelige, for eksempel Python-biblioteker eller filer som skal inkluderes i imaget som brukes av containeren. Avhengigheter kan legges til med `with_pip_packages()` slik som vist i eksempelet over.

Du kan definere flere `TaskEnvironment` i samme workflow. Dette gjør det mulig å skreddersy kjøremiljøet per task, i stedet for å måtte samle alle avhengigheter i ett felles miljø.

Ta helst utgangspunkt i Dataplattforms base image for tasks. Dette imaget er basert på et [python chainguard image](https://images.chainguard.dev/directory/image/python/overview), er tilpasset for bruk med Flyte, og bygges daglig av Dataplattform i [navikt/union-images](https://github.com/navikt/union-images).

### Lokal opplasting og kjøring av Union tasks
Kommandoene under tar utgangspunkt i at workflowen beskrevet over i [Eksempel task](#eksempel-task) er lagret som filen `workflow.py` lokalt.

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
Se [navikt/union-dataplattform](https://github.com/navikt/union-dataplattform) for eksempler på tasks.
