// Маршрути для наборів слів і карток (тільки для викладача).
import { Router } from 'express';
import { getDb } from './db.js';
import { requireAuth } from './auth.js';
import { requireTeacher } from './middleware.js';

const router = Router();
const MAX_CARDS_PER_SET = 50; // максимум карток в одному наборі

// набір, що належить цьому викладачу
function getOwnedSet(setId, teacherId) {
  return getDb()
    .prepare('SELECT * FROM word_sets WHERE id = ? AND teacher_id = ?')
    .get(setId, teacherId);
}

// картка, що належить цьому викладачу (через набір)
function getOwnedCard(cardId, teacherId) {
  return getDb()
    .prepare(
      `SELECT wc.* FROM word_cards wc
       INNER JOIN word_sets ws ON ws.id = wc.word_set_id
       WHERE wc.id = ? AND ws.teacher_id = ?`,
    )
    .get(cardId, teacherId);
}

// список усіх наборів викладача
router.get('/word-sets', requireAuth, requireTeacher, (req, res) => {
  const rows = getDb()
    .prepare(
      `SELECT ws.*,
       (SELECT COUNT(*) FROM word_cards wc WHERE wc.word_set_id = ws.id) AS card_count
       FROM word_sets ws WHERE ws.teacher_id = ? ORDER BY ws.id DESC`,
    )
    .all(req.user.id);
  return res.json(rows);
});

// створити новий набір слів
router.post('/word-sets', requireAuth, requireTeacher, (req, res) => {
  const title = String(req.body.title || '').trim();
  const language = String(req.body.language || '').trim();

  if (title.length < 1 || title.length > 200) {
    return res.status(400).json({ error: 'Назва набору 1–200 символів' });
  }

  const info = getDb()
    .prepare('INSERT INTO word_sets (teacher_id, title, language) VALUES (?, ?, ?)')
    .run(req.user.id, title, language);

  const row = getDb().prepare('SELECT * FROM word_sets WHERE id = ?').get(info.lastInsertRowid);
  return res.status(201).json(row);
});

// один набір (з кількістю карток)
router.get('/word-sets/:id', requireAuth, requireTeacher, (req, res) => {
  const setId = Number(req.params.id);
  if (!Number.isInteger(setId) || setId < 1) {
    return res.status(400).json({ error: 'Невірний id набору' });
  }

  const set = getOwnedSet(setId, req.user.id);
  if (!set) return res.status(404).json({ error: 'Набір не знайдено' });

  const cardCount = getDb()
    .prepare('SELECT COUNT(*) AS n FROM word_cards WHERE word_set_id = ?')
    .get(setId).n;

  return res.json({ ...set, card_count: cardCount });
});

// редагувати набір
router.patch('/word-sets/:id', requireAuth, requireTeacher, (req, res) => {
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
    .prepare('UPDATE word_sets SET title = ?, language = ? WHERE id = ?')
    .run(title, language, setId);

  const row = getDb().prepare('SELECT * FROM word_sets WHERE id = ?').get(setId);
  return res.json(row);
});

// видалити набір
router.delete('/word-sets/:id', requireAuth, requireTeacher, (req, res) => {
  const setId = Number(req.params.id);
  if (!Number.isInteger(setId) || setId < 1) {
    return res.status(400).json({ error: 'Невірний id набору' });
  }

  const set = getOwnedSet(setId, req.user.id);
  if (!set) return res.status(404).json({ error: 'Набір не знайдено' });

  getDb().prepare('DELETE FROM word_sets WHERE id = ?').run(setId);
  return res.status(204).end();
});

// усі картки набору
router.get('/word-sets/:id/cards', requireAuth, requireTeacher, (req, res) => {
  const setId = Number(req.params.id);
  if (!Number.isInteger(setId) || setId < 1) {
    return res.status(400).json({ error: 'Невірний id набору' });
  }

  const set = getOwnedSet(setId, req.user.id);
  if (!set) return res.status(404).json({ error: 'Набір не знайдено' });

  const cards = getDb()
    .prepare('SELECT * FROM word_cards WHERE word_set_id = ? ORDER BY id')
    .all(setId);
  return res.json(cards);
});

// додати картку (слово + переклад, фото за бажанням)
router.post('/word-sets/:id/cards', requireAuth, requireTeacher, (req, res) => {
  const setId = Number(req.params.id);
  if (!Number.isInteger(setId) || setId < 1) {
    return res.status(400).json({ error: 'Невірний id набору' });
  }

  const set = getOwnedSet(setId, req.user.id);
  if (!set) return res.status(404).json({ error: 'Набір не знайдено' });

  // не даємо додати більше за ліміт
  const count = getDb()
    .prepare('SELECT COUNT(*) AS n FROM word_cards WHERE word_set_id = ?')
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
      `INSERT INTO word_cards (word_set_id, word, translation, image_url, example)
       VALUES (?, ?, ?, ?, ?)`,
    )
    .run(setId, word, translation, imageUrl, example);

  const row = getDb().prepare('SELECT * FROM word_cards WHERE id = ?').get(info.lastInsertRowid);
  return res.status(201).json(row);
});

// редагувати картку
router.patch('/word-cards/:id', requireAuth, requireTeacher, (req, res) => {
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
    .prepare('UPDATE word_cards SET word = ?, translation = ?, image_url = ?, example = ? WHERE id = ?')
    .run(word, translation, imageUrl, example, cardId);

  const row = getDb().prepare('SELECT * FROM word_cards WHERE id = ?').get(cardId);
  return res.json(row);
});

// видалити картку
router.delete('/word-cards/:id', requireAuth, requireTeacher, (req, res) => {
  const cardId = Number(req.params.id);
  if (!Number.isInteger(cardId) || cardId < 1) {
    return res.status(400).json({ error: 'Невірний id картки' });
  }

  const card = getOwnedCard(cardId, req.user.id);
  if (!card) return res.status(404).json({ error: 'Картку не знайдено' });

  getDb().prepare('DELETE FROM word_cards WHERE id = ?').run(cardId);
  return res.status(204).end();
});

export default router;
