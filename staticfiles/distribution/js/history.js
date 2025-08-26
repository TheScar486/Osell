document.addEventListener("DOMContentLoaded", function() {
    const tbody = document.querySelector('table tbody');
    const searchInput = document.querySelector('.search-input');
    let currentPage = 1;
    const limit = 50;
    let allRows = [];

    function loadPage(page = 1, searchTerm = "") {
        fetch(`/distribution/api/solicitudes/?page=${page}&limit=${limit}&search=${encodeURIComponent(searchTerm)}`)
            .then(response => response.json())
            .then(data => {
                if (page === 1) { 
                    tbody.innerHTML = ""; 
                    allRows = []; 
                }

                data.results.forEach(p => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${p.pedido_id ?? ''}</td>
                        <td>${p.usuario_nombre ?? ''}</td>
                        <td>${p.grupo_nombre ?? ''}</td>
                        <td>${p.estado}</td>
                        <td>${new Date(p.fecha_registro).toLocaleString()}</td>
                        <td>${p.tipo ?? ''}</td>
                    `;
                    allRows.push(row);
                    tbody.appendChild(row);
                });

                // Botón para cargar más si hay más páginas
                if (page < data.pages) {
                    document.getElementById("loadMore").style.display = "block";
                } else {
                    document.getElementById("loadMore").style.display = "none";
                }
            });
    }

    // Buscar
    searchInput.addEventListener("input", function() {
        currentPage = 1;
        loadPage(currentPage, this.value.toLowerCase());
    });

    // Botón para cargar más
    document.getElementById("loadMore").addEventListener("click", function() {
        currentPage++;
        loadPage(currentPage, searchInput.value.toLowerCase());
    });

    // Carga inicial
    loadPage();
});
