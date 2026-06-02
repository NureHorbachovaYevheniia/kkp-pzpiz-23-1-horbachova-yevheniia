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
    'btn.profile': 'Профіль',
    'btn.open': 'Відкрити',
    'btn.create': 'Створити',
    'btn.save': 'Зберегти',
    'btn.backCabinet': '← Кабінет',
    'btn.backClass': '← Клас',
    'btn.backAssignment': '← Завдання',
    'btn.backSets': '← Набори',
    'btn.join': 'Приєднатись',
    'btn.next': 'Далі',
    'btn.back': 'Назад',
    'btn.finish': 'Завершити',
    'btn.check': 'Перевірити',
    'btn.done': 'Готово',
    'btn.cancel': 'Скасувати',
    'btn.delete': 'Видалити',

    'label.email': 'Email',
    'label.password': 'Пароль',
    'label.name': "Ім'я",
    'label.role': 'Роль',
    'label.classCode': 'Код класу',

    'role.student': 'Учень',
    'role.teacher': 'Викладач',
    'role.admin': 'Адміністратор',

    'admin.dashboard.title': 'Кабінет адміністратора',
    'admin.dashboard.hint': 'Керування користувачами та резервними копіями системи.',
    'admin.users': 'Користувачі',
    'admin.noUsers': 'Немає користувачів.',
    'admin.created': 'Створено',
    'admin.deleteConfirm': 'Видалити цього користувача?',
    'admin.tools': 'Система',
    'admin.backup': 'Завантажити backup (app.db)',
    'admin.backupOk': 'Backup завантажено.',
    'admin.export': 'Експорт JSON (усі таблиці)',
    'admin.exportOk': 'Експорт завантажено.',
    'admin.logs': 'Журнал запитів',
    'admin.logs.title': 'Журнал HTTP-запитів',
    'admin.logsEmpty': 'Записів поки немає.',
    'admin.restore': 'Відновити базу з файлу .db',
    'admin.restoreHint': 'Замінює файл бази на сервері. Обережно!',
    'admin.restoreConfirm': 'Замінити базу даних на сервері? Поточні дані буде перезаписано.',
    'admin.restoreOk': 'Базу відновлено.',
    'admin.import': 'Імпорт JSON-дампу',
    'admin.importHint': 'Замінює дані в усіх таблицях з файлу експорту.',
    'admin.importConfirm': 'Замінити всі дані в системі з цього файлу?',
    'admin.importOk': 'Дані імпортовано.',

    'error.login': 'Помилка входу',
    'error.register': 'Помилка реєстрації',
    'error.profile': 'Помилка збереження профілю',
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
    'register.roleTitle': 'Хто ви?',
    'register.roleHint': 'Оберіть свою роль, щоб продовжити реєстрацію.',

    'survey.title': 'Ще кілька запитань',
    'survey.hint': 'Це допоможе нам зробити платформу кращою.',
    'survey.langStudent': 'Яку мову плануєте вивчати?',
    'survey.langTeacher': 'Яку мову ви викладаєте?',
    'survey.langPlaceholder': 'Напр., англійська',
    'survey.level': 'Який ваш рівень?',
    'survey.level.beginner': 'Початковий',
    'survey.level.intermediate': 'Середній',
    'survey.level.advanced': 'Просунутий',
    'survey.experience': 'Скільки років викладаєте?',
    'survey.exp.lt1': 'Менше року',
    'survey.exp.1to3': '1–3 роки',
    'survey.exp.3to5': '3–5 років',
    'survey.exp.gt5': 'Понад 5 років',
    'survey.choose': 'Оберіть...',
    'survey.finish': 'Завершити реєстрацію',
    'register.consent': 'Я погоджуюсь на обробку моїх персональних даних',
    'privacy.open': 'Політика конфіденційності',
    'privacy.title': 'Політика конфіденційності',
    'privacy.body':
      'Learnly — навчальна платформа для вивчення слів.\n\n' +
      'Які дані збираємо: ім’я, email, роль, відповіді опитування при реєстрації, прогрес навчання та результати тестів.\n\n' +
      'Навіщо: щоб надати доступ до класів, завдань і вашого кабінету.\n\n' +
      'Ваші права: переглянути профіль, завантажити копію даних (експорт у профілі), видалити акаунт.\n\n' +
      'Пароль зберігається у вигляді хешу. Не передавайте пароль іншим особам.',
    'error.consentRequired': 'Потрібна згода на обробку даних',

    'profile.title': 'Редагування профілю',
    'profile.passwordLabel': 'Новий пароль',
    'profile.passwordPlaceholder': 'залиште порожнім, якщо не змінюєте',
    'profile.timeFormat': 'Формат часу',
    'profile.timeFormat24': '24 години (13:30)',
    'profile.timeFormat12': '12 годин (1:30 PM)',
    'profile.exportHint': 'Завантажте копію всіх ваших даних у форматі JSON (GDPR).',
    'profile.exportBtn': 'Завантажити мої дані',
    'error.export': 'Не вдалося завантажити дані',
    'profile.deleteHint': 'Видалення акаунта є незворотним: усі ваші дані буде втрачено.',
    'profile.deleteBtn': 'Видалити акаунт',
    'profile.deleteConfirm': 'Ви впевнені? Акаунт і всі пов’язані дані буде видалено назавжди.',

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
    'teacher.placeholder.example': 'Приклад: I have a «dog».',
    'teacher.placeholder.exampleHint': 'Оберніть слово в «лапки», щоб підсветити його на картці.',
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

    'stats.title': 'Статистика',
    'stats.myProgress': 'Мій прогрес',
    'stats.testsDone': 'Тестів здано: {count}',
    'stats.avgScore': 'Середній бал: {score}%',
    'stats.wordsKnown': 'Слів «знаю»: {count}',
    'stats.noData': 'Поки немає даних для графіка.',
    'stats.chart.assignments': 'Середній бал по завданнях',
    'stats.chart.recentTests': 'Останні результати тестів',
    'stats.chart.progress': 'Прогрес слів',
    'stats.table.student': 'Учень',
    'stats.table.assignment': 'Завдання',
    'stats.table.score': 'Бал',
    'stats.table.status': 'Статус',

    'student.activeAssignments': 'Активні завдання',
    'student.noAssignments': 'Немає активних завдань.',
    'student.joinBtn': 'Приєднатись',
    'student.mySets': 'Мої набори',
    'student.mySetsTitle': 'Мої набори',
    'student.addSet': '+ Додати набір',
    'student.newSet': 'Новий набір',
    'student.noSets': 'У вас ще немає наборів.',
    'student.setDelete': 'Видалити',
    'student.setDeleteConfirm': 'Видалити цей набір разом з усіма картками?',
    'student.joinTitle': 'Приєднатися до класу',
    'student.assignment.status': 'Статус: {status} · Карток: {count}',
    'student.assignment.flashcards': 'Картки',
    'student.assignment.study': 'Навчання',
    'student.assignment.review': 'Повторити складні',
    'student.assignment.test': 'Пройти тест',
    'student.flash.title': 'Картки',
    'student.flash.tapToFlip': 'Натисніть на картку, щоб побачити переклад',
    'student.flash.know': 'Знаю',
    'student.flash.almost': 'Потрібно повторити',
    'student.flash.dontKnow': 'Не знаю',
    'student.flash.done': 'Усі картки вивчено!',
    'student.flash.progress': 'Вивчено {learned} / {total}',
    'student.flash.learnedLabel': 'Вивчено слів',
    'student.study.reviewTitle': 'Повторення помилок',
    'student.study.title': 'Навчання',
    'student.study.noWords': 'Немає слів для проходження.',
    'student.study.back': 'До завдання',
    'student.study.doneAll': 'Набір успішно завершено!',
    'student.study.donePartial': 'Прохід завершено.',
    'student.study.correctLabel': 'Правильних',
    'student.study.reviewHint': 'Можете пройти картки ще раз.',
    'student.study.correct': 'Правильно!',
    'student.study.incorrect': 'Неправильно',
    'student.study.yourAnswerLabel': 'Ваша відповідь',
    'student.study.correctAnswerLabel': 'Правильна відповідь',
    'student.study.prompt': 'Впишіть слово відповідно до перекладу:',
    'student.study.answerPlaceholder': 'Ваша відповідь',
    'student.study.listen': 'Прослухати',
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

    'api.forbidden': 'Недостатньо прав доступу',
    'api.invalidClassId': 'Невірний id класу',
    'api.classNotFound': 'Клас не знайдено',
    'api.classCodeRequired': 'Введіть код класу',
    'api.classCodeNotFound': 'Клас з таким кодом не знайдено',
    'api.invalidWordSetId': 'Невірний id набору',
    'api.wordSetNotFound': 'Набір слів не знайдено',
    'api.setNotFound': 'Набір не знайдено',
    'api.assignmentTitleLength': 'Назва завдання 1–200 символів',
    'api.datesRequired': 'Вкажіть start_date і deadline (YYYY-MM-DD)',
    'api.invalidMode': 'mode: study або test',
    'api.invalidAssignmentId': 'Невірний id завдання',
    'api.assignmentNotFound': 'Завдання не знайдено',
    'api.nameLength': "Ім'я 2–100 символів",
    'api.invalidEmail': 'Невірний email',
    'api.passwordMin': 'Пароль мінімум 6 символів',
    'api.invalidRole': 'Роль: teacher або student',
    'api.consentRequired': 'Потрібна згода на обробку даних',
    'api.emailTaken': 'Такий email вже є',
    'api.credentialsRequired': 'Вкажіть email і пароль',
    'api.invalidCredentials': 'Невірний email або пароль',
    'api.wordTranslationRequired': 'Введіть слово і переклад',
    'api.invalidCardId': 'Невірний id картки',
    'api.cardNotFound': 'Картку не знайдено',
    'api.noCardsForTest': 'У наборі немає карток для тесту',
    'api.answersRequired': 'Надішліть answers[]',
    'api.invalidWordCardId': 'Невірний word_card_id',
    'api.invalidStatus': 'status: know, almost або repeat',
  },
  en: {
    'brand.tag': 'learning platform',
    'lang.uk': 'UA',
    'lang.en': 'EN',
    'lang.switch': 'Interface language',

    'btn.login': 'Log in',
    'btn.register': 'Sign up',
    'btn.logout': 'Log out',
    'btn.profile': 'Profile',
    'btn.open': 'Open',
    'btn.create': 'Create',
    'btn.save': 'Save',
    'btn.backCabinet': '← Dashboard',
    'btn.backClass': '← Class',
    'btn.backAssignment': '← Assignment',
    'btn.backSets': '← Sets',
    'btn.join': 'Join',
    'btn.next': 'Next',
    'btn.back': 'Back',
    'btn.finish': 'Finish',
    'btn.check': 'Check',
    'btn.done': 'Done',
    'btn.cancel': 'Cancel',
    'btn.delete': 'Delete',

    'label.email': 'Email',
    'label.password': 'Password',
    'label.name': 'Name',
    'label.role': 'Role',
    'label.classCode': 'Class code',

    'role.student': 'Student',
    'role.teacher': 'Teacher',
    'role.admin': 'Administrator',

    'admin.dashboard.title': 'Admin dashboard',
    'admin.dashboard.hint': 'Manage users and system backups.',
    'admin.users': 'Users',
    'admin.noUsers': 'No users.',
    'admin.created': 'Created',
    'admin.deleteConfirm': 'Delete this user?',
    'admin.tools': 'System',
    'admin.backup': 'Download backup (app.db)',
    'admin.backupOk': 'Backup downloaded.',
    'admin.export': 'Export JSON (all tables)',
    'admin.exportOk': 'Export downloaded.',
    'admin.logs': 'Request log',
    'admin.logs.title': 'HTTP request log',
    'admin.logsEmpty': 'No entries yet.',
    'admin.restore': 'Restore database from .db file',
    'admin.restoreHint': 'Replaces the database file on the server. Use with care!',
    'admin.restoreConfirm': 'Replace the server database? Current data will be overwritten.',
    'admin.restoreOk': 'Database restored.',
    'admin.import': 'Import JSON dump',
    'admin.importHint': 'Replaces all table data from an export file.',
    'admin.importConfirm': 'Replace all system data from this file?',
    'admin.importOk': 'Data imported.',

    'error.login': 'Login failed',
    'error.register': 'Registration failed',
    'error.profile': 'Could not save profile',
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
    'register.roleTitle': 'Who are you?',
    'register.roleHint': 'Choose your role to continue registration.',

    'survey.title': 'A few more questions',
    'survey.hint': 'This helps us make the platform better.',
    'survey.langStudent': 'Which language do you plan to study?',
    'survey.langTeacher': 'Which language do you teach?',
    'survey.langPlaceholder': 'e.g., English',
    'survey.level': 'What is your level?',
    'survey.level.beginner': 'Beginner',
    'survey.level.intermediate': 'Intermediate',
    'survey.level.advanced': 'Advanced',
    'survey.experience': 'How many years have you taught?',
    'survey.exp.lt1': 'Less than a year',
    'survey.exp.1to3': '1–3 years',
    'survey.exp.3to5': '3–5 years',
    'survey.exp.gt5': 'Over 5 years',
    'survey.choose': 'Choose...',
    'survey.finish': 'Finish registration',
    'register.consent': 'I agree to the processing of my personal data',
    'privacy.open': 'Privacy policy',
    'privacy.title': 'Privacy policy',
    'privacy.body':
      'Learnly is a vocabulary learning platform.\n\n' +
      'Data we collect: name, email, role, survey answers at registration, learning progress, and test results.\n\n' +
      'Why: to provide access to classes, assignments, and your account.\n\n' +
      'Your rights: view your profile, download a copy of your data (export in profile), delete your account.\n\n' +
      'Passwords are stored as a hash. Do not share your password with others.',
    'error.consentRequired': 'You must agree to data processing',

    'profile.title': 'Edit profile',
    'profile.passwordLabel': 'New password',
    'profile.passwordPlaceholder': 'leave empty to keep current',
    'profile.timeFormat': 'Time format',
    'profile.timeFormat24': '24-hour (13:30)',
    'profile.timeFormat12': '12-hour (1:30 PM)',
    'profile.exportHint': 'Download a copy of all your data as JSON (GDPR).',
    'profile.exportBtn': 'Download my data',
    'error.export': 'Could not download your data',
    'profile.deleteHint': 'Deleting your account is permanent: all your data will be lost.',
    'profile.deleteBtn': 'Delete account',
    'profile.deleteConfirm': 'Are you sure? Your account and all related data will be deleted permanently.',

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
    'teacher.placeholder.example': 'Example: I have a «dog».',
    'teacher.placeholder.exampleHint': 'Wrap the word in «quotes» to highlight it on the card.',
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

    'stats.title': 'Statistics',
    'stats.myProgress': 'My progress',
    'stats.testsDone': 'Tests completed: {count}',
    'stats.avgScore': 'Average score: {score}%',
    'stats.wordsKnown': 'Words known: {count}',
    'stats.noData': 'No data for chart yet.',
    'stats.chart.assignments': 'Average score by assignment',
    'stats.chart.recentTests': 'Recent test results',
    'stats.chart.progress': 'Word progress',
    'stats.table.student': 'Student',
    'stats.table.assignment': 'Assignment',
    'stats.table.score': 'Score',
    'stats.table.status': 'Status',

    'student.activeAssignments': 'Active assignments',
    'student.noAssignments': 'No active assignments.',
    'student.joinBtn': 'Join class',
    'student.mySets': 'My sets',
    'student.mySetsTitle': 'My sets',
    'student.addSet': '+ Add set',
    'student.newSet': 'New set',
    'student.noSets': 'You have no sets yet.',
    'student.setDelete': 'Delete',
    'student.setDeleteConfirm': 'Delete this set with all its cards?',
    'student.joinTitle': 'Join a class',
    'student.assignment.status': 'Status: {status} · Cards: {count}',
    'student.assignment.flashcards': 'Flash cards',
    'student.assignment.study': 'Practice',
    'student.assignment.review': 'Review mistakes',
    'student.assignment.test': 'Take test',
    'student.flash.title': 'Flash cards',
    'student.flash.tapToFlip': 'Tap the card to see the translation',
    'student.flash.know': 'I know it',
    'student.flash.almost': 'Need to review',
    'student.flash.dontKnow': "I don't know",
    'student.flash.done': 'All cards learned!',
    'student.flash.progress': 'Learned {learned} / {total}',
    'student.flash.learnedLabel': 'Words learned',
    'student.study.reviewTitle': 'Review mistakes',
    'student.study.title': 'Practice',
    'student.study.noWords': 'No words to practice.',
    'student.study.back': 'Back to assignment',
    'student.study.doneAll': 'Set completed successfully!',
    'student.study.donePartial': 'Session complete.',
    'student.study.correctLabel': 'Correct',
    'student.study.reviewHint': 'You can go through the cards again.',
    'student.study.correct': 'Correct!',
    'student.study.incorrect': 'Incorrect',
    'student.study.yourAnswerLabel': 'Your answer',
    'student.study.correctAnswerLabel': 'Correct answer',
    'student.study.prompt': 'Type the word for this translation:',
    'student.study.answerPlaceholder': 'Your answer',
    'student.study.listen': 'Listen',
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

    'api.forbidden': 'Insufficient permissions',
    'api.invalidClassId': 'Invalid class id',
    'api.classNotFound': 'Class not found',
    'api.classCodeRequired': 'Enter a class code',
    'api.classCodeNotFound': 'No class with this code',
    'api.invalidWordSetId': 'Invalid word set id',
    'api.wordSetNotFound': 'Word set not found',
    'api.setNotFound': 'Set not found',
    'api.assignmentTitleLength': 'Assignment title must be 1–200 characters',
    'api.datesRequired': 'Provide start_date and deadline (YYYY-MM-DD)',
    'api.invalidMode': 'mode must be study or test',
    'api.invalidAssignmentId': 'Invalid assignment id',
    'api.assignmentNotFound': 'Assignment not found',
    'api.nameLength': 'Name must be 2–100 characters',
    'api.invalidEmail': 'Invalid email',
    'api.passwordMin': 'Password must be at least 6 characters',
    'api.invalidRole': 'Role must be teacher or student',
    'api.consentRequired': 'You must agree to data processing',
    'api.emailTaken': 'This email is already registered',
    'api.credentialsRequired': 'Email and password are required',
    'api.invalidCredentials': 'Invalid email or password',
    'api.wordTranslationRequired': 'Word and translation are required',
    'api.invalidCardId': 'Invalid card id',
    'api.cardNotFound': 'Card not found',
    'api.noCardsForTest': 'No cards in the set for a test',
    'api.answersRequired': 'Send answers[]',
    'api.invalidWordCardId': 'Invalid word_card_id',
    'api.invalidStatus': 'status must be know, almost, or repeat',
  },
};

