import express from 'express';
import { initDb, getDb } from './db.js';

initDb();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  next();
});

app.options('*', (_req, res) => res.sendStatus(204));

app.get('/health', (_req, res) => {
  const row = getDb().prepare('SELECT 1 AS n').get();
  res.json({ ok: true, db: row && row.n === 1 });
});

app.listen(PORT, () => {
  console.log('http://localhost:' + PORT);
});
