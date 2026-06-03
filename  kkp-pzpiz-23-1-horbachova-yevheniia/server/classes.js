import { Router } from 'express';
import { getDb } from './db.js';
import { requireAuth } from './auth.js';
import { requireTeacher, requireStudent } from './middleware.js';
import { generateClassCode, getClassForTeacher } from './helpers.js';
import { countTeacherClasses, MAX_TEACHER_CLASSES } from './limits.js';

const router = Router();

// головна сторінка викладача: список класів
router.get('/teacher/dashboard', requireAuth, requireTeacher, (req, res) => {
  const db = getDb();
  const teacherId = req.user.id;

  const classes = db
    .prepare(
      `SELECT c.id, c.title, c.subject, c.class_code, c.created_at,
       (SELECT COUNT(*) FROM class_members cm WHERE cm.class_id = c.id) AS student_count
       FROM classes c WHERE c.teacher_id = ? ORDER BY c.id DESC`,
    )
    .all(teacherId);

  const activeAssignments = db
    .prepare(
      `SELECT COUNT(*) AS n FROM assignments a
       INNER JOIN classes c ON c.id = a.class_id
       WHERE c.teacher_id = ? AND a.status = 'active'`,
    )
    .get(teacherId).n;

  const totalStudents = db
    .prepare(
      `SELECT COUNT(DISTINCT cm.student_id) AS n FROM class_members cm
       INNER JOIN classes c ON c.id = cm.class_id WHERE c.teacher_id = ?`,
    )
    .get(teacherId).n;

  const completionRow = db
    .prepare(
      `SELECT
         COUNT(DISTINCT tr.student_id || '-' || tr.assignment_id) AS completed,
         COUNT(DISTINCT cm.student_id || '-' || a.id) AS total_possible
       FROM assignments a
       INNER JOIN classes c ON c.id = a.class_id
       INNER JOIN class_members cm ON cm.class_id = c.id
       LEFT JOIN test_results tr ON tr.assignment_id = a.id AND tr.student_id = cm.student_id
       WHERE c.teacher_id = ? AND a.status = 'active'`,
    )
    .get(teacherId);

  const totalPossible = completionRow?.total_possible || 0;
  const completed = completionRow?.completed || 0;
  const completionPercent =
    totalPossible > 0 ? Math.round((completed / totalPossible) * 100) : 0;

  return res.json({
    classes,
    stats: {
      class_count: classes.length,
      active_assignments: activeAssignments,
      total_students: totalStudents,
      completion_percent: completionPercent,
    },
  });
});

// список класів
router.get('/classes', requireAuth, (req, res) => {
  const db = getDb();

  if (req.user.role === 'teacher') {
    const rows = db
      .prepare(
        `SELECT c.id, c.title, c.subject, c.description, c.class_code, c.created_at,
         (SELECT COUNT(*) FROM class_members cm WHERE cm.class_id = c.id) AS student_count
         FROM classes c WHERE c.teacher_id = ? ORDER BY c.id DESC`,
      )
      .all(req.user.id);
    return res.json(rows);
  }

  if (req.user.role === 'student') {
    const rows = db
      .prepare(
        `SELECT c.id, c.title, c.subject, c.description, c.class_code, c.created_at,
         u.name AS teacher_name
         FROM class_members cm
         INNER JOIN classes c ON c.id = cm.class_id
         INNER JOIN users u ON u.id = c.teacher_id
         WHERE cm.student_id = ? ORDER BY c.id DESC`,
      )
      .all(req.user.id);
    return res.json(rows);
  }

  return res.status(403).json({ error: 'Недостатньо прав доступу' });
});

// створення нового класу
router.post('/classes', requireAuth, requireTeacher, (req, res) => {
  const title = String(req.body.title || '').trim();
  const subject = String(req.body.subject || '').trim();
  const description = String(req.body.description || '').trim();

  if (title.length < 1 || title.length > 200) {
    return res.status(400).json({ error: 'Назва класу 1–200 символів' });
  }

  const db = getDb();
  if (countTeacherClasses(db, req.user.id) >= MAX_TEACHER_CLASSES) {
    return res.status(400).json({
      error: `Досягнуто ліміт: максимум ${MAX_TEACHER_CLASSES} класи. Оформіть преміум-підписку.`,
    });
  }

  // унікальний код класу
  const classCode = generateClassCode();
  const info = getDb()
    .prepare(
      `INSERT INTO classes (teacher_id, title, subject, description, class_code)
       VALUES (?, ?, ?, ?, ?)`,
    )
    .run(req.user.id, title, subject, description, classCode);

  const row = getDb()
    .prepare('SELECT * FROM classes WHERE id = ?')
    .get(info.lastInsertRowid);

  return res.status(201).json(row);
});

