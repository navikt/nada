# Lag ditt eget kubeflow image
For å bygge ditt eget kubeflow image med jupyterhub eller jupyterlab kreves
det at man har installert docker.

Finn siste versjon av navikt/naisflow:jupyterlab og navikt/naisflow:jupyterhub 
på [dockerhub](https://hub.docker.com/r/navikt/naisflow/tags)

### Eksempel på Dockerfile med Jupyterlab
````dockerfile
FROM navikt/naisflow:jupyterlab-<tag>

USER root

COPY requirements.txt /requirements.txt
RUN pip3 install -r /requirements.txt --no-cache-dir

USER ${NB_USER}
````

### Eksempel på Dockerfile med Jupyterhub
````dockerfile
FROM navikt/naisflow:jupyterhub-<tag>

USER root

COPY requirements.txt /requirements.txt
RUN pip3 install -r /requirements.txt --no-cache-dir

USER ${NB_USER}
````

## Bygg og push image
````bash
$ docker build -t navikt/<navn>:<tag> .
$ docker push navikt/<navn>:<tag>
````
