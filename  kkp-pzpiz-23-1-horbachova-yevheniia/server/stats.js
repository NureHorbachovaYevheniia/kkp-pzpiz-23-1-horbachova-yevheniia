// Статистика для учня та викладача.
import { Router } from 'express';
import { getDb } from './db.js';
import { requireAuth } from './auth.js';
import { requireStudent } from './middleware.js';

const router = Router();

// статистика учня: скільки тестів, середній бал, останні результати
router.get('/student/stats', requireAuth, requireStudent, (req, res) => {
  const db = getDb();
  const studentId = req.user.id;

  // скільки тестів здано і який середній бал
  const summary = db
    .prepare(
      `SELECT
         COUNT(*) AS tests_count,
         ROUND(AVG(score), 1) AS avg_score
       FROM test_results
       WHERE student_id = ?`,
    )
    .get(studentId);

  // останні 10 результатів тестів
  const recentTests = db
    .prepare(
      `SELECT a.title, tr.score, tr.completed_at
       FROM test_results tr
       INNER JOIN assignments a ON a.id = tr.assignment_id
       WHERE tr.student_id = ?
       ORDER BY tr.completed_at DESC
       LIMIT 10`,
    )
    .all(studentId);

  // скільки слів у кожному статусі (know, almost, repeat...)
  const progressRows = db
    .prepare(
      `SELECT status, COUNT(*) AS count
       FROM word_progress
       WHERE student_id = ?
       GROUP BY status`,
    )
    .all(studentId);

  // перетворюємо масив у простий об'єкт: { know: 5, repeat: 2 }
  const progress = {};
  for (const row of progressRows) {
    progress[row.status] = row.count;
  }

  return res.json({
    summary: {
      tests_count: summary?.tests_count || 0,
      avg_score: summary?.avg_score || 0,
      words_known: progress.know || 0,
    },
    recent_tests: recentTests,
    progress,
  });
});

export default router;
