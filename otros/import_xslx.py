import pandas as pd
import mysql.connector
from tkinter import Tk, filedialog
from dotenv import load_dotenv
import os

# ✅ Cargar configuración desde .env
load_dotenv("C:/Users/Usuario/Desktop/Scar/settings_app/.env")

DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

# ✅ Seleccionar archivo Excel
Tk().withdraw()
ruta_excel = filedialog.askopenfilename(
    title="Selecciona el archivo Excel",
    filetypes=[("Archivos Excel", "*.xlsx *.xls")]
)

if not ruta_excel:
    print("❌ No se seleccionó ningún archivo.")
    exit()

# ✅ Leer archivo Excel
df = pd.read_excel(ruta_excel)

# ✅ Conexión a MySQL
conexion = mysql.connector.connect(
    host=DB_HOST,
    port=int(DB_PORT),
    user=DB_USER,
    password=DB_PASSWORD,
    database=DB_NAME
)
cursor = conexion.cursor()

# ✅ Consulta para insertar
sql = """
    INSERT INTO catalogo (
        ID_Empresa,
        Codigo_Principal,
        Descripcion,
        Cantidad_Stock,
        Unidad_Base,
        Precio_Compra,
        Precio_Base,
        IVA,
        Caracteristicas,
        Categoria,
        Proveedor,
        Estado
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
"""

ID_EMPRESA = 5
ESTADO = "ACTIVO"

datos_a_insertar = []
contador = 0
omitidos = 0

for i, fila in df.iterrows():
    # Validar campos obligatorios
    codigo = fila.get("Codigo")
    descripcion = fila.get("Descripcion")
    unidad = fila.get("Unidad_Base")

    if pd.isna(codigo) or pd.isna(descripcion) or pd.isna(unidad):
        print(f"⚠️ Fila {i+2} omitida por falta de datos obligatorios.")
        omitidos += 1
        continue

    datos = (
        ID_EMPRESA,
        codigo,
        descripcion,
        int(fila["Cantidad_Stock"]) if not pd.isna(fila["Cantidad_Stock"]) else 0,
        unidad,
        float(fila["Precio_Compra"]) if not pd.isna(fila["Precio_Compra"]) else None,
        float(fila["Precio_Base"]) if not pd.isna(fila["Precio_Base"]) else 0.00,
        float(fila["IVA"]) if not pd.isna(fila["IVA"]) else 0.00,
        fila.get("Caracteristicas", None),
        fila.get("Categoria", None),
        fila.get("Proveedor", None),
        ESTADO
    )

    datos_limpios = [None if pd.isna(v) else v for v in datos]
    datos_a_insertar.append(tuple(datos_limpios))
    contador += 1

# ✅ Insertar registros en lote
try:
    cursor.executemany(sql, datos_a_insertar)
    conexion.commit()
    print(f"✅ Se insertaron {cursor.rowcount} registros correctamente.")
except mysql.connector.Error as err:
    print(f"❌ Error al insertar: {err}")

# ✅ Cerrar conexión
cursor.close()
conexion.close()

print(f"✅ Conexión cerrada.")
print(f"🔎 Total preparados: {contador} | Omitidos: {omitidos}")
