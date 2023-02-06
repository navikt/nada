Vi ønsker å flytte ansvaret for produktutvikling av data til produktteamene, slik det er beskrevet i [data mesh-paradigmet](https://martinfowler.com/articles/data-mesh-principles.html).
For at dette skal lykkes, følger vi de fire prinsippene beskrevet:

#### I: Data som produkt
For at data skal kunne brukes til å løse NAVs samfunnsoppdrag på en bedre måte, må dataene være tilpasset behovene.
Teamene må derfor bruke erfaringen med produktutviklingen fra den operasjonelle verden over på data.
Dataproduktene må være mulig å:

- ...finne
- ...forstå
- ...stole på
- ...koble sammen
- ...innhente
- ...bruke på en sikker måte

På en måte som svarer til behov.
For eksempel vil et dataprodukt som kun brukes internt i et team gi verdi uten at det nødvendigvis er veldig godt dokumentert.
Produkutviklingen gjør at produktteamene klarer å tilpasse dataproduktene til behovene.

#### II: Domene-orientert eierskap til data
Eierskapet til data bør være plassert så nært kilden som mulig. 
Dette skyldes skyldes både at produktteamene har inngående kjenskap til å tilpasse produktet og at dette er en løsning som skalerer.
I NAV er vi så heldige at vi allerede er organisert i produktteam.
På data-området vil vi i størst mulig grad etterstrebe å følge denne modellen.
Samtidig ser vi at det vil være behov for f.eks. egne data-team som aggreger data fra flere produktteam.

#### III: Selvbetjent dataplattform
Skiftet vekk fra en sentralisert modell for produksjon av data flytter mye ansvar og arbeid over på produktteamene.
Mye av arbeidet vil være spesifikt for de forskjellige produktteamene.
Samtidig vil det være en del aktivitet som er felles for alle.
Deployment og overvåking av dataprodukter, registrering av dataprodukter i en søkbar katalog og tilgangskontroller er eksempler på dette.
For å redusere byrden på teamene og samtidig gjøre det enklere for brukerne å konsumere data, må det etableres en plattform som dekker dette.

Dokumentasjonen handler om denne plattformen.

#### IV: Desentralisert dataforvaltning
Vi har en grunnleggende tro på at produktteamene selv er best rustet til å ta valg for å tilby gode dataprodukter.
Vi erkjenner likevel at det oppstår situasjoner der teams tilpasninger ikke er optimale.
Dette kan være bevisste valg, der teamenes incentiver ikke harmonerer med organisasjonens.
Det kan også være ubevisste valg, enten som følge av mangel på koordinering eller spesifikk kompetanse.

For å korrigere for dette, har vi spilleregler på plattformen.
Disse utformes av aktører på plattformen i fellesskap.
Implementeringen av disse skal i størst mulig grad støttes i plattformen.