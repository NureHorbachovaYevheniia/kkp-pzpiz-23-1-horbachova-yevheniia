// IoT-симулятор Learnly — простий клієнт для API сервера
const API = 'http://localhost:3001/api';
const TOKEN_KEY = 'learnly_iot_token';

const screen = document.getElementById('screen');
const buttons = document.getElementById('buttons');
const statusEl = document.querySelector('.device-status');

// запит до сервера
async function api(path, options = {}) {
  const headers = { ...options.headers };
  if (options.body) {
    headers['Content-Type'] = 'application/json';
  }
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    headers.Authorization = 'Bearer ' + token;
  }

  const res = await fetch(API + path, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || 'Помилка сервера');
  }
  return data;
}

// показати, що пристрій онлайн
function setOnline(yes) {
  if (yes) {
    statusEl.textContent = '● Online';
    statusEl.classList.add('online');
  } else {
    statusEl.textContent = '● Offline';
    statusEl.classList.remove('online');
  }
}

// форма входу
function showLogin() {
  setOnline(false);
  screen.innerHTML = `
    <p class="hint">Вхід учня</p>
    <label>Email</label>
    <input type="email" id="email" value="student1@learnly.local">
    <label>Пароль</label>
    <input type="password" id="password" value="student123">
  `;
  buttons.innerHTML = '<button class="primary" id="btn-login">Увійти</button>';
  document.getElementById('btn-login').onclick = doLogin;
}

// логін
async function doLogin() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  buttons.innerHTML = '';
  screen.innerHTML = '<p class="hint">Підключення...</p>';

  try {
    const data = await api('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (data.user.role !== 'student') {
      throw new Error('Пристрій тільки для учнів');
    }

    localStorage.setItem(TOKEN_KEY, data.token);
    setOnline(true);
    screen.innerHTML = `
      <p class="hint">Підключено</p>
      <p class="word">${data.user.name}</p>
    `;
    buttons.innerHTML = '<button id="btn-logout">Вийти</button>';
    document.getElementById('btn-logout').onclick = doLogout;
  } catch (err) {
    setOnline(false);
    screen.innerHTML = `<p class="error">${err.message}</p>`;
    buttons.innerHTML = '<button id="btn-retry">Спробувати знову</button>';
    document.getElementById('btn-retry').onclick = showLogin;
  }
}

function doLogout() {
  localStorage.removeItem(TOKEN_KEY);
  showLogin();
}

// перевіряємо, чи вже залогінені
async function start() {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    showLogin();
    return;
  }

  try {
    const user = await api('/auth/me');
    if (user.role !== 'student') {
      doLogout();
      return;
    }
    setOnline(true);
    screen.innerHTML = `
      <p class="hint">Підключено</p>
      <p class="word">${user.name}</p>
    `;
    buttons.innerHTML = '<button id="btn-logout">Вийти</button>';
    document.getElementById('btn-logout').onclick = doLogout;
  } catch {
    doLogout();
  }
}

start();
