# Teamkatalog 


## Hva er produktet?
Teamkatalogen gir en oversikt over alle leveranseteam i NAV og deres tilhørighet til et produktteam. Katalogen er p.t. under utvikling, og kommer i en tidlig MVP-versjon i mars 2020. Løsningen skal, når den er populert med data, bli NAVs master for teamoversikt.

**Hensikten** med Teamkatalogen er å gi en pålitelig og oppdatert masteroversikt over alle leveranseteam i NAV. Løsningen tilbyr også API-er som gjør det mulig for andre applikasjoner å slå opp teams i sine løsninger.

## Hva kan man bruke det til?
I første MVP skal løsningen kunne brukes for å få svar på:
* Hvilke team har vi NAV?
* Hvilke team hører under et gitt produktområde?
* Hva jobber et gitt team med?
* Hvordan komme i kontakt med teamet, f.eks. slackkanal for teamet?

I neste leveranse vil løsningen integreres mot NOM, så den vil også inneholde ansatte og konsulenter i et gitt team, og kan da svare på spørsmål som:
* Hvilke teammedlemmer har et team?
* Hvem er teamleder for et team?


## Hvordan komme i gang?
Løsningen krever foreløpig at du må åpne en nettleser som kan åpne interne applikasjoner. Gå inn på Start/NavApplikasjoner og åpne en nettleser der. Deretter kan du lime in lenkene under til løsningen. (Vi jobber med å åpne opp så løsningen er lettere tilgjengelig)

I første MVP vil løsningen være åpen for redigering fra alle i NAV. Dette for å sikre en kollektiv dugnad for å populere den med riktig informasjon. 

**Produksjon**
[Teamkatalogen](https://teamkatalog.nais.adeo.no) - Kommer i løpet av mars 2020.

**Test / Preprod**
Alle i NAV har både les- og skrivtilgang til løsningen i preprod: [Teamkatalogen (Test)](https://teamkatalog.nais.preprod.local)


## Kontaktinformasjon
Team datajegerne har utviklet og forvalter løsningen. Du kan nå oss på slack [#datajegerne](https://nav-it.slack.com/archives/CG2S8D25D)


## Litt om arkitektur
TODO



### Lenker til API og repo
* [Swagger API (Test)](https://teamkatalog-api.nais.preprod.local/swagger-ui.html)

* [Repo](https://github.com/navikt/team-catalog)

## Overordnet roadmap - hva kommer før sommeren?
* Integrasjon mot NOM for å få oversikt over ansatte og konsulenter. Funksjonalitet for å knytte personer og teams. 
* Kontinuerlig forbedring i brukeropplevelse
* Antagelse: flere nivå tilgangskontroll og roller for hvem som kan editere hva. Ytterligere felter for å bedre kunne spille sammen med Agresso mm. (Tanker fra svært tidlig fase, vil måtte bearbeides med aktuelle behovsstillere når MVP1 og MVP2 er ferdig)

