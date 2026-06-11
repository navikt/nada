

## Union i Nav
Et prosjekt i Union får automatisk opprettet tre miljøer (domains i Union): `development`, `staging` og `production`.
Dette oversettes til separate namespacer i Kubernetes clusteret som Union tasks kjører, slik at arbeidslaster ment for testing/utvikling kan isoleres totalt fra f.eks. arbeidslaster ment for produksjon.

Vi har lagt til rette for at brukerne selv kan provisjonere så mange service accounts de vil for hvert enkelt miljø innad i et prosjekt samt hvordan arbeidslaster som bruker disse service accountene kan knyttes til regler som gir de lov til å nå bestemte kilder.
Dette beskrives mer detaljert i [Team spesifikk konfigurasjon](#team-spesifikk-konfigurasjon) under.

Addressen til kontrollplanet (brukergrensesnittet) til Union er `https://union.data.nav.no`.
Her kan brukerne administere Union prosjekter de har tilgang til samt trigge runs av tasks og sjekke status på kjøringer og logger.

Innad i et prosjekt kan man konfigurere bestemte roller, dvs. hva hver enkelt teammedlem har lov til å gjøre.
Dette kan være nyttig for å skille mellom ulike profiler innad i et team, eksempelvis kan man ha noen med en administrator rolle, andre som skal ha lov til å opprette og trigge Union tasks, mens andre igjen kun skal ha lov til å sjekke status på kjøringer/logger.
Hvordan teamene ønsker å konfigurere dette er noe vi tenker å se litt an basert på erfaringer fra bruk. 

## Python virtuelt miljø
Vi anbefaler brukerne å jobbe i virtuelle python miljøer. Følg oppskriften under for å installere og konfigurere et uv-miljø for bruk med Union.

1. Installer uv for ditt miljø ved å følge [deres dokumentasjon](https://docs.astral.sh/uv/getting-started/installation/)
2. Sett opp virtuelt miljø med `uv venv`
3. Kjør kommandoen `source .venv/bin/activate` for å aktivere det virtuelle miljøet for den aktive terminalsesjonen (dette må gjøre hver gang du åpner en ny terminal)
4. Installer flyte med `uv pip install flyte`

Nå er du klar for å ta i bruk Union!

## Team spesifikk konfigurasjon 
Vi ønsker at mest mulig i Union skal være selvbetjent for brukerne våre samtidig som at vi legger opp til at sikkerhet ivaretas i best mulig grad.
Derfor har vi lagt til rette for brukerne selv kan provisjonere så mange service accounts de vil for hvert miljø i prosjektene sine samt at disse service accountene kan knyttes til regler som gir arbeidslaster i Kubernetes (Union tasks) som bruker de lov til å nå bestemte kilder.

Team spesifikk konfigurasjon settes opp med å deploye en `UnionTeamServiceAccounts` ressurs per miljø i teamets Union prosjekt til dataplan-clusteret til Union.
Under er et eksempel på et slikt manifest for Union prosjektet `test-team` i deres `development` miljø:

```yaml
apiVersion: data.nav.no/v1alpha1
kind: UnionTeamServiceAccounts
metadata:
  name: test-team-development
  namespace: test-team-development
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

Dette manifestet vil opprette to service accounts for Union prosjektet `test-team` i `development` miljøt deres.
Hver av disse service accountene i Kubernetes vil få opprettet en tilhørende google service account.
Disse google service accounten kan igjen gis tilganger til google APIer (BigQuery, storage buckets etc.).
Når man så knytter en av disse service accountene til en task i Union vil prosesser i denne tasken kunne benytte seg av tilgangene gitt, dvs. både tilgang til google APIer samt også åpninger listet for service accounten under `externalAllowlist` og `internalAllowlist`.

Manifestet kan deployes av teamene selv ved hjelp av vår github action [navikt/union-config](https://github.com/navikt/union-config) som tar som input manifest filen over med input parameteren `manifest`.
Se [her](https://github.com/navikt/dataplattform-ci/blob/e959d9d61553a4bcc782d32da7a76e8cd23eddda/.github/workflows/test-apply-utsa.yaml) for et eksempel på en slik github action.

## Oppsett av Union tasks
Under er et enkelt eksempel på Union workflow, den kjører en task som kaller en underliggende task som kun returnerer en "ok" streng som output.

Dette eksempelet er mest ment for å illustrere hvordan man kan sy sammen Union tasks (dvs. python funksjoner) til en fullstendig workflow bestående av mange steg.
Hver av Union taskene vil kjøres i separate, isolerte [pods](https://kubernetes.io/docs/concepts/workloads/pods/) i dataplan-clusteret.
Det eneste som må gjøres for at en python funksjon skal kjøres som en Union task er å legge på annotasjonen `@env.task`.
Utover det er det standard python syntax som beskriver flyten i en Union workflow, dvs det er ikke noe domenespesifikt språk man må sette seg inn i for å bygge opp en workflow bestående av mange ledd.

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

Det som er verdt å merke seg er konfigurasjonen av TaskEnvironment da dette er en abstraksjon for å konfigurere containermiljøet som Task koden kjører i. Dette er nærmere beskrevet i [Task environment](#task-environment) under.

### Task environment
Et `TaskEnvironment` beskriver containermiljøet som en bestemt tasks kode kjører i, dvs. her må brukerne spesifisere f.eks. hvilke biblioteker som må være tilgjengelig eller filer skal kopieres inn i imaget som brukes av containeren.
Dette kan gjøres som i eksempelet over ved å legge til avhengigheter med `with_pip_packages()` som over.
Brukerne kan spesifisere så mange `TaskEnvironment` de vil og dermed sørge for at hver tasks kjøremiljø er skreddersydd for det formålet tasken har.

Vi oppfordrer også brukerne til å benytte dataplattform sitt base image for tasks slik som vist i eksempelet over.
Dette baseimaget baserer seg på et [python chainguard image](https://images.chainguard.dev/directory/image/python/overview) og utvides for å kunne brukes som flyte image samt rebygges daglig av oss i [navikt/union-images](https://github.com/navikt/union-images).

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

### Trigge Union workflows fra IWS
Som med Airflow vil det være mulig å trigge Union workflows fra IWS.
For at dette skal være mulig er teamet nødt til å melde fra om dette i #dataplattform da det er et manuelt steg å gi service principalen IWS bruker lov til å trigge workflows for et team.

For å sette opp en schedulert kjøring må følgende informasjon sendes til LinWin-teamet:
- Union prosjekt
- Union domain/miljø
- Navn på task
- Tidspunkt/frekvens som tasken skal kjøre