export function renderSidebar() {
  const settings = JSON.parse(localStorage.getItem('config')) || {};
  const darkClass = settings.temaOscuro ? 'dark' : '';
  const idioma = settings.idioma || 'es';

  const sidebar = `
    <input type="checkbox" id="sidebarToggle" class="sidebar-toggle-checkbox" />
    <div id="sidebar" class="sidebar ${darkClass}">
    <label for="sidebarToggle" class="sidebar-toggle-btn">☰</label>
      <ul>
        <li><a href="#/dashboard" data-key="dashboard">📊 Dashboard</a></li>
        <li><a href="#/productos" data-key="productos">📦 Productos</a></li>
        <li><a href="#/clientes" data-key="clientes">👥 Clientes</a></li>
        <li><a href="#/proveedores" data-key="proveedores">🏭 Proveedores</a></li>
        <li><a href="#/ventas" data-key="ventas">🧾 Ventas</a></li>
      </ul>
    </div>
    
  `;

  document.body.insertAdjacentHTML('beforeend', sidebar);

  cargarIdiomaSidebar(idioma);
}

export function cargarIdiomaSidebar(idioma) {
  const translations = {
    es: {
      dashboard: '📊 Dashboard',
      productos: '📦 Productos',
      clientes: '👥 Clientes',
      proveedores: '🏭 Proveedores',
      ventas: '🧾 Ventas'
    },
    en: {
      dashboard: '📊 Dashboard',
      productos: '📦 Products',
      clientes: '👥 Clients',
      proveedores: '🏭 Suppliers',
      ventas: '🧾 Sales'
    }
  };

  const elements = document.querySelectorAll('[data-key]');
  elements.forEach(element => {
    const key = element.getAttribute('data-key');
    if (translations[idioma] && translations[idioma][key]) {
      element.innerText = translations[idioma][key];
    }
  });
}

document.addEventListener('idioma-cambiado', (event) => {
  cargarIdiomaSidebar(event.detail);
});
