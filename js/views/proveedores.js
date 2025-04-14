import { renderSidebar } from '../../components/sidebar.js';
import { renderNavbar } from '../../components/navbar.js';

export function loadProveedoresView() {
  const container = document.getElementById('main-content');
  const settings = JSON.parse(localStorage.getItem('config')) || {};
  const idioma = settings.idioma || 'es';

  document.getElementById('sidebar').innerHTML = renderSidebar();
  document.getElementById('navbar').innerHTML = renderNavbar();

  container.innerHTML = `
    <div class="proveedores-container">
      <h2 data-key="proveedores_titulo">Gestión de Proveedores</h2>
      <button id="btn-add-proveedor" class="btn-agregar" data-key="proveedores_agregar">Añadir Proveedor</button>

      <div id="form-proveedor-container" style="display: none;">
        <form id="proveedor-form" class="form-proveedor">
          <input type="hidden" id="proveedor-id">
          <input type="text" id="proveedor-nombre" placeholder="Nombre" data-key="proveedores_nombre" required />
          <input type="email" id="proveedor-correo" placeholder="Correo electrónico" data-key="proveedores_correo" required />
          <input type="text" id="proveedor-telefono" placeholder="Teléfono" data-key="proveedores_telefono" required />
          <input type="text" id="proveedor-direccion" placeholder="Dirección" data-key="proveedores_direccion" required />
          <button type="submit" class="btn-guardar" data-key="proveedores_guardar">Guardar</button>
        </form>
      </div>

      <table id="proveedores-table">
        <thead>
          <tr>
            <th data-key="proveedores_tabla_nombre">Nombre</th>
            <th data-key="proveedores_tabla_correo">Correo</th>
            <th data-key="proveedores_tabla_telefono">Teléfono</th>
            <th data-key="proveedores_tabla_direccion">Dirección</th>
            <th data-key="proveedores_tabla_acciones">Acciones</th>
          </tr>
        </thead>
        <tbody id="proveedores-body"></tbody>
      </table>
    </div>
  `;

  if (settings.temaOscuro) {
    document.querySelector('.proveedores-container')?.classList.add('dark');
    document.body.classList.add('dark-theme');
  }

  let proveedores = JSON.parse(localStorage.getItem('proveedores')) || [];

  function renderTable() {
    const tbody = document.getElementById('proveedores-body');
    tbody.innerHTML = '';

    proveedores.forEach((proveedor, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${proveedor.nombre}</td>
        <td>${proveedor.correo}</td>
        <td>${proveedor.telefono}</td>
        <td>${proveedor.direccion}</td>
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
        proveedores.splice(index, 1);
        localStorage.setItem('proveedores', JSON.stringify(proveedores));
        renderTable();
      });
    });

    document.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = e.target.getAttribute('data-index');
        const proveedor = proveedores[index];
        document.getElementById('proveedor-id').value = index;
        document.getElementById('proveedor-nombre').value = proveedor.nombre;
        document.getElementById('proveedor-correo').value = proveedor.correo;
        document.getElementById('proveedor-telefono').value = proveedor.telefono;
        document.getElementById('proveedor-direccion').value = proveedor.direccion;
        document.getElementById('form-proveedor-container').style.display = 'block';
      });
    });
  }

  document.getElementById('btn-add-proveedor').addEventListener('click', () => {
    document.getElementById('proveedor-form').reset();
    document.getElementById('proveedor-id').value = '';
    document.getElementById('form-proveedor-container').style.display = 'block';
  });

  document.getElementById('proveedor-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('proveedor-id').value;
    const nombre = document.getElementById('proveedor-nombre').value;
    const correo = document.getElementById('proveedor-correo').value;
    const telefono = document.getElementById('proveedor-telefono').value;
    const direccion = document.getElementById('proveedor-direccion').value;

    if (id) {
      proveedores[id] = { nombre, correo, telefono, direccion };
    } else {
      proveedores.push({ nombre, correo, telefono, direccion });
    }

    localStorage.setItem('proveedores', JSON.stringify(proveedores));
    renderTable();
    document.getElementById('form-proveedor-container').style.display = 'none';
  });

  function traducirProveedores(idioma) {
    const traducciones = {
      es: {
        proveedores_titulo: 'Gestión de Proveedores',
        proveedores_agregar: 'Añadir Proveedor',
        proveedores_nombre: 'Nombre',
        proveedores_correo: 'Correo electrónico',
        proveedores_telefono: 'Teléfono',
        proveedores_direccion: 'Dirección',
        proveedores_guardar: 'Guardar',
        proveedores_tabla_nombre: 'Nombre',
        proveedores_tabla_correo: 'Correo',
        proveedores_tabla_telefono: 'Teléfono',
        proveedores_tabla_direccion: 'Dirección',
        proveedores_tabla_acciones: 'Acciones'
      },
      en: {
        proveedores_titulo: 'Supplier Management',
        proveedores_agregar: 'Add Supplier',
        proveedores_nombre: 'Name',
        proveedores_correo: 'Email',
        proveedores_telefono: 'Phone',
        proveedores_direccion: 'Address',
        proveedores_guardar: 'Save',
        proveedores_tabla_nombre: 'Name',
        proveedores_tabla_correo: 'Email',
        proveedores_tabla_telefono: 'Phone',
        proveedores_tabla_direccion: 'Address',
        proveedores_tabla_acciones: 'Actions'
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

  traducirProveedores(idioma);
  document.dispatchEvent(new CustomEvent('idioma-cambiado', { detail: idioma }));
  renderTable();
}
