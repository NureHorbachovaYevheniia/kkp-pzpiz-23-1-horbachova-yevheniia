// Головний файл клієнта. Тут вирішуємо, який екран показати.
import './style.css';
import { api, getToken, clearToken } from './api.js';
import { appState } from './state.js';
import { initI18n, mountLangSwitcher, onLocaleChange, updateBrandTag, t, isAuthTokenError } from './i18n.js';
import {
  renderHome,
  renderLogin,
  renderRegister,
  renderRegisterRole,
  renderProfile,
  renderBrandAccount,
} from './screens/auth.js';
import {
  renderTeacherDashboard,
  renderTeacherClass,
  renderTeacherWordSets,
  renderTeacherWordSet,
  renderTeacherCreateAssignment,
} from './screens/teacher.js';
import {
  renderStudentDashboard,
  renderStudentJoin,
  renderAssignmentDetail,
  renderStudy,
  renderTest,
  renderTestResults,
} from './screens/student.js';

const root = document.querySelector('#app');

// змінюємо екран і перемальовуємо сторінку
function navigate(screen, params = {}) {
  Object.assign(appState, params);
  appState.screen = screen;
  render();
}

// малюємо потрібний екран залежно від appState.screen
async function render() {
  try {
    renderBrandAccount(appState.user, navigate);
    switch (appState.screen) {
      case 'home':
        renderHome(root, navigate);
        break;
      case 'login':
        renderLogin(root, navigate);
        break;
      case 'register':
        renderRegister(root, navigate);
        break;
      case 'register-role':
        renderRegisterRole(root, navigate);
        break;
      case 'profile':
        renderProfile(root, navigate);
        break;
      case 'teacher-dashboard':
        await renderTeacherDashboard(root, navigate);
        break;
      case 'teacher-class':
        await renderTeacherClass(root, navigate);
        break;
      case 'teacher-word-sets':
        await renderTeacherWordSets(root, navigate);
        break;
      case 'teacher-word-set':
        await renderTeacherWordSet(root, navigate);
        break;
      case 'teacher-create-assignment':
        await renderTeacherCreateAssignment(root, navigate);
        break;
      case 'student-dashboard':
        await renderStudentDashboard(root, navigate);
        break;
      case 'student-join':
        renderStudentJoin(root, navigate);
        break;
      case 'assignment-detail':
        await renderAssignmentDetail(root, navigate);
        break;
      case 'study':
        await renderStudy(root, navigate);
        break;
      case 'test':
        await renderTest(root, navigate);
        break;
      case 'test-results':
        renderTestResults(root, navigate);
        break;
      default:
        navigate('home');
    }
  } catch (e) {
    // якщо токен застарів — повертаємо на сторінку входу
    if (isAuthTokenError(e.message)) {
      clearToken();
      appState.user = null;
      navigate('login');
      return;
    }
    // інакше просто показуємо текст помилки
    const box = document.createElement('main');
    box.className = 'box';
    box.innerHTML = `<p class="err">${e.message || t('error.generic')}</p>`;
    root.replaceChildren(box);
  }
}

// при відкритті сайту перевіряємо, чи користувач уже залогінений
async function bootstrap() {
  const token = getToken();
  if (token) {
    try {
      appState.user = await api('/api/auth/me');
      navigate(
        appState.user.role === 'teacher' ? 'teacher-dashboard' : 'student-dashboard',
      );
      return;
    } catch {
      clearToken();
    }
  }
  navigate('home');
}

initI18n();
mountLangSwitcher(document.querySelector('#lang-switcher'));
updateBrandTag();
onLocaleChange(() => {
  updateBrandTag();
  render();
});

bootstrap();
