//демо-акаунти (вчитель і двоє учнів), якщо їх ще немає.
import bcrypt from 'bcrypt';
import { initDb, getDb } from './db.js';

initDb();
const db = getDb();

const accounts = [
  {
    name: 'Олена Викладач',
    email: 'teacher@learnly.local',
    password: 'teacher123',
    role: 'teacher',
  },
  {
    name: 'Іван Учень',
    email: 'student1@learnly.local',
    password: 'student123',
    role: 'student',
  },
  {
    name: 'Марія Учень',
    email: 'student2@learnly.local',
    password: 'student123',
    role: 'student',
  },
];

for (const a of accounts) {
  const row = db.prepare('SELECT id FROM users WHERE email = ?').get(a.email);
  if (row) {
    console.log('skip (вже є):', a.email);
    continue;
  }
  const password_hash = bcrypt.hashSync(a.password, 10);
  db.prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)').run(
    a.name,
    a.email,
    password_hash,
    a.role,
  );
  console.log('створено:', a.email, '(' + a.role + ')');
}

console.log('готово');
