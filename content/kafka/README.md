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

* [Java](/content/kafka/consumers/java/README.md)
* [Kotlin](/content/kafka/consumers/kotlin/README.md)

### Hvordan produserer jeg meldinger?

* [Java](/content/kafka/producers/java/README.md)
* [Kotlin](/content/kafka/producers/kotlin/README.md)


