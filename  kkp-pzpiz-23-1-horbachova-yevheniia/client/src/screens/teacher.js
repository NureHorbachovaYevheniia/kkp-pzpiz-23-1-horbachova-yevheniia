import { api } from '../api.js';
import { el, escapeHtml, formatDate, deadlineAccentClass, statusLabel } from '../utils.js';
import { appState } from '../state.js';
import { headerBar, bindLogout } from './auth.js';
import { t } from '../i18n.js';
import { renderBarChart } from '../charts.js';
import {
  MAX_TEACHER_CLASSES,
  MAX_TEACHER_WORD_SETS,
  isAtLimit,
  limitBadgeHtml,
} from '../limits.js';

const LANGUAGES = [
  'English',
  'Deutsch',
  'Français',
  'Español',
  'Italiano',
  'Polski',
  'Українська',
];

function deadlineInputValue(deadline) {
  return String(deadline || '').includes('T') ? deadline : deadline + 'T23:59';
}

function testStartInputValue() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

function testEndInputValue() {
  const d = new Date(Date.now() + 7 * 86400000);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

function teacherTestDatesMeta(a) {
  if (a.mode !== 'test' || !a.test_start) return '';
  return `<span class="${deadlineAccentClass(a.test_start)}">${escapeHtml(t('teacher.testStartsAt', { date: formatDate(a.test_start) }))}</span> · <span class="${deadlineAccentClass(a.deadline)}">${escapeHtml(t('teacher.deadlineUntil', { date: formatDate(a.deadline) }))}</span>`;
}

export async function renderTeacherDashboard(root, navigate) {
  const [dash, classes, sets] = await Promise.all([
    api('/api/teacher/dashboard'),
    api('/api/classes'),
    api('/api/word-sets'),
  ]);

  const classCount = (classes || []).length;
  const setCount = (sets || []).length;
  const classesFull = isAtLimit(classCount, MAX_TEACHER_CLASSES);
  const setsFull = isAtLimit(setCount, MAX_TEACHER_WORD_SETS);

  const classList = (classes || [])
    .map(
      (c) => `<li class="set-row">
        <span class="set-title">${escapeHtml(c.title)}</span>
        <span class="meta">${escapeHtml(
          t('teacher.classMeta', {
            subject: c.subject || '—',
            count: c.student_count || 0,
            code: c.class_code,
          }),
        )}</span>
        <button type="button" class="btn btn--primary btn--sm open-class" data-id="${c.id}">${escapeHtml(t('btn.open'))}</button>
      </li>`,
    )
    .join('');

  const setList = (sets || [])
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

  const main = el(`
    <main class="box box--wide box--deck deck-layout">
      <div class="deck-layout__main">
      ${headerBar(
        appState.user,
        null,
        `<button type="button" id="toggle-add-class" class="btn btn--primary btn--sm"${classesFull ? ' disabled title="' + escapeHtml(t('limits.classReached')) + '"' : ''}>${escapeHtml(t('teacher.createClass'))}</button>`,
      ).outerHTML}
      <section class="deck-section">
        <h2 class="deck-heading">${escapeHtml(t('teacher.dashboard.title'))}</h2>
        <p class="deck-hint">${escapeHtml(
          t('teacher.dashboard.stats', {
            classes: dash.stats.class_count,
            assignments: dash.stats.active_assignments,
            percent: dash.stats.completion_percent,
          }),
        )}</p>
      </section>
      <section class="deck-section">
        <h2 class="deck-heading">${escapeHtml(t('teacher.myClasses'))} ${limitBadgeHtml(classCount, MAX_TEACHER_CLASSES)}</h2>
        ${classesFull ? `<p class="limit-hint">${escapeHtml(t('limits.classReached'))}</p>` : ''}
        <section class="add-word-box" id="add-class-box" hidden>
          <p class="add-word-title">${escapeHtml(t('teacher.newClass'))}</p>
          <form id="new-class-form" class="form">
            <input name="title" placeholder="${escapeHtml(t('teacher.placeholder.classTitle'))}" required maxlength="200" />
            <input name="subject" placeholder="${escapeHtml(t('teacher.placeholder.subject'))}" maxlength="100" />
            <input name="description" placeholder="${escapeHtml(t('teacher.placeholder.description'))}" maxlength="300" />
            <button type="submit" class="btn btn--secondary btn--sm">${escapeHtml(t('btn.create'))}</button>
          </form>
          <p id="class-err" class="err"></p>
        </section>
        ${classList ? `<ul class="sets">${classList}</ul>` : `<p class="empty-msg">${escapeHtml(t('teacher.noClasses'))}</p>`}
      </section>
      <section class="deck-section">
        <div class="deck-section-head">
          <h2 class="deck-heading">${escapeHtml(t('teacher.wordSets'))} ${limitBadgeHtml(setCount, MAX_TEACHER_WORD_SETS)}</h2>
          <button type="button" id="toggle-add-set" class="btn btn--secondary btn--sm"${setsFull ? ' disabled title="' + escapeHtml(t('limits.setReached')) + '"' : ''}>${escapeHtml(t('teacher.addSet'))}</button>
        </div>
        ${setsFull ? `<p class="limit-hint">${escapeHtml(t('limits.setReached'))}</p>` : ''}
        <section class="add-word-box" id="add-set-box" hidden>
          <p class="add-word-title">${escapeHtml(t('teacher.newSet'))}</p>
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
        ${setList ? `<ul class="sets">${setList}</ul>` : `<p class="empty-msg">${escapeHtml(t('teacher.noSets'))}</p>`}
      </section>
      </div>
    </main>
  `);

  root.replaceChildren(main);
  bindLogout(root, navigate);
  root.querySelector('#toggle-add-class').addEventListener('click', () => {
    if (classesFull) return;
    const box = root.querySelector('#add-class-box');
    box.hidden = !box.hidden;
    if (!box.hidden) box.querySelector('[name=title]').focus();
  });

  root.querySelector('#new-class-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (classesFull) return;
    const errEl = root.querySelector('#class-err');
    errEl.textContent = '';
    const fd = new FormData(e.target);
    const title = String(fd.get('title') || '').trim();
    if (title.length < 1 || title.length > 200) {
      errEl.textContent = t('teacher.err.classTitle');
      return;
    }
    try {
      await api('/api/classes', {
        method: 'POST',
        body: JSON.stringify({
          title,
          subject: String(fd.get('subject') || '').trim(),
          description: String(fd.get('description') || '').trim(),
        }),
      });
      e.target.reset();
      await renderTeacherDashboard(root, navigate);
    } catch (e2) {
      errEl.textContent = e2.message;
    }
  });

  root.querySelectorAll('.open-class').forEach((btn) => {
    btn.addEventListener('click', () => {
      appState.classId = Number(btn.getAttribute('data-id'));
      navigate('teacher-class');
    });
  });

  root.querySelector('#toggle-add-set').addEventListener('click', () => {
    if (setsFull) return;
    const box = root.querySelector('#add-set-box');
    box.hidden = !box.hidden;
    if (!box.hidden) box.querySelector('[name=title]').focus();
  });

  root.querySelector('#new-set-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (setsFull) return;
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
      const row = await api('/api/word-sets', {
        method: 'POST',
        body: JSON.stringify({ title, language }),
      });
      appState.wordSetId = row.id;
      navigate('teacher-word-set');
    } catch (e2) {
      errEl.textContent = e2.message;
    }
  });

  root.querySelectorAll('.open-set').forEach((btn) => {
    btn.addEventListener('click', () => {
      appState.wordSetId = Number(btn.getAttribute('data-id'));
      navigate('teacher-word-set');
    });
  });
}