// деталі класу
router.get('/classes/:id', requireAuth, requireTeacher, (req, res) => {
  const classId = Number(req.params.id);
  if (!Number.isInteger(classId) || classId < 1) {
    return res.status(400).json({ error: 'Невірний id класу' });
  }

  const cls = getClassForTeacher(classId, req.user.id);
  if (!cls) {
    return res.status(404).json({ error: 'Клас не знайдено' });
  }

  const students = getDb()
    .prepare(
      `SELECT u.id, u.name, u.email, cm.joined_at
       FROM class_members cm
       INNER JOIN users u ON u.id = cm.student_id
       WHERE cm.class_id = ? ORDER BY cm.joined_at`,
    )
    .all(classId);

  const assignments = getDb()
    .prepare(
      `SELECT a.id, a.title, a.start_date, a.deadline, a.mode, a.status,
       ws.title AS word_set_title
       FROM assignments a
       INNER JOIN word_sets ws ON ws.id = a.word_set_id
       WHERE a.class_id = ? ORDER BY a.deadline DESC`,
    )
    .all(classId);

  return res.json({ ...cls, students, assignments });
});

// редагування класу
router.put('/classes/:id', requireAuth, requireTeacher, (req, res) => {
  const classId = Number(req.params.id);
  if (!Number.isInteger(classId) || classId < 1) {
    return res.status(400).json({ error: 'Невірний id класу' });
  }

  const cls = getClassForTeacher(classId, req.user.id);
  if (!cls) {
    return res.status(404).json({ error: 'Клас не знайдено' });
  }

  const title = String(req.body.title || '').trim();
  const subject = String(req.body.subject || '').trim();
  const description = String(req.body.description || '').trim();

  if (title.length < 1 || title.length > 200) {
    return res.status(400).json({ error: 'Назва класу 1–200 символів' });
  }

  getDb()
    .prepare(
      `UPDATE classes SET title = ?, subject = ?, description = ? WHERE id = ?`,
    )
    .run(title, subject, description, classId);

  const row = getDb().prepare('SELECT * FROM classes WHERE id = ?').get(classId);
  return res.json(row);
});

// видалення класу
router.delete('/classes/:id', requireAuth, requireTeacher, (req, res) => {
  const classId = Number(req.params.id);
  if (!Number.isInteger(classId) || classId < 1) {
    return res.status(400).json({ error: 'Невірний id класу' });
  }

  const cls = getClassForTeacher(classId, req.user.id);
  if (!cls) {
    return res.status(404).json({ error: 'Клас не знайдено' });
  }

  getDb().prepare('DELETE FROM classes WHERE id = ?').run(classId);
  return res.json({ ok: true });
});

// учень приєднується до класу за кодом
router.post('/classes/join', requireAuth, requireStudent, (req, res) => {
  const classCode = String(req.body.class_code || '').trim().toUpperCase();

  if (classCode.length < 4) {
    return res.status(400).json({ error: 'Введіть код класу' });
  }

  const db = getDb();
  const cls = db.prepare('SELECT * FROM classes WHERE class_code = ?').get(classCode);
  if (!cls) {
    return res.status(404).json({ error: 'Клас з таким кодом не знайдено' });
  }

  const existing = db
    .prepare('SELECT id FROM class_members WHERE class_id = ? AND student_id = ?')
    .get(cls.id, req.user.id);
  if (existing) {
    return res.json({ ok: true, class: cls, already_member: true });
  }

  db.prepare('INSERT INTO class_members (class_id, student_id) VALUES (?, ?)').run(
    cls.id,
    req.user.id,
  );

  return res.status(201).json({ ok: true, class: cls, already_member: false });
});

// викладач додає учня до свого класу за email
router.post('/classes/:id/students', requireAuth, requireTeacher, (req, res) => {
  const classId = Number(req.params.id);
  if (!Number.isInteger(classId) || classId < 1) {
    return res.status(400).json({ error: 'Невірний id класу' });
  }

  const cls = getClassForTeacher(classId, req.user.id);
  if (!cls) {
    return res.status(404).json({ error: 'Клас не знайдено' });
  }

  const email = String(req.body.email || '').trim().toLowerCase();
  if (!email) {
    return res.status(400).json({ error: 'Вкажіть email учня' });
  }

  const db = getDb();
  const student = db
    .prepare("SELECT id, name, email FROM users WHERE email = ? AND role = 'student'")
    .get(email);
  if (!student) {
    return res.status(404).json({ error: 'Учня з таким email не знайдено' });
  }

  const existing = db
    .prepare('SELECT id FROM class_members WHERE class_id = ? AND student_id = ?')
    .get(classId, student.id);
  if (existing) {
    return res.json({ ok: true, student, already_member: true });
  }

  db.prepare('INSERT INTO class_members (class_id, student_id) VALUES (?, ?)').run(
    classId,
    student.id,
  );

  return res.status(201).json({ ok: true, student, already_member: false });
});

export default router;
