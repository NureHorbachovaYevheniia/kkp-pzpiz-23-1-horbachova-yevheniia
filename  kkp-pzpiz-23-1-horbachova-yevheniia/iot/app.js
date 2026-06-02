//АйоТ
const API = '/api';
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
    throw new Error(data.error || t('serverError'));
  }
  return data;
}

// показати, що сервер доступний
function setOnline(yes) {
  if (yes) {
    statusEl.textContent = t('online');
    statusEl.classList.add('online');
  } else {
    statusEl.textContent = t('offline');
    statusEl.classList.remove('online');
  }
}

// перевірка, чи працює сервер
async function checkServer() {
  try {
    const res = await fetch('/health');
    const data = await res.json();
    const ok = res.ok && data.ok;
    setOnline(ok);
    return ok;
  } catch {
    setOnline(false);
    return false;
  }
}

// форма входу
function showLogin() {
  screen.innerHTML = `
    <p class="hint">${t('loginTitle')}</p>
    <label>Email</label>
    <input type="email" id="email" value="student1@learnly.local">
    <label>${t('password')}</label>
    <input type="password" id="password" value="student123">
  `;
  buttons.innerHTML = `
    <button type="button" id="lang-uk">${t('langUk')}</button>
    <button type="button" id="lang-en">${t('langEn')}</button>
    <button class="primary" id="btn-login">${t('loginBtn')}</button>
  `;
  document.getElementById('lang-uk').onclick = () => {
    setLocale('uk');
    showLogin();
  };
  document.getElementById('lang-en').onclick = () => {
    setLocale('en');
    showLogin();
  };
  document.getElementById('btn-login').onclick = doLogin;
}

// логін
async function doLogin() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  buttons.innerHTML = '';
  screen.innerHTML = `<p class="hint">${t('connecting')}</p>`;

  try {
    const data = await api('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (data.user.role !== 'student') {
      throw new Error(t('studentsOnly'));
    }

    localStorage.setItem(TOKEN_KEY, data.token);
    showMainMenu(data.user);
  } catch (err) {
    screen.innerHTML = `<p class="error">${err.message}</p>`;
    buttons.innerHTML = `<button id="btn-retry">${t('retry')}</button>`;
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
    <p class="hint">${t('connected')}</p>
    <p class="word">${user.name}</p>
  `;
  buttons.innerHTML = `
    <button class="primary" id="btn-study">${t('study')}</button>
    <button id="btn-logout">${t('logout')}</button>
  `;
  document.getElementById('btn-study').onclick = showSetList;
  document.getElementById('btn-logout').onclick = doLogout;
}

// список наборів слів учня
async function showSetList() {
  screen.innerHTML = `<p class="hint">${t('loading')}</p>`;
  buttons.innerHTML = '';

  try {
    const sets = await api('/my-sets');
    if (sets.length === 0) {
      screen.innerHTML = `<p class="error">${t('noSets')}</p>`;
      buttons.innerHTML = `<button id="btn-back">${t('back')}</button>`;
      document.getElementById('btn-back').onclick = () => start();
      return;
    }

    screen.innerHTML = `<p class="hint">${t('pickSet')}</p>`;
    buttons.innerHTML = sets
      .map(
        (s) =>
          `<button data-id="${s.id}">${s.title} (${s.card_count})</button>`,
      )
      .join('');
    buttons.innerHTML += `<button id="btn-back">${t('back')}</button>`;

    buttons.querySelectorAll('button[data-id]').forEach((btn) => {
      btn.onclick = () => loadSet(Number(btn.dataset.id));
    });
    document.getElementById('btn-back').onclick = () => start();
  } catch (err) {
    screen.innerHTML = `<p class="error">${err.message}</p>`;
    buttons.innerHTML = `<button id="btn-back">${t('back')}</button>`;
    document.getElementById('btn-back').onclick = () => start();
  }
}

// завантажити картки набору
async function loadSet(setId) {
  screen.innerHTML = `<p class="hint">${t('loadingCards')}</p>`;
  buttons.innerHTML = '';

  try {
    const data = await api('/my-sets/' + setId + '/study');
    studyCards = data.cards;
    currentSetId = setId;
    cardIndex = 0;
    flipped = false;

    if (studyCards.length === 0) {
      screen.innerHTML = `<p class="error">${t('emptySet')}</p>`;
      buttons.innerHTML = `<button id="btn-back">${t('back')}</button>`;
      document.getElementById('btn-back').onclick = showSetList;
      return;
    }

    showCard();
  } catch (err) {
    screen.innerHTML = `<p class="error">${err.message}</p>`;
    buttons.innerHTML = `<button id="btn-back">${t('back')}</button>`;
    document.getElementById('btn-back').onclick = showSetList;
  }
}

// зберегти прогрес на сервері
async function saveProgress(status) {
  const card = studyCards[cardIndex];
  await api('/my-sets/' + currentSetId + '/progress', {
    method: 'POST',
    body: JSON.stringify({
      word_card_id: card.id,
      status: status,
    }),
  });
  // оновлюємо статус у пам'яті
  card.progress_status = status;
}

// перейти до наступної картки
function goNext() {
  if (cardIndex < studyCards.length - 1) {
    cardIndex += 1;
    showCard();
    return;
  }
  screen.innerHTML = `<p class="hint">${t('cardsDone')}</p>`;
  buttons.innerHTML = `
    <button id="btn-again">${t('again')}</button>
    <button id="btn-menu">${t('menu')}</button>
  `;
  document.getElementById('btn-again').onclick = () => {
    cardIndex = 0;
    showCard();
  };
  document.getElementById('btn-menu').onclick = showSetList;
}

// відповідь учня: знаю або повторити
async function answerCard(status) {
  buttons.querySelectorAll('button').forEach((b) => (b.disabled = true));
  screen.innerHTML += `<p class="hint" id="saving">${t('saving')}</p>`;

  try {
    await saveProgress(status);
    goNext();
  } catch (err) {
    const saving = document.getElementById('saving');
    if (saving) saving.textContent = err.message;
    saving.className = 'error';
    buttons.querySelectorAll('button').forEach((b) => (b.disabled = false));
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
    <button id="btn-flip">${t('translation')}</button>
    <button class="primary" id="btn-know">${t('know')}</button>
    <button id="btn-repeat">${t('repeat')}</button>
    <button id="btn-menu">${t('menu')}</button>
  `;

  document.getElementById('btn-flip').onclick = () => {
    document.getElementById('translation').style.display = 'block';
    flipped = true;
  };
  document.getElementById('btn-know').onclick = () => answerCard('know');
  document.getElementById('btn-repeat').onclick = () => answerCard('repeat');
  document.getElementById('btn-menu').onclick = showSetList;
}

// перевіряємо, чи вже залогінені
async function start() {
  const serverOk = await checkServer();
  if (!serverOk) {
    screen.innerHTML = `<p class="error">${t('serverUnreachable')}</p>`;
    buttons.innerHTML = `<button id="btn-retry">${t('retry')}</button>`;
    document.getElementById('btn-retry').onclick = start;
    return;
  }

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
    showMainMenu(user);
  } catch {
    doLogout();
  }
}

start();
