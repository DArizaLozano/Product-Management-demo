import { renderSidebar } from '../../components/sidebar.js';
import { renderNavbar } from '../../components/navbar.js';

export function loadDashboardView() {
  const settings = JSON.parse(localStorage.getItem('config')) || {};
  const idioma = settings.idioma || 'es';

  document.getElementById('sidebar').innerHTML = renderSidebar();
  document.getElementById('navbar').innerHTML = renderNavbar();

  const container = document.getElementById('main-content');
  container.innerHTML = `
    <div class="dashboard-container">
      <h2 data-i18n="dashboardTitle" class="dashboard-title">Dashboard</h2>

      <div class="dashboard-cards">
        <div class="card resumen-card"><span data-i18n="totalProductos" class="label">Total Productos:</span> <strong id="total-productos">...</strong></div>
        <div class="card resumen-card"><span data-i18n="totalClientes" class="label">Total Clientes:</span> <strong id="total-clientes">...</strong></div>
        <div class="card resumen-card"><span data-i18n="totalProveedores" class="label">Total Proveedores:</span> <strong id="total-proveedores">...</strong></div>
        <div class="card resumen-card"><span data-i18n="totalVentas" class="label">Total Ventas:</span> <strong id="total-ventas">...</strong></div>
      </div>
      <div class="tabla-card">
        <h3 data-i18n="ultimasVentas" class="tabla-titulo">Últimas Ventas</h3>
        <table>
          <thead>
            <tr>
              <th data-i18n="cliente" class="col-cliente">Cliente</th>
              <th data-i18n="total" class="col-total">Total</th>
              <th data-i18n="fecha" class="col-fecha">Fecha</th>
            </tr>
          </thead>
          <tbody id="ventas-body">
            <tr><td colspan="3">Cargando...</td></tr>
          </tbody>
        </table>
      </div>
      <div class="dashboard-main">
        <div class="grafico-card">
          <h3 data-i18n="graficoResumen" class="grafico-titulo">Gráfico de resumen</h3>
          <canvas id="ventasChart"></canvas>
        </div>
        <div class="grafico-card">
          <h3 data-i18n="graficoCategoria" class="grafico-titulo">Distribución de Productos por Categoría</h3>
          <canvas id="categoriaChart"></canvas>
        </div>
      </div>
    </div>
  `;

  if (settings.temaOscuro) {
    document.querySelector('.dashboard-container')?.classList.add('dark');
    document.body.classList.add('dark-theme');
  }

  document.dispatchEvent(new CustomEvent('idioma-cambiado', { detail: idioma }));

  cargarResumen();
  cargarUltimasVentas();
  cargarGraficoVentas();
  cargarGraficoCategorias();
}

function traducirDashboard(idioma) {
  const traducciones = {
    es: {
      dashboardTitle: 'Dashboard',
      totalProductos: 'Total Productos:',
      totalClientes: 'Total Clientes:',
      totalProveedores: 'Total Proveedores:',
      totalVentas: 'Total Ventas:',
      ultimasVentas: 'Últimas Ventas',
      cliente: 'Cliente',
      total: 'Total',
      fecha: 'Fecha',
      graficoResumen: 'Gráfico de resumen',
      graficoCategoria: 'Distribución de Productos por Categoría'
    },
    en: {
      dashboardTitle: 'Dashboard',
      totalProductos: 'Total Products:',
      totalClientes: 'Total Clients:',
      totalProveedores: 'Total Suppliers:',
      totalVentas: 'Total Sales:',
      ultimasVentas: 'Latest Sales',
      cliente: 'Client',
      total: 'Total',
      fecha: 'Date',
      graficoResumen: 'Summary Chart',
      graficoCategoria: 'Product Distribution by Category'
    }
  };

  const textos = traducciones[idioma] || traducciones['es'];

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (textos[key]) el.innerText = textos[key];
  });
}

document.addEventListener('idioma-cambiado', (e) => {
  traducirDashboard(e.detail);
});

function cargarResumen() {
  const productos = JSON.parse(localStorage.getItem('productos')) || [];
  const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
  const proveedores = JSON.parse(localStorage.getItem('proveedores')) || [];
  const ventas = JSON.parse(localStorage.getItem('ventas')) || [];

  const totalVentas = ventas.reduce((acc, v) => acc + v.total, 0);

  document.getElementById('total-productos').textContent = productos.length;
  document.getElementById('total-clientes').textContent = clientes.length;
  document.getElementById('total-proveedores').textContent = proveedores.length;
  document.getElementById('total-ventas').textContent = totalVentas > 0 ? `$${totalVentas}` : "No hay ventas registradas";
}

function cargarUltimasVentas() {
  const ventas = JSON.parse(localStorage.getItem('ventas')) || [];

  const ultimas = ventas.slice(-5).reverse();
  const tbody = document.getElementById('ventas-body');
  tbody.innerHTML = '';

  if (ultimas.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3">No hay ventas registradas.</td></tr>`;
    return;
  }

  ultimas.forEach(v => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${v.cliente}</td><td>$${v.total}</td><td>${v.fecha}</td>`;
    tbody.appendChild(row);
  });
}

function cargarGraficoVentas() {
  const productos = JSON.parse(localStorage.getItem('productos')) || [];
  const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
  const proveedores = JSON.parse(localStorage.getItem('proveedores')) || [];

  const ctx = document.getElementById('ventasChart').getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Productos', 'Clientes', 'Proveedores'],
      datasets: [{
        data: [productos.length, clientes.length, proveedores.length],
        backgroundColor: ['#4caf50', '#36a2eb', '#ff6384'],
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        tooltip: { enabled: true }
      }
    }
  });
}

function cargarGraficoCategorias() {
  const productos = JSON.parse(localStorage.getItem('productos')) || [];
  const categoriaCount = productos.reduce((acc, producto) => {
    acc[producto.categoria] = (acc[producto.categoria] || 0) + 1;
    return acc;
  }, {});

  const categorias = Object.keys(categoriaCount);
  const cantidadPorCategoria = categorias.map(categoria => categoriaCount[categoria]);

  const ctx = document.getElementById('categoriaChart').getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: categorias,
      datasets: [{
        data: cantidadPorCategoria,
        backgroundColor: ['#ffcd56', '#ff6384', '#36a2eb', '#4caf50', '#f44336'],
        hoverOffset: 4
      }]          
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        tooltip: { enabled: true }
      }
    }
  });
}
