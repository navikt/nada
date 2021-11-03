---
title: Data product
---

## Generic definitions

* A data product, in general terms, is any tool or application that processes data and generates results. Source: [sisense](https://www.sisense.com/glossary/data-products/)


### Data Product´s Elements in the view of Data Mesh

**Data Product** is the smallest unit of architecture that can be independently
deployed with high functional cohesion.
Data Product is the node on the mesh that encapsulates three structural components
required for its function: **Code**, **Data and Metadata**, **Infrastructure**

**Code:** it includes 

* (a) code for data pipelines responsible for consuming, transforming and serving upstream data - data received from domain’s operational system or an upstream data product; 
* (b) code for APIs that provide access to data, semantic and syntax schema, observability metrics and other metadata; 
* (c) code for enforcing traits such as access control policies, compliance, provenance, etc.

**Data and Metadata:**
* the underlying analytical and historical data in a polyglot form. Depending on the nature of the domain data and its consumption models, data can be served as events, batch files, relational tables, graphs, etc. 
* for data to be usable there is an associated set of metadata including documentation, semantic and syntax declaration, quality metrics.

**Infrastructure:** The infrastructure component enables building, deploying and running the data product's code, as well as storage and access to big data and metadata.

A data product only really qualifies as a data product if it can be found, executed and re-used. 
So, it needs to have a discoverable and executable endpoint that is found via the catalogue. 
Most importantly, it needs to be interoperable so that it can be orchestrated as part of other data products.


Source: [Martin Fowler](https://martinfowler.com/articles/data-mesh-principles.html)

## Pros and cons

### Advantages

* The domains and product teams are masters of their data, data quality control and domain related analytics. The domain can see operational and analytical data holistically and have deep knowledge of the origins and affordances of the data.
* Data product: Teams work directly with users of their data. Platform can help make the products easy to use for business users.
* Security & GDPR: Limit number of users, data minimalization, proportional use.
* No central bottleneck for developing new data products or scaling to more domains.


### Challenges

* Governance and ops: increased complexity of oversight and decision processes.
* Data and analytics skills in product teams.
* Data modelling, interoperability, merging between domains, orchestration.
* Prioritization of products vs data product in product teams.
