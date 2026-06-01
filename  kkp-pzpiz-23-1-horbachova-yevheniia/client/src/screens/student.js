import { api } from '../api.js';
import { el, escapeHtml, formatDate, statusLabel, shuffleArray, normalizeAnswer } from '../utils.js';
import { appState, resetStudyState, resetTestState } from '../state.js';
import { headerBar, bindLogout } from './auth.js';
import { t } from '../i18n.js';

export async function renderStudentDashboard(root, navigate) {
  const assignments = await api('/api/student/assignments');

  const assignList = (assignments || [])
    .map(
      (a) => `<li class="set-row">
        <span class="set-title">${escapeHtml(a.title)}</span>
        <span class="meta">${escapeHtml(a.class_title)} · ${escapeHtml(t('teacher.deadlineUntil', { date: formatDate(a.deadline) }))}</span>
        <button type="button" class="btn btn--primary btn--sm open-assign" data-id="${a.id}" data-mode="${escapeHtml(a.mode)}">${escapeHtml(t('btn.open'))}</button>
      </li>`,
    )
    .join('');

  root.replaceChildren(
    el(`
      <main class="box box--wide box--deck">
        ${headerBar(appState.user, null, `<button type="button" id="join" class="btn btn--secondary btn--sm">${escapeHtml(t('student.joinBtn'))}</button>`).outerHTML}
        <section class="deck-section">
          <h2 class="deck-heading">${escapeHtml(t('student.activeAssignments'))}</h2>
          ${assignList ? `<ul class="sets">${assignList}</ul>` : `<p class="empty-msg">${escapeHtml(t('student.noAssignments'))}</p>`}
        </section>
      </main>
    `),
  );
  bindLogout(root, navigate);
  root.querySelector('#join').addEventListener('click', () => navigate('student-join'));
  root.querySelectorAll('.open-assign').forEach((btn) => {
    btn.addEventListener('click', () => {
      appState.assignmentId = Number(btn.getAttribute('data-id'));
      navigate('assignment-detail');
    });
  });
}

export function renderStudentJoin(root, navigate) {
  root.replaceChildren(
    el(`
      <main class="box">
        ${headerBar(appState.user, null, `<button type="button" id="back" class="btn btn--ghost btn--sm">${escapeHtml(t('btn.backCabinet'))}</button>`).outerHTML}
        <h2 class="deck-heading">${escapeHtml(t('student.joinTitle'))}</h2>
        <form id="join-form" class="form">
          <label>${escapeHtml(t('label.classCode'))} <input name="class_code" placeholder="DEMO01" required maxlength="10" style="text-transform:uppercase" /></label>
          <button type="submit" class="btn btn--primary btn--block">${escapeHtml(t('btn.join'))}</button>
        </form>
        <p id="join-err" class="err"></p>
      </main>
    `),
  );
  bindLogout(root, navigate);
  root.querySelector('#back').addEventListener('click', () => navigate('student-dashboard'));
  root.querySelector('#join-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errEl = root.querySelector('#join-err');
    errEl.textContent = '';
    const fd = new FormData(e.target);
    try {
      await api('/api/classes/join', {
        method: 'POST',
        body: JSON.stringify({ class_code: String(fd.get('class_code') || '').toUpperCase() }),
      });
      navigate('student-dashboard');
    } catch (e2) {
      errEl.textContent = e2.message;
    }
  });
}

export async function renderAssignmentDetail(root, navigate) {
  const a = await api('/api/assignments/' + appState.assignmentId);
  const canStudy = a.mode === 'study' || a.mode === 'mixed';
  const canTest = a.mode === 'test' || a.mode === 'mixed';

  root.replaceChildren(
    el(`
      <main class="box box--wide">
        ${headerBar(appState.user, null, `<button type="button" id="back" class="btn btn--ghost btn--sm">${escapeHtml(t('btn.backCabinet'))}</button>`).outerHTML}
        <h2 class="deck-heading">${escapeHtml(a.title)}</h2>
        <p class="deck-hint">${escapeHtml(a.class_title)} · ${escapeHtml(a.word_set_title)} · ${escapeHtml(t('teacher.deadlineUntil', { date: formatDate(a.deadline) }))}</p>
        <p class="hint">${escapeHtml(
          t('student.assignment.status', {
            status: statusLabel(a.student_status),
            count: a.card_count || 0,
          }),
        )}</p>
        <div class="card-actions card-actions--stack">
          ${canStudy ? `<button type="button" id="go-study" class="btn btn--primary">${escapeHtml(t('student.assignment.study'))}</button>` : ''}
          ${canStudy ? `<button type="button" id="go-review" class="btn btn--secondary">${escapeHtml(t('student.assignment.review'))}</button>` : ''}
          ${canTest ? `<button type="button" id="go-test" class="btn btn--secondary">${escapeHtml(t('student.assignment.test'))}</button>` : ''}
        </div>
      </main>
    `),
  );
  bindLogout(root, navigate);
  root.querySelector('#back').addEventListener('click', () => navigate('student-dashboard'));
  root.querySelector('#go-study')?.addEventListener('click', () => {
    resetStudyState();
    appState.reviewErrorsOnly = false;
    navigate('study');
  });
  root.querySelector('#go-review')?.addEventListener('click', () => {
    resetStudyState();
    appState.reviewErrorsOnly = true;
    navigate('study');
  });
  root.querySelector('#go-test')?.addEventListener('click', () => {
    resetTestState();
    navigate('test');
  });
}

