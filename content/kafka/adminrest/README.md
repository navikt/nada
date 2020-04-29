# Lag/Konfigurer ett nytt topic

For å lage ett nytt topic i NAV må man bruke adminrest interfacet vårt. 

### URLer (Du trenger utviklingsimage)
* [Kafka Admin Rest - Preprod](https://kafka-adminrest.nais.preprod.local)
* [Kafka Admin Rest - Prod](https://kafka-adminrest.nais.adeo.no) 
* Tilgang fra laptop jobbes med

Der finner man ett `/oneshot` endepunkt som tar i mot en json blob som ser slik ut

```json
{
 "topics": [
   {
      "topicName": "nada-connect-configs",
      "configs": {
        "retention.ms": "86400000",
        "cleanup.policy": "compact"
      },
      "members": [
        {"member": "ADIdentTilTeammedlem", "role": "MANAGER"},{"member": "ADIdentTilAnnetTeammedlem", "role": "MANAGER"}, {"member": "srvNadaConnect", "role": "PRODUCER"},{"member": "srvNadaConnect", "role": "CONSUMER"} ],
      "numPartitions": 10
   }
 ] 
}
```

### Attributter
* `topicName` - Navnet på topic
* `configs` - Tar i mot en map med konfigurasjonsvariabler for ett topic. [Les mer på Kafka sine sider](http://kafka.apache.org/documentation/#topicconfigs)
   * De viktigste som er greie å være klar over
      * `retention.ms` - antall millisekunder Kafka tar vare på meldingen din, standard er `604800000` (1 uke)
      * `cleanup.policy`
         *  `delete` - Standard, slett alle meldinger som er eldre enn `retention.ms`
         * `compact` - Ta vare på siste melding per nøkkel
          
* `members` 
   * `member` - ADIdent (dvs X123456)
   * `role` 
      * tre mulige roller
        * `CONSUMER` - Får lov til å lese meldinger fra topicet
        * `PRODUCER` - Får lov til å skrive meldinger til topicet
        * `MANAGER` -  Får lov til å endre konfigurajson for topicet, og lov til å endre til nye `members`
   * Hvis man ønsker å gi flere roller til samme bruker, så lager man ett member objekt for hver rolle.
* `numPartitions` - Antall partisjoner - [Confluent artikkel om partisjonsstrategi](https://www.confluent.io/blog/how-choose-number-topics-partitions-kafka-cluster/)
   
### Gode råd
* Lagre json blob'en du poster enten i ett dedikert private iac repo for teamet ditt. (A la [nada-iac](https://github.com/navikt/nada-iac))
* Sørg for å holde medlemslisten med MANAGERe oppdatert med alle i teamet
  * For å unngå en situasjon hvor alle teammedlemmene som har lov til å endre på konfigurasjon slutter og man mister mulighet til å endre


### Hva må jeg tenke på når jeg lager ett topic på kafka?

#### Antall partisjoner

Hvis det viktigste er å kunne garantere rekkefølge så er det å opprette ett topic med en partisjon eneste måte å kunne 100% garantere rekkefølge. Dette kommer med en del drawbacks, blant annet at man ikke lenger kan skalere antall konsumenter ved behov. Det er kun én konsument som får lov til å konsumere en partisjon per `group.id`. Så hvis jobben per melding er stor og tung og man vil lese så mange meldinger som mulig, så er det riktige å opprette flere partisjoner.

En tommelfingerregel er at det er lettere å skalere antall partisjoner oppover enn nedover så ved opprettelse av ett topic så er det bedre å velge færre partisjoner enn for mange.