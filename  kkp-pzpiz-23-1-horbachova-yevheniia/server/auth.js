import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getDb } from './db.js';

const router = Router();

// секрет для підпису JWT
const JWT_SECRET = process.env.JWT_SECRET || 'learnly_dev_secret_change_me';
const JWT_EXPIRES_IN = '7d';

// створюємо JWT для користувача
function makeToken(user) {
  return jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// перевіряємо JWT з заголовка і знаходимо користувача в базі
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.replace('Bearer ', '').trim();
  if (!token) {
    return res.status(401).json({ error: 'Потрібен токен' });
  }
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch {
    // підпис невірний або токен прострочений
    return res.status(401).json({ error: 'Недійсний токен' });
  }
  const user = getDb()
    .prepare('SELECT id, name, email, role FROM users WHERE id = ?')
    .get(payload.id);
  if (!user) {
    return res.status(401).json({ error: 'Недійсний токен' });
  }
  req.user = user;
  next();
}

// реєстрація нового користувача
router.post('/register', (req, res) => {
  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  const role = String(req.body.role || '').trim();
  // відповіді з опитування
  const surveyLanguage = String(req.body.survey_language || '').trim().slice(0, 100);
  const surveyLevel = String(req.body.survey_level || '').trim().slice(0, 100);
  const consent = req.body.consent === true;

  // перевіряємо дані з форми
  if (!consent) {
    return res.status(400).json({ error: 'Потрібна згода на обробку даних' });
  }
  if (name.length < 2 || name.length > 100) {
    return res.status(400).json({ error: 'Ім\'я 2–100 символів' });
  }
  if (!email.includes('@') || email.length < 4) {
    return res.status(400).json({ error: 'Невірний email' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Пароль мінімум 6 символів' });
  }
  if (role !== 'teacher' && role !== 'student') {
    return res.status(400).json({ error: 'Роль: teacher або student' });
  }

  // хешуємо пароль
  const password_hash = bcrypt.hashSync(password, 10);

  try {
    const info = getDb()
      .prepare(
        'INSERT INTO users (name, email, password_hash, role, survey_language, survey_level, consent_at) VALUES (?, ?, ?, ?, ?, ?, datetime(\'now\'))',
      )
      .run(name, email, password_hash, role, surveyLanguage, surveyLevel);
    return res.status(201).json({ id: info.lastInsertRowid, name, email, role });
  } catch (err) {
    // такий email уже зайнятий
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ error: 'Такий email вже є' });
    }
    throw err;
  }
});

// вхід: перевіряємо пароль і видаємо токен
router.post('/login', (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');

  if (!email || !password) {
    return res.status(400).json({ error: 'Вкажіть email і пароль' });
  }

  const user = getDb()
    .prepare('SELECT id, name, email, role, password_hash FROM users WHERE email = ?')
    .get(email);

  // якщо користувача немає або пароль не збігається
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Невірний email або пароль' });
  }

  // створюємо підписаний JWT
  const token = makeToken(user);

  return res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

// повертає дані поточного користувача
router.get('/me', requireAuth, (req, res) => {
  return res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  });
});

// оновлення профілю (ім'я, email, пароль — за бажанням)
router.put('/me', requireAuth, (req, res) => {
  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');

  if (name.length < 2 || name.length > 100) {
    return res.status(400).json({ error: 'Ім\'я 2–100 символів' });
  }
  if (!email.includes('@') || email.length < 4) {
    return res.status(400).json({ error: 'Невірний email' });
  }
  if (password && password.length < 6) {
    return res.status(400).json({ error: 'Пароль мінімум 6 символів' });
  }

  try {
    if (password) {
      const password_hash = bcrypt.hashSync(password, 10);
      getDb()
        .prepare('UPDATE users SET name = ?, email = ?, password_hash = ? WHERE id = ?')
        .run(name, email, password_hash, req.user.id);
    } else {
      getDb()
        .prepare('UPDATE users SET name = ?, email = ? WHERE id = ?')
        .run(name, email, req.user.id);
    }
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ error: 'Такий email вже є' });
    }
    throw err;
  }

  return res.json({
    id: req.user.id,
    name,
    email,
    role: req.user.role,
  });
});

// видалення власного акаунта
router.delete('/me', requireAuth, (req, res) => {
  getDb().prepare('DELETE FROM users WHERE id = ?').run(req.user.id);
  return res.json({ ok: true });
});

export default router;