export async function renderStudy(root, navigate) {
  let cards;
  if (appState.reviewErrorsOnly) {
    const data = await api('/api/assignments/' + appState.assignmentId + '/review-errors');
    cards = data.cards || [];
  } else {
    const data = await api('/api/assignments/' + appState.assignmentId + '/study');
    cards = data.cards || [];
  }

  if (!appState.studyCards) {
    appState.studyCards = cards;
    appState.studyQueue = shuffleArray(cards.map((_, i) => i));
    appState.studyIndex = 0;
    appState.studyCorrect = 0;
    appState.studyChecked = false;
    appState.studyTyped = '';
    appState.studyLastCorrect = false;
  }

  const queue = appState.studyQueue;
  const total = queue.length;
  const idx = queue[appState.studyIndex];
  const card = appState.studyCards[idx];
  const done = !card || total === 0;
  const heading = appState.reviewErrorsOnly ? t('student.study.reviewTitle') : t('student.study.title');

  let body;
  if (done) {
    if (total === 0) {
      body = `<p class="study-done-msg">${escapeHtml(t('student.study.noWords'))}</p>
        <button type="button" id="back-assign" class="btn btn--secondary">${escapeHtml(t('student.study.back'))}</button>`;
    } else {
      const allRight = appState.studyCorrect === total;
      body = `<p class="study-done-msg">${escapeHtml(allRight ? t('student.study.doneAll') : t('student.study.donePartial'))}</p>
        <p class="study-done-counter">${escapeHtml(t('student.study.correctLabel'))}: <strong>${appState.studyCorrect}</strong> / <strong>${total}</strong></p>
        ${allRight ? '' : `<p class="study-hint study-hint--done">${escapeHtml(t('student.study.reviewHint'))}</p>`}
        <button type="button" id="back-assign" class="btn btn--primary">${escapeHtml(t('student.study.back'))}</button>`;
    }
  } else if (appState.studyChecked) {
    const correct = appState.studyLastCorrect;
    const last = appState.studyIndex + 1 >= total;
    body = `
      <p class="counter">${appState.studyIndex + 1} / ${total}</p>
      ${card.image_url ? `<img class="card-image" src="${escapeHtml(card.image_url)}" alt="${escapeHtml(card.word)}" />` : ''}
      <p class="card-tr">${escapeHtml(card.translation)}</p>
      <p class="feedback ${correct ? 'feedback--ok' : 'feedback--bad'}">
        ${escapeHtml(correct ? t('student.study.correct') : t('student.study.incorrect'))}
      </p>
      <p class="feedback-detail">${escapeHtml(t('student.study.yourAnswerLabel'))}: <strong>${escapeHtml(appState.studyTyped || '—')}</strong></p>
      ${correct ? '' : `<p class="feedback-detail">${escapeHtml(t('student.study.correctAnswerLabel'))}: <strong>${escapeHtml(card.word)}</strong></p>`}
      <div class="card-actions card-actions--stack">
        <button type="button" id="next" class="btn btn--primary">${escapeHtml(last ? t('btn.finish') : t('btn.next'))}</button>
      </div>`;
  } else {
    body = `
      <p class="counter">${appState.studyIndex + 1} / ${total}</p>
      ${card.image_url ? `<img class="card-image" src="${escapeHtml(card.image_url)}" alt="${escapeHtml(card.word)}" />` : ''}
      <p class="card-tr">${escapeHtml(card.translation)}</p>
      <p class="study-hint">${escapeHtml(t('student.study.prompt'))}</p>
      <form id="answer-form" class="study-answer">
        <input id="answer-input" type="text" class="study-input" autocomplete="off" autocapitalize="off"
          spellcheck="false" placeholder="${escapeHtml(t('student.study.answerPlaceholder'))}" />
        <button type="submit" class="btn btn--primary btn--block">${escapeHtml(t('btn.check'))}</button>
      </form>`;
  }

  root.replaceChildren(
    el(`
      <main class="box box--wide">
        ${headerBar(appState.user, null, `<button type="button" id="back" class="btn btn--ghost btn--sm">${escapeHtml(t('btn.backAssignment'))}</button>`).outerHTML}
        <h2 class="deck-heading">${escapeHtml(heading)}</h2>
        ${body}
      </main>
    `),
  );
  bindLogout(root, navigate);
  root.querySelector('#back')?.addEventListener('click', () => {
    resetStudyState();
    navigate('assignment-detail');
  });
  root.querySelector('#back-assign')?.addEventListener('click', () => {
    resetStudyState();
    navigate('assignment-detail');
  });

  const input = root.querySelector('#answer-input');
  input?.focus();

  root.querySelector('#answer-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const typed = input ? input.value : '';
    const isCorrect = normalizeAnswer(typed) === normalizeAnswer(card.word);
    appState.studyTyped = typed.trim();
    appState.studyLastCorrect = isCorrect;
    appState.studyChecked = true;
    if (isCorrect) appState.studyCorrect += 1;
    try {
      await api('/api/assignments/' + appState.assignmentId + '/progress', {
        method: 'POST',
        body: JSON.stringify({ word_card_id: card.id, status: isCorrect ? 'know' : 'repeat' }),
      });
    } catch {
      /* прогрес не критичний для проходження */
    }
    renderStudy(root, navigate);
  });

  root.querySelector('#next')?.addEventListener('click', () => {
    appState.studyIndex += 1;
    appState.studyChecked = false;
    appState.studyTyped = '';
    appState.studyLastCorrect = false;
    renderStudy(root, navigate);
  });
}

