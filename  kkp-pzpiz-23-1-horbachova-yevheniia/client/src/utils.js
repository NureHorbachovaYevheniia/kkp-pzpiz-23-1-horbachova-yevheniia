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

//слово в лапках стає помаранчевим
export function formatExampleHtml(example) {
  const text = String(example ?? '').trim();
  if (!text) return '';

  const parts = text.split(/(«[^»]+»|"[^"]+")/g);
  let html = '';
  for (const part of parts) {
    if (!part) continue;
    if ((part.startsWith('«') && part.endsWith('»')) || (part.startsWith('"') && part.endsWith('"'))) {
      const word = part.slice(1, -1);
      html += `<span class="example-word">${escapeHtml(word)}</span>`;
    } else {
      html += escapeHtml(part);
    }
  }
  return html;
}

import { getDateLocale, t } from './i18n.js';

export function formatDate(iso) {
  if (!iso) return '—';
  try {
    return new Intl.DateTimeFormat(getDateLocale(), {
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
  const key = 'status.' + status;
  const label = t(key);
  return label === key ? status : label;
}

// назва мови набору → код голосу для синтезу мовлення
const SPEECH_LANGS = {
  English: 'en-US',
  Deutsch: 'de-DE',
  Français: 'fr-FR',
  Español: 'es-ES',
  Italiano: 'it-IT',
  Polski: 'pl-PL',
  Українська: 'uk-UA',
};

export function speechSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

// озвучуємо слово голосом браузера; повертаємо false, якщо не вдалося
export function speakWord(text, language) {
  const word = String(text ?? '').trim();
  if (!word || !speechSupported()) return false;
  try {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(word);
    const lang = SPEECH_LANGS[language];
    if (lang) utter.lang = lang;
    utter.rate = 0.9;
    window.speechSynthesis.speak(utter);
    return true;
  } catch {
    return false;
  }
}
