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
            put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, false)
            put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, LongDeserializer::class.java)
            put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, KafkaAvroDeserializerConfig::class.java)
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

```Kotlin

object KafkaConsumer : CoroutineScope() {
  lateinit var job: Job
  lateinit var kafkaProps: Properties
  
  override val coroutineContext: CoroutineContext
    get() = Dispatchers.IO + job

  fun cancel() {
    job.cancel()
  }

  fun isRunning() = job.isActive() //Eksponer denne for å kunne kjøre helsesjekk

}

