import bcrypt from 'bcrypt';

const img = (seed) => `https://picsum.photos/seed/${seed}/400/280`;

// набори викладача для демо
const TEACHER_DEMO_SETS = [
  {
    title: 'Flash cards: базова лексика',
    language: 'English',
    cards: [
      { word: 'apple', translation: 'яблуко', image_url: img('apple'), example: 'I eat an «apple» every day.' },
      { word: 'dog', translation: 'собака', image_url: img('dog'), example: 'My «dog» runs in the park.' },
      { word: 'book', translation: 'книга', image_url: img('book'), example: 'She reads a «book» before sleep.' },
      { word: 'water', translation: 'вода', image_url: img('water'), example: 'Please drink more «water».' },
      { word: 'house', translation: 'будинок', image_url: img('house'), example: 'They live in a big «house».' },
      { word: 'sun', translation: 'сонце', image_url: img('sun'), example: 'The «sun» is bright today.' },
      { word: 'friend', translation: 'друг', image_url: img('friend'), example: 'He is my best «friend».' },
      { word: 'music', translation: 'музика', image_url: img('music'), example: 'I listen to «music» every morning.' },
      { word: 'cat', translation: 'кіт', image_url: img('cat'), example: 'The «cat» sleeps on the sofa.' },
      { word: 'tree', translation: 'дерево', image_url: img('tree'), example: 'Birds sit in the «tree».' },
      { word: 'happy', translation: 'щасливий', image_url: img('happy'), example: 'She feels «happy» today.' },
      { word: 'school', translation: 'школа', image_url: img('school'), example: 'Children go to «school» at eight.' },
    ],
  },
  {
    title: 'Їжа та напої',
    language: 'English',
    cards: [
      { word: 'bread', translation: 'хліб', image_url: img('bread'), example: 'Fresh «bread» smells wonderful.' },
      { word: 'milk', translation: 'молоко', image_url: img('milk'), example: 'I drink «milk» with breakfast.' },
      { word: 'coffee', translation: 'кава', image_url: img('coffee'), example: 'She makes «coffee» every morning.' },
      { word: 'tea', translation: 'чай', image_url: img('tea'), example: 'Would you like some «tea»?' },
      { word: 'cheese', translation: 'сир', image_url: img('cheese'), example: 'Add «cheese» to the sandwich.' },
      { word: 'chicken', translation: 'курка', image_url: img('chicken'), example: 'We cook «chicken» for dinner.' },
      { word: 'rice', translation: 'рис', image_url: img('rice'), example: '«Rice» is popular in Asia.' },
      { word: 'orange', translation: 'апельсин', image_url: img('orange'), example: 'Peel the «orange» carefully.' },
      { word: 'breakfast', translation: 'сніданок', image_url: img('breakfast'), example: '«Breakfast» is at seven o\'clock.' },
      { word: 'dinner', translation: 'вечеря', image_url: img('dinner'), example: 'Family «dinner» is at six.' },
    ],
  },
  {
    title: 'Подорожі',
    language: 'English',
    cards: [
      { word: 'airport', translation: 'аеропорт', image_url: img('airport'), example: 'We arrive at the «airport» early.' },
      { word: 'passport', translation: 'паспорт', image_url: img('passport'), example: 'Show your «passport» at the desk.' },
      { word: 'ticket', translation: 'квиток', image_url: img('ticket'), example: 'Buy a «ticket» online.' },
      { word: 'hotel', translation: 'готель', image_url: img('hotel'), example: 'The «hotel» has a nice view.' },
      { word: 'map', translation: 'карта', image_url: img('map'), example: 'Use a «map» in a new city.' },
      { word: 'train', translation: 'поїзд', image_url: img('train'), example: 'The «train» leaves at noon.' },
      { word: 'bus', translation: 'автобус', image_url: img('bus'), example: 'Take the «bus» to the centre.' },
      { word: 'luggage', translation: 'багаж', image_url: img('luggage'), example: 'Do not lose your «luggage».' },
      { word: 'beach', translation: 'пляж', image_url: img('beach'), example: 'We walk along the «beach».' },
      { word: 'city', translation: 'місто', image_url: img('city'), example: 'Kyiv is a beautiful «city».' },
    ],
  },
  {
    title: 'Школа та навчання',
    language: 'English',
    cards: [
      { word: 'classroom', translation: 'класна кімната', image_url: img('classroom'), example: 'Students sit in the «classroom».' },
      { word: 'homework', translation: 'домашнє завдання', image_url: img('homework'), example: 'Finish your «homework» tonight.' },
      { word: 'exam', translation: 'іспит', image_url: img('exam'), example: 'The «exam» is next Monday.' },
      { word: 'pencil', translation: 'олівець', image_url: img('pencil'), example: 'Sharpen your «pencil».' },
      { word: 'notebook', translation: 'зошит', image_url: img('notebook'), example: 'Write notes in your «notebook».' },
      { word: 'lesson', translation: 'урок', image_url: img('lesson'), example: 'Today\'s «lesson» is about verbs.' },
      { word: 'teacher', translation: 'вчитель', image_url: img('teacher'), example: 'Our «teacher» explains clearly.' },
      { word: 'university', translation: 'університет', image_url: img('university'), example: 'She studies at the «university».' },
      { word: 'dictionary', translation: 'словник', image_url: img('dictionary'), example: 'Look up words in a «dictionary».' },
      { word: 'grammar', translation: 'граматика', image_url: img('grammar'), example: '«Grammar» takes practice.' },
    ],
  },
  {
    title: 'Тварини',
    language: 'English',
    cards: [
      { word: 'bird', translation: 'птах', image_url: img('bird'), example: 'A «bird» sings in the tree.' },
      { word: 'fish', translation: 'риба', image_url: img('fish'), example: 'We see a «fish» in the lake.' },
      { word: 'horse', translation: 'кінь', image_url: img('horse'), example: 'The «horse» runs fast.' },
      { word: 'rabbit', translation: 'кролик', image_url: img('rabbit'), example: 'The «rabbit» eats carrots.' },
      { word: 'elephant', translation: 'слон', image_url: img('elephant'), example: 'An «elephant» is very large.' },
      { word: 'lion', translation: 'лев', image_url: img('lion'), example: 'The «lion» roars loudly.' },
      { word: 'bear', translation: 'ведмідь', image_url: img('bear'), example: 'A «bear» lives in the forest.' },
      { word: 'butterfly', translation: 'метелик', image_url: img('butterfly'), example: 'A «butterfly» has colourful wings.' },
    ],
  },
];

