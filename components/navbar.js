export function renderNavbar() {
  const settings = JSON.parse(localStorage.getItem('config')) || {};
  const darkClass = settings.temaOscuro ? 'dark' : '';

  return `
    <nav class="navbar ${darkClass}">
      <div class="navbar-logo" data-key="navbar_logo">GESTOR DE PRODUCTOS</div>
      <div class="navbar-options">
        <a href="#/configuracion" class="config-btn" data-key="navbar_config">⚙️ Configuración</a>
      </div>
    </nav>
  `;
}

export function cargarIdiomaNavbar(idioma) {
  const translations = {
    es: {
      navbar_logo: 'GESTOR DE PRODUCTOS',
      navbar_config: '⚙️ Configuración'
    },
    en: {
      navbar_logo: 'PRODUCT MANAGER',
      navbar_config: '⚙️ Settings'
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
  cargarIdiomaNavbar(event.detail);
});
