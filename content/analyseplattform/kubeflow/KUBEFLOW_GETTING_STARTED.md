# Getting-started guide for kubeflow

## Opprett eget kubeflow team
```
1. Gå til https://kubeflow.adeo.no
2. Logg inn med brukerident og passord
3. Klikk "Start Setup"
4. Under "Namespace Name", skriv teamnavn
5. Trykk "Finish"
```

## Legg til teamet i navikt/kubeflow-yaml
Lag pull request til https://github.com/navikt/kubeflow-yaml der man legger til følgende i teams.yaml:
```
- name: ${team}
  image: ${image}
```
- ${team} erstattes med teamnavnet valgt i forrige steg 
- ${image} erstattes med siste versjon av ønsket kubeflow base image (finnes ved å gå til https://github.com/navikt/kubeflow-dataverk-base)

## (optional) Opprett vault område for kubeflow teamet
Er eget Vault-oppsett for Kubeflow, da vi må ha muligheten til at en serviceAccount skal ha tilgang til flere path.

Lag en ny module i terraform/kubeflow.tf
```
module "kubeflow-${team}" {
  namespace = "${team}"
  source = "./modules/kubeflow"
}
```
Legg til ny policy under extra_policies i terraform/teams/${team}.yml
```
extra_policies:
  - kubeflow_${team}_sudo
```

For å få tilgang til postgres databaser tilhørende teamet i kubeflow må følgende settes
```
extra_policies = ["postgresql_<sone>_<db-navn>_admin"]
```
i modulen for kubeflow teamet i https://github.com/navikt/vault-iac/blob/master/terraform/kubeflow.tf

## (optional) Legg inn secrets
```
1. Gå til https://vault.adeo.no
2. Gå til pathen kv/prod/kubeflow
3. Trykk "Create secret" og under "Path for this secret" skriv <teamnavn>/<teamnavn>
4. Legg inn key-value secrets her, f.eks.  
      key: DVH_CONNECTION_STRING
      value: oracle://${user}:${password}@${host}:${port}/${service_name}
```

## Opprett jupyter notebook server
```
1. Gå til https://kubeflow.adeo.no
2. Gå til "Notebook servers" i menyen til venstre
3. Klikk "+ NEW SERVER"
4. Huk av for "Custom image" og skriv inn docker.pkg.github.com/navikt/kubeflow-dataverk-base/:<version>
    - Erstatt <version> med seneste tag av dockerimaget (finnes på https://github.com/navikt/kubeflow-dataverk-base/packages/48749)
5. Antall CPU'er og minne for notebook-serveren kan spesifiseres. Oppfordrer til å bruke default-oppsettet her (0.5 cpu, 1.0Gi), dette kan også endres senere ved behov.
6. Trykk launch
```

## (optional) Legg til contributors
Namespacet som opprettes i "Opprett eget kubeflow namespace" er i utgangspunktet personlig. Dersom man ønsker å samarbeide med andre i kubeflow-namespacet kan man gjøre følgende:
```
1. Fra https://kubeflow.adeo.no, gå til "Manage Contributors" i menyen til venstre
2. Legg til nav-eposten til brukeren du ønsker å invitere (f.eks. Ola.Nordmann@nav.no)
```

# Oppdatering av team

## Oppdatere kubeflow docker image
```
Dersom man ønsker å oppdatere dockerimaget som teamet bruker gjøres dette ved å lage pr til navikt/kubeflow-yaml og endre image navnet for ditt team i teams.yaml
```

## Oppdatere minne/cpu
```
Dette er ikke selvbetjent foreløpig, men ved behov for å øke minne og/eller cpu for notebook-serveren kan man si ifra i #naisflow
```