import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express, { Router } from 'express';
import { getDb, getDbPath, closeDb, initDb } from './db.js';
import { requireAdmin } from './middleware.js';

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logPath = path.join(__dirname, 'data', 'request.log');

// порядок таблиць для імпорту (спочатку батьки, потім діти)
const TABLE_ORDER = [
  'users',
  'classes',
  'word_sets',
  'student_word_sets',
  'class_members',
  'word_cards',
  'assignments',
  'student_word_cards',
  'test_results',
  'word_progress',
  'student_word_progress',
  'student_test_results',
];

// системна статистика для адмін-панелі
router.get('/admin/stats', requireAdmin, (req, res) => {
  const db = getDb();
  const users = db.prepare('SELECT COUNT(*) AS n FROM users').get().n;
  const students = db.prepare("SELECT COUNT(*) AS n FROM users WHERE role = 'student'").get().n;
  const teachers = db.prepare("SELECT COUNT(*) AS n FROM users WHERE role = 'teacher'").get().n;
  const classes = db.prepare('SELECT COUNT(*) AS n FROM classes').get().n;
  const assignments = db.prepare('SELECT COUNT(*) AS n FROM assignments').get().n;
  const activeAssignments = db.prepare("SELECT COUNT(*) AS n FROM assignments WHERE status = 'active'").get().n;
  const testsCompleted = db.prepare('SELECT COUNT(*) AS n FROM test_results').get().n;
  const wordSets = db.prepare('SELECT COUNT(*) AS n FROM word_sets').get().n;
  const wordCards = db.prepare('SELECT COUNT(*) AS n FROM word_cards').get().n;

  res.json({
    users,
    students,
    teachers,
    classes,
    assignments,
    active_assignments: activeAssignments,
    tests_completed: testsCompleted,
    word_sets: wordSets,
    word_cards: wordCards,
  });
});

// список користувачів (без пароля)
router.get('/admin/users', requireAdmin, (req, res) => {
  const users = getDb()
    .prepare(
      `SELECT id, name, email, role, survey_language, survey_level, consent_at, created_at
       FROM users ORDER BY id`,
    )
    .all();
  res.json(users);
});

// видалити користувача за id
router.delete('/admin/users/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.status(400).json({ error: 'Невірний id' });
  }
  if (id === req.user.id) {
    return res.status(400).json({ error: 'Не можна видалити себе' });
  }
  const info = getDb().prepare('DELETE FROM users WHERE id = ?').run(id);
  if (info.changes === 0) {
    return res.status(404).json({ error: 'Користувача не знайдено' });
  }
  res.json({ ok: true });
});

// завантажити копію app.db
router.get('/admin/backup', requireAdmin, (req, res) => {
  const dbPath = getDbPath();
  if (!fs.existsSync(dbPath)) {
    return res.status(404).json({ error: 'Файл бази не знайдено' });
  }
  res.download(dbPath, 'app-backup.db');
});

// відновити базу з файлу (тіло запиту = вміст .db)
router.post(
  '/admin/restore',
  requireAdmin,
  express.raw({ limit: '50mb', type: () => true }),
  (req, res) => {
    if (!req.body || req.body.length === 0) {
      return res.status(400).json({ error: 'Надішліть файл бази в тілі запиту' });
    }

    const dbPath = getDbPath();
    closeDb();

    fs.writeFileSync(dbPath, req.body);
    // прибираємо старі WAL-файли, щоб не зіпсувати базу
    try {
      fs.unlinkSync(dbPath + '-wal');
    } catch {
      // файлу може не бути
    }
    try {
      fs.unlinkSync(dbPath + '-shm');
    } catch {
      // файлу може не бути
    }

    initDb();
    res.json({ ok: true, message: 'Базу відновлено' });
  },
);

// повний JSON-дамп усіх таблиць
router.get('/admin/export', requireAdmin, (req, res) => {
  const db = getDb();
  const tables = {};
  for (const name of TABLE_ORDER) {
    tables[name] = db.prepare(`SELECT * FROM ${name}`).all();
  }
  res.json({
    exported_at: new Date().toISOString(),
    tables,
  });
});

// імпорт JSON-дампу (замінює дані в таблицях)
router.post('/admin/import', requireAdmin, (req, res) => {
  const payload = req.body;
  if (!payload || !payload.tables || typeof payload.tables !== 'object') {
    return res.status(400).json({ error: 'Очікується JSON з полем tables' });
  }

  const db = getDb();
  db.pragma('foreign_keys = OFF');

  const tx = db.transaction(() => {
    for (const name of TABLE_ORDER) {
      db.prepare(`DELETE FROM ${name}`).run();
    }
    for (const name of TABLE_ORDER) {
      const rows = payload.tables[name];
      if (!rows || rows.length === 0) continue;

      for (const row of rows) {
        const cols = Object.keys(row);
        const placeholders = cols.map(() => '?').join(', ');
        const sql = `INSERT INTO ${name} (${cols.join(', ')}) VALUES (${placeholders})`;
        db.prepare(sql).run(cols.map((c) => row[c]));
      }
    }
  });

  try {
    tx();
    db.pragma('foreign_keys = ON');
    res.json({ ok: true, message: 'Дані імпортовано' });
  } catch (err) {
    db.pragma('foreign_keys = ON');
    res.status(400).json({ error: 'Помилка імпорту: ' + err.message });
  }
});

// останні рядки з request.log
router.get('/admin/logs', requireAdmin, (req, res) => {
  if (!fs.existsSync(logPath)) {
    return res.json({ lines: [] });
  }
  const text = fs.readFileSync(logPath, 'utf8');
  const lines = text.split('\n').filter((line) => line.trim() !== '');
  const last = lines.slice(-200);
  res.json({ lines: last });
});

export default router;