// власні набори учня
const STUDENT_DEMO_SETS = [
  {
    title: 'Flash cards: базова лексика',
    language: 'English',
    cards: TEACHER_DEMO_SETS[0].cards,
  },
  {
    title: 'IT-лексика',
    language: 'English',
    cards: [
      { word: 'computer', translation: 'комп\'ютер', image_url: img('computer'), example: 'Turn on the «computer».' },
      { word: 'keyboard', translation: 'клавіатура', image_url: img('keyboard'), example: 'Type on the «keyboard».' },
      { word: 'screen', translation: 'екран', image_url: img('screen'), example: 'Clean the «screen» gently.' },
      { word: 'internet', translation: 'інтернет', image_url: img('internet'), example: 'Connect to the «internet».' },
      { word: 'software', translation: 'програмне забезпечення', image_url: img('software'), example: 'Install new «software».' },
      { word: 'email', translation: 'електронна пошта', image_url: img('email'), example: 'Check your «email» daily.' },
      { word: 'password', translation: 'пароль', image_url: img('password'), example: 'Choose a strong «password».' },
      { word: 'website', translation: 'вебсайт', image_url: img('website'), example: 'Open the «website» in a browser.' },
      { word: 'download', translation: 'завантажити', image_url: img('download'), example: '«Download» the file here.' },
      { word: 'server', translation: 'сервер', image_url: img('server'), example: 'The «server» stores our data.' },
    ],
  },
  {
    title: 'Спорт і здоров\'я',
    language: 'English',
    cards: [
      { word: 'run', translation: 'бігати', image_url: img('run'), example: 'I «run» every morning.' },
      { word: 'swim', translation: 'плавати', image_url: img('swim'), example: 'They «swim» in the pool.' },
      { word: 'ball', translation: 'м\'яч', image_url: img('ball'), example: 'Kick the «ball» to your friend.' },
      { word: 'team', translation: 'команда', image_url: img('team'), example: 'Our «team» won the match.' },
      { word: 'health', translation: 'здоров\'я', image_url: img('health'), example: 'Sleep improves your «health».' },
      { word: 'doctor', translation: 'лікар', image_url: img('doctor'), example: 'See a «doctor» if you feel ill.' },
      { word: 'medicine', translation: 'ліки', image_url: img('medicine'), example: 'Take the «medicine» after food.' },
      { word: 'exercise', translation: 'вправи', image_url: img('exercise'), example: 'Daily «exercise» keeps you fit.' },
    ],
  },
];

