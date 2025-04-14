export function loadSignupView() {
    document.getElementById('main-content').innerHTML = `
      <div class="signup-container">
        <h2>Crear cuenta</h2>
        <form id="signup-form">
          <input type="text" id="signup-username" placeholder="Usuario" required />
          <input type="password" id="signup-password" placeholder="Contraseña" required />
          <button type="submit">Registrarse</button>
        </form>
        <p>¿Ya tienes cuenta? <a href="#/login">Inicia sesión</a></p>
      </div>
    `;
  
    document.getElementById('signup-form').addEventListener('submit', (e) => {
      e.preventDefault();
  
      const username = document.getElementById('signup-username').value;
      const password = document.getElementById('signup-password').value;
  
      const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  
      const existe = usuarios.find(u => u.username === username);
      if (existe) {
        alert('Este usuario ya existe');
        return;
      }
  
      usuarios.push({ username, password });
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
  
      alert('Cuenta creada con éxito. Ahora inicia sesión.');
      window.location.hash = '#/login';
    });
  }
  