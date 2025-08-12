# apps/account/middleware.py
from django.db.utils import OperationalError
from django.shortcuts import render

class OperationalErrorMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        try:
            response = self.get_response(request)
        except OperationalError:
            # Si se produce un OperationalError (generalmente por problemas de conexión a la DB)
            # renderiza nuestra página de error 502.
            return render(request, 'Error-502-Bad-Gateway.html', status=502)
        
        return response