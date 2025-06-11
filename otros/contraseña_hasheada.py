import os
import django
from django.contrib.auth.hashers import make_password

# Configura Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mi_proyecto.settings")
django.setup()

# Crear contraseña hasheada
hashed_password = make_password('123456')

print(hashed_password)
