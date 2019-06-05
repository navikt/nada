---

# Kafka

---

## Viktig informasjon

[AURA sine kafka sider](https://confluence.adeo.no/display/AURA/Kafka) har dokumentert en del ting relatert til sikkerhet for Kafka i NAV

### Hva må jeg tenke på når jeg lager ett topic på kafka?

#### Antall partisjoner

Hvis det viktigste er å kunne garantere rekkefølge så er det å opprette ett topic med en partisjon eneste måte å kunne 100% garantere rekkefølge. Dette kommer med en del drawbacks, blant annet at man ikke lenger kan skalere antall konsumenter ved behov. Det er kun én konsument som får lov til å konsumere en partisjon per `group.id`. Så hvis jobben per melding er stor og tung og man vil lese så mange meldinger som mulig, så er det riktige å opprette flere partisjoner.

En tommelfingerregel er at det er lettere å skalere antall partisjoner oppover enn nedover så ved opprettelse av ett topic så er det bedre å velge færre partisjoner enn for mange.

Confluent har en [artikkel](https://www.confluent.io/blog/how-choose-number-topics-partitions-kafka-cluster) om dette.

### Hvordan leser jeg meldinger?

#### Eksempel konsumenter
* [Java](/content/kafka/consumers/java/README.md)
* [Kotlin](/content/kafka/consumers/kotlin/README.md)

### Hvordan produserer jeg meldinger?
### Viktige innstillinger for produsenter
#### Acks
Produsenter i Kafka kan konfigureres til å prioritere sikkert mottak av meldinger eller oppfattet ytelse fra produsent siden. Dette styres av innstillingen `acks`. Mere detaljer finnes på [Kafka doc -> Producer configs -> acks](https://kafka.apache.org/documentation/#producerconfigs). 
Kort oppsummert:
- Hvis det viktigste er å ikke blokkere produsent tråden, sett denne til `0`, da legger kafka til meldingen i socketbuffer og anser meldingen som sendt. Dette er den dårligste garantien for at meldingen faktisk kommer fram, all den tid dette utelukker å bruke `retries` for å prøve igjen hvis sendingen feiler.
- Hvis man vil ha en bekreftelse fra lederen av partisjonen på at meldingen er lagret lokalt, sett denne til `1`. -- Litt tregere, da man faktisk venter på ett remote kall
- Hvis man må vite at alle replikaer har sett og lagret meldingen så kan man sette denne til `-1` eller `all`, da blokker kallet til alle replikaer har acket.  -- Tregeste og tryggeste

#### Instantieringsstrategi

Hvis man bare produserer en melding om gangen, og det går lang tid (10 sekunder+) mellom hver gang man produserer en melding, så lønner det seg nok å bruke eksempelet hvor man instantierer produsenten for hver melding man produserer, dette for å unngå å ha en åpen connection mot Kafka uten å egentlig ha behov for det. Hvis man derimot produserer en jevn strøm av meldinger, eller man jobber med Change Data Capture så kan det lønne seg å instansiere produsenten en gang og gjenbruke denne for meldingene man sender. Da slipper man å betale kostnaden for opprettelse av produsent og instansiering av serialisere for hver enkelt melding.

#### Eksempel produsenter
* [Java](/content/kafka/producers/java/README.md)
* [Kotlin](/content/kafka/producers/kotlin/README.md)


### Testing
* Bruk [EmbeddedKafka](/content/kafka/testing/README.md) for integrasjons testing. Unit tester burde uansett kunne gjøres uavhengig av Kafka. For konsumenter så kan man teste at prosessering av en og en `ConsumerRecord` funker som forventet. For produsenter at man produserer meldingene man forventer, men man kan forutsette at `send()` kallet går bra.


