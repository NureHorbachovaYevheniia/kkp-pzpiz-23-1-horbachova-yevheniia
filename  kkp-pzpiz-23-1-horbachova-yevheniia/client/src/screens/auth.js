import { api, setToken, logout } from '../api.js';
import { el, escapeHtml } from '../utils.js';
import { appState } from '../state.js';
import { t } from '../i18n.js';

export function renderHome(root, navigate) {
  root.replaceChildren(
    el(`
      <main class="box">
        <h1>Learnly</h1>
        <p class="hint">${escapeHtml(t('home.hint'))}</p>
        <div class="card-actions card-actions--stack">
          <button type="button" id="go-login" class="btn btn--primary btn--block">${escapeHtml(t('btn.login'))}</button>
          <button type="button" id="go-register" class="btn btn--secondary btn--block">${escapeHtml(t('btn.register'))}</button>
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
        <h1>${escapeHtml(t('login.title'))}</h1>
        <form id="login-form" class="form">
          <label>${escapeHtml(t('label.email'))} <input name="email" type="email" autocomplete="username" required /></label>
          <label>${escapeHtml(t('label.password'))} <input name="password" type="password" autocomplete="current-password" required /></label>
          <button type="submit" class="btn btn--primary btn--block">${escapeHtml(t('btn.login'))}</button>
        </form>
        <p class="hint"><button type="button" id="to-register" class="btn btn--ghost btn--sm">${escapeHtml(t('login.noAccount'))}</button></p>
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
      err.textContent = e2.message || t('error.login');
    }
  });
}

export function renderRegister(root, navigate) {
  root.replaceChildren(
    el(`
      <main class="box">
        <h1>${escapeHtml(t('register.title'))}</h1>
        <form id="register-form" class="form">
          <label>${escapeHtml(t('label.name'))} <input name="name" type="text" required maxlength="100" /></label>
          <label>${escapeHtml(t('label.email'))} <input name="email" type="email" autocomplete="username" required /></label>
          <label>${escapeHtml(t('label.password'))} <input name="password" type="password" autocomplete="new-password" required minlength="6" /></label>
          <label>${escapeHtml(t('label.role'))}
            <select name="role" required>
              <option value="student">${escapeHtml(t('role.student'))}</option>
              <option value="teacher">${escapeHtml(t('role.teacher'))}</option>
            </select>
          </label>
          <button type="submit" class="btn btn--primary btn--block">${escapeHtml(t('register.submit'))}</button>
        </form>
        <p class="hint"><button type="button" id="to-login" class="btn btn--ghost btn--sm">${escapeHtml(t('register.hasAccount'))}</button></p>
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
      err.textContent = e2.message || t('error.register');
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
  const roleLabel = user.role === 'teacher' ? t('role.teacher') : t('role.student');
  slot.replaceChildren(
    el(`
      <div class="brand__account-inner">
        <div class="brand__user">
          <span class="brand__name">${escapeHtml(user.name)}</span>
          <span class="brand__role">${escapeHtml(roleLabel)} · ${escapeHtml(user.email)}</span>
        </div>
        <button type="button" id="brand-logout" class="btn brand__logout btn--sm">${escapeHtml(t('btn.logout'))}</button>
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
