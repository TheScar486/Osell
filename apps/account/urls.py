from django.urls import path
from . import views
from .views import error_502_view

urlpatterns = [
    path('registro/empresa/', views.registro_empresa, name='registro_empresa'),
    path('registro/usuario/', views.registro_usuario, name='registro_usuario'),
    path('login/', views.login_view, name='login'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('logout/', views.logout_view, name='logout'),
    path('error-502-bad-gateway/', error_502_view, name='error_502_bad_gateway'),
]