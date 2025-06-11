from django.urls import path
from . import views
from .views import catalogo_activo
from .views import SolicitudPedidoListView
from .views import export_solicitudes_excel

urlpatterns = [
    path('', views.distribution_home, name='distribution'),
    path('history/', views.history_view, name='history'),
    path('inbound_transfers/', views.inbound_transfers_view, name='inbound_transfers'),
    path('transfers/', views.transfers_view, name='transfers'),
    path('requests/', views.requests_view, name='requests'),
    path('catalogo/', catalogo_activo, name='catalogo_activo'),
    path('factores/', views.obtener_factores, name='obtener_factores'),
    path('crear/', views.crear_solicitud, name='crear_solicitud'),
    path('api/solicitudes/', SolicitudPedidoListView.as_view(), name='lista-solicitudes'),
    path('api/solicitudes/', SolicitudPedidoListView.as_view(), name='solicitudes_api'),
    path('export/excel/', export_solicitudes_excel, name='export_solicitudes_excel'),
    path('export/excel/<str:pedido_id>/', export_solicitudes_excel, name='export_solicitudes_excel_by_id'), # Nueva URL
]