/** Тексти помилок API (сервер завжди відповідає українською) → ключ у словнику */
const API_ERROR_KEYS = {
  'Потрібен токен': 'error.tokenRequired',
  'Недійсний токен': 'error.tokenInvalid',
  'Недостатньо прав доступу': 'api.forbidden',
  'Назва класу 1–200 символів': 'teacher.err.classTitle',
  'Невірний id класу': 'api.invalidClassId',
  'Клас не знайдено': 'api.classNotFound',
  'Введіть код класу': 'api.classCodeRequired',
  'Клас з таким кодом не знайдено': 'api.classCodeNotFound',
  'Невірний class_id': 'api.invalidClassId',
  'Невірний word_set_id': 'api.invalidWordSetId',
  'Назва завдання 1–200 символів': 'api.assignmentTitleLength',
  'Вкажіть start_date і deadline (YYYY-MM-DD)': 'api.datesRequired',
  'mode: study або test': 'api.invalidMode',
  'Набір слів не знайдено': 'api.wordSetNotFound',
  'Невірний id завдання': 'api.invalidAssignmentId',
  'Завдання не знайдено': 'api.assignmentNotFound',
  "Ім'я 2–100 символів": 'api.nameLength',
  'Невірний email': 'api.invalidEmail',
  'Пароль мінімум 6 символів': 'api.passwordMin',
  'Роль: teacher або student': 'api.invalidRole',
  'Потрібна згода на обробку даних': 'api.consentRequired',
  'Такий email вже є': 'api.emailTaken',
  'Вкажіть email і пароль': 'api.credentialsRequired',
  'Невірний email або пароль': 'api.invalidCredentials',
  'Назва набору 1–200 символів': 'teacher.err.setTitle',
  'Невірний id набору': 'api.invalidWordSetId',
  'Набір не знайдено': 'api.setNotFound',
  'Введіть слово і переклад': 'api.wordTranslationRequired',
  'Невірний id картки': 'api.invalidCardId',
  'Картку не знайдено': 'api.cardNotFound',
  'У наборі немає карток для тесту': 'api.noCardsForTest',
  'Надішліть answers[]': 'api.answersRequired',
  'Невірний word_card_id': 'api.invalidWordCardId',
  'status: know, almost або repeat': 'api.invalidStatus',
};

