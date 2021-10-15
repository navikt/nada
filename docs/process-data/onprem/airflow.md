---
title: Airflow
---

[Apache Airflow](https://airflow.apache.org/docs/apache-airflow/stable/index.html) is a tool for orchestration, scheduling
and monitoring of datapipelines. The web UI that comes with Airflow gives the user e.g. easy access to logs for the different
steps in pipelines, the option to trigger datapipelines manually, and statistics on previous runs.

A datapipeline in Airflow, or DAG (Directed Acyclic Graph), is a set of tasks (or steps) one wishes to execute and describes 
the order and dependencies between these tasks. The DAGs are described programmatically in python files and put in a 
Github repository which is synchronized with the Airflow instance periodically. Below is a graphical representation of the flow 
in one such DAG.

![Pipeline flow in an Airflow DAG](/img/dag-eksempel.png)

KNADA offers teams or individuals the option to set up airflow instances in their personal k8s namespaces in the KNADA cluster.

For more information on Airflow, see [Airflow docs](https://airflow.apache.org/docs/apache-airflow/stable/index.html)

## Configuration
In order to set up Airflow one must create a pull request to [navikt/knada-airflow](https://github.com/navikt/knada-airflow)
with a .yaml file with the following content in the catalog _configs_:

````bash
namespace: <namespace>
ingress: <ingress>
users:
  - <Userident 1>
  - <Userident 2>
  - ...
dagsRepo: <dagsRepo>
````

With every new pull request to [navikt/knada-airflow](https://github.com/navikt/knada-airflow) (including changes to 
existing ones) validation checks are performed on the files committed. When these checks passes the committer can
merge his or her own pull request themselves, _one does not have to wait for approval from the codeowners_.

### namespace
The name of the k8s namespace where the Airflow instance should be set up (usually the same as your Jupyterhub
namespace).

### ingress
The value set in the _ingress_ field becomes the prefix for the address to the Airflow web UI, 
i.e. https://_prefix_-airflow.knada.adeo.no. The users themselves decide what this prefix should be, but usually
the prefix has been set to the same value as the name of the k8s namespace.

### users
List of the users (NAV idents) which should have access to the Airflow web UI.

### dagsRepo
Repository in the navikt organization on Github that contains Python files with DAGs for the Airflow instance.

:::caution The repository must exist
The repository does not need to contain any DAG files when the Airflow instance is set up, but the repository **must exist** 
on Github prior to setting up the Airflow instance.
:::

Once every minute the DAGs in this repository will be synchronized with the Airflow instance.

### dagsRepoBranch
Specifies the branch in the Gihub repository which the Airflow instance should pull.

**default:** main

### repoSyncTime
Specifies how often (in seconds) the Airflow instance should pull your Github repository.

**default:** 60

### dvApiEndpoint
When publishing data packages [dataverk](/process-data/dataverk/README) uses this parameter to set the api address the data catalog
uses to fetch the content for the data package viewer.

**NAV internal (default):** https://data.intern.nav.no/api ([internal data catalog](/find-data/data-catalog#internal-datacatalog-nav-only))

**External:** https://data.nav.no/api ([external data catalog](/find-data/data-catalog#public-datacatalog))


### dvBucketEndpoint
When publishing data packages [dataverk](/process-data/dataverk/README) uses this parameter to determine which data catalog the 
data package content (resource files and visualizations) should be published to.

**NAV internal (default):** https://dv-api-intern.prod-gcp.nais.io/storage ([internal data catalog](/find-data/data-catalog#internal-datacatalog-nav-only))

**External:** https://dv-api-ekstern.prod-gcp.nais.io/storage ([external data catalog](/find-data/data-catalog#public-datacatalog))

:::caution external data catalog
When not specifying `dvApiEndpoint` and `dvBucketEndpoint` the data packages are by default published to the  
[internal data catalog](/find-data/data-catalog/#internal-datakatalog-nav-only). Do not override these parameters unless you 
want to publish data packages to the [external data catalog](/find-data/data-catalog/#public-datacatalog).
:::

## Examples of DAG repositories
- [nada-dags](https://github.com/navikt/nada-dags) contains examples on how to use different operators in Airflow.
- [opendata-dags](https://github.com/navikt/opendata-dags) contains the DAGs used for creating data packages.

## Dataverk-Airflow
[Dataverk-Airflow](https://github.com/navikt/dataverk-airflow) is a library aimed at making it easier to use
[KubernetesPodOperator](https://airflow.apache.org/docs/apache-airflow/stable/kubernetes.html) in the KNADA cluster.

The library contains wrapper functions for running Jupyter notebooks, Python scripts, BigQuery commands and DBT 
transformations in separate k8s pods in the cluster. View 
[README](https://github.com/navikt/dataverk-airflow/blob/master/README.md) in the repository for examples.
