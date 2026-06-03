export const MAX_TEACHER_CLASSES = 3;
export const MAX_TEACHER_WORD_SETS = 10;
export const MAX_STUDENT_SETS = 10;

export function countTeacherClasses(db, teacherId) {
  return db
    .prepare('SELECT COUNT(*) AS n FROM classes WHERE teacher_id = ?')
    .get(teacherId).n;
}

export function countTeacherWordSets(db, teacherId) {
  return db
    .prepare('SELECT COUNT(*) AS n FROM word_sets WHERE teacher_id = ?')
    .get(teacherId).n;
}

export function countStudentSets(db, studentId) {
  return db
    .prepare('SELECT COUNT(*) AS n FROM student_word_sets WHERE student_id = ?')
    .get(studentId).n;
}
