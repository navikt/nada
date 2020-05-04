# Testing

Nav har laget en embedded kafka pakke som inkluderer/starter opp confluent sitt skjema register i tillegg til Zookeeper og Kafka.

Dette gjør at det blir ganske greit å lage integrasjonstester mot ett ekte Kafka cluster

## Gradle
```gradle
dependencies {
    testImplementation("no.nav:kafka-embedded-env:2.4.0")
}
```

## Maven
```xml
<dependencies>
    <dependency>
        <groupId>no.nav</groupId>
        <artifactId>kafka-embedded-env</artifactId>
        <version>2.4.0</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

## Eksempeltest
Hvis vi forutsetter at vi har en [Consumer](../consumers/kotlin/README.md) og en [Producer](../producers/kotlin/README.md) tilgjengelig så blir en mulig integrasjons test.

```kotlin
package no.nav.kafka

import no.nav.common.JAASCredential
import no.nav.common.KafkaEnvironment
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.AfterAll
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test

class KafkaIntegrationTest {
    init {
        System.setProperty("zookeeper.jmx.log4j.disable", "true")
    }

    companion object {
      private const val username = "srvkafkaclient"
        private const val password = "kafkaclient"

        val embeddedEnvironment = KafkaEnvironment(
                users = listOf(JAASCredential(username, password)),
                autoStart = false,
                withSchemaRegistry = true,
                withSecurity = true
        )

        val env = Environment(
                bootstrapServers = embeddedEnvironment.brokersURL,
                schemaRegistryUrl = embeddedEnvironment.schemaRegistry!!.url,
                username = username,
                password = password
        )

        @BeforeAll
        @JvmStatic
        fun setup() {
            embeddedEnvironment.start()
        }

        @AfterAll
        @JvmStatic
        fun teardown() {
            embeddedEnvironment.tearDown()
        }
    }

    @Test
    fun roundTrip() {
        runBlocking {
            LeesahConsumer.apply {
                create(Config.kafkaProps(env))
                run({ record -> assertThat(record.key()).isEqualTo(1L)})
            }
            LeesahProducer.sendMelding("aapen.leesah.hendelse", 1L, MittAvroObject(), env)
        }
    }
}
```
