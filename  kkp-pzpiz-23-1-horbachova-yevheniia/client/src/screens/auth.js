import { api, setToken, logout } from '../api.js';
import { el, escapeHtml } from '../utils.js';
import { appState } from '../state.js';

export function renderHome(root, navigate) {
  root.replaceChildren(
    el(`
      <main class="box">
        <h1>Learnly</h1>
        <p class="hint">Навчальна платформа для вивчення слів: класи, завдання, картки та тести.</p>
        <div class="card-actions card-actions--stack">
          <button type="button" id="go-login" class="btn btn--primary btn--block">Увійти</button>
          <button type="button" id="go-register" class="btn btn--secondary btn--block">Реєстрація</button>
        </div>
      </main>
    `),
  );
  root.querySelector('#go-login').addEventListener('click', () => navigate('login'));
  root.querySelector('#go-register').addEventListener('click', () => navigate('register'));
}

export function renderLogin(root, navigate) {
  root.replaceChildren(
    el(`
      <main class="box">
        <h1>Вхід</h1>
        <form id="login-form" class="form">
          <label>Email <input name="email" type="email" autocomplete="username" required /></label>
          <label>Пароль <input name="password" type="password" autocomplete="current-password" required /></label>
          <button type="submit" class="btn btn--primary btn--block">Увійти</button>
        </form>
        <p class="hint"><button type="button" id="to-register" class="btn btn--ghost btn--sm">Немає акаунта? Зареєструватись</button></p>
        <p id="login-err" class="err" role="alert"></p>
      </main>
    `),
  );
  const err = root.querySelector('#login-err');
  root.querySelector('#to-register').addEventListener('click', () => navigate('register'));
  root.querySelector('#login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    err.textContent = '';
    const fd = new FormData(e.target);
    try {
      const data = await api('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: String(fd.get('email') || ''),
          password: String(fd.get('password') || ''),
        }),
      });
      setToken(data.token);
      appState.user = data.user;
      navigate(data.user.role === 'teacher' ? 'teacher-dashboard' : 'student-dashboard');
    } catch (e2) {
      err.textContent = e2.message || 'Помилка входу';
    }
  });
}

export function renderRegister(root, navigate) {
  root.replaceChildren(
    el(`
      <main class="box">
        <h1>Реєстрація</h1>
        <form id="register-form" class="form">
          <label>Ім'я <input name="name" type="text" required maxlength="100" /></label>
          <label>Email <input name="email" type="email" autocomplete="username" required /></label>
          <label>Пароль <input name="password" type="password" autocomplete="new-password" required minlength="6" /></label>
          <label>Роль
            <select name="role" required>
              <option value="student">Учень</option>
              <option value="teacher">Викладач</option>
            </select>
          </label>
          <button type="submit" class="btn btn--primary btn--block">Зареєструватись</button>
        </form>
        <p class="hint"><button type="button" id="to-login" class="btn btn--ghost btn--sm">Вже є акаунт? Увійти</button></p>
        <p id="reg-err" class="err" role="alert"></p>
      </main>
    `),
  );
  const err = root.querySelector('#reg-err');
  root.querySelector('#to-login').addEventListener('click', () => navigate('login'));
  root.querySelector('#register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    err.textContent = '';
    const fd = new FormData(e.target);
    try {
      await api('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: String(fd.get('name') || ''),
          email: String(fd.get('email') || ''),
          password: String(fd.get('password') || ''),
          role: String(fd.get('role') || 'student'),
        }),
      });
      const data = await api('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: String(fd.get('email') || ''),
          password: String(fd.get('password') || ''),
        }),
      });
      setToken(data.token);
      appState.user = data.user;
      navigate(data.user.role === 'teacher' ? 'teacher-dashboard' : 'student-dashboard');
    } catch (e2) {
      err.textContent = e2.message || 'Помилка реєстрації';
    }
  });
}

export function headerBar(user, onLogout, extra = '') {
  return el(`
    <header class="top">
      <div class="card-actions">
        ${extra}
      </div>
    </header>
  `);
}

export function renderBrandAccount(user, navigate) {
  const slot = document.querySelector('#brand-account');
  if (!slot) return;
  if (!user) {
    slot.replaceChildren();
    return;
  }
  slot.replaceChildren(
    el(`
      <div class="brand__account-inner">
        <div class="brand__user">
          <span class="brand__name">${escapeHtml(user.name)}</span>
          <span class="brand__role">${user.role === 'teacher' ? 'Викладач' : 'Учень'} · ${escapeHtml(user.email)}</span>
        </div>
        <button type="button" id="brand-logout" class="btn brand__logout btn--sm">Вийти</button>
      </div>
    `),
  );
  slot.querySelector('#brand-logout').addEventListener('click', () => {
    logout();
    appState.user = null;
    navigate('home');
  });
}

export function bindLogout(root, navigate) {
  root.querySelector('#logout')?.addEventListener('click', () => {
    logout();
    appState.user = null;
    navigate('home');
  });
}
