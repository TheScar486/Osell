document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.auth-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault(); // Evita el envío tradicional del formulario

        const inputs = form.querySelectorAll('input[required]');
        let isValid = true;
        const formData = new FormData(form);

        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = 'red';
                isValid = false;
            } else {
                input.style.borderColor = '';
            }
        });

        if (!isValid) {
            alert('Por favor completa todos los campos requeridos.');
            return;
        }

        // --- Lógica de petición asíncrona con límite de tiempo ---
        const timeout = 30000; // 30 segundos en milisegundos
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        fetch(form.action, {
            method: 'POST',
            body: formData,
            signal: controller.signal,
        })
        .then(response => {
            clearTimeout(timeoutId); // Cancela el temporizador de tiempo de espera
            if (response.ok) {
                // Si la respuesta es exitosa (código 200), redirige al dashboard
                window.location.href = '/dashboard/'; 
            } else {
                // Si hay un error, maneja la respuesta
                return response.json().then(errorData => {
                    alert(errorData.error);
                }).catch(() => {
                    // Si la respuesta no es JSON, muestra un error genérico
                    alert('Error en el servidor. Inténtalo de nuevo.');
                });
            }
        })
        .catch(error => {
            clearTimeout(timeoutId); // Cancela el temporizador de tiempo de espera
            if (error.name === 'AbortError') {
                // Si el error es por tiempo de espera
                console.error('El servidor no respondió en el tiempo límite.');
                window.location.href = '/error-502-bad-gateway/'; // Redirige a tu URL de error
            } else {
                // Otros errores de red o del navegador
                console.error('Error en la petición:', error);
                alert('Ocurrió un problema de red. Por favor, revisa tu conexión.');
            }
        });
    });
});