# Лексика

`cd server && npm install && npm run dev` → http://localhost:3000/health (`"db": true`). БД: `server/data/app.db`.


- `POST /api/auth/register` — JSON `{"email":"...","password":"..."}` (пароль ≥ 6). Перший користувач — `admin`, далі — `user`.
- `POST /api/auth/login` — → `{ token, user }`. 

`cd client && npm install && npm run dev`.
