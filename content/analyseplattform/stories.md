# Stories for dataplattform

## 1. Finne data
### Hva ønsker jeg å gjøre?
Jeg trenger å finne ut hvilke data vi har som beskriver et gitt område, og hvilke egenskaper disse dataen har.

### Hvordan forventer jeg å kunne gjøre det?
Jeg forventer å kunne søke med fritekstsøk i listen over eksisterende data i organisasjonen.

### Eksempelcase
Som analytiker på PO Helse ønsker jeg å vite om vi har noe data som beskriver hvilke tiltak som har blitt besluttet i dialogmøter. Dersom dette datasettet finnes ønsker jeg å vite hva datasettet inneholder, hvem som har laget det, til hvilket formål det er laget, når det sist ble oppdatert, se datakvalitetsmål på datasettet og finne ut hva jeg må gjøre for å få tilgang til det. 

## 2. Ad hoc spørring
### Hva ønsker jeg å gjøre?
Som analytiker, leder eller nysgjerrig medarbeider med litt teknisk kompetanse ønsker jeg på kort varsel finne svar på et spørsmål ved å grave i data.

### Hvordan forventer jeg å kunne gjøre det?
1. Søke gjennom både eksisterende tilrettelagte datasett samt rådata for å finne de datasettene som jeg tror inneholder nyttige data for det jeg lurer på.
2. Gjøre SQL-aktige spørringer mot datasettene jeg har funnet, herunder spørringer som kobler sammen flere datasett.

### Eksempelcase
I forbindelse med testing av edgecaser for en applikasjon lurer jeg på hvor mange samtidige arbeidsforhold det går an å ha. Jeg ønsker å finne et datasett som beskriver arbeidsforhold (antatt et datasett med opphav i AA-reg) og kjøre en spørring av typen ```SELECT MAX(n) FROM (SELECT COUNT(*) n FROM arbeidsforhold GROUP BY x,y,z)```. 


## 3. Ad hoc analyse i notebook
### Hva ønsker jeg å gjøre?
Som analytiker ønsker jeg å beskrive et fenomen ved å sette sammen og analysere data. Jeg ønsker å gjennomføre analysen i et notebook-verktøy siden dette er noe jeg er kjent med fra før av, og siden dette egner seg godt til å både analysere data i og til å dele resultater fra.

### Hvordan forventer jeg å kunne gjøre det?
1. Søke gjennom både eksisterende tilrettelagte datasett samt rådata for å finne de datasettene som jeg tror inneholder nyttige data for det jeg lurer på.
2. Laste datasett jeg har funnet inn i en notebook (Jupyter, for eksempel) slik at jeg kan gjennomføre analysen min der.

## 4. Dele notebooks med andre i og utenfor organisasjonen
### Hva ønsker jeg å gjøre?
Gitt at jeg har laget en analyse i en notebook (Jupyter, for eksempel) ønsker jeg å kunne dele funnene mine med andre på en måte som viser både fremgangsmåte og resultat.

### Hvordan forventer jeg å kunne gjøre det?
Jeg forventer å kunne dele notebooken i to ulike moduser:
Modus 1: Statisk (logikk og resultatceller delt men kan ikke endres)
Modus 2: Interaktiv (notebooken er påkoblet datakildene og cellene kan kjøres / logikken kan endres av de jeg deler med)

## 5. Lage og dele utledet datasett / feature engineering

## 6. Lage og dele visualisering basert på eksisterende datasett

## 7. Sikre at jeg har lov til å gjennomføre analyse / behandle data / dele resulater / dele data

## 8. Lage og schedulere jobber som utleder metrikker (ETL-jobber)

## 9. innsiktsarbeid
### Hva ønsker jeg å gjøre?
Som analytiker ønsker jeg å finne data jeg ønsker analysere på ett sted hvor jeg kan koble de til andre data på en enkel måte med mitt prefererte verktøy. 

### Hvordan forventer jeg å kunne gjøre det?
1. Koble meg på en felles dataplattform hvor alle data ligger med enkle måter å koble de sammen på.
2. Gjøre SQL-aktige spørringer mot datasettene jeg har funnet, herunder spørringer som kobler sammen flere datasett.

### Eksempelcase
II forbindelse med arbeid rundt verdiforslag knyttet til pleiepenger, ligger dataene i SAS. Jeg ønsker ikke analysere de i SAS men få de over på Oracle i en sandkasse så jeg kan finne den innsikten jeg trenger. 
