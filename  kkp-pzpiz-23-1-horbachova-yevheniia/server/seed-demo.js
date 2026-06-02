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
        'mixed',
        'active',
      );
  });

  tx();
}