// завдання для демо-класу (прив'язка до title набору)
const DEMO_CLASS_ASSIGNMENTS = [
  { setTitle: 'Flash cards: базова лексика', title: 'Тиждень 1: flash cards', mode: 'study', status: 'active', startOffset: 0, deadlineOffset: 14 },
  { setTitle: 'Flash cards: базова лексика', title: 'Тиждень 2: повторення', mode: 'test', status: 'active', startOffset: 0, deadlineOffset: 14 },
  { setTitle: 'Їжа та напої', title: 'Тест: їжа та напої', mode: 'test', status: 'active', startOffset: -3, deadlineOffset: 21 },
  { setTitle: 'Подорожі', title: 'Подорожі: навчання', mode: 'study', status: 'active', startOffset: -7, deadlineOffset: 28 },
  { setTitle: 'Школа та навчання', title: 'Тест: школа', mode: 'test', status: 'active', startOffset: -5, deadlineOffset: 18 },
  { setTitle: 'Тварини', title: 'Тварини: картки', mode: 'study', status: 'active', startOffset: -2, deadlineOffset: 30 },
  { setTitle: 'Подорожі', title: 'Тест: подорожі', mode: 'test', status: 'closed', startOffset: -30, deadlineOffset: -7 },
];

// результати тестів: [student1 score%, student2 score%] — correct/wrong рахуються автоматично
const DEMO_TEST_SCORES = {
  'Тиждень 2: повторення': [88, 75],
  'Тест: їжа та напої': [90, 70],
  'Тест: школа': [95, 80],
  'Тест: подорожі': [82, 60],
};

const MARKER_SET_TITLE = 'Їжа та напої';

function insertTeacherWordSet(database, teacherId, setDef) {
  const row = database
    .prepare('INSERT INTO word_sets (teacher_id, title, language) VALUES (?, ?, ?)')
    .run(teacherId, setDef.title, setDef.language);
  const setId = row.lastInsertRowid;
  const ins = database.prepare(
    `INSERT INTO word_cards (word_set_id, word, translation, image_url, example)
     VALUES (?, ?, ?, ?, ?)`,
  );
  for (const c of setDef.cards) {
    ins.run(setId, c.word, c.translation, c.image_url, c.example);
  }
  return setId;
}

function insertStudentWordSet(database, studentId, setDef) {
  const row = database
    .prepare('INSERT INTO student_word_sets (student_id, title, language) VALUES (?, ?, ?)')
    .run(studentId, setDef.title, setDef.language);
  const setId = row.lastInsertRowid;
  const ins = database.prepare(
    `INSERT INTO student_word_cards (student_set_id, word, translation, image_url, example)
     VALUES (?, ?, ?, ?, ?)`,
  );
  for (const c of setDef.cards) {
    ins.run(setId, c.word, c.translation, c.image_url, c.example);
  }
  return setId;
}

function getSetIdByTitle(database, teacherId, title) {
  return database
    .prepare('SELECT id FROM word_sets WHERE teacher_id = ? AND title = ?')
    .get(teacherId, title)?.id;
}

