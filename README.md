# Лексика

`cd server && npm install && npm run dev` → http://localhost:3000/health (`"db": true`). БД: `server/data/app.db`.


- `POST /api/auth/register` — JSON `{"email":"...","password":"..."}` (пароль ≥ 6). Перший користувач — `admin`, далі — `user`.
- `POST /api/auth/login` — JSON `{"email":"...","password":"..."}` → `{ token, user }` 
- `GET /api/auth/me` — заголовок `Authorization: Bearer <token>` → `{ id, email, role }`.
- `GET /api/categories` — Bearer → `{ id, title }[]`.
- `GET /api/word-sets` — Bearer → `{ id, category_id, title, created_at }[]`.

`cd client && npm install && npm run dev`.
