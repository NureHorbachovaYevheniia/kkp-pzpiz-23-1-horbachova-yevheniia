const LOCALE_KEY = 'learnly_locale';

const messages = {
  uk: {
    'brand.tag': 'навчальна платформа',
    'lang.uk': 'UA',
    'lang.en': 'EN',
    'lang.switch': 'Мова інтерфейсу',

    'btn.login': 'Увійти',
    'btn.register': 'Реєстрація',
    'btn.logout': 'Вийти',
    'btn.open': 'Відкрити',
    'btn.create': 'Створити',
    'btn.save': 'Зберегти',
    'btn.backCabinet': '← Кабінет',
    'btn.backClass': '← Клас',
    'btn.backAssignment': '← Завдання',
    'btn.join': 'Приєднатись',
    'btn.next': 'Далі',
    'btn.finish': 'Завершити',
    'btn.check': 'Перевірити',
    'btn.done': 'Готово',
    'btn.cancel': 'Скасувати',

    'label.email': 'Email',
    'label.password': 'Пароль',
    'label.name': "Ім'я",
    'label.role': 'Роль',
    'label.classCode': 'Код класу',

    'role.student': 'Учень',
    'role.teacher': 'Викладач',

    'error.login': 'Помилка входу',
    'error.register': 'Помилка реєстрації',
    'error.generic': 'Помилка',
    'error.tokenRequired': 'Потрібен токен',
    'error.tokenInvalid': 'Недійсний токен',

    'home.hint':
      'Навчальна платформа для вивчення слів: класи, завдання, картки та тести.',
    'login.title': 'Вхід',
    'login.noAccount': 'Немає акаунта? Зареєструватись',
    'register.title': 'Реєстрація',
    'register.hasAccount': 'Вже є акаунт? Увійти',
    'register.submit': 'Зареєструватись',

    'teacher.dashboard.title': 'Кабінет викладача',
    'teacher.dashboard.stats':
      'Класів: {classes} · Активних завдань: {assignments} · Виконання: {percent}%',
    'teacher.myClasses': 'Мої класи',
    'teacher.wordSets': 'Набори слів',
    'teacher.createClass': '+ Створити клас',
    'teacher.addSet': '+ Додати набір',
    'teacher.newClass': 'Новий клас',
    'teacher.newSet': 'Новий набір',
    'teacher.noClasses': 'Ще немає класів.',
    'teacher.noSets': 'Немає наборів.',
    'teacher.classMeta': '{subject} · {count} учнів · код: {code}',
    'teacher.setMeta': '{language} · {count} карток',
    'teacher.placeholder.classTitle': 'Назва класу',
    'teacher.placeholder.subject': 'Предмет / мова',
    'teacher.placeholder.description': 'Короткий опис',
    'teacher.placeholder.setTitle': 'Назва набору',
    'teacher.placeholder.selectLanguage': 'Оберіть мову',
    'teacher.err.classTitle': 'Назва класу має бути 1–200 символів',
    'teacher.err.setTitle': 'Назва набору має бути 1–200 символів',
    'teacher.err.setLanguage': 'Оберіть мову набору',
    'teacher.classCode': 'Код класу',
    'teacher.students': 'Учні',
    'teacher.noStudents': 'Ще немає учнів.',
    'teacher.assignments': 'Завдання',
    'teacher.noAssignments': 'Завдань ще немає.',
    'teacher.editClass': 'Редагувати',
    'teacher.deleteClass': 'Видалити',
    'teacher.editClassTitle': 'Редагувати клас',
    'teacher.deleteClassConfirm':
      'Видалити клас разом з усіма завданнями та списком учнів?',
    'teacher.newAssignment': 'Завдання',
    'teacher.deadlineUntil': 'до {date}',
    'teacher.addWord': '+ Додати слово',
    'teacher.addCard': 'Додати картку',
    'teacher.placeholder.word': 'Слово',
    'teacher.placeholder.translation': 'Переклад',
    'teacher.placeholder.imageUrl': "Посилання на фото (необов'язково)",
    'teacher.btn.add': 'Додати',
    'teacher.noCards': 'Немає карток.',
    'teacher.deleteCardConfirm': 'Ви точно бажаєте видалити це слово?',
    'teacher.assign.title': 'Призначити завдання',
    'teacher.assign.class': 'Клас',
    'teacher.assign.wordSet': 'Набір слів',
    'teacher.assign.name': 'Назва',
    'teacher.assign.namePlaceholder': 'Назва завдання',
    'teacher.assign.start': 'Початок',
    'teacher.assign.deadline': 'Дедлайн',
    'teacher.assign.mode': 'Режим',
    'teacher.assign.submit': 'Створити завдання',

    'student.activeAssignments': 'Активні завдання',
    'student.noAssignments': 'Немає активних завдань.',
    'student.joinBtn': 'Приєднатись',
    'student.joinTitle': 'Приєднатися до класу',
    'student.assignment.status': 'Статус: {status} · Карток: {count}',
    'student.assignment.study': 'Вчити слова',
    'student.assignment.review': 'Повторити складні',
    'student.assignment.test': 'Пройти тест',
    'student.study.reviewTitle': 'Повторення помилок',
    'student.study.title': 'Вчити слова',
    'student.study.noWords': 'Немає слів для проходження.',
    'student.study.back': 'До завдання',
    'student.study.doneAll': 'Набір успішно завершено!',
    'student.study.donePartial': 'Прохід завершено.',
    'student.study.correctLabel': 'Правильних',
    'student.study.reviewHint':
      'Помилки можна пропрацювати через «Повторити складні».',
    'student.study.correct': 'Правильно!',
    'student.study.incorrect': 'Неправильно',
    'student.study.yourAnswerLabel': 'Ваша відповідь',
    'student.study.correctAnswerLabel': 'Правильна відповідь',
    'student.study.prompt': 'Впишіть слово відповідно до перекладу:',
    'student.study.answerPlaceholder': 'Ваша відповідь',
    'student.test.question': 'Питання {current} / {total}',
    'student.test.pickTranslation': 'Оберіть правильний переклад:',
    'student.testResults.title': 'Результат тесту',
    'student.testResults.scoreLabel': 'Бал',
    'student.testResults.reviewWords': 'Слова для повторення',
    'student.testResults.allCorrect': 'Усі відповіді правильні!',
    'student.testResults.wrongLine': '{word} — правильно: {translation}',

    'status.not_started': 'Не почато',
    'status.in_progress': 'У процесі',
    'status.completed': 'Завершено',
    'status.know': 'Знаю',
    'status.almost': 'Майже знаю',
    'status.repeat': 'Повторити',
    'status.active': 'Активне',
    'status.draft': 'Чернетка',
    'status.closed': 'Закрито',
    'status.study': 'Вивчення',
    'status.test': 'Тест',
    'status.mixed': 'Змішаний',
  },
  en: {
    'brand.tag': 'learning platform',
    'lang.uk': 'UA',
    'lang.en': 'EN',
    'lang.switch': 'Interface language',

    'btn.login': 'Log in',
    'btn.register': 'Sign up',
    'btn.logout': 'Log out',
    'btn.open': 'Open',
    'btn.create': 'Create',
    'btn.save': 'Save',
    'btn.backCabinet': '← Dashboard',
    'btn.backClass': '← Class',
    'btn.backAssignment': '← Assignment',
    'btn.join': 'Join',
    'btn.next': 'Next',
    'btn.finish': 'Finish',
    'btn.check': 'Check',
    'btn.done': 'Done',
    'btn.cancel': 'Cancel',

    'label.email': 'Email',
    'label.password': 'Password',
    'label.name': 'Name',
    'label.role': 'Role',
    'label.classCode': 'Class code',

    'role.student': 'Student',
    'role.teacher': 'Teacher',

    'error.login': 'Login failed',
    'error.register': 'Registration failed',
    'error.generic': 'Error',
    'error.tokenRequired': 'Token required',
    'error.tokenInvalid': 'Invalid token',

    'home.hint':
      'A platform for learning vocabulary: classes, assignments, flashcards, and tests.',
    'login.title': 'Log in',
    'login.noAccount': "Don't have an account? Sign up",
    'register.title': 'Sign up',
    'register.hasAccount': 'Already have an account? Log in',
    'register.submit': 'Sign up',

    'teacher.dashboard.title': 'Teacher dashboard',
    'teacher.dashboard.stats':
      'Classes: {classes} · Active assignments: {assignments} · Completion: {percent}%',
    'teacher.myClasses': 'My classes',
    'teacher.wordSets': 'Word sets',
    'teacher.createClass': '+ Create class',
    'teacher.addSet': '+ Add set',
    'teacher.newClass': 'New class',
    'teacher.newSet': 'New set',
    'teacher.noClasses': 'No classes yet.',
    'teacher.noSets': 'No word sets yet.',
    'teacher.classMeta': '{subject} · {count} students · code: {code}',
    'teacher.setMeta': '{language} · {count} cards',
    'teacher.placeholder.classTitle': 'Class name',
    'teacher.placeholder.subject': 'Subject / language',
    'teacher.placeholder.description': 'Short description',
    'teacher.placeholder.setTitle': 'Set name',
    'teacher.placeholder.selectLanguage': 'Choose language',
    'teacher.err.classTitle': 'Class name must be 1–200 characters',
    'teacher.err.setTitle': 'Set name must be 1–200 characters',
    'teacher.err.setLanguage': 'Choose a language for the set',
    'teacher.classCode': 'Class code',
    'teacher.students': 'Students',
    'teacher.noStudents': 'No students yet.',
    'teacher.assignments': 'Assignments',
    'teacher.noAssignments': 'No assignments yet.',
    'teacher.editClass': 'Edit',
    'teacher.deleteClass': 'Delete',
    'teacher.editClassTitle': 'Edit class',
    'teacher.deleteClassConfirm':
      'Delete this class with all assignments and the student list?',
    'teacher.newAssignment': 'Assignment',
    'teacher.deadlineUntil': 'due {date}',
    'teacher.addWord': '+ Add word',
    'teacher.addCard': 'Add card',
    'teacher.placeholder.word': 'Word',
    'teacher.placeholder.translation': 'Translation',
    'teacher.placeholder.imageUrl': 'Image URL (optional)',
    'teacher.btn.add': 'Add',
    'teacher.noCards': 'No cards yet.',
    'teacher.deleteCardConfirm': 'Delete this word?',
    'teacher.assign.title': 'Create assignment',
    'teacher.assign.class': 'Class',
    'teacher.assign.wordSet': 'Word set',
    'teacher.assign.name': 'Title',
    'teacher.assign.namePlaceholder': 'Assignment title',
    'teacher.assign.start': 'Start date',
    'teacher.assign.deadline': 'Deadline',
    'teacher.assign.mode': 'Mode',
    'teacher.assign.submit': 'Create assignment',

    'student.activeAssignments': 'Active assignments',
    'student.noAssignments': 'No active assignments.',
    'student.joinBtn': 'Join class',
    'student.joinTitle': 'Join a class',
    'student.assignment.status': 'Status: {status} · Cards: {count}',
    'student.assignment.study': 'Study words',
    'student.assignment.review': 'Review mistakes',
    'student.assignment.test': 'Take test',
    'student.study.reviewTitle': 'Review mistakes',
    'student.study.title': 'Study words',
    'student.study.noWords': 'No words to practice.',
    'student.study.back': 'Back to assignment',
    'student.study.doneAll': 'Set completed successfully!',
    'student.study.donePartial': 'Session complete.',
    'student.study.correctLabel': 'Correct',
    'student.study.reviewHint': 'You can review mistakes via “Review mistakes”.',
    'student.study.correct': 'Correct!',
    'student.study.incorrect': 'Incorrect',
    'student.study.yourAnswerLabel': 'Your answer',
    'student.study.correctAnswerLabel': 'Correct answer',
    'student.study.prompt': 'Type the word for this translation:',
    'student.study.answerPlaceholder': 'Your answer',
    'student.test.question': 'Question {current} / {total}',
    'student.test.pickTranslation': 'Choose the correct translation:',
    'student.testResults.title': 'Test results',
    'student.testResults.scoreLabel': 'Score',
    'student.testResults.reviewWords': 'Words to review',
    'student.testResults.allCorrect': 'All answers correct!',
    'student.testResults.wrongLine': '{word} — correct: {translation}',

    'status.not_started': 'Not started',
    'status.in_progress': 'In progress',
    'status.completed': 'Completed',
    'status.know': 'Know',
    'status.almost': 'Almost',
    'status.repeat': 'Review',
    'status.active': 'Active',
    'status.draft': 'Draft',
    'status.closed': 'Closed',
    'status.study': 'Study',
    'status.test': 'Test',
    'status.mixed': 'Mixed',
  },
};

