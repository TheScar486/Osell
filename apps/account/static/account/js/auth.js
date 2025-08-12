document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.login-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault(); // Detenemos el envío normal del formulario

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
        const timeoutInSeconds = 5; // Define el tiempo de espera en segundos
        
        const timeoutPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(new Error('TimeoutError'));
            }, timeoutInSeconds * 1000);
        });

        const fetchPromise = fetch(form.action, {
            method: 'POST',
            body: formData
        });

        Promise.race([fetchPromise, timeoutPromise])
            .then(response => {
                // El servidor respondió a tiempo
                if (response.redirected) {
                    // Si el servidor ya nos redirige, seguimos la redirección
                    window.location.href = response.url;
                } else {
                    // Si no, mostramos un mensaje de éxito o procesamos la respuesta
                    // Aquí podrías procesar la respuesta del servidor si no es una redirección
                    // Por ejemplo, renderizar un mensaje de error o éxito
                    console.log('Respuesta del servidor recibida.');
                }
            })
            .catch(error => {
                if (error.message === 'TimeoutError' || error.name === 'AbortError' || error.name === 'TypeError') {
                    // Si hay un error de tiempo de espera o de red
                    window.location.href = '/error-404/'; // Redirigimos a la página de error
                } else {
                    // Otro tipo de error
                    console.error('Error al iniciar sesión:', error);
                    alert('Ocurrió un error inesperado. Por favor, inténtalo de nuevo.');
                }
            });
    });
});