# Kotlin Kafka Producer

## Konfigurasjon

```kotlin
fun getEnvVar(varName: String, defaultValue: String? = null): String {
    return System.getenv(varName) ?: defaultValue
    ?: throw IllegalArgumentException("Variable $varName cannot be empty")
}
data class Environment(
    val bootstrapServers: String = getEnvVar("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092"),
    val schemaRegistryUrl: String = getEnvVar("KAFKA_SCHEMAREGISTRY_SERVERS", "http://localhost:8081"),
    val username: String = getEnvVar("USERNAME", "username"),
    val password: String = getEnvVar("PASSWORD", "password")
)

object Config {

    fun kafkaProps(env: Environment): Properties {
        val props = Properties().apply {
            put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, env.bootstrapServers)
            put(KafkaAvroSerializerConfig.SCHEMA_REGISTRY_URL_CONFIG, env.schemaRegistryUrl)
            put(ProducerConfig.CLIENT_ID_CONFIG, env.groupId + InetSocketAddress(0).hostString)
            put(ProducerConfig.ACKS_CONFIG, "1")
            put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, LongDeserializer::class.java)
            put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, KafkaAvroDeserializerConfig::class.java)
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
            }
        }
    }
}
```

## Producer
### Åpning og lukking av produsent for hver melding som sendes

```kotlin
package no.nav.kafka;

import org.apache.kafka.clients.producer.KafkaProducer
import org.apache.kafka.clients.producer.ProducerRecord

object LeesahProducer {

    fun produserMelding(topic: String, key: Long, value: MittAvroObject, env: Environment = Environment()) {
        KafkaProducer(KafkaConfig.getKafkaProps(env)).use { producer ->
            producer.send(new ProducerRecord(topic, key, value));
        }
    }
}
```

### Instansiering av produsent i constructor for klasse og en egen `send()` metode

```kotlin
package no.nav.kafka

import javax.annotation.PreDestroy

import org.apache.kafka.clients.producer.KafkaProducer
import org.apache.kafka.clients.producer.ProducerRecord

import no.nav.leesah.MittAvroObject

public class LeesahProducer(val kafkaProps: Properties, val producer: KafkaProducer<Long, MittAvroObject> = KafkaProducer<>(kafkaProps)) {
    fun sendMelding(topic: String, key: Long, value: MittAvroObject) {
        producer.send(new ProducerRecord(topic, key, value))
    }

    @PreDestroy
    private void closeProducer() {
        try {
            producer.close()
        } catch (e: Exception) {
            /* Nei man bør ikke catche Exception, men her skjer dette rett før applikasjonen termineres, slik at det er grenser på hvilken nytte det gjør å håndtere denne feilen */
        }
    }
}

fun main(args: Array<String>) {
    val produsent = LeesahProducer(KafkaConfig.getKafkaProps())
    produsent.sendMelding(..)
}

```