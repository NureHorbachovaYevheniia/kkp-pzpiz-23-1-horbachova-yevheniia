import { api } from '../api.js';
import { el, escapeHtml, formatDate, statusLabel } from '../utils.js';
import { appState } from '../state.js';
import { headerBar, bindLogout } from './auth.js';

const LANGUAGES = [
  'English',
  'Deutsch',
  'Français',
  'Español',
  'Italiano',
  'Polski',
  'Українська',
];

export async function renderTeacherDashboard(root, navigate) {
  const [dash, classes, sets] = await Promise.all([
    api('/api/teacher/dashboard'),
    api('/api/classes'),
    api('/api/word-sets'),
  ]);

  const classList = (classes || [])
    .map(
      (c) => `<li class="set-row">
        <span class="set-title">${escapeHtml(c.title)}</span>
        <span class="meta">${escapeHtml(c.subject || '—')} · ${c.student_count || 0} учнів · код: <strong>${escapeHtml(c.class_code)}</strong></span>
        <button type="button" class="btn btn--primary btn--sm open-class" data-id="${c.id}">Відкрити</button>
      </li>`,
    )
    .join('');

  const setList = (sets || [])
    .map(
      (s) => `<li class="set-row">
        <span class="set-title">${escapeHtml(s.title)}</span>
        <span class="meta">${escapeHtml(s.language || '—')} · ${s.card_count || 0} карток</span>
        <button type="button" class="btn btn--primary btn--sm open-set" data-id="${s.id}">Відкрити</button>
      </li>`,
    )
    .join('');

  const main = el(`
    <main class="box box--wide box--deck">
      ${headerBar(appState.user, null, `<button type="button" id="toggle-add-class" class="btn btn--primary btn--sm">+ Створити клас</button>`).outerHTML}
      <section class="deck-section">
        <h2 class="deck-heading">Кабінет викладача</h2>
        <p class="deck-hint">Класів: ${dash.stats.class_count} · Активних завдань: ${dash.stats.active_assignments} · Виконання: ${dash.stats.completion_percent}%</p>
      </section>
      <section class="deck-section">
        <h2 class="deck-heading">Мої класи</h2>
        <section class="add-word-box" id="add-class-box" hidden>
          <p class="add-word-title">Новий клас</p>
          <form id="new-class-form" class="form">
            <input name="title" placeholder="Назва класу" required maxlength="200" />
            <input name="subject" placeholder="Предмет / мова" maxlength="100" />
            <input name="description" placeholder="Короткий опис" maxlength="300" />
            <button type="submit" class="btn btn--secondary btn--sm">Створити</button>
          </form>
          <p id="class-err" class="err"></p>
        </section>
        ${classList ? `<ul class="sets">${classList}</ul>` : '<p class="empty-msg">Ще немає класів.</p>'}
      </section>
      <section class="deck-section">
        <div class="deck-section-head">
          <h2 class="deck-heading">Набори слів</h2>
          <button type="button" id="toggle-add-set" class="btn btn--secondary btn--sm">+ Додати набір</button>
        </div>
        <section class="add-word-box" id="add-set-box" hidden>
          <p class="add-word-title">Новий набір</p>
          <form id="new-set-form" class="form">
            <input name="title" placeholder="Назва набору" required maxlength="200" />
            <select name="language" required>
              <option value="" disabled selected>Оберіть мову</option>
              ${LANGUAGES.map((lng) => `<option value="${escapeHtml(lng)}">${escapeHtml(lng)}</option>`).join('')}
            </select>
            <button type="submit" class="btn btn--secondary btn--sm">Створити</button>
          </form>
          <p id="set-err" class="err"></p>
        </section>
        ${setList ? `<ul class="sets">${setList}</ul>` : '<p class="empty-msg">Немає наборів.</p>'}
      </section>
    </main>
  `);

  root.replaceChildren(main);
  bindLogout(root, navigate);
  root.querySelector('#toggle-add-class').addEventListener('click', () => {
    const box = root.querySelector('#add-class-box');
    box.hidden = !box.hidden;
    if (!box.hidden) box.querySelector('[name=title]').focus();
  });

  root.querySelector('#new-class-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errEl = root.querySelector('#class-err');
    errEl.textContent = '';
    const fd = new FormData(e.target);
    const title = String(fd.get('title') || '').trim();
    if (title.length < 1 || title.length > 200) {
      errEl.textContent = 'Назва класу має бути 1–200 символів';
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
      errEl.textContent = 'Назва набору має бути 1–200 символів';
      return;
    }
    if (!language) {
      errEl.textContent = 'Оберіть мову набору';
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
  const data = await api('/api/classes/' + appState.classId);
  const students = (data.students || [])
    .map((s) => `<li>${escapeHtml(s.name)} (${escapeHtml(s.email)})</li>`)
    .join('');
  const assignments = (data.assignments || [])
    .map(
      (a) => `<li class="set-row">
        <span class="set-title">${escapeHtml(a.title)}</span>
        <span class="meta">${escapeHtml(a.word_set_title)} · до ${formatDate(a.deadline)} · ${statusLabel(a.mode)}</span>
      </li>`,
    )
    .join('');

  root.replaceChildren(
    el(`
      <main class="box box--wide box--deck">
        ${headerBar(appState.user, null, `<button type="button" id="back" class="btn btn--ghost btn--sm">← Кабінет</button><button type="button" id="new-assignment" class="btn btn--primary btn--sm">Завдання</button>`).outerHTML}
        <div class="deck-section-head">
          <h2 class="deck-heading">${escapeHtml(data.title)}</h2>
          <div>
            <button type="button" id="edit-class" class="btn btn--secondary btn--sm">Редагувати</button>
            <button type="button" id="delete-class" class="btn btn--ghost btn--sm">Видалити</button>
          </div>
        </div>
        <p class="deck-hint">${escapeHtml(data.subject || '—')} · Код класу: <strong>${escapeHtml(data.class_code)}</strong></p>
        ${data.description ? `<p class="deck-hint">${escapeHtml(data.description)}</p>` : ''}
        <section class="add-word-box" id="edit-class-box" hidden>
          <p class="add-word-title">Редагувати клас</p>
          <form id="edit-class-form" class="form">
            <input name="title" placeholder="Назва класу" required maxlength="200" value="${escapeHtml(data.title)}" />
            <input name="subject" placeholder="Предмет / мова" maxlength="100" value="${escapeHtml(data.subject || '')}" />
            <input name="description" placeholder="Короткий опис" maxlength="300" value="${escapeHtml(data.description || '')}" />
            <button type="submit" class="btn btn--secondary btn--sm">Зберегти</button>
          </form>
          <p id="edit-class-err" class="err"></p>
        </section>
        <section class="deck-section">
          <h3 class="deck-heading">Учні</h3>
          ${students ? `<ul class="sets">${students}</ul>` : '<p class="empty-msg">Ще немає учнів.</p>'}
        </section>
        <section class="deck-section">
          <h3 class="deck-heading">Завдання</h3>
          ${assignments ? `<ul class="sets">${assignments}</ul>` : '<p class="empty-msg">Завдань ще немає.</p>'}
        </section>
      </main>
    `),
  );
  bindLogout(root, navigate);
  root.querySelector('#back').addEventListener('click', () => navigate('teacher-dashboard'));
  root.querySelector('#new-assignment').addEventListener('click', () => navigate('teacher-create-assignment'));

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
      errEl.textContent = 'Назва класу має бути 1–200 символів';
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
    if (!window.confirm('Видалити клас разом з усіма завданнями та списком учнів?')) return;
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
        <span class="meta">${escapeHtml(s.language || '—')} · ${s.card_count || 0} карток</span>
        <button type="button" class="btn btn--primary btn--sm open-set" data-id="${s.id}">Відкрити</button>
      </li>`,
    )
    .join('');

  root.replaceChildren(
    el(`
      <main class="box box--wide box--deck">
        ${headerBar(appState.user, null, `<button type="button" id="back" class="btn btn--ghost btn--sm">← Кабінет</button><button type="button" id="toggle-add-set" class="btn btn--primary btn--sm">+ Додати набір</button>`).outerHTML}
        <section class="deck-section">
          <h2 class="deck-heading">Набори слів</h2>
          <section class="add-word-box" id="add-set-box" hidden>
            <p class="add-word-title">Новий набір</p>
            <form id="new-set-form" class="form">
              <input name="title" placeholder="Назва набору" required maxlength="200" />
              <select name="language" required>
                <option value="" disabled selected>Оберіть мову</option>
                ${LANGUAGES.map((lng) => `<option value="${escapeHtml(lng)}">${escapeHtml(lng)}</option>`).join('')}
              </select>
              <button type="submit" class="btn btn--secondary btn--sm">Створити</button>
            </form>
            <p id="set-err" class="err"></p>
          </section>
          ${list ? `<ul class="sets">${list}</ul>` : '<p class="empty-msg">Немає наборів.</p>'}
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
      errEl.textContent = 'Назва набору має бути 1–200 символів';
      return;
    }
    if (!language) {
      errEl.textContent = 'Оберіть мову набору';
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
        ${headerBar(appState.user, null, `<button type="button" id="back" class="btn btn--ghost btn--sm">← Кабінет</button><button type="button" id="toggle-add" class="btn btn--primary btn--sm">+ Додати слово</button>`).outerHTML}
        <h2 class="deck-heading">${escapeHtml(set.title)}</h2>
        <p class="deck-hint">${escapeHtml(set.language)}</p>
        <section class="add-word-box" id="add-word-box" hidden>
          <p class="add-word-title">Додати картку</p>
          <form id="add-card-form" class="form-row">
            <input name="word" placeholder="Слово" required />
            <input name="translation" placeholder="Переклад" required />
            <input name="image_url" type="url" placeholder="Посилання на фото (необов'язково)" />
            <button type="submit" class="btn btn--secondary btn--sm">Додати</button>
          </form>
          <p id="card-err" class="err"></p>
        </section>
        ${cardList ? `<ul class="sets">${cardList}</ul>` : '<p class="empty-msg">Немає карток.</p>'}
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
      if (!window.confirm('Ви точно бажаєте видалити це слово?')) return;
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
  const today = new Date().toISOString().slice(0, 10);
  const deadline = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);

  root.replaceChildren(
    el(`
      <main class="box box--wide">
        ${headerBar(appState.user, null, `<button type="button" id="back" class="btn btn--ghost btn--sm">← Клас</button>`).outerHTML}
        <h2 class="deck-heading">Призначити завдання</h2>
        <form id="assign-form" class="form">
          <label>Клас <select name="class_id" required>${classOpts}</select></label>
          <label>Набір слів <select name="word_set_id" required>${setOpts}</select></label>
          <label>Назва <input name="title" required placeholder="Назва завдання" /></label>
          <label>Початок <input name="start_date" type="date" value="${today}" required /></label>
          <label>Дедлайн <input name="deadline" type="date" value="${deadline}" required /></label>
          <label>Режим
            <select name="mode">
              <option value="mixed">Змішаний</option>
              <option value="study">Вивчення</option>
              <option value="test">Тест</option>
            </select>
          </label>
          <button type="submit" class="btn btn--primary">Створити завдання</button>
        </form>
        <p id="assign-err" class="err"></p>
      </main>
    `),
  );
  bindLogout(root, navigate);
  if (appState.classId) {
    root.querySelector('[name=class_id]').value = String(appState.classId);
  }
  root.querySelector('#back').addEventListener('click', () => navigate('teacher-class'));
  root.querySelector('#assign-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errEl = root.querySelector('#assign-err');
    errEl.textContent = '';
    const fd = new FormData(e.target);
    try {
      await api('/api/assignments', {
        method: 'POST',
        body: JSON.stringify({
          class_id: Number(fd.get('class_id')),
          word_set_id: Number(fd.get('word_set_id')),
          title: String(fd.get('title') || ''),
          start_date: String(fd.get('start_date') || ''),
          deadline: String(fd.get('deadline') || ''),
          mode: String(fd.get('mode') || 'mixed'),
        }),
      });
      appState.classId = Number(fd.get('class_id'));
      navigate('teacher-class');
    } catch (e2) {
      errEl.textContent = e2.message;
    }
  });
}
