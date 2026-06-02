// Маленькі допоміжні функції, які потрібні в кількох місцях.
import { getDb } from './db.js';

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

// унікальний код класу
export function generateClassCode() {
  const db = getDb();
  // пробуємо кілька разів, поки не вийде код, якого ще немає
  for (let attempt = 0; attempt < 20; attempt++) {
    let code = '';
    for (let i = 0; i < 6; i++) {
      const r = Math.floor(Math.random() * CODE_CHARS.length);
      code += CODE_CHARS[r];
    }
    const exists = db.prepare('SELECT id FROM classes WHERE class_code = ?').get(code);
    if (!exists) return code;
  }
  throw new Error('Не вдалося згенерувати код класу');
}

// знаходимо клас, який належить цьому викладачу
export function getClassForTeacher(classId, teacherId) {
  return getDb()
    .prepare('SELECT * FROM classes WHERE id = ? AND teacher_id = ?')
    .get(classId, teacherId);
}

// перевіряємо, чи учень є в класі
export function isStudentInClass(classId, studentId) {
  const row = getDb()
    .prepare('SELECT id FROM class_members WHERE class_id = ? AND student_id = ?')
    .get(classId, studentId);
  return !!row;
}

// беремо завдання разом з даними про клас і набір слів
export function getAssignmentById(assignmentId) {
  return getDb()
    .prepare(
      `SELECT a.*, c.teacher_id, c.title AS class_title,
       ws.title AS word_set_title, ws.language AS word_set_language
       FROM assignments a
       INNER JOIN classes c ON c.id = a.class_id
       INNER JOIN word_sets ws ON ws.id = a.word_set_id
       WHERE a.id = ?`,
    )
    .get(assignmentId);
}

// перевіряємо, чи має користувач доступ до завдання
export function canAccessAssignment(user, assignment) {
  if (!assignment) return false;
  if (user.role === 'teacher') return assignment.teacher_id === user.id;
  if (user.role === 'student') return isStudentInClass(assignment.class_id, user.id);
  return false;
}

// рахуємо статус завдання для учня
export function computeStudentAssignmentStatus(db, assignmentId, studentId) {
  // якщо є результат тесту — завдання завершене
  const test = db
    .prepare(
      'SELECT id FROM test_results WHERE assignment_id = ? AND student_id = ? LIMIT 1',
    )
    .get(assignmentId, studentId);
  if (test) return 'completed';

  // якщо учень уже працював зі словами — у процесі
  const progress = db
    .prepare(
      `SELECT COUNT(*) AS n FROM word_progress
       WHERE assignment_id = ? AND student_id = ? AND status != 'not_started'`,
    )
    .get(assignmentId, studentId);

  return (progress?.n || 0) > 0 ? 'in_progress' : 'not_started';
}

// перемішуємо масив
export function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
