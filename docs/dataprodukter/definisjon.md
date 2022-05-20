### Data som produkt 
Data som produkt betyr at data i størst mulig grad skal dekke behovene til de produktet er ment for.
Behovene vil variere. 
For offisiell arbeidsmarkedsstatistikk er det kritisk at dataene er tilstrekkelig kvalitetssikret.
For å analysere om den siste endringen i applikasjonen medførte en klagestorm til kontaktsenteret, kan det være tilstrekkelig å vite at det har vært en stor økning i henvendelser.
Et dataprodukt, slik det er beskrevet [her](https://martinfowler.com/articles/data-monolith-to-mesh.html#DomainDataAsAProduct), har seks egenskaper.
Det må kunne:

- ...lokaliseres enkelt. Dette innebærer at det tages og beskrives riktig
- ...leses enkelt med en tilgjengelig adresse. Foreløpig har vi bare BigQuery-tabeller, og det vil ligge en adresse til tabellen i markedsplassen
- ...stoles på. Datakvalitet må defineres, ivaretas og kommuniseres **tilstrekkelig**
- ...være selv-beskrivende. Dette innebærer alt fra å vise eksempler på hvordan produktet brukes til å beskrive de enkelte feltene i skjemaene
- ...brukes sammen med andre dataprodukter der det er behov. Dette innebærer blant annet standarder for koblingsnøkler og definisjoner som går på tvers av team i de tilfeller der det er behov
- ...brukes på en trygg måte. Dette betyr at kun personer som skal ha tilgang til data, får dette

Det er viktig å understreke at behovene vil variere.
En viktig forutsetning for å lykkes med dette, som med annen produktutvikling, er å få til en god dialog mellom konsumenter og produsenter.

### Vår definisjon
Vi definerer et dataprodukt som:

- Metadata: Beskrivelser av dataproduktet, tags, beskrivelser av felter, etc.
- Koden som produserer datasettene
- 1-n `datasett`
- 0-m `visualiseringer`

`datasett`: Foreløpig er dette BigQuery-tabeller

`visualiseringer`: Datafortellinger/metabase-dashboards knyttet til dataproduktet som produsenten ønsker å ha med.
Vi jobber med å få datafortellinger inn som del av beskrivelsen av selve dataproduktet på markedsplassen.

