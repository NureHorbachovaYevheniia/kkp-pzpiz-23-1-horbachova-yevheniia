import { Router } from 'express';
import { getDb } from './db.js';
import { requireAuth } from './auth.js';
import { requireStudent } from './middleware.js';
import { countStudentSets, MAX_STUDENT_SETS } from './limits.js';

const router = Router();
const MAX_CARDS_PER_SET = 50; // максимум карток в одному наборі
const VALID_STATUSES = ['know', 'almost', 'repeat'];

// набір, що належить цьому учню
function getOwnedSet(setId, studentId) {
  return getDb()
    .prepare('SELECT * FROM student_word_sets WHERE id = ? AND student_id = ?')
    .get(setId, studentId);
}

// картка, що належить цьому учню
function getOwnedCard(cardId, studentId) {
  return getDb()
    .prepare(
      `SELECT sc.* FROM student_word_cards sc
       INNER JOIN student_word_sets ss ON ss.id = sc.student_set_id
       WHERE sc.id = ? AND ss.student_id = ?`,
    )
    .get(cardId, studentId);
}

// список усіх наборів учня
router.get('/my-sets', requireAuth, requireStudent, (req, res) => {
  const rows = getDb()
    .prepare(
      `SELECT ss.*,
       (SELECT COUNT(*) FROM student_word_cards sc WHERE sc.student_set_id = ss.id) AS card_count
       FROM student_word_sets ss WHERE ss.student_id = ? ORDER BY ss.id DESC`,
    )
    .all(req.user.id);
  return res.json(rows);
});

// створити новий набір
router.post('/my-sets', requireAuth, requireStudent, (req, res) => {
  const title = String(req.body.title || '').trim();
  const language = String(req.body.language || '').trim();

  if (title.length < 1 || title.length > 200) {
    return res.status(400).json({ error: 'Назва набору 1–200 символів' });
  }

  const db = getDb();
  if (countStudentSets(db, req.user.id) >= MAX_STUDENT_SETS) {
    return res.status(400).json({
      error: `Досягнуто ліміт: максимум ${MAX_STUDENT_SETS} наборів. Оформіть преміум-підписку.`,
    });
  }

  const info = getDb()
    .prepare('INSERT INTO student_word_sets (student_id, title, language) VALUES (?, ?, ?)')
    .run(req.user.id, title, language);

  const row = getDb()
    .prepare('SELECT * FROM student_word_sets WHERE id = ?')
    .get(info.lastInsertRowid);
  return res.status(201).json(row);
});

// один набір (з кількістю карток)
router.get('/my-sets/:id', requireAuth, requireStudent, (req, res) => {
  const setId = Number(req.params.id);
  if (!Number.isInteger(setId) || setId < 1) {
    return res.status(400).json({ error: 'Невірний id набору' });
  }

  const set = getOwnedSet(setId, req.user.id);
  if (!set) return res.status(404).json({ error: 'Набір не знайдено' });

  const cardCount = getDb()
    .prepare('SELECT COUNT(*) AS n FROM student_word_cards WHERE student_set_id = ?')
    .get(setId).n;

  return res.json({ ...set, card_count: cardCount });
});

// редагувати набір
router.patch('/my-sets/:id', requireAuth, requireStudent, (req, res) => {
  const setId = Number(req.params.id);
  if (!Number.isInteger(setId) || setId < 1) {
    return res.status(400).json({ error: 'Невірний id набору' });
  }

  const set = getOwnedSet(setId, req.user.id);
  if (!set) return res.status(404).json({ error: 'Набір не знайдено' });

  const title =
    typeof req.body.title === 'string' ? req.body.title.trim() : set.title;
  const language =
    typeof req.body.language === 'string' ? req.body.language.trim() : set.language;

  if (title.length < 1 || title.length > 200) {
    return res.status(400).json({ error: 'Назва набору 1–200 символів' });
  }

  getDb()
    .prepare('UPDATE student_word_sets SET title = ?, language = ? WHERE id = ?')
    .run(title, language, setId);

  const row = getDb().prepare('SELECT * FROM student_word_sets WHERE id = ?').get(setId);
  return res.json(row);
});

