// Режим вивчення слів учнем і збереження прогресу.
import { Router } from 'express';
import { getDb } from './db.js';
import { requireAuth } from './auth.js';
import { requireStudent } from './middleware.js';
import { getAssignmentById, canAccessAssignment } from './helpers.js';

const router = Router();
const VALID_STATUSES = ['know', 'almost', 'repeat']; // можливі статуси слова

// беремо всі картки завдання разом з прогресом учня
router.get('/assignments/:id/study', requireAuth, requireStudent, (req, res) => {
  const assignmentId = Number(req.params.id);
  if (!Number.isInteger(assignmentId) || assignmentId < 1) {
    return res.status(400).json({ error: 'Невірний id завдання' });
  }

  const assignment = getAssignmentById(assignmentId);
  if (!canAccessAssignment(req.user, assignment)) {
    return res.status(404).json({ error: 'Завдання не знайдено' });
  }

  const db = getDb();
  const cards = db
    .prepare(
      `SELECT wc.*,
       COALESCE(wp.status, 'not_started') AS progress_status,
       COALESCE(wp.correct_count, 0) AS correct_count,
       COALESCE(wp.wrong_count, 0) AS wrong_count
       FROM word_cards wc
       LEFT JOIN word_progress wp ON wp.word_card_id = wc.id
         AND wp.assignment_id = ? AND wp.student_id = ?
       WHERE wc.word_set_id = ?
       ORDER BY wc.id`,
    )
    .all(assignmentId, req.user.id, assignment.word_set_id);

  return res.json({
    assignment: {
      id: assignment.id,
      title: assignment.title,
      mode: assignment.mode,
      deadline: assignment.deadline,
      word_set_title: assignment.word_set_title,
    },
    language: assignment.word_set_language,
    cards,
  });
});

// зберігаємо, як учень відповів на слово (знаю / повторити тощо)
router.post('/assignments/:id/progress', requireAuth, requireStudent, (req, res) => {
  const assignmentId = Number(req.params.id);
  const wordCardId = Number(req.body.word_card_id);
  const status = String(req.body.status || '').trim();

  if (!Number.isInteger(assignmentId) || assignmentId < 1) {
    return res.status(400).json({ error: 'Невірний id завдання' });
  }
  if (!Number.isInteger(wordCardId) || wordCardId < 1) {
    return res.status(400).json({ error: 'Невірний word_card_id' });
  }
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: 'status: know, almost або repeat' });
  }

  const assignment = getAssignmentById(assignmentId);
  if (!canAccessAssignment(req.user, assignment)) {
    return res.status(404).json({ error: 'Завдання не знайдено' });
  }

  const db = getDb();
  const card = db
    .prepare('SELECT id FROM word_cards WHERE id = ? AND word_set_id = ?')
    .get(wordCardId, assignment.word_set_id);
  if (!card) return res.status(404).json({ error: 'Картку не знайдено' });

  // вважаємо відповідь правильною, якщо учень знає або майже знає слово
  const isCorrect = status === 'know' || status === 'almost';
  const correctInc = isCorrect ? 1 : 0;
  const wrongInc = isCorrect ? 0 : 1;

  // або додаємо новий запис прогресу, або оновлюємо наявний
  db.prepare(
    `INSERT INTO word_progress (student_id, word_card_id, assignment_id, status, correct_count, wrong_count, last_reviewed_at)
     VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
     ON CONFLICT(student_id, word_card_id, assignment_id) DO UPDATE SET
       status = excluded.status,
       correct_count = word_progress.correct_count + ?,
       wrong_count = word_progress.wrong_count + ?,
       last_reviewed_at = datetime('now')`,
  ).run(req.user.id, wordCardId, assignmentId, status, correctInc, wrongInc, correctInc, wrongInc);

  const row = db
    .prepare(
      `SELECT * FROM word_progress
       WHERE student_id = ? AND word_card_id = ? AND assignment_id = ?`,
    )
    .get(req.user.id, wordCardId, assignmentId);

  return res.json(row);
});

// слова, які треба повторити (статус repeat або були помилки)
router.get('/assignments/:id/review-errors', requireAuth, requireStudent, (req, res) => {
  const assignmentId = Number(req.params.id);
  if (!Number.isInteger(assignmentId) || assignmentId < 1) {
    return res.status(400).json({ error: 'Невірний id завдання' });
  }

  const assignment = getAssignmentById(assignmentId);
  if (!canAccessAssignment(req.user, assignment)) {
    return res.status(404).json({ error: 'Завдання не знайдено' });
  }

  const cards = getDb()
    .prepare(
      `SELECT wc.*, wp.status AS progress_status, wp.wrong_count, wp.correct_count
       FROM word_cards wc
       INNER JOIN word_progress wp ON wp.word_card_id = wc.id
         AND wp.assignment_id = ? AND wp.student_id = ?
       WHERE wc.word_set_id = ?
         AND (wp.status = 'repeat' OR wp.wrong_count > 0)
       ORDER BY wp.wrong_count DESC, wc.id`,
    )
    .all(assignmentId, req.user.id, assignment.word_set_id);

  return res.json({ assignment_id: assignmentId, language: assignment.word_set_language, cards });
});

export default router;
