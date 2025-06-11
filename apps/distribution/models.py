from django.db import models

class Catalogo(models.Model):
    ID_Articulo = models.AutoField(primary_key=True)
    ID_Empresa = models.BigIntegerField()
    Codigo_Principal = models.CharField(max_length=50, null=True, blank=True)
    Descripcion = models.CharField(max_length=255)
    Cantidad_Stock = models.IntegerField(default=0, null=True, blank=True)
    Unidad_Base = models.CharField(max_length=50)
    Precio_Compra = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    Precio_Base = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, null=True, blank=True)
    IVA = models.DecimalField(max_digits=5, decimal_places=2, default=0.00, null=True, blank=True)
    Caracteristicas = models.TextField(null=True, blank=True)
    Categoria = models.CharField(max_length=100, null=True, blank=True)
    Proveedor = models.CharField(max_length=255, null=True, blank=True)
    Fecha_Registro = models.DateTimeField(auto_now_add=True)
    Fecha_Actualizacion = models.DateTimeField(auto_now=True)
    Estado = models.CharField(max_length=20, default='ACTIVO', null=True, blank=True)

    class Meta:
        db_table = 'catalogo'  # Importante si ya existe en MySQL

# models.py
class InventarioSucursal(models.Model):
    sucursal_id = models.BigIntegerField()
    articulo = models.ForeignKey(Catalogo, on_delete=models.CASCADE)
    cantidad = models.IntegerField(default=0)
    ultima_actualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'inventario_sucursal'

class CatalogoUnidades(models.Model):
    id_conversion = models.AutoField(primary_key=True)
    id_articulo = models.IntegerField()
    id_empresa = models.BigIntegerField()
    unidad_origen = models.CharField(max_length=50)
    unidad_destino = models.CharField(max_length=50)
    factor_conversion = models.DecimalField(max_digits=10, decimal_places=4)
    precio_venta = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    es_vendible = models.BooleanField(default=True)
    codigo_barras = models.CharField(max_length=50, null=True, blank=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'catalogo_unidades'  # Esta línea es crucial
        verbose_name_plural = "Unidades de Catálogo"

    def __str__(self):
        return f"{self.id_articulo} - {self.unidad_origen} to {self.unidad_destino}"

from django.db import models
from django.conf import settings
from apps.account.models import Empresa, Sucursal

class SolicitudPedido(models.Model):
    ESTADOS = [
        ('Pendiente', 'Pendiente'),
        ('Denegado', 'Denegado'),
        ('En Preparacion', 'En Preparación'),
        ('Entregado', 'Entregado'),
        ('Cancelado', 'Cancelado'),
    ]

    pedido_id = models.CharField(max_length=20, null=True, blank=True)
    cantidad = models.IntegerField()
    factor = models.CharField(max_length=50, null=True, blank=True)
    codigo = models.CharField(max_length=50)
    descripcion = models.CharField(max_length=255, null=True, blank=True)
    departamento = models.CharField(max_length=100, null=True, blank=True)
    compra = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    venta = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    importe = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    comentario = models.TextField(null=True, blank=True)
    
    estado = models.CharField(max_length=20, choices=ESTADOS, default='Pendiente')  # Nuevo campo

    empresa = models.ForeignKey(Empresa, on_delete=models.SET_NULL, null=True)
    sucursal = models.ForeignKey(Sucursal, on_delete=models.SET_NULL, null=True)
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)

    fecha_registro = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'solicitudes_pedidos'
        ordering = ['-fecha_registro']