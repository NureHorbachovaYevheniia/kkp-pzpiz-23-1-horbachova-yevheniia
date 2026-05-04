# Лексика

**Сервер:** `cd server && npm install && npm run dev` → http://localhost:3000/health (`"db": true`). БД: `server/data/app.db`.

**Реєстрація (лише цей крок):** `POST /api/auth/register` з JSON `{"email":"...","password":"..."}` (пароль ≥ 6). Перший користувач отримує роль `admin`, далі — `user`.

**Клієнт:** `cd client && npm install && npm run dev`.
