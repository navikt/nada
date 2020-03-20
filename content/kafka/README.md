---

# Kafka
## Hva er produktet?
[Kafka](https://kafka.apache.org) er en tjeneste som tilbyr mulighet for å publisere og abonnere på  hendelsesstrømmer. 
Kafka tilbyr både muligheten til å lese meldinger som har skjedd i fortid, og å abonnere på en fortløpende strøm av hendelser.

## Hva kan man bruke det til?


---
## Kom i gang
### Hvordan leser jeg meldinger?

#### Eksempel konsumenter
* [Java](consumers/java/README.md)
* [Kotlin](consumers/kotlin/README.md)

### Hvordan produserer jeg meldinger?

[Viktig informasjon](producers/README.md)

### Hvordan lager jeg ett topic?

[Hvordan lage/konfigurere topic](adminrest/README.md)

#### Eksempel produsenter
* [Java](producers/java/README.md)
* [Kotlin](producers/kotlin/README.md)

### Annen informasjon
* [AURA sine kafka sider](https://confluence.adeo.no/display/AURA/Kafka) - har dokumentert en del ting relatert til sikkerhet for Kafka i NAV
* [ATOM server oversikt](https://confluence.adeo.no/pages/viewpage.action?pageId=239339073) - miljøene er dokumentert her


### Hva må jeg tenke på når jeg lager ett topic på kafka?

#### Antall partisjoner

Hvis det viktigste er å kunne garantere rekkefølge så er det å opprette ett topic med en partisjon eneste måte å kunne 100% garantere rekkefølge. Dette kommer med en del drawbacks, blant annet at man ikke lenger kan skalere antall konsumenter ved behov. Det er kun én konsument som får lov til å konsumere en partisjon per `group.id`. Så hvis jobben per melding er stor og tung og man vil lese så mange meldinger som mulig, så er det riktige å opprette flere partisjoner.

En tommelfingerregel er at det er lettere å skalere antall partisjoner oppover enn nedover så ved opprettelse av ett topic så er det bedre å velge færre partisjoner enn for mange.

Confluent har en [artikkel](https://www.confluent.io/blog/how-choose-number-topics-partitions-kafka-cluster) om dette.



#### Instantieringsstrategi

Hvis man bare produserer en melding om gangen, og det går lang tid (10 sekunder+) mellom hver gang man produserer en melding, så lønner det seg nok å bruke eksempelet hvor man instantierer produsenten for hver melding man produserer, dette for å unngå å ha en åpen connection mot Kafka uten å egentlig ha behov for det. Hvis man derimot produserer en jevn strøm av meldinger, eller man jobber med Change Data Capture så kan det lønne seg å instansiere produsenten en gang og gjenbruke denne for meldingene man sender. Da slipper man å betale kostnaden for opprettelse av produsent og instansiering av serialisere for hver enkelt melding.



### Testing
* Bruk [EmbeddedKafka](testing/README.md) for integrasjonstesting. 
* Unit tester burde uansett kunne gjøres uavhengig av Kafka. 
  * For konsumenter så kan man teste at prosessering av en og en `ConsumerRecord` funker som forventet. 
  * For produsenter at man produserer meldingene man forventer, men man kan forutsette at `send()` kallet går bra.


## Trygghet - Sikkerhetsanalyser
### ROS
* [TryggNok - Kafka On-Prem](https://apps.powerapps.com/play/f8517640-ea01-46e2-9c09-b36b05013566?ID=252)
* [TryggNok - Tilgang til Kafka fra GCP](https://apps.powerapps.com/play/f8517640-ea01-46e2-9c09-b36b05013566?ID=229)
* [TryggNok - Aiven som leverandør](https://apps.powerapps.com/play/f8517640-ea01-46e2-9c09-b36b05013566??ID=190)
