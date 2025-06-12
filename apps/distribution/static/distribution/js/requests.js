// funcion para slider bar con persistencia
// Función para manejar el sliderbar con persistencia
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
// finaliza funcion de sliderbar 

// Código para manejar la búsqueda y renderizado del modal de catálogo
document.addEventListener("DOMContentLoaded", function() {
    let catalogData = [];
    let currentSearchText = "";
    let isDataLoaded = false; // ← esta línea es nueva
    
    // Elementos del DOM
    const mainSearchInput = document.querySelector('.section-header .search-input');
    const mainSearchButton = document.querySelector('.section-header .search-button');
    const modalSearchInput = document.querySelector('#catalogModal .search-input');
    const modalElement = document.getElementById('catalogModal');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const tableContainer = document.querySelector('.table-container');

    let rowsRendered = 0;
    let filteredData = [];
    let isFetchingMore = false;
    const MAX_ROWS_PER_BATCH = 500;

    // Mostrar loader
    function showLoading() {
        if (loadingIndicator) {
            loadingIndicator.style.display = 'flex';
        }
        if (tableContainer) {
            tableContainer.classList.add('loading');
        }
    }
    
    // Ocultar loader
    function hideLoading() {
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
        if (tableContainer) {
            tableContainer.classList.remove('loading');
        }
    }

  // Función para manejar la búsqueda principal
  function handleMainSearch() {
    if (mainSearchInput) {
      currentSearchText = mainSearchInput.value.trim();
      openModal();
    }
  }

// Función para abrir el modal - VERSIÓN MEJORADA
    function openModal() {
        if (modalElement) {
            modalElement.style.display = "block";

            if (!isDataLoaded) {
                showLoading();
                fetchCatalogData(); // Solo si no están cargados
            } else {
                hideLoading(); // Si ya están cargados, esconder el loader
            }

            if (currentSearchText) {
                filterTable(currentSearchText); // ← Agrega esto
            }

            if (modalSearchInput) {
                if (currentSearchText && currentSearchText.trim() !== "") {
                    modalSearchInput.value = currentSearchText;
                    setTimeout(() => {
                        modalSearchInput.focus();
                        modalSearchInput.select();
                        modalSearchInput.setSelectionRange(0, currentSearchText.length);
                        const event = new Event('input', { bubbles: true });
                        modalSearchInput.dispatchEvent(event);
                    }, 50);
                } else {
                    setTimeout(() => {
                        modalSearchInput.focus();
                    }, 50);
                }
            }
        }
    }

// Función separada para cargar datos
    function fetchCatalogData() {
        fetch('/distribution/catalogo/')
            .then(response => {
                if (!response.ok) throw new Error('Error en la respuesta');
                return response.json();
            })
            .then(data => {
                catalogData = data;
                filteredData = sortByDescripcion(data); // ← AGREGADO: usar como base de render
                rowsRendered = 0;    // ← REINICIA contador
                renderTable();       // ← Ya no pases `data`, usa `filteredData`
                isDataLoaded = true;
                hideLoading();
                populateFilters(data);
            })
            .catch(error => {
                console.error("Error:", error);
                hideLoading();
            });
    }
  // Event listeners para la búsqueda principal
  mainSearchInput?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') handleMainSearch();
  });

  // Event listener para la búsqueda en el modal
  modalSearchInput?.addEventListener('input', function() {
    filterTable(this.value);
  });

  // Función para ordenar alfabéticamente por descripción
    function sortByDescripcion(dataArray) {
      return dataArray.sort((a, b) => {
          const descA = (a.Descripcion || '').toLowerCase();
          const descB = (b.Descripcion || '').toLowerCase();
          return descA.localeCompare(descB);
      });
  }

// Asegúrate de que catalogData, filteredData, sortByDescripcion, rowsRendered,
// renderTable, mainSearchButton, modalSearchInput estén definidos globalmente.

// Ejemplo de cómo podrían estar definidas estas variables si no lo están ya:
// let catalogData = []; // Esto debería ser tu array original de datos cargado desde tu fuente (JSON, etc.)
// let filteredData = []; // Los datos que resultan de los filtros
// function sortByDescripcion(data) { /* Tu lógica de ordenamiento aquí */ return data.sort((a, b) => (a.Descripcion || '').localeCompare(b.Descripcion || '')); }
// let rowsRendered = 0; // Para el renderizado incremental o paginación
// function renderTable() { /* Tu lógica para renderizar la tabla aquí */ }
// const mainSearchButton = document.getElementById('mainSearchButton');
// const modalSearchInput = document.getElementById('modalSearchInput');

