---
title: Getting started
sidebar_position: 0
---

We are working on creating a modern analytics platform on GCP (Google Cloud Platform) where we want to utilize all the 
tools, frameworks, and resources the Google Cloud Platform offers. So far we have been focusing on 
[Jupyter Notebook](process-data/gcp/notebooks.md), and [Cloud Composer](process-data/gcp/pipelines/cloud-composer.md).   

On GCP you work in what is called projects, and each [team](https://github.com/navikt/teams/blob/main/teams.yml) has their 
own project. Hence, the easiest way to get started is to become a member of a team and work in their GCP project.

Should you have a need for a private GCP project we offer users the option to create their own _on-demand_-projects. These 
projects are intended to be temporary, for a specific analysis you are working on, and the analytics products created in these 
projects should be transferred to a team project eventually.

## Projects

To view which projects you are currently a member of, go to 
[GCP Billing](https://console.cloud.google.com/billing/projects?project=&folder=&organizationId=139592330668).

To access a team project, go to [GCP Dashboard](https://console.cloud.google.com/projectselector2/home/dashboard) and 
choose your team under **select project**.

### On-demand project

In order to create your own _on-demand_-project, you add a new object in the file 
[`terraform/on-demand.tf`](https://github.com/navikt/knada-on-demand-projects/blob/main/terraform/on-demand.tf) 
and create a Pull Request.

The information we need is the name of the project (e.g. `team-analysis`), and the email of the user requesting access.

:::info
The project name must be unique!
:::

In the file `terraform/on-demand.td` you add the following under `locals.projects`:
```
{
  name  = "your-project-name",
  email = "your-nav-email@nav.no"
}
```

The result should look like this:
```
locals {
  projects = [
    {
      name = "your-project-name",
      email = "your-nav-email@nav.no"
    }
  ]
}
```

These projects gives the user the same roles and accesses as in a NAIS team project, in addition to the roles one need in 
order to use [Jupyter Notebooks](process-data/gcp/notebooks.md). Should you need to use additional API's and services on GCP, you need 
to grant yourself access to these. View [doc.nais.io](https://doc.nais.io/basics/teams/#access-management) for 
GCP access management documentation.

## Culture

In order to achieve the best possible analytics platform, there are som guidelines the users should follow. 

### Should
- Use temporary access to data
- Use temporary tokens (between user and data)
- Ensure that data transformations are code based, with tests, version control, and documentation (using e.g. dbt or similar tools)
- Keep track of who accesses what data

### Should not
- Use personal long-term credentials

## Backup (TODO)

> På grunn av de potensielle sårbarhetene må brukerne gjøres oppmerksomme på deres ansvar. Restrisiko aksepteres gitt at dokumentasjon gjenspeiler at team må ta ansvar for backup, være nøye med tilganger, og ta nødvendige grep for å sikre at kritiske tjenester ikke har GCP/internett som en single point of failure.
