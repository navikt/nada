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

#### Eksempel produsenter
* [Java](producers/java)
* [Kotlin](producers/kotlin)

### Hvordan lager jeg ett topic?

[Hvordan lage/konfigurere topic](adminrest/README.md)


### Annen informasjon
* [AURA sine kafka sider](https://confluence.adeo.no/display/AURA/Kafka) - har dokumentert en del ting relatert til sikkerhet for Kafka i NAV
* [ATOM server oversikt](https://confluence.adeo.no/pages/viewpage.action?pageId=239339073) - miljøene er dokumentert her



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
