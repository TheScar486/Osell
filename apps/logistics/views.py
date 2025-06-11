from django.shortcuts import render
from django.contrib.auth.decorators import login_required  # Importa el decorador

@login_required  # Añade este decorador
def logistics_home(request):
    # Tu lógica de vista aquí
    return render(request, 'logistics/logistics.html')

@login_required
def inventory_view(request):
    context = {
        'title': 'Gestión de Inventario',
        'user': request.user
    }
    return render(request, 'logistics/sections/inventory.html', context)