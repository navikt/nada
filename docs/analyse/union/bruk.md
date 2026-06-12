

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

For hvert miljø i prosjektet ditt lager du et manifest (fil) av type `UnionTeamServiceAccounts` slik som beskrevet under. Dette oppretter og gir tilgang til service accountene:

### Eksempel på manifest

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

Når dette deployes vil dette skje:

- Det opprettes 2 service accounts i Kubernetes (sa1 og sa2)
- For hver av disse opprettes det også en Google service account
- Disse kan få tilgang til Google-tjenester som BigQuery og Storage buckets. Dette må foreløpig settes opp manuelt av plattformteamet
    - Ta kontakt på #dataplattform for dette.
- Du kan koble service account til en Union task.

Når en task bruker en service account, får den:

- tilgang til Google-tjenester den har fått tildelt
- tilgang til hostene definert i `internalAllowlist` og `externalAllowlist`.

Manifestet kan deployes ved hjelp av vår felles github action [navikt/union-config](https://github.com/navikt/union-config) som tar som input manifest filen over med input parameteren `manifest`.
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

