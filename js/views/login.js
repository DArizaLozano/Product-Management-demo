import { setSession } from '../auth.js';

export function loadLoginView() {
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <div class="login-container">
      <h2>Iniciar Sesión</h2>
      <form id="login-form">
        <input type="text" id="username" placeholder="Usuario" required />
        <input type="password" id="password" placeholder="Contraseña" required />
        <button type="submit">Entrar</button>
      </form>
      <p>¿No tienes cuenta? <a href="#/signup">Regístrate aquí</a></p>
    </div>
  `;

  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    const existe = usuarios.find(u => u.username === user && u.password === pass);

    if (existe || (user === 'admin' && pass === 'admin')) {
      setSession(JSON.stringify({ username: user }));
      window.location.hash = '#/dashboard';
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  });
}
