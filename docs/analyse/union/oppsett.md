---
title: Flyte
---

# Oppsett av Union

# Kom-i-gang guide Union
For å koble deg til Union må du opprette en konfigurasjonsfil. Denne filen kan enten opprettes globalt i hjemmeområdet ditt eller miljøspesifikt for prosjektet du jobber med. 

## Global konfigurasjonsfil
Ta utgangspunkt i config-filen under og erstatt `<prosjekt-navn>` med navnet på Union prosjektet til teamet ditt. Skriver du ikke inn et prosjekt her må du spesifisere prosjekt eksplisitt når du laster opp eller starter jobber som beskrevet i [Opplasting og kjøring av Union tasks](#opplasting-og-kjøring-av-union-tasks).

```yaml
admin:
  endpoint: dns:///union.data.nav.no
  insecure: false
  authType: Pkce
task:
  project: <prosjekt-navn>
  org: union-nav
```

Denne filen oppretter du på hjemmeområdet ditt på stien `~/.union/config.yaml` for de med linux/mac (og `C:\Users\<brukernavn>\.union\config.yaml` for de med windows ?). Denne konfigurasjonsfilen vil være gyldig for alle Union prosjekter du har tilgang til.

## Miljøspesifikk konfigurasjonsfil
For å opprette en miljøspesifikk konfigurasjonsfil kjør følgende kommando fra det lokale arbeidsområdet du jobber fra:

```bash
flyte create config --endpoint union.data.nav.no --org union-nav --project flytesnacks --domain development
```

Dette vil opprette en config fil i arbeidsområdet ditt under stien `./.flyte/config.yaml`.
Denne vil overstyre en eventuell global konfigurasjonsfil.
Brukerne kan på den måten ha en fil per miljø og spesifisere prosjekt/domene slik at ikke dette trenger å spesifiseres eksplisitt i kommandoene når tasker skal lastes opp eller trigges som beskrevet i [Opplasting og kjøring av Union tasks](#opplasting-og-kjøring-av-union-tasks).

## Krav til lokal maskin for å bruke Union
- Nav compliant device
- Docker installert på maskin