export async function renderTeacherClass(root, navigate) {
  const [data, stats] = await Promise.all([
    api('/api/classes/' + appState.classId),
    api('/api/teacher/classes/' + appState.classId + '/stats'),
  ]);

  const students = (data.students || [])
    .map((s) => `<li>${escapeHtml(s.name)} (${escapeHtml(s.email)})</li>`)
    .join('');
  const assignments = (data.assignments || [])
    .map((a) => {
      const datesMeta = teacherTestDatesMeta(a);
      return `<li class="set-row">
        <span class="set-title">${escapeHtml(a.title)}</span>
        <span class="meta">${escapeHtml(a.word_set_title)}${datesMeta ? ' · ' + datesMeta : ''} · ${escapeHtml(statusLabel(a.mode))}</span>
        ${
          a.mode === 'test'
            ? a.status === 'active'
              ? `<button type="button" class="btn btn--ghost btn--sm close-test" data-id="${a.id}">Закрити тест</button>`
              : ''
            : `<span class="test-schedule">
                 <label>${escapeHtml(t('teacher.testStart'))} <input type="datetime-local" class="test-start" data-id="${a.id}" value="${escapeHtml(testStartInputValue())}" /></label>
                 <label>${escapeHtml(t('teacher.testDeadline'))} <input type="datetime-local" class="test-deadline" data-id="${a.id}" value="${escapeHtml(deadlineInputValue(a.deadline))}" /></label>
               </span>
               <button type="button" class="btn btn--secondary btn--sm activate-test" data-id="${a.id}">${escapeHtml(t('teacher.activateTest'))}</button>`
        }
      </li>`;
    })
    .join('');

  // таблиця: учень | завдання | бал | статус
  let statsRows = '';
  for (const student of stats?.students || []) {
    for (const result of student.results || []) {
      const scoreText = result.score !== null ? result.score + '%' : '—';
      const completedText = result.completed_at ? result.completed_at : '—';
      statsRows += `<tr>
        <td>${escapeHtml(student.name)}</td>
        <td>${escapeHtml(result.assignment_title)}</td>
        <td>${escapeHtml(String(scoreText))}</td>
        <td>${escapeHtml(statusLabel(result.status))}</td>
        <td>${escapeHtml(completedText)}</td>
      </tr>`;
    }
  }

  root.replaceChildren(
    el(`
      <main class="box box--wide box--deck">
        ${headerBar(appState.user, null, `<button type="button" id="back" class="btn btn--ghost btn--sm">${escapeHtml(t('btn.backCabinet'))}</button><button type="button" id="new-assignment" class="btn btn--primary btn--sm">${escapeHtml(t('teacher.newAssignment'))}</button>`).outerHTML}
        <div class="deck-section-head">
          <h2 class="deck-heading">${escapeHtml(data.title)}</h2>
          <div>
            <button type="button" id="edit-class" class="btn btn--secondary btn--sm">${escapeHtml(t('teacher.editClass'))}</button>
            <button type="button" id="delete-class" class="btn btn--ghost btn--sm">${escapeHtml(t('teacher.deleteClass'))}</button>
          </div>
        </div>
        <p class="deck-hint">${escapeHtml(data.subject || '—')} · ${escapeHtml(t('teacher.classCode'))}: <strong>${escapeHtml(data.class_code)}</strong></p>
        ${data.description ? `<p class="deck-hint">${escapeHtml(data.description)}</p>` : ''}
        <section class="add-word-box" id="edit-class-box" hidden>
          <p class="add-word-title">${escapeHtml(t('teacher.editClassTitle'))}</p>
          <form id="edit-class-form" class="form">
            <input name="title" placeholder="${escapeHtml(t('teacher.placeholder.classTitle'))}" required maxlength="200" value="${escapeHtml(data.title)}" />
            <input name="subject" placeholder="${escapeHtml(t('teacher.placeholder.subject'))}" maxlength="100" value="${escapeHtml(data.subject || '')}" />
            <input name="description" placeholder="${escapeHtml(t('teacher.placeholder.description'))}" maxlength="300" value="${escapeHtml(data.description || '')}" />
            <button type="submit" class="btn btn--secondary btn--sm">${escapeHtml(t('btn.save'))}</button>
          </form>
          <p id="edit-class-err" class="err"></p>
        </section>
        <section class="deck-section">
          <h3 class="deck-heading">${escapeHtml(t('teacher.students'))}</h3>
          ${students ? `<ul class="sets">${students}</ul>` : `<p class="empty-msg">${escapeHtml(t('teacher.noStudents'))}</p>`}
        </section>
        <section class="deck-section">
          <h3 class="deck-heading">${escapeHtml(t('teacher.assignments'))}</h3>
          ${assignments ? `<ul class="sets">${assignments}</ul>` : `<p class="empty-msg">${escapeHtml(t('teacher.noAssignments'))}</p>`}
        </section>
        <section class="deck-section">
          <h3 class="deck-heading">${escapeHtml(t('stats.title'))}</h3>
          <div class="chart-box">
            <p class="deck-hint">${escapeHtml(t('stats.chart.assignments'))}</p>
            <canvas id="teacher-stats-chart"></canvas>
          </div>
          ${
            statsRows
              ? `<table class="stats-table">
            <thead>
              <tr>
                <th>${escapeHtml(t('stats.table.student'))}</th>
                <th>${escapeHtml(t('stats.table.assignment'))}</th>
                <th>${escapeHtml(t('stats.table.score'))}</th>
                <th>${escapeHtml(t('stats.table.status'))}</th>
                <th>Здано</th>
              </tr>
            </thead>
            <tbody>${statsRows}</tbody>
          </table>`
              : `<p class="empty-msg">${escapeHtml(t('stats.noData'))}</p>`
          }
        </section>
      </main>
    `),
  );

  // bar chart: середній бал по завданнях
  const classAssignments = stats?.assignments || [];
  const hasScores = classAssignments.some((a) => a.avg_score !== null);
  const chartCanvas = root.querySelector('#teacher-stats-chart');
  if (hasScores) {
    renderBarChart(
      chartCanvas,
      classAssignments.map((a) => a.title),
      classAssignments.map((a) => a.avg_score || 0),
      t('stats.table.score'),
    );
  }

  bindLogout(root, navigate);
  root.querySelector('#back').addEventListener('click', () => navigate('teacher-dashboard'));
  root.querySelector('#new-assignment').addEventListener('click', () => navigate('teacher-create-assignment'));

  root.querySelectorAll('.activate-test').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      const startInput = root.querySelector('.test-start[data-id="' + id + '"]');
      const deadlineInput = root.querySelector('.test-deadline[data-id="' + id + '"]');
      const test_start = startInput ? startInput.value : '';
      const deadline = deadlineInput ? deadlineInput.value : '';
      if (!test_start || !deadline) return;
      try {
        await api('/api/assignments/' + id + '/activate-test', {
          method: 'PUT',
          body: JSON.stringify({ test_start, deadline }),
        });
        await renderTeacherClass(root, navigate);
      } catch (e2) {
        window.alert(e2.message);
      }
    });
  });

  root.querySelectorAll('.close-test').forEach((btn) => {
    btn.addEventListener('click', async () => {
      if (!window.confirm('Закрити тестування?')) return;
      try {
        await api('/api/assignments/' + btn.getAttribute('data-id') + '/close-test', {
          method: 'PUT',
        });
        await renderTeacherClass(root, navigate);
      } catch (e2) {
        window.alert(e2.message);
      }
    });
  });

  root.querySelector('#edit-class').addEventListener('click', () => {
    const box = root.querySelector('#edit-class-box');
    box.hidden = !box.hidden;
    if (!box.hidden) box.querySelector('[name=title]').focus();
  });

  root.querySelector('#edit-class-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errEl = root.querySelector('#edit-class-err');
    errEl.textContent = '';
    const fd = new FormData(e.target);
    const title = String(fd.get('title') || '').trim();
    if (title.length < 1 || title.length > 200) {
      errEl.textContent = t('teacher.err.classTitle');
      return;
    }
    try {
      await api('/api/classes/' + appState.classId, {
        method: 'PUT',
        body: JSON.stringify({
          title,
          subject: String(fd.get('subject') || '').trim(),
          description: String(fd.get('description') || '').trim(),
        }),
      });
      await renderTeacherClass(root, navigate);
    } catch (e2) {
      errEl.textContent = e2.message;
    }
  });

  root.querySelector('#delete-class').addEventListener('click', async () => {
    if (!window.confirm(t('teacher.deleteClassConfirm'))) return;
    try {
      await api('/api/classes/' + appState.classId, { method: 'DELETE' });
      navigate('teacher-dashboard');
    } catch (e2) {
      window.alert(e2.message);
    }
  });
}

