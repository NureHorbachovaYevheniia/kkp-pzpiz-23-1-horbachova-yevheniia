// Тест: учень обирає правильний переклад з 4 варіантів.
import { Router } from 'express';
import { getDb } from './db.js';
import { requireAuth } from './auth.js';
import { requireStudent } from './middleware.js';
import { getAssignmentById, canAccessAssignment, shuffleArray } from './helpers.js';

const router = Router();

function deadlineValue(deadline) {
  return String(deadline || '').includes('T') ? deadline : deadline + 'T23:59';
}

// прості правила доступу до тесту
function testError(assignment, studentId) {
  if (assignment.mode !== 'test') {
    return 'Тест ще не активований викладачем';
  }
  if (assignment.status !== 'active') {
    return 'Тест зараз недоступний';
  }

  const now = new Date().toISOString().slice(0, 16);
  if (deadlineValue(assignment.deadline) < now) {
    return 'Час проходження тесту завершено';
  }

  const passed = getDb()
    .prepare('SELECT id FROM test_results WHERE assignment_id = ? AND student_id = ? LIMIT 1')
    .get(assignment.id, studentId);
  if (passed) {
    return 'Тест можна пройти лише один раз';
  }

  return '';
}

// будуємо одне питання: правильний переклад + 3 неправильні варіанти
function buildQuestion(card, allCards) {
  const distractors = shuffleArray(
    allCards.filter((c) => c.id !== card.id).map((c) => c.translation),
  ).slice(0, 3);

  while (distractors.length < 3) {
    distractors.push(`— ${distractors.length + 1}`);
  }

  const options = shuffleArray([card.translation, ...distractors.slice(0, 3)]);
  return {
    word_card_id: card.id,
    word: card.word,
    image_url: card.image_url,
    options,
  };
}

// створюємо тест зі списком питань
router.get('/assignments/:id/test', requireAuth, requireStudent, (req, res) => {
  const assignmentId = Number(req.params.id);
  if (!Number.isInteger(assignmentId) || assignmentId < 1) {
    return res.status(400).json({ error: 'Невірний id завдання' });
  }

  const assignment = getAssignmentById(assignmentId);
  if (!canAccessAssignment(req.user, assignment)) {
    return res.status(404).json({ error: 'Завдання не знайдено' });
  }

  const db = getDb();
  const err = testError(assignment, req.user.id);
  if (err) {
    return res.status(403).json({ error: err });
  }

  const cards = db
    .prepare('SELECT * FROM word_cards WHERE word_set_id = ? ORDER BY id')
    .all(assignment.word_set_id);

  if (cards.length < 1) {
    return res.status(400).json({ error: 'У наборі немає карток для тесту' });
  }

  const questions = shuffleArray(cards).map((card) => buildQuestion(card, cards));

  return res.json({
    assignment_id: assignmentId,
    title: assignment.title,
    questions,
  });
});

// приймаємо відповіді учня, рахуємо бал і зберігаємо результат
router.post('/assignments/:id/test/submit', requireAuth, requireStudent, (req, res) => {
  const assignmentId = Number(req.params.id);
  if (!Number.isInteger(assignmentId) || assignmentId < 1) {
    return res.status(400).json({ error: 'Невірний id завдання' });
  }

  const assignment = getAssignmentById(assignmentId);
  if (!canAccessAssignment(req.user, assignment)) {
    return res.status(404).json({ error: 'Завдання не знайдено' });
  }

  const err = testError(assignment, req.user.id);
  if (err) {
    return res.status(403).json({ error: err });
  }

  const answers = Array.isArray(req.body.answers) ? req.body.answers : [];
  if (answers.length < 1) {
    return res.status(400).json({ error: 'Надішліть answers[]' });
  }

  const db = getDb();
  const cards = db
    .prepare('SELECT id, word, translation FROM word_cards WHERE word_set_id = ?')
    .all(assignment.word_set_id);

  if (cards.length < 1) {
    return res.status(400).json({ error: 'У наборі немає карток для тесту' });
  }

  const answersByCard = new Map();
  for (const ans of answers) {
    const cardId = Number(ans.word_card_id);
    if (!Number.isInteger(cardId) || cardId < 1) continue;
    answersByCard.set(cardId, String(ans.selected_translation || '').trim());
  }

  let correct = 0;
  const wrongWords = [];

  const upsertProgress = db.prepare(
    `INSERT INTO word_progress (student_id, word_card_id, assignment_id, status, correct_count, wrong_count, last_reviewed_at)
     VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
     ON CONFLICT(student_id, word_card_id, assignment_id) DO UPDATE SET
       status = excluded.status,
       correct_count = word_progress.correct_count + excluded.correct_count,
       wrong_count = word_progress.wrong_count + excluded.wrong_count,
       last_reviewed_at = datetime('now')`,
  );

  const tx = db.transaction(() => {
    for (const card of cards) {
      const selected = answersByCard.get(card.id);
      const isCorrect = selected !== undefined && selected === card.translation;

      if (isCorrect) {
        correct += 1;
        upsertProgress.run(req.user.id, card.id, assignmentId, 'know', 1, 0);
      } else {
        wrongWords.push({
          word_card_id: card.id,
          word: card.word,
          correct_translation: card.translation,
          selected_translation: selected ?? '',
        });
        upsertProgress.run(req.user.id, card.id, assignmentId, 'repeat', 0, 1);
      }
    }

    const total = cards.length;
    const wrong = total - correct;
    const score = total > 0 ? Math.round((correct / total) * 100) : 0;

    db.prepare(
      `INSERT INTO test_results (assignment_id, student_id, score, total_words, correct_answers, wrong_answers)
       VALUES (?, ?, ?, ?, ?, ?)`,
    ).run(assignmentId, req.user.id, score, total, correct, wrong);

    return { score, total, correct, wrong, wrongWords };
  });

  const result = tx();
  return res.json({
    ok: true,
    score: result.score,
    total: result.total,
    correct: result.correct,
    wrong: result.wrong,
    wrong_words: result.wrongWords,
  });
});

export default router;
