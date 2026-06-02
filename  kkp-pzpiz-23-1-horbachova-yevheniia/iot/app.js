// IoT-симулятор Learnly — простий клієнт для API сервера
const API = 'http://localhost:3001/api';
const TOKEN_KEY = 'learnly_iot_token';

const screen = document.getElementById('screen');
const buttons = document.getElementById('buttons');
const statusEl = document.querySelector('.device-status');

// дані для навчання
let studyCards = [];
let cardIndex = 0;
let flipped = false;
let currentSetId = null;

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
    showMainMenu(data.user);
  } catch (err) {
    setOnline(false);
    screen.innerHTML = `<p class="error">${err.message}</p>`;
    buttons.innerHTML = '<button id="btn-retry">Спробувати знову</button>';
    document.getElementById('btn-retry').onclick = showLogin;
  }
}

function doLogout() {
  localStorage.removeItem(TOKEN_KEY);
  studyCards = [];
  cardIndex = 0;
  currentSetId = null;
  showLogin();
}

// головне меню після входу
function showMainMenu(user) {
  screen.innerHTML = `
    <p class="hint">Підключено</p>
    <p class="word">${user.name}</p>
  `;
  buttons.innerHTML = `
    <button class="primary" id="btn-study">Навчання</button>
    <button id="btn-logout">Вийти</button>
  `;
  document.getElementById('btn-study').onclick = showSetList;
  document.getElementById('btn-logout').onclick = doLogout;
}

// список наборів слів учня
async function showSetList() {
  screen.innerHTML = '<p class="hint">Завантаження...</p>';
  buttons.innerHTML = '';

  try {
    const sets = await api('/my-sets');
    if (sets.length === 0) {
      screen.innerHTML = '<p class="error">Немає наборів слів</p>';
      buttons.innerHTML = '<button id="btn-back">← Назад</button>';
      document.getElementById('btn-back').onclick = () => start();
      return;
    }

    screen.innerHTML = '<p class="hint">Оберіть набір</p>';
    buttons.innerHTML = sets
      .map(
        (s) =>
          `<button data-id="${s.id}">${s.title} (${s.card_count})</button>`,
      )
      .join('');
    buttons.innerHTML += '<button id="btn-back">← Назад</button>';

    buttons.querySelectorAll('button[data-id]').forEach((btn) => {
      btn.onclick = () => loadSet(Number(btn.dataset.id));
    });
    document.getElementById('btn-back').onclick = () => start();
  } catch (err) {
    screen.innerHTML = `<p class="error">${err.message}</p>`;
    buttons.innerHTML = '<button id="btn-back">← Назад</button>';
    document.getElementById('btn-back').onclick = () => start();
  }
}

// завантажити картки набору
async function loadSet(setId) {
  screen.innerHTML = '<p class="hint">Завантаження карток...</p>';
  buttons.innerHTML = '';

  try {
    const data = await api('/my-sets/' + setId + '/study');
    studyCards = data.cards;
    currentSetId = setId;
    cardIndex = 0;
    flipped = false;

    if (studyCards.length === 0) {
      screen.innerHTML = '<p class="error">Набір порожній</p>';
      buttons.innerHTML = '<button id="btn-back">← Назад</button>';
      document.getElementById('btn-back').onclick = showSetList;
      return;
    }

    showCard();
  } catch (err) {
    screen.innerHTML = `<p class="error">${err.message}</p>`;
    buttons.innerHTML = '<button id="btn-back">← Назад</button>';
    document.getElementById('btn-back').onclick = showSetList;
  }
}

// показати поточну картку
function showCard() {
  const card = studyCards[cardIndex];
  flipped = false;

  screen.innerHTML = `
    <p class="word">${card.word}</p>
    <p class="translation" id="translation" style="display:none">${card.translation}</p>
    <p class="counter">${cardIndex + 1} / ${studyCards.length}</p>
  `;

  buttons.innerHTML = `
    <button id="btn-flip">Переклад</button>
    <button id="btn-next">Далі</button>
    <button id="btn-menu">← Меню</button>
  `;

  document.getElementById('btn-flip').onclick = () => {
    document.getElementById('translation').style.display = 'block';
    flipped = true;
  };
  document.getElementById('btn-next').onclick = () => {
    if (cardIndex < studyCards.length - 1) {
      cardIndex += 1;
      showCard();
    } else {
      screen.innerHTML = '<p class="hint">Картки закінчились</p>';
      buttons.innerHTML = `
        <button id="btn-again">Знову</button>
        <button id="btn-menu">← Меню</button>
      `;
      document.getElementById('btn-again').onclick = () => {
        cardIndex = 0;
        showCard();
      };
      document.getElementById('btn-menu').onclick = showSetList;
    }
  };
  document.getElementById('btn-menu').onclick = showSetList;
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
    showMainMenu(user);
  } catch {
    doLogout();
  }
}

start();
