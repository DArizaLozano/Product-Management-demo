import { renderSidebar } from '../../components/sidebar.js';
import { renderNavbar } from '../../components/navbar.js';

export function loadClientesView() {
  const container = document.getElementById('main-content');
  const settings = JSON.parse(localStorage.getItem('config')) || {};
  const idioma = settings.idioma || 'es';

  document.getElementById('sidebar').innerHTML = renderSidebar();
  document.getElementById('navbar').innerHTML = renderNavbar();

  container.innerHTML = `
    <div class="clientes-container">
      <h2 data-key="clientes_titulo">Gestión de Clientes</h2>
      <button id="btn-add-cliente" class="btn-agregar" data-key="clientes_agregar">Añadir Cliente</button>

      <div id="form-cliente-container" style="display: none;">
        <form id="cliente-form" class="form-cliente">
          <input type="hidden" id="cliente-id">
          <input type="text" id="cliente-nombre" placeholder="Nombre" data-key="clientes_nombre" required />
          <input type="email" id="cliente-correo" placeholder="Correo electrónico" data-key="clientes_correo" required />
          <input type="text" id="cliente-telefono" placeholder="Teléfono" data-key="clientes_telefono" required />
          <input type="text" id="cliente-direccion" placeholder="Dirección" data-key="clientes_direccion" required />
          <button type="submit" class="btn-guardar" data-key="clientes_guardar">Guardar</button>
        </form>
      </div>

      <table id="clientes-table">
        <thead>
          <tr>
            <th data-key="clientes_tabla_nombre">Nombre</th>
            <th data-key="clientes_tabla_correo">Correo</th>
            <th data-key="clientes_tabla_telefono">Teléfono</th>
            <th data-key="clientes_tabla_direccion">Dirección</th>
            <th data-key="clientes_tabla_acciones">Acciones</th>
          </tr>
        </thead>
        <tbody id="clientes-body"></tbody>
      </table>
    </div>
  `;

  if (settings.temaOscuro) {
    document.querySelector('.clientes-container')?.classList.add('dark');
    document.body.classList.add('dark-theme');
  }

  let clientes = JSON.parse(localStorage.getItem('clientes')) || [];

  function renderTable() {
    const tbody = document.getElementById('clientes-body');
    tbody.innerHTML = '';

    clientes.forEach((cliente, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${cliente.nombre}</td>
        <td>${cliente.correo}</td>
        <td>${cliente.telefono}</td>
        <td>${cliente.direccion}</td>
        <td>
          <button class="btn-edit-cliente" data-index="${index}">Editar</button>
          <button class="btn-delete-cliente" data-index="${index}">Eliminar</button>
        </td>
      `;
      tbody.appendChild(row);
    });

    document.querySelectorAll('.btn-delete-cliente').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = e.target.getAttribute('data-index');
        clientes.splice(index, 1);
        localStorage.setItem('clientes', JSON.stringify(clientes));
        renderTable();
      });
    });

    document.querySelectorAll('.btn-edit-cliente').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = e.target.getAttribute('data-index');
        const cliente = clientes[index];
        document.getElementById('cliente-id').value = index;
        document.getElementById('cliente-nombre').value = cliente.nombre;
        document.getElementById('cliente-correo').value = cliente.correo;
        document.getElementById('cliente-telefono').value = cliente.telefono;
        document.getElementById('cliente-direccion').value = cliente.direccion;
        document.getElementById('form-cliente-container').style.display = 'block';
      });
    });
  }

  document.getElementById('btn-add-cliente').addEventListener('click', () => {
    document.getElementById('cliente-form').reset();
    document.getElementById('cliente-id').value = '';
    document.getElementById('form-cliente-container').style.display = 'block';
  });

  document.getElementById('cliente-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('cliente-id').value;
    const nombre = document.getElementById('cliente-nombre').value;
    const correo = document.getElementById('cliente-correo').value;
    const telefono = document.getElementById('cliente-telefono').value;
    const direccion = document.getElementById('cliente-direccion').value;

    if (id) {
      clientes[id] = { nombre, correo, telefono, direccion };
    } else {
      clientes.push({ nombre, correo, telefono, direccion });
    }

    localStorage.setItem('clientes', JSON.stringify(clientes));
    renderTable();
    document.getElementById('form-cliente-container').style.display = 'none';
  });

  function traducirClientes(idioma) {
    const traducciones = {
      es: {
        clientes_titulo: 'Gestión de Clientes',
        clientes_agregar: 'Añadir Cliente',
        clientes_nombre: 'Nombre',
        clientes_correo: 'Correo electrónico',
        clientes_telefono: 'Teléfono',
        clientes_direccion: 'Dirección',
        clientes_guardar: 'Guardar',
        clientes_tabla_nombre: 'Nombre',
        clientes_tabla_correo: 'Correo',
        clientes_tabla_telefono: 'Teléfono',
        clientes_tabla_direccion: 'Dirección',
        clientes_tabla_acciones: 'Acciones'
      },
      en: {
        clientes_titulo: 'Client Management',
        clientes_agregar: 'Add Client',
        clientes_nombre: 'Name',
        clientes_correo: 'Email',
        clientes_telefono: 'Phone',
        clientes_direccion: 'Address',
        clientes_guardar: 'Save',
        clientes_tabla_nombre: 'Name',
        clientes_tabla_correo: 'Email',
        clientes_tabla_telefono: 'Phone',
        clientes_tabla_direccion: 'Address',
        clientes_tabla_acciones: 'Actions'
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

  traducirClientes(idioma);
  document.dispatchEvent(new CustomEvent('idioma-cambiado', { detail: idioma }));
  renderTable();
}
