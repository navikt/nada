---
title: Jupyterhub
---

For data analysis KNADA recommends using [Jupyter notebooks](https://jupyter.org/).

The Jupyterhub instances are created based on configuration files in the 
[navikt/knada-jupyterhub](https://github.com/navikt/knada-jupyterhub) repository. In this repository you add your 
own configuration file in the `/configs` catalog. 

With every new pull request to [navikt/knada-jupyterhub](https://github.com/navikt/knada-jupyterhub) (including changes to 
existing ones) validation checks are performed on the files committed. When these checks passes the committer can
merge his or her own pull request themselves, _one does not have to wait for approval from the codeowners_.

Below is an example of the minimum requirements one need to specify in the configuration file. With this configuration
you will get a Jupyterhub with 2 GB memory and 0.5 CPU. The hub can be reached at `https://kyrre.jupyter.adeo.no`  
and user `e152435` is the only one allowed to log in.

`/configs/kyrre.yaml`
```
namespace: kyrre-havik-eriksen
ingress: kyrre
users:
  - e152435
```

All values can be edited later on.

## Configuration

### Namespace
Name of the k8s `namespace` your hub shall be set up in.

Editing this value later on will result in the creation of a hub in the new namespace. However, the other hub will still 
exist in the old namespace. Please see [Delete hub](#delete-hub) below if you choose to edit the namespace value.

### Ingress
The prefix for the address. The value set as `ingress` combined with `.jupyter.adeo.no` becomes the hub address.  

### Users
List of users (NAV idents) allowed to log in to the hub.

### Custom environment variables
If you have a need for custom environment variables for your Jupyterhub instance, you can add these using the 
`extraEnvs` field in your configuration as shown below:
```
extraEnvs:
  - "hello: world"
```

Note that every line must start with `-` and the value must be enclosed by quotes.
This is required as the value is interpreted as a string and not as key/value. 

### Jupyter instead of JupyterLabs
Should you want Jupyter instead of Jupyterlab, specify this in your configuration as follows:
```
jupyterLabs: false
```

### Specify resource limits
If you require different resource limits (default being 2 GB and 0.5 CPU), you specify this using the 
`memoryLimit` and `cpuLimit` fields in your configuration, e.g.
```
memoryLimit: 10GB
cpuLimit: 1
```

Note that if you update the resource limits you need to restart the Jupyterhub server for the changes to take effect. In 
order to restart your server, see [Restart jupyterhub server](#restart-jupyterhub-server)

:::info
Jupyterhub monitors the resource usage of your server and will restart the notebook kernel should you use more than  
requested.
:::

## Restart Jupyterhub server
In order to restart your Jupyterhub server, do as follows:
1. Go to `https://<ingress>.jupyter.adeo.no/home`
2. Press `Stop My Server`
3. When the option to start your server again becomes available, press `Start My Server`

## Delete hub
Deletion of Jupyterhubs needs to be done manually by one of the cluster administrators. 
Reach out in [#nada](https://nav-it.slack.com/archives/CGRMQHT50) for assistance.

## Remove users
To remove a user from a jupyterhub namespace do as follows:
- Remove the person from the `users` list in the config file under `/config`
- Login to the hub's admin page (`https://<ingress>.jupyter.adeo.no/hub/admin`) and delete the user from hubs database

## Remote Jupyterhub connection
If you want to connect to your Jupyterhub from Visual Studio Code locally, do as follows 

### Create Jupyterhub API token
1. Go to `https://<ingress>.jupyter.adeo.no/home`
2. Press `token` in the upper left corner
3. Press `Request new API token`
4. Store the token locally

### Connect from Visual Studio Code
Once you have created an API token you can connect to your remote Jupyterhub server.

1. Ensure that you have the Jupyter extension installed for Visual Studio Code
![Jupyter extension](/img/jupyter-extension.png)
2. Press `cntrl+shift+P` (windows) or `cmd+shift+P` (mac)
3. Search for `Jupyter: Specify local or remote Jupyter server for connections`
4. Choose `Existing`
5. Enter the URI of the running jupyter server, 
i.e. `https://<ingress>.jupyter.adeo.no/user/<nav-ident>/?token=<token>`. Replace ingress and nav ident, and token with 
the token retrieved in [Create Jupyterhub API token](#create-jupyterhub-api-token)
6. When prompted, log in using your NAV-ident and password
