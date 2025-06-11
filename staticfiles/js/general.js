document.addEventListener('DOMContentLoaded', function() {
    // 1. Función mejorada para el sliderbar con persistencia
    const toggleBtn = document.getElementById('toggleSidebar');
    const sliderbar = document.querySelector('.sliderbar');
    
    if (toggleBtn && sliderbar) {
        // Verificar estado guardado al cargar la página
        const savedState = localStorage.getItem('sidebarState');
        
        // Aplicar estado guardado o usar expandido por defecto
        if (savedState === 'collapsed') {
            sliderbar.classList.add('collapsed');
        } else if (savedState === null) {
            // Estado por defecto (expandido)
            localStorage.setItem('sidebarState', 'expanded');
        }
        
        // Manejar el clic del botón
        toggleBtn.addEventListener('click', function() {
            sliderbar.classList.toggle('collapsed');
            
            // Guardar el nuevo estado
            const newState = sliderbar.classList.contains('collapsed') ? 'collapsed' : 'expanded';
            localStorage.setItem('sidebarState', newState);
        });
    }

    // 2. Funcionalidad de inventario (se mantiene igual)
    document.getElementById('inventory-search')?.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('.inventory-table tbody tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });
    
    document.getElementById('add-product-btn')?.addEventListener('click', function() {
        alert('Funcionalidad para añadir producto');
    });
    
    document.querySelector('.inventory-table')?.addEventListener('click', function(e) {
        if (e.target.classList.contains('edit-btn')) {
            const productId = e.target.closest('tr').querySelector('td').textContent;
            alert(`Editar producto: ${productId}`);
        }
        
        if (e.target.classList.contains('delete-btn')) {
            if (confirm('¿Estás seguro de eliminar este producto?')) {
                e.target.closest('tr').remove();
            }
        }
    });
});