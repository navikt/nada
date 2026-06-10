# Kom igang med Jupyter Notebooks i VSCode
I dette eksempelet skal vi lage et plot av åpne data fra SSB som et eksempel på hvordan man kan bruke Jupyter Notebooks i Knast.


Vi ønsker å gjøre analyse av [05984: Husdyr, etter husdyrslag og år Informasjon ](https://www.ssb.no/statbank/table/05984).

Man må typisk gjennom følgende steg: 

* Starte Knast (VScode)
* Åpne i brannmur mot kilden
* Sette opp et git-repo med virtuelt miljø
* Lage en Jupyter Notebook

## Åpne i brannmur mot datasett
I dette eksempelet ønsker vi å benytte JSON-endepunktet til datasettet. Dette finner man om man går på linken til datasettet, **Lagre** i venstre meny, scroller ned til **API-spørring**, velger **JSON-stat2(.json)**, og kopierer **GET**-URL-en.


GET URL: https://data.ssb.no/api/pxwebapi/v2/tables/05984/data?lang=no&outputFormat=json-stat2&valuecodes[ContentsCode]=*&valuecodes[Tid]=2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025&valuecodes[Husdyr]=*&heading=ContentsCode,Tid&stub=Husdyr

Legg inn "data.ssb.no/api/pxwebapi/v2/tables/05984/data" i tidsbestemte husk å aktivere åpningen etterpå.

## Sette opp et git-repo med et virtuelt miljø
```bash
gcloud auth login --update-adc
pypi-auth

mkdir -p ~/git/ssb/
cd ~/git/ssb/
uv venv
source .venv/bin/activate
uv pip install ipykernel pandas requests matplotlib

touch ssb.ipynb # Dette lager en tom fil, man kunne også kjørt Ctrl-P: Create: New Jupyter Notebook
code .
```

## Lage en Jupyter Notebook
ssb-notebook.png
Velg kjøremiljø ved å trykke på **Select Kernel** -> Python environments -> .venv

Cellene i en Notebook kan enten være Markdown eller Python. Du kan bytte typen til cellen ved å trykke på f.eks **Python** nederst til høyre i en celle. Bytt til Markdown og lim inn følgende:
```markdown
# Analyse av fødselsrater til hester
Denne notebooken viser fødselstallene til hester de siste 10 årene i Norge.

```
Ved å så trykke Shift-Enter, så vil denne cellen bli kjørt og Markdown blir rendret.

Lag en ny celle ved å trykke på "+ Code". Nå vil vi forsøke å hente data fra SSB.
```python

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

Hvis du kjører cellen nå ved å trykke på Kjør-knappen ved siden av cellen eller ved å trykke Ctrl-Enter, så vil du få ut de førest radene av datasettet. Da vet du at det fungerte å hente data.

## Utforsk datastrukturen
Lag en ny celle og kjør følgende for å se hvilke kolonner datasettet har:
```python
print(df.columns.tolist())
print(f"Antall rader: {len(df)}")
df.head(3)
```

Du vil se at datasettet er på såkalt *wide format*: én rad per husdyrslag, og én kolonne per år (f.eks. `"Husdyr2 2013"`, `"Husdyr2 2014"`, osv.). Den første kolonnen `"Husdyr"` inneholder koder, ikke klartekstnavn.

## Finn riktig kode for hester
For å finne hvilken kode som tilsvarer hester, kan vi slå opp i metadata-APIet til SSB:
```python
# Hent metadata for å finne koder og klartekstnavn
meta_url = "https://data.ssb.no/api/pxwebapi/v2/tables/05984/metadata?lang=no"
meta = requests.get(meta_url).json()

# Skriv ut alle husdyrslag med tilhørende kode
husdyr_koder = meta["dimension"]["Husdyr"]["category"]["label"]
for kode, navn in husdyr_koder.items():
    print(f"{kode}: {navn}")
```

Output vil se slik ut:
```
11: Hestar
01a: Storfe i alt
13: Kyr
02: Mjølkekyr
...
```

Vi ser at koden for hester er `"11"`. Dette bruker vi til å filtrere riktig rad i neste steg.

## Filtrer og transformer data
SSB-dataen er på wide format (ett år per kolonne). For å plotte trenger vi long format (én rad per år). Lag en ny celle:
```python
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
```python
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

---

## Eksempel med R

Knast har R forhåndsinstallert, men alle pakker er ikke installert på forhånd. Derfor må man åpne mot CRAN

### Åpne i brannmur mot datasett og mot CRAN

```
data.ssb.no/api/pxwebapi/v2/tables/05984/data
cloud.r-project.org/src/*

```

Legg inn adressen i brannmuren og aktiver åpningen.

### Sett opp R-kernel i Jupyter Notebooks
IRkernel krever at `jupyter_client` er tilgjengelig i samme miljø. Opprett et eget virtuelt miljø for R-notebooken:

```bash
mkdir -p ~/git/ssb-r/
cd ~/git/ssb-r
uv venv
source .venv/bin/activate
uv pip install jupyter_client
```

Deretter installerer og registrerer du R-kernel:

```bash
R
```

I R-konsollen:

```r
install.packages("IRkernel")
IRkernel::installspec()
q()
```

Dette registrerer R som tilgjengelig kernel i Jupyter.

### Lag en Jupyter Notebook med R-kernel

```bash
touch ~/git/ssb-r/ssb-r.ipynb
code ~/git/ssb-r/
```

Åpne `ssb-r.ipynb`, klikk på **Select Kernel** øverst til høyre, og velg **R**.

### Installer pakker
Lag en ny celle og kjør følgende (kun nødvendig første gang):

```r
install.packages(c("httr", "readr", "jsonlite", "dplyr", "tidyr", "stringr", "ggplot2"))
```

### Hent data fra SSB
Lag en ny celle:

```r
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

### Utforsk datastrukturen
Lag en ny celle:

```r
cat("Kolonner:\n")
print(colnames(df))
cat(sprintf("Antall rader: %d\n", nrow(df)))
```

Datasettet er på *wide format*: én rad per husdyrslag, én kolonne per år (f.eks. `"Husdyr2 2013"`). Første kolonne `"Husdyr"` inneholder koder.

### Finn riktig kode for hester
Slå opp i metadata-APIet:

```r
library(jsonlite)

meta_url <- "https://data.ssb.no/api/pxwebapi/v2/tables/05984/metadata?lang=no"
meta <- fromJSON(meta_url)

husdyr_koder <- meta$dimension$Husdyr$category$label
for (kode in names(husdyr_koder)) {
  cat(kode, ":", husdyr_koder[[kode]], "\n")
}
```

Output vil se slik ut:

```
11 : Hestar
01a : Storfe i alt
13 : Kyr
...
```

Koden for hester er `"11"`.

### Filtrer og transformer data
Lag en ny celle:

```r
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

### Lag et plot
Lag en ny celle:

```r
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

