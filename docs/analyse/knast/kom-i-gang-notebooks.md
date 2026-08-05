# Kom i gang med Jupyter Notebooks i VSCode

I dette eksempelet skal vi lage et plot av åpne data fra SSB som et eksempel på hvordan man kan bruke Jupyter Notebooks i Knast.

!!! info "Celler i Jupyter Notebooks"
    I Jupyter Notebooks jobber man typisk i celler. Cellene i en Notebook kan for eksempel være Markdown, Python eller R og du kan legge til en ny celle ved å trykke på **+Code** eller **+Markdown**. Du kan bytte typen til cellen ved å trykke nederst til høyre i en celle.

Vi ønsker å gjøre analyse av [05984: Husdyr, etter husdyrslag og år](https://www.ssb.no/statbank/table/05984).

Man må typisk gjennom følgende steg:

1. Start Knast (VSCode)
2. Åpne i brannmur mot kilden
3. Sett opp et git-repo med virtuelt miljø
4. Lag en Jupyter Notebook

=== "Python Notebook"

    ## Åpne i brannmur mot datasett

    For å finne API-URL-en til datasettet:

    1. Gå til [05984: Husdyr, etter husdyrslag og år](https://www.ssb.no/statbank/table/05984)
    2. Klikk **Lagre** i venstre meny
    3. Scroll ned til **API-spørring**
    4. Velg **JSON-stat2 (.json)**
    5. Kopier **GET**-URL-en

    ``` { .text .copy }
    https://data.ssb.no/api/pxwebapi/v2/tables/05984/data?lang=no&outputFormat=json-stat2&valuecodes[ContentsCode]=*&valuecodes[Tid]=2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025&valuecodes[Husdyr]=*&heading=ContentsCode,Tid&stub=Husdyr
    ```

    Legg følgende inn i en tidsbegrenset brannmuråpning og aktiver den:

    ``` { .text .copy }
    data.ssb.no/api/pxwebapi/v2/tables/05984/*
    ```

    ## Sette opp et git-repo med et virtuelt miljø

    ```bash title="Terminal"
    gcloud auth login --update-adc
    pypi-auth

    mkdir -p ~/git/ssb/
    cd ~/git/ssb/
    uv venv
    source .venv/bin/activate
    uv pip install ipykernel pandas requests matplotlib

    touch ssb.ipynb # Dette lager en tom fil, man kunne også kjørt Ctrl-P: Create: New Jupyter Notebook
    code . #Dette åpner directoryet du står i
    ```

    ## Lage en Jupyter Notebook

    Åpne **ssb.ipynb** og velg kjøremiljø ved å trykke på **Select Kernel** → **Python environments** → **.venv** hvis den allerede ikke er valgt.

    Lag en Markdown-celle og lim inn følgende:

    ```markdown title="Markdown-celle"
    # Analyse av fødselsrater til hester
    Denne notebooken viser fødselstallene til hester de siste 10 årene i Norge.
    ```

    Trykk **Shift-Enter** for å kjøre cellen — Markdown-teksten vil bli rendret.

    Lag en ny Python-celle og lim inn følgende for å hente data fra SSB:

    ```python title="Hent data"
    import pandas as pd
    import requests
    from io import StringIO

    # URL til SSB API
    url = "https://data.ssb.no/api/pxwebapi/v2/tables/05984/data?lang=no&outputFormat=csv&valuecodes[ContentsCode]=*&valuecodes[Tid]=2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025&valuecodes[Husdyr]=*&heading=ContentsCode,Tid&stub=Husdyr"

    # Hent data
    response = requests.get(url)
    response.raise_for_status()

    # Les CSV til DataFrame
    df = pd.read_csv(StringIO(response.text), sep=',')

    df.head()
    ```

    Kjør cellen med **Ctrl-Enter** eller Kjør-knappen ved siden av cellen. Du skal få ut de første radene av datasettet og se at
    datasettet er på såkalt *wide format*: én rad per husdyrslag, og én kolonne per år (f.eks. `"Husdyr2 2013"`, `"Husdyr2 2014"`, osv.). Den første kolonnen `"Husdyr"` inneholder koder, ikke klartekstnavn.

    ## Finn riktig kode for hester

    Lag en ny celle og slå opp i metadata-APIet til SSB for å finne hvilken kode som tilsvarer hester:

    ```python title="Hent metadata"
    meta_url = "https://data.ssb.no/api/pxwebapi/v2/tables/05984/metadata?lang=no"
    meta = requests.get(meta_url).json()

    husdyr_koder = meta["dimension"]["Husdyr"]["category"]["label"]
    for kode, navn in husdyr_koder.items():
        print(f"{kode}: {navn}")
    ```

    ```text title="Output"
    11: Hestar
    01a: Storfe i alt
    13: Kyr
    02: Mjølkekyr
    ...
    ```

    Vi ser at koden for hester er `"11"`. Dette bruker vi til å filtrere riktig rad i neste steg.

    ## Filtrer og transformer data

    SSB-dataen er på wide format (ett år per kolonne). For å plotte trenger vi long format (én rad per år). Lag en ny celle:

    ```python title="Transformer til long format"
    # Filtrer på hester (kode "11")
    hest = df[df["Husdyr"] == "11"].copy()

    # Konverter fra wide til long format
    hest_long = hest.melt(id_vars="Husdyr", var_name="kolonne", value_name="antall")

    # Trekk ut årstall fra kolonnenavn på formen "Husdyr2 2013" -> 2013
    hest_long["år"] = hest_long["kolonne"].str.extract(r"(\d{4})").astype(int)
    hest_long = hest_long.sort_values("år")

    hest_long.head()
    ```

    ## Lag et plot

    Lag en ny celle og tegn opp utviklingen over tid:

    ```python title="Plot"
    import matplotlib.pyplot as plt

    plt.figure(figsize=(10, 5))
    plt.plot(hest_long["år"], hest_long["antall"], marker="o", color="steelblue")
    plt.title("Antall hester i Norge per år")
    plt.xlabel("År")
    plt.ylabel("Antall hester")
    plt.grid(True)
    plt.tight_layout()
    plt.show()
    ```

    Du skal nå se et linjediagram som viser utviklingen i antall hester i Norge fra 2013 til 2024.

=== "R Notebook"

    !!! note "R krever ekstra brannmuråpninger"
        R-pakker hentes fra CRAN via Posit sitt pakkerepo. Du må åpne mot både SSB og Posit i brannmuren før du starter.

    ## Åpne i brannmur mot datasett og pakkerepo

    Legg følgende adresser inn i tidsbegrensede brannmuråpninger og aktiver dem:

    1. SSB-datasettet:
    ``` { .text .copy }
    data.ssb.no/api/pxwebapi/v2/tables/05984/*
    ```

    2. [Posit sitt pakkerepo](https://packagemanager.posit.co/client/):
    ``` { .text .copy }
    packagemanager.posit.co/cran/latest/bin/linux/*
    rspm-sync.rstudio.com/bin/*
    ```

    ## Sett opp R-kernel i Jupyter Notebooks

    ```bash title="Terminal"
    mkdir -p ~/git/ssb-r/
    cd ~/git/ssb-r
    touch ~/git/ssb-r/ssb-r.ipynb
    code ~/git/ssb-r/
    ```

    Åpne `ssb-r.ipynb`, klikk på **Select Kernel** øverst til høyre, velg **Jupyter Kernel** og velg **R**.
    
    Lag en Markdown-celle og lim inn følgende:

    ```markdown title="Markdown-celle"
    # Analyse av fødselsrater til hester
    Denne notebooken viser fødselstallene til hester de siste 10 årene i Norge.
    ```

    Trykk **Shift-Enter** for å kjøre cellen — Markdown-teksten vil bli rendret.

    ## Installer pakker

    Lag en ny celle og kjør følgende (kun nødvendig første gang, kan ta noen sekunder):

    ```r title="Installer pakker"
    install.packages(c("httr", "readr", "jsonlite", "dplyr", "tidyr", "stringr", "ggplot2"))
    ```
    
    ### Opprette katalog for pakker
    ```
    Warning message in install.packages(c("httr", "readr", "jsonlite", "dplyr", "tidyr", :
    "'lib = "/home/user/R/x86_64-pc-linux-gnu-library/4.6"' is not writable"
    ```
    eller tilsvarende feil kan løses ved å opprette katalogen og prøve på nytt. Katalogen kan opprettes med kommandoen 
    ```shell title="Terminal"
      mkdir -p ~/R/x86_64-pc-linux-gnu-library/4.6

    ```

    ## Hent data fra SSB

    Lag en ny celle:

    ```r title="Hent data"
    Sys.setlocale("LC_ALL", "en_US.UTF-8")

    library(httr)
    library(readr)
    library(stringr)

    url <- paste0(
      "https://data.ssb.no/api/pxwebapi/v2/tables/05984/data",
      "?lang=no&outputFormat=csv",
      "&valuecodes[ContentsCode]=*",
      "&valuecodes[Tid]=2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024",
      "&valuecodes[Husdyr]=*",
      "&heading=ContentsCode,Tid&stub=Husdyr"
    )

    response <- GET(url)
    stop_for_status(response)

    df <- read_delim(I(content(response, as = "text", encoding = "UTF-8")), delim = ",", show_col_types = FALSE)
    head(df)
    ```
    
    Kjør cellen med **Ctrl-Enter** eller Kjør-knappen ved siden av cellen. Du skal få ut de første radene av datasettet og se at
    datasettet er på såkalt *wide format*: én rad per husdyrslag, og én kolonne per år (f.eks. `"Husdyr2 2013"`, `"Husdyr2 2014"`, osv.). Den første kolonnen `"Husdyr"` inneholder koder, ikke klartekstnavn.

    ## Finn riktig kode for hester

    Lag en ny celle og slå opp i metadata-APIet til SSB for å finne hvilken kode som tilsvarer hester:

    ```r title="Hent metadata"
    library(jsonlite)

    meta_url <- "https://data.ssb.no/api/pxwebapi/v2/tables/05984/metadata?lang=no"
    meta <- fromJSON(meta_url)

    husdyr_koder <- meta$dimension$Husdyr$category$label
    for (kode in names(husdyr_koder)) {
      cat(kode, ":", husdyr_koder[[kode]], "\n")
    }
    ```

    ```text title="Output"
    11 : Hestar
    01a : Storfe i alt
    13 : Kyr
    ...
    ```

    Koden for hester er `"11"`.

    ## Filtrer og transformer data

    Lag en ny celle:

    ```r title="Transformer til long format"
    library(dplyr)
    library(tidyr)

    hest <- df |>
      filter(Husdyr == "11") |>
      pivot_longer(
        cols = -Husdyr,
        names_to = "kolonne",
        values_to = "antall",
        values_transform = list(antall = as.double)
      ) |>
      mutate(aar = as.integer(str_extract(kolonne, "\\d{4}"))) |>
      arrange(aar)

    head(hest)
    ```

    ## Lag et plot

    Lag en ny celle:

    ```r title="Plot"
    library(ggplot2)

    ggplot(hest, aes(x = aar, y = antall)) +
      geom_line(color = "steelblue", linewidth = 1) +
      geom_point(color = "steelblue", size = 2) +
      labs(
        title = "Antall hester i Norge per år",
        x = "År",
        y = "Antall hester"
      ) +
      theme_minimal()
    ```

    Du skal nå se et linjediagram som viser utviklingen i antall hester i Norge fra 2013 til 2024.
