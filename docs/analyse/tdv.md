---
title: TDV
---

Imager vi tilbyr for Jupyterhub og Airflow kommer uten TDV driver. Er du avhengig av denne driveren er du nødt til å enten bygge et custom image med driveren inkludert eller (for jupyterhub) laste den opp til hjemmeområde på Jupyterhub serveren.

Driveren finner du via utviklerimage ved å gå til `F:\DVH\TIBCO\drivers\TIB_tdv_drivers_x.x.x_all\apps\odbc\linux64` (erstatt x med ønsket versjon).

## Bygge custom image
For Airflow og dersom du ønsker å bygge eget image med driveren for Jupyterhub kan du legge til som følger i Dockerfilen:

```Dockerfile
# Add TDV ODBC driver and set env
COPY TDV/driver/libcomposite86_x64.so /opt/TDV/driver/libcomposite86_x64.so
RUN chown -R jovyan:users  /opt/TDV
ENV TDV_ODBC_DRIVER /opt/TDV/driver/libcomposite86_x64.so
```

!!! info"Merk: eksempelet over forutsetter at TDV driveren er inkludert i github repoet hvor imaget bygges på stien `TDV/driver/libcomposite86_x64.so`"

## Eksempel på bruk av TDV driver

```python
import os
import pyodbc
import pandas as pd

def create_tdv_conn(server: str, port: int, datasource: str, uid: str, pwd: str):
    conn_str = "DRIVER={" + os.environ["TDV_ODBC_DRIVER"] + "};DOMAIN=ADEO;SERVER=" + server + ";PORT=" + str(port) + ";DATASOURCE=" + datasource + ";UID=" + uid + ";PWD=" + pwd
    conn = pyodbc.connect(conn_str)
    conn.setencoding(encoding='utf-8')
    conn.setdecoding(pyodbc.SQL_WCHAR, encoding='utf-8')
    conn.setdecoding(pyodbc.SQL_CHAR, encoding='utf-8')
    return conn

conn = create_tdv_conn(server="tdv-p.adeo.no", port=1234, datasource="Plattform", uid=os.environ["TDV_USER"], pwd=os.environ["TDV_PASSWORD"])

df = pd.read_sql("SELECT * FROM schema.table", conn)
df.head()
```

!!! info"Kode eksempelet forutsetter at miljøvariabelen TDV_ODBC_DRIVER er satt til å peke på stien til TDV driveren. Dersom du ikke har [bygget eget image](#bygge-custom-image) og i stedet bare har lastet driveren opp til hjemmeområdet (`/home/jovyan`) på notebook serveren må du i stedet sette denne stien direkte."
