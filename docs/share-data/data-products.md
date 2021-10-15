---
title: Data products 
---

**Data Product**. The term data product is here used as defined in the datamesh literature: 'Data Product is the node on the mesh that encapsulates three structural components required for its function: Code, Data and Metadata, Infrastructure' [Source: Thoughtworks](https://www.thoughtworks.com/what-we-do/data-and-ai/data-mesh). A more complete definition can be found under [Concepts](/begreper/dataprodukt)

Please note that the term is used differently from the more conventional definition: 'data product is a product that facilitates an end goal through the use of data' [Source: DJ. Patil. 2012](http://radar.oreilly.com/2012/07/data-jujitsu.html)

### **Data as product:** Publish datasets

Data products offer 'data as product'. 'This implies thinking about data as something that has a 'customer' and the aim is to delight those customers' [Source: Thoughtworks](https://www.thoughtworks.com/what-we-do/data-and-ai/data-mesh)

Data as products should as a minimum follow the [FAIR principles](https://en.wikipedia.org/wiki/FAIR_data)

In NAV we publish and offer data as a product primarily in the form of Kafka topics and tables in BigQuery

Things to consider when delivering data as a product:
* The data should be immutable and contain a complete history, not just a snapshot.
* There may be a need to transform data to adapt the product to different user groups.
* Raw data should be changed as little as possible before being loading. Normally it will be sufficient to:
  * Rename fields to user-friendly names
  * Define column types
  * Disable small transformations that are guaranteed to be useful in the long run
* You should only exceptionally remove data or apply transformations that change data

### **Metadata:** Register metadata in the data catalog

Data as a product must be easily discoverable. [dakan](https://github.com/navikt/dakan) provides a search interface to our metadata graph. 

[Register metadata](registrere)


## Create a data product

Data products may take many forms. Here are some approaches:

### A Kubernetes job

* <a href='https://doc.nais.io/naisjob/'>Naisjob</a> creates a Kubernetes Job and CronJob resources. A <a href='https://doc.nais.io/persistence/bigquery/'>BigQuery Dataset</a> can be provisioned with config in in the manifest file.


### Python scripts scheduled with Airflow on prem

* <a href='https://github.com/navikt/dataverk-airflow'>Knada KubernetesPodOperator wrapper</a>: A kubernetes job scheduled with airflow

### Using managed GCP services

TODO




<!--
* Ved å forenkle prosessen kan vi gjøre den mer generisk og bombesikker.
* Transformasjon utføret med en serverless plattform er enklere å skalere og enklere å rekjøre enn transformasjon utført i kode kjørt på kubernetes.
* Om transformasjoner kan kodes i SQL senker det terskelen for å lage transformasjoner og flere folk kan bidra.
* Verktøy som dbt kan bidra til god utviklingspraksis.


* Configurable service
  * Code based
    * [MELTANO](https://meltano.com/)
    * [Airbyte](https://airbyte.io/)
    * [Kafka Connect](https://aiven.io/kafka-connect)
    * [Google Dataflow](https://cloud.google.com/dataflow)
  * GUI based
    * [Matillion](https://www.matillion.com/)
    * [Fivetran](https://fivetran.com/)
    * [Stich](https://www.stitchdata.com/)

* Libraries
  * [MELTANO CLI](https://meltano.com/docs/command-line-interface.html#how-to-use-4)
  * NAV Custom
    * Dataverk


Examples

* Netflix datamesh (configurable service)

-->



### Examples 

Color coding in figures:

![Encoding](/img/dataproducts-explication.svg)

### Simple data product

The data product offers a single or a few datasets which do not require complex transformations.

![Enkelt](/img/dataproducts-simple.svg)


### Kafka in combination with batch transformations

![Kafka + Batch](/img/dataproducts-kafka.svg)

* Arbeidsplassen

### Typical data product based on domain data-on-the-inside

The data product offers multiple datasets and, possibly, examples of use.


![Komplett](/img/dataproducts-complete.svg)

#### Implementation examples

Bare-bone minimal data product examples. Please note that these examples have been made for development and testing of the integration of data products with the metadata api and the datacatalog. They are far from complete and do not represent good practice for creating data products.

* Enhetsregisteret
  *   [Github](https://github.com/navikt/knada-naisjobb-test)
  *   [Data catalog](https://data.intern.nav.no/)

* FIST syntetiske regnskapsdata
  * [Github](https://github.com/navikt/dataprodukt_fist-syntetiskedata)
  * [Data catalog](https://data.intern.nav.no/)
  * [Superset](https://superset.intern.nav.no/)