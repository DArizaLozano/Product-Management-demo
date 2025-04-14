import { loadDashboardView } from './views/dashboard.js';
import { loadProductosView } from './views/productos.js';
import { loadClientesView } from './views/clientes.js';
import { loadVentasView } from './views/ventas.js'; 
import { loadProveedoresView } from './views/proveedores.js';
import { loadConfiguracionView } from './views/configuracion.js';
import { renderNavbar } from '../components/navbar.js';
import { renderSidebar } from '../components/sidebar.js';

const routes = {
  '/dashboard': loadDashboardView,
  '/productos': loadProductosView,
  '/clientes': loadClientesView,
  '/proveedores': loadProveedoresView,
  '/configuracion': loadConfiguracionView,
  '/ventas': loadVentasView,
};

export function initRouter() {
  window.addEventListener('hashchange', () => {
    router();
  });

  if (!location.hash) {
    location.hash = '#/dashboard';
  } else {
    router();
  }
}

function router() {
  const hash = location.hash.slice(1);
  const route = routes[hash];

  if (route) {
    document.getElementById('navbar').innerHTML = renderNavbar();
    document.getElementById('sidebar').innerHTML = renderSidebar();
    route();
  } else {
    document.getElementById('main-content').innerHTML = '<h2>404 - Página no encontrada</h2>';
  }
}
