---
title: Skedulering av notebooks på GCP
---

Den enkleste måten å trigge en notebook periodisk fra en notebook server på GCP er å bruke en linux cronjob som kjører et python skript.

## Fremgangsmåte
For følgende eksempel antas det at det eksisterer en notebook kalt `my_nb.ipynb` som ønskes skedulert én gang i timen.

1. Installer python biblioteket [papermill](https://github.com/nteract/papermill) med `pip install papermill`
2. Lag en python fil kalt f.eks. `run_my_nb.py` og lim inn følgende kode
````python
#!/opt/conda/bin/python
import sys
import papermill as pm

if len(sys.argv) < 2:
    print("must provide notebook path")
    exit(1)

nb_name = sys.argv[1].split("/")[-1]

pm.execute_notebook(
   sys.argv[1],
   sys.argv[1].replace(nb_name, f"{nb_name.split('.')[0]}_output.ipynb")
)
````
3. For å trigge skriptet periodisk kan man da legge det til som en cronjob ved å kjøre kommandoen `crontab -e` fra terminal og lime inn følgende
````bash
0 * * * * /opt/conda/bin/python /absoulutt/sti/til/run_my_nb.py /absoulutt/sti/til/my_nb.ipynb > /sti/til/logfil.log
````

!!! info "Med oppsettet over vil notebooken `my_nb.ipynb` kjøres én gang hver hele time. Frekvensen til cronjobben stiller du på ved å endre cronutrykket (`0 * * * *` i eksempelet over). Se [her](https://crontab.guru/) for informasjon om hva de ulike feltene i et cronutrykk representerer."

