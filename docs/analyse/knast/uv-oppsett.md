Vi oppfordrer brukere av Knast maskiner å bruke [uv](https://github.com/astral-sh/uv) for oppsett av virtuelle python miljøer og installasjon av pakker. 
Under følger en oppskrift for å sette opp et slikt virtuelt miljø for å kunne kjøre python kode i en isolert kontekst.
For mer informasjon om `uv`, se [deres dokumentasjon](https://docs.astral.sh/uv/).

### Opprettelse et nytt virtuelt miljø med spesifisert python versjon 

!!!info "Merk for å installere en annen python versjon må `github.com/indygreg/python-build-standalone/releases/download/*` allowlistes for Knast maskinen i [datamarkedsplassen](https://data.ansatt.nav.no/user/workstation)"

```bash
# Setter opp et nytt venv og installerer python 3.11
uv venv --python 3.11

# Aktiverer det virtuelle miljøet i gjeldende shell
source .venv/bin/activate
```

### Låsing og installasjon av avhengigheter i virtuelt miljø

Tar her utgangspunkt i at bruker har en requirements fil som heter `requirements.in` som inneholder en liste over avhengighetene det er behov for.

```bash
# Låser avhengigheter og lagrer i requirements.txt
uv pip compile requirements.in -o requirements.txt

# Installerer avhengigheter fra requirements.txt
uv pip sync requirements.txt
```
