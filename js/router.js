import { loadLoginView } from './views/login.js';
import { loadSignupView } from './views/signup.js';
import { loadDashboardView } from './views/dashboard.js';
import { loadProductosView } from './views/productos.js';
import { loadClientesView } from './views/clientes.js';
import { loadVentasView } from './views/ventas.js'; 
import { loadProveedoresView } from './views/proveedores.js';
import { loadConfiguracionView } from './views/configuracion.js';
import { checkSession } from './auth.js';
import { renderNavbar } from '../components/navbar.js';
import { renderSidebar } from '../components/sidebar.js';

const routes = {
  '/login': loadLoginView,
  '/signup': loadSignupView,
  '/dashboard': loadDashboardView,
  '/productos': loadProductosView,
  '/clientes': loadClientesView,
  '/proveedores': loadProveedoresView,
  '/configuracion': loadConfiguracionView,
  '/ventas': loadVentasView,
};

const privateRoutes = [
  '/dashboard',
  '/productos',
  '/clientes',
  '/ventas',
  '/proveedores',
  '/configuracion',
];

export function initRouter() {
  window.addEventListener('hashchange', () => {
    router();
  });

  if (!location.hash) {
    if (checkSession()) {
      location.hash = '#/dashboard';
    } else {
      location.hash = '#/signup';
    }
  } else {
    router();
  }
}

function router() {
  const hash = location.hash.slice(1); // sin el #
  const route = routes[hash];

  if (route) {
    if (privateRoutes.includes(hash)) {
      const user = localStorage.getItem('user');
      if (!user) {
        location.hash = '#/login';
        return;
      }
      document.getElementById('navbar').innerHTML = renderNavbar();
      document.getElementById('sidebar').innerHTML = renderSidebar();
    } else {
      document.getElementById('navbar').innerHTML = '';
      document.getElementById('sidebar').innerHTML = '';
    }

    route();
  } else {
    document.getElementById('main-content').innerHTML = '<h2>404 - Página no encontrada</h2>';
  }
}
