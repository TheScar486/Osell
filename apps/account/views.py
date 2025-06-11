from django.shortcuts import render

def home(request):
    return render(request, 'account/home.html')  # o el nombre de tu template

from django.shortcuts import render, redirect
from django.contrib.auth import login
from django.contrib import messages
from .forms import EmpresaForm, UsuarioForm
from .models import Empresa, Usuario

def registro_empresa(request):
    if request.method == 'POST':
        form = EmpresaForm(request.POST)
        if form.is_valid():
            empresa = form.save()
            request.session['empresa_id'] = empresa.id
            return redirect('registro_usuario')
    else:
        form = EmpresaForm()
    
    return render(request, 'account/registro_empresa.html', {'form': form})

def registro_usuario(request):
    empresa_id = request.session.get('empresa_id')
    if not empresa_id:
        return redirect('registro_empresa')
    
    try:
        empresa = Empresa.objects.get(id=empresa_id)
    except Empresa.DoesNotExist:
        return redirect('registro_empresa')
    
    if request.method == 'POST':
        form = UsuarioForm(request.POST)
        if form.is_valid():
            usuario = form.save(commit=False)
            usuario.empresa = empresa
            
            # Asignar cargo por defecto si no se especificó
            if not usuario.cargo:
                usuario.cargo = 'Administrador'
            
            usuario.save()
            
            # Autenticar al usuario después del registro
            login(request, usuario)
            del request.session['empresa_id']  # Limpiar la sesión
            messages.success(request, 'Registro completado exitosamente!')
            return redirect('dashboard')
    else:
        form = UsuarioForm()
    
    return render(request, 'account/registro_usuario.html', {
        'form': form,
        'empresa': empresa
    })


from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect
from django.contrib import messages
from django.utils.timezone import now
from .models import Sucursal  # Asegúrate de importar tu modelo Sucursal
from django.contrib.auth.decorators import login_required

def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            # Verificamos si el usuario tiene una empresa asociada
            empresa = getattr(user, 'empresa', None)

            if empresa:
                if empresa.cuenta_activa and empresa.fecha_expiracion > now():
                    # Aquí ya no es necesario seleccionar la sucursal. Se obtiene directamente del usuario.
                    sucursal = user.sucursal  # Se asume que el usuario tiene una relación con sucursal

                    if sucursal:
                        # Guardar información de la sucursal en la sesión
                        request.session['sucursal_id'] = sucursal.id
                        request.session['sucursal_nombre'] = sucursal.nombre
                        request.session['empresa_id'] = empresa.id

                        # Autenticar al usuario
                        login(request, user)

                        messages.success(request, f'Bienvenido, has ingresado a la sucursal {sucursal.nombre}')
                        return redirect('dashboard')
                    else:
                        messages.error(request, 'El usuario no tiene sucursal asignada.')
                else:
                    messages.error(request, 'La cuenta de la empresa ha expirado o está inactiva.')
            else:
                messages.error(request, 'El usuario no está asociado a ninguna empresa.')
        else:
            messages.error(request, 'Usuario o contraseña inválidos.')

    return render(request, 'account/login.html')


from django.contrib.auth.decorators import login_required

@login_required
def dashboard(request):
    # Obtener datos de sesión
    sucursal_nombre = request.session.get('sucursal_nombre')
    empresa_nombre = request.session.get('empresa_nombre')  # Asegúrate de guardar esto al iniciar sesión
    
    return render(request, 'account/dashboard.html', {
        'user': request.user,
        'sucursal_nombre': sucursal_nombre,
        'empresa_nombre': empresa_nombre
    })

from django.contrib.auth import logout
from django.shortcuts import render

def logout_view(request):
    if request.method == 'POST':
        logout(request)
        return render(request, 'account/logout.html')  # Página con redirección
    return render(request, 'account/logout.html')  # En caso de GET, opcional

