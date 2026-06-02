import bcrypt from 'bcrypt';

// демо-картки для flash-card
const FLASH_DEMO_CARDS = [
  {
    word: 'apple',
    translation: 'яблуко',
    image_url: 'https://picsum.photos/seed/apple/400/280',
    example: 'I eat an «apple» every day.',
  },
  {
    word: 'dog',
    translation: 'собака',
    image_url: 'https://picsum.photos/seed/dog/400/280',
    example: 'My «dog» runs in the park.',
  },
  {
    word: 'book',
    translation: 'книга',
    image_url: 'https://picsum.photos/seed/book/400/280',
    example: 'She reads a «book» before sleep.',
  },
  {
    word: 'water',
    translation: 'вода',
    image_url: 'https://picsum.photos/seed/water/400/280',
    example: 'Please drink more «water».',
  },
  {
    word: 'house',
    translation: 'будинок',
    image_url: 'https://picsum.photos/seed/house/400/280',
    example: 'They live in a big «house».',
  },
  {
    word: 'sun',
    translation: 'сонце',
    image_url: 'https://picsum.photos/seed/sun/400/280',
    example: 'The «sun» is bright today.',
  },
  {
    word: 'friend',
    translation: 'друг',
    image_url: 'https://picsum.photos/seed/friend/400/280',
    example: 'He is my best «friend».',
  },
  {
    word: 'music',
    translation: 'музика',
    image_url: 'https://picsum.photos/seed/music/400/280',
    example: 'I listen to «music» every morning.',
  },
];

const STUDENT_FLASH_SET_TITLE = 'Flash cards: базова лексика';

function insertStudentFlashSet(database, studentId) {
  const set = database
    .prepare('INSERT INTO student_word_sets (student_id, title, language) VALUES (?, ?, ?)')
    .run(studentId, STUDENT_FLASH_SET_TITLE, 'English');
  const setId = set.lastInsertRowid;

  const ins = database.prepare(
    `INSERT INTO student_word_cards (student_set_id, word, translation, image_url, example)
     VALUES (?, ?, ?, ?, ?)`,
  );
  for (const c of FLASH_DEMO_CARDS) {
    ins.run(setId, c.word, c.translation, c.image_url, c.example);
  }
}