// видалити набір
router.delete('/my-sets/:id', requireAuth, requireStudent, (req, res) => {
  const setId = Number(req.params.id);
  if (!Number.isInteger(setId) || setId < 1) {
    return res.status(400).json({ error: 'Невірний id набору' });
  }

  const set = getOwnedSet(setId, req.user.id);
  if (!set) return res.status(404).json({ error: 'Набір не знайдено' });

  getDb().prepare('DELETE FROM student_word_sets WHERE id = ?').run(setId);
  return res.status(204).end();
});

// усі картки набору
router.get('/my-sets/:id/cards', requireAuth, requireStudent, (req, res) => {
  const setId = Number(req.params.id);
  if (!Number.isInteger(setId) || setId < 1) {
    return res.status(400).json({ error: 'Невірний id набору' });
  }

  const set = getOwnedSet(setId, req.user.id);
  if (!set) return res.status(404).json({ error: 'Набір не знайдено' });

  const cards = getDb()
    .prepare('SELECT * FROM student_word_cards WHERE student_set_id = ? ORDER BY id')
    .all(setId);
  return res.json(cards);
});

// додати картку
router.post('/my-sets/:id/cards', requireAuth, requireStudent, (req, res) => {
  const setId = Number(req.params.id);
  if (!Number.isInteger(setId) || setId < 1) {
    return res.status(400).json({ error: 'Невірний id набору' });
  }

  const set = getOwnedSet(setId, req.user.id);
  if (!set) return res.status(404).json({ error: 'Набір не знайдено' });

  // не даємо додати більше за ліміт
  const count = getDb()
    .prepare('SELECT COUNT(*) AS n FROM student_word_cards WHERE student_set_id = ?')
    .get(setId).n;
  if (count >= MAX_CARDS_PER_SET) {
    return res.status(400).json({ error: `Максимум ${MAX_CARDS_PER_SET} карток у наборі` });
  }

  const word = String(req.body.word || '').trim();
  const translation = String(req.body.translation || '').trim();
  const imageUrl = String(req.body.image_url || '').trim() || null;
  const example = String(req.body.example || '').trim() || null;

  if (word.length < 1 || translation.length < 1) {
    return res.status(400).json({ error: 'Введіть слово і переклад' });
  }

  const info = getDb()
    .prepare(
      `INSERT INTO student_word_cards (student_set_id, word, translation, image_url, example)
       VALUES (?, ?, ?, ?, ?)`,
    )
    .run(setId, word, translation, imageUrl, example);

  const row = getDb()
    .prepare('SELECT * FROM student_word_cards WHERE id = ?')
    .get(info.lastInsertRowid);
  return res.status(201).json(row);
});

// редагувати картку
router.patch('/my-cards/:id', requireAuth, requireStudent, (req, res) => {
  const cardId = Number(req.params.id);
  if (!Number.isInteger(cardId) || cardId < 1) {
    return res.status(400).json({ error: 'Невірний id картки' });
  }

  const card = getOwnedCard(cardId, req.user.id);
  if (!card) return res.status(404).json({ error: 'Картку не знайдено' });

  const word = typeof req.body.word === 'string' ? req.body.word.trim() : card.word;
  const translation =
    typeof req.body.translation === 'string' ? req.body.translation.trim() : card.translation;
  const imageUrl =
    req.body.image_url === null
      ? null
      : typeof req.body.image_url === 'string'
        ? req.body.image_url.trim() || null
        : card.image_url;
  const example =
    req.body.example === null
      ? null
      : typeof req.body.example === 'string'
        ? req.body.example.trim() || null
        : card.example;

  if (word.length < 1 || translation.length < 1) {
    return res.status(400).json({ error: 'Введіть слово і переклад' });
  }

  getDb()
    .prepare('UPDATE student_word_cards SET word = ?, translation = ?, image_url = ?, example = ? WHERE id = ?')
    .run(word, translation, imageUrl, example, cardId);

  const row = getDb().prepare('SELECT * FROM student_word_cards WHERE id = ?').get(cardId);
  return res.json(row);
});

// видалити картку
router.delete('/my-cards/:id', requireAuth, requireStudent, (req, res) => {
  const cardId = Number(req.params.id);
  if (!Number.isInteger(cardId) || cardId < 1) {
    return res.status(400).json({ error: 'Невірний id картки' });
  }

  const card = getOwnedCard(cardId, req.user.id);
  if (!card) return res.status(404).json({ error: 'Картку не знайдено' });

  getDb().prepare('DELETE FROM student_word_cards WHERE id = ?').run(cardId);
  return res.status(204).end();
});

