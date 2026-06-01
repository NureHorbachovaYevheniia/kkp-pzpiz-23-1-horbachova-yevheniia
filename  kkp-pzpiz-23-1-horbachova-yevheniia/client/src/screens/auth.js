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
  const saved = appState.registerData || {};
  root.replaceChildren(
    el(`
      <main class="box">
        <h1>${escapeHtml(t('register.title'))}</h1>
        <form id="register-form" class="form">
          <label>${escapeHtml(t('label.name'))} <input name="name" type="text" required maxlength="100" value="${escapeHtml(saved.name || '')}" /></label>
          <label>${escapeHtml(t('label.email'))} <input name="email" type="email" autocomplete="username" required value="${escapeHtml(saved.email || '')}" /></label>
          <label>${escapeHtml(t('label.password'))} <input name="password" type="password" autocomplete="new-password" required minlength="6" value="${escapeHtml(saved.password || '')}" /></label>
          <button type="submit" class="btn btn--primary btn--block">${escapeHtml(t('btn.next'))}</button>
        </form>
        <p class="hint"><button type="button" id="to-login" class="btn btn--ghost btn--sm">${escapeHtml(t('register.hasAccount'))}</button></p>
        <p id="reg-err" class="err" role="alert"></p>
      </main>
    `),
  );
  const err = root.querySelector('#reg-err');
  root.querySelector('#to-login').addEventListener('click', () => navigate('login'));
  root.querySelector('#register-form').addEventListener('submit', (e) => {
    e.preventDefault();
    err.textContent = '';
    const fd = new FormData(e.target);
    // зберігаємо дані форми і йдемо на вибір ролі
    appState.registerData = {
      name: String(fd.get('name') || ''),
      email: String(fd.get('email') || ''),
      password: String(fd.get('password') || ''),
    };
    navigate('register-role');
  });
}

export function renderRegisterRole(root, navigate) {
  // якщо немає даних форми — повертаємо на перший крок
  if (!appState.registerData) {
    navigate('register');
    return;
  }
  root.replaceChildren(
    el(`
      <main class="box">
        <h1>${escapeHtml(t('register.roleTitle'))}</h1>
        <p class="hint">${escapeHtml(t('register.roleHint'))}</p>
        <div class="role-choice">
          <button type="button" class="role-card" data-role="student">
            <span class="role-card__icon">🎒</span>
            <span class="role-card__label">${escapeHtml(t('role.student'))}</span>
          </button>
          <button type="button" class="role-card" data-role="teacher">
            <span class="role-card__icon">🎓</span>
            <span class="role-card__label">${escapeHtml(t('role.teacher'))}</span>
          </button>
        </div>
        <p class="hint"><button type="button" id="role-back" class="btn btn--ghost btn--sm">${escapeHtml(t('btn.back'))}</button></p>
        <p id="role-err" class="err" role="alert"></p>
      </main>
    `),
  );
  const err = root.querySelector('#role-err');
  root.querySelector('#role-back').addEventListener('click', () => navigate('register'));
  root.querySelectorAll('.role-card').forEach((btn) => {
    btn.addEventListener('click', async () => {
      err.textContent = '';
      const role = btn.getAttribute('data-role');
      const reg = appState.registerData;
      try {
        await api('/api/auth/register', {
          method: 'POST',
          body: JSON.stringify({ ...reg, role }),
        });
        const data = await api('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email: reg.email, password: reg.password }),
        });
        setToken(data.token);
        appState.user = data.user;
        appState.registerData = null;
        navigate(data.user.role === 'teacher' ? 'teacher-dashboard' : 'student-dashboard');
      } catch (e2) {
        err.textContent = e2.message || t('error.register');
      }
    });
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

function dashboardScreen(user) {
  return user.role === 'teacher' ? 'teacher-dashboard' : 'student-dashboard';
}

export function renderProfile(root, navigate) {
  const user = appState.user;
  if (!user) {
    navigate('login');
    return;
  }
  const back = dashboardScreen(user);
  root.replaceChildren(
    el(`
      <main class="box">
        ${headerBar(user, null, `<button type="button" id="back" class="btn btn--ghost btn--sm">${escapeHtml(t('btn.backCabinet'))}</button>`).outerHTML}
        <h1>${escapeHtml(t('profile.title'))}</h1>
        <p class="hint">${escapeHtml(user.role === 'teacher' ? t('role.teacher') : t('role.student'))}</p>
        <form id="profile-form" class="form">
          <label>${escapeHtml(t('label.name'))} <input name="name" type="text" required maxlength="100" value="${escapeHtml(user.name)}" /></label>
          <label>${escapeHtml(t('label.email'))} <input name="email" type="email" autocomplete="username" required value="${escapeHtml(user.email)}" /></label>
          <label>${escapeHtml(t('profile.passwordLabel'))} <input name="password" type="password" autocomplete="new-password" minlength="6" placeholder="${escapeHtml(t('profile.passwordPlaceholder'))}" /></label>
          <button type="submit" class="btn btn--primary btn--block">${escapeHtml(t('btn.save'))}</button>
        </form>
        <p id="profile-err" class="err" role="alert"></p>
      </main>
    `),
  );
  bindLogout(root, navigate);
  root.querySelector('#back').addEventListener('click', () => navigate(back));
  const err = root.querySelector('#profile-err');
  root.querySelector('#profile-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    err.textContent = '';
    const fd = new FormData(e.target);
    const body = {
      name: String(fd.get('name') || ''),
      email: String(fd.get('email') || ''),
    };
    const password = String(fd.get('password') || '');
    if (password) body.password = password;
    try {
      appState.user = await api('/api/auth/me', {
        method: 'PUT',
        body: JSON.stringify(body),
      });
      navigate(back);
    } catch (e2) {
      err.textContent = e2.message || t('error.profile');
    }
  });
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
        <button type="button" id="brand-profile" class="btn btn--ghost btn--sm">${escapeHtml(t('btn.profile'))}</button>
        <button type="button" id="brand-logout" class="btn brand__logout btn--sm">${escapeHtml(t('btn.logout'))}</button>
      </div>
    `),
  );
  slot.querySelector('#brand-profile').addEventListener('click', () => navigate('profile'));
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
