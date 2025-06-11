document.addEventListener("DOMContentLoaded", function() {
    const tbody = document.querySelector('table tbody');
    const searchInput = document.querySelector('.search-input');
    const downloadExcelBtn = document.getElementById('downloadExcelBtn');
    let allRowsData = []; // Para almacenar los datos originales y filtrarlos
    let selectedPedidoId = null; // Para almacenar el pedido_id de la fila seleccionada

    // Función para renderizar la tabla
    function renderTable(dataToRender) {
        tbody.innerHTML = ''; // Limpiar la tabla antes de renderizar
        dataToRender.forEach(p => {
            const row = document.createElement('tr');
            // Añadir el atributo data-pedido-id a la fila
            row.setAttribute('data-pedido-id', p.pedido_id);
            row.innerHTML = `
                <td>${p.pedido_id ?? ''}</td>
                <td>${p.usuario_nombre ?? ''}</td>
                <td>${p.grupo_nombre ?? ''}</td>
                <td>${p.estado}</td>
                <td>${new Date(p.fecha_registro).toLocaleString()}</td>
                <td>${p.tipo ?? ''}</td>
            `;
            tbody.appendChild(row);
        });
        addTableRowClickListener(); // Añadir listeners después de renderizar
    }

    // Función para añadir el click listener a cada fila
    function addTableRowClickListener() {
        const rows = tbody.querySelectorAll('tr');
        rows.forEach(row => {
            row.addEventListener('click', function() {
                // Quitar la clase 'selected' de todas las filas
                rows.forEach(r => r.classList.remove('selected'));
                // Añadir la clase 'selected' a la fila clicada
                this.classList.add('selected');
                // Guardar el pedido_id de la fila seleccionada
                selectedPedidoId = this.getAttribute('data-pedido-id');
                console.log('Fila seleccionada:', selectedPedidoId);
            });
        });
    }

    // Cargar datos al inicio
    fetch('/distribution/api/solicitudes/')
        .then(response => response.json())
        .then(data => {
            allRowsData = data; // Guardamos todos los datos
            renderTable(allRowsData); // Renderizamos la tabla inicialmente
        })
        .catch(error => console.error('Error fetching data:', error));

    // Filtro de búsqueda
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filteredData = allRowsData.filter(p => {
            // Unimos los valores de las columnas relevantes (excluyendo fecha_registro si no es necesaria para la búsqueda)
            const rowText = `${p.pedido_id ?? ''} ${p.usuario_nombre ?? ''} ${p.grupo_nombre ?? ''} ${p.estado} ${p.tipo ?? ''}`.toLowerCase();
            return rowText.includes(searchTerm);
        });
        renderTable(filteredData); // Renderizar con los datos filtrados
        selectedPedidoId = null; // Resetear la selección al filtrar
    });

    // Evento para el botón de descarga
    downloadExcelBtn.addEventListener('click', function() {
        let downloadUrl = '/distribution/export/excel/'; // URL por defecto para todas las solicitudes
        if (selectedPedidoId) {
            downloadUrl = `/distribution/export/excel/${selectedPedidoId}/`; // URL con el pedido_id seleccionado
        }
        
        // Redirigir para iniciar la descarga
        window.location.href = downloadUrl;
    });
});