/**
 * Función para poblar los filtros de Proveedor y Categoría en el modal.
 * Esta función ahora acepta un conjunto de datos para generar las opciones de filtro.
 * @param {Array} dataToFilter - Los datos a partir de los cuales se generarán las opciones de filtro.
 */
function populateFilters(dataToFilter) {
    const proveedorSet = new Set();
    const categoriaSet = new Set();

    dataToFilter.forEach(item => {
        if (item.Proveedor) proveedorSet.add(item.Proveedor);
        if (item.Categoria) categoriaSet.add(item.Categoria);
    });

    const proveedorSelect = document.getElementById('proveedorFilter');
    const categoriaSelect = document.getElementById('categoriaFilter');

    // Si los elementos select no existen, salimos de la función
    if (!proveedorSelect || !categoriaSelect) {
        console.warn("Elementos 'proveedorFilter' o 'categoriaFilter' no encontrados en el DOM.");
        return;
    }

    // Guardamos la selección actual para restablecerla después de repoblar
    const currentProveedor = proveedorSelect.value;
    const currentCategoria = categoriaSelect.value;

    // Vacía opciones existentes (excepto "Todos")
    proveedorSelect.innerHTML = '<option value="">Todos</option>';
    categoriaSelect.innerHTML = '<option value="">Todos</option>';

    // Repoblar Proveedores
    [...proveedorSet].sort().forEach(p => {
        const opt = document.createElement('option');
        opt.value = p;
        opt.textContent = p;
        proveedorSelect.appendChild(opt);
    });
    // Restaurar la selección si es posible
    if (proveedorSet.has(currentProveedor)) {
        proveedorSelect.value = currentProveedor;
    }

    // Repoblar Categorías
    [...categoriaSet].sort().forEach(c => {
        const opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        categoriaSelect.appendChild(opt);
    });
    // Restaurar la selección si es posible
    if (categoriaSet.has(currentCategoria)) {
        categoriaSelect.value = currentCategoria;
    }
}

/**
 * Función principal para filtrar la tabla de datos.
 * Ahora interactúa con los filtros de proveedor y categoría para una funcionalidad interconectada.
 * @param {string} searchText - El texto de búsqueda general.
 */
    function filterTable(searchText) {
        if (!catalogData.length) return;

        try {
            const searchWords = searchText.toLowerCase().split(/\s+/).filter(Boolean);
            const proveedorFilter = document.getElementById('proveedorFilter')?.value || "";
            const categoriaFilter = document.getElementById('categoriaFilter')?.value || "";

            // Primero, filtramos los datos base según el texto de búsqueda, proveedor y categoría
            let tempFilteredData = catalogData.filter(item => {
                const combinedFields = [
                    item.Codigo_Principal,
                    item.Descripcion,
                    item.Proveedor,
                    item.stock_sucursal,
                    item.Precio_Base,
                    item.Caracteristicas,
                    item.Categoria
                ].map(val => (val || '').toString().toLowerCase()).join(' ');

                const matchesSearch = searchWords.every(word => combinedFields.includes(word));
                const matchesProveedor = !proveedorFilter || item.Proveedor === proveedorFilter;
                const matchesCategoria = !categoriaFilter || item.Categoria === categoriaFilter;

                return matchesSearch && matchesProveedor && matchesCategoria;
            });

            // Actualizamos los datos filtrados globales
            filteredData = sortByDescripcion(tempFilteredData);
            renderTable(); // Llamada a la función renderTable

        // Si se selecciona un proveedor, actualizamos las categorías disponibles
        if (proveedorFilter) {
            const categoriesForSelectedProveedor = new Set(
                catalogData
                    .filter(item => item.Proveedor === proveedorFilter)
                    .map(item => item.Categoria)
                    .filter(Boolean)
            );
            populateFiltersFromSet(categoriesForSelectedProveedor, 'categoriaFilter', 'Categoría');
        } else {
            // Si no hay proveedor seleccionado, mostramos todas las categorías posibles basadas en los datos actuales
            populateFilters(catalogData); // Pasa todo el `catalogData` para repoblar ambos filtros
        }

        // Si se selecciona una categoría, actualizamos los proveedores disponibles
        if (categoriaFilter) {
            const suppliersForSelectedCategoria = new Set(
                catalogData
                    .filter(item => item.Categoria === categoriaFilter)
                    .map(item => item.Proveedor)
                    .filter(Boolean)
            );
            populateFiltersFromSet(suppliersForSelectedCategoria, 'proveedorFilter', 'Proveedor');
        } else if (!proveedorFilter) { // Solo si no hay un proveedor seleccionado, si no, el proveedor ya filtró las categorías
             // Si no hay categoría seleccionada Y no hay proveedor seleccionado, repoblamos con todos los datos
             populateFilters(catalogData);
        }


        // Finalmente, renderizamos la tabla
        rowsRendered = 0;
        renderTable();

        } catch (error) {
            console.error("Error en filterTable:", error);
        }
    }

