// Тут усе для роботи з сервером: запити та збереження токена.
import { translateApiError } from './i18n.js';

const TOKEN_KEY = 'learnly_token';

export async function api(path, options = {}) {
  const headers = { ...options.headers };
  // якщо відправляємо тіло — кажемо, що це JSON
  if (!headers['Content-Type'] && options.body) {
    headers['Content-Type'] = 'application/json';
  }
  // додаємо токен, якщо ми залогінені
  const token = localStorage.getItem(TOKEN_KEY);
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
  // якщо сервер повернув помилку — кидаємо її далі
  if (!res.ok) {
    const msg = data && data.error ? data.error : res.statusText;
    throw new Error(translateApiError(msg));
  }
  return data;
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function logout() {
  clearToken();
}
