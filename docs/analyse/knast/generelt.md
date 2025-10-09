# Om Knast
Knast er ditt eget personlige utviklingsmiljø for analyse og behandling av data som bygges på toppen av [Cloud Workstations](https://cloud.google.com/workstations) i GCP. Med Knast kan du både jobbe i din foretrukne IDE i browser eller remote via din lokale VSCode eller Jetbrains IDE. Alt av oppsett rundt Knast styres fra "Min Knast" på Datamarkedsplassen. 


Hver Knast kjører i et felles workstations-cluster i prosjektet knada-gcp og har derfor tilgang til datakilder on-prem på linje med de andre tjenestene i KNADA, men du må selv oppgi hvilke kilder og URLer du skal snakke med. [Les mer om nettverk her](./nettverk.md).

# Sikker jobbing med skarpe data
Når du jobber med skarpe data, så er det viktig å tenke sikkerhet hele veien.

* **Tjenestelig behov**: Du (og koden din) skal kun ha tilgang til data og ressurser som er nødvendige for å utføre jobben.
* **Least privilege**: Minimer rettigheter for både brukere og systemer. Jo færre rettigheter, jo mindre skade hvis noe går galt.
* **Dataminimering**: Samle inn og behandle kun den mengden data som er nødvendig for formålet. Unngå å lagre detaljer på data som ikke trengs.
* **Logger**: Unngå at sensitive data havner i logger. Masker eller fjern personopplysninger.
* **Redusere konsekvens**:Tenk gjennom hva som skjer hvis passord, nøkler eller data kommer på avveie, eller hvis koden manipuleres.
    * Begrense oppbevaringstid.
    * Aggreger eller anonymiser data før de forlater godkjent behandlingsflate.
    * Ikke dele data videre uten godkjenning.
* **Redusere** sannsynliget: Gjør det vanskelig for angrep å lykkes:
    * Begrens åpninger mot internett mest mulig.
    * Hold kode og tredjepartsbiblioteker oppdatert.
    * **Vær obs på fremmed kode**: Sjekk kilde, sikkerhetsstatus og oppdateringer før bruk.
* **Git**: API-nøkler, passord og personopplysninger må aldri pushes til GitHub.
* **Lagring**: Ikke last ned skarpe data til din PC, ikke lagre dem permanent i Knast, eller på uautoriserte flater utenfor Navs kontroll.
* **Arbeidsform**:
    * Unngå å jobbe med skarpe data i åpne landskap eller offentlige områder.
    * Vær bevisst på omgivelsene dine, det skal ikke være mulig for andre å se eller høre sensitiv informasjon.
    * Ved parprogrammering eller annet samarbeid: sjekk at alle involverte har tjenstelig behov.
