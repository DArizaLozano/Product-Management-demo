import { renderSidebar } from '../../components/sidebar.js';
import { renderNavbar } from '../../components/navbar.js';

export function loadProductosView() {
  const container = document.getElementById('main-content');
  const settings = JSON.parse(localStorage.getItem('config')) || {};
  const idioma = settings.idioma || 'es';

  document.getElementById('sidebar').innerHTML = renderSidebar();
  document.getElementById('navbar').innerHTML = renderNavbar();

  container.innerHTML = `
    <div class="productos-container">
      <h2 data-key="productos_titulo">Gestión de Productos</h2>
      <button id="btn-add-product" class="btn-agregar" data-key="productos_agregar">Añadir Producto</button>

      <div id="form-product-container" style="display: none;">
        <form id="product-form" class="form-producto">
          <input type="hidden" id="product-id">
          <input type="text" id="product-nombre" placeholder="Nombre" data-key="productos_nombre" required />
          <input type="text" id="product-descripcion" placeholder="Descripción" data-key="productos_descripcion" required />
          <div class="categoria-select-container">
            <label for="product-categoria" data-key="productos_categoria_label">Categoría:</label>
            <select id="product-categoria" class="categoria-select" required></select>
          </div>
          <input type="number" id="product-precio" placeholder="Precio" required />
          <button type="submit" class="btn-guardar" data-key="productos_guardar">Guardar</button>
        </form>
      </div>

      <table id="products-table">
        <thead>
          <tr>
            <th data-key="productos_tabla_nombre">Nombre</th>
            <th data-key="productos_tabla_descripcion">Descripción</th>
            <th data-key="productos_tabla_categoria">Categoría</th>
            <th data-key="productos_tabla_precio">Precio</th>
            <th data-key="productos_tabla_acciones">Acciones</th>
          </tr>
        </thead>
        <tbody id="products-body"></tbody>
      </table>

      <div id="price-average-container" class="precio-promedio-container">
        <h3 class="titulo-precio-promedio" data-key="productos_promedio">Precio Promedio por Categoría</h3>
        <ul id="price-average-list" class="lista-precios-promedio"></ul>
      </div>
    </div>
  `;

  if (settings.temaOscuro) {
    document.querySelector('.productos-container')?.classList.add('dark');
    document.body.classList.add('dark-theme');
  }

  let productos = JSON.parse(localStorage.getItem('productos')) || [];

  async function loadCategories() {
    try {
      const response = await fetch('https://fakestoreapi.com/products/categories');
      const categories = await response.json();
      const categorySelect = document.getElementById('product-categoria');
      categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        categorySelect.appendChild(option);
      });
    } catch (error) {
      console.error('Error al cargar las categorías:', error);
    }
  }

  async function fetchAndCalculatePriceAverage(category) {
    try {
      const response = await fetch(`https://fakestoreapi.com/products/category/${category}`);
      const apiProducts = await response.json();
      const avgPrice = apiProducts.reduce((sum, product) => sum + product.price, 0) / apiProducts.length;
      const priceAverageList = document.getElementById('price-average-list');
      priceAverageList.innerHTML = '';
      const listItem = document.createElement('li');
      listItem.className = "item-precio-promedio";
      listItem.textContent = `El precio promedio en "${category}" es: $${avgPrice.toFixed(2)}`;
      priceAverageList.appendChild(listItem);
    } catch (error) {
      console.error('Error al obtener productos por categoría:', error);
    }
  }

  document.getElementById('product-categoria').addEventListener('change', (event) => {
    const selectedCategory = event.target.value;
    fetchAndCalculatePriceAverage(selectedCategory);
  });

  loadCategories();

  function renderTable() {
    const tbody = document.getElementById('products-body');
    tbody.innerHTML = '';
    productos.forEach((producto, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${producto.nombre}</td>
        <td>${producto.descripcion}</td>
        <td>${producto.categoria}</td>
        <td>$${producto.precio}</td>
        <td>
          <button class="btn-edit" data-index="${index}">Editar</button>
          <button class="btn-delete" data-index="${index}">Eliminar</button>
        </td>
      `;
      tbody.appendChild(row);
    });

    document.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = e.target.getAttribute('data-index');
        productos.splice(index, 1);
        localStorage.setItem('productos', JSON.stringify(productos));
        renderTable();
      });
    });

    document.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = e.target.getAttribute('data-index');
        const producto = productos[index];
        document.getElementById('product-id').value = index;
        document.getElementById('product-nombre').value = producto.nombre;
        document.getElementById('product-descripcion').value = producto.descripcion;
        document.getElementById('product-categoria').value = producto.categoria;
        document.getElementById('product-precio').value = producto.precio;
        document.getElementById('form-product-container').style.display = 'block';
      });
    });
  }

  document.getElementById('btn-add-product').addEventListener('click', () => {
    document.getElementById('product-form').reset();
    document.getElementById('product-id').value = '';
    document.getElementById('form-product-container').style.display = 'block';
  });

  document.getElementById('product-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('product-id').value;
    const nombre = document.getElementById('product-nombre').value;
    const descripcion = document.getElementById('product-descripcion').value;
    const categoria = document.getElementById('product-categoria').value;
    const precio = document.getElementById('product-precio').value;

    if (id) {
      productos[id] = { nombre, descripcion, categoria, precio };
    } else {
      productos.push({ nombre, descripcion, categoria, precio });
    }

    localStorage.setItem('productos', JSON.stringify(productos));
    renderTable();
    document.getElementById('form-product-container').style.display = 'none';
  });

  function traducirProductos(idioma) {
    const traducciones = {
      es: {
        productos_titulo: "Gestión de Productos",
        productos_agregar: "Añadir Producto",
        productos_nombre: "Nombre",
        productos_descripcion: "Descripción",
        productos_categoria_label: "Categoría:",
        productos_guardar: "Guardar",
        productos_tabla_nombre: "Nombre",
        productos_tabla_descripcion: "Descripción",
        productos_tabla_categoria: "Categoría",
        productos_tabla_precio: "Precio",
        productos_tabla_acciones: "Acciones",
        productos_promedio: "Precio Promedio por Categoría"
      },
      en: {
        productos_titulo: "Product Management",
        productos_agregar: "Add Product",
        productos_nombre: "Name",
        productos_descripcion: "Description",
        productos_categoria_label: "Category:",
        productos_guardar: "Save",
        productos_tabla_nombre: "Name",
        productos_tabla_descripcion: "Description",
        productos_tabla_categoria: "Category",
        productos_tabla_precio: "Price",
        productos_tabla_acciones: "Actions",
        productos_promedio: "Average Price per Category"
      }
    };

    const elementos = document.querySelectorAll('[data-key]');
    elementos.forEach(elemento => {
      const clave = elemento.getAttribute('data-key');
      if (traducciones[idioma] && traducciones[idioma][clave]) {
        if (elemento.placeholder !== undefined && elemento.tagName === 'INPUT') {
          elemento.placeholder = traducciones[idioma][clave];
        } else {
          elemento.innerText = traducciones[idioma][clave];
        }
      }
    });
  }

  traducirProductos(idioma);
  document.dispatchEvent(new CustomEvent('idioma-cambiado', { detail: idioma }));
  renderTable();
}
