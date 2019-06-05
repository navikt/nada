# Kotlin Kafka Consumer
---
Det er to måter å starte en consumer i Kotlin på, den ene ser veldig lik ut som Java versjonen, den andre er å registrere det som et CoroutineScope.


## Konfigurasjon

Til felles for begge måtene er at vi trenger en måte å generere nødvendig konfigurasjon for Consumeren.

```Kotlin

fun getEnvVar(varName: String, defaultValue: String? = null): String {
    return System.getenv(varName) ?: defaultValue
    ?: throw IllegalArgumentException("Variable $varName cannot be empty")
}

data class Environment(val bootstrapServers: String = getEnvVar("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092"),
                       val schemaRegistryUrl: String = getEnvVar("KAFKA_SCHEMAREGISTRY_SERVERS", "http://localhost:8081"),
                       val username: String = getEnvVar("USERNAME", "username"),
                       val password: String = getEnvVar("PASSWORD", "password"),
                       val groupId: String = getEnvVar("GROUP_ID", "ditt_gruppenavn_her")
)
object Config {

    fun kafkaProps(env: Environment): Properties {
        val props = Properties().apply {
            put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, env.bootstrapServers)
            put(KafkaAvroDeserializerConfig.SCHEMA_REGISTRY_URL_CONFIG, env.schemaRegistryUrl)
            put(ConsumerConfig.GROUP_ID_CONFIG, env.groupId)
            put(ConsumerConfig.CLIENT_ID_CONFIG, env.groupId + getHostname(InetSocketAddress(0)))
            put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, false) /*Hvis man har denne satt til false, så må man selv sørge for å gjøre consumer.commitSync()                                                           eller consumer.commitAsync()*/
            put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, LongDeserializer::class.java)
            put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, KafkaAvroDeserializerConfig::class.java)
            put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest" | "latest") /*Hvis Kafka aldri har sett groupId før, skal vi begynne å lese fra starten av                                                                        topicet (earliest) eller bare bry oss om meldinger som kommer etter at vi har                                                                       registrert consumeren vår */
            put(KafkaAvroDeserializerConfig.SPECIFIC_AVRO_READER_CONFIG, true)
            putAll(credentialProps(env))

        }

        return props
    }

    fun credentialProps(env: Environment): Properties {
        return Properties().apply {
            put(SaslConfigs.SASL_MECHANISM, "PLAIN")
            put(CommonClientConfigs.SECURITY_PROTOCOL_CONFIG, "SASL_PLAINTEXT")
            put(SaslConfigs.SASL_JAAS_CONFIG,
                    """org.apache.kafka.common.security.plain.PlainLoginModule required username="${env.username}" password="${env.password}";""")
            System.getenv("NAV_TRUSTSTORE_PATH")?.let {
                put(CommonClientConfigs.SECURITY_PROTOCOL_CONFIG, "SASL_SSL")
                put(SslConfigs.SSL_TRUSTSTORE_LOCATION_CONFIG, File(it).absolutePath)
                put(SslConfigs.SSL_TRUSTSTORE_PASSWORD_CONFIG, System.getenv("NAV_TRUSTSTORE_PASSWORD"))
                logger.info("Configured ${SslConfigs.SSL_TRUSTSTORE_LOCATION_CONFIG} location")

            }
        }
    }


}

```

## Coroutine måten
Når konfigurasjonen nå er på plass, kan vi lage oss en Coroutine som prosesserer meldingene for oss. Konfigurasjonen over forutsetter at vi har en Long som nøkkel, og en Avro klasse generert fra skjemaet på topicet vi skal lese.


### Consumer
```Kotlin
import java.time.Duration
import java.time.temporal.ChronoUnit

import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.launch
import kotlin.coroutines.CoroutineContext

import org.apache.kafka.clients.consumer.KafkaConsumer
import org.apache.kafka.common.errors.RetriableException
import org.apache.kafka.common.serialization.Deserializer


object LeesahConsumer : CoroutineScope() {
  lateinit var job: Job
  lateinit var kafkaProps: Properties
  
  override val coroutineContext: CoroutineContext
    get() = Dispatchers.IO + job

  fun cancel() {
    job.cancel()
  }

  fun isRunning() = job.isActive() //Eksponerer denne for å kunne kjøre helsesjekk

  fun create(kafkaProps: Properties) {
    this.job = Job()
    this.kafkaProps = kafkaProps
  }

  fun run() {
    launch {
      KafkaConsumer<Long, MittAvroObjekt>(kafkaProps).use { consumer -> //Bruker use for å sørge for å lukke consumeren skikkelig ved terminering
        consumer.subscribe(listOf("aapen.leesah.hendelse"))
        while(job.isActive) { //Looper på coroutinens oppfattelse på om den er aktiv eller ikke. Hvis man kansellerer Coroutinen vil vi slutte å polle Kafka
          try {
            val records = consumer.poll(Duration.of(100, ChronoUnit.MILLIS)) // Vent maksimalt 100 millsekunder for å få en full buffer med meldinger
            records.forEach { record ->
              //record.value() har nå meldingen fra Leesah
              //record.key() har nøkkelen til meldingen
              gjorNoeMedMeldingen(record.value())
            }
            //Ferdig med denne batchen, si fra til Kafka at vi har lest, vent på bekreftelse fra Kafka
            consumer.commitSync()
          } catch (e: RetriableException) {
            //Hvis vi catcher en av disse kan vi f.eks logge det på informasjonsnivå, vi vil fortsatt gå rundt og polle
          }
          //Andre exceptions bør stoppe while løkken, da man mest sannsynlig trenger å gjøre noe manuelt for å kunne fortsette
        }
      }
    }
  }
}
```

### Bruk
For å ta i bruk denne kan man f.eks. bruke følgende main metode

```Kotlin
import kotlinx.coroutines.runBlocking

fun main(args: Array<String>) = runBlocking {
  LeesahConsumer.apply {
    create(Config.kafkaProps(Environment()))
    run()
  }
}
```

## Blocking consumer
---

### Consumer

```Kotlin
class LeesahConsumer(val kafkaProps: Properties) {

  fun pollKafka() {
    KafkaConsumer<Long, MittAvroObjekt>(kafkaProps).use { consumer ->
      consumer.subscribe(listOf("aapen.leesah.hendelse"))
      while(true) {
        try {
          val records = consumer.poll(Duration.of(100, ChronoUnit.MILLIS)) // Vent maksimalt 100 millsekunder for å få en full buffer med meldinger
            records.forEach { record ->
              //record.value() har nå meldingen fra Leesah
              //record.key() har nøkkelen til meldingen
              gjorNoeMedMeldingen(record.value())
            }
            //Ferdig med denne batchen, si fra til Kafka at vi har lest, vent på bekreftelse fra Kafka
            consumer.commitSync()
          } catch (e: RetriableException) {
            //Hvis vi catcher en av disse kan vi f.eks logge det på informasjonsnivå, vi vil fortsatt gå rundt og polle
          }
      }
    }
  }
}
```

### Bruk

```Kotlin
fun main(args: Array<String>) {
  val consumer = LeesahConsumer(Config.kafkaProps(Environment()))
  consumer.pollKafka() //Dette kallet vil blokke
}
```