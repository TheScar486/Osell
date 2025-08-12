"""
URL configuration for mi_app project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# settings_app/urls.py
from django.contrib import admin
from django.urls import path, include
from apps.account.views import home, error_502_view # Importa tu vista de error

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home, name='home'),
    path('account/', include('apps.account.urls')),
    path('distribution/', include('apps.distribution.urls')),
    path('logistics/', include('apps.logistics.urls')),
]

# Configura los manejadores de errores
handler502 = 'apps.account.views.error_502_view'
handler500 = 'apps.account.views.error_502_view' # También para errores 500
