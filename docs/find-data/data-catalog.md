---
title: Data catalog
---

## Main purposes

The data catalog provides an overview of and information about data and data products in NAV.

The data catalog has two main purposes:

- Make data from NAV available to internal and external users in a user-friendly way.
- Increase the productivity of analysts and data scientists in NAV.

We do this by enriching and indexing data resources (concepts, tables, streams, data visualizations and other data products) and making these easy to find in a search interface.
The items in the catalog are stored and connected in a graph database (CosmosDB Gremlin). Metadata for each item is indexed in Elasticsearch.

There are two different entries to the catalog:

## Public datacatalog
Publicly available datasets.

[https://data.nav.no](https://data.nav.no)

## Internal datacatalog (NAV only)
In addition to publicly available data and data products, it also contains data and data products that are only available internally in NAV

[https://data.intern.nav.no/](https://data.intern.nav.no/)

## Integration with Felles datakatalog

[Felles datakatalog](https://data.norge.no/) harvests data from Dakan trough an [API](https://github.com/navikt/dakan-api-digdir.
The API converts dcat-ap metadata in JSON format from Elastic Search to RDF format.


![Oversikt over hvordan datakatalogen henger sammen](/img/datacatalog.svg)



