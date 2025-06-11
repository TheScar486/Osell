from django.urls import path
from . import views

urlpatterns = [
    path('', views.logistics_home, name='logistics'),
    path('inventory/', views.inventory_view, name='inventory'),
]