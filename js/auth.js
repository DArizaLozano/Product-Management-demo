export function checkSession() {
    const user = localStorage.getItem('user');
    if (!user && window.location.hash !== '#/login' && window.location.hash !== '#/signup') {
      window.location.hash = '#/login';
    }
  }
  
  export function setSession(username) {
    localStorage.setItem('user', username);
  }
  
  export function clearSession() {
    localStorage.removeItem('user');
  }
  