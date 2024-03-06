# Koble sammen pseudonymiserte views
I [Markedsplassen](https://data.intern.nav.no) er det mulig å tilrettelegge [pseudonymiserte tabeller](/dataprodukter/dele/dataprodukt/#pseudonymisering-av-datasett) for sammenkobling.
Du trenger tilgang til minst to pseudonymiserte tabeller registrert på [Markedsplassen](https://data.intern.nav.no).
Du spesifiserer hvilke tabeller du ønsker å koble sammen.
Du kan også velge å lage konsistente id-er for personer som har byttet fødselsnummer.
For de tabellene som inneholder fødselsnummer må du oppgi hvilken kolonne disse finnes i.
Tabellene slettes etter 21 dager, med mindre du velger noe annet.
Når du bestiller tabellene skjer følgende:

1. Et nytt `BigQuery-dataset` opprettes i et eget Markedsplassen-prosjekt i GCP. Du får tilgang til dette.
2. Markedsplassen generer en verdi som brukes i pseudonymiseringen
3. De opprinnelige tabellene som de pseudonymiserte tabellene er basert på leses av Markedsplassen
4. Konsistente id-er lages ved at vi kobler inn mapping-tabell (ikke påkrevd)
5. Markedsplassen pseudonymiserer kolonner som *produsentene* har merket som pseudonymiserte. SHA256 og den samme verdien for alle tabellene brukes i pseudonymiseringen.
6. View opprettes i `BigQuery-dataset`

Tilganger til vises under ["mine tilganger" på Markedsplassen](https://data.intern.nav.no/user/access).