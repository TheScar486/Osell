from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from datetime import timedelta

class Empresa(models.Model):
    nombre_legal = models.CharField(max_length=100)
    nombre_comercial = models.CharField(max_length=100, null=True, blank=True)
    ruc = models.CharField(max_length=20, unique=True)
    direccion_fiscal = models.TextField()
    telefono_contacto = models.CharField(max_length=20, null=True, blank=True)
    email_contacto = models.EmailField(max_length=254, null=True, blank=True)
    sector_industrial = models.CharField(max_length=50, null=True, blank=True)
    cuenta_activa = models.BooleanField(default=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    fecha_activacion = models.DateTimeField(auto_now_add=True)
    fecha_expiracion = models.DateTimeField()
    motivo_estado = models.CharField(max_length=100, null=True, blank=True)
    ultima_actualizacion = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        # Establecer fecha de expiración por defecto (1 año después de registro)
        if not self.fecha_expiracion:
            self.fecha_expiracion = timezone.now() + timedelta(days=14)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nombre_legal
    
    # En tu archivo apps/account/models.py
from django.db import models
from .models import Empresa  # Asegúrate de que Empresa esté importada correctamente

class Sucursal(models.Model):
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE, related_name='sucursales')
    nombre = models.CharField(max_length=100)
    direccion = models.TextField()
    telefono_contacto = models.CharField(max_length=20, blank=True, null=True)
    email_contacto = models.EmailField(blank=True, null=True)
    responsable = models.CharField(max_length=100, blank=True, null=True)
    ciudad = models.CharField(max_length=50)
    pais = models.CharField(max_length=50)
    activa = models.BooleanField(default=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    ultima_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.nombre} - {self.ciudad}"

    class Meta:
        verbose_name = "Sucursal"
        verbose_name_plural = "Sucursales"

class Usuario(AbstractUser):
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE, related_name='usuarios')
    sucursal = models.ForeignKey(
        Sucursal,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='usuarios'
    )
    telefono = models.CharField(max_length=20, null=True, blank=True)
    cargo = models.CharField(max_length=50, null=True, blank=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    ultima_actualizacion = models.DateTimeField(auto_now=True)
    cuenta_activa = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.username} ({self.empresa.nombre_legal})"