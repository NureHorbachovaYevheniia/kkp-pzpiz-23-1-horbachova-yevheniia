// Переклади для IoT (uk / en)
const LOCALE_KEY = 'learnly_iot_locale';

let locale = 'uk';

const messages = {
  uk: {
    offline: '● Offline',
    online: '● Online',
    loginTitle: 'Вхід учня',
    password: 'Пароль',
    loginBtn: 'Увійти',
    connecting: 'Підключення...',
    serverUnreachable: 'Сервер недоступний. Запустіть server (npm run dev).',
    serverError: 'Помилка сервера',
    studentsOnly: 'Пристрій тільки для учнів',
    retry: 'Спробувати знову',
    connected: 'Підключено',
    study: 'Навчання',
    logout: 'Вийти',
    loading: 'Завантаження...',
    noSets: 'Немає наборів слів',
    pickSet: 'Оберіть набір',
    back: '← Назад',
    loadingCards: 'Завантаження карток...',
    emptySet: 'Набір порожній',
    cardsDone: 'Картки закінчились',
    again: 'Знову',
    menu: '← Меню',
    saving: 'Збереження...',
    translation: 'Переклад',
    know: 'Знаю',
    repeat: 'Повторити',
    langUk: 'UA',
    langEn: 'EN',
  },
  en: {
    offline: '● Offline',
    online: '● Online',
    loginTitle: 'Student login',
    password: 'Password',
    loginBtn: 'Log in',
    connecting: 'Connecting...',
    serverUnreachable: 'Server unavailable. Start the server (npm run dev).',
    serverError: 'Server error',
    studentsOnly: 'This device is for students only',
    retry: 'Try again',
    connected: 'Connected',
    study: 'Study',
    logout: 'Log out',
    loading: 'Loading...',
    noSets: 'No word sets',
    pickSet: 'Choose a set',
    back: '← Back',
    loadingCards: 'Loading cards...',
    emptySet: 'Set is empty',
    cardsDone: 'No more cards',
    again: 'Again',
    menu: '← Menu',
    saving: 'Saving...',
    translation: 'Translation',
    know: 'I know',
    repeat: 'Repeat',
    langUk: 'UA',
    langEn: 'EN',
  },
};

function t(key) {
  const table = messages[locale] || messages.uk;
  return table[key] || messages.uk[key] || key;
}

function getLocale() {
  return locale;
}

function setLocale(next) {
  if (next !== 'uk' && next !== 'en') return;
  locale = next;
  localStorage.setItem(LOCALE_KEY, locale);
  document.documentElement.lang = locale === 'en' ? 'en' : 'uk';
}

const saved = localStorage.getItem(LOCALE_KEY);
if (saved === 'uk' || saved === 'en') {
  locale = saved;
}
document.documentElement.lang = locale === 'en' ? 'en' : 'uk';
