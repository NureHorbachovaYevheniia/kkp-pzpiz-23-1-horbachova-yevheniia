import { api } from '../api.js';
import {
  el,
  escapeHtml,
  formatDate,
  statusLabel,
  shuffleArray,
  normalizeAnswer,
  speakWord,
  speechSupported,
} from '../utils.js';
import { appState, resetStudyState, resetTestState, resetFlashState } from '../state.js';
import { headerBar, bindLogout } from './auth.js';
import { t } from '../i18n.js';

const LANGUAGES = [
  'English',
  'Deutsch',
  'Français',
  'Español',
  'Italiano',
  'Polski',
  'Українська',
];

// базовий шлях для навчання/тесту: завдання вчителя або власний набір учня
function studyBase() {
  return appState.studySource === 'myset'
    ? '/api/my-sets/' + appState.wordSetId
    : '/api/assignments/' + appState.assignmentId;
}

// куди повертатись з навчання/тесту
function studyBackScreen() {
  return appState.studySource === 'myset' ? 'student-set' : 'assignment-detail';
}

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
        ${headerBar(appState.user, null, `<button type="button" id="my-sets" class="btn btn--primary btn--sm">${escapeHtml(t('student.mySets'))}</button><button type="button" id="join" class="btn btn--secondary btn--sm">${escapeHtml(t('student.joinBtn'))}</button>`).outerHTML}
        <section class="deck-section">
          <h2 class="deck-heading">${escapeHtml(t('student.activeAssignments'))}</h2>
          ${assignList ? `<ul class="sets">${assignList}</ul>` : `<p class="empty-msg">${escapeHtml(t('student.noAssignments'))}</p>`}
        </section>
      </main>
    `),
  );
  bindLogout(root, navigate);
  root.querySelector('#my-sets').addEventListener('click', () => navigate('student-sets'));
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

export async function renderStudentSets(root, navigate) {
  const sets = await api('/api/my-sets');
  const list = (sets || [])
    .map(
      (s) => `<li class="set-row">
        <span class="set-title">${escapeHtml(s.title)}</span>
        <span class="meta">${escapeHtml(
          t('teacher.setMeta', {
            language: s.language || '—',
            count: s.card_count || 0,
          }),
        )}</span>
        <button type="button" class="btn btn--primary btn--sm open-set" data-id="${s.id}">${escapeHtml(t('btn.open'))}</button>
      </li>`,
    )
    .join('');

  root.replaceChildren(
    el(`
      <main class="box box--wide box--deck">
        ${headerBar(appState.user, null, `<button type="button" id="back" class="btn btn--ghost btn--sm">${escapeHtml(t('btn.backCabinet'))}</button><button type="button" id="toggle-add-set" class="btn btn--primary btn--sm">${escapeHtml(t('student.addSet'))}</button>`).outerHTML}
        <section class="deck-section">
          <h2 class="deck-heading">${escapeHtml(t('student.mySetsTitle'))}</h2>
          <section class="add-word-box" id="add-set-box" hidden>
            <p class="add-word-title">${escapeHtml(t('student.newSet'))}</p>
            <form id="new-set-form" class="form">
              <input name="title" placeholder="${escapeHtml(t('teacher.placeholder.setTitle'))}" required maxlength="200" />
              <select name="language" required>
                <option value="" disabled selected>${escapeHtml(t('teacher.placeholder.selectLanguage'))}</option>
                ${LANGUAGES.map((lng) => `<option value="${escapeHtml(lng)}">${escapeHtml(lng)}</option>`).join('')}
              </select>
              <button type="submit" class="btn btn--secondary btn--sm">${escapeHtml(t('btn.create'))}</button>
            </form>
            <p id="set-err" class="err"></p>
          </section>
          ${list ? `<ul class="sets">${list}</ul>` : `<p class="empty-msg">${escapeHtml(t('student.noSets'))}</p>`}
        </section>
      </main>
    `),
  );
  bindLogout(root, navigate);
  root.querySelector('#back').addEventListener('click', () => navigate('student-dashboard'));
  root.querySelector('#toggle-add-set').addEventListener('click', () => {
    const box = root.querySelector('#add-set-box');
    box.hidden = !box.hidden;
    if (!box.hidden) box.querySelector('[name=title]').focus();
  });
  root.querySelector('#new-set-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errEl = root.querySelector('#set-err');
    errEl.textContent = '';
    const fd = new FormData(e.target);
    const title = String(fd.get('title') || '').trim();
    const language = String(fd.get('language') || '').trim();
    if (title.length < 1 || title.length > 200) {
      errEl.textContent = t('teacher.err.setTitle');
      return;
    }
    if (!language) {
      errEl.textContent = t('teacher.err.setLanguage');
      return;
    }
    try {
      const row = await api('/api/my-sets', {
        method: 'POST',
        body: JSON.stringify({ title, language }),
      });
      appState.wordSetId = row.id;
      navigate('student-set');
    } catch (e2) {
      errEl.textContent = e2.message;
    }
  });
  root.querySelectorAll('.open-set').forEach((btn) => {
    btn.addEventListener('click', () => {
      appState.wordSetId = Number(btn.getAttribute('data-id'));
      navigate('student-set');
    });
  });
}

export async function renderStudentSet(root, navigate) {
  const [set, cards] = await Promise.all([
    api('/api/my-sets/' + appState.wordSetId),
    api('/api/my-sets/' + appState.wordSetId + '/cards'),
  ]);

  const cardList = (cards || [])
    .map(
      (c) => `<li class="set-row">
        ${
          c.image_url
            ? `<img class="card-thumb" src="${escapeHtml(c.image_url)}" alt="${escapeHtml(c.word)}" />`
            : '<span class="card-thumb card-thumb--empty">🖼</span>'
        }
        <span class="set-title">${escapeHtml(c.word)}</span>
        <span class="meta">${escapeHtml(c.translation)}</span>
        <button type="button" class="btn btn--ghost btn--sm del-card" data-id="${c.id}">×</button>
      </li>`,
    )
    .join('');

  const hasCards = (cards || []).length > 0;

  root.replaceChildren(
    el(`
      <main class="box box--wide box--deck">
        ${headerBar(appState.user, null, `<button type="button" id="back" class="btn btn--ghost btn--sm">${escapeHtml(t('btn.backSets'))}</button><button type="button" id="toggle-add" class="btn btn--primary btn--sm">${escapeHtml(t('teacher.addWord'))}</button>`).outerHTML}
        <div class="deck-section-head">
          <h2 class="deck-heading">${escapeHtml(set.title)}</h2>
          <button type="button" id="delete-set" class="btn btn--ghost btn--sm">${escapeHtml(t('student.setDelete'))}</button>
        </div>
        <p class="deck-hint">${escapeHtml(set.language || '—')}</p>
        ${
          hasCards
            ? `<div class="card-actions card-actions--stack">
                <button type="button" id="go-study" class="btn btn--primary">${escapeHtml(t('student.assignment.study'))}</button>
                <button type="button" id="go-review" class="btn btn--secondary">${escapeHtml(t('student.assignment.review'))}</button>
                <button type="button" id="go-test" class="btn btn--secondary">${escapeHtml(t('student.assignment.test'))}</button>
              </div>`
            : ''
        }
        <section class="add-word-box" id="add-word-box" hidden>
          <p class="add-word-title">${escapeHtml(t('teacher.addCard'))}</p>
          <form id="add-card-form" class="form-row">
            <input name="word" placeholder="${escapeHtml(t('teacher.placeholder.word'))}" required />
            <input name="translation" placeholder="${escapeHtml(t('teacher.placeholder.translation'))}" required />
            <input name="image_url" type="url" placeholder="${escapeHtml(t('teacher.placeholder.imageUrl'))}" />
            <button type="submit" class="btn btn--secondary btn--sm">${escapeHtml(t('teacher.btn.add'))}</button>
          </form>
          <p id="card-err" class="err"></p>
        </section>
        ${cardList ? `<ul class="sets">${cardList}</ul>` : `<p class="empty-msg">${escapeHtml(t('teacher.noCards'))}</p>`}
      </main>
    `),
  );
  bindLogout(root, navigate);
  root.querySelector('#back').addEventListener('click', () => navigate('student-sets'));
  root.querySelector('#toggle-add').addEventListener('click', () => {
    const box = root.querySelector('#add-word-box');
    box.hidden = !box.hidden;
    if (!box.hidden) box.querySelector('[name=word]').focus();
  });
  root.querySelector('#delete-set').addEventListener('click', async () => {
    if (!window.confirm(t('student.setDeleteConfirm'))) return;
    try {
      await api('/api/my-sets/' + appState.wordSetId, { method: 'DELETE' });
      navigate('student-sets');
    } catch (e2) {
      window.alert(e2.message);
    }
  });
  root.querySelector('#add-card-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errEl = root.querySelector('#card-err');
    errEl.textContent = '';
    const fd = new FormData(e.target);
    try {
      await api('/api/my-sets/' + appState.wordSetId + '/cards', {
        method: 'POST',
        body: JSON.stringify({
          word: String(fd.get('word') || ''),
          translation: String(fd.get('translation') || ''),
          image_url: String(fd.get('image_url') || ''),
        }),
      });
      e.target.reset();
      await renderStudentSet(root, navigate);
    } catch (e2) {
      errEl.textContent = e2.message;
    }
  });
  root.querySelectorAll('.del-card').forEach((btn) => {
    btn.addEventListener('click', async () => {
      if (!window.confirm(t('teacher.deleteCardConfirm'))) return;
      await api('/api/my-cards/' + btn.getAttribute('data-id'), { method: 'DELETE' });
      await renderStudentSet(root, navigate);
    });
  });
  root.querySelector('#go-study')?.addEventListener('click', () => {
    resetStudyState();
    appState.studySource = 'myset';
    appState.reviewErrorsOnly = false;
    navigate('study');
  });
  root.querySelector('#go-review')?.addEventListener('click', () => {
    resetStudyState();
    appState.studySource = 'myset';
    appState.reviewErrorsOnly = true;
    navigate('study');
  });
  root.querySelector('#go-test')?.addEventListener('click', () => {
    resetTestState();
    appState.studySource = 'myset';
    navigate('test');
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
    appState.studySource = 'assignment';
    appState.reviewErrorsOnly = false;
    navigate('study');
  });
  root.querySelector('#go-review')?.addEventListener('click', () => {
    resetStudyState();
    appState.studySource = 'assignment';
    appState.reviewErrorsOnly = true;
    navigate('study');
  });
  root.querySelector('#go-test')?.addEventListener('click', () => {
    resetTestState();
    appState.studySource = 'assignment';
    navigate('test');
  });
}

export async function renderStudy(root, navigate) {
  let cards;
  if (appState.reviewErrorsOnly) {
    const data = await api(studyBase() + '/review-errors');
    cards = data.cards || [];
    appState.studyLanguage = data.language || (data.set && data.set.language) || '';
  } else {
    const data = await api(studyBase() + '/study');
    cards = data.cards || [];
    appState.studyLanguage = data.language || (data.set && data.set.language) || '';
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
      ${speechSupported() ? `<p class="study-listen-row"><button type="button" id="speak-word" class="btn btn--ghost btn--sm">🔊 ${escapeHtml(t('student.study.listen'))}</button></p>` : ''}
      <div class="card-actions card-actions--stack">
        <button type="button" id="next" class="btn btn--primary">${escapeHtml(last ? t('btn.finish') : t('btn.next'))}</button>
      </div>`;
  } else {
    body = `
      <p class="counter">${appState.studyIndex + 1} / ${total}</p>
      ${card.image_url ? `<img class="card-image" src="${escapeHtml(card.image_url)}" alt="${escapeHtml(card.word)}" />` : ''}
      <p class="card-tr">${escapeHtml(card.translation)}</p>
      ${speechSupported() ? `<p class="study-listen-row"><button type="button" id="speak-word" class="btn btn--ghost btn--sm">🔊 ${escapeHtml(t('student.study.listen'))}</button></p>` : ''}
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
    navigate(studyBackScreen());
  });
  root.querySelector('#back-assign')?.addEventListener('click', () => {
    resetStudyState();
    navigate(studyBackScreen());
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
      await api(studyBase() + '/progress', {
        method: 'POST',
        body: JSON.stringify({ word_card_id: card.id, status: isCorrect ? 'know' : 'repeat' }),
      });
    } catch {
      /* прогрес не критичний для проходження */
    }
    renderStudy(root, navigate);
  });

  root.querySelector('#speak-word')?.addEventListener('click', () => {
    if (card) speakWord(card.word, appState.studyLanguage);
  });

  root.querySelector('#next')?.addEventListener('click', () => {
    appState.studyIndex += 1;
    appState.studyChecked = false;
    appState.studyTyped = '';
    appState.studyLastCorrect = false;
    renderStudy(root, navigate);
  });
}

export async function renderFlashcards(root, navigate) {
  // картки беремо з того самого ендпоінта, що й режим навчання
  if (!appState.flashCards) {
    const data = await api(studyBase() + '/study');
    const cards = data.cards || [];
    appState.flashCards = cards;
    appState.flashQueue = shuffleArray(cards.map((_, i) => i));
    appState.flashLanguage = data.language || (data.set && data.set.language) || '';
    appState.flashIndex = 0;
    appState.flashFlipped = false;
  }

  const queue = appState.flashQueue;
  const total = queue.length;
  const idx = queue[appState.flashIndex];
  const card = appState.flashCards[idx];
  const done = !card || total === 0;

  let body;
  if (done) {
    const msg = total === 0 ? t('student.study.noWords') : t('student.flash.done');
    body = `<p class="study-done-msg">${escapeHtml(msg)}</p>
      <button type="button" id="back-flash" class="btn btn--primary">${escapeHtml(t('student.study.back'))}</button>`;
  } else if (appState.flashFlipped) {
    // зворотна сторона: переклад + три кнопки
    body = `
      <p class="counter">${appState.flashIndex + 1} / ${total}</p>
      <div class="flashcard flashcard--flipped" id="flashcard">
        <p class="card-tr">${escapeHtml(card.translation)}</p>
      </div>
      <div class="card-actions card-actions--stack">
        <button type="button" class="btn btn--primary flash-answer" data-status="know">${escapeHtml(t('student.flash.know'))}</button>
        <button type="button" class="btn btn--secondary flash-answer" data-status="almost">${escapeHtml(t('student.flash.almost'))}</button>
        <button type="button" class="btn btn--ghost flash-answer" data-status="repeat">${escapeHtml(t('student.flash.dontKnow'))}</button>
      </div>`;
  } else {
    // лицьова сторона: слово + фото + звук + приклад
    body = `
      <p class="counter">${appState.flashIndex + 1} / ${total}</p>
      <div class="flashcard" id="flashcard">
        ${card.image_url ? `<img class="card-image" src="${escapeHtml(card.image_url)}" alt="${escapeHtml(card.word)}" />` : ''}
        <p class="card-term">${escapeHtml(card.word)}</p>
        ${card.example ? `<p class="card-example">${escapeHtml(card.example)}</p>` : ''}
        ${speechSupported() ? `<button type="button" id="speak-word" class="btn btn--ghost btn--sm">🔊 ${escapeHtml(t('student.study.listen'))}</button>` : ''}
      </div>
      <p class="study-hint">${escapeHtml(t('student.flash.tapToFlip'))}</p>`;
  }

  root.replaceChildren(
    el(`
      <main class="box box--wide">
        ${headerBar(appState.user, null, `<button type="button" id="back" class="btn btn--ghost btn--sm">${escapeHtml(t('btn.backAssignment'))}</button>`).outerHTML}
        <h2 class="deck-heading">${escapeHtml(t('student.flash.title'))}</h2>
        ${body}
      </main>
    `),
  );
  bindLogout(root, navigate);
  root.querySelector('#back')?.addEventListener('click', () => {
    resetFlashState();
    navigate(studyBackScreen());
  });
  root.querySelector('#back-flash')?.addEventListener('click', () => {
    resetFlashState();
    navigate(studyBackScreen());
  });

  // клік по картці перевертає її
  root.querySelector('#flashcard')?.addEventListener('click', (e) => {
    if (e.target.closest('#speak-word')) return;
    if (!appState.flashFlipped) {
      appState.flashFlipped = true;
      renderFlashcards(root, navigate);
    }
  });

  root.querySelector('#speak-word')?.addEventListener('click', () => {
    if (card) speakWord(card.word, appState.flashLanguage);
  });

  root.querySelectorAll('.flash-answer').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const status = btn.getAttribute('data-status');
      try {
        await api(studyBase() + '/progress', {
          method: 'POST',
          body: JSON.stringify({ word_card_id: card.id, status }),
        });
      } catch {
      }
      appState.flashIndex += 1;
      appState.flashFlipped = false;
      renderFlashcards(root, navigate);
    });
  });
}

export async function renderTest(root, navigate) {
  if (!appState.testQuestions) {
    const data = await api(studyBase() + '/test');
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
      const result = await api(studyBase() + '/test/submit', {
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
    navigate(studyBackScreen());
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
  const backScreen = appState.studySource === 'myset' ? 'student-set' : 'student-dashboard';
  bindLogout(root, navigate);
  root.querySelector('#back').addEventListener('click', () => navigate(backScreen));
  root.querySelector('#done').addEventListener('click', () => {
    appState.testResults = null;
    navigate(backScreen);
  });
}
