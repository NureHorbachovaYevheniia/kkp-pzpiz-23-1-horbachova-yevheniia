// Тут налаштовуємо базу даних SQLite і створюємо всі таблиці.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import { seedDemoIfEmpty, seedStudentFlashDemoIfMissing, seedTeacherFlashDemoIfMissing, seedStatsDemoIfMissing } from './seed-demo.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, 'data');
const dbPath = path.join(dataDir, 'app.db');

let db;

// створюємо базу і всі таблиці
export function initDb() {
  fs.mkdirSync(dataDir, { recursive: true });
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('teacher', 'student', 'admin')),
      token TEXT,
      survey_language TEXT,
      survey_level TEXT,
      time_format TEXT NOT NULL DEFAULT '24' CHECK(time_format IN ('24', '12')),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS classes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      teacher_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      subject TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      class_code TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS class_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      class_id INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
      student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      joined_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(class_id, student_id)
    );

    CREATE TABLE IF NOT EXISTS word_sets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      teacher_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      language TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS word_cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      word_set_id INTEGER NOT NULL REFERENCES word_sets(id) ON DELETE CASCADE,
      word TEXT NOT NULL,
      translation TEXT NOT NULL,
      image_url TEXT,
      example TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS assignments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      class_id INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
      word_set_id INTEGER NOT NULL REFERENCES word_sets(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      start_date TEXT NOT NULL,
      deadline TEXT NOT NULL,
      mode TEXT NOT NULL CHECK(mode IN ('study', 'test', 'mixed')),
      status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('draft', 'active', 'closed')),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS test_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      assignment_id INTEGER NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
      student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      score REAL NOT NULL,
      total_words INTEGER NOT NULL,
      correct_answers INTEGER NOT NULL,
      wrong_answers INTEGER NOT NULL,
      completed_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS word_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      word_card_id INTEGER NOT NULL REFERENCES word_cards(id) ON DELETE CASCADE,
      assignment_id INTEGER NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
      status TEXT NOT NULL DEFAULT 'not_started'
        CHECK(status IN ('not_started', 'know', 'almost', 'repeat')),
      correct_count INTEGER NOT NULL DEFAULT 0,
      wrong_count INTEGER NOT NULL DEFAULT 0,
      last_reviewed_at TEXT,
      UNIQUE(student_id, word_card_id, assignment_id)
    );

    -- власні набори учня
    CREATE TABLE IF NOT EXISTS student_word_sets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      language TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS student_word_cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_set_id INTEGER NOT NULL REFERENCES student_word_sets(id) ON DELETE CASCADE,
      word TEXT NOT NULL,
      translation TEXT NOT NULL,
      image_url TEXT,
      example TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS student_word_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      student_card_id INTEGER NOT NULL REFERENCES student_word_cards(id) ON DELETE CASCADE,
      status TEXT NOT NULL DEFAULT 'not_started'
        CHECK(status IN ('not_started', 'know', 'almost', 'repeat')),
      correct_count INTEGER NOT NULL DEFAULT 0,
      wrong_count INTEGER NOT NULL DEFAULT 0,
      last_reviewed_at TEXT,
      UNIQUE(student_id, student_card_id)
    );

    CREATE TABLE IF NOT EXISTS student_test_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      student_set_id INTEGER NOT NULL REFERENCES student_word_sets(id) ON DELETE CASCADE,
      score REAL NOT NULL,
      total_words INTEGER NOT NULL,
      correct_answers INTEGER NOT NULL,
      wrong_answers INTEGER NOT NULL,
      completed_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // якщо база стара і колонки token ще немає — додаємо її
  try {
    db.exec('ALTER TABLE users ADD COLUMN token TEXT');
  } catch {
    // колонка вже є, нічого не робимо
  }

  //поля з опитування при реєстрації
  const surveyColumns = [
    'ALTER TABLE users ADD COLUMN survey_language TEXT',
    'ALTER TABLE users ADD COLUMN survey_level TEXT',
  ];
  for (const sql of surveyColumns) {
    try {
      db.exec(sql);
    } catch {
      // колонка вже є — пропускаємо
    }
  }

  // час згоди на обробку даних (GDPR)
  try {
    db.exec('ALTER TABLE users ADD COLUMN consent_at TEXT');
  } catch {
  }

  // формат часу в профілі: 24-годинний або 12-годинний (AM/PM)
  try {
    db.exec("ALTER TABLE users ADD COLUMN time_format TEXT NOT NULL DEFAULT '24'");
  } catch {
  }

  // прибираємо старі поля, які більше не використовуються
  const oldColumns = [
    'ALTER TABLE word_sets DROP COLUMN topic',
    'ALTER TABLE word_sets DROP COLUMN description',
    'ALTER TABLE word_cards DROP COLUMN transcription',
    'ALTER TABLE word_cards DROP COLUMN difficulty',
  ];
  for (const sql of oldColumns) {
    try {
      db.exec(sql);
    } catch {
      // такої колонки вже немає — пропускаємо
    }
  }

  // якщо база стара і колонки example ще немає — додаємо її
  const exampleColumns = [
    'ALTER TABLE word_cards ADD COLUMN example TEXT',
    'ALTER TABLE student_word_cards ADD COLUMN example TEXT',
  ];
  for (const sql of exampleColumns) {
    try {
      db.exec(sql);
    } catch {
      // колонка вже є — пропускаємо
    }
  }

  // якщо в users ще немає ролі admin — оновлюємо таблицю 
  migrateUsersRoleIfNeeded(db);

  // якщо база порожня — додаємо демо-дані
  seedDemoIfEmpty(db);
  seedStudentFlashDemoIfMissing(db);
  seedTeacherFlashDemoIfMissing(db);
  seedStatsDemoIfMissing(db);
  return db;
}

// Додати роль admin у CHECK для users.
function migrateUsersRoleIfNeeded(db) {
  const row = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='users'").get();
  // нова база вже має admin у схемі — нічого не робимо
  if (!row || row.sql.includes("'admin'")) {
    return;
  }

  // тимчасово вимикаємо зовнішні ключі, щоб можна було DROP users
  db.pragma('foreign_keys = OFF');
  db.exec(`
    CREATE TABLE users_new (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('teacher', 'student', 'admin')),
      token TEXT,
      survey_language TEXT,
      survey_level TEXT,
      consent_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    INSERT INTO users_new (id, name, email, password_hash, role, token, survey_language, survey_level, consent_at, created_at)
    SELECT id, name, email, password_hash, role, token, survey_language, survey_level, consent_at, created_at
    FROM users;

    DROP TABLE users;
    ALTER TABLE users_new RENAME TO users;
  `);
  // знову вмикаємо перевірку зовнішніх ключів
  db.pragma('foreign_keys = ON');
}

// повертає базу (використовується в усіх маршрутах)
export function getDb() {
  if (!db) throw new Error('База не ініціалізована');
  return db;
}

// шлях до файлу app.db
export function getDbPath() {
  return dbPath;
}

// закриваємо з'єднання перед заміною файлу бази
export function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}
