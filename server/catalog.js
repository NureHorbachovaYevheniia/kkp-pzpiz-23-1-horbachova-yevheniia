import { Router } from 'express';
import { getDb } from './db.js';
import { requireAuth } from './auth.js';

const router = Router();

router.get('/categories', requireAuth, (_req, res) => {
  const rows = getDb().prepare('SELECT id, title FROM categories ORDER BY id').all();
  return res.json(rows);
});

export default router;
