---
title: Utviklingsprosess
---

# God praksis for utvikling og deploy i Union

Denne siden beskriver en anbefalt arbeidsflyt for utvikling, test og deploy av workflows i Union. Flyten er et utgangspunkt, ikke en fasit — juster stegene etter hvor kritisk workflowen er og hvor mye risiko teamet er komfortable med.

## Prinsipper

- **Development Domain** egner seg til hurtig iterasjon fra lokal kode mot en ufarlig base.
- **Staging Domain** bør kjøre første build fra reviewet kode.
- **Production Domain** bør helst kjøre samme signerte image digest som ble testet i staging.
- Image-byggingen skjer i Union-clusteret, ikke på utviklerens maskin.
- Den viktigste grensen går mellom *utviklingskode* og *reviewet kode*.

> For enkle eller lite kritiske workflows kan staging-steget hoppes over, og man går rett fra review til production. Jo høyere konsekvens en feil har, jo mer verdt er det å gå via staging.

```mermaid
flowchart LR
	A[Utvikle lokalt] --> B[Test iterativt i development]
	B --> C[Review og bygg image i staging]
	C --> D[Promoter samme image til production]
```


## Flyt for pipelineutvikling

Start med lokal kode og test endringer med `flyte run` mot `development`.

```mermaid
flowchart TD
	A[Skriv kode lokalt] --> B[Kjør enhetstester lokalt]
	B --> C[Send taskene til Union med flyte run]
	C --> D[Union bygger image i clusteret]
	D --> E[Sjekk resultater i Union control plane]
	E --> F{Fornøyd?}
	F -- Nei --> A
	F -- Ja --> G[Commit kode]
```

En typisk struktur kan være:

```text
.
├── workflow.py
├── pyproject.toml
├── tests/
│   └── test_workflow.py
└── README.md
```

