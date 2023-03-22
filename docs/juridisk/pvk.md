# Hvordan fyller jeg ut PVK?

Denne artikkelen tar utgangspunkt i [mal for PVK](https://navno.sharepoint.com/sites/intranett-personvern/SitePages/Retningslinjer.aspx).
Overskrifter korresponderer til overskrifter i malen, og vi tar kun for oss seksjoner som vi har kommentarer til.

!!! tip "Vær oppmerksom"
    Teamet ditt må selv ta ansvar for at PVK beskriver deres løsning.
    Hvis du bruker vår plattform kan du ta utgangspunkt i dette som beskrivelse.

    Tekst som er {==markert==} er ment som noe man bør ta stilling til.
    Kanskje det er noe som ikke gjelder dere, eller kanskje det er en eller flere av alternativene som er beskrevet som passer deres situasjon.

## Dokumentasjon og ajourhold

### Eksterne deltagere

#### Representant for databehandler

!!! note "Kommentar"
    Teamet må gjøre en vurdering av involvering av egne databehandlere.

Nada-plattformen bygger på GCP som har egen databehandleravtale.
[Dokumentert etterlevelse på NADA (B532)](https://etterlevelse.intern.nav.no/behandling/18089de7-829d-47e3-868b-53d4e5f251da/PERSONVERN/RELEVANTE_KRAV/krav/190/2/).


## Beskrivelse av behandlingen

### Behandlingskatalogen

#### Referansenummer i Behandlingskatalogen


{==fyll inn aktuelle behandlinger==}

[Dokumentert behandling for NADA-plattformen](https://behandlingskatalog.nais.adeo.no/process/team/3f85cdce-1257-4862-8ce3-3aec9b576df0/18089de7-829d-47e3-868b-53d4e5f251da).

### Støtte til etterlevelse

#### URL/Lenke til dokumentasjonen i Støtte til etterlevelse

{==fyll inn aktuell etterlevelsesdokumentasjon==}

[Dokumentert etterlevelse for NADA](https://etterlevelse.intern.nav.no/behandling/18089de7-829d-47e3-868b-53d4e5f251da).

### Risikovurdering av informasjonssikkerhet (personopplysningssikkerhet)

#### Referanse til relevante risikovurderinger (lenke, WebSaksnummer eller vedlegg)

{==fyll inn aktuelle risikovurderinger==}

[Risikovurderinger for ulike plattformer fra NAIS](https://docs.nais.io/legal/nais-ros/).

[Risikovurderinger for verktøyene i NADA og datamarkedsplassen](https://docs.knada.io/juridisk/dokumentasjon/#det-nada-har-gjort-allerede).

* [Analyseplattform på GCP (ROS 607)](https://apps.powerapps.com/play/e/default-62366534-1ec3-4962-8869-9b5535279d0b/a/f8517640-ea01-46e2-9c09-be6b05013566?ID=607)
* [DBT med Airflow på KNADA (ROS 1045)](https://apps.powerapps.com/play/e/default-62366534-1ec3-4962-8869-9b5535279d0b/a/f8517640-ea01-46e2-9c09-be6b05013566?ID=1045)
* [KNADA GKE (ROS 1239)](https://apps.powerapps.com/play/e/default-62366534-1ec3-4962-8869-9b5535279d0b/a/f8517640-ea01-46e2-9c09-be6b05013566?ID=1239)
* [NADA: BigQuery (ROS 969)](https://apps.powerapps.com/play/e/default-62366534-1ec3-4962-8869-9b5535279d0b/a/f8517640-ea01-46e2-9c09-be6b05013566?ID=969)
* [Datamarkedsplassen NADA (ROS 1005)](https://apps.powerapps.com/play/e/default-62366534-1ec3-4962-8869-9b5535279d0b/a/f8517640-ea01-46e2-9c09-be6b05013566?ID=1005)
* [Metabase (ROS 988)](https://apps.powerapps.com/play/e/default-62366534-1ec3-4962-8869-9b5535279d0b/a/f8517640-ea01-46e2-9c09-be6b05013566?ID=988)
* [Tilgangsstyring av data i GCP (ROS 787)](https://apps.powerapps.com/play/e/default-62366534-1ec3-4962-8869-9b5535279d0b/a/f8517640-ea01-46e2-9c09-be6b05013566?ID=787)

### Behandlingens art og omfang

#### Hvordan skal personopplysningene samles inn?

Vi samler ikke inn nye opplysninger.
Vi behandler personopplysninger som allerede er samlet inn i forbindelse med at bruker har {==[sendt inn søknad / sendt inn meldekort / registrert seg / sendt opplysninger / fått vurdering / *eller lignende* ]==}.
Dette betyr at vi ikke samler inn noen data, vi kun gjenbruker data som allerede er samlet inn.

**Behandling av data**

=== "Data fra produktteam"
    Dataene som behandles hentes fra {==fyll inn applikasjon==} som eies av {==fyll inn team==}.
    Data leses fra {==[Kafka / BigQuery / database]==}.
    Opplysninger er {==[pseudonymisert ved innhenting (Anbefalt) / blir pseudonymisert etter innhenting]==}, og er dermed å anse som personopplysninger.

    {==Kun analytiker har tilgang til data fra kilden.==}

    For sammenstilling av data mellom disse kildene eller for videre analyse utover eksisterende funksjonalitet i innsamlingsverktøy benyttes KNADA som er NADA sin analyseplattform i GCP.

    I KNADA har man muligheten til å opprette private Jupyter notebooks for å manuelt bearbeide data, mens man tilbyr det teambaserte orkestreringsverktøyet Airflow for å skedulere jobber for behandling av data.

    {==KNADA brukes til å jobbe med kilder on-premis, som [Oracle / Postgres], og kilder i GCP, som [Kafka / BigQuery / Postgres].==}
    For å få tilgang til KNADA må man registrere et team i Knorten, da vil man få muligheten til å installere Jupyter og Airflow.


    !!! tip "Hemmeligheter i notebook"
        Har man behov for hemmeligheter i notebooken så anbefaler vi at man bruker Google Secret Manager (GSM) i teamets prosjekt.
        En hemmelighet opprettet i GSM vil kun være tilgjengelig for de som har gitt seg tilgang til den, derfor anbefaler vi ikke at team opererer med admin-tilganger i sitt prosjekt.

        Man har mulighet til å gi en service account, opprettet i KNADA for teamet, tilgang til teamets hemmeligheter eller kilder i GCP.

    Det gjøres spørringer mot en klone av databasen som oppdateres hver natt.

=== "Data fra Datavarehus"
    Opplysninger leses fra DVH.
    Data ligger i en Oracle-database.
    Opplysningene er {==[psuedonymisert ved innhenting (Anbefalt) / blir pseudonymisert etter innhenting]==}, og er dermed å anse som personopplysninger.
    {==Analytiker har lesetilgang.==}

    For sammenstilling av data mellom disse kildene eller for videre analyse utover eksisterende funksjonalitet i innsamlingsverktøy benyttes KNADA som er NADA sin analyseplattform i GCP.
    I KNADA har man muligheten til å opprette private Jupyter notebooks for å manuelt bearbeide data, mens man tilbyr det teambaserte orkestreringsverktøyet Airflow for å skedulere jobber for behandling av data.

    KNADA brukes til å jobbe med kilder on-premis, som {==[Oracle / Postgres].==}

    Det gjøres spørringer mot databasen med dataanalytikers bruker.

=== "Data fra GCP"
    Teamet har et eget prosjekt i GCP, {==fyll inn navn på prosjekt==}, der data er lagret i BigQuery.
    Det hentes ikke data som er eldre enn fra {==fyll inn år==}.
    Person-ID er {==[pseudonymisert ved innhenting (Anbefalt) / blir pseudonymisert etter innhenting]==}, og er dermed å anse som personopplysninger.

    For sammenstilling av data mellom disse kildene eller for videre analyse utover eksisterende funksjonalitet i innsamlingsverktøy benyttes KNADA som er NADA sin analyseplattform i GCP.
    I KNADA har man muligheten til å opprette private Jupyter notebooks for å manuelt bearbeide data, mens man tilbyr det teambaserte orkestreringsverktøyet Airflow for å skedulere jobber for behandling av data.

    KNADA brukes til å jobbe med kilder i GCP, som {==[Kafka / BigQuery / Postgres].==}
    For å få tilgang til KNADA må man registrere et team i Knorten, da vil man få muligheten til å installere Jupyter og Airflow.

    !!! tip "Hemmeligheter i notebook"
        Har man behov for hemmeligheter i notebooken så anbefaler vi at man bruker Google Secret Manager (GSM) i teamets prosjekt.
        En hemmelighet opprettet i GSM vil kun være tilgjengelig for de som har gitt seg tilgang til den, derfor anbefaler vi ikke at team opererer med admin-tilganger i sitt prosjekt.

        Man har mulighet til å gi en service account, opprettet i KNADA for teamet, tilgang til teamets hemmeligheter eller kilder i GCP.

    Det gjøres spørringer mot BigQuery med BigQuery API klient og servicebruker.

#### Hvordan og hvor lenge skal personopplysningene lagres?

Personopplysningene blir midlertidig lagret i en periode på {==fyll inn varighet==}
Vi lagrer kun sluttresultatet, som er statistikk (aggregert og ikke personidentifiserende).
Tidvis mellomlagres resultat ved spesielt tunge spørringer.

!!! note "Anbefaling"
    Dette vil i så tilfelle kun mellomlagres mens analysen pågår og det brukes en påminnelse for gjennomgang av sletting av data minst en gang i måneden (Sletterutiner versus arkiveringslov).


### Behandlingens livsløp

#### Gi en beskrivelse av behandlingens livsløp

=== "GCP"
    Behandling av data i Analyseplattform i GCP utføres av {==x==} dataanalytikere i teamet.
    Det opprettes en egen notebookinstans for dette arbeidet som kun dataanalytikeren(e) har tilgang til.

    Behandlingen foregår i følgende steg:

    1. Innsamling av data
        - [Se spørsmålet over](#hvordan-skal-personopplysningene-samles-inn), hvordan skal personopplysningene samles inn
    2. Lagring av data
        - [Se spørsmålet over](#hvordan-og-hvor-lenge-skal-personopplysningene-lagres), hvordan og hvor lenge skal personopplysningene lagres
    3. {==Pseudonymisering/anonymisering==}
        - *Hvis aktuelt*, beskriv metode for pseudonymisering og/eller anonymisering gjort av analytiker.
        - Referer til TADA ved spørsmål for valg av metode.
        - Alternativt beskriv hvorfor det ikke blir gjort, eller beskriv at det er gjort i kildesystemet ved innsamling av data, steg 1
    4. Sammenstilling av data i notebook (i Analyseplattformen i GCP)
        - Dataene som samles inn fra databaser leses fra en notebook, ved at det gjøres spørringer mot en kilde.
        - {==Fyll inn navn på datakilder, feks løsning, datavarehus, BigQuery.==}
        - Se beskrivelser av innsamling av data og lagring av data.
            - Undersøker, formaterer, sammenstiller, aggregerer og anonymiserer hentede data, dette skjer hovedsakelig i spørring mot databaser eller i notebook.
    5. Resultater publiseres og deles
        - Data blir aggregert og anonymisert før publisering av datasett og visualiseringer som rapporter (datafortellinger tilgjengelig på markedsplassen) eller interaktive dashboards (metabase). Aggregerte resultater kan også deles på andre måter (f.eks ved å sende datasett).
    6. Automatisk publisering av data
        - Det skeduleres til å oppdateres jevnlig med orkestreringsverktøyet Airflow (del av Analyseplattform) eller i GCP.
    7.	Sletting av data
        - Når man ikke lenger har behov for å utvikle ny statistikk, slettes personopplysninger og data som er grunnlag for analysen i henhold til sletterutiner, vennligst se vedlagt rutine.
=== "On-prem"
    Her er det ikke noe enda!


#### Referanse til supplerende vedlegg

Dataprodukt og markedsplassen er beskrevet i [dokumentasjonen til NADA](https://docs.knada.io/dataprodukter/dataprodukt/).

#### Oppgi eventuelle opplysninger for denne vurderingen sammenlignet med beskrivelsen av hele verdikjeden eller beskrivelsen av aktuell behandling i behandlingskatalogen

Vurderingen gjelder behandling fra uttrekk fra database, til visualisering av statistikk i dashboard og/eller innsiktsprodukter som oppdateres {==[daglig / ukentlig / månedlig]==}.

Vurderingen baserer seg på dataplattformen sine løsninger, som er beskrevet i {==[behandlingskatalogen / etterlevelseskatalogen / egen PVK / følgende ROSer]==}

Dataplattformen baserer seg på databehandleravtaler {==for..., og andre vurderinger.==}

{==Disse er lenket til over i form av behandlingskatalog, etterlevelses-verktøy, ROSer og lenke til aktuelle ROSer fra plattformtjenestene til nais==}

## Konsekvenser og tiltak

!!! tip "Vær oppmerksom"
    Denne seksjonen omfatter *Konsekvenser for den enkelte*, samt *Tiltak*.
    Hvert scenario inneholder tekst som passer i konsekvensdelen: beskrivelse, forslag til konsekvens- og risikonivå, vurdering av konsekvens og risko. I tillegg inneholder visse scenario tiltak, som hører til i *tabell for risikoreduserende tiltak*.

=== "Scenario 1"
    **Den registrerte får ikke tilstrekkelig informasjon om hvordan deres personopplysninger behandles fordi...**

    Det blir ikke gitt tilstrekkelig informasjon om at data benyttes til statistikk og analyse.
    Den registrerte blir informert om behandlingen gjennom [den generelle personvernerklæringen](https://www.nav.no/no/NAV+og+samfunn/Om+NAV/personvern-i-arbeids-og-velferdsetaten/personvernerkl%C3%A6ring-for-arbeids-og-velferdsetaten).

    Velg hvilket scenario som passer deres løsning best:

    === "Personvernerklæringen finnes på nav.no"
        Den generelle personværnerklæringen kan finnes på nav.no.

        !!! info "Foreslått nivå"
            - Sannsynlighetsnivå: **4**
            - Konsekvensnivå: **3**

        **Beskriv deres vurdering av sannsynlighet**

        Ettersom det forutsetter at brukeren oppsøker informasjon om personvernserklæringen på nav.no, er det en stor sannsynlighet for at bruker ikke får tilstrekkelig informasjon om behandlingen av personopplysninger til statistikk og analyseformål.
        Det er sannsynlig at informasjonen ikke er spesifikk nok med tanke på hvordan personopplysningene faktisk behandles.

        **Beskriv deres vurdering av konsekvens**

        En konsekvens for bruker er at retten til informasjon ikke er innfridd som videre kan gjøre det vanskelig for dem å ivareta sine personvernrettigheter.
        Den registrertes rett til personvern krenkes i en større periode eller involverer særlige kategorier/sårbare grupper

        **Tiltak**

        Sørge for at det kommer på plass en henvisning til NAVs personvernerklæring i forbindelse med innhenting av opplysninger.
        I personvernerklæringen er bruk av personopplysninger til statistikk og analyseformål nærmere beskrevet.

    === "Personvernerklæringen finnes i søknadsdialogen"
        Den generelle personvernerklæringen er lenket til fra søknadsdialogen

        !!! info "Foreslått nivå"
            - Sannsynlighetsnivå: **3**
            - Konsekvensnivå: **3**

        **Beskriv deres vurdering av sannsynlighet**

        Ettersom det ikke gis informasjon om utarbeidelse av statistikk og analyse i forbindelse med innhenting av opplysninger for er det en viss sannsynlighet for at bruker ikke får tilstrekkelig informasjon om behandlingen av personopplysninger til dette formålet.
        Dessuten er det en sannsynlighet for at informasjonen ikke er spesifikk nok med tanke på hvordan personopplysningene faktisk behandles.

        **Beskriv deres vurdering av konsekvens**

        En konsekvens for bruker er at retten til informasjon ikke er innfridd som videre kan gjøre det vanskelig for dem å ivareta sine personvernrettigheter.
        Den registrertes rett til personvern krenkes i en større periode eller involverer særlige kategorier/sårbare grupper

    === "Søknadsdialogen gir info om behandling av personopplysninger"

        Det gis informasjon i søknadsdialogen om at opplysningene behandles til utarbeidelse av anonymisert statistikk og analyse.

        !!! info "Foreslått nivå"
            - Sannsynlighetsnivå: **2**
            - Konsekvensnivå: **3**

        **Beskriv deres vurdering av sannsynlighet**

        Det er en viss sannsynlighet for at bruker ikke får tilstrekkelig informasjon om behandlingen av personopplysninger til dette formålet eller ikke forstår informasjonen.
        Dessuten er det en sannsynlighet for at informasjonen ikke er spesifikk nok med tanke på hvordan personopplysningene faktisk behandles.

        **Beskriv deres vurdering av konsekvens**

        En konsekvens for bruker er at retten til informasjon ikke er innfridd som videre kan gjøre det vanskelig for dem å ivareta sine personvernrettigheter.
        Den registrertes rett til personvern krenkes i en større periode eller involverer særlige kategorier/sårbare grupper

=== "Scenario 2"
    **Det samles inn flere personopplysninger enn det som er nødvendig for formålet fordi...**

    Erfaringsmessig vil det forekomme overskuddsinformasjon, til tross for at teamet i forkant har definert hvilke kategorier personopplysninger som er nødvendig for å gjennomføre analysen.
    Dette skyldes ofte manglende oversikt over hva som finnes i NAVs datakilder.
    Det er derfor mulig at vi henter ut flere opplysninger og/eller opplysninger på et detaljnivå som senere viser seg å være unødvendig detaljert.

    !!! info "Foreslått nivå"
        - Sannsynlighetsnivå: **5**
        - Konsekvensnivå: **3**

    **Beskriv deres vurdering av sannsynlighet**

    Det er sannsynlig at dette skjer fordi læring underveis og resultatet av analysen kan vise at vi hadde fått samme innsikt ved å bruke færre opplysninger og /eller mindre detaljerte opplysninger.

    Dersom det benyttes {==flere pseudonymiserte==} personopplysninger enn nødvendig for formålet vil dette kun skje i en begrenset periode fra data hentes til analyse og statistikk utarbeidet.

    {==Dataen vil kun ligge i minnet på arbeidsinstansen frem til analysen er ferdigstilt. I denne perioden er det utelukkende datascientisten som har tilgang til denne dataen.==}
    Personopplysninger som eventuelt vil gå ut over det som er nødvendig for formålet vil ikke bli brukt videre i annen form enn eventuelt anonymisert og konsekvensen vil dermed være begrenset.

    I informasjonen som er innhentet er det fritekstfelter og vedlegg, hvor man på forhånd ikke kan vite hva som står. Det kan gjøres feil ved å hente inn deler av disse som ikke er nødvendige for å utarbeide den aktuelle statistikken. Dataene som blir hentet inn overskrives (slettes fra minnet) hvis

    I de tilfeller der det viser seg i etterkant at analysen kan gjøres med mindre data vil vi fortløpende endre analysen til ikke å inkludere denne dataen. Dette gjøres fortløpende og vil derfor kun i en kort periode utfordre den registrertes rett til personvern.

    **Beskriv deres vurdering av konsekvens**

    * Den registrertes rett til personvern krenkes i en større periode eller involverer særlige kategorier/sårbare grupper
    * Den registrertes tillit til NAV utfordres

    Prinsippet om dataminimering er vanskelig å gjennomføre.
    Økt mengde personopplysninger gir økt risiko for reidentifisering og at opplysninger brukes til andre formål.
    Perioden det skjer i vil være begrenset, og blir ikke brukt videre i annen form enn eventuelt anonymisert.

    **Tiltak**

    1. At tabellene som brukes er tilstrekkelig dokumentert og at personen som bruker dem kjenner til denne dokumentasjonen.
        * Det utarbeides en oversikt over hva de ulike tabellene inneholder, for å unngå å hente opplysninger det ikke er behov for.
        Dialog med fagpersoner for å få klarhet i innholdet.
        * I tillegg er det inntatt beskrivelser om hvordan spørringer skal gjøres i rutine.
    2. Begrense tilgang til tabeller som brukes
        * Rutiner for tilgang til tabeller.
        * Dialog med databaseteam.
    3. Kunnskap og bevissthet rundt hvordan slette data, hvis det er kommet inn for mye opplysninger

=== "Scenario 3"
    **Personopplysninger lagres lengre enn det som er nødvendig for formålet fordi...**

    Det er en risiko for at manuelle sletterutiner ikke gjennomføres, eller at de gjennomføres for sjeldent.

    * Personopplysninger som mellomlagres for å gjennomføre analyser i {==[Notebook / BigQuery]==} blir ikke slettet manuelt etter gjennomført analyse.
    * Personopplysninger som er i minnet i Notebookinstansen (dvs at det lages en visning av dataene i minnet) underveis i arbeidsøkten ikke slettes manuelt etter endt arbeidsøkt.

    !!! info "Foreslått nivå"
        - Sannsynlighetsnivå: **3**
        - Konsekvensnivå: **3**

    **Beskriv deres vurdering av sannsynlighet**

    {==Det er utarbeidet sletterutiner, se vedlegg.==}
    Det er imidlertid alltid en risiko for at rutiner ikke følges og at de manuelle sletterutinene ikke gjennomføres.
    Sannsynlighetsnivået settes til nivå tre {==ettersom ikke alle sletterutinene er automatisert==}

    **Beskriv deres vurdering av konsekvens**

    En konsekvens er at personopplysninger lagres lenger enn nødvendig for formålet, som bryter med lagringsprinsippet og dataminimeringsprinsippet.
    Personopplysningene vil imidlertid ikke kunne benyttes til andre formål når de er lagret i GCP, {==og det er kun teamet som har tilgang til lagringsstedene.==}

    **Tiltak**

    Sletterutiner er utarbeidet, se vedlegg.

=== "Scenario 4"
    **Personopplysningene som behandles er ikke korrekte fordi...**

    Analyse og statistikk tar utgangspunkt i informasjon som er gitt fra bruker eller saksbehandler, og en eventuell feil vil være basert på at brukere har gitt feil informasjon eller saksbehandler har fylt inn feil.
    Teknisk kan det også skje feil avlesninger når det er felter som skrives inn manuelt, slikt som antall timer som kan skrives med punkt, komma osv.
    Dette kan medføre at informasjonen tolkes feil.

    !!! info "Foreslått nivå"
        - Sannsynlighetsnivå: **1**
        - Konsekvensnivå: **1**

    **Beskriv deres vurdering av sannsynlighet**

    På bakgrunn av personopplysningene som behandles gis direkte fra den registrerte er det lite sannsynlig at denne ikke er korrekt, og det er for alle tilfeller noe som er utenfor NAVs kontroll.

    Tekniske feil ved avlesning vil i svært liten grad skje, og er i stor grad kun aktuelt for fritekstfelt.

    **Beskriv deres vurdering av konsekvens**

    Eventuelle feil i personopplysninger vil kun få betydning for de analysene som gjennomføres, ved at statistikken ikke blir korrekt.
    Behandling av ukorrekte opplysninger ved utarbeidelse av statistikk og analyse gir imidlertid ingen direkte konsekvenser for den registrerte, og konsekvensnivået settes dermed lavt.

=== "Scenario 5"
    **Rolle- og ansvarsforholdet for personvern i behandlingen er ikke avklart fordi...**

    {==Risikoeier er PO, v/PO leder. Større risikoer løftes til ytelsesdirektør.==}
    Arbeidet med statistikk og analyse skjer i {==[team / PO]==}, og det er dataanalytiker og andre medlemmer i teamet som jobber med dataen som er ansvarlig for behandlingene.

    !!! info "Foreslått nivå"
        - Sannsynlighetsnivå: **2**
        - Konsekvensnivå: **3**

    **Beskriv deres vurdering av sannsynlighet**

    Det kan bli endringer i intern organisering i NAV som kan medføre endringer i rolle- og ansvarsforholdet.
    Dersom en som er ny i rollen behandler dataene kan dette medføre at vedkommende bruker data som han/hun ikke har hjemmelsgrunnlag til å bruke.

    **Beskriv deres vurdering av konsekvens**

    På bakgrunn av at behandlingen ikke får noen direkte konsekvenser for individet anses konsekvensen lav dersom rolle- og ansvarsforholdene ikke er avklart anses konsekvensene som minimale.

    **Tiltak**

    Gjøre retningslinjer kjent på tvers av teamet, samt ledelse i PO.

=== "Scenario 6"
    **Den registrerte får ikke innsyn i alle sine personopplysninger i behandlingen fordi...**

    Den registrerte i innsynsløsningen ikke får vite hva slags opplysninger som er brukt til analyse og statistikk.
    Programvaren som benyttes til analysearbeid har ikke funksjonalitet for dette.

    !!! info "Foreslått nivå"
        - Sannsynlighetsnivå: **3**

    **Beskriv deres vurdering av sannsynlighet**

    Analyse i denne sammenhengen medfører at det trekkes ut en kopi av personopplysninger.
    Personopplysningene kan i en kort periode lagres pseudonymisert i NAVs Analyseplattform i GCP før de slettes.
    Den registrertes mulighet for innsyn forutsettes håndtert der informasjonen samles inn og vurderes ikke særskilt i denne PVK.

    Da det ikke gis innsyn i hvilke personopplysninger som er gjenstand for statistikk og analyse, settes sannsynlighetsnivået deretter.

    **Beskriv deres vurdering av konsekvens**

    === "Konsekvensnivå 1"
        Den registrerte får innsyn i sine personopplysninger gjennom innsynsløsningen og/eller systemløsningene hvor informasjonen innhentes.

        Konsekvensene ved manglende innsyn i behandlingen som gjøres for statistikk og analyse anses derfor som lav.

        Dette scenarioet må imidlertid ses i sammenheng med scenario om rett til informasjon, da informasjon om behandlingen også vil avhjelpe brukers behov for innsyn.

    === "Konsekvensnivå 2"
        Det finnes ikke innsynsløsninger.
        Den registrerte kan kun få innsyn i sine personopplysninger ved å gjøre manuelle uttrekk av der informasjonen innhentes.

        Konsekvensene ved manglende innsyn i behandlingen som gjøres for statistikk og analyse anses derfor som middels.

        Dette scenarioet må imidlertid ses i sammenheng med scenario om rett til informasjon, da informasjon om behandlingen også vil avhjelpe brukers behov for innsyn.

=== "Scenario 7"
    **Det er en risiko for at personopplysninger kommer på avveie fordi..**

    * Tilgangsstyringen til personopplysningene er ikke god nok, herunder rutiner for å fjerne tilganger
    * Personopplysninger publiseres eller deles ved feil.
    * Credentials for tilgang til personopplysninger kommer på avveie, f.eks at de publiseres i kode.

    Notebook er eksponert til internett (kan kobles på internett utenfor organisasjonen). Hvilket medfører en økt risiko for at data kommer på avveie, som følge misbruk av data av en ansatt i NAV (utro tjener).

    !!! info "Foreslått nivå"
        - Sannsynlighetsnivå: **4**
        - Konsekvensnivå: **4**


    **Beskriv deres vurdering av sannsynlighet**

    Tilgang:

    * I de fleste tilfeller må tilgang gis til enkelt ansatte med tjenstlig behov.
    Da er det mulig å få tilgang til mer enn det som er nødvendig.
    * En person må ofte bli lagt til i et team for å få teamtilganger.
    Da er det mulig å bli gitt for store tilganger.
    * I GCP er det mulig å gi seg selv tilganger.
    Dette må gjøres aktivt, også her er det mulig å gi seg selv for vide tilganger.
    * Etter at en ikke lenger er medlem av team eller en ikke lenger trenger tilganger en er blitt gitt manuelt kan det ta tid før tilgangene blir fjernet.
    En ansatt i NAV kan dermed ha tilgang til data uten tjenstlig behov.

    Sannsynligheten for at en ansatt i NAV har for store tilganger og dermed har tilgang til personopplysninger uten tjenstlig behov anses som relativt høy.

    Deling ved feil:

    * Personopplysninger kan publiseres ved feil og bli tilgjengelige der fordi koden som ble pushet eller dataene som ble publisert ikke ble sjekket godt nok.
    * Tilganger kan også ved feil bli publisert til github og dermed bli tilgjengelig for andre uten tjenstlig behov.
    Dette avhjelpes med at kode for behandling av data lagres i privat repo i GitHub.
    * Det kan ikke utelukkes at menneskelige feil skjer.

    Misbruk:

    * GCP er eksponert til internett slik at det er mulig å dele data ut av NAV.
    Det skal imidlertid mye til for at dette skjer, og vil kun være aktuelt ved misbruk.
    Sannsynligheten for misbruk av data av NAV-ansatte må imidlertid anses som lav {==(Se ROS med ID 607)==}.

    **Beskriv deres vurdering av konsekvens**

    Personopplysninger som kommer på avveie vil kunne ha konsekvenser for den registrerte, herunder tap av konfidensialitet.
    Det kan igjen medføre andre negative konsekvenser for den registrerte som sosiale ulemper, identitetstyveri, bedrageri, stigmatisering og lavere tillitt til NAV.

    **Tiltak**

    Det kjøres script som forhindrer at notebookfiler pushes med output som kan inneholde personopplysninger.

    1. Credentials eller personopplysninger kommer på avveie
        * Lagre tilganger i secret manager som vault eller google secret manager.
        * Rutine for å sjekke kode som lagres i github.
    2. Data deles eller publiseres ved feil
        * Rutine for å sjekke kode som lagres i github, publiseres i datapakke eller deles før publisering/deling.
    3. Tilgang i GCP eller andre databaser
        * Gi seg selv eller få minst mulig tilganger for å oppnå formålet.

=== "Scenario 8"
    **Behandlingen av personopplysninger brukes til et annet formål enn de ble innsamlet for.**

    Det er en risiko for at opplysninger innhentet for en analyse kan bli brukt til analyser for andre formål enn det de ble innsamlet for.

    !!! info "Foreslått nivå"
        - Sannsynlighetsnivå: **2**
        - Konsekvensnivå: **3**

    **Beskriv deres vurdering av sannsynlighet**

    Teamet har et tydelig fastsatt formål for behandlingen.
    Det er imidlertid alltid en fare for at man i et slikt manuelt analysearbeid beveger seg utenfor det beskrevne formålet.
    Ettersom det er stor bevissthet i teamet og det er få som har tilgang til, og analyserer denne dataen, er det liten sannsynlighet for at man beveger seg utenfor det beskrevne formål.

    **Beskriv deres vurdering av konsekvens**

    Dersom opplysningene gjenbrukes til analyser med et annet formål enn det fastsatte, vil dette ikke få direkte konsekvenser for bruker.
    Det strider mot personvernprinsippet, at man bruker personopplysninger som er avgitt til noe annet enn det det er gitt informasjon om.

    **Tiltak**

    Alle på teamet skal gjøres godt kjent med formålet for arbeidet.

=== "Scenario 9"
    **Analyse og statistikk blir ikke tilstrekkelig anonymisert fordi...**

    Analyserer for «små» datasett slik at personer kan bli re-identifisert.

    !!! info "Foreslått nivå"
        - Sannsynlighetsnivå: **1**
        - Konsekvensnivå: **4**

    **Beskriv deres vurdering av sannsynlighet**

    I de fleste tilfeller vil det behandles store mengder data når det skal foretas analyse, men det gjøres også analyser på små grupper (mindre enn fire personer) som det vil være mulig å re-identifisere.

    {==Små grupper er med i tellingen, men fjernes fra statistikken.==}

    **Beskriv deres vurdering av konsekvens**

    For det tilfelle at statistikken som utarbeides ikke er anonymisert vil det kunne fremgå mye informasjon fra den enkelte registrerte (dersom det er mulig å lese dette ut av statistikken).
    For det tilfelle at statistikken deles bredt vil personopplysninger kunne eksponeres for mange som ikke har noe tjenstlig behov for disse.

    **Tiltak**

    Vi lagrer ikke grupper på mindre enn fem personer, hverken i tabeller eller i plott.

=== "Scenario 10"
    **Det oppbevares flere kopier av samme informasjon i form av mellomlagring mv, som ikke er omfattet av slettereglene.**

    I de fleste tilfeller benyttes det data som kan hentes programmatisk for analyse.
    Men det forekommer at {==grunnlagsdata med personinformasjon (hovedsakelig i fritekstfelt) lastes opp og lagres==} på lokal PC og deretter i notebook for å utføre analyse og/eller lage statistikk.

    !!! info "Foreslått nivå"
        - Sannsynlighetsnivå: **2**
        - Konsekvensnivå: **2**

    **Beskriv deres vurdering av sannsynlighet**

    De aktuelle lagringsstedene er dekket {==av manuell sletterutine==}, se rutine for statistikk og analyse.

    Det er risiko forbundet med manuelle sletterutiner, og det er en høyere sannsynlighet for at disse ikke gjennomføres enn ved automatisk sletting.

    **Beskriv deres vurdering av konsekvens**

    Data med personopplysninger lagres og mellomlagres i hovedsak på områder som {==kun dataanalytiker eller teamet har tilgang til.==}
    Tilgangen er dermed svært begrenset.

    Dersom personopplysningene ikke slettes behandler NAV personopplysninger i strid med personvernprinsippene og i større grad enn nødvendig.

    **Tiltak**

    Nye lagringssteder skal inkluderes i lagrings- og sletterutiner, dette er beskrevet i rutine.

=== "Scenario 11"

    **Tiltak**

    Filtrere bort personer med diskresjonskode når data som inneholder personidentifiserende informasjon og saksopplysninger om person hentes.

    Unngå å utføre analyser der informasjon om person, f.eks. lokasjon, aggregeres slik at datasett får små antall.

    Det må inntas beskrivelser i rutine.

    *Kode 6 7 filtrering fra plattformen?*