// картки набору разом з прогресом учня (режим вивчення)
router.get('/my-sets/:id/study', requireAuth, requireStudent, (req, res) => {
  const setId = Number(req.params.id);
  if (!Number.isInteger(setId) || setId < 1) {
    return res.status(400).json({ error: 'Невірний id набору' });
  }

  const set = getOwnedSet(setId, req.user.id);
  if (!set) return res.status(404).json({ error: 'Набір не знайдено' });

  const cards = getDb()
    .prepare(
      `SELECT sc.*,
       COALESCE(sp.status, 'not_started') AS progress_status,
       COALESCE(sp.correct_count, 0) AS correct_count,
       COALESCE(sp.wrong_count, 0) AS wrong_count
       FROM student_word_cards sc
       LEFT JOIN student_word_progress sp ON sp.student_card_id = sc.id
         AND sp.student_id = ?
       WHERE sc.student_set_id = ?
       ORDER BY sc.id`,
    )
    .all(req.user.id, setId);

  return res.json({
    set: { id: set.id, title: set.title, language: set.language },
    cards,
  });
});

// зберігаємо, як учень відповів на слово
router.post('/my-sets/:id/progress', requireAuth, requireStudent, (req, res) => {
  const setId = Number(req.params.id);
  const cardId = Number(req.body.word_card_id);
  const status = String(req.body.status || '').trim();

  if (!Number.isInteger(setId) || setId < 1) {
    return res.status(400).json({ error: 'Невірний id набору' });
  }
  if (!Number.isInteger(cardId) || cardId < 1) {
    return res.status(400).json({ error: 'Невірний word_card_id' });
  }
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: 'status: know, almost або repeat' });
  }

  const set = getOwnedSet(setId, req.user.id);
  if (!set) return res.status(404).json({ error: 'Набір не знайдено' });

  const db = getDb();
  const card = db
    .prepare('SELECT id FROM student_word_cards WHERE id = ? AND student_set_id = ?')
    .get(cardId, setId);
  if (!card) return res.status(404).json({ error: 'Картку не знайдено' });

  const isCorrect = status === 'know' || status === 'almost';
  const correctInc = isCorrect ? 1 : 0;
  const wrongInc = isCorrect ? 0 : 1;

  db.prepare(
    `INSERT INTO student_word_progress (student_id, student_card_id, status, correct_count, wrong_count, last_reviewed_at)
     VALUES (?, ?, ?, ?, ?, datetime('now'))
     ON CONFLICT(student_id, student_card_id) DO UPDATE SET
       status = excluded.status,
       correct_count = student_word_progress.correct_count + ?,
       wrong_count = student_word_progress.wrong_count + ?,
       last_reviewed_at = datetime('now')`,
  ).run(req.user.id, cardId, status, correctInc, wrongInc, correctInc, wrongInc);

  const row = db
    .prepare(
      'SELECT * FROM student_word_progress WHERE student_id = ? AND student_card_id = ?',
    )
    .get(req.user.id, cardId);

  return res.json(row);
});

// слова, які треба повторити (статус repeat або були помилки)
router.get('/my-sets/:id/review-errors', requireAuth, requireStudent, (req, res) => {
  const setId = Number(req.params.id);
  if (!Number.isInteger(setId) || setId < 1) {
    return res.status(400).json({ error: 'Невірний id набору' });
  }

  const set = getOwnedSet(setId, req.user.id);
  if (!set) return res.status(404).json({ error: 'Набір не знайдено' });

  const cards = getDb()
    .prepare(
      `SELECT sc.*, sp.status AS progress_status, sp.wrong_count, sp.correct_count
       FROM student_word_cards sc
       INNER JOIN student_word_progress sp ON sp.student_card_id = sc.id
         AND sp.student_id = ?
       WHERE sc.student_set_id = ?
         AND (sp.status = 'repeat' OR sp.wrong_count > 0)
       ORDER BY sp.wrong_count DESC, sc.id`,
    )
    .all(req.user.id, setId);

  return res.json({ set_id: setId, language: set.language, cards });
});

export default router;
