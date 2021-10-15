---
title: Notebooks
---

[Jupyter Notebooks](https://jupyter.org/) are supported on GCP, you can locate these under 
[AI Platform (doc)](https://cloud.google.com/ai-platform/docs/technical-overview), alongside a variety of other tools. 
You can find the official documentation for AI Platform Notebooks at [cloud.google.com](https://cloud.google.com/ai-platform/notebooks/docs).

Below we have created a step-by-step guide for starting with Notebooks on GCP.

## Guide

1. Go to [AI Platform/Notebooks](https://console.cloud.google.com/ai-platform/notebooks/instances)
2. Choose `New Instance` and `Customize Instance`
3. Enter all the mandatory fields:
   - Instance name
   - Region - Choose one of the European
   - Zone - A zone within the region you chose
   - Environment - Choose a suitable environment based on your needs/programming language
   - Machine type and GPU - Resource requirements
4. Press `Create`
5. When the machine is up and running press `Open JupyterLab`

## Machine type and GPU
You know best what you need, therefore there are no limits for what you can choose. However, remember that this could 
become quite expensive if you keep your machine running for a long time without it being used.

## Stop a machine
If you have a machine that you do not need at the moment, but you do not want to [delete](#delete-a-machine) it, you can 
stop it temporarily instead. Choose the machine [here](https://console.cloud.google.com/ai-platform/notebooks/instances) 
and press `STOP`.

## Delete a machine
If you have a machine you do not need anymore, you can delete it.
Choose the machine [here](https://console.cloud.google.com/ai-platform/notebooks/instances) and press `DELETE`.
