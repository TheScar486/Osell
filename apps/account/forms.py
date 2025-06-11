from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import Empresa, Usuario

class EmpresaForm(forms.ModelForm):
    class Meta:
        model = Empresa
        fields = [
            'nombre_legal', 
            'nombre_comercial', 
            'ruc', 
            'direccion_fiscal',
            'telefono_contacto', 
            'email_contacto', 
            'sector_industrial'
        ]
        widgets = {
            'direccion_fiscal': forms.Textarea(attrs={'rows': 3}),
        }

class UsuarioForm(UserCreationForm):
    class Meta:
        model = Usuario
        fields = [
            'username',
            'first_name',
            'last_name',
            'email',
            'telefono',
            'cargo',
            'password1',
            'password2'
        ]