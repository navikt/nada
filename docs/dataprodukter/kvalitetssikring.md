Vi kan overvåke om BigQuery-tabellene står til forventningene våre gjennom [soda (ekstern lenke)](https://www.soda.io).
Sjekker evalueres, slack-varslinger sendes og resultater tilgjengeliggjøres når dere endrer bittelitt config i [denne templaten](https://github.com/navikt/dp-nada-soda) og deployer Naisjoben.

Sjekkene defineres i yaml.

Det er kjempeenkelt! 
Se for eksempel sjekken vi gjør for å se om tabellen `vedtak` er oppdatert siste døgn ved å se på observasjonene i kolonnen `innsamlet`:

```
checks for vedtak:
  - freshness(innsamlet) < 1d
```

[Dokumentasjonen til Soda](https://docs.soda.io/soda-cl/soda-cl-overview.html) beskriver godt hvilke sjekker som kommer ut av boksen og hvordan dere kan lage egendefinerte.

