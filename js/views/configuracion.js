
export function loadConfiguracionView() {
  const container = document.getElementById('main-content');
  container.innerHTML = `
    <div class="config-container">
      <h2 data-key="configuracion_titulo">Configuración</h2>

      <div class="config-item">
        <label for="select-language" data-key="configuracion_idioma_label">Idioma:</label>
        <select id="select-language">
          <option value="es">Español</option>
          <option value="en">English</option>
        </select>
      </div>

      <div class="config-item">
        <label for="toggle-theme" data-key="configuracion_tema_label">Tema oscuro:</label>
        <input type="checkbox" id="toggle-theme">
      </div>

      <div class="config-item">
        <button id="reset-datos" class="btn-reset" data-key="configuracion_reset_datos">Borrar la cuenta</button>
      </div>
    </div>
  `;

  const langSelect = document.getElementById('select-language');
  const themeToggle = document.getElementById('toggle-theme');
  const empresaInput = document.getElementById('nombre-empresa');

  const settings = JSON.parse(localStorage.getItem('config')) || {};

  // Load language from localStorage
  if (settings.idioma) langSelect.value = settings.idioma;
  if (settings.temaOscuro) themeToggle.checked = true;
  if (settings.empresa) empresaInput.value = settings.empresa;

  // Function to change the texts according to the language
function cargarIdioma(idioma) {
  const textos = {
    es: {
      configuracion_titulo: "Configuración",
      configuracion_idioma_label: "Idioma:",
      configuracion_tema_label: "Tema oscuro:",
      configuracion_empresa_label: "Nombre de la empresa:",
      configuracion_guardar_nombre: "Guardar",
      configuracion_reset_datos: "Borrar la cuenta"
    },
    en: {
      configuracion_titulo: "Settings",
      configuracion_idioma_label: "Language:",
      configuracion_tema_label: "Dark mode:",
      configuracion_empresa_label: "Company name:",
      configuracion_guardar_nombre: "Save",
      configuracion_reset_datos: "Delete account"
    }
  };

  const idiomaSeleccionado = textos[idioma] || textos.es;

// Update page texts
  document.querySelectorAll('[data-key]').forEach((element) => {
    const key = element.getAttribute('data-key');
    element.innerHTML = idiomaSeleccionado[key] || element.innerHTML;
  });

  // Emit language changed event
  const event = new CustomEvent('idioma-cambiado', { detail: idioma });
  document.dispatchEvent(event);
}


  // Load language according to saved configuration
  cargarIdioma(settings.idioma || 'es');

 // Change language when user selects it
  langSelect.addEventListener('change', () => {
    settings.idioma = langSelect.value;
    localStorage.setItem('config', JSON.stringify(settings));
    cargarIdioma(settings.idioma);
  });

  themeToggle.addEventListener('change', () => {
    settings.temaOscuro = themeToggle.checked;
    localStorage.setItem('config', JSON.stringify(settings));
    aplicarModoOscuro(settings.temaOscuro);
  });

  if (settings.temaOscuro) {
    aplicarModoOscuro(true);
  }

  function aplicarModoOscuro(activar) {
    document.body.classList.toggle('dark-theme', activar);
    document.querySelector('.config-container')?.classList.toggle('dark', activar);
    document.querySelector('.navbar')?.classList.toggle('dark', activar);
    document.querySelector('.sidebar')?.classList.toggle('dark', activar);
  }

  document.getElementById('guardar-nombre').addEventListener('click', () => {
    settings.empresa = empresaInput.value;
    localStorage.setItem('config', JSON.stringify(settings));
    alert("Nombre de empresa actualizado");
  });

  document.getElementById('reset-datos').addEventListener('click', () => {
    if (confirm("¿Estás seguro de que deseas borrar todos los datos?")) {
      localStorage.clear();
      location.reload();
    }
  });

  if (settings.temaOscuro) {
    document.body.classList.add('dark-theme');
  }
}