/**
 * Función auxiliar para poblar un select con un Set de valores.
 * @param {Set} dataSet - El Set de datos para poblar el select.
 * @param {string} selectId - El ID del elemento select a poblar.
 * @param {string} defaultOptionText - El texto de la opción por defecto (ej. "Todos").
 */
function populateFiltersFromSet(dataSet, selectId, defaultOptionText) {
    const targetSelect = document.getElementById(selectId);
    if (!targetSelect) {
        console.warn(`Elemento '${selectId}' no encontrado en el DOM.`);
        return;
    }

    const currentSelection = targetSelect.value; // Guardar la selección actual
    targetSelect.innerHTML = `<option value="">Todos</option>`; // Vaciar y añadir opción por defecto

    [...dataSet].sort().forEach(item => {
        const opt = document.createElement('option');
        opt.value = item;
        opt.textContent = item;
        targetSelect.appendChild(opt);
    });

    // Restaurar la selección si todavía existe
    if (dataSet.has(currentSelection)) {
        targetSelect.value = currentSelection;
    } else {
        targetSelect.value = ""; // Si la opción seleccionada ya no es válida, resetear
    }
}

// --- Event Listeners ---

// Event listener para el botón de búsqueda principal (asumiendo que handleMainSearch llama a filterTable)
mainSearchButton?.addEventListener('click', () => {
    handleMainSearch(); // que internamente maneje si el campo está vacío o no
});

// Event listener para el cambio en el filtro de Proveedor
document.getElementById('proveedorFilter')?.addEventListener('change', () => {
    // Al cambiar el proveedor, filtra la tabla y luego actualiza las opciones de categoría
    filterTable(modalSearchInput.value);
    // Después de filtrar la tabla, las opciones de categoría se repoblarán automáticamente dentro de filterTable
    // si un proveedor está seleccionado, o con todos los datos si no lo está.
});
// termina el filtrado de la tabla

// Event listener para el cambio en el filtro de Categoría
document.getElementById('categoriaFilter')?.addEventListener('change', () => {
    // Al cambiar la categoría, filtra la tabla y luego actualiza las opciones de proveedor
    filterTable(modalSearchInput.value);
    // Similar al proveedor, las opciones de proveedor se repoblarán automáticamente.
});

// Asegúrate de llamar a populateFilters inicialmente cuando tus datos estén cargados
// Por ejemplo, después de cargar `catalogData`:
// populateFilters(catalogData);

  // Función para renderizar la tabla
  function renderTable() {
      const tableBody = document.getElementById('catalogBody');
      if (!tableBody || isFetchingMore) return;

      isFetchingMore = true;
      const fragment = document.createDocumentFragment();
      const rowsToRender = filteredData.slice(rowsRendered, rowsRendered + MAX_ROWS_PER_BATCH);

      rowsToRender.forEach(item => {
          const row = document.createElement('tr');
          row.innerHTML = `
              <td>${item.Codigo_Principal || ''}</td>
              <td>${item.Descripcion || ''}</td>
              <td>${item.Proveedor || ''}</td>
              <td>${item.stock_sucursal || 0}</td>
              <td>Q ${parseFloat(item.Precio_Base || 0).toFixed(2)}</td>
          `;
          
          // ⬇️ Agrega esto para manejar el doble clic
          row.addEventListener('dblclick', function () {
              insertIntoMainTable(item); // Nombre correcto de la función
          });

          fragment.appendChild(row);
      });

      if (rowsRendered === 0) tableBody.innerHTML = '';

      tableBody.appendChild(fragment);
      rowsRendered += rowsToRender.length;
      isFetchingMore = false;

      // 🔁 VERIFICACIÓN INICIAL: si aún no hay scroll suficiente, intenta cargar más
      setTimeout(() => {
          const container = document.querySelector('.table-container');
          if (container.scrollHeight <= container.clientHeight && rowsRendered < filteredData.length) {
              renderTable(); // ← sigue cargando más
          }
      }, 100);
  }

  document.querySelector('.table-container')?.addEventListener('scroll', function () {
      const el = this;
      console.log("scrollTop:", el.scrollTop, "clientHeight:", el.clientHeight, "scrollHeight:", el.scrollHeight);

      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50) {
          console.log("¡Cargar más datos!");
          if (!isFetchingMore && rowsRendered < filteredData.length) {
              renderTable();
          }
      }
  });

});
// finaliza las funciones de búsqueda y renderizado del modal 