let locale = 'uk';
let timeFormat = '24';
const listeners = new Set();
const timeFormatListeners = new Set();

export function getLocale() {
  return locale;
}

export function getDateLocale() {
  return locale === 'en' ? 'en-GB' : 'uk-UA';
}

export function getTimeFormat() {
  return timeFormat;
}

/** Застосовує налаштування користувача (формат часу) після входу або збереження профілю */
export function syncUserPreferences(user) {
  const next = !user ? '24' : user.time_format === '12' ? '12' : '24';
  if (timeFormat === next) return;
  timeFormat = next;
  timeFormatListeners.forEach((fn) => fn(timeFormat));
}

export function onTimeFormatChange(fn) {
  timeFormatListeners.add(fn);
  return () => timeFormatListeners.delete(fn);
}

export function t(key, vars = {}) {
  const table = messages[locale] || messages.uk;
  let text = table[key] ?? messages.uk[key] ?? key;
  for (const [name, value] of Object.entries(vars)) {
    text = text.replaceAll(`{${name}}`, String(value));
  }
  return text;
}

/** Перекладає текст помилки з API відповідно до поточної мови UI */
export function translateApiError(message) {
  const msg = String(message ?? '');
  if (!msg) return t('error.generic');
  const key = API_ERROR_KEYS[msg];
  if (key) return t(key);
  return msg;
}

/** Чи це помилка авторизації (прострочений/відсутній токен) */
export function isAuthTokenError(message) {
  const msg = String(message ?? '');
  return (
    msg === 'Потрібен токен' ||
    msg === 'Недійсний токен' ||
    msg === t('error.tokenRequired') ||
    msg === t('error.tokenInvalid')
  );
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