// мок-дані для статистики: результати тестів і прогрес слів
function insertStatsDemo(database, student1Id, student2Id, classId, setId) {
  const cards = database
    .prepare('SELECT id FROM word_cards WHERE word_set_id = ? ORDER BY id')
    .all(setId);
  if (cards.length === 0) return;

  const start = new Date();
  const deadline = new Date(start);
  deadline.setDate(deadline.getDate() + 14);

  // друге завдання для графіка (2 стовпчики замість одного)
  let assignment2 = database
    .prepare('SELECT id FROM assignments WHERE class_id = ? AND title = ?')
    .get(classId, 'Тиждень 2: повторення');

  if (!assignment2) {
    const row = database
      .prepare(
        `INSERT INTO assignments (class_id, word_set_id, title, start_date, deadline, mode, status)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        classId,
        setId,
        'Тиждень 2: повторення',
        start.toISOString().slice(0, 10),
        deadline.toISOString().slice(0, 10),
        'test',
        'active',
      );
    assignment2 = { id: row.lastInsertRowid };
  }

  const assignment1 = database
    .prepare('SELECT id FROM assignments WHERE class_id = ? ORDER BY id LIMIT 1')
    .get(classId);
  if (!assignment1) return;

  const insTest = database.prepare(
    `INSERT INTO test_results (assignment_id, student_id, score, total_words, correct_answers, wrong_answers)
     VALUES (?, ?, ?, ?, ?, ?)`,
  );

  const insProgress = database.prepare(
    `INSERT OR IGNORE INTO word_progress (student_id, word_card_id, assignment_id, status, correct_count, wrong_count, last_reviewed_at)
     VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
  );

  function addTest(assignmentId, studentId, score, total, correct, wrong) {
    const exists = database
      .prepare('SELECT id FROM test_results WHERE assignment_id = ? AND student_id = ?')
      .get(assignmentId, studentId);
    if (!exists) {
      insTest.run(assignmentId, studentId, score, total, correct, wrong);
    }
  }

  // результати тестів
  addTest(assignment1.id, student1Id, 88, 8, 7, 1);
  addTest(assignment1.id, student2Id, 75, 8, 6, 2);
  addTest(assignment2.id, student1Id, 92, 8, 7, 1);
  addTest(assignment2.id, student2Id, 65, 8, 5, 3);

  // прогрес слів для student1 (більше «знаю»)
  const s1Progress = [
    ['know', 3, 0],
    ['know', 2, 0],
    ['almost', 1, 1],
    ['know', 4, 0],
    ['repeat', 0, 2],
    ['know', 2, 0],
    ['almost', 1, 0],
  ];
  for (let i = 0; i < s1Progress.length && i < cards.length; i++) {
    insProgress.run(student1Id, cards[i].id, assignment1.id, ...s1Progress[i]);
  }

  // прогрес слів для student2 (менше «знаю»)
  const s2Fixed = [
    ['know', 2, 0],
    ['almost', 1, 1],
    ['repeat', 0, 3],
    ['know', 1, 0],
    ['repeat', 1, 1],
  ];
  for (let i = 0; i < s2Fixed.length && i < cards.length; i++) {
    insProgress.run(student2Id, cards[i].id, assignment1.id, ...s2Fixed[i]);
  }
}

// якщо в демо-класі ще немає результатів — додаємо мок-статистику
export function seedStatsDemoIfMissing(database) {
  const cls = database.prepare("SELECT id FROM classes WHERE class_code = 'DEMO01'").get();
  if (!cls) return;

  const hasStats = database
    .prepare(
      `SELECT id FROM assignments WHERE class_id = ? AND title = ?`,
    )
    .get(cls.id, 'Тиждень 2: повторення');
  if (hasStats) return;

  const student1 = database
    .prepare("SELECT id FROM users WHERE email = 'student1@learnly.local'")
    .get();
  const student2 = database
    .prepare("SELECT id FROM users WHERE email = 'student2@learnly.local'")
    .get();
  const set = database
    .prepare(
      `SELECT ws.id FROM word_sets ws
       INNER JOIN classes c ON c.teacher_id = ws.teacher_id
       WHERE c.id = ? ORDER BY ws.id LIMIT 1`,
    )
    .get(cls.id);

  if (!student1 || !student2 || !set) return;

  insertStatsDemo(database, student1.id, student2.id, cls.id, set.id);
}

// якщо база вже є — додаємо демо-набір учню, якщо його ще немає
export function seedStudentFlashDemoIfMissing(database) {
  const student = database
    .prepare("SELECT id FROM users WHERE email = 'student1@learnly.local'")
    .get();
  if (!student) return;

  const exists = database
    .prepare('SELECT id FROM student_word_sets WHERE student_id = ? AND title = ?')
    .get(student.id, STUDENT_FLASH_SET_TITLE);
  if (exists) return;

  insertStudentFlashSet(database, student.id);
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
    .run('Flash cards: базова лексика', 'English', set.id);

  const ins = database.prepare(
    `INSERT INTO word_cards (word_set_id, word, translation, image_url, example)
     VALUES (?, ?, ?, ?, ?)`,
  );
  for (const c of FLASH_DEMO_CARDS) {
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

    const set = database
      .prepare('INSERT INTO word_sets (teacher_id, title, language) VALUES (?, ?, ?)')
      .run(teacherId, 'Flash cards: базова лексика', 'English');
    const setId = set.lastInsertRowid;

    const ins = database.prepare(
      `INSERT INTO word_cards (word_set_id, word, translation, image_url, example)
       VALUES (?, ?, ?, ?, ?)`,
    );
    for (const c of FLASH_DEMO_CARDS) {
      ins.run(setId, c.word, c.translation, c.image_url, c.example);
    }

    insertStudentFlashSet(database, s1.lastInsertRowid);

    const start = new Date();
    const deadline = new Date(start);
    deadline.setDate(deadline.getDate() + 14);

    database
      .prepare(
        `INSERT INTO assignments (class_id, word_set_id, title, start_date, deadline, mode, status)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        classId,
        setId,
        'Тиждень 1: flash cards',
        start.toISOString().slice(0, 10),
        deadline.toISOString().slice(0, 10),
        'study',
        'active',
      );

    insertStatsDemo(database, s1.lastInsertRowid, s2.lastInsertRowid, classId, setId);
  });

  tx();
}