function ensureAssignment(database, classId, setId, cfg) {
  const existing = database
    .prepare('SELECT id FROM assignments WHERE class_id = ? AND title = ?')
    .get(classId, cfg.title);
  if (existing) return existing.id;

  const start = new Date();
  start.setDate(start.getDate() + cfg.startOffset);
  const deadline = new Date();
  deadline.setDate(deadline.getDate() + cfg.deadlineOffset);

  const row = database
    .prepare(
      `INSERT INTO assignments (class_id, word_set_id, title, start_date, deadline, mode, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      classId,
      setId,
      cfg.title,
      start.toISOString().slice(0, 10),
      deadline.toISOString().slice(0, 10),
      cfg.mode,
      cfg.status,
    );
  return row.lastInsertRowid;
}

function scoreToCounts(scorePercent, total) {
  const correct = Math.round((scorePercent / 100) * total);
  const wrong = total - correct;
  return { score: scorePercent, total, correct, wrong };
}

// мок-дані для статистики: результати тестів і прогрес слів
function insertStatsDemo(database, student1Id, student2Id, classId) {
  const insTest = database.prepare(
    `INSERT INTO test_results (assignment_id, student_id, score, total_words, correct_answers, wrong_answers)
     VALUES (?, ?, ?, ?, ?, ?)`,
  );

  const insProgress = database.prepare(
    `INSERT OR IGNORE INTO word_progress (student_id, word_card_id, assignment_id, status, correct_count, wrong_count, last_reviewed_at)
     VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
  );

  function addTest(assignmentId, studentId, scorePercent, total) {
    const exists = database
      .prepare('SELECT id FROM test_results WHERE assignment_id = ? AND student_id = ?')
      .get(assignmentId, studentId);
    if (exists) return;
    const { score, correct, wrong } = scoreToCounts(scorePercent, total);
    insTest.run(assignmentId, studentId, score, total, correct, wrong);
  }

  for (const [title, scores] of Object.entries(DEMO_TEST_SCORES)) {
    const assignment = database
      .prepare('SELECT id, word_set_id FROM assignments WHERE class_id = ? AND title = ?')
      .get(classId, title);
    if (!assignment) continue;

    const total = database
      .prepare('SELECT COUNT(*) AS n FROM word_cards WHERE word_set_id = ?')
      .get(assignment.word_set_id).n;
    if (total < 1) continue;

    addTest(assignment.id, student1Id, scores[0], total);
    addTest(assignment.id, student2Id, scores[1], total);
  }

  const assignment1 = database
    .prepare("SELECT id, word_set_id FROM assignments WHERE class_id = ? AND title = 'Тиждень 1: flash cards'")
    .get(classId);
  if (!assignment1) return;

  const cards = database
    .prepare('SELECT id FROM word_cards WHERE word_set_id = ? ORDER BY id')
    .all(assignment1.word_set_id);
  if (cards.length === 0) return;

  const s1Progress = [
    ['know', 3, 0],
    ['know', 2, 0],
    ['almost', 1, 1],
    ['know', 4, 0],
    ['repeat', 0, 2],
    ['know', 2, 0],
    ['almost', 1, 0],
    ['know', 1, 0],
    ['almost', 2, 1],
    ['know', 3, 0],
  ];
  for (let i = 0; i < s1Progress.length && i < cards.length; i++) {
    insProgress.run(student1Id, cards[i].id, assignment1.id, ...s1Progress[i]);
  }

  const s2Progress = [
    ['know', 2, 0],
    ['almost', 1, 1],
    ['repeat', 0, 3],
    ['know', 1, 0],
    ['repeat', 1, 1],
    ['almost', 1, 2],
    ['repeat', 0, 2],
    ['know', 2, 0],
  ];
  for (let i = 0; i < s2Progress.length && i < cards.length; i++) {
    insProgress.run(student2Id, cards[i].id, assignment1.id, ...s2Progress[i]);
  }

  const foodAssignment = database
    .prepare("SELECT id, word_set_id FROM assignments WHERE class_id = ? AND title = 'Подорожі: навчання'")
    .get(classId);
  if (foodAssignment) {
    const travelCards = database
      .prepare('SELECT id FROM word_cards WHERE word_set_id = ? ORDER BY id LIMIT 6')
      .all(foodAssignment.word_set_id);
    for (let i = 0; i < travelCards.length; i++) {
      const status = i % 3 === 0 ? 'know' : i % 3 === 1 ? 'almost' : 'repeat';
      insProgress.run(student1Id, travelCards[i].id, foodAssignment.id, status, status === 'know' ? 2 : 1, status === 'repeat' ? 2 : 0);
    }
  }
}

