# Lag/Konfigurer ett nytt topic

For å lage ett nytt topic i NAV må man bruke adminrest interfacet vårt. 
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
   },
   {
      "topicName": "nada-connect-offsets",
      "configs": {
        "retention.ms": "86400000",
        "cleanup.policy": "compact"
      },
      "members": [
        {"member": "ADIdentTilTeammedlem", "role": "MANAGER"},{"member": "ADIdentTilAnnetTeammedlem", "role": "MANAGER"}, {"member": "srvNadaConnect", "role": "PRODUCER"},{"member": "srvNadaConnect", "role": "CONSUMER"}],
      "numPartitions": 10
   },
   {
      "topicName": "nada-connect-status",
      "configs": {
        "retention.ms": "86400000",
        "cleanup.policy": "compact"
      },
      "members": [
        {"member": "ADIdentTilTeammedlem", "role": "MANAGER"},{"member": "ADIdentTilAnnetTeammedlem", "role": "MANAGER"}, {"member": "srvNadaConnect", "role": "PRODUCER"},{"member": "srvNadaConnect", "role": "CONSUMER"}],
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
          
* `members` - en liste av brukere med tre mulige roller
   * `CONSUMER` - Får lov til å lese meldinger fra topicet
   * `PRODUCER` - Får lov til å skrive meldinger til topicet
   * `MANAGER` - Får lov til å endre konfigurajson for topicet, og lov til å endre til nye `members`
   * Hvis man ønsker å gi flere roller til samme bruker, så lager man ett member objekt for hver rolle.
   
### Gode råd
* Lagre json blob'en du poster enten i ett dedikert private iac repo for teamet ditt. (A la [nada-iac](https://github.com/navikt/nada-iac))
* Sørg for å holde medlemslisten med MANAGERe oppdatert med alle i teamet
  * For å unngå en situasjon hvor alle teammedlemmene som har lov til å endre på konfigurasjon slutter og man mister mulighet til å endre


### URLer (Du trenger utviklingsimage)
* [Preprod](https://kafka-adminrest.nais.preprod.local)
* [Prod](https://kafka-adminrest.nais.adeo.no)

Vi jobber med å avklare om vi kan åpne opp for tilgang fra laptop