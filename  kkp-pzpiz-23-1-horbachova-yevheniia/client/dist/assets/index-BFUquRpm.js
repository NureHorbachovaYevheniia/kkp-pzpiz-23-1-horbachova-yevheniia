(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const n of a)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function r(a){const n={};return a.integrity&&(n.integrity=a.integrity),a.referrerPolicy&&(n.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?n.credentials="include":a.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function o(a){if(a.ep)return;a.ep=!0;const n=r(a);fetch(a.href,n)}})();const E="learnly_token";async function u(e,s={}){const r={...s.headers};!r["Content-Type"]&&s.body&&(r["Content-Type"]="application/json");const o=localStorage.getItem(E);o&&(r.Authorization="Bearer "+o);const a=await fetch(e,{...s,headers:r}),n=await a.text();let i=null;if(n)try{i=JSON.parse(n)}catch{i={error:n}}if(!a.ok){const d=i&&i.error?i.error:a.statusText;throw new Error(d)}return i}function F(){return localStorage.getItem(E)}function A(e){localStorage.setItem(E,e)}function T(){localStorage.removeItem(E)}function N(){T()}const t={screen:"home",user:null,classId:null,wordSetId:null,assignmentId:null,studyQueue:null,studyCards:null,studyIndex:0,showTranslation:!1,reviewErrorsOnly:!1,studyCorrect:0,studyChecked:!1,studyTyped:"",studyLastCorrect:!1,testQuestions:null,testAnswers:null,testIndex:0,testResults:null};function q(){t.studyQueue=null,t.studyCards=null,t.studyIndex=0,t.showTranslation=!1,t.reviewErrorsOnly=!1,t.studyCorrect=0,t.studyChecked=!1,t.studyTyped="",t.studyLastCorrect=!1}function C(){t.testQuestions=null,t.testAnswers=null,t.testIndex=0,t.testResults=null}function g(e){const s=document.createElement("template");return s.innerHTML=e.trim(),s.content.firstElementChild}function l(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function I(e){if(!e)return"—";try{return new Intl.DateTimeFormat("uk-UA",{year:"numeric",month:"short",day:"numeric"}).format(new Date(e))}catch{return e}}function Q(e){const s=e.slice();for(let r=s.length-1;r>0;r--){const o=Math.floor(Math.random()*(r+1));[s[r],s[o]]=[s[o],s[r]]}return s}function D(e){return String(e??"").trim().toLowerCase().replace(/\s+/g," ")}function O(e){return{not_started:"Не почато",in_progress:"У процесі",completed:"Завершено",know:"Знаю",almost:"Майже знаю",repeat:"Повторити",active:"Активне",draft:"Чернетка",closed:"Закрито",study:"Вивчення",test:"Тест",mixed:"Змішаний"}[e]||e}function R(e,s){e.replaceChildren(g(`
      <main class="box">
        <h1>Learnly</h1>
        <p class="hint">Навчальна платформа для вивчення слів: класи, завдання, картки та тести.</p>
        <div class="card-actions card-actions--stack">
          <button type="button" id="go-login" class="btn btn--primary btn--block">Увійти</button>
          <button type="button" id="go-register" class="btn btn--secondary btn--block">Реєстрація</button>
        </div>
      </main>
    `)),e.querySelector("#go-login").addEventListener("click",()=>s("login")),e.querySelector("#go-register").addEventListener("click",()=>s("register"))}function U(e,s){e.replaceChildren(g(`
      <main class="box">
        <h1>Вхід</h1>
        <form id="login-form" class="form">
          <label>Email <input name="email" type="email" autocomplete="username" required /></label>
          <label>Пароль <input name="password" type="password" autocomplete="current-password" required /></label>
          <button type="submit" class="btn btn--primary btn--block">Увійти</button>
        </form>
        <p class="hint"><button type="button" id="to-register" class="btn btn--ghost btn--sm">Немає акаунта? Зареєструватись</button></p>
        <p id="login-err" class="err" role="alert"></p>
      </main>
    `));const r=e.querySelector("#login-err");e.querySelector("#to-register").addEventListener("click",()=>s("register")),e.querySelector("#login-form").addEventListener("submit",async o=>{o.preventDefault(),r.textContent="";const a=new FormData(o.target);try{const n=await u("/api/auth/login",{method:"POST",body:JSON.stringify({email:String(a.get("email")||""),password:String(a.get("password")||"")})});A(n.token),t.user=n.user,s(n.user.role==="teacher"?"teacher-dashboard":"student-dashboard")}catch(n){r.textContent=n.message||"Помилка входу"}})}function z(e,s){e.replaceChildren(g(`
      <main class="box">
        <h1>Реєстрація</h1>
        <form id="register-form" class="form">
          <label>Ім'я <input name="name" type="text" required maxlength="100" /></label>
          <label>Email <input name="email" type="email" autocomplete="username" required /></label>
          <label>Пароль <input name="password" type="password" autocomplete="new-password" required minlength="6" /></label>
          <label>Роль
            <select name="role" required>
              <option value="student">Учень</option>
              <option value="teacher">Викладач</option>
            </select>
          </label>
          <button type="submit" class="btn btn--primary btn--block">Зареєструватись</button>
        </form>
        <p class="hint"><button type="button" id="to-login" class="btn btn--ghost btn--sm">Вже є акаунт? Увійти</button></p>
        <p id="reg-err" class="err" role="alert"></p>
      </main>
    `));const r=e.querySelector("#reg-err");e.querySelector("#to-login").addEventListener("click",()=>s("login")),e.querySelector("#register-form").addEventListener("submit",async o=>{o.preventDefault(),r.textContent="";const a=new FormData(o.target);try{await u("/api/auth/register",{method:"POST",body:JSON.stringify({name:String(a.get("name")||""),email:String(a.get("email")||""),password:String(a.get("password")||""),role:String(a.get("role")||"student")})});const n=await u("/api/auth/login",{method:"POST",body:JSON.stringify({email:String(a.get("email")||""),password:String(a.get("password")||"")})});A(n.token),t.user=n.user,s(n.user.role==="teacher"?"teacher-dashboard":"student-dashboard")}catch(n){r.textContent=n.message||"Помилка реєстрації"}})}function w(e,s,r=""){return g(`
    <header class="top">
      <div class="card-actions">
        ${r}
      </div>
    </header>
  `)}function B(e,s){const r=document.querySelector("#brand-account");if(r){if(!e){r.replaceChildren();return}r.replaceChildren(g(`
      <div class="brand__account-inner">
        <div class="brand__user">
          <span class="brand__name">${l(e.name)}</span>
          <span class="brand__role">${e.role==="teacher"?"Викладач":"Учень"} · ${l(e.email)}</span>
        </div>
        <button type="button" id="brand-logout" class="btn brand__logout btn--sm">Вийти</button>
      </div>
    `)),r.querySelector("#brand-logout").addEventListener("click",()=>{N(),t.user=null,s("home")})}}function S(e,s){var r;(r=e.querySelector("#logout"))==null||r.addEventListener("click",()=>{N(),t.user=null,s("home")})}const P=["English","Deutsch","Français","Español","Italiano","Polski","Українська"];async function M(e,s){const[r,o,a]=await Promise.all([u("/api/teacher/dashboard"),u("/api/classes"),u("/api/word-sets")]),n=(o||[]).map(c=>`<li class="set-row">
        <span class="set-title">${l(c.title)}</span>
        <span class="meta">${l(c.subject||"—")} · ${c.student_count||0} учнів · код: <strong>${l(c.class_code)}</strong></span>
        <button type="button" class="btn btn--primary btn--sm open-class" data-id="${c.id}">Відкрити</button>
      </li>`).join(""),i=(a||[]).map(c=>`<li class="set-row">
        <span class="set-title">${l(c.title)}</span>
        <span class="meta">${l(c.language||"—")} · ${c.card_count||0} карток</span>
        <button type="button" class="btn btn--primary btn--sm open-set" data-id="${c.id}">Відкрити</button>
      </li>`).join(""),d=g(`
    <main class="box box--wide box--deck">
      ${w(t.user,null,'<button type="button" id="toggle-add-class" class="btn btn--primary btn--sm">+ Створити клас</button>').outerHTML}
      <section class="deck-section">
        <h2 class="deck-heading">Кабінет викладача</h2>
        <p class="deck-hint">Класів: ${r.stats.class_count} · Активних завдань: ${r.stats.active_assignments} · Виконання: ${r.stats.completion_percent}%</p>
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
        ${n?`<ul class="sets">${n}</ul>`:'<p class="empty-msg">Ще немає класів.</p>'}
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
              ${P.map(c=>`<option value="${l(c)}">${l(c)}</option>`).join("")}
            </select>
            <button type="submit" class="btn btn--secondary btn--sm">Створити</button>
          </form>
          <p id="set-err" class="err"></p>
        </section>
        ${i?`<ul class="sets">${i}</ul>`:'<p class="empty-msg">Немає наборів.</p>'}
      </section>
    </main>
  `);e.replaceChildren(d),S(e,s),e.querySelector("#toggle-add-class").addEventListener("click",()=>{const c=e.querySelector("#add-class-box");c.hidden=!c.hidden,c.hidden||c.querySelector("[name=title]").focus()}),e.querySelector("#new-class-form").addEventListener("submit",async c=>{c.preventDefault();const b=e.querySelector("#class-err");b.textContent="";const m=new FormData(c.target),h=String(m.get("title")||"").trim();if(h.length<1||h.length>200){b.textContent="Назва класу має бути 1–200 символів";return}try{await u("/api/classes",{method:"POST",body:JSON.stringify({title:h,subject:String(m.get("subject")||"").trim(),description:String(m.get("description")||"").trim()})}),c.target.reset(),await M(e,s)}catch(k){b.textContent=k.message}}),e.querySelectorAll(".open-class").forEach(c=>{c.addEventListener("click",()=>{t.classId=Number(c.getAttribute("data-id")),s("teacher-class")})}),e.querySelector("#toggle-add-set").addEventListener("click",()=>{const c=e.querySelector("#add-set-box");c.hidden=!c.hidden,c.hidden||c.querySelector("[name=title]").focus()}),e.querySelector("#new-set-form").addEventListener("submit",async c=>{c.preventDefault();const b=e.querySelector("#set-err");b.textContent="";const m=new FormData(c.target),h=String(m.get("title")||"").trim(),k=String(m.get("language")||"").trim();if(h.length<1||h.length>200){b.textContent="Назва набору має бути 1–200 символів";return}if(!k){b.textContent="Оберіть мову набору";return}try{const $=await u("/api/word-sets",{method:"POST",body:JSON.stringify({title:h,language:k})});t.wordSetId=$.id,s("teacher-word-set")}catch($){b.textContent=$.message}}),e.querySelectorAll(".open-set").forEach(c=>{c.addEventListener("click",()=>{t.wordSetId=Number(c.getAttribute("data-id")),s("teacher-word-set")})})}async function H(e,s){const r=await u("/api/classes/"+t.classId),o=(r.students||[]).map(n=>`<li>${l(n.name)} (${l(n.email)})</li>`).join(""),a=(r.assignments||[]).map(n=>`<li class="set-row">
        <span class="set-title">${l(n.title)}</span>
        <span class="meta">${l(n.word_set_title)} · до ${I(n.deadline)} · ${O(n.mode)}</span>
      </li>`).join("");e.replaceChildren(g(`
      <main class="box box--wide box--deck">
        ${w(t.user,null,'<button type="button" id="back" class="btn btn--ghost btn--sm">← Кабінет</button><button type="button" id="new-assignment" class="btn btn--primary btn--sm">Завдання</button>').outerHTML}
        <div class="deck-section-head">
          <h2 class="deck-heading">${l(r.title)}</h2>
          <div>
            <button type="button" id="edit-class" class="btn btn--secondary btn--sm">Редагувати</button>
            <button type="button" id="delete-class" class="btn btn--ghost btn--sm">Видалити</button>
          </div>
        </div>
        <p class="deck-hint">${l(r.subject||"—")} · Код класу: <strong>${l(r.class_code)}</strong></p>
        ${r.description?`<p class="deck-hint">${l(r.description)}</p>`:""}
        <section class="add-word-box" id="edit-class-box" hidden>
          <p class="add-word-title">Редагувати клас</p>
          <form id="edit-class-form" class="form">
            <input name="title" placeholder="Назва класу" required maxlength="200" value="${l(r.title)}" />
            <input name="subject" placeholder="Предмет / мова" maxlength="100" value="${l(r.subject||"")}" />
            <input name="description" placeholder="Короткий опис" maxlength="300" value="${l(r.description||"")}" />
            <button type="submit" class="btn btn--secondary btn--sm">Зберегти</button>
          </form>
          <p id="edit-class-err" class="err"></p>
        </section>
        <section class="deck-section">
          <h3 class="deck-heading">Учні</h3>
          ${o?`<ul class="sets">${o}</ul>`:'<p class="empty-msg">Ще немає учнів.</p>'}
        </section>
        <section class="deck-section">
          <h3 class="deck-heading">Завдання</h3>
          ${a?`<ul class="sets">${a}</ul>`:'<p class="empty-msg">Завдань ще немає.</p>'}
        </section>
      </main>
    `)),S(e,s),e.querySelector("#back").addEventListener("click",()=>s("teacher-dashboard")),e.querySelector("#new-assignment").addEventListener("click",()=>s("teacher-create-assignment")),e.querySelector("#edit-class").addEventListener("click",()=>{const n=e.querySelector("#edit-class-box");n.hidden=!n.hidden,n.hidden||n.querySelector("[name=title]").focus()}),e.querySelector("#edit-class-form").addEventListener("submit",async n=>{n.preventDefault();const i=e.querySelector("#edit-class-err");i.textContent="";const d=new FormData(n.target),c=String(d.get("title")||"").trim();if(c.length<1||c.length>200){i.textContent="Назва класу має бути 1–200 символів";return}try{await u("/api/classes/"+t.classId,{method:"PUT",body:JSON.stringify({title:c,subject:String(d.get("subject")||"").trim(),description:String(d.get("description")||"").trim()})}),await H(e,s)}catch(b){i.textContent=b.message}}),e.querySelector("#delete-class").addEventListener("click",async()=>{if(window.confirm("Видалити клас разом з усіма завданнями та списком учнів?"))try{await u("/api/classes/"+t.classId,{method:"DELETE"}),s("teacher-dashboard")}catch(n){window.alert(n.message)}})}async function K(e,s){const o=(await u("/api/word-sets")||[]).map(a=>`<li class="set-row">
        <span class="set-title">${l(a.title)}</span>
        <span class="meta">${l(a.language||"—")} · ${a.card_count||0} карток</span>
        <button type="button" class="btn btn--primary btn--sm open-set" data-id="${a.id}">Відкрити</button>
      </li>`).join("");e.replaceChildren(g(`
      <main class="box box--wide box--deck">
        ${w(t.user,null,'<button type="button" id="back" class="btn btn--ghost btn--sm">← Кабінет</button><button type="button" id="toggle-add-set" class="btn btn--primary btn--sm">+ Додати набір</button>').outerHTML}
        <section class="deck-section">
          <h2 class="deck-heading">Набори слів</h2>
          <section class="add-word-box" id="add-set-box" hidden>
            <p class="add-word-title">Новий набір</p>
            <form id="new-set-form" class="form">
              <input name="title" placeholder="Назва набору" required maxlength="200" />
              <select name="language" required>
                <option value="" disabled selected>Оберіть мову</option>
                ${P.map(a=>`<option value="${l(a)}">${l(a)}</option>`).join("")}
              </select>
              <button type="submit" class="btn btn--secondary btn--sm">Створити</button>
            </form>
            <p id="set-err" class="err"></p>
          </section>
          ${o?`<ul class="sets">${o}</ul>`:'<p class="empty-msg">Немає наборів.</p>'}
        </section>
      </main>
    `)),S(e,s),e.querySelector("#back").addEventListener("click",()=>s("teacher-dashboard")),e.querySelector("#toggle-add-set").addEventListener("click",()=>{const a=e.querySelector("#add-set-box");a.hidden=!a.hidden,a.hidden||a.querySelector("[name=title]").focus()}),e.querySelector("#new-set-form").addEventListener("submit",async a=>{a.preventDefault();const n=e.querySelector("#set-err");n.textContent="";const i=new FormData(a.target),d=String(i.get("title")||"").trim(),c=String(i.get("language")||"").trim();if(d.length<1||d.length>200){n.textContent="Назва набору має бути 1–200 символів";return}if(!c){n.textContent="Оберіть мову набору";return}try{const b=await u("/api/word-sets",{method:"POST",body:JSON.stringify({title:d,language:c})});t.wordSetId=b.id,s("teacher-word-set")}catch(b){n.textContent=b.message}}),e.querySelectorAll(".open-set").forEach(a=>{a.addEventListener("click",()=>{t.wordSetId=Number(a.getAttribute("data-id")),s("teacher-word-set")})})}async function v(e,s){const[r,o]=await Promise.all([u("/api/word-sets/"+t.wordSetId),u("/api/word-sets/"+t.wordSetId+"/cards")]),a=(o||[]).map(n=>`<li class="set-row">
        ${n.image_url?`<img class="card-thumb" src="${l(n.image_url)}" alt="${l(n.word)}" />`:'<span class="card-thumb card-thumb--empty">🖼</span>'}
        <span class="set-title">${l(n.word)}</span>
        <span class="meta">${l(n.translation)}</span>
        <button type="button" class="btn btn--ghost btn--sm del-card" data-id="${n.id}">×</button>
      </li>`).join("");e.replaceChildren(g(`
      <main class="box box--wide box--deck">
        ${w(t.user,null,'<button type="button" id="back" class="btn btn--ghost btn--sm">← Кабінет</button><button type="button" id="toggle-add" class="btn btn--primary btn--sm">+ Додати слово</button>').outerHTML}
        <h2 class="deck-heading">${l(r.title)}</h2>
        <p class="deck-hint">${l(r.language)}</p>
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
        ${a?`<ul class="sets">${a}</ul>`:'<p class="empty-msg">Немає карток.</p>'}
      </main>
    `)),S(e,s),e.querySelector("#back").addEventListener("click",()=>s("teacher-dashboard")),e.querySelector("#toggle-add").addEventListener("click",()=>{const n=e.querySelector("#add-word-box");n.hidden=!n.hidden,n.hidden||n.querySelector("[name=word]").focus()}),e.querySelector("#add-card-form").addEventListener("submit",async n=>{n.preventDefault();const i=e.querySelector("#card-err");i.textContent="";const d=new FormData(n.target);try{await u("/api/word-sets/"+t.wordSetId+"/cards",{method:"POST",body:JSON.stringify({word:String(d.get("word")||""),translation:String(d.get("translation")||""),image_url:String(d.get("image_url")||"")})}),n.target.reset(),await v(e,s)}catch(c){i.textContent=c.message}}),e.querySelectorAll(".del-card").forEach(n=>{n.addEventListener("click",async()=>{window.confirm("Ви точно бажаєте видалити це слово?")&&(await u("/api/word-cards/"+n.getAttribute("data-id"),{method:"DELETE"}),await v(e,s))})})}async function G(e,s){const[r,o]=await Promise.all([u("/api/classes"),u("/api/word-sets")]),a=(r||[]).map(c=>`<option value="${c.id}">${l(c.title)}</option>`).join(""),n=(o||[]).map(c=>`<option value="${c.id}">${l(c.title)}</option>`).join(""),i=new Date().toISOString().slice(0,10),d=new Date(Date.now()+7*864e5).toISOString().slice(0,10);e.replaceChildren(g(`
      <main class="box box--wide">
        ${w(t.user,null,'<button type="button" id="back" class="btn btn--ghost btn--sm">← Клас</button>').outerHTML}
        <h2 class="deck-heading">Призначити завдання</h2>
        <form id="assign-form" class="form">
          <label>Клас <select name="class_id" required>${a}</select></label>
          <label>Набір слів <select name="word_set_id" required>${n}</select></label>
          <label>Назва <input name="title" required placeholder="Назва завдання" /></label>
          <label>Початок <input name="start_date" type="date" value="${i}" required /></label>
          <label>Дедлайн <input name="deadline" type="date" value="${d}" required /></label>
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
    `)),S(e,s),t.classId&&(e.querySelector("[name=class_id]").value=String(t.classId)),e.querySelector("#back").addEventListener("click",()=>s("teacher-class")),e.querySelector("#assign-form").addEventListener("submit",async c=>{c.preventDefault();const b=e.querySelector("#assign-err");b.textContent="";const m=new FormData(c.target);try{await u("/api/assignments",{method:"POST",body:JSON.stringify({class_id:Number(m.get("class_id")),word_set_id:Number(m.get("word_set_id")),title:String(m.get("title")||""),start_date:String(m.get("start_date")||""),deadline:String(m.get("deadline")||""),mode:String(m.get("mode")||"mixed")})}),t.classId=Number(m.get("class_id")),s("teacher-class")}catch(h){b.textContent=h.message}})}async function W(e,s){const[r,o]=await Promise.all([u("/api/classes"),u("/api/student/assignments")]),a=(r||[]).map(i=>`<li class="set-row">
        <span class="set-title">${l(i.title)}</span>
        <span class="meta">${l(i.teacher_name)} · код ${l(i.class_code)}</span>
      </li>`).join(""),n=(o||[]).map(i=>`<li class="set-row">
        <span class="set-title">${l(i.title)}</span>
        <span class="meta">${l(i.class_title)} · до ${I(i.deadline)} · ${O(i.student_status)}</span>
        <button type="button" class="btn btn--primary btn--sm open-assign" data-id="${i.id}" data-mode="${l(i.mode)}">Відкрити</button>
      </li>`).join("");e.replaceChildren(g(`
      <main class="box box--wide box--deck">
        ${w(t.user,null,'<button type="button" id="join" class="btn btn--secondary btn--sm">Приєднатись</button>').outerHTML}
        <section class="deck-section">
          <h2 class="deck-heading">Мої класи</h2>
          ${a?`<ul class="sets">${a}</ul>`:'<p class="empty-msg">Ви ще не в класі.</p>'}
        </section>
        <section class="deck-section">
          <h2 class="deck-heading">Активні завдання</h2>
          ${n?`<ul class="sets">${n}</ul>`:'<p class="empty-msg">Немає активних завдань.</p>'}
        </section>
      </main>
    `)),S(e,s),e.querySelector("#join").addEventListener("click",()=>s("student-join")),e.querySelectorAll(".open-assign").forEach(i=>{i.addEventListener("click",()=>{t.assignmentId=Number(i.getAttribute("data-id")),s("assignment-detail")})})}function Y(e,s){e.replaceChildren(g(`
      <main class="box">
        ${w(t.user,null,'<button type="button" id="back" class="btn btn--ghost btn--sm">← Кабінет</button>').outerHTML}
        <h2 class="deck-heading">Приєднатися до класу</h2>
        <form id="join-form" class="form">
          <label>Код класу <input name="class_code" placeholder="DEMO01" required maxlength="10" style="text-transform:uppercase" /></label>
          <button type="submit" class="btn btn--primary btn--block">Приєднатись</button>
        </form>
        <p id="join-err" class="err"></p>
      </main>
    `)),S(e,s),e.querySelector("#back").addEventListener("click",()=>s("student-dashboard")),e.querySelector("#join-form").addEventListener("submit",async r=>{r.preventDefault();const o=e.querySelector("#join-err");o.textContent="";const a=new FormData(r.target);try{await u("/api/classes/join",{method:"POST",body:JSON.stringify({class_code:String(a.get("class_code")||"").toUpperCase()})}),s("student-dashboard")}catch(n){o.textContent=n.message}})}async function V(e,s){var n,i,d;const r=await u("/api/assignments/"+t.assignmentId),o=r.mode==="study"||r.mode==="mixed",a=r.mode==="test"||r.mode==="mixed";e.replaceChildren(g(`
      <main class="box box--wide">
        ${w(t.user,null,'<button type="button" id="back" class="btn btn--ghost btn--sm">← Кабінет</button>').outerHTML}
        <h2 class="deck-heading">${l(r.title)}</h2>
        <p class="deck-hint">${l(r.class_title)} · ${l(r.word_set_title)} · до ${I(r.deadline)}</p>
        <p class="hint">Статус: ${O(r.student_status)} · Карток: ${r.card_count||0}</p>
        <div class="card-actions card-actions--stack">
          ${o?'<button type="button" id="go-study" class="btn btn--primary">Вписати переклади</button>':""}
          ${o?'<button type="button" id="go-review" class="btn btn--secondary">Повторити складні</button>':""}
          ${a?'<button type="button" id="go-test" class="btn btn--secondary">Пройти тест</button>':""}
        </div>
      </main>
    `)),S(e,s),e.querySelector("#back").addEventListener("click",()=>s("student-dashboard")),(n=e.querySelector("#go-study"))==null||n.addEventListener("click",()=>{q(),t.reviewErrorsOnly=!1,s("study")}),(i=e.querySelector("#go-review"))==null||i.addEventListener("click",()=>{q(),t.reviewErrorsOnly=!0,s("study")}),(d=e.querySelector("#go-test"))==null||d.addEventListener("click",()=>{C(),s("test")})}async function _(e,s){var h,k,$,j;let r;t.reviewErrorsOnly?r=(await u("/api/assignments/"+t.assignmentId+"/review-errors")).cards||[]:r=(await u("/api/assignments/"+t.assignmentId+"/study")).cards||[],t.studyCards||(t.studyCards=r,t.studyQueue=Q(r.map((f,x)=>x)),t.studyIndex=0,t.studyCorrect=0,t.studyChecked=!1,t.studyTyped="",t.studyLastCorrect=!1);const o=t.studyQueue,a=o.length,n=o[t.studyIndex],i=t.studyCards[n],d=!i||a===0,c=t.reviewErrorsOnly?"Повторення помилок":"Вписування перекладу";let b;if(d)if(a===0)b=`<p class="study-done-msg">Немає слів для проходження.</p>
        <button type="button" id="back-assign" class="btn btn--secondary">До завдання</button>`;else{const f=t.studyCorrect===a;b=`<p class="study-done-msg">${f?"Набір успішно завершено!":"Прохід завершено."}</p>
        <p class="study-done-counter">Правильних: <strong>${t.studyCorrect} / ${a}</strong></p>
        ${f?"":'<p class="study-hint study-hint--done">Помилки можна пропрацювати через «Повторити складні».</p>'}
        <button type="button" id="back-assign" class="btn btn--primary">До завдання</button>`}else if(t.studyChecked){const f=t.studyLastCorrect,x=t.studyIndex+1>=a;b=`
      <p class="counter">${t.studyIndex+1} / ${a}</p>
      ${i.image_url?`<img class="card-image" src="${l(i.image_url)}" alt="${l(i.word)}" />`:""}
      <p class="card-tr">${l(i.translation)}</p>
      <p class="feedback ${f?"feedback--ok":"feedback--bad"}">
        ${f?"Правильно!":"Неправильно"}
      </p>
      <p class="feedback-detail">Ваша відповідь: <strong>${l(t.studyTyped||"—")}</strong></p>
      ${f?"":`<p class="feedback-detail">Правильна відповідь: <strong>${l(i.word)}</strong></p>`}
      <div class="card-actions card-actions--stack">
        <button type="button" id="next" class="btn btn--primary">${x?"Завершити":"Далі"}</button>
      </div>`}else b=`
      <p class="counter">${t.studyIndex+1} / ${a}</p>
      ${i.image_url?`<img class="card-image" src="${l(i.image_url)}" alt="${l(i.word)}" />`:""}
      <p class="card-tr">${l(i.translation)}</p>
      <p class="study-hint">Впишіть слово відповідно до перекладу:</p>
      <form id="answer-form" class="study-answer">
        <input id="answer-input" type="text" class="study-input" autocomplete="off" autocapitalize="off"
          spellcheck="false" placeholder="Ваша відповідь" />
        <button type="submit" class="btn btn--primary btn--block">Перевірити</button>
      </form>`;e.replaceChildren(g(`
      <main class="box box--wide">
        ${w(t.user,null,'<button type="button" id="back" class="btn btn--ghost btn--sm">← Завдання</button>').outerHTML}
        <h2 class="deck-heading">${c}</h2>
        ${b}
      </main>
    `)),S(e,s),(h=e.querySelector("#back"))==null||h.addEventListener("click",()=>{q(),s("assignment-detail")}),(k=e.querySelector("#back-assign"))==null||k.addEventListener("click",()=>{q(),s("assignment-detail")});const m=e.querySelector("#answer-input");m==null||m.focus(),($=e.querySelector("#answer-form"))==null||$.addEventListener("submit",async f=>{f.preventDefault();const x=m?m.value:"",L=D(x)===D(i.word);t.studyTyped=x.trim(),t.studyLastCorrect=L,t.studyChecked=!0,L&&(t.studyCorrect+=1);try{await u("/api/assignments/"+t.assignmentId+"/progress",{method:"POST",body:JSON.stringify({word_card_id:i.id,status:L?"know":"repeat"})})}catch{}_(e,s)}),(j=e.querySelector("#next"))==null||j.addEventListener("click",()=>{t.studyIndex+=1,t.studyChecked=!1,t.studyTyped="",t.studyLastCorrect=!1,_(e,s)})}async function J(e,s){var i;if(!t.testQuestions){const d=await u("/api/assignments/"+t.assignmentId+"/test");t.testQuestions=d.questions||[],t.testAnswers=[],t.testIndex=0}const r=t.testQuestions,o=t.testIndex,a=r[o];if(!a){const d=t.testAnswers;try{const c=await u("/api/assignments/"+t.assignmentId+"/test/submit",{method:"POST",body:JSON.stringify({answers:d})});t.testResults=c,C(),s("test-results")}catch(c){e.replaceChildren(g(`<main class="box"><p class="err">${l(c.message)}</p></main>`))}return}const n=(a.options||[]).map((d,c)=>`<button type="button" class="btn btn--secondary btn--block test-opt" data-idx="${c}">${l(d)}</button>`).join("");e.replaceChildren(g(`
      <main class="box box--wide">
        ${w(t.user,null,'<button type="button" id="back" class="btn btn--ghost btn--sm">Скасувати</button>').outerHTML}
        <p class="counter">Питання ${o+1} / ${r.length}</p>
        <p class="card-term">${l(a.word)}</p>
        <p class="hint">Оберіть правильний переклад:</p>
        <div class="card-actions card-actions--stack">${n}</div>
      </main>
    `)),S(e,s),(i=e.querySelector("#back"))==null||i.addEventListener("click",()=>{C(),s("assignment-detail")}),e.querySelectorAll(".test-opt").forEach(d=>{d.addEventListener("click",()=>{const c=Number(d.getAttribute("data-idx"));t.testAnswers.push({word_card_id:a.word_card_id,selected_translation:a.options[c]}),t.testIndex+=1,J(e,s)})})}function X(e,s){const r=t.testResults,o=(r.wrong_words||[]).map(a=>`<li>${l(a.word)} — правильно: ${l(a.correct_translation)}</li>`).join("");e.replaceChildren(g(`
      <main class="box box--wide">
        ${w(t.user,null,'<button type="button" id="back" class="btn btn--ghost btn--sm">← Кабінет</button>').outerHTML}
        <h2 class="deck-heading">Результат тесту</h2>
        <p class="study-done-msg">Бал: <strong>${r.score}%</strong> (${r.correct_answers}/${r.total})</p>
        ${o?`<section class="deck-section"><h3 class="deck-heading">Слова для повторення</h3><ul class="sets">${o}</ul></section>`:'<p class="hint">Усі відповіді правильні!</p>'}
        <button type="button" id="done" class="btn btn--primary">Готово</button>
      </main>
    `)),S(e,s),e.querySelector("#back").addEventListener("click",()=>s("student-dashboard")),e.querySelector("#done").addEventListener("click",()=>{t.testResults=null,s("student-dashboard")})}const y=document.querySelector("#app");function p(e,s={}){Object.assign(t,s),t.screen=e,Z()}async function Z(){try{switch(B(t.user,p),t.screen){case"home":R(y,p);break;case"login":U(y,p);break;case"register":z(y,p);break;case"teacher-dashboard":await M(y,p);break;case"teacher-class":await H(y,p);break;case"teacher-word-sets":await K(y,p);break;case"teacher-word-set":await v(y,p);break;case"teacher-create-assignment":await G(y,p);break;case"student-dashboard":await W(y,p);break;case"student-join":Y(y,p);break;case"assignment-detail":await V(y,p);break;case"study":await _(y,p);break;case"test":await J(y,p);break;case"test-results":X(y,p);break;default:p("home")}}catch(e){if(e.message==="Потрібен токен"||e.message==="Недійсний токен"){T(),t.user=null,p("login");return}y.replaceChildren(document.createElement("main")),y.querySelector("main").className="box",y.querySelector("main").innerHTML=`<p class="err">${e.message||"Помилка"}</p>`}}async function ee(){if(F())try{t.user=await u("/api/auth/me"),p(t.user.role==="teacher"?"teacher-dashboard":"student-dashboard");return}catch{T()}p("home")}ee();
