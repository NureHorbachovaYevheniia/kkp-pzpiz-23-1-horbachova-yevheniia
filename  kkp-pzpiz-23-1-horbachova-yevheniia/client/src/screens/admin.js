// Кабінет адміністратора: користувачі, backup, export, логи.
import { api, getToken } from '../api.js';
import { el, escapeHtml, formatDate } from '../utils.js';
import { appState } from '../state.js';
import { headerBar, bindLogout } from './auth.js';
import { t, translateApiError } from '../i18n.js';

// запит з токеном (для файлів, не JSON)
async function adminFetch(path, options = {}) {
  const headers = { ...options.headers };
  const token = getToken();
  if (token) {
    headers.Authorization = 'Bearer ' + token;
  }
  const res = await fetch(path, { ...options, headers });
  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text };
    }
  }
  if (!res.ok) {
    const msg = data && data.error ? data.error : res.statusText;
    throw new Error(translateApiError(msg));
  }
  return { res, data };
}

function roleLabel(role) {
  const key = 'role.' + role;
  const label = t(key);
  return label === key ? role : label;
}

export async function renderAdminDashboard(root, navigate) {
  const users = await api('/api/admin/users');

  const rows = (users || [])
    .map((u) => {
      const isMe = u.id === appState.user.id;
      const delBtn = isMe
        ? ''
        : `<button type="button" class="btn btn--danger btn--sm del-user" data-id="${u.id}">${escapeHtml(t('btn.delete'))}</button>`;
      return `<tr>
        <td>${escapeHtml(String(u.id))}</td>
        <td>${escapeHtml(u.name)}</td>
        <td>${escapeHtml(u.email)}</td>
        <td>${escapeHtml(roleLabel(u.role))}</td>
        <td>${escapeHtml(formatDate(u.created_at))}</td>
        <td>${delBtn}</td>
      </tr>`;
    })
    .join('');

  const main = el(`
    <main class="box box--wide box--deck">
      ${headerBar(appState.user).outerHTML}
      <section class="deck-section">
        <h1 class="deck-heading">${escapeHtml(t('admin.dashboard.title'))}</h1>
        <p class="deck-hint">${escapeHtml(t('admin.dashboard.hint'))}</p>
      </section>

      <section class="deck-section">
        <h2 class="deck-heading">${escapeHtml(t('admin.users'))}</h2>
        ${
          rows
            ? `<div class="admin-table-wrap">
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>${escapeHtml(t('label.name'))}</th>
                      <th>${escapeHtml(t('label.email'))}</th>
                      <th>${escapeHtml(t('label.role'))}</th>
                      <th>${escapeHtml(t('admin.created'))}</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>${rows}</tbody>
                </table>
              </div>`
            : `<p class="empty-msg">${escapeHtml(t('admin.noUsers'))}</p>`
        }
        <p id="users-err" class="err"></p>
      </section>

      <section class="deck-section">
        <h2 class="deck-heading">${escapeHtml(t('admin.tools'))}</h2>
        <div class="card-actions card-actions--stack">
          <button type="button" id="admin-backup" class="btn btn--secondary btn--block">${escapeHtml(t('admin.backup'))}</button>
          <button type="button" id="admin-export" class="btn btn--secondary btn--block">${escapeHtml(t('admin.export'))}</button>
          <button type="button" id="admin-logs" class="btn btn--secondary btn--block">${escapeHtml(t('admin.logs'))}</button>
        </div>
        <p class="hint">${escapeHtml(t('admin.restoreHint'))}</p>
        <label class="btn btn--secondary btn--block admin-file-btn">
          ${escapeHtml(t('admin.restore'))}
          <input type="file" id="admin-restore-file" accept=".db" hidden />
        </label>
        <p class="hint">${escapeHtml(t('admin.importHint'))}</p>
        <label class="btn btn--secondary btn--block admin-file-btn">
          ${escapeHtml(t('admin.import'))}
          <input type="file" id="admin-import-file" accept=".json,application/json" hidden />
        </label>
        <p id="tools-err" class="err"></p>
        <p id="tools-ok" class="hint"></p>
      </section>
    </main>
  `);

  root.replaceChildren(main);
  bindLogout(root, navigate);

  const usersErr = root.querySelector('#users-err');
  root.querySelectorAll('.del-user').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = Number(btn.dataset.id);
      if (!window.confirm(t('admin.deleteConfirm'))) return;
      usersErr.textContent = '';
      try {
        await api('/api/admin/users/' + id, { method: 'DELETE' });
        await renderAdminDashboard(root, navigate);
      } catch (e) {
        usersErr.textContent = e.message || t('error.generic');
      }
    });
  });

  const toolsErr = root.querySelector('#tools-err');
  const toolsOk = root.querySelector('#tools-ok');

  root.querySelector('#admin-backup').addEventListener('click', async () => {
    toolsErr.textContent = '';
    toolsOk.textContent = '';
    try {
      const { res } = await adminFetch('/api/admin/backup');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'app-backup.db';
      a.click();
      URL.revokeObjectURL(url);
      toolsOk.textContent = t('admin.backupOk');
    } catch (e) {
      toolsErr.textContent = e.message || t('error.generic');
    }
  });

  root.querySelector('#admin-export').addEventListener('click', async () => {
    toolsErr.textContent = '';
    toolsOk.textContent = '';
    try {
      const data = await api('/api/admin/export');
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'learnly-export.json';
      a.click();
      URL.revokeObjectURL(url);
      toolsOk.textContent = t('admin.exportOk');
    } catch (e) {
      toolsErr.textContent = e.message || t('error.generic');
    }
  });

  root.querySelector('#admin-logs').addEventListener('click', () => navigate('admin-logs'));

  root.querySelector('#admin-restore-file').addEventListener('change', async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    if (!window.confirm(t('admin.restoreConfirm'))) return;
    toolsErr.textContent = '';
    toolsOk.textContent = '';
    try {
      const body = await file.arrayBuffer();
      await adminFetch('/api/admin/restore', {
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/octet-stream' },
      });
      toolsOk.textContent = t('admin.restoreOk');
    } catch (err) {
      toolsErr.textContent = err.message || t('error.generic');
    }
  });

  root.querySelector('#admin-import-file').addEventListener('change', async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    if (!window.confirm(t('admin.importConfirm'))) return;
    toolsErr.textContent = '';
    toolsOk.textContent = '';
    try {
      const text = await file.text();
      const payload = JSON.parse(text);
      await api('/api/admin/import', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      toolsOk.textContent = t('admin.importOk');
      await renderAdminDashboard(root, navigate);
    } catch (err) {
      toolsErr.textContent = err.message || t('error.generic');
    }
  });
}

export async function renderAdminLogs(root, navigate) {
  const data = await api('/api/admin/logs');
  const lines = (data.lines || []).join('\n');

  root.replaceChildren(
    el(`
      <main class="box box--wide">
        ${headerBar(appState.user, null, `<button type="button" id="back-admin" class="btn btn--ghost btn--sm">${escapeHtml(t('btn.backCabinet'))}</button>`).outerHTML}
        <h1>${escapeHtml(t('admin.logs.title'))}</h1>
        <pre class="admin-logs">${escapeHtml(lines || t('admin.logsEmpty'))}</pre>
      </main>
    `),
  );

  bindLogout(root, navigate);
  root.querySelector('#back-admin').addEventListener('click', () => navigate('admin-dashboard'));
}
