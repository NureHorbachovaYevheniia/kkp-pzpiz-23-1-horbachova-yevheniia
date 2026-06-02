// Головний файл сервера. Тут запускаємо Express і підключаємо всі маршрути.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { initDb, getDb } from './db.js';
import authRouter from './auth.js';
import classesRouter from './classes.js';
import wordSetsRouter from './wordSets.js';
import assignmentsRouter from './assignments.js';
import studyRouter from './study.js';
import testsRouter from './tests.js';
import studentSetsRouter from './studentSets.js';
import adminRouter from './admin.js';
import statsRouter from './stats.js';

// створюємо базу і таблиці
initDb();

const app = express();
const PORT = process.env.PORT || 3001;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const requestLogPath = path.join(__dirname, 'data', 'request.log');
fs.mkdirSync(path.dirname(requestLogPath), { recursive: true });

// не приймаємо JSON більше 100 КБ
app.use(express.json({ limit: '100kb' }));

// простий ліміт: до 60 запитів на хвилину з одного IP
const requestCounts = new Map();
app.use('/api', (req, res, next) => {
  const ip = req.ip || 'unknown';
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 60;

  let record = requestCounts.get(ip);
  if (!record || now - record.start > windowMs) {
    record = { start: now, count: 0 };
    requestCounts.set(ip, record);
  }
  record.count += 1;

  if (record.count > maxRequests) {
    return res.status(429).json({ error: 'Забагато запитів, спробуйте пізніше' });
  }
  next();
});

// зрозуміла помилка, якщо тіло занадто велике
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Тіло запиту занадто велике' });
  }
  next(err);
});

// дозволяємо запити з клієнта CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  next();
});

app.options('*', (req, res) => res.sendStatus(204));

// кожен запит записується в data/request.log
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    const line =
      new Date().toISOString() +
      ' ' +
      req.method +
      ' ' +
      req.originalUrl +
      ' ' +
      res.statusCode +
      ' ' +
      ms +
      'ms\n';
    fs.appendFileSync(requestLogPath, line);
  });
  next();
});

// перевірка
app.get('/health', (req, res) => {
  const row = getDb().prepare('SELECT 1 AS n').get();
  res.json({ ok: true, db: row && row.n === 1 });
});

// підключаємо маршрути
app.use('/api/auth', authRouter);
app.use('/api', classesRouter);
app.use('/api', wordSetsRouter);
app.use('/api', assignmentsRouter);
app.use('/api', studyRouter);
app.use('/api', testsRouter);
app.use('/api', studentSetsRouter);
app.use('/api', adminRouter);
app.use('/api', statsRouter);

app.listen(PORT, () => {
  console.log('http://localhost:' + PORT);
});