export async function renderTest(root, navigate) {
  if (!appState.testQuestions) {
    const data = await api('/api/assignments/' + appState.assignmentId + '/test');
    appState.testQuestions = data.questions || [];
    appState.testAnswers = [];
    appState.testIndex = 0;
  }

  const questions = appState.testQuestions;
  const i = appState.testIndex;
  const q = questions[i];

  if (!q) {
    const answers = appState.testAnswers;
    try {
      const result = await api('/api/assignments/' + appState.assignmentId + '/test/submit', {
        method: 'POST',
        body: JSON.stringify({ answers }),
      });
      resetTestState();
      appState.testResults = result;
      navigate('test-results');
    } catch (e) {
      root.replaceChildren(el(`<main class="box"><p class="err">${escapeHtml(e.message)}</p></main>`));
    }
    return;
  }

  const opts = (q.options || [])
    .map(
      (o, oi) =>
        `<button type="button" class="btn btn--secondary btn--block test-opt" data-idx="${oi}">${escapeHtml(o)}</button>`,
    )
    .join('');

  root.replaceChildren(
    el(`
      <main class="box box--wide">
        ${headerBar(appState.user, null, `<button type="button" id="back" class="btn btn--ghost btn--sm">${escapeHtml(t('btn.cancel'))}</button>`).outerHTML}
        <p class="counter">${escapeHtml(t('student.test.question', { current: i + 1, total: questions.length }))}</p>
        <p class="card-term">${escapeHtml(q.word)}</p>
        <p class="hint">${escapeHtml(t('student.test.pickTranslation'))}</p>
        <div class="card-actions card-actions--stack">${opts}</div>
      </main>
    `),
  );
  bindLogout(root, navigate);
  root.querySelector('#back')?.addEventListener('click', () => {
    resetTestState();
    navigate('assignment-detail');
  });
  root.querySelectorAll('.test-opt').forEach((btn) => {
    btn.addEventListener('click', () => {
      const oi = Number(btn.getAttribute('data-idx'));
      appState.testAnswers.push({
        word_card_id: q.word_card_id,
        selected_translation: q.options[oi],
      });
      appState.testIndex += 1;
      renderTest(root, navigate);
    });
  });
}

export function renderTestResults(root, navigate) {
  const r = appState.testResults;
  if (!r) {
    navigate('student-dashboard');
    return;
  }
  const wrong = (r.wrong_words || [])
    .map(
      (w) =>
        `<li>${escapeHtml(
          t('student.testResults.wrongLine', {
            word: w.word,
            translation: w.correct_translation,
          }),
        )}</li>`,
    )
    .join('');

  root.replaceChildren(
    el(`
      <main class="box box--wide">
        ${headerBar(appState.user, null, `<button type="button" id="back" class="btn btn--ghost btn--sm">${escapeHtml(t('btn.backCabinet'))}</button>`).outerHTML}
        <h2 class="deck-heading">${escapeHtml(t('student.testResults.title'))}</h2>
        <p class="study-done-msg">${escapeHtml(t('student.testResults.scoreLabel'))}: <strong>${r.score}%</strong> (${r.correct_answers}/${r.total})</p>
        ${
          wrong
            ? `<section class="deck-section"><h3 class="deck-heading">${escapeHtml(t('student.testResults.reviewWords'))}</h3><ul class="sets">${wrong}</ul></section>`
            : `<p class="hint">${escapeHtml(t('student.testResults.allCorrect'))}</p>`
        }
        <button type="button" id="done" class="btn btn--primary">${escapeHtml(t('btn.done'))}</button>
      </main>
    `),
  );
  bindLogout(root, navigate);
  root.querySelector('#back').addEventListener('click', () => navigate('student-dashboard'));
  root.querySelector('#done').addEventListener('click', () => {
    appState.testResults = null;
    navigate('student-dashboard');
  });
}
