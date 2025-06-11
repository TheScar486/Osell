// static/js/inicio_index.js
document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('toggleSidebar');
    const sidebar = document.getElementById('rightSidebar');
    const content = document.getElementById('mainContent');
    
    // Estado inicial
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (isCollapsed) sidebar.classList.add('collapsed');
    
    // Manejar clic
    toggleButton.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
        localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
    
        // Guardar el estado en localStorage
        localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Manejar clicks en los botones del sidebar
    document.querySelectorAll('.dashboard-button[data-section]').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
            
            // Marcar botón como activo
            document.querySelectorAll('.dashboard-button').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    // Función para mostrar sección
    function showSection(sectionId) {
        // Ocultar todas las secciones
        document.querySelectorAll('.content-section').forEach(section => {
            section.style.display = 'none';
        });
        
        // Mostrar la sección seleccionada
        const activeSection = document.getElementById(`${sectionId}-section`);
        if (activeSection) {
            activeSection.style.display = 'block';
        }
    }

    // Opcional: Mostrar sección basada en URL
    const urlParams = new URLSearchParams(window.location.search);
    const sectionParam = urlParams.get('section');
    if (sectionParam) {
        showSection(sectionParam);
        const activeButton = document.querySelector(`.dashboard-button[data-section="${sectionParam}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
    }
});

// static/js/inicio_index.js
document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('toggleSidebar');
    const sliderbar = document.querySelector('.sliderbar'); // Cambiado de rightSidebar a sliderbar
    const content = document.querySelector('.section'); // Cambiado de mainContent a section
    
    // Estado inicial
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (isCollapsed) {
        sliderbar.classList.add('collapsed');
        document.body.style.gridTemplateColumns = '50px 1fr'; // Ancho reducido cuando está colapsado
    }
    
    // Manejar clic
    toggleButton.addEventListener('click', function() {
        sliderbar.classList.toggle('collapsed');
        
        // Ajustar el grid layout cuando se colapsa/expande
        if (sliderbar.classList.contains('collapsed')) {
            document.body.style.gridTemplateColumns = '50px 1fr'; // Ancho reducido
        } else {
            document.body.style.gridTemplateColumns = '200px 1fr'; // Ancho normal
        }
        
        // Guardar el estado en localStorage
        localStorage.setItem('sidebarCollapsed', sliderbar.classList.contains('collapsed'));
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Manejar clicks en los botones del sidebar
    document.querySelectorAll('.dashboard-button[data-section]').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
            
            // Marcar botón como activo
            document.querySelectorAll('.dashboard-button').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    // Función para mostrar sección
    function showSection(sectionId) {
        // Ocultar todas las secciones
        document.querySelectorAll('.content-section').forEach(section => {
            section.style.display = 'none';
        });
        
        // Mostrar la sección seleccionada
        const activeSection = document.getElementById(`${sectionId}-section`);
        if (activeSection) {
            activeSection.style.display = 'block';
        }
    }

    // Opcional: Mostrar sección basada en URL
    const urlParams = new URLSearchParams(window.location.search);
    const sectionParam = urlParams.get('section');
    if (sectionParam) {
        showSection(sectionParam);
        const activeButton = document.querySelector(`.dashboard-button[data-section="${sectionParam}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
    }
});