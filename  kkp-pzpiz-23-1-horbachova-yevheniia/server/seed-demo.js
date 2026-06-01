import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
      .run(teacherId, '100 поширених слів', 'English');
    const setId = set.lastInsertRowid;

    const words = loadDemoWords();
    const ins = database.prepare(
      'INSERT INTO word_cards (word_set_id, word, translation) VALUES (?, ?, ?)',
    );
    for (const w of words) {
      ins.run(setId, w.word, w.translation);
    }

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
        'Тиждень 1: базова лексика',
        start.toISOString().slice(0, 10),
        deadline.toISOString().slice(0, 10),
        'mixed',
        'active',
      );
  });

  tx();
}

function loadDemoWords() {
  const seedPath = path.join(__dirname, 'seeds', '05-common-100.json');
  try {
    const raw = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
    const words = raw.sets?.[0]?.words || [];
    return words.slice(0, 15).map((w) => ({
      word: w.term,
      translation: w.translation,
    }));
  } catch {
    return [
      { word: 'hello', translation: 'привіт' },
      { word: 'book', translation: 'книга' },
      { word: 'water', translation: 'вода' },
      { word: 'time', translation: 'час' },
      { word: 'world', translation: 'світ' },
    ];
  }
}
