# Pseudonymisering for å beskytte PII i forbindelse med analyse, rapportering og statistikk produksjon på tvers av domener

## Status

Mange systemer bruker personummer som nøkkel for personrelatert informasjon. Andre systemer bruker systemspesifikke eller tverrgående pseudonøkkler. Eksempelvis fk_x i datavarehuset.

## Kontekst

I arbeid med analyse, rapportering og statistikk produksjon på tvers av domener er det behov for en felles koblingsnøkkel eller en annen form for mekanisme som gjør det mulig å koble data på tvers av nøkkler/domener  

## Løsningsalternativer


### 1) Pseudonymisering ved import


![pseudonymisering utenfor domenet](adr_koblingsnøkkel_utenfor_domenet.png)

Eksempel 

select hash(a.personummer), a.yrke, b.bosted, c.arbeidssted 
from a.tabell a
join personummer, bosted from b.tabell on a.personummer = b.personummer
join select personummer, arbeidssted from 
(select k.personummer, c.arbeidsted 
from c.tabell
join c.koblingstabell on c.id = k.id)
) as c on a.personummer = c.personummer


Fordeler:

* Lite ressurskrevende

#### Ulemper:

* Det er mulig for analytikeren å se personummer med mindre import steget utføres av en tredjeperson

* Analytikeren har tilgang til hashing funksjon og kan dermed finne ut hvilken hashverdi som er knyttet til et kjent personnummer

* Kilder som idag bruker pseudonøkkler, eksempelvis datavarehuset må eksponere personummer.


### 2) Pseudonymisering i domenet


![pseudonymisering i domenet](adr_koblingsnøkkel_i_domenet.png)

Eksempel 

select a.id, a.yrke, b.bosted, c.arbeidssted 
from a.tabell as a
join id, bosted from b.tabell on a.id = b.id as b
join arbeidssted from c.tabell on a.id = c.id as c


#### Fordeler:

* Enkelt å koble data på tvers av domener

#### Ulemper:

* Alle domener må bruke den samme hashing/pseudonymisering funksjonen
* Ressurskrevende: Alle domener må levere 'data on the outside' i pseudonymisert format.


### 3) Eget miljø for analyse med pseudonymiserte kopier av data

Data gjøres tilgjengelig i et datavarehus/datalake

#### Fordeler:

* Enkelt å koble data på tvers av domener

#### Ulemper:

* Ressurskrevende


## Beslutning



## Konsekvenser

