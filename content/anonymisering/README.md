# Anonymisering

## Produkter
### Anonymization as a Service
Anonymization as a Service er resultatet av en bacheloroppgave, og senere et sommerstudentprosjekt, 
gjennomført av bachelorstudenter fra Institutt for informasjonsteknologi ved OsloMet, i samarbeid med NAV IT. 
Prosjektgruppen har utviklet en løsning som forenkler arbeidet med formell anonymisering og tallfesting av 
re-identifiseringsrisiko. Løsningen bygger videre på et etablert anonymiseringsverktøy fra 
[ARX](https://arx.deidentifier.org/) prosjektet, ARX er populær blant institusjoner som driver med deling av forskningsdata, men har gjort verktøyet tilgjengelig for et bredere publikum ved å gjøre kjernefunksjonalitet tilgjengelig som en mikrotjeneste med klienter/programpakker tilpasset for ulike brukergrupper. 
Prosjektet har særlig vektlagt behovene som oppstår i arbeidsprosessen til data scientister i NAV IT, 
og gjør således etablert anonymiseringsmetodikk lettere tilgjengelig i Python og Jupiter Notebooks.
Koden og prosjektrapporten er åpent tilgjengelig under MIT lisens.

- [ARXaaS](https://github.com/navikt/ARXaaS)
  Kjernetjenesten. En "Anonymisering mikrotjeneste" som tilgjengeliggjør funksjonalitet for anonymiering som HTTP REST APIer.
- [PyARXaaS](https://github.com/navikt/PyARXaaS)
  Python bibliotek for enkel integrasjon med ARXaaS APIene. 
- [WebARX](https://github.com/navikt/webarx-poc)
  En Wepapplikajson som leverer et forenklet GUI for anonymisering til bruker. Applikasjonen utnytter APIene til ARXaaS.

#### Hva kan man bruke det til?
Se [ARX dokumentasjonen som AaaS bygger på for mer informasjon](https://arx.deidentifier.org/overview/)
ARXaaS/PyARXaaS/WebARX tilbyr re-identifikasjons risikovurdering av tabulære datasett samt effektiv anonymisering av datasettet med en rekke ulike anonymiseringsmetodikker. Dette gir altså bruker mulighet til å få en objektiv vurdering av risikometrikker forbundet med datasettet, samt funksjonalitet for å redusere denne risikoen. Anonymiseringen prosessen er del-automatiserer og baserer seg på brukerdefinerte krav, i tillegg til å anonymisere så prøver ARXaaS alltid å minimerere informasjonstapet. Bruker slipper derfor å bruke unødvendig tid på prøving og feiling. 

#### Hvordan komme i gang?
For å komme i gang med å bruke **Anonymizaiton as a Service**:
1. Bekreft at datasettet som skal anonymiseres støttes av ARX (her mener vi ikke filtypen med datamodellen til datasettet. Ta kontakt om usikker [Kontaktinformasjon](#kontaktinformasjon))
2. ARXaaS tjenesten er tilgjengelig i dev-fss og prod-ffs. Ta kontakt for link. ARXaaS kan også settes opp lokalt, enten ved å kjøre applikasjonen som en Java JAR eller ved å bruke Docker image. Se [ARXaaS](https://github.com/navikt/ARXaaS) for dokumentasjon av oppsett.
3. Utnytt en av klient/programpakke løsningene eller gjør direkte kall mot ARXaaS.
    - **Bruk WebARX** WebARX er tilgjengelig på prod-fss og dev-fss. Ta kontakt for link.
    - **Bruk PyARXaaS** Se dokumentasjon for bruk av PyARXaaS her: [PyARXaaS](https://github.com/navikt/PyARXaaS). For å bruke PyARXaaS må du ha en fungerende URL til ARXaaS. for å nå instansen på dev-fss eller prod-fss må du derfor bruke *Utvikler image* om du skal scripte en Jupyter notebook eller lignende. NAIS applikasjoner når ARXaaS som vanlig.
    - **Direkte kall mot ARXaaS** ARXaaS er en vanlig mikrotjeneste med REST APIer. Se dokumentasjonen på [ARXaaS](https://github.com/navikt/ARXaaS) for beskrivelse av APIene.


#### Kontaktinformasjon
Slack: #anonymisering

Epost: Anonymisering@nav.no

#### Link til ROS
[ROS for Anonymization as a Service](https://apps.powerapps.com/play/f8517640-ea01-46e2-9c09-be6b05013566?ID=126)

#### Arkitektur
![AaaS arkitektur diagram](resources/AaaS-arkitektur.png)

#### Annen dokumentasjon
- Publikasjons siden til ARX inneholder mange interessante artikler ang anonymisering: https://arx.deidentifier.org/publications/
- Bachelorrapporten for ARXaaS prosjektet: https://oslomet-arx-as-a-service.github.io/resources/Anonymization_as_a_Service_Thesis.pdf

#### Roadmap
Det er for øyeblikket ikke planlagt videreutvikling av AaaS, bortsett fra oppdateringer avhengigheter og andre 
sikkerhetsrelaterte oppdateringer.