// Código para manejar la apertura del modal de catálogo y la búsqueda de artículos
const searchContainer = document.querySelector('.search-container');
const searchIcon = document.querySelector('.search-button');
const searchInput = document.querySelector('.search-input');
const modal = document.getElementById('catalogModal');
const closeBtn = modal.querySelector('.close-btn');
const tableBody = document.getElementById('catalogBody');

// Variables para doble clic
let lastClickTime = 0;

// Función para abrir el modal (reutilizable)
function abrirModal() {
    modal.style.display = 'block';
    cargarCatalogo(); // Cargar datos dinámicamente
}

// Doble clic en el contenedor
searchContainer.addEventListener('click', (e) => {
    // Evita que se active al hacer clic directamente en el input o botón
    if (e.target === searchInput || e.target === searchIcon || e.target.closest('.search-button')) {
        return;
    }

    const currentTime = new Date().getTime();
    const timeSinceLastClick = currentTime - lastClickTime;

    if (timeSinceLastClick < 300) { // 300ms para doble clic
        abrirModal(); // Corregido: llamar a abrirModal en lugar de openModal
        lastClickTime = 0;
    } else {
        lastClickTime = currentTime;
    }
});

// ===== [Abrir con clic en el ícono] =====
searchIcon.addEventListener('click', (e) => {
    e.stopPropagation(); // Evita que el doble clic del contenedor también se active
    abrirModal();
});

// ===== [Abrir con Enter en el input] =====
searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        abrirModal();
    }
});

// ===== [Cerrar modal] =====
// Cerrar con la X
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Cerrar al hacer clic fuera del modal
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Cerrar con Escape
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        modal.style.display = 'none';
    }
});

// Función para insertar un producto en la tabla principal
function guardarTablaEnLocalStorage() {
    const filas = Array.from(document.querySelectorAll('.table-container table tbody tr')).map(row => {
        return {
            cantidad: row.querySelector('.cantidad-input')?.value || '',
            unidad: row.cells[1]?.textContent || '',
            codigo: row.cells[2]?.textContent || '',
            descripcion: row.cells[3]?.textContent || '',
            proveedor: row.cells[4]?.textContent || '',
            precioCompra: row.cells[5]?.textContent || '',
            precioBase: row.cells[6]?.textContent || '',
            importe: row.querySelector('.importe-cell')?.textContent || ''
        };
    });
    localStorage.setItem('tablaTemporal', JSON.stringify(filas));
}

window.addEventListener('DOMContentLoaded', function () {
    // Elimina filas del modal al recargar
    const modalTable = document.querySelector('#catalogModal table');
    if (modalTable) {
        const tbody = modalTable.querySelector('tbody');
        if (tbody) {
            tbody.innerHTML = ''; // ✅ Vacía todas las filas del modal
        }
    }

    // No afectes la tabla principal en esta parte del código
    const selectedRows = document.querySelectorAll('#catalogModal table tr.selected');
    selectedRows.forEach(row => row.classList.remove('selected'));
});

