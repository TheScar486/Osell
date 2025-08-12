from django.urls import path
from . import views

urlpatterns = [
    path('registro/empresa/', views.registro_empresa, name='registro_empresa'),
    path('registro/usuario/', views.registro_usuario, name='registro_usuario'),
    path('login/', views.login_view, name='login'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('logout/', views.logout_view, name='logout'),
    path('error-404/', views.error_404_view, name='error_404'),
]