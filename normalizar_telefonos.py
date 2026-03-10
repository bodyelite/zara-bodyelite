import pandas as pd
import re

def limpiar(t):
    if pd.isna(t): return None
    c = re.sub(r'\D', '', str(t))
    if len(c) == 9 and c.startswith('9'): return "56" + c
    if len(c) == 11 and c.startswith('56'): return c
    if len(c) == 12 and c.startswith('569'): return c
    return c

try:
    r = pd.read_csv("citas 1 marzo a 15 marzo.xls - Citas.csv")
    r['Telefono_Limpio'] = r['Telefono'].apply(limpiar)
    r.to_csv("citas_normalizado.csv", index=False)
    
    m = pd.read_csv("meta 1 al 9 marzo.xlsx - Worksheet.csv")
    m['Phone_Number_Limpio'] = m['Phone_Number'].apply(limpiar)
    m.to_csv("meta_normalizado.csv", index=False)
    
    z = pd.read_csv("Zara dash acumulado.csv", sep=";")
    z['Telefono_Limpio'] = z['Telefono'].apply(limpiar)
    z.to_csv("zara_normalizado.csv", index=False, sep=";")
    
    print("archivos normalizados generados")
except Exception as e:
    print(e)