let locale = 'uk';
const listeners = new Set();

export function getLocale() {
  return locale;
}

export function getDateLocale() {
  return locale === 'en' ? 'en-GB' : 'uk-UA';
}

export function t(key, vars = {}) {
  const table = messages[locale] || messages.uk;
  let text = table[key] ?? messages.uk[key] ?? key;
  for (const [name, value] of Object.entries(vars)) {
    text = text.replaceAll(`{${name}}`, String(value));
  }
  return text;
}

export function setLocale(next) {
  if (next !== 'uk' && next !== 'en') return;
  if (locale === next) return;
  locale = next;
  localStorage.setItem(LOCALE_KEY, locale);
  document.documentElement.lang = locale === 'en' ? 'en' : 'uk';
  listeners.forEach((fn) => fn(locale));
}

export function onLocaleChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function initI18n() {
  const stored = localStorage.getItem(LOCALE_KEY);
  if (stored === 'uk' || stored === 'en') locale = stored;
  document.documentElement.lang = locale === 'en' ? 'en' : 'uk';
}

export function updateBrandTag() {
  const tag = document.querySelector('.brand__tag');
  if (tag) tag.textContent = t('brand.tag');
}

export function mountLangSwitcher(slot) {
  if (!slot) return;
  const renderSwitcher = () => {
    slot.replaceChildren();
    const wrap = document.createElement('div');
    wrap.className = 'lang-switcher';
    wrap.setAttribute('role', 'group');
    wrap.setAttribute('aria-label', t('lang.switch'));

    for (const code of ['uk', 'en']) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'lang-switcher__btn' + (locale === code ? ' lang-switcher__btn--active' : '');
      btn.textContent = t(code === 'uk' ? 'lang.uk' : 'lang.en');
      btn.setAttribute('aria-pressed', locale === code ? 'true' : 'false');
      btn.addEventListener('click', () => setLocale(code));
      wrap.appendChild(btn);
    }
    slot.appendChild(wrap);
  };
  renderSwitcher();
  onLocaleChange(renderSwitcher);
}
