---

# Kafka Connect
[Kafka connect](http://kafka.apache.org/documentation/#connect) er en plattform for strømming av hendelser fra Kafka til en mottaker (Sink), eller fra en kilde for data til Kafka (Source). 
I NAV så administrerer team NADA en installasjon ([nada-kafka-connect](https://github.com/navikt/nada-kafka-connect)), og repoet kan også brukes som ett template repo for team som ønsker sin egen installasjon.

## UI
Som en del av installasjonen, så deployes også kafka-connect-ui, som gir muligheten for grafisk drevet konfigurasjon av nye kilder/mottakere.
* [nada-kafka-connect-ui](https://nada-kafka-connect-ui.nais.preprod.local)

## Hvordan
[kommer - trenger skjermbilder fra kafka-connect-ui av registrerings skrittene]

## Fordeler
* Konfigurasjon av en ny sink er som oftest en copy paste av en tidligere sink, men bare bytte ut topicet man skal strømme til databasen

## Ulemper
* All konfigurasjon er kopierbar, som gjør at vi har ett behov for separate installsjoner for team; slik at tilganger ikke kan deles på tvers.  