Opprett et virtuelt miljø og legg inn de nødvendige avhengighetene i pyproject.toml. For et minimalt workflow-prosjekt holder det med `flyte` og `pytest`. Et godt utgangpunkt er denne [templaten](https://github.com/navikt/union-template). Følg instruksjonene i README for å komme i gang.

Før koden kjøres i Union bør den kunne importeres og testes lokalt. Hold selve task-funksjonene små, og flytt gjerne domenelogikk til vanlige Python-funksjoner som kan testes uten Union.

## Kjøre med `flyte run`

`flyte run` brukes for å kjøre workflowen fra lokal kode mot et Union-miljø. Kommandoen pakker koden, lar Union bygge image i clusteret, laster opp nødvendige artefakter og starter kjøringen i valgt domain.

```bash
flyte run --domain development workflow.py main
```

I `development` bør workflowen kjøres mot en tom base eller en base med syntetiske data. Det gir raskt iterering uten at GitHub blir en flaskehals samtidig som produksjonsdata holdes utenfor utviklingsloopen.

## Fra reviewet kode til staging

Når koden er committet og klar til deploy, sendes den til review med en pull request til et medlem av teamet. KI review i GitHub bør brukes for å fange opp åpenbare feil tidlig, men suppleres med peer review av en kollega før den godkjennes.

Etter godkjent review kjører en GitHub Action som bygger image på nytt fra reviewet kode og deployer til `staging`.

```mermaid
flowchart TD
	A[Commit kode] --> B[KI review i GitHub]
	B --> C[Peer review]
	C --> D{Godkjent?}
	D -- Nei --> E[Endre kode]
	E --> A
	D -- Ja --> F
	subgraph GitHub Action
		F[Start workflow]
		F --> G[Union bygger image fra reviewet kode]
		G --> H[Deploy til Staging Domain]
		H --> I[Kjør mot utviklings- eller testbase, for eksempel DVH-U, DVH-Q eller DVH-R]
		I --> J[Kjør tester]
	end
```

Staging er første gang workflowen bygges fra reviewet kode. Her bør workflowen kjøres mot en utviklings- eller testbase og valideres med relevante tester.

## Fra staging til production

Når testene i staging kjører grønt, signeres imaget og produksjon deployes med samme image digest som ble testet i staging.

```mermaid
flowchart LR
	A[Tester grønne i staging] --> B[Signer image]
	B --> C[Promoter samme digest]
	C --> D[Deploy til Production Domain]
	D --> E[Kjør etter definert skedulering]
```

Dette betyr at produksjon ikke bygger et nytt, uprøvd image. Produksjon kjører akkurat det som allerede er testet i staging.

## Miljøene

| Domain | Formål | Kode og image | Data |
| --- | --- | --- | --- |
| `development` | Hurtig iterasjon | Lokal utviklingskode, image bygget av Union | Tom base eller syntetiske data |
| `staging` | Verifisering etter review | Reviewet kode, nytt image bygget av GitHub Action og Union | Utviklings- eller testbase |
| `production` | Planlagt produksjonskjøring | Samme signerte digest som ble testet i staging | Produksjonsdata |

## Anbefalt progresjon

Dette er en fullstendig, trygg progresjon for kritiske workflows. Se varianten under for enklere endringer.

1. Utvikle og teste lokalt.
2. Kjør med `flyte run --domain development`.
3. La Union bygge image og kjøre workflowen i `development`.
4. Iterer til workflowen fungerer mot tom base eller syntetiske data.
5. Commit kode og åpne pull request.
6. Kjør KI review i GitHub.
7. Avslutt med peer review fra et teammedlem.
8. Kjør GitHub Action som bygger image på nytt fra reviewet kode.
9. Deploy til `staging` og kjør tester mot utviklings- eller testbase.
10. Signer imaget når staging er grønn.
11. Deploy samme image digest til `production`.
12. Kjør workflowen i produksjon etter definert skedulering.

### Lettere variant for små eller lite risikable endringer

1. Utvikle og teste lokalt, eventuelt med `flyte run --domain development`.
2. Commit og push kode (åpne evt pull request med peer review).
3. Deploy til `production`.

Velg variant ut fra konsekvensen av en eventuell feil og sensitiviteten til dataene — ikke ut fra vane.

## Sjekkliste før produksjon

Velg nivå ut fra hvor kritisk workflowen er.

**Minimal** (små, lav-risiko endringer):

- Kode og avhengigheter er versjonert.
- Deploy skjer fra en sporbar commit.
- Nødvendige service accounts og allowlisting er satt opp.
- Hemmeligheter hentes fra Secret Manager eller annen godkjent løsning.

**Anbefalt** (de fleste workflows):

- Workflowen kjører grønt i `staging`.
- Pull request er reviewet av både KI og teammedlem.


- Feil, retries og logging er håndtert.

**Strikt** (kritiske, sensitive eller endringstunge workflows):

- Alt i «Anbefalt», i tillegg til:
- Image digest fra staging er signert og brukes videre til production.
- Deploy skjer fra en sporbar image digest, ikke bare en sporbar commit.

## Feilsøking

Bruk denne sjekklisten for å finne feil raskere:

1. Avklar hvor feilen først oppstår:
	- Lokalt (tester/import feiler før deploy)
	- I GitHub Action (build/deploy feiler)
	- I Union-kjøring (task feiler i runtime)
2. Start alltid med den første feilmeldingen i loggen, ikke den siste.
3. Verifiser samme commit SHA gjennom hele kjeden: PR, GitHub Action, staging-kjøring.

Nyttige referanser når du feilsøker:

- Run modes (`flyte run` lokalt/devbox/remote): [Union run modes](https://www.union.ai/docs/v2/union/user-guide/run-modes/)
- Stabil deploy av versjonert kode: [Union user guide](https://www.union.ai/docs/v2/union/user-guide/)
- Task-oppsett (image, retries, timeout, resources, secrets): [Union task configuration](https://www.union.ai/docs/v2/union/user-guide/task-configuration/)
- Grunnleggende arbeidsflyt og konsepter: [Union overview](https://www.union.ai/docs/v2/union/user-guide/overview/)

| Symptom | Sjekk konkret | Tiltak |
| --- | --- | --- |
| Import- eller Python-feil lokalt | Kjør `pytest` lokalt og bekreft at workflow-filen kan importeres uten Union | Rett importsti, flytt sideeffekter ut av modulnivå, og lag ny commit |
| Build feiler i GitHub Action | Åpne Actions-loggen og finn steget som feiler (install, build eller deploy) | Lås versjoner i avhengigheter, rett manglende pakker, og kjør workflow på nytt |
| Feil image i staging | Sammenlign commit SHA i PR med SHA/image fra Actions-kjøringen | Deploy på nytt fra riktig commit; ikke bruk lokalt bygget image |
| Tilgangsfeil (403/permission denied) | Bekreft service account i task-oppsett, allowlisting og IAM-roller for miljøet | Oppdater service account/roller, deploy på nytt og kjør en ny test |
| Tester feiler i staging | Sjekk hvilke tester som feiler og om de bruker riktig testdata/base | Rett testdata/datakontrakt eller kode, og kjør ny staging-kjøring |
| Runtime-feil i Union-task | Åpne task-logger i Union control plane og finn eksakt task og input som feilet | Reproduser med samme input i development, fiks kode, og valider i staging |

Se [Oppsett](oppsett.md) for detaljer om konfigurasjon, service accounts og task-oppsett.
