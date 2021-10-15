---
title: Dataverk
---

[Dataverk](https://pypi.org/project/dataverk) is a python library for data access, storage, and publishing 
of data products in NAV. Its purpose is to simplify access to sources, and storage of results for analysts, 
data scientists, and others. The aim is to standardize the access to different data sources and provide a generic 
way to publish data either internally in NAV or externally, so users can focus on analysis and experimentation as opposed 
to struggling with how to read data from different sources and publishing their results.  

#### Access to data sources
The library offers connectors for a variety of data sources, e.g. oracle, postgreSQL and kafka. What is common for all 
connectors is that they return data in the same format, a [pandas](https://pandas.pydata.org/docs) dataframe, which gives 
the user the ability to utilize the pandas library to perform transformations and mutations on datasets, and combine data 
from different sources.

![Read sources](/img/dv_les_kilde.png)

#### Storage and publishing of results
For storing results dataverk offer a google cloud storage connector which can be used either directly or through the 
publishing mechanism of dataverk.

To publish data products with dataverk involves the following:
1. Prepare datasets, create visualizations, and text descriptions
2. Publish a [data package](/share-data/data-products)

When a "data package" is published it will be available either in the [internal](https://data.intern.nav.no) or 
[external](https://data.nav.no) data catalog. 

#### Anonymization of datasets
The library also offers methods for performing simple data anonymization of datasets.

## Usage area
- Data analysis
- Data experimentation/exploration
- Publish NAV data internally or externally
- Work code based with one tool all the way from raw data to end product

## Getting started

### With JupyterHub
We recommend working with dataverk on a Jupyterhub server as:
1. Dataverk has a lot of external dependencies which must be installed in the environment (e.g. oracle driver, postgres 
driver etc.). These dependencies will be installed in the docker image used by the notebook server.
2. Easier and more secure handling of secrets. When working from a Jupyterhub server this is handled in the same way as 
for applications running in the NAIS clusters, i.e. secrets (e.g. database credentials) are mounted into the container 
environment as opposed to stored locally on your machine.

To get started with Jupyterhub, see [getting started](/process-data/onprem/getting-started) or reach out in 
[#knada](https://nav-it.slack.com/archives/CGRMQHT50) for assistance.

### Without Jupyterhub
As long as you have a python distribution >=python36 installed, the library can be installed with:
````bash
pip install dataverk
````

## Contact us
For questions, reach out in [#dataverk](https://nav-it.slack.com/archives/CCY2V3N4E).

## Link for ROS
[ROS for dataverk](https://apps.powerapps.com/play/f8517640-ea01-46e2-9c09-be6b05013566?ID=209)

### Links
* [PyPI](https://pypi.org/project/dataverk)
* [Repo](https://github.com/navikt/dataverk)
