import { initRouter } from './router.js';
import { checkSession } from './auth.js';
import { renderNavbar } from '../components/navbar.js';
import { renderSidebar } from '../components/sidebar.js';

document.addEventListener('DOMContentLoaded', () => {
  const isAuthenticated = checkSession();

  if (isAuthenticated) {
    document.getElementById('navbar').innerHTML = renderNavbar();
    document.getElementById('sidebar').innerHTML = renderSidebar();
  }

  initRouter();  // Initialize the routes
});
