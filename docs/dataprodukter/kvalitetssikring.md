Vi kan overvåke om BigQuery-tabellene står til forventningene våre gjennom [Soda (ekstern lenke)](https://www.soda.io).
Sjekker evalueres, Slack-varslinger sendes og resultater tilgjengeliggjøres når dere endrer bittelitt config i [navikt/dp-nada-soda](https://github.com/navikt/dp-nada-soda) og deployer Naisjoben.

Sjekkene defineres i Yaml.

Se for eksempel sjekken vi gjør for å se om tabellen `vedtak` er oppdatert siste døgn ved å se på observasjonene i kolonnen `innsamlet`:

```
checks for vedtak:
  - freshness(innsamlet) < 1d
```

[Dokumentasjonen til Soda](https://docs.soda.io/soda-cl/soda-cl-overview.html) beskriver godt hvilke sjekker som kommer ut av boksen og hvordan dere kan lage egendefinerte.
