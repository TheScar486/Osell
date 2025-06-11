from rest_framework import serializers
from .models import Catalogo, InventarioSucursal

class CatalogoSerializer(serializers.ModelSerializer):
    stock_sucursal = serializers.SerializerMethodField()

    class Meta:
        model = Catalogo
        fields = ['ID_Articulo', 'Codigo_Principal', 'Descripcion', 'Unidad_Base', 'Precio_Compra', 'Proveedor', 
                'Precio_Base', 'stock_sucursal', 'Caracteristicas', 'Categoria']

    def get_stock_sucursal(self, obj):
        # Obtener la solicitud actual (request) del contexto
        request = self.context.get('request')
        if not request:
            return 0  # Si no hay request, devolvemos 0

        # Obtener el sucursal_id del usuario (asegurándote de que se almacene en el modelo de usuario)
        sucursal_id = request.user.sucursal_id  # Esto debe existir en el modelo del usuario

        # Buscar la cantidad en el inventario de esa sucursal y artículo
        inventario = InventarioSucursal.objects.filter(articulo_id=obj.ID_Articulo, sucursal_id=sucursal_id).first()
        
        return inventario.cantidad if inventario else 0  # Devolvemos la cantidad si existe, sino 0

# serializers.py
from .models import CatalogoUnidades

class CatalogoUnidadesSerializer(serializers.ModelSerializer):
    class Meta:
        model = CatalogoUnidades
        fields = ['id_conversion', 'id_articulo', 'id_empresa', 'unidad_origen', 'unidad_destino', 'factor_conversion', 'precio_venta', 'es_vendible', 'codigo_barras', 'fecha_registro']

from rest_framework import serializers
from .models import SolicitudPedido
from apps.account.models import Empresa, Sucursal
from django.contrib.auth.models import User  # O tu modelo de usuario personalizado

class SolicitudPedidoSerializer(serializers.ModelSerializer):
    empresa_nombre = serializers.CharField(source='empresa.nombre', read_only=True)
    sucursal_nombre = serializers.CharField(source='sucursal.nombre', read_only=True)
    usuario_username = serializers.CharField(source='usuario.username', read_only=True)

    class Meta:
        model = SolicitudPedido
        fields = [
            'id',
            'pedido_id',
            'cantidad',
            'factor',
            'codigo',
            'descripcion',
            'departamento',
            'compra',
            'venta',
            'importe',
            'comentario',
            'estado',  # Asegúrate de incluir el nuevo campo
            'empresa',
            'empresa_nombre',
            'sucursal',
            'sucursal_nombre',
            'usuario',
            'usuario_username',
            'fecha_registro'
        ]
        read_only_fields = ['fecha_registro']

# serializers.py

from rest_framework import serializers
from .models import SolicitudPedido

class SolicitudPedidoSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.CharField(source='usuario.username', read_only=True)
    grupo_nombre = serializers.CharField(source='sucursal.nombre', read_only=True)
    tipo = serializers.SerializerMethodField()  # <- Nuevo campo tipo

    def get_tipo(self, obj):
        return "Solicitud"

    class Meta:
        model = SolicitudPedido
        fields = [
            'pedido_id',
            'codigo',
            'descripcion',
            'cantidad',
            'estado',
            'fecha_registro',
            'usuario_nombre',
            'grupo_nombre',
            'tipo',  # <- Agrégalo aquí también
        ]