export async function renderTeacherWordSets(root, navigate) {
  const sets = await api('/api/word-sets');
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
        ${headerBar(appState.user, null, `<button type="button" id="back" class="btn btn--ghost btn--sm">${escapeHtml(t('btn.backCabinet'))}</button><button type="button" id="toggle-add-set" class="btn btn--primary btn--sm">${escapeHtml(t('teacher.addSet'))}</button>`).outerHTML}
        <section class="deck-section">
          <h2 class="deck-heading">${escapeHtml(t('teacher.wordSets'))}</h2>
          <section class="add-word-box" id="add-set-box" hidden>
            <p class="add-word-title">${escapeHtml(t('teacher.newSet'))}</p>
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
          ${list ? `<ul class="sets">${list}</ul>` : `<p class="empty-msg">${escapeHtml(t('teacher.noSets'))}</p>`}
        </section>
      </main>
    `),
  );
  bindLogout(root, navigate);
  root.querySelector('#back').addEventListener('click', () => navigate('teacher-dashboard'));
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
      const row = await api('/api/word-sets', {
        method: 'POST',
        body: JSON.stringify({ title, language }),
      });
      appState.wordSetId = row.id;
      navigate('teacher-word-set');
    } catch (e2) {
      errEl.textContent = e2.message;
    }
  });
  root.querySelectorAll('.open-set').forEach((btn) => {
    btn.addEventListener('click', () => {
      appState.wordSetId = Number(btn.getAttribute('data-id'));
      navigate('teacher-word-set');
    });
  });
}

export async function renderTeacherWordSet(root, navigate) {
  const [set, cards] = await Promise.all([
    api('/api/word-sets/' + appState.wordSetId),
    api('/api/word-sets/' + appState.wordSetId + '/cards'),
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

  root.replaceChildren(
    el(`
      <main class="box box--wide box--deck">
        ${headerBar(appState.user, null, `<button type="button" id="back" class="btn btn--ghost btn--sm">${escapeHtml(t('btn.backCabinet'))}</button><button type="button" id="toggle-add" class="btn btn--primary btn--sm">${escapeHtml(t('teacher.addWord'))}</button>`).outerHTML}
        <h2 class="deck-heading">${escapeHtml(set.title)}</h2>
        <p class="deck-hint">${escapeHtml(set.language)}</p>
        <section class="add-word-box" id="add-word-box" hidden>
          <p class="add-word-title">${escapeHtml(t('teacher.addCard'))}</p>
          <form id="add-card-form" class="form-row">
            <input name="word" placeholder="${escapeHtml(t('teacher.placeholder.word'))}" required />
            <input name="translation" placeholder="${escapeHtml(t('teacher.placeholder.translation'))}" required />
            <input name="image_url" type="url" placeholder="${escapeHtml(t('teacher.placeholder.imageUrl'))}" />
            <input name="example" placeholder="${escapeHtml(t('teacher.placeholder.example'))}" />
            <button type="submit" class="btn btn--secondary btn--sm">${escapeHtml(t('teacher.btn.add'))}</button>
          </form>
          <p class="hint">${escapeHtml(t('teacher.placeholder.exampleHint'))}</p>
          <p id="card-err" class="err"></p>
        </section>
        ${cardList ? `<ul class="sets">${cardList}</ul>` : `<p class="empty-msg">${escapeHtml(t('teacher.noCards'))}</p>`}
      </main>
    `),
  );
  bindLogout(root, navigate);
  root.querySelector('#back').addEventListener('click', () => navigate('teacher-dashboard'));
  root.querySelector('#toggle-add').addEventListener('click', () => {
    const box = root.querySelector('#add-word-box');
    box.hidden = !box.hidden;
    if (!box.hidden) box.querySelector('[name=word]').focus();
  });
  root.querySelector('#add-card-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errEl = root.querySelector('#card-err');
    errEl.textContent = '';
    const fd = new FormData(e.target);
    try {
      await api('/api/word-sets/' + appState.wordSetId + '/cards', {
        method: 'POST',
        body: JSON.stringify({
          word: String(fd.get('word') || ''),
          translation: String(fd.get('translation') || ''),
          image_url: String(fd.get('image_url') || ''),
          example: String(fd.get('example') || ''),
        }),
      });
      e.target.reset();
      await renderTeacherWordSet(root, navigate);
    } catch (e2) {
      errEl.textContent = e2.message;
    }
  });
  root.querySelectorAll('.del-card').forEach((btn) => {
    btn.addEventListener('click', async () => {
      if (!window.confirm(t('teacher.deleteCardConfirm'))) return;
      await api('/api/word-cards/' + btn.getAttribute('data-id'), { method: 'DELETE' });
      await renderTeacherWordSet(root, navigate);
    });
  });
}

export async function renderTeacherCreateAssignment(root, navigate) {
  const [classes, sets] = await Promise.all([api('/api/classes'), api('/api/word-sets')]);
  const classOpts = (classes || [])
    .map((c) => `<option value="${c.id}">${escapeHtml(c.title)}</option>`)
    .join('');
  const setOpts = (sets || [])
    .map((s) => `<option value="${s.id}">${escapeHtml(s.title)}</option>`)
    .join('');
  const testStartDefault = testStartInputValue();
  const testEndDefault = testEndInputValue();

  root.replaceChildren(
    el(`
      <main class="box box--wide">
        ${headerBar(appState.user, null, `<button type="button" id="back" class="btn btn--ghost btn--sm">${escapeHtml(t('btn.backClass'))}</button>`).outerHTML}
        <h2 class="deck-heading">${escapeHtml(t('teacher.assign.title'))}</h2>
        <form id="assign-form" class="form">
          <label>${escapeHtml(t('teacher.assign.class'))} <select name="class_id" required>${classOpts}</select></label>
          <label>${escapeHtml(t('teacher.assign.wordSet'))} <select name="word_set_id" required>${setOpts}</select></label>
          <label>${escapeHtml(t('teacher.assign.name'))} <input name="title" required placeholder="${escapeHtml(t('teacher.assign.namePlaceholder'))}" /></label>
          <label class="checkbox-row">
            <input type="checkbox" name="assign_test" id="assign-test" />
            <span>${escapeHtml(t('teacher.assign.withTest'))}</span>
          </label>
          <div id="assign-test-dates" class="test-schedule" hidden>
            <label>${escapeHtml(t('teacher.assign.testStart'))} <input name="test_start" type="datetime-local" value="${escapeHtml(testStartDefault)}" /></label>
            <label>${escapeHtml(t('teacher.assign.testEnd'))} <input name="test_deadline" type="datetime-local" value="${escapeHtml(testEndDefault)}" /></label>
          </div>
          <p class="hint">${escapeHtml(t('teacher.assign.hint'))}</p>
          <button type="submit" class="btn btn--primary">${escapeHtml(t('teacher.assign.submit'))}</button>
        </form>
        <p id="assign-err" class="err"></p>
      </main>
    `),
  );
  bindLogout(root, navigate);
  if (appState.classId) {
    root.querySelector('[name=class_id]').value = String(appState.classId);
  }
  const testCheckbox = root.querySelector('#assign-test');
  const testDatesBox = root.querySelector('#assign-test-dates');
  testCheckbox.addEventListener('change', () => {
    testDatesBox.hidden = !testCheckbox.checked;
  });

  root.querySelector('#back').addEventListener('click', () => navigate('teacher-class'));
  root.querySelector('#assign-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errEl = root.querySelector('#assign-err');
    errEl.textContent = '';
    const fd = new FormData(e.target);
    const assignTest = !!fd.get('assign_test');
    const test_start = String(fd.get('test_start') || '').trim();
    const deadline = String(fd.get('test_deadline') || '').trim();
    if (assignTest && (!test_start || !deadline)) {
      errEl.textContent = t('api.testDatesRequired');
      return;
    }
    try {
      await api('/api/assignments', {
        method: 'POST',
        body: JSON.stringify({
          class_id: Number(fd.get('class_id')),
          word_set_id: Number(fd.get('word_set_id')),
          title: String(fd.get('title') || ''),
          assign_test: assignTest,
          test_start: assignTest ? test_start : undefined,
          deadline: assignTest ? deadline : undefined,
        }),
      });
      appState.classId = Number(fd.get('class_id'));
      navigate('teacher-class');
    } catch (e2) {
      errEl.textContent = e2.message;
    }
  });
}
