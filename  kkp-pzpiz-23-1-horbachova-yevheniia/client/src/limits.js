import { escapeHtml } from './utils.js';
import { t } from './i18n.js';

export const MAX_TEACHER_CLASSES = 3;
export const MAX_TEACHER_WORD_SETS = 10;
export const MAX_STUDENT_SETS = 10;

export function isAtLimit(current, max) {
  return current >= max;
}

export function limitBadgeHtml(current, max) {
  const atLimit = isAtLimit(current, max);
  const cls = atLimit ? 'limit-badge limit-badge--full' : 'limit-badge';
  return `<span class="${cls}" title="${escapeHtml(t('limits.badgeTitle', { current, max }))}">${current}/${max}</span>`;
}

export function premiumAsideHtml() {
  return `
    <aside class="premium-aside" aria-label="${escapeHtml(t('premium.asideLabel'))}">
      <button type="button" id="buy-premium" class="btn btn--primary btn--sm premium-aside__btn">${escapeHtml(t('premium.buy'))}</button>
      <p class="premium-aside__hint">${escapeHtml(t('premium.hint'))}</p>
    </aside>
  `;
}

export function bindPremiumAside(root) {
  const btn = root.querySelector('#buy-premium');
  if (!btn) return;
  btn.addEventListener('click', () => {
    window.alert(t('premium.comingSoon'));
  });
}