function seedDemoClassContent(database, teacherId, classId, student1Id, student2Id) {
  const setIds = {};
  for (const setDef of TEACHER_DEMO_SETS) {
    setIds[setDef.title] = insertTeacherWordSet(database, teacherId, setDef);
  }

  for (const cfg of DEMO_CLASS_ASSIGNMENTS) {
    const setId = setIds[cfg.setTitle];
    if (setId) ensureAssignment(database, classId, setId, cfg);
  }

  insertStatsDemo(database, student1Id, student2Id, classId);
}

// якщо в демо-класі ще немає розширених наборів — додаємо
export function seedExtendedDemoIfMissing(database) {
  const cls = database.prepare("SELECT id, teacher_id FROM classes WHERE class_code = 'DEMO01'").get();
  if (!cls) return;

  if (getSetIdByTitle(database, cls.teacher_id, MARKER_SET_TITLE)) return;

  const student1 = database
    .prepare("SELECT id FROM users WHERE email = 'student1@learnly.local'")
    .get();
  const student2 = database
    .prepare("SELECT id FROM users WHERE email = 'student2@learnly.local'")
    .get();
  if (!student1 || !student2) return;

  const tx = database.transaction(() => {
    const setIds = {};
    const basicTitle = TEACHER_DEMO_SETS[0].title;
    const basicId = getSetIdByTitle(database, cls.teacher_id, basicTitle);
    if (basicId) {
      setIds[basicTitle] = basicId;
      database.prepare('DELETE FROM word_cards WHERE word_set_id = ?').run(basicId);
      const ins = database.prepare(
        `INSERT INTO word_cards (word_set_id, word, translation, image_url, example)
         VALUES (?, ?, ?, ?, ?)`,
      );
      for (const c of TEACHER_DEMO_SETS[0].cards) {
        ins.run(basicId, c.word, c.translation, c.image_url, c.example);
      }
    }

    for (const setDef of TEACHER_DEMO_SETS.slice(1)) {
      setIds[setDef.title] = insertTeacherWordSet(database, cls.teacher_id, setDef);
    }

    for (const cfg of DEMO_CLASS_ASSIGNMENTS) {
      const setId = setIds[cfg.setTitle];
      if (setId) ensureAssignment(database, cls.id, setId, cfg);
    }

    insertStatsDemo(database, student1.id, student2.id, cls.id);
  });
  tx();
}

// якщо в демо-класі ще немає результатів тижня 2 — додаємо мок-статистику
export function seedStatsDemoIfMissing(database) {
  const cls = database.prepare("SELECT id FROM classes WHERE class_code = 'DEMO01'").get();
  if (!cls) return;

  const hasWeek2 = database
    .prepare(
      'SELECT tr.id FROM test_results tr INNER JOIN assignments a ON a.id = tr.assignment_id WHERE a.class_id = ? LIMIT 1',
    )
    .get(cls.id);
  if (hasWeek2) return;

  const student1 = database
    .prepare("SELECT id FROM users WHERE email = 'student1@learnly.local'")
    .get();
  const student2 = database
    .prepare("SELECT id FROM users WHERE email = 'student2@learnly.local'")
    .get();
  if (!student1 || !student2) return;

  const teacher = database.prepare("SELECT teacher_id FROM classes WHERE id = ?").get(cls.id);
  if (!teacher) return;

  const tx = database.transaction(() => {
    for (const cfg of DEMO_CLASS_ASSIGNMENTS) {
      const setId = getSetIdByTitle(database, teacher.teacher_id, cfg.setTitle);
      if (setId) ensureAssignment(database, cls.id, setId, cfg);
    }
    insertStatsDemo(database, student1.id, student2.id, cls.id);
  });
  tx();
}

