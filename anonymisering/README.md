# Anonymisering

## Produkter
### Anonymization as a Service
Anonymization as a Service er resultatet av en bacheloroppgave, og senere et sommerstudentprosjekt, 
gjennomført av bachelorstudenter fra Institutt for informasjonsteknologi ved OsloMet i samarbeid med NAV IT. 
Prosjektgruppen har utviklet en løsning som forenkler formell anonymisering og tallfesting av 
re-identifikasjonsrisiko. Løsningen bygger videre på det etablerte anonymiseringsverktøyet 
[ARX](https://arx.deidentifier.org/), som er populær blant institusjoner som driver med deling av forskningsdata. **Anonymization as a Service** prosjektet har siktet på å gjøre ARX tilgjengelig for et bredere publikum ved å gjøre kjernefunksjonalitet tilgjengelig som en mikrotjeneste med klienter/programpakker tilpasset for ulike brukergrupper. Brukergruppene som prosjektgruppen har fokusert på har vært data scienctist og data managers i NAV IT.
Prosjektet har særlig vektlagt behovene som oppstår i arbeidsprosessen til data scientister i NAV IT, 
og gjør således etablert anonymiseringsmetodikk lettere tilgjengelig i Python og Jupiter Notebooks (se [PyARXaaS](https://github.com/navikt/PyARXaaS)).
Koden og prosjektrapporten er åpent tilgjengelig under MIT lisens.

- [ARXaaS](https://github.com/navikt/ARXaaS)
  Kjernetjenesten. En "Anonymisering mikrotjeneste" som tilgjengeliggjør funksjonalitet for anonymisering som HTTP REST APIer.
- [PyARXaaS](https://github.com/navikt/PyARXaaS)
  Python bibliotek for enkel integrasjon med ARXaaS APIene. 
- [WebARX](https://github.com/navikt/webarx-poc)
  En Wepapplikajson som leverer et forenklet GUI for anonymisering. Applikasjonen utnytter APIene til ARXaaS.

#### Hva kan man bruke det til?
Se [ARX dokumentasjonen som AaaS bygger på for mer informasjon](https://arx.deidentifier.org/overview/)
ARXaaS/PyARXaaS/WebARX tilbyr re-identifikasjon risikovurdering av tabulære datasett samt effektiv anonymisering av datasettet med en rekke ulike anonymiseringsmetodikker som k-anonymiet, l-diversity m.m. Dette gir altså bruker mulighet til å få en objektiv vurdering av re-identifikasjon risikometrikker forbundet med datasettet, samt funksjonalitet for å redusere  risikoen. Anonymiseringen er del-automatisert og baserer seg på brukerdefinerte krav/parametre i tillegg til å anonymisere prøver ARXaaS(gjennom ARX) alltid å minimerere informasjonstapet. Bruker slipper derfor å bruke unødvendig tid på prøving og feiling.


#### Kontaktinformasjon
Slack: #dataplattform

Epost: Dataplattform@nav.no

#### Hvordan komme i gang?
For å komme i gang med å bruke **Anonymization as a Service**:
1. Bekreft at datasettet som skal anonymiseres støttes av ARX (En rad er en entitet, bare en rad pr entitet osv. Ta kontakt om usikker [Kontaktinformasjon](#kontaktinformasjon))
2. ARXaaS tjenesten er tilgjengelig i [prod-fss](https://anonymiserer.nais.adeo.no) og [dev-fss](https://anonymiserer.nais.preprod.local). ARXaaS kan også settes opp lokalt, enten ved å kjøre applikasjonen som en Java JAR eller ved å bruke Docker image. Se [ARXaaS](https://github.com/navikt/ARXaaS) for dokumentasjon av oppsett.
3. Utnytt en av klient/programpakke løsningene eller gjør direkte kall mot ARXaaS.
    - **Bruk WebARX** WebARX er tilgjengelig på [prod-fss](https://webarxaas.nais.adeo.no) og [dev-fss](https://webarxaas.nais.preprod.local).
    - **Bruk PyARXaaS** Se dokumentasjon for bruk av PyARXaaS her: [PyARXaaS](https://github.com/navikt/PyARXaaS). For å bruke PyARXaaS må du ha en fungerende URL til ARXaaS. for å nå instansen på dev-fss eller prod-fss må du derfor bruke *Utvikler image* om du skal scripte en Jupyter notebook eller lignende. NAIS-applikasjoner når ARXaaS som vanlig.
    - **Direkte kall mot ARXaaS** ARXaaS er en *stateless* mikrotjeneste med REST APIer. Se dokumentasjonen på [ARXaaS](https://github.com/navikt/ARXaaS) for beskrivelse av APIene.


#### Link til ROS
[ROS for Anonymization as a Service](https://apps.powerapps.com/play/f8517640-ea01-46e2-9c09-be6b05013566?ID=126)

#### Arkitektur
![AaaS arkitektur diagram](resources/AaaS-arkitektur.png)

#### Annen dokumentasjon
- Publikasjonssiden til ARX inneholder mange artikler som omhandler anonymisering og anonymiseringsteknologi: https://arx.deidentifier.org/publications/
- Bachelorrapporten for ARXaaS prosjektet: https://oslomet-arx-as-a-service.github.io/resources/Anonymization_as_a_Service_Thesis.pdf

#### Roadmap
Det er for øyeblikket ikke planlagt videreutvikling av AaaS, bortsett fra oppdateringer, avhengigheter og andre 
sikkerhetsrelaterte oppdateringer.
