# Kom i gang med Kubeflow

For å bruke Kubeflow så må man være medlem av Azure AD-gruppen `dataplattform`, `ai-labben`, eller `kubeflow`. Sistnevte
er mest for de som ikke er medlem av en av de to første teamene. Kubeflow er kun tilgjengelig fra utviklerimage/VDI, fra
laptop på NAV-nettet, eller NAVTunnelen (foreløpig kun i disse Korona-tider).

Meld fra i [#naisflow](https://nav-it.slack.com/archives/CGRMQHT50) hvis du får problemer.

## Logg inn på Kubeflow.adeo.no
```
1. Gå til https://kubeflow.adeo.no
2. Logg inn med din NAV-ident og passord
3. Klikk "Start Setup"
4. Under "Namespace Name", skriv teamnavn
5. Trykk "Finish"
```

## Tilgang via NAVTunnel [Mac]

Hvis du har hjemmekontor, så må du sette opp NAVTunnelen for å få tilgang til Kubeflow. Alle som har Mac har NAVTunnel
automagisk installerte, det eneste man da trenger å gjøre er å endre litt config til tunnelen (og starte den på nytt)
for å få tilgang til Kubeflow.

I filen `~/.navtunnel/config.json` legger du til følgende:
```
,{
 "host": "kubeflow02",
 "name": "kubeflow"
}
```

PS: Hvis denne filen ikke finnes, kan du kopiere den først fra
`/Applications/navtunnel.app/Contents/Resources/config.json`.

I filen `/Applications/navtunnel.app/Contents/Resources/ssh_config`  legger du til følgende:
```
Host kubeflow02
  Hostname kubeflow02
  ExitOnForwardFailure yes
  DynamicForward 14139
  LocalForward 127.0.0.1:14140 kubeflow-apiserver.prod-fss.nais.io:443
```

## (valgfritt) Opprett AD-gruppe for teamet

NB: Dette trenger man ikke å gjøre for individuelle brukere

Lag nytt team via [navikt/teams](https://github.com/navikt/teams)

## (valgfritt) Opprett Vault område for Kubeflow teamet

Dokumentasjonen for Vault ligger i
[vault-iac](https://github.com/navikt/vault-iac/blob/master/doc/kubeflow.md)-repoet. Det skilles mellom vanlige teams,
og individuelle brukere.

## (valgfritt) Legg inn hemmeligheter i Vault
1. Gå til https://vault.adeo.no
2. Gå til pathen `kv/prod/kubeflow`
3. Trykk "Create secret" og under "Path for this secret" skriv `<namespace>`
4. Legg inn key-value secrets her, f.eks.
   ```
      key: DVH_CONNECTION_STRING
      value: oracle://${user}:${password}@${host}:${port}/${service_name}
   ```

## Dockerimage

#### Generelt image
[navikt/dataverk](https://hub.docker.com/r/navikt/dataverk/tags) er
et generelt image som inneholder det grunnleggende for å komme
i gang og teste kubeflow.

#### Custom image
De som ønsker å spesifisere selv hva som skal være installert
i kubeflow imaget kan lage sitt eget basert på
[navikt/naisflow](https://hub.docker.com/r/navikt/naisflow/tags)

Dette imaget kommer kommer enten med jupyterhub eller jupyterlab installert
og man står da fritt til å skreddersy ønsket miljø på notebook serveren i kubeflow.

Se [instruks for å bygge custom image](build-custom-image.md)

## Opprett Jupyter Notebook server
1. Gå til https://kubeflow.adeo.no
2. Gå til "Notebook servers" i menyen til venstre
3. Klikk "+ NEW SERVER"
4. Huk av for "Custom image" og skriv inn image navn, enten 
    - Seneste versjon av [navikt/dataverk](https://hub.docker.com/r/navikt/naisflow/tags), f.eks.
    ![Valgfritt Jupyter Docker Image](custom-jupyter-image.png)
    - Eller navn på [custom image](build-custom-image.md)
5. Antall CPU'er og minne for notebook-serveren kan spesifiseres. Oppfordrer til å bruke default-oppsettet her (0.5 cpu, 1.0Gi), dette kan også endres senere ved behov.
6. Trykk launch

## (valgfritt) Legg til contributors
Namespacet som opprettes i "Opprett eget kubeflow namespace" er i utgangspunktet personlig. Dersom man ønsker å samarbeide med andre i Kubeflow-namespacet kan man gjøre følgende:

1. Fra https://kubeflow.adeo.no, gå til "Manage Contributors" i menyen til venstre
2. Legg til nav-eposten til brukeren du ønsker å invitere (f.eks. Ola.Nordmann@nav.no)

# Oppdatering av team

## Oppdatere Kubeflow docker image

Dersom man ønsker å oppdatere docker-imaget som teamet bruker, gjøres dette ved å lage PR til [navikt/kubeflow-yaml](https://github.com/navikt/kubeflow-yaml) og endre image navnet for ditt team i `teams.yaml`.

## Oppdatere minne/cpu

Dette er ikke selvbetjent foreløpig, men ved behov for å øke minne og/eller cpu for notebook-serveren kan man si ifra i #naisflow.
