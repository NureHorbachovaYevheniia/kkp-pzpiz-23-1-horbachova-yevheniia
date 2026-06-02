import { Router } from 'express';
import { getDb } from './db.js';
import { requireAuth } from './auth.js';
import { requireTeacher, requireStudent } from './middleware.js';
import {
  getAssignmentById,
  canAccessAssignment,
  getClassForTeacher,
  computeStudentAssignmentStatus,
} from './helpers.js';

const router = Router();

// створити завдання для класу
router.post('/assignments', requireAuth, requireTeacher, (req, res) => {
  const classId = Number(req.body.class_id);
  const wordSetId = Number(req.body.word_set_id);
  const title = String(req.body.title || '').trim();
  const startDate = String(req.body.start_date || '').trim();
  const deadline = String(req.body.deadline || '').trim();
  const mode = 'study';

  if (!Number.isInteger(classId) || classId < 1) {
    return res.status(400).json({ error: 'Невірний class_id' });
  }
  if (!Number.isInteger(wordSetId) || wordSetId < 1) {
    return res.status(400).json({ error: 'Невірний word_set_id' });
  }
  if (title.length < 1 || title.length > 200) {
    return res.status(400).json({ error: 'Назва завдання 1–200 символів' });
  }
  if (!startDate || !deadline) {
    return res.status(400).json({ error: 'Вкажіть start_date і deadline (YYYY-MM-DD)' });
  }
  const db = getDb();
  const cls = getClassForTeacher(classId, req.user.id);
  if (!cls) return res.status(404).json({ error: 'Клас не знайдено' });

  const set = db
    .prepare('SELECT id FROM word_sets WHERE id = ? AND teacher_id = ?')
    .get(wordSetId, req.user.id);
  if (!set) return res.status(404).json({ error: 'Набір слів не знайдено' });

  const info = db
    .prepare(
      `INSERT INTO assignments (class_id, word_set_id, title, start_date, deadline, mode, status)
       VALUES (?, ?, ?, ?, ?, ?, 'active')`,
    )
    .run(classId, wordSetId, title, startDate, deadline, mode);

  const row = db.prepare('SELECT * FROM assignments WHERE id = ?').get(info.lastInsertRowid);
  return res.status(201).json(row);
});

// усі завдання викладача
router.get('/assignments', requireAuth, requireTeacher, (req, res) => {
  const rows = getDb()
    .prepare(
      `SELECT a.*, c.title AS class_title, ws.title AS word_set_title,
       (SELECT COUNT(*) FROM word_cards wc WHERE wc.word_set_id = a.word_set_id) AS card_count
       FROM assignments a
       INNER JOIN classes c ON c.id = a.class_id
       INNER JOIN word_sets ws ON ws.id = a.word_set_id
       WHERE c.teacher_id = ?
       ORDER BY a.deadline DESC`,
    )
    .all(req.user.id);
  return res.json(rows);
});

// активні завдання учня
router.get('/student/assignments', requireAuth, requireStudent, (req, res) => {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT a.*, c.title AS class_title, ws.title AS word_set_title,
       (SELECT COUNT(*) FROM word_cards wc WHERE wc.word_set_id = a.word_set_id) AS card_count
       FROM assignments a
       INNER JOIN classes c ON c.id = a.class_id
       INNER JOIN class_members cm ON cm.class_id = c.id
       INNER JOIN word_sets ws ON ws.id = a.word_set_id
       WHERE cm.student_id = ? AND a.status = 'active'
       ORDER BY a.deadline ASC`,
    )
    .all(req.user.id);

  const enriched = rows.map((a) => ({
    ...a,
    student_status: computeStudentAssignmentStatus(db, a.id, req.user.id),
  }));

  return res.json(enriched);
});

// викладач активує тестування для завдання
router.put('/assignments/:id/activate-test', requireAuth, requireTeacher, (req, res) => {
  const assignmentId = Number(req.params.id);
  if (!Number.isInteger(assignmentId) || assignmentId < 1) {
    return res.status(400).json({ error: 'Невірний id завдання' });
  }

  const assignment = getAssignmentById(assignmentId);
  if (!canAccessAssignment(req.user, assignment)) {
    return res.status(404).json({ error: 'Завдання не знайдено' });
  }

  const deadline = String(req.body.deadline || assignment.deadline || '').trim();
  if (!deadline) {
    return res.status(400).json({ error: 'Вкажіть дедлайн' });
  }

  const today = new Date().toISOString().slice(0, 10);
  if (deadline < today) {
    return res.status(400).json({ error: 'Дедлайн не може бути в минулому' });
  }

  getDb()
    .prepare("UPDATE assignments SET mode = 'test', status = 'active', deadline = ? WHERE id = ?")
    .run(deadline, assignmentId);

  const row = getAssignmentById(assignmentId);
  return res.json(row);
});

// одне завдання (доступне і викладачу, і учню класу)
router.get('/assignments/:id', requireAuth, (req, res) => {
  const assignmentId = Number(req.params.id);
  if (!Number.isInteger(assignmentId) || assignmentId < 1) {
    return res.status(400).json({ error: 'Невірний id завдання' });
  }

  const assignment = getAssignmentById(assignmentId);
  if (!canAccessAssignment(req.user, assignment)) {
    return res.status(404).json({ error: 'Завдання не знайдено' });
  }

  const db = getDb();
  const cardCount = db
    .prepare('SELECT COUNT(*) AS n FROM word_cards WHERE word_set_id = ?')
    .get(assignment.word_set_id).n;

  const payload = { ...assignment, card_count: cardCount };

  if (req.user.role === 'student') {
    payload.student_status = computeStudentAssignmentStatus(db, assignmentId, req.user.id);
  }

  return res.json(payload);
});

export default router;
