# Java Kafka Producer

## Konfigurasjon

```java
package no.nav.kafka;

public class KafkaConfig {
    
    public static Properties getKafkaProps() {
        Properties kafkaProps = new Properties();
        kafkaProps.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, getEnvVar("KAFKA_BOOTSTRAP_SERVERS"));
        kafkaProps.put(KafkaAvroSerializerConfig.SCHEMA_REGISTRY_URL_CONFIG, getEnvVar("KAFKA_SCHEMAREGISTRY_SERVERS"));
        kafkaProps.put(ProducerConfig.CLIENT_ID_CONFIG, InetSocketAddress(0).getHostString());
        kafkaProps.put(ProducerConfig.ACKS_CONFIG, "1"); /* Les [her]("/kafka/README.md") */
        kafkaProps.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, LongDeserializer.class);
        kafkaProps.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, KafkaAvroDeserializerConfig.class);
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

## Producer

### Åpning og lukking av produsent for hver melding som sendes

```java
package no.nav.kafka;

public class LeesahProducer {

    public static void produserMelding(String topic, Long key, MittAvroObject value) {
        try(KafkaProducer<Long, MittAvroObject> producer = new KafkaProducer(KafkaConfig.getKafkaProps())) {
            producer.send(new ProducerRecord(topic, key, value));
        }
    }
}
```

### Instansiering av produsent i constructor for klasse og en egen `send()` metode

```java
package no.nav.kafka;

import javax.annotation.PreDestroy;

import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;

import no.nav.leesah.MittAvroObject;

public class LeesahProducer {
    private KafkaProducer<Long, MittAvroObject> producer;
    public LeesahProducer(Properties kafkaProps) {
        this.producer = new KafkaProducer<>(kafkaProps);
    }

    public sendMelding(String topic, Long key, MittAvroObject value) {
        producer.send(new ProducerRecord(topic, key, value))
    }

    @PreDestroy
    private void closeProducer() {
        try {
            producer.close();
        } catch (Exception e) {
            /* Nei man bør ikke catche Exception, men her skjer dette rett før applikasjonen termineres, slik at det er grenser på hvilken nytte det gjør å håndtere denne feilen */
        }
    }
}

public class Application {

    public static void main(String[] args) {
        LeesahProducer produsent = new LeesahProducer(KafkaConfig.getKafkaProps());
        produsent.sendMelding(..);
    }
}
```
