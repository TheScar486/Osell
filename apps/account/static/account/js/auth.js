document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.login-form');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault(); // Detiene el envío normal del formulario

        const inputs = form.querySelectorAll('input[required]');
        let isValid = true;

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

        const formData = new FormData(form);

        // Intenta iniciar sesión con un bloque try...catch para manejar errores
        try {
            // Utilizamos la URL del atributo 'action' del formulario, lo que lo hace dinámico
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                // Puedes agregar un timeout aquí si lo deseas, pero el backend es más robusto
                // para manejar esto. Por ahora, confiamos en la respuesta del servidor.
            });

            // Si el servidor responde, pero con un estado de error (400, 500, etc.)
            if (!response.ok) {
                if (response.status === 502) {
                    // Si el error es 502, redirige a la URL de error personalizada
                    window.location.href = '/error-502-bad-gateway.html'; 
                } else if (response.status === 401) {
                    // Manejar credenciales inválidas
                    alert('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
                } else {
                    // Otros errores del servidor
                    console.error('Error del servidor:', response.statusText);
                    alert('Ocurrió un error en el servidor. Inténtalo más tarde.');
                }
                return;
            }

            // Si el login es exitoso y el servidor nos redirige
            if (response.redirected) {
                window.location.href = response.url;
            } else {
                // Si el servidor nos responde con datos (por ejemplo, un token)
                const data = await response.json();
                console.log('Login exitoso:', data);
                // Aquí podrías guardar el token y redirigir
                // window.location.href = '/dashboard';
            }

        } catch (error) {
            // Este bloque captura errores de red (servidor caído, timeout, etc.)
            console.error('Error de conexión:', error);
            // Redirige al error 502, que es la respuesta más apropiada para un error de conexión
            window.location.href = '/error-502-bad-gateway.html'; 
        }
    });
});