// якщо база вже є — додаємо демо-набори учню, якщо їх ще немає
export function seedStudentFlashDemoIfMissing(database) {
  const student = database
    .prepare("SELECT id FROM users WHERE email = 'student1@learnly.local'")
    .get();
  if (!student) return;

  for (const setDef of STUDENT_DEMO_SETS) {
    const exists = database
      .prepare('SELECT id FROM student_word_sets WHERE student_id = ? AND title = ?')
      .get(student.id, setDef.title);
    if (exists) continue;
    insertStudentWordSet(database, student.id, setDef);
  }
}

// оновлюємо набір вчителя, якщо там ще немає прикладів (для старих баз)
export function seedTeacherFlashDemoIfMissing(database) {
  const teacher = database
    .prepare("SELECT id FROM users WHERE email = 'teacher@learnly.local'")
    .get();
  if (!teacher) return;

  const set = database
    .prepare('SELECT id FROM word_sets WHERE teacher_id = ? ORDER BY id LIMIT 1')
    .get(teacher.id);
  if (!set) return;

  const withExample = database
    .prepare('SELECT id FROM word_cards WHERE word_set_id = ? AND example IS NOT NULL LIMIT 1')
    .get(set.id);
  if (withExample) return;

  database.prepare('DELETE FROM word_cards WHERE word_set_id = ?').run(set.id);
  database
    .prepare('UPDATE word_sets SET title = ?, language = ? WHERE id = ?')
    .run(TEACHER_DEMO_SETS[0].title, TEACHER_DEMO_SETS[0].language, set.id);

  const ins = database.prepare(
    `INSERT INTO word_cards (word_set_id, word, translation, image_url, example)
     VALUES (?, ?, ?, ?, ?)`,
  );
  for (const c of TEACHER_DEMO_SETS[0].cards) {
    ins.run(set.id, c.word, c.translation, c.image_url, c.example);
  }
}

export function seedDemoIfEmpty(database) {
  const n = database.prepare('SELECT COUNT(*) AS n FROM users').get().n;
  if (n > 0) return;

  const hash = (pw) => bcrypt.hashSync(pw, 10);

  const tx = database.transaction(() => {
    const teacher = database
      .prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)')
      .run('Олена Викладач', 'teacher@learnly.local', hash('teacher123'), 'teacher');
    const teacherId = teacher.lastInsertRowid;

    const s1 = database
      .prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)')
      .run('Іван Учень', 'student1@learnly.local', hash('student123'), 'student');
    const s2 = database
      .prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)')
      .run('Марія Учень', 'student2@learnly.local', hash('student123'), 'student');

    const cls = database
      .prepare(
        `INSERT INTO classes (teacher_id, title, subject, description, class_code)
         VALUES (?, ?, ?, ?, ?)`,
      )
      .run(
        teacherId,
        '10-A English',
        'English',
        'Демо-клас для вивчення англійської лексики',
        'DEMO01',
      );
    const classId = cls.lastInsertRowid;

    database
      .prepare('INSERT INTO class_members (class_id, student_id) VALUES (?, ?)')
      .run(classId, s1.lastInsertRowid);
    database
      .prepare('INSERT INTO class_members (class_id, student_id) VALUES (?, ?)')
      .run(classId, s2.lastInsertRowid);

    for (const setDef of STUDENT_DEMO_SETS) {
      insertStudentWordSet(database, s1.lastInsertRowid, setDef);
    }

    seedDemoClassContent(database, teacherId, classId, s1.lastInsertRowid, s2.lastInsertRowid);
  });

  tx();
}
