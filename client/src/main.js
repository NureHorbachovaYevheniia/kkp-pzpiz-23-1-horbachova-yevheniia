import './style.css';

const TOKEN_KEY = 'lexicon_token';

async function api(path, options = {}) {
  const headers = { ...options.headers };
  if (!headers['Content-Type'] && options.body) {
    headers['Content-Type'] = 'application/json';
  }
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    headers.Authorization = 'Bearer ' + token;
  }
  const res = await fetch(path, { ...options, headers });
  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text };
    }
  }
  if (!res.ok) {
    const msg = data && data.error ? data.error : res.statusText;
    throw new Error(msg);
  }
  return data;
}

function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

async function render() {
  const root = document.querySelector('#app');
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    root.replaceChildren(
      el(`
        <main class="box">
          <h1>Лексика</h1>
          <p class="hint">Увійдіть, щоб побачити набори слів.</p>
          <form id="login-form" class="form">
            <label>Email <input name="email" type="email" autocomplete="username" required /></label>
            <label>Пароль <input name="password" type="password" autocomplete="current-password" required /></label>
            <button type="submit">Увійти</button>
          </form>
          <p id="login-err" class="err" role="alert"></p>
        </main>
      `),
    );

    const err = root.querySelector('#login-err');
    root.querySelector('#login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      err.textContent = '';
      const fd = new FormData(e.target);
      const body = {
        email: String(fd.get('email') || '').trim(),
        password: String(fd.get('password') || ''),
      };
      try {
        const data = await api('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify(body),
        });
        localStorage.setItem(TOKEN_KEY, data.token);
        await render();
      } catch (err2) {
        err.textContent = err2.message || 'Помилка входу';
      }
    });
    return;
  }

  try {
    const me = await api('/api/auth/me');
    const sets = await api('/api/word-sets');

    const list = sets
      .map(
        (s) =>
          `<li><span class="set-title">${escapeHtml(s.title)}</span> <span class="meta">#${s.id}</span></li>`,
      )
      .join('');

    root.replaceChildren(
      el(`
        <main class="box">
          <header class="top">
            <h1>Набори слів</h1>
            <button type="button" id="logout">Вийти</button>
          </header>
          <p class="user">Ви: <strong>${escapeHtml(me.email)}</strong> (${escapeHtml(me.role)})</p>
          <ul class="sets">${list || '<li class="empty">Нема наборів</li>'}</ul>
        </main>
      `),
    );

    root.querySelector('#logout').addEventListener('click', () => {
      localStorage.removeItem(TOKEN_KEY);
      render();
    });
  } catch {
    localStorage.removeItem(TOKEN_KEY);
    await render();
  }
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

render();
