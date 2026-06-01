export function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

export function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function formatDate(iso) {
  if (!iso) return '—';
  try {
    return new Intl.DateTimeFormat('uk-UA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function normalizeAnswer(s) {
  return String(s ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

export function statusLabel(status) {
  const map = {
    not_started: 'Не почато',
    in_progress: 'У процесі',
    completed: 'Завершено',
    know: 'Знаю',
    almost: 'Майже знаю',
    repeat: 'Повторити',
    active: 'Активне',
    draft: 'Чернетка',
    closed: 'Закрито',
    study: 'Вивчення',
    test: 'Тест',
    mixed: 'Змішаний',
  };
  return map[status] || status;
}
