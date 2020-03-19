### Viktige innstillinger for produsenter
#### Acks
Produsenter i Kafka kan konfigureres til å prioritere sikkert mottak av meldinger eller oppfattet ytelse fra produsent siden. Dette styres av innstillingen `acks`. Mere detaljer finnes på [Kafka doc -> Producer configs -> acks](https://kafka.apache.org/documentation/#producerconfigs). 
Kort oppsummert:
- Hvis det viktigste er å ikke blokkere produsent tråden, sett denne til `0`, da legger kafka til meldingen i socketbuffer og anser meldingen som sendt. Dette er den dårligste garantien for at meldingen faktisk kommer fram, all den tid dette utelukker å bruke `retries` for å prøve igjen hvis sendingen feiler.
- Hvis man vil ha en bekreftelse fra lederen av partisjonen på at meldingen er lagret lokalt, sett denne til `1`. -- Litt tregere, da man faktisk venter på ett remote kall
- Hvis man må vite at alle replikaer har sett og lagret meldingen så kan man sette denne til `-1` eller `all`, da blokker kallet til alle replikaer har acket.  -- Tregeste og tryggeste
