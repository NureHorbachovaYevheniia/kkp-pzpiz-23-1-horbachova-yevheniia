// Перевірки ролі користувача
import { requireAuth } from './auth.js';

// дозволяємо доступ тільки викладачу
export function requireTeacher(req, res, next) {
  requireAuth(req, res, () => {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Недостатньо прав доступу' });
    }
    next();
  });
}

// дозволяємо доступ тільки учню
export function requireStudent(req, res, next) {
  requireAuth(req, res, () => {
    if (req.user.role !== 'student') {
      return res.status(403).json({ error: 'Недостатньо прав доступу' });
    }
    next();
  });
}

// дозволяємо доступ тільки адміністратору
export function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Недостатньо прав доступу' });
    }
    next();
  });
}
