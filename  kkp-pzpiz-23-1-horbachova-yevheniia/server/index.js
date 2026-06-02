// Головний файл сервера. Тут запускаємо Express і підключаємо всі маршрути.
import express from 'express';
import { initDb, getDb } from './db.js';
import authRouter from './auth.js';
import classesRouter from './classes.js';
import wordSetsRouter from './wordSets.js';
import assignmentsRouter from './assignments.js';
import studyRouter from './study.js';
import testsRouter from './tests.js';
import studentSetsRouter from './studentSets.js';

// створюємо базу і таблиці
initDb();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// дозволяємо запити з клієнта CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  next();
});

app.options('*', (req, res) => res.sendStatus(204));

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

app.listen(PORT, () => {
  console.log('http://localhost:' + PORT);
});
