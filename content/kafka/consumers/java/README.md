# Java Kafka Consumer

## Konfigurasjon

```Java
package no.nav.config;

import java.io.File;
import java.net.InetSocketAddress;
import java.util.Properties;
import java.util.Optional;

import org.apache.kafka.clients.CommonClientConfigs;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.config.SaslConfigs;
import org.apache.kafka.common.config.SslConfigs;
import io.confluent.kafka.serializers.KafkaAvroDeserializerConfig;

public class KafkaConfig {

    public static Properties getKafkaProps() {
        Properties kafkaProps = new Properties();
        kafkaProps.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, env.bootstrapServers);
        kafkaProps.put(KafkaAvroDeserializerConfig.SCHEMA_REGISTRY_URL_CONFIG, env.schemaRegistryUrl);
        kafkaProps.put(ConsumerConfig.GROUP_ID_CONFIG, env.groupId);
        kafkaProps.put(ConsumerConfig.CLIENT_ID_CONFIG, env.groupId + InetSocketAddress(0).getHostString());
        kafkaProps.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, false); /*Hvis man har denne satt til false, så må man selv sørge for å gjøre                                                                                 consumer.commitSync() eller consumer.commitAsync() */
        kafkaProps.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, LongDeserializer.class);
        kafkaProps.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, KafkaAvroDeserializerConfig.class);
        kafkaProps.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest" | "latest"); /*Hvis Kafka aldri har sett groupId før, skal vi begynne å lese fra                                                                                   starten av topicet (earliest) eller bare bry oss om meldinger som                                                                                   kommer etter at vi har registrert consumeren vår (latest)? */
        kafkaProps.put(KafkaAvroDeserializerConfig.SPECIFIC_AVRO_READER_CONFIG, true);
        kafkaProps.putAll(credentialProps());
        return kafkaProps;
    }

    private static Properties credentialProps() {
        Properties credProps = new Properties();
        credProps.put(SaslConfigs.SASL_MECHANISM, "PLAIN")
        credProps.put(CommonClientConfigs.SECURITY_PROTOCOL_CONFIG, "SASL_PLAINTEXT")
        credProps.put(SaslConfigs.SASL_JAAS_CONFIG, "org.apache.kafka.common.security.plain.PlainLoginModule required username=" +$env.username+ "password=" +env.password +";");
        if (System.getenv("NAV_TRUSTSTORE_PATH") != null) {
            credProps.put(CommonClientConfigs.SECURITY_PROTOCOL_CONFIG, "SASL_SSL");
            credProps.put(SslConfigs.SSL_TRUSTSTORE_LOCATION_CONFIG, new File(it).getAbsolutePath());
            credProps.put(SslConfigs.SSL_TRUSTSTORE_PASSWORD_CONFIG, System.getenv("NAV_TRUSTSTORE_PASSWORD"));
        }
    }

    private static String getEnvVar(String varName) {
        return Optional.ofNullable(System.getenv(varName)).filter(l -> l.length > 0).orElseThrow(new IllegalArgumentException("Kunne ikke finne miljøvariablen " + varName));
    }
}
```

## Consumer

```java
package no.nav.kafka;

import java.time.Duration;
import java.time.temporal.ChronoUnit;
import java.util.Properties;

import no.nav.leesah.MittAvroObject;

import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.common.errors.RetriableException;

public class LeesahConsumer {

    public static void consumeMessages(Properties kafkaProps) {
        try(KafkaConsumer<Long, MittAvroObject> consumer = new KafkaConsumer<>(kafkaProps)) {
            consumer.subscribe(Arrays.asList("aapen.leesah.hendelse"));
            while(true) {
                try {
                    ConsumerRecords<Long, MittAvroObject> records = consumer.poll(Duration.of(100, ChronoUnit.MILLIS));
                    for(ConsumerRecord<Long, MittAvroObject> record : records) {
                        gjorNoeMedMelding(record);
                    }
                    consumer.commitSync();
                } catch (RetriableException re) {
                    //Ikke la RetriableExceptions bryte while løkken, kafka gjør det riktige hvis vi bare begynner på neste iterasjon av poll løkken
                }
            }
        }
    }

    private static void gjorNoeMedMelding(ConsumerRecord<Long, MittAvroObject> record) {
        System.out.println(record.value());
    }
}

public class App {

    public static void main(String[] args) {
        LeesahConsumer.consumeMessages(KafkaConfig.getKafkaProps()); //Blocking, kan wrappes i en Runnable for å kjøre på separat tråd
    }
}
```