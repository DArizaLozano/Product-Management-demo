import { renderSidebar } from '../../components/sidebar.js';
import { renderNavbar } from '../../components/navbar.js';

export function loadVentasView() {
  const container = document.getElementById('main-content');
  const settings = JSON.parse(localStorage.getItem('config')) || {};
  const idioma = settings.idioma || 'es';

  document.getElementById('sidebar').innerHTML = renderSidebar();
  document.getElementById('navbar').innerHTML = renderNavbar();

  container.innerHTML = `
    <div class="ventas-container">
      <h2 data-key="ventas_registrar_titulo">Registrar Venta</h2>

      <form id="venta-form">
        <select id="venta-cliente" required>
          <option value="">Seleccione un cliente</option>
        </select>

        <select id="venta-producto" required>
          <option value="">Seleccione un producto</option>
        </select>

        <input type="number" id="venta-cantidad" min="1" placeholder="Cantidad" required />
        <input type="date" id="venta-fecha" required />
        <button type="submit" data-key="ventas_registrar">Registrar</button>
      </form>

      <h3 data-key="ventas_registradas_titulo">Ventas Registradas</h3>
      <table>
        <thead>
          <tr>
            <th data-key="ventas_tabla_cliente">Cliente</th>
            <th data-key="ventas_tabla_producto">Producto</th>
            <th data-key="ventas_tabla_cantidad">Cantidad</th>
            <th data-key="ventas_tabla_total">Total</th>
            <th data-key="ventas_tabla_fecha">Fecha</th>
            <th data-key="ventas_tabla_acciones">Acciones</th>
          </tr>
        </thead>
        <tbody id="ventas-body"></tbody>
      </table>
    </div>
  `;

  if (settings.temaOscuro) {
    document.querySelector('.ventas-container')?.classList.add('dark');
    document.body.classList.add('dark-theme');
  }

  const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
  const productos = JSON.parse(localStorage.getItem('productos')) || [];
  let ventas = JSON.parse(localStorage.getItem('ventas')) || [];

  const clienteSelect = document.getElementById('venta-cliente');
  const productoSelect = document.getElementById('venta-producto');

  clientes.forEach((c, i) => {
    const opt = document.createElement('option');
    opt.value = c.nombre;
    opt.textContent = c.nombre;
    clienteSelect.appendChild(opt);
  });

  productos.forEach((p, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = p.nombre;
    productoSelect.appendChild(opt);
  });

  document.getElementById('venta-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const cliente = clienteSelect.value;
    const productoIndex = productoSelect.value;
    const cantidad = parseInt(document.getElementById('venta-cantidad').value);
    const fecha = document.getElementById('venta-fecha').value;
    const producto = productos[productoIndex];
    const total = cantidad * parseFloat(producto.precio);

    const nuevaVenta = { cliente, producto: producto.nombre, cantidad, total, fecha };
    ventas.push(nuevaVenta);
    localStorage.setItem('ventas', JSON.stringify(ventas));

    renderTablaVentas();
    cargarResumen();

    e.target.reset();
  });

  function renderTablaVentas() {
    const tbody = document.getElementById('ventas-body');
    tbody.innerHTML = '';

    if (ventas.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" data-key="ventas_no_registradas">No hay ventas registradas.</td></tr>';
      return;
    }

    ventas.forEach((v, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${v.cliente}</td>
        <td>${v.producto}</td>
        <td>${v.cantidad}</td>
        <td>$${v.total}</td>
        <td>${v.fecha}</td>
        <td><button class="btn-eliminar-venta" data-index="${index}" data-key="ventas_eliminar">Eliminar</button></td>
      `;
      tbody.appendChild(row);
    });

    document.querySelectorAll('.btn-eliminar-venta').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = e.target.getAttribute('data-index');
        ventas.splice(index, 1);
        localStorage.setItem('ventas', JSON.stringify(ventas));
        renderTablaVentas();
        cargarResumen();
      });
    });
  }

  function cargarResumen() {
    const totalVentas = ventas.reduce((acc, v) => acc + v.total, 0);
    const resumen = document.getElementById('resumen-ventas');
    resumen.innerHTML = `
      <p data-key="ventas_resumen_total">Total de ventas: $${totalVentas.toFixed(2)}</p>
    `;
  }

  function traducirVentas(idioma) {
    const traducciones = {
      es: {
        ventas_registrar_titulo: 'Registrar Venta',
        ventas_registrar: 'Registrar',
        ventas_registradas_titulo: 'Ventas Registradas',
        ventas_tabla_cliente: 'Cliente',
        ventas_tabla_producto: 'Producto',
        ventas_tabla_cantidad: 'Cantidad',
        ventas_tabla_total: 'Total',
        ventas_tabla_fecha: 'Fecha',
        ventas_tabla_acciones: 'Acciones',
        ventas_no_registradas: 'No hay ventas registradas.',
        ventas_eliminar: 'Eliminar',
        ventas_resumen_total: 'Total de ventas:'
      },
      en: {
        ventas_registrar_titulo: 'Register Sale',
        ventas_registrar: 'Register',
        ventas_registradas_titulo: 'Registered Sales',
        ventas_tabla_cliente: 'Client',
        ventas_tabla_producto: 'Product',
        ventas_tabla_cantidad: 'Quantity',
        ventas_tabla_total: 'Total',
        ventas_tabla_fecha: 'Date',
        ventas_tabla_acciones: 'Actions',
        ventas_no_registradas: 'No sales registered.',
        ventas_eliminar: 'Delete',
        ventas_resumen_total: 'Total sales:'
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

  traducirVentas(idioma);
  document.dispatchEvent(new CustomEvent('idioma-cambiado', { detail: idioma }));
  renderTablaVentas();
  cargarResumen();
}
