import pandas as pd
from sqlalchemy import create_engine
from tkinter import Tk
from tkinter.filedialog import asksaveasfilename
from dotenv import load_dotenv
import os

def exportar_tabla_excel():
    # Ruta del archivo .env
    dotenv_path = r"C:\Users\Usuario\Desktop\Scar\settings_app\.env"
    load_dotenv(dotenv_path)

    # Obtener variables como en Django
    db_name = os.getenv("DB_NAME")
    db_user = os.getenv("DB_USER")
    db_password = os.getenv("DB_PASSWORD")
    db_host = os.getenv("DB_HOST")
    db_port = os.getenv("DB_PORT")

    if not all([db_name, db_user, db_password, db_host, db_port]):
        print("❌ Faltan variables de conexión en el archivo .env")
        return

    # Crear cadena de conexión SQLAlchemy
    db_url = f"mysql+pymysql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"

    tabla = input("Ingrese el nombre de la tabla a exportar: ")
    try:
        engine = create_engine(db_url)

        df = pd.read_sql(f"SELECT * FROM {tabla}", engine)

        print("Espere... Se abrirá la ventana para seleccionar dónde guardar el archivo.")

        root = Tk()
        root.withdraw()
        root.attributes('-topmost', True)
        archivo = asksaveasfilename(
            defaultextension=".xlsx",
            filetypes=[("Excel files", "*.xlsx")],
            title="Guardar como",
            parent=root
        )
        root.destroy()

        if archivo:
            df.to_excel(archivo, index=False)
            print(f"✅ Tabla '{tabla}' exportada exitosamente a: {archivo}")
        else:
            print("❌ No se seleccionó ninguna ubicación para guardar.")

    except Exception as e:
        print(f"⚠️ Error al exportar: {e}")

if __name__ == "__main__":
    exportar_tabla_excel()
