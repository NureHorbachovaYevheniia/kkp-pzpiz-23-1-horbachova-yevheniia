import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getDb } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-change-me';
const JWT_EXPIRES = '7d';

const router = Router();

export function requireAuth(req, res, next) {
  const raw = req.headers.authorization || '';
  const m = /^Bearer\s+(\S+)/i.exec(raw);
  if (!m) {
    return res.status(401).json({ error: 'Потрібен токен' });
  }
  let payload;
  try {
    payload = jwt.verify(m[1], JWT_SECRET);
  } catch {
    return res.status(401).json({ error: 'Недійсний токен' });
  }
  const row = getDb()
    .prepare('SELECT id, email, role FROM users WHERE id = ?')
    .get(payload.sub);
  if (!row) {
    return res.status(401).json({ error: 'Недійсний токен' });
  }
  req.user = row;
  next();
}

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

router.post('/login', (req, res) => {
  const email =
    typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body.password === 'string' ? req.body.password : '';

  if (!email || !password) {
    return res.status(400).json({ error: 'Вкажіть email і пароль' });
  }

  const row = getDb()
    .prepare('SELECT id, email, role, password_hash FROM users WHERE email = ?')
    .get(email);

  if (!row || !bcrypt.compareSync(password, row.password_hash)) {
    return res.status(401).json({ error: 'Невірний email або пароль' });
  }

  const token = jwt.sign({ sub: row.id, role: row.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES,
  });

  return res.json({
    token,
    user: { id: row.id, email: row.email, role: row.role },
  });
});

router.get('/me', requireAuth, (req, res) => {
  return res.json({
    id: req.user.id,
    email: req.user.email,
    role: req.user.role,
  });
});

export default router;
