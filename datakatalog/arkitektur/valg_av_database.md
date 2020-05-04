# Velge database for datakatalogene

## Status

For lagring av metadata bruker datakatalogene i dag en graf datamodell implementert i PostgreSQL.
Databasen oppdateres via et [API implementert i Python](https://github.com/navikt/data-catalog-graph).

## Kontekst

Det er ressurskrevende å utvikle gode spørringer i SQL samt å drifte databasen og garantere respons og oppetid. 

Azure og AWS tilbyr begge grafdatabaser som en tjeneste og støtter begge den åpne Apache TinkerPop standarden. 
Ved å basere oss på et åpen standard spørrespråk står vi fritt til å kunne bytte leverandør - eller velge å drifte databasen selv - på et senere tidspunkt.    

## Beslutning

Vi ønsker å bruke en skybasert dataserver. Da NAV har avtale med Azure velger vi i inntil videre å bruke Cosmos DB.

## Konsekvenser

Vi vil frigjøre interne ressurser fra utvikling og drift av database. På den annen side vil vi få en løpende lisenskostnad. Lisenkostnaden er volumavhengig. 

Vi må gjennomføre ROS

Vi trenger hjelp av plattformteamet for å få tilgang til å bruke og CosmosDB. Det er muligens også behov for brannmuråpninger.

Vi må utvikle et nytt API. Repo for det nye API'et finnes [her](https://github.com/navikt/data-catalog-api). 