function restaurarTablaDesdeLocalStorage() {
    const datos = JSON.parse(localStorage.getItem('tablaTemporal'));
    if (!Array.isArray(datos)) return;

    const mainTableBody = document.querySelector('.table-container table tbody');
    mainTableBody.innerHTML = ''; // Limpiar la tabla principal

    datos.forEach(item => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td><input type="number" class="cantidad-input" min="0" value="${item.cantidad}" /></td>
            <td>${item.unidad}</td>
            <td>${item.codigo}</td>
            <td>${item.descripcion}</td>
            <td>${item.proveedor}</td>
            <td>${item.precioCompra}</td>
            <td>${item.precioBase}</td>
            <td class="importe-cell">0.00</td>
        `;

        const cantidadInput = newRow.querySelector('.cantidad-input');
        const importeCell = newRow.querySelector('.importe-cell');
        const precioVenta = parseFloat(item.precioBase) || 0;

        function actualizarImporte() {
            const cantidad = parseFloat(cantidadInput.value) || 0;
            const importe = cantidad * precioVenta;

            if (importe > 999999999.9999) {
                alert("El importe supera el límite permitido (999,999,999.9999)");
                cantidadInput.value = 0;
                importeCell.textContent = "0.00";
            } else {
                importeCell.textContent = importe.toFixed(2);
            }

            guardarTablaEnLocalStorage();
            actualizarTotales(); // ✅ Para recalcular al modificar cantidades manualmente
        }

        cantidadInput.addEventListener('input', actualizarImporte);
        cantidadInput.addEventListener('dblclick', () => cantidadInput.select());

        mainTableBody.appendChild(newRow);
        actualizarImporte(); // Calcula el importe inicial
    });

    actualizarTotales(); // ✅ Calcula los totales luego de restaurar todo
}

document.addEventListener('DOMContentLoaded', restaurarTablaDesdeLocalStorage);

function insertIntoMainTable(item) {
    const mainTableBody = document.querySelector('.table-container table tbody');
    if (!mainTableBody) return;

    let cantidadUsuario = prompt("Ingrese la cantidad deseada:", "1");

    if (cantidadUsuario === null) return;

    cantidadUsuario = parseFloat(cantidadUsuario);

    if (isNaN(cantidadUsuario) || cantidadUsuario <= 0) {
        alert("Cantidad inválida. No se agregó el producto.");
        return;
    }

    cerrarModal();

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td><input type="number" class="cantidad-input" min="0" value="${cantidadUsuario}" /></td>
        <td>${item.Unidad_Base || ''}</td>
        <td>${item.Codigo_Principal || ''}</td>
        <td>${item.Descripcion || ''}</td>
        <td>${item.Proveedor || ''}</td>
        <td>${item.Precio_Compra ?? 0}</td>
        <td>${item.Precio_Base ?? 0}</td>
        <td class="importe-cell">0.00</td>
    `;

    const cantidadInput = newRow.querySelector('.cantidad-input');
    const importeCell = newRow.querySelector('.importe-cell');
    const precioVenta = parseFloat(item.Precio_Base) || 0;

    function actualizarImporte() {
        const cantidad = parseFloat(cantidadInput.value) || 0;
        const importe = cantidad * precioVenta;

        if (importe > 999999999.9999) {
            alert("El importe supera el límite permitido (999,999,999.9999)");
            cantidadInput.value = 0;
            importeCell.textContent = "0.00";
        } else {
            importeCell.textContent = importe.toFixed(2);
        }

        guardarTablaEnLocalStorage();
        actualizarTotales(); // ⚠️ Suma total cantidad e importe
    }

    cantidadInput.addEventListener('input', actualizarImporte);
    cantidadInput.addEventListener('dblclick', () => cantidadInput.select());

    cantidadInput.value = cantidadUsuario;
    actualizarImporte();

    mainTableBody.appendChild(newRow);
    guardarTablaEnLocalStorage();
    actualizarTotales(); // ⚠️ Llamar también aquí por si se agregó nueva fila
}

// ⚠️ Esta función se encarga de sumar y mostrar totales
function actualizarTotales() {
    let totalCantidad = 0;
    let totalImporte = 0;

    const filas = document.querySelectorAll('.table-container table tbody tr');

    filas.forEach(fila => {
        const cantidad = parseFloat(fila.querySelector('.cantidad-input')?.value) || 0;
        const importe = parseFloat(fila.querySelector('.importe-cell')?.textContent) || 0;
        totalCantidad += cantidad;
        totalImporte += importe;
    });

    const totalCantidadEl = document.getElementById("totalCantidad");
    const totalImporteEl = document.getElementById("totalImporte");

    if (totalCantidadEl) totalCantidadEl.textContent = totalCantidad;
    if (totalImporteEl) totalImporteEl.textContent = "Q " + totalImporte.toFixed(2);
}

// ✅ Esta función cierra el modal despues de insertar un producto
function cerrarModal() {
    const modal = document.getElementById("catalogModal");
    if (modal) modal.style.display = "none";
}

document.querySelector('.table-container table tbody').addEventListener('click', function(e) {
    const fila = e.target.closest('tr');
    if (!fila) return;

    this.querySelectorAll('tr').forEach(tr => tr.classList.remove('selected'));
    fila.classList.add('selected');
});

document.querySelector('.button-group').addEventListener('click', function(e) {
    const boton = e.target.closest('button');
    if (!boton) return;

    // Comprobar si el botón tiene el texto "Sucursal", "Nuevo" o "Finalizar"
    if (boton.textContent.includes("Sucursal") || boton.textContent.includes("Nuevo") || boton.textContent.includes("Finalizar") || boton.textContent.includes("Factor")) {
        // Si el botón es Sucursal, Nuevo o Finalizar, no verificamos la fila seleccionada
        // Realizamos la acción correspondiente para estos botones
        if (boton.textContent.includes("Sucursal")) {
            console.log("Botón Sucursal presionado");
        //} else if (boton.textContent.includes("Nuevo")) {
            //console.log("Botón Nuevo presionado");
        } else if (boton.textContent.includes("Finalizar")) {
            console.log("Botón Finalizar presionado");
            // Llama la función para finalizar el pedido
            finalizarPedido();
        }
        return; // Evitamos que el código continúe con la verificación de fila seleccionada
    }

    const tabla = document.querySelector('.table-container table tbody');
    const filaSeleccionada = tabla.querySelector('tr.selected');
    if (!filaSeleccionada) {
        alert("Primero selecciona una fila.");
        return;
    }

    if (boton.textContent.includes("Eliminar")) {
        filaSeleccionada.remove();
        guardarTablaEnLocalStorage(); // Guardar después de eliminar
        actualizarTotales(); // ✅ Actualizar totales después de eliminar
    } else if (boton.textContent.includes("Cantidad")) {
        let nuevaCantidad = prompt("Ingrese la nueva cantidad:", "1");
        if (nuevaCantidad === null) return;

        nuevaCantidad = parseFloat(nuevaCantidad);
        if (isNaN(nuevaCantidad) || nuevaCantidad <= 0) {
            alert("Cantidad inválida.");
            return;
        }

        const inputCantidad = filaSeleccionada.querySelector('.cantidad-input');
        if (inputCantidad) {
            inputCantidad.value = nuevaCantidad;

            const precioVenta = parseFloat(
                filaSeleccionada.children[6]?.textContent || 0
            );
            const importeCell = filaSeleccionada.querySelector('.importe-cell');
            if (importeCell) {
                const nuevoImporte = nuevaCantidad * precioVenta;
                importeCell.textContent = nuevoImporte.toFixed(2);
            }

            guardarTablaEnLocalStorage(); // Guardar al editar
            actualizarTotales(); // ✅ Agrega esta línea para recalcular totales
        }
    }

});

document.addEventListener("DOMContentLoaded", function () {
    const botones = document.querySelectorAll(".button-group .btn");
    const botonNuevo = botones[2]; // Tercer botón (Nuevo)
    const tablaCuerpo = document.querySelector(".table-container table tbody");

    if (botonNuevo && tablaCuerpo) {
        botonNuevo.addEventListener("click", function () {
            const confirmar = confirm("¿Estás seguro de que deseas borrar el contenido de la tabla?");
            if (confirmar) {
                tablaCuerpo.innerHTML = ""; // Borra todas las filas de la tabla
            }
        });
    }
});

// Variables globales
// Funciones para mostrar/ocultar el indicador de carga
function showLoading() {
  const loadingIndicator = document.getElementById('loadingIndicator') || createLoadingIndicator();
  loadingIndicator.style.display = 'flex';
  document.body.style.pointerEvents = 'none'; // Deshabilita interacciones
  document.body.style.cursor = 'wait';
}

function hideLoading() {
  const loadingIndicator = document.getElementById('loadingIndicator');
  if (loadingIndicator) {
    loadingIndicator.style.display = 'none';
  }
  document.body.style.pointerEvents = 'auto';
  document.body.style.cursor = 'default';
}

function createLoadingIndicator() {
  const loader = document.createElement('div');
  loader.id = 'loadingIndicator';
  loader.style.position = 'fixed';
  loader.style.top = '0';
  loader.style.left = '0';
  loader.style.width = '100%';
  loader.style.height = '100%';
  loader.style.backgroundColor = 'rgba(0,0,0,0.5)';
  loader.style.display = 'none';
  loader.style.justifyContent = 'center';
  loader.style.alignItems = 'center';
  loader.style.zIndex = '9999';
  
  loader.innerHTML = `
    <div class="spinner"></div>
    <p style="color: white; margin-left: 10px;">Cargando...</p>
  `;
  
  document.body.appendChild(loader);
  return loader;
}

let factoresDisponibles = [];
let productoActual = null;
let factorModal = document.getElementById('factorModal');

// Evento para el botón Factor - Versión mejorada
document.getElementById('btnFactor').addEventListener('click', async function() {
  try {
    // Validación de selección
    const filaSeleccionada = document.querySelector('.table-container table tbody tr.selected');
    if (!filaSeleccionada) {
      throw new Error("Debes seleccionar un producto primero");
    }
    
    // Obtener datos del producto
    const codigoProducto = filaSeleccionada.cells[2].textContent.trim();
    if (!codigoProducto) {
      throw new Error("El producto seleccionado no tiene código válido");
    }
    
    productoActual = filaSeleccionada;
    showLoading(); // Mostrar indicador de carga
    
    // Obtener factores de conversión
    const response = await fetch(`/distribution/factores/?codigo=${encodeURIComponent(codigoProducto)}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
    
    factoresDisponibles = await response.json();
    
    // Validar respuesta
    if (!Array.isArray(factoresDisponibles)) {
      throw new Error("Formato de respuesta inválido");
    }
    
    if (factoresDisponibles.length === 0) {
      throw new Error("Este producto no tiene factores de conversión configurados");
    }
    
    mostrarFactoresEnModal();
    factorModal.style.display = 'block';
    
  } catch (error) {
    console.error("Error en btnFactor:", error);
    showErrorModal(error.message || "Error al cargar factores de conversión");
  } finally {
    hideLoading(); // Ocultar indicador de carga
  }
});

  function mostrarFactoresEnModal() {
    const tbody = document.getElementById('factorBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    factoresDisponibles.sort((a, b) => a.unidad_destino.localeCompare(b.unidad_destino));

    factoresDisponibles.forEach((factor) => {
      const row = document.createElement('tr');
      row.className = 'factor-row';
      row.dataset.factorId = factor.id_conversion;

      row.innerHTML = `
        <td>${factor.unidad_origen}</td>
        <td>${factor.unidad_destino}</td>
        <td>${parseFloat(factor.factor_conversion).toFixed(4)}</td>
      `;

      row.setAttribute('tabindex', '0'); // Permite enfocar con teclado

      // Evento doble clic
      row.addEventListener('dblclick', () => {
        aplicarFactor(factor);
        factorModal.style.display = 'none';
      });

      // Evento Enter
      row.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          aplicarFactor(factor);
          factorModal.style.display = 'none';
        }
      });

      tbody.appendChild(row);
    });

    // Enfocar primera fila
    const firstRow = tbody.querySelector('.factor-row');
    if (firstRow) {
      firstRow.focus();
    }
  }

// Función mejorada para aplicar factor
function aplicarFactor(factor) {
  if (!productoActual || !factor) return;
  
  try {
    // Elementos de la fila
    const celdaUnidad = productoActual.cells[1]; // Columna Unidad/Factor
    const precioBaseCell = productoActual.cells[6]; // Columna Precio Base
    const inputCantidad = productoActual.querySelector('.cantidad-input');
    const importeCell = productoActual.querySelector('.importe-cell');
    
    if (!celdaUnidad || !precioBaseCell || !inputCantidad || !importeCell) {
      throw new Error("Estructura de tabla no válida");
    }
    
    // Actualizar unidad
    celdaUnidad.textContent = factor.unidad_destino;
    celdaUnidad.dataset.unidadSeleccionada = factor.unidad_destino;
    celdaUnidad.dataset.factorConversion = factor.factor_conversion;
    
    // Actualizar precio (opcional)
    const precioOriginal = parseFloat(precioBaseCell.dataset.precioOriginal || precioBaseCell.textContent);
    const nuevoPrecio = precioOriginal * parseFloat(factor.factor_conversion);
    precioBaseCell.textContent = nuevoPrecio.toFixed(2);
    
    // Guardar precio original como atributo por si necesitamos revertir
    if (!precioBaseCell.dataset.precioOriginal) {
      precioBaseCell.dataset.precioOriginal = precioOriginal;
    }
    
    // Actualizar importe
    actualizarImporte(productoActual);
    guardarTablaEnLocalStorage();
    actualizarTotales(); // ✅ Actualizar totales luego de aplicar el factor
    
    // Feedback visual
    productoActual.classList.add('factor-aplicado');
    setTimeout(() => productoActual.classList.remove('factor-aplicado'), 1000);
    
  } catch (error) {
    console.error("Error al aplicar factor:", error);
    showErrorModal("Error al aplicar el factor de conversión");
  }
}

// Función mejorada para actualizar importe
function actualizarImporte(fila) {
  const inputCantidad = fila.querySelector('.cantidad-input');
  const precioCell = fila.cells[6];
  const importeCell = fila.querySelector('.importe-cell');
  
  if (!inputCantidad || !precioCell || !importeCell) return;
  
  const cantidad = parseFloat(inputCantidad.value) || 0;
  const precio = parseFloat(precioCell.textContent) || 0;
  const importe = cantidad * precio;
  
  importeCell.textContent = importe.toFixed(2);
  
  // Validar límites
  if (importe > 999999999.9999) {
    showErrorModal("El importe supera el límite permitido");
    inputCantidad.value = '';
    importeCell.textContent = '0.00';
  }
}

// Función auxiliar para mostrar errores
// Función auxiliar para mostrar errores
function showErrorModal(message) {
  const errorModal = document.getElementById('customErrorModal') || createErrorModal();
  errorModal.querySelector('.custom-error-message').textContent = message;
  errorModal.style.display = 'block';
  
  setTimeout(() => {
    errorModal.style.display = 'none';
  }, 5000);
}

// Función para crear el modal de error personalizado
function createErrorModal() {
  const modal = document.createElement('div');
  modal.id = 'customErrorModal';
  modal.className = 'custom-modal';
  modal.innerHTML = `
    <div class="custom-modal-content">
      <span class="custom-close-btn">&times;</span>
      <div class="custom-error-icon">⚠️</div>
      <p class="custom-error-message"></p>
    </div>
  `;
  document.body.appendChild(modal);
  return modal;
}

// Función para cerrar el modal de error personalizado
function cerrarErrorModal() {
  const errorModal = document.getElementById('customErrorModal');
  if (errorModal) {
    errorModal.style.display = 'none';
  }
}

// Cierre con la "X"
document.addEventListener('click', function(event) {
  if (event.target.matches('#customErrorModal .custom-close-btn')) {
    cerrarErrorModal();
  }
});

// Cierre con clic fuera del contenido del modal
window.addEventListener('click', function(event) {
  const errorModal = document.getElementById('customErrorModal');
  if (event.target === errorModal) {
    cerrarErrorModal();
  }
});

// Cierre con tecla ESC
document.addEventListener('keydown', function(event) {
  const errorModal = document.getElementById('customErrorModal');
  if (event.key === 'Escape' && errorModal.style.display === 'block') {
    cerrarErrorModal();
  }
});

// Función para cerrar el modal y limpiar contenido
function cerrarFactorModal() {
  const factorModal = document.getElementById('factorModal');
  factorModal.style.display = 'none';

  // Limpiar tabla y datos
  const tbody = document.querySelector('#factorModal table #factorBody');
  if (tbody) tbody.innerHTML = '';

  localStorage.removeItem('tablaFactores');
  localStorage.removeItem('factorModalData');

  const selectedRows = document.querySelectorAll('#factorModal table tr.selected');
  selectedRows.forEach(row => row.classList.remove('selected'));
}

// 1. Cierre con la X
document.querySelector('#factorModal .close-btn').addEventListener('click', cerrarFactorModal);

// 2. Cierre haciendo clic fuera del modal
window.addEventListener('click', function(event) {
  const modal = document.getElementById('factorModal');
  if (event.target === modal) {
    cerrarFactorModal();
  }
});

// 3. Cierre con tecla ESC
document.addEventListener('keydown', function(event) {
  const modal = document.getElementById('factorModal');
  if (event.key === 'Escape' && modal.style.display === 'block') {
    cerrarFactorModal();
  }
});

// Función para finalizar el pedido
function finalizarPedido() {
    const filas = document.querySelectorAll('table tbody tr');
    const datosTabla = [];

    // Obtener el comentario (solo una vez)
    const comentarioGeneral = document.getElementById('comentariosTextarea').value.trim();

    filas.forEach(fila => {
        const getValue = (selector, isNumber = false) => {
            const element = fila.querySelector(selector);
            if (!element) return isNumber ? 0 : '';

            const input = element.querySelector('input');
            const value = input ? input.value : element.innerText.trim();

            if (isNumber) {
                const num = parseFloat(value.replace(',', ''));
                return isNaN(num) ? 0 : num;
            }

            return value;
        };

        datosTabla.push({
            cantidad: getValue('td:nth-child(1)', true),
            factor: getValue('td:nth-child(2)'),
            codigo: getValue('td:nth-child(3)'),
            descripcion: getValue('td:nth-child(4)'),
            departamento: getValue('td:nth-child(5)'),
            compra: getValue('td:nth-child(6)', true),
            venta: getValue('td:nth-child(7)', true),
            importe: getValue('td:nth-child(8)', true),
            comentario: comentarioGeneral // ← aquí va el valor real
        });
    });

    console.log('Datos a enviar:', datosTabla);

    fetch('/distribution/crear/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ datos: datosTabla })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                console.error('Error del servidor:', err);
                throw new Error(err.error || 'Error al guardar');
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Respuesta del servidor:', data); // <-- AÑADIR
        if (data.success) {
            alert(`¡Pedido guardado correctamente! Número de pedido: ${data.pedido_id}`);
            window.location.reload();

        } else {
            throw new Error(data.error || 'Error desconocido');
        }
    })

    .catch(error => {
        console.error('Error completo:', error);
        alert(`Error: ${error.message}`);
    });
}

// Función para obtener el CSRF token (ya está bien)
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

setInterval(() => {
    fetch('/')
        .then(response => {
            if (!response.ok) {
                console.warn('Ping falló con estado:', response.status);
            }
        })
        .catch(error => {
            console.error('Error en el ping:', error);
        });
}, 14 * 60 * 1000); // cada 14 minutos