# apps/account/middleware.py
from django.db.utils import OperationalError
from django.shortcuts import render
from requests.exceptions import Timeout

class ProductionErrorMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        try:
            response = self.get_response(request)
        except (OperationalError, Timeout):
            # Captura tanto errores de conexión a la DB como de tiempo de espera
            # (TimeoutError es común en librerías como 'requests')
            return render(request, 'Error-502-Bad-Gateway.html', status=502)
        except Exception:
            # Captura cualquier otro error no manejado en producción (DEBUG=False)
            # y muestra la misma página de error 502
            return render(request, 'Error-502-Bad-Gateway.html', status=502)

        return response