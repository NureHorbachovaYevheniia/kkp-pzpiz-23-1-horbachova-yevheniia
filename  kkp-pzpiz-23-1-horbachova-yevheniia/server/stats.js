// Статистика для учня та викладача.
import { Router } from 'express';
import { getDb } from './db.js';
import { requireAuth } from './auth.js';
import { requireStudent, requireTeacher } from './middleware.js';
import { getClassForTeacher, computeStudentAssignmentStatus } from './helpers.js';

const router = Router();

// статистика учня
router.get('/student/stats', requireAuth, requireStudent, (req, res) => {
  const db = getDb();
  const studentId = req.user.id;

  const summary = db
    .prepare(
      `SELECT COUNT(*) AS tests_count,
              ROUND(AVG(score), 1) AS avg_score
       FROM test_results
       WHERE student_id = ?`,
    )
    .get(studentId);

  const recentTests = db
    .prepare(
      `SELECT tr.score, tr.completed_at, a.title AS assignment_title
       FROM test_results tr
       INNER JOIN assignments a ON a.id = tr.assignment_id
       WHERE tr.student_id = ?
       ORDER BY tr.completed_at DESC
       LIMIT 10`,
    )
    .all(studentId);

  const distribution = db
    .prepare(
      `SELECT
         SUM(CASE WHEN score >= 90 THEN 1 ELSE 0 END) AS excellent,
         SUM(CASE WHEN score >= 70 AND score < 90 THEN 1 ELSE 0 END) AS good,
         SUM(CASE WHEN score >= 50 AND score < 70 THEN 1 ELSE 0 END) AS fair,
         SUM(CASE WHEN score < 50 THEN 1 ELSE 0 END) AS poor
       FROM test_results
       WHERE student_id = ?`,
    )
    .get(studentId);

  return res.json({
    summary: {
      tests_count: summary?.tests_count || 0,
      avg_score: summary?.avg_score ?? null,
    },
    recent_tests: recentTests,
    test_distribution: {
      excellent: distribution?.excellent || 0,
      good: distribution?.good || 0,
      fair: distribution?.fair || 0,
      poor: distribution?.poor || 0,
    },
  });
});

// статистика класу для викладача
router.get('/teacher/classes/:id/stats', requireAuth, requireTeacher, (req, res) => {
  const db = getDb();
  const classId = Number(req.params.id);
  const teacherId = req.user.id;

  // перевіряємо, що це клас цього викладача
  const cls = getClassForTeacher(classId, teacherId);
  if (!cls) {
    return res.status(404).json({ error: 'Клас не знайдено' });
  }

  // середній бал по кожному завданню
  const assignments = db
    .prepare(
      `SELECT a.id, a.title,
         ROUND(AVG(tr.score), 1) AS avg_score,
         COUNT(tr.id) AS completed_count
       FROM assignments a
       LEFT JOIN test_results tr ON tr.assignment_id = a.id
       WHERE a.class_id = ?
       GROUP BY a.id
       ORDER BY a.id`,
    )
    .all(classId);

  // список учнів класу
  const students = db
    .prepare(
      `SELECT u.id, u.name
       FROM class_members cm
       INNER JOIN users u ON u.id = cm.student_id
       WHERE cm.class_id = ?
       ORDER BY u.name`,
    )
    .all(classId);

  // для кожного учня — результати по завданнях
  const studentsWithResults = students.map((student) => {
    const classAssignments = db
      .prepare('SELECT id, title FROM assignments WHERE class_id = ? ORDER BY id')
      .all(classId);

    const results = classAssignments.map((a) => {
      const test = db
        .prepare(
          'SELECT score, completed_at FROM test_results WHERE assignment_id = ? AND student_id = ?',
        )
        .get(a.id, student.id);

      const status = computeStudentAssignmentStatus(db, a.id, student.id);

      return {
        assignment_id: a.id,
        assignment_title: a.title,
        score: test ? test.score : null,
        completed_at: test ? test.completed_at : null,
        status,
      };
    });

    return { id: student.id, name: student.name, results };
  });

  return res.json({ assignments, students: studentsWithResults });
});

export default router;
