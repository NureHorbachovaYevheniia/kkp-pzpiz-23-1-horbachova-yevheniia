import { Router } from 'express';
import bcrypt from 'bcrypt';
import { getDb } from './db.js';

const router = Router();

router.post('/register', (req, res) => {
  const email =
    typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body.password === 'string' ? req.body.password : '';

  if (!email.includes('@') || email.length < 4) {
    return res.status(400).json({ error: 'Невірний email' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Пароль мінімум 6 символів' });
  }

  const db = getDb();
  const n = db.prepare('SELECT COUNT(*) AS n FROM users').get().n;
  const role = n === 0 ? 'admin' : 'user';

  const password_hash = bcrypt.hashSync(password, 10);

  try {
    const info = db
      .prepare('INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)')
      .run(email, password_hash, role);
    return res.status(201).json({ id: info.lastInsertRowid, email, role });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ error: 'Такий email вже є' });
    }
    throw err;
  }
});

export default router;
