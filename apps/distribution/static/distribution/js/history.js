// renderizado de la tabla de distribución junto con el filtrado de búsqueda
document.addEventListener("DOMContentLoaded", function() {
    fetch('/distribution/api/solicitudes/')
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector('table tbody');
            let allRows = [];

            data.forEach(p => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${p.pedido_id ?? ''}</td>
                    <td>${p.usuario_nombre ?? ''}</td>
                    <td>${p.grupo_nombre ?? ''}</td>
                    <td>${p.estado}</td>
                    <td>${new Date(p.fecha_registro).toLocaleString()}</td> <!-- Mantienes la fecha -->
                    <td>${p.tipo ?? ''}</td>
                `;
                allRows.push(row);
                tbody.appendChild(row);
            });

            // Filtro sin considerar la columna de fecha (índice 4)
            const searchInput = document.querySelector('.search-input');
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                tbody.innerHTML = '';

                allRows.forEach(row => {
                    const cells = Array.from(row.cells).filter((_, i) => i !== 4); // omitimos columna de fecha
                    const rowText = cells.map(cell => cell.textContent.toLowerCase()).join(' ');

                    if (rowText.includes(searchTerm)) {
                        tbody.appendChild(row);
                    }
                });
            });
        });
});
