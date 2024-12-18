## Sette opp nbstripout i notebook
> nbstripout er et verktøyet som sørger for at output celler i Jupyter notebooks utelates fra Git commits.

For å unngå at output celler fra Jupyter notebooks blir pushet sammen med kode til Github anbefaler vi å installere [nbstripout](https://github.com/kynan/nbstripout).
Dette verktøyet må installeres alle stedet du har repoet sjekket ut.

For å ta dette i bruk i din notebook:

- `pip install nbstripout --user`
- Kjør kommandoen `nbstripout --install --global` fra repoet ditt lokalt

## Autentisering mot GCP

Vi anbefaler alle å lære seg å bruke sin personlige bruker fra Jupyter notebooks, dette for å sikre seg at man bruker kun de tilgangene man selv skal ha.

### Personlig bruker

1. I notebooken, åpne en terminal
2. Kjør kommandoen `gcloud auth login --update-adc`
3. Gå til lenken som vises i terminalen og logg inn med NAV-bruker
4. Etter at du har logget inn kopierer du verifikasjonskoden du får inn i terminalen

Etter å ha utført stegene over vil du i din notebook kunne jobbe med dine private Google credentials mot kilder.
Denne tilgangen er kun midlertidig, og man må gjøre dette hver dag.

### Service account

!!! warning
    Dette gjelder kun for [managed notebooks](./managed-notebook.md).
    Bruker du [KNADA notebook](./knada-notebook.md), se autentisering med [personlig bruker](#personlig-bruker).

En fersk [managed notebook](./managed-notebook.md) vil automatisk autentisere seg mot GCP-tjenester med service accountens credentials.
Det betyr at man er tilkoblet GCP med en service accounten ut av boksen når man starter opp en notebook.
Bruker du denne service accounten, så er det denne brukeren som må få tilgang til kildene du skal snakke med.

Hvis du på et tidspunkt har logget på GCP med din personlige bruker fra notebooken, og har behov for å bytte tilbake kan du følge oppskriften nedenfor.

1. Sjekk hvilken bruker som er aktiv med `gcloud auth list`.
2. Hvis det er din personlige, velg service accounten ved å kjøre `gcloud config set account <eposten til service accounten din>`.
3. Fjern tilgangen til din personlige bruker ved å kjøre `gcloud auth application-default revoke --account <din personlige nav-epost>`.

## Tilpasse Oracle connector for raskere spørringer

Ved å justere `arraysize` og `prefetchrows` kan spørringer mot Oracle databaser onprem forbedres markant!
Se dokumentasjonen til [oracledb-biblioteket](https://python-oracledb.readthedocs.io/en/latest/user_guide/tuning.html) for mer informasjon.

## Jupyter extensions

Du kan installere extensions til Jupyter selv på samme måte som du installere Python pakker.
Etter man har installert en extension må du [stoppe notebooken og starte den på nytt](./knada-notebook.md#restarte-server).

Eksempel for `Git-extension` i KNADA:

```
pip install --upgrade jupyterlab jupyterlab-git --user
```

## Bruk av Github Advanced Security og Dependabot for notebook servere

!!!warning "Dependabot støtter per i dag _ikke_ R, denne oppskriften funker kun for de som bruker kun språkene Ruby, JavaScript, Python, PHP, Dart, Elixir, Elm, Go, Rust, Java og .NET."

Vi oppfordrer Jupyter notebook brukere til å ha en `requirements.txt` fil med Python-bibliotekene som dere selv bruker i et Github-repo.
Alle repoer i `navikt` har automatisk aktivert [Github Advanced Security inkludert Dependabot](https://docs.github.com/en/get-started/learning-about-github/about-github-advanced-security).
For å enable security scan av en requirements.txt fil, må man lage en `dependabot.yml` fil i repoet under mappen `.github`, altså:
```
.github
└── dependabot.yml
requirement.txt
```

Under er et eksempel på en slik fil som vil scanne en requirements.txt fil på rotnivå i repo ukentlig:
```yaml
version: 2
updates:
  - package-ecosystem: "pip"
    directory: "/"
    schedule:
      interval: "weekly"
    groups:
      pip:
        patterns:
        - '*'
```
Bruker man dette vil man få varsler om sårbarheter i bibliotekene som er i bruk, samt at det automatisk blir generert pull requests i repoet med versjon av biblioteket hvor sårbarheten er fikset.

Dersom man bygger egne Dockerimages for Jupyter eller Airflow tilbyr Dependabot også automatisk scanning etter sårbarheter for disse.

En kan også aktivere [CodeQL](https://docs.github.com/en/code-security/code-scanning/automatically-scanning-your-code-for-vulnerabilities-and-errors/about-code-scanning-with-codeql) for repoet som analyserer koden din og genererer alerts ved sårbarheter.
[Se her for informasjon om oppsett av CodeQL](https://docs.github.com/en/code-security/code-scanning/automatically-scanning-your-code-for-vulnerabilities-and-errors/configuring-code-scanning-for-a-repository#configuring-code-scanning-automatically).

## Autentisering mot Github

Det finnes flere måter å autentisere seg mot Github, men vi anbefaler å enten bruke SSH-nøkler eller fine-grained personal access tokens (PAT).

Er du usikker på hva du trenger så anbefaler vi at du starter med fine-grained PAT med en varighet på 7 dager.
Da har du nok tid til å utforske Jupyter, men ingen risiko for at dine tilgangsnøkler blir liggende til evig tid på Jupyter hvis du glemmer å rydde opp.

## SSH-nøkkel

Ved å bruke SSH-nøkler så lager man et nøkkelpar, hvor Github får din offentlige nøkkel, og man har sin private nøkkel lagret i Jupyter notebooken sin.
Vi anbefaler på det sterkeste å ha en egen nøkkel for Jupyter, da kan man enkelt trekke tilbake tilgangen hvis den blir slettet, eller havner på avveie.

Du kan følge Github sin [Generating a new SSH key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent#generating-a-new-ssh-key), eller kjørende kommandoen nedenfor.
Vi anbefaler å bruke passord på SSH nøkkelen, dette er påkrevd for SSH-nøkler på lokal maskin.

```
ssh-keygen -t ed25519 -C "din_epost_email@nav.no"
```

Etter at du har generet et eget nøkkelpar må du legge den offentlige delen inn hos Github.
Du kan følge Github sin [Adding a new SSH key to your account](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account#adding-a-new-ssh-key-to-your-account), eller gå direkte til [SSH and GPG keys](https://github.com/settings/keys), og trykke på `New SSH key`.

Etterpå kan du bruke `git` som vanlig og klone ned med `SSH`-adressen (git@github.com:navikt/ditt-repo.git).

!!! info
    SSH-nøkler må ligge i katalogen `~/.ssh` og kun lesbar av deg.
    Sette filrettigheter med `chmod 600 ~/.ssh/id_ed25519`.

### Whitelisting av port 22 mot Github

Som default så har vi kun lagt til brannmuråpning mot Github på port 443. Du kan enten legge til en åpning mot 
Github på port 22, eller følge denne guiden: https://docs.github.com/en/authentication/troubleshooting-ssh/using-ssh-over-the-https-port

## Fine-grained PAT

Personal access tokens brukes for å lage et token med en bestemt varighet, som gir alle som har ditt token mulighet til å koble seg til Github.
Med fine-grained tokens kan man spesifisere mer detaljert hva man skal ha tilgang til, for eksempel spesifisere hvilke Github repo man skal ha tilgang til.

Gå til [New fine-grained personal access token](https://github.com/settings/personal-access-tokens/new) for å komme i gang.
Merk at du vil ikke kunne hente ut en PAT etter den har blitt generert, så hvis du mister den så er det bare å rotere tokenet.

For å bruke PAT i Jupyter kan du opprette filen `.netrc` i ditt hjemmeområde i Jupyter med følgende innhold:

```
machine github.com login <PAT>
```

Etterpå kan du bruke `git` som vanlig og klone ned med `HTTPS`-adressen (https://github.com/navikt/ditt-repo.git)
