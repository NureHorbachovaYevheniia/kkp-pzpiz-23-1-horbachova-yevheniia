import { Router } from 'express';
import { getDb } from './db.js';
import { requireAuth } from './auth.js';

const router = Router();

router.get('/categories', requireAuth, (_req, res) => {
  const rows = getDb().prepare('SELECT id, title FROM categories ORDER BY id').all();
  return res.json(rows);
});

router.get('/word-sets', requireAuth, (_req, res) => {
  const rows = getDb()
    .prepare('SELECT id, category_id, title, created_at FROM word_sets ORDER BY id')
    .all();
  return res.json(rows);
});

router.get('/word-sets/:setId/words', requireAuth, (req, res) => {
  const setId = Number(req.params.setId);
  if (!Number.isInteger(setId) || setId < 1) {
    return res.status(400).json({ error: 'Невірний id набору' });
  }

  const db = getDb();
  const set = db.prepare('SELECT id FROM word_sets WHERE id = ?').get(setId);
  if (!set) {
    return res.status(404).json({ error: 'Набір не знайдено' });
  }

  const rows = db
    .prepare('SELECT id, term, translation FROM words WHERE word_set_id = ? ORDER BY id')
    .all(setId);
  return res.json(rows);
});

export default router;
