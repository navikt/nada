Vi oppfordrer brukere av Knast maskiner å bruke [uv](https://github.com/astral-sh/uv) for oppsett av virtuelle python miljøer og installasjon av pakker. 
Under følger en oppskrift for å sette opp et slikt virtuelt miljø for å kunne kjøre python kode i en isolert kontekst.
For mer informasjon om `uv`, se [deres dokumentasjon](https://docs.astral.sh/uv/).

### Opprettelse et nytt virtuelt miljø med spesifisert python versjon 

!!!info "Merk for å installere en annen python versjon må `github.com/indygreg/python-build-standalone/releases/download/*` allowlistes for Knast maskinen i [datamarkedsplassen](https://data.ansatt.nav.no/user/workstation)"

```bash
# Setter opp et nytt venv og installerer python 3.11
uv venv --python 3.11 myvenv

# Aktiverer det virtuelle miljøet i gjeldende shell
source myvenv/bin/activate
```

### Låsing og installasjon av avhengigheter i virtuelt miljø

Tar her utgangspunkt i at bruker har en requirements fil som heter `requirements.in` som inneholder en liste over avhengighetene det er behov for.

```bash
# Låser avhengigheter og lagrer i requirements.txt
uv pip compile requirements.in -o requirements.txt

# Installerer avhengigheter fra requirements.txt
uv pip sync requirements.txt
```

### Bruke det virtuelle miljøet i en notebook kontekst

Når du har opprettet et virtuelt miljø med `uv` over vil ikke dette umiddelbart kunne velges som kernel i en notebook. 
For å kunne velge det nylig opprettede virtuelle miljøet må du enten restarte Knast maskinen fra [datamarkedsplassen](https://data.ansatt.nav.no/user/workstation) eller følge stegene under:

1. Åpne opp command pallette i VSCode med `Cmd+Shift+P` for Mac eller `Ctrl+Shift+P` for Windows
2. Skriv inn `Python: Select Interpreter`
3. Under `Select Interpreter` velg `Enter interpreter path` og så `Find`
4. Skriv så inn absoulutt sti til det virtuelle miljøets python binær fil. I eksempelet over vil dette være `/home/user/myvenv/bin/python`

Etter dette vil du kunne velge det virtuelle miljøet som kernel i en notebook.
