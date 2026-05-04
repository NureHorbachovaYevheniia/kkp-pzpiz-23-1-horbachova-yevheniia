import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, 'data');
const dbPath = path.join(dataDir, 'app.db');

let db;

export function initDb() {
  fs.mkdirSync(dataDir, { recursive: true });
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS word_sets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS words (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      word_set_id INTEGER NOT NULL REFERENCES word_sets(id) ON DELETE CASCADE,
      term TEXT NOT NULL,
      translation TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS user_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      word_set_id INTEGER NOT NULL REFERENCES word_sets(id) ON DELETE CASCADE,
      correct_count INTEGER NOT NULL DEFAULT 0,
      wrong_count INTEGER NOT NULL DEFAULT 0,
      UNIQUE(user_id, word_set_id)
    );
  `);

  seedDemoIfEmpty(db);

  return db;
}

function seedDemoIfEmpty(database) {
  const n = database.prepare('SELECT COUNT(*) AS n FROM categories').get().n;
  if (n > 0) return;

  const tx = database.transaction(() => {
    const cat = database.prepare('INSERT INTO categories (title) VALUES (?)').run('Англійська');
    const set = database
      .prepare('INSERT INTO word_sets (category_id, title) VALUES (?, ?)')
      .run(cat.lastInsertRowid, 'Привітання та базові слова');
    const setId = set.lastInsertRowid;
    const ins = database.prepare(
      'INSERT INTO words (word_set_id, term, translation) VALUES (?, ?, ?)',
    );
    ins.run(setId, 'hello', 'привіт');
    ins.run(setId, 'goodbye', 'допобачення');
    ins.run(setId, 'book', 'книга');
    ins.run(setId, 'water', 'вода');
  });
  tx();
}

export function getDb() {
  if (!db) throw new Error('База не ініціалізована');
  return db;
}
