---
title: iws-skedulering
---
# Skedulere Union jobber fra IWS
Som med Airflow vil det være mulig å skedulere Union-jobber fra IWS:

1. Lag en workflow i Union som gjør det du ønsker å kjøre fra IWS.
2. Gi beskjed i #dataplattform hvilket prosjekt som har jobbene som ønskes skedulert. Alle jobber innen dette prosjektet vil kunne skeduleres fra IWS. Dette er forløpig manuelt oppsett for Dataplattform.
3. Bestill en skedulering til LinWin-teamet i [FSDRIFT](https://jira.adeo.no/projects/FSDRIFT/) med:
    - Union prosjekt
    - Union domain (miljø)
    - Navn på jobben
    - Tidspunkt/frekvens som jobben skal kjøre

<div style="width:10%;aspect-ratio:155/150;">
    <object data="/img/iws-bestilling.png" type="image/png"></object>
</div>
