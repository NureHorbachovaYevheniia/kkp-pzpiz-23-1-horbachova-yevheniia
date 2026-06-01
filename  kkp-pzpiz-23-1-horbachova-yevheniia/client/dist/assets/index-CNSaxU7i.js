(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const l of r)if(l.type==="childList")for(const i of l.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function c(r){const l={};return r.integrity&&(l.integrity=r.integrity),r.referrerPolicy&&(l.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?l.credentials="include":r.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function o(r){if(r.ep)return;r.ep=!0;const l=c(r);fetch(r.href,l)}})();const E="learnly_token";async function b(t,n={}){const c={...n.headers};!c["Content-Type"]&&n.body&&(c["Content-Type"]="application/json");const o=localStorage.getItem(E);o&&(c.Authorization="Bearer "+o);const r=await fetch(t,{...n,headers:c}),l=await r.text();let i=null;if(l)try{i=JSON.parse(l)}catch{i={error:l}}if(!r.ok){const u=i&&i.error?i.error:r.statusText;throw new Error(u)}return i}function z(){return localStorage.getItem(E)}function M(t){localStorage.setItem(E,t)}function N(){localStorage.removeItem(E)}function H(){N()}const a={screen:"home",user:null,classId:null,wordSetId:null,assignmentId:null,studyQueue:null,studyCards:null,studyIndex:0,showTranslation:!1,reviewErrorsOnly:!1,studyCorrect:0,studyChecked:!1,studyTyped:"",studyLastCorrect:!1,testQuestions:null,testAnswers:null,testIndex:0,testResults:null};function q(){a.studyQueue=null,a.studyCards=null,a.studyIndex=0,a.showTranslation=!1,a.reviewErrorsOnly=!1,a.studyCorrect=0,a.studyChecked=!1,a.studyTyped="",a.studyLastCorrect=!1}function _(){a.testQuestions=null,a.testAnswers=null,a.testIndex=0,a.testResults=null}const J="learnly_locale",A={uk:{"brand.tag":"навчальна платформа","lang.uk":"UA","lang.en":"EN","lang.switch":"Мова інтерфейсу","btn.login":"Увійти","btn.register":"Реєстрація","btn.logout":"Вийти","btn.open":"Відкрити","btn.create":"Створити","btn.save":"Зберегти","btn.backCabinet":"← Кабінет","btn.backClass":"← Клас","btn.backAssignment":"← Завдання","btn.join":"Приєднатись","btn.next":"Далі","btn.finish":"Завершити","btn.check":"Перевірити","btn.done":"Готово","btn.cancel":"Скасувати","label.email":"Email","label.password":"Пароль","label.name":"Ім'я","label.role":"Роль","label.classCode":"Код класу","role.student":"Учень","role.teacher":"Викладач","error.login":"Помилка входу","error.register":"Помилка реєстрації","error.generic":"Помилка","error.tokenRequired":"Потрібен токен","error.tokenInvalid":"Недійсний токен","home.hint":"Навчальна платформа для вивчення слів: класи, завдання, картки та тести.","login.title":"Вхід","login.noAccount":"Немає акаунта? Зареєструватись","register.title":"Реєстрація","register.hasAccount":"Вже є акаунт? Увійти","register.submit":"Зареєструватись","teacher.dashboard.title":"Кабінет викладача","teacher.dashboard.stats":"Класів: {classes} · Активних завдань: {assignments} · Виконання: {percent}%","teacher.myClasses":"Мої класи","teacher.wordSets":"Набори слів","teacher.createClass":"+ Створити клас","teacher.addSet":"+ Додати набір","teacher.newClass":"Новий клас","teacher.newSet":"Новий набір","teacher.noClasses":"Ще немає класів.","teacher.noSets":"Немає наборів.","teacher.classMeta":"{subject} · {count} учнів · код: {code}","teacher.setMeta":"{language} · {count} карток","teacher.placeholder.classTitle":"Назва класу","teacher.placeholder.subject":"Предмет / мова","teacher.placeholder.description":"Короткий опис","teacher.placeholder.setTitle":"Назва набору","teacher.placeholder.selectLanguage":"Оберіть мову","teacher.err.classTitle":"Назва класу має бути 1–200 символів","teacher.err.setTitle":"Назва набору має бути 1–200 символів","teacher.err.setLanguage":"Оберіть мову набору","teacher.classCode":"Код класу","teacher.students":"Учні","teacher.noStudents":"Ще немає учнів.","teacher.assignments":"Завдання","teacher.noAssignments":"Завдань ще немає.","teacher.editClass":"Редагувати","teacher.deleteClass":"Видалити","teacher.editClassTitle":"Редагувати клас","teacher.deleteClassConfirm":"Видалити клас разом з усіма завданнями та списком учнів?","teacher.newAssignment":"Завдання","teacher.deadlineUntil":"до {date}","teacher.addWord":"+ Додати слово","teacher.addCard":"Додати картку","teacher.placeholder.word":"Слово","teacher.placeholder.translation":"Переклад","teacher.placeholder.imageUrl":"Посилання на фото (необов'язково)","teacher.btn.add":"Додати","teacher.noCards":"Немає карток.","teacher.deleteCardConfirm":"Ви точно бажаєте видалити це слово?","teacher.assign.title":"Призначити завдання","teacher.assign.class":"Клас","teacher.assign.wordSet":"Набір слів","teacher.assign.name":"Назва","teacher.assign.namePlaceholder":"Назва завдання","teacher.assign.start":"Початок","teacher.assign.deadline":"Дедлайн","teacher.assign.mode":"Режим","teacher.assign.submit":"Створити завдання","student.activeAssignments":"Активні завдання","student.noAssignments":"Немає активних завдань.","student.joinBtn":"Приєднатись","student.joinTitle":"Приєднатися до класу","student.assignment.status":"Статус: {status} · Карток: {count}","student.assignment.study":"Вчити слова","student.assignment.review":"Повторити складні","student.assignment.test":"Пройти тест","student.study.reviewTitle":"Повторення помилок","student.study.title":"Вчити слова","student.study.noWords":"Немає слів для проходження.","student.study.back":"До завдання","student.study.doneAll":"Набір успішно завершено!","student.study.donePartial":"Прохід завершено.","student.study.correctLabel":"Правильних","student.study.reviewHint":"Помилки можна пропрацювати через «Повторити складні».","student.study.correct":"Правильно!","student.study.incorrect":"Неправильно","student.study.yourAnswerLabel":"Ваша відповідь","student.study.correctAnswerLabel":"Правильна відповідь","student.study.prompt":"Впишіть слово відповідно до перекладу:","student.study.answerPlaceholder":"Ваша відповідь","student.test.question":"Питання {current} / {total}","student.test.pickTranslation":"Оберіть правильний переклад:","student.testResults.title":"Результат тесту","student.testResults.scoreLabel":"Бал","student.testResults.reviewWords":"Слова для повторення","student.testResults.allCorrect":"Усі відповіді правильні!","student.testResults.wrongLine":"{word} — правильно: {translation}","status.not_started":"Не почато","status.in_progress":"У процесі","status.completed":"Завершено","status.know":"Знаю","status.almost":"Майже знаю","status.repeat":"Повторити","status.active":"Активне","status.draft":"Чернетка","status.closed":"Закрито","status.study":"Вивчення","status.test":"Тест","status.mixed":"Змішаний"},en:{"brand.tag":"learning platform","lang.uk":"UA","lang.en":"EN","lang.switch":"Interface language","btn.login":"Log in","btn.register":"Sign up","btn.logout":"Log out","btn.open":"Open","btn.create":"Create","btn.save":"Save","btn.backCabinet":"← Dashboard","btn.backClass":"← Class","btn.backAssignment":"← Assignment","btn.join":"Join","btn.next":"Next","btn.finish":"Finish","btn.check":"Check","btn.done":"Done","btn.cancel":"Cancel","label.email":"Email","label.password":"Password","label.name":"Name","label.role":"Role","label.classCode":"Class code","role.student":"Student","role.teacher":"Teacher","error.login":"Login failed","error.register":"Registration failed","error.generic":"Error","error.tokenRequired":"Token required","error.tokenInvalid":"Invalid token","home.hint":"A platform for learning vocabulary: classes, assignments, flashcards, and tests.","login.title":"Log in","login.noAccount":"Don't have an account? Sign up","register.title":"Sign up","register.hasAccount":"Already have an account? Log in","register.submit":"Sign up","teacher.dashboard.title":"Teacher dashboard","teacher.dashboard.stats":"Classes: {classes} · Active assignments: {assignments} · Completion: {percent}%","teacher.myClasses":"My classes","teacher.wordSets":"Word sets","teacher.createClass":"+ Create class","teacher.addSet":"+ Add set","teacher.newClass":"New class","teacher.newSet":"New set","teacher.noClasses":"No classes yet.","teacher.noSets":"No word sets yet.","teacher.classMeta":"{subject} · {count} students · code: {code}","teacher.setMeta":"{language} · {count} cards","teacher.placeholder.classTitle":"Class name","teacher.placeholder.subject":"Subject / language","teacher.placeholder.description":"Short description","teacher.placeholder.setTitle":"Set name","teacher.placeholder.selectLanguage":"Choose language","teacher.err.classTitle":"Class name must be 1–200 characters","teacher.err.setTitle":"Set name must be 1–200 characters","teacher.err.setLanguage":"Choose a language for the set","teacher.classCode":"Class code","teacher.students":"Students","teacher.noStudents":"No students yet.","teacher.assignments":"Assignments","teacher.noAssignments":"No assignments yet.","teacher.editClass":"Edit","teacher.deleteClass":"Delete","teacher.editClassTitle":"Edit class","teacher.deleteClassConfirm":"Delete this class with all assignments and the student list?","teacher.newAssignment":"Assignment","teacher.deadlineUntil":"due {date}","teacher.addWord":"+ Add word","teacher.addCard":"Add card","teacher.placeholder.word":"Word","teacher.placeholder.translation":"Translation","teacher.placeholder.imageUrl":"Image URL (optional)","teacher.btn.add":"Add","teacher.noCards":"No cards yet.","teacher.deleteCardConfirm":"Delete this word?","teacher.assign.title":"Create assignment","teacher.assign.class":"Class","teacher.assign.wordSet":"Word set","teacher.assign.name":"Title","teacher.assign.namePlaceholder":"Assignment title","teacher.assign.start":"Start date","teacher.assign.deadline":"Deadline","teacher.assign.mode":"Mode","teacher.assign.submit":"Create assignment","student.activeAssignments":"Active assignments","student.noAssignments":"No active assignments.","student.joinBtn":"Join class","student.joinTitle":"Join a class","student.assignment.status":"Status: {status} · Cards: {count}","student.assignment.study":"Study words","student.assignment.review":"Review mistakes","student.assignment.test":"Take test","student.study.reviewTitle":"Review mistakes","student.study.title":"Study words","student.study.noWords":"No words to practice.","student.study.back":"Back to assignment","student.study.doneAll":"Set completed successfully!","student.study.donePartial":"Session complete.","student.study.correctLabel":"Correct","student.study.reviewHint":"You can review mistakes via “Review mistakes”.","student.study.correct":"Correct!","student.study.incorrect":"Incorrect","student.study.yourAnswerLabel":"Your answer","student.study.correctAnswerLabel":"Correct answer","student.study.prompt":"Type the word for this translation:","student.study.answerPlaceholder":"Your answer","student.test.question":"Question {current} / {total}","student.test.pickTranslation":"Choose the correct translation:","student.testResults.title":"Test results","student.testResults.scoreLabel":"Score","student.testResults.reviewWords":"Words to review","student.testResults.allCorrect":"All answers correct!","student.testResults.wrongLine":"{word} — correct: {translation}","status.not_started":"Not started","status.in_progress":"In progress","status.completed":"Completed","status.know":"Know","status.almost":"Almost","status.repeat":"Review","status.active":"Active","status.draft":"Draft","status.closed":"Closed","status.study":"Study","status.test":"Test","status.mixed":"Mixed"}};let $="uk";const I=new Set;function G(){return $==="en"?"en-GB":"uk-UA"}function s(t,n={}){let o=(A[$]||A.uk)[t]??A.uk[t]??t;for(const[r,l]of Object.entries(n))o=o.replaceAll(`{${r}}`,String(l));return o}function V(t){t!=="uk"&&t!=="en"||$!==t&&($=t,localStorage.setItem(J,$),document.documentElement.lang=$==="en"?"en":"uk",I.forEach(n=>n($)))}function U(t){return I.add(t),()=>I.delete(t)}function X(){const t=localStorage.getItem(J);(t==="uk"||t==="en")&&($=t),document.documentElement.lang=$==="en"?"en":"uk"}function W(){const t=document.querySelector(".brand__tag");t&&(t.textContent=s("brand.tag"))}function Z(t){if(!t)return;const n=()=>{t.replaceChildren();const c=document.createElement("div");c.className="lang-switcher",c.setAttribute("role","group"),c.setAttribute("aria-label",s("lang.switch"));for(const o of["uk","en"]){const r=document.createElement("button");r.type="button",r.className="lang-switcher__btn"+($===o?" lang-switcher__btn--active":""),r.textContent=s(o==="uk"?"lang.uk":"lang.en"),r.setAttribute("aria-pressed",$===o?"true":"false"),r.addEventListener("click",()=>V(o)),c.appendChild(r)}t.appendChild(c)};n(),U(n)}function g(t){const n=document.createElement("template");return n.innerHTML=t.trim(),n.content.firstElementChild}function e(t){return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function D(t){if(!t)return"—";try{return new Intl.DateTimeFormat(G(),{year:"numeric",month:"short",day:"numeric"}).format(new Date(t))}catch{return t}}function ee(t){const n=t.slice();for(let c=n.length-1;c>0;c--){const o=Math.floor(Math.random()*(c+1));[n[c],n[o]]=[n[o],n[c]]}return n}function P(t){return String(t??"").trim().toLowerCase().replace(/\s+/g," ")}function v(t){const n="status."+t,c=s(n);return c===n?t:c}function te(t,n){t.replaceChildren(g(`
      <main class="box">
        <h1>Learnly</h1>
        <p class="hint">${e(s("home.hint"))}</p>
        <div class="card-actions card-actions--stack">
          <button type="button" id="go-login" class="btn btn--primary btn--block">${e(s("btn.login"))}</button>
          <button type="button" id="go-register" class="btn btn--secondary btn--block">${e(s("btn.register"))}</button>
        </div>
      </main>
    `)),t.querySelector("#go-login").addEventListener("click",()=>n("login")),t.querySelector("#go-register").addEventListener("click",()=>n("register"))}function se(t,n){t.replaceChildren(g(`
      <main class="box">
        <h1>${e(s("login.title"))}</h1>
        <form id="login-form" class="form">
          <label>${e(s("label.email"))} <input name="email" type="email" autocomplete="username" required /></label>
          <label>${e(s("label.password"))} <input name="password" type="password" autocomplete="current-password" required /></label>
          <button type="submit" class="btn btn--primary btn--block">${e(s("btn.login"))}</button>
        </form>
        <p class="hint"><button type="button" id="to-register" class="btn btn--ghost btn--sm">${e(s("login.noAccount"))}</button></p>
        <p id="login-err" class="err" role="alert"></p>
      </main>
    `));const c=t.querySelector("#login-err");t.querySelector("#to-register").addEventListener("click",()=>n("register")),t.querySelector("#login-form").addEventListener("submit",async o=>{o.preventDefault(),c.textContent="";const r=new FormData(o.target);try{const l=await b("/api/auth/login",{method:"POST",body:JSON.stringify({email:String(r.get("email")||""),password:String(r.get("password")||"")})});M(l.token),a.user=l.user,n(l.user.role==="teacher"?"teacher-dashboard":"student-dashboard")}catch(l){c.textContent=l.message||s("error.login")}})}function ne(t,n){t.replaceChildren(g(`
      <main class="box">
        <h1>${e(s("register.title"))}</h1>
        <form id="register-form" class="form">
          <label>${e(s("label.name"))} <input name="name" type="text" required maxlength="100" /></label>
          <label>${e(s("label.email"))} <input name="email" type="email" autocomplete="username" required /></label>
          <label>${e(s("label.password"))} <input name="password" type="password" autocomplete="new-password" required minlength="6" /></label>
          <label>${e(s("label.role"))}
            <select name="role" required>
              <option value="student">${e(s("role.student"))}</option>
              <option value="teacher">${e(s("role.teacher"))}</option>
            </select>
          </label>
          <button type="submit" class="btn btn--primary btn--block">${e(s("register.submit"))}</button>
        </form>
        <p class="hint"><button type="button" id="to-login" class="btn btn--ghost btn--sm">${e(s("register.hasAccount"))}</button></p>
        <p id="reg-err" class="err" role="alert"></p>
      </main>
    `));const c=t.querySelector("#reg-err");t.querySelector("#to-login").addEventListener("click",()=>n("login")),t.querySelector("#register-form").addEventListener("submit",async o=>{o.preventDefault(),c.textContent="";const r=new FormData(o.target);try{await b("/api/auth/register",{method:"POST",body:JSON.stringify({name:String(r.get("name")||""),email:String(r.get("email")||""),password:String(r.get("password")||""),role:String(r.get("role")||"student")})});const l=await b("/api/auth/login",{method:"POST",body:JSON.stringify({email:String(r.get("email")||""),password:String(r.get("password")||"")})});M(l.token),a.user=l.user,n(l.user.role==="teacher"?"teacher-dashboard":"student-dashboard")}catch(l){c.textContent=l.message||s("error.register")}})}function S(t,n,c=""){return g(`
    <header class="top">
      <div class="card-actions">
        ${c}
      </div>
    </header>
  `)}function ae(t,n){const c=document.querySelector("#brand-account");if(!c)return;if(!t){c.replaceChildren();return}const o=t.role==="teacher"?s("role.teacher"):s("role.student");c.replaceChildren(g(`
      <div class="brand__account-inner">
        <div class="brand__user">
          <span class="brand__name">${e(t.name)}</span>
          <span class="brand__role">${e(o)} · ${e(t.email)}</span>
        </div>
        <button type="button" id="brand-logout" class="btn brand__logout btn--sm">${e(s("btn.logout"))}</button>
      </div>
    `)),c.querySelector("#brand-logout").addEventListener("click",()=>{H(),a.user=null,n("home")})}function k(t,n){var c;(c=t.querySelector("#logout"))==null||c.addEventListener("click",()=>{H(),a.user=null,n("home")})}const F=["English","Deutsch","Français","Español","Italiano","Polski","Українська"];async function Q(t,n){const[c,o,r]=await Promise.all([b("/api/teacher/dashboard"),b("/api/classes"),b("/api/word-sets")]),l=(o||[]).map(d=>`<li class="set-row">
        <span class="set-title">${e(d.title)}</span>
        <span class="meta">${e(s("teacher.classMeta",{subject:d.subject||"—",count:d.student_count||0,code:d.class_code}))}</span>
        <button type="button" class="btn btn--primary btn--sm open-class" data-id="${d.id}">${e(s("btn.open"))}</button>
      </li>`).join(""),i=(r||[]).map(d=>`<li class="set-row">
        <span class="set-title">${e(d.title)}</span>
        <span class="meta">${e(s("teacher.setMeta",{language:d.language||"—",count:d.card_count||0}))}</span>
        <button type="button" class="btn btn--primary btn--sm open-set" data-id="${d.id}">${e(s("btn.open"))}</button>
      </li>`).join(""),u=g(`
    <main class="box box--wide box--deck">
      ${S(a.user,null,`<button type="button" id="toggle-add-class" class="btn btn--primary btn--sm">${e(s("teacher.createClass"))}</button>`).outerHTML}
      <section class="deck-section">
        <h2 class="deck-heading">${e(s("teacher.dashboard.title"))}</h2>
        <p class="deck-hint">${e(s("teacher.dashboard.stats",{classes:c.stats.class_count,assignments:c.stats.active_assignments,percent:c.stats.completion_percent}))}</p>
      </section>
      <section class="deck-section">
        <h2 class="deck-heading">${e(s("teacher.myClasses"))}</h2>
        <section class="add-word-box" id="add-class-box" hidden>
          <p class="add-word-title">${e(s("teacher.newClass"))}</p>
          <form id="new-class-form" class="form">
            <input name="title" placeholder="${e(s("teacher.placeholder.classTitle"))}" required maxlength="200" />
            <input name="subject" placeholder="${e(s("teacher.placeholder.subject"))}" maxlength="100" />
            <input name="description" placeholder="${e(s("teacher.placeholder.description"))}" maxlength="300" />
            <button type="submit" class="btn btn--secondary btn--sm">${e(s("btn.create"))}</button>
          </form>
          <p id="class-err" class="err"></p>
        </section>
        ${l?`<ul class="sets">${l}</ul>`:`<p class="empty-msg">${e(s("teacher.noClasses"))}</p>`}
      </section>
      <section class="deck-section">
        <div class="deck-section-head">
          <h2 class="deck-heading">${e(s("teacher.wordSets"))}</h2>
          <button type="button" id="toggle-add-set" class="btn btn--secondary btn--sm">${e(s("teacher.addSet"))}</button>
        </div>
        <section class="add-word-box" id="add-set-box" hidden>
          <p class="add-word-title">${e(s("teacher.newSet"))}</p>
          <form id="new-set-form" class="form">
            <input name="title" placeholder="${e(s("teacher.placeholder.setTitle"))}" required maxlength="200" />
            <select name="language" required>
              <option value="" disabled selected>${e(s("teacher.placeholder.selectLanguage"))}</option>
              ${F.map(d=>`<option value="${e(d)}">${e(d)}</option>`).join("")}
            </select>
            <button type="submit" class="btn btn--secondary btn--sm">${e(s("btn.create"))}</button>
          </form>
          <p id="set-err" class="err"></p>
        </section>
        ${i?`<ul class="sets">${i}</ul>`:`<p class="empty-msg">${e(s("teacher.noSets"))}</p>`}
      </section>
    </main>
  `);t.replaceChildren(u),k(t,n),t.querySelector("#toggle-add-class").addEventListener("click",()=>{const d=t.querySelector("#add-class-box");d.hidden=!d.hidden,d.hidden||d.querySelector("[name=title]").focus()}),t.querySelector("#new-class-form").addEventListener("submit",async d=>{d.preventDefault();const m=t.querySelector("#class-err");m.textContent="";const h=new FormData(d.target),w=String(h.get("title")||"").trim();if(w.length<1||w.length>200){m.textContent=s("teacher.err.classTitle");return}try{await b("/api/classes",{method:"POST",body:JSON.stringify({title:w,subject:String(h.get("subject")||"").trim(),description:String(h.get("description")||"").trim()})}),d.target.reset(),await Q(t,n)}catch(C){m.textContent=C.message}}),t.querySelectorAll(".open-class").forEach(d=>{d.addEventListener("click",()=>{a.classId=Number(d.getAttribute("data-id")),n("teacher-class")})}),t.querySelector("#toggle-add-set").addEventListener("click",()=>{const d=t.querySelector("#add-set-box");d.hidden=!d.hidden,d.hidden||d.querySelector("[name=title]").focus()}),t.querySelector("#new-set-form").addEventListener("submit",async d=>{d.preventDefault();const m=t.querySelector("#set-err");m.textContent="";const h=new FormData(d.target),w=String(h.get("title")||"").trim(),C=String(h.get("language")||"").trim();if(w.length<1||w.length>200){m.textContent=s("teacher.err.setTitle");return}if(!C){m.textContent=s("teacher.err.setLanguage");return}try{const x=await b("/api/word-sets",{method:"POST",body:JSON.stringify({title:w,language:C})});a.wordSetId=x.id,n("teacher-word-set")}catch(x){m.textContent=x.message}}),t.querySelectorAll(".open-set").forEach(d=>{d.addEventListener("click",()=>{a.wordSetId=Number(d.getAttribute("data-id")),n("teacher-word-set")})})}async function B(t,n){const c=await b("/api/classes/"+a.classId),o=(c.students||[]).map(l=>`<li>${e(l.name)} (${e(l.email)})</li>`).join(""),r=(c.assignments||[]).map(l=>`<li class="set-row">
        <span class="set-title">${e(l.title)}</span>
        <span class="meta">${e(l.word_set_title)} · ${e(s("teacher.deadlineUntil",{date:D(l.deadline)}))} · ${e(v(l.mode))}</span>
      </li>`).join("");t.replaceChildren(g(`
      <main class="box box--wide box--deck">
        ${S(a.user,null,`<button type="button" id="back" class="btn btn--ghost btn--sm">${e(s("btn.backCabinet"))}</button><button type="button" id="new-assignment" class="btn btn--primary btn--sm">${e(s("teacher.newAssignment"))}</button>`).outerHTML}
        <div class="deck-section-head">
          <h2 class="deck-heading">${e(c.title)}</h2>
          <div>
            <button type="button" id="edit-class" class="btn btn--secondary btn--sm">${e(s("teacher.editClass"))}</button>
            <button type="button" id="delete-class" class="btn btn--ghost btn--sm">${e(s("teacher.deleteClass"))}</button>
          </div>
        </div>
        <p class="deck-hint">${e(c.subject||"—")} · ${e(s("teacher.classCode"))}: <strong>${e(c.class_code)}</strong></p>
        ${c.description?`<p class="deck-hint">${e(c.description)}</p>`:""}
        <section class="add-word-box" id="edit-class-box" hidden>
          <p class="add-word-title">${e(s("teacher.editClassTitle"))}</p>
          <form id="edit-class-form" class="form">
            <input name="title" placeholder="${e(s("teacher.placeholder.classTitle"))}" required maxlength="200" value="${e(c.title)}" />
            <input name="subject" placeholder="${e(s("teacher.placeholder.subject"))}" maxlength="100" value="${e(c.subject||"")}" />
            <input name="description" placeholder="${e(s("teacher.placeholder.description"))}" maxlength="300" value="${e(c.description||"")}" />
            <button type="submit" class="btn btn--secondary btn--sm">${e(s("btn.save"))}</button>
          </form>
          <p id="edit-class-err" class="err"></p>
        </section>
        <section class="deck-section">
          <h3 class="deck-heading">${e(s("teacher.students"))}</h3>
          ${o?`<ul class="sets">${o}</ul>`:`<p class="empty-msg">${e(s("teacher.noStudents"))}</p>`}
        </section>
        <section class="deck-section">
          <h3 class="deck-heading">${e(s("teacher.assignments"))}</h3>
          ${r?`<ul class="sets">${r}</ul>`:`<p class="empty-msg">${e(s("teacher.noAssignments"))}</p>`}
        </section>
      </main>
    `)),k(t,n),t.querySelector("#back").addEventListener("click",()=>n("teacher-dashboard")),t.querySelector("#new-assignment").addEventListener("click",()=>n("teacher-create-assignment")),t.querySelector("#edit-class").addEventListener("click",()=>{const l=t.querySelector("#edit-class-box");l.hidden=!l.hidden,l.hidden||l.querySelector("[name=title]").focus()}),t.querySelector("#edit-class-form").addEventListener("submit",async l=>{l.preventDefault();const i=t.querySelector("#edit-class-err");i.textContent="";const u=new FormData(l.target),d=String(u.get("title")||"").trim();if(d.length<1||d.length>200){i.textContent=s("teacher.err.classTitle");return}try{await b("/api/classes/"+a.classId,{method:"PUT",body:JSON.stringify({title:d,subject:String(u.get("subject")||"").trim(),description:String(u.get("description")||"").trim()})}),await B(t,n)}catch(m){i.textContent=m.message}}),t.querySelector("#delete-class").addEventListener("click",async()=>{if(window.confirm(s("teacher.deleteClassConfirm")))try{await b("/api/classes/"+a.classId,{method:"DELETE"}),n("teacher-dashboard")}catch(l){window.alert(l.message)}})}async function re(t,n){const o=(await b("/api/word-sets")||[]).map(r=>`<li class="set-row">
        <span class="set-title">${e(r.title)}</span>
        <span class="meta">${e(s("teacher.setMeta",{language:r.language||"—",count:r.card_count||0}))}</span>
        <button type="button" class="btn btn--primary btn--sm open-set" data-id="${r.id}">${e(s("btn.open"))}</button>
      </li>`).join("");t.replaceChildren(g(`
      <main class="box box--wide box--deck">
        ${S(a.user,null,`<button type="button" id="back" class="btn btn--ghost btn--sm">${e(s("btn.backCabinet"))}</button><button type="button" id="toggle-add-set" class="btn btn--primary btn--sm">${e(s("teacher.addSet"))}</button>`).outerHTML}
        <section class="deck-section">
          <h2 class="deck-heading">${e(s("teacher.wordSets"))}</h2>
          <section class="add-word-box" id="add-set-box" hidden>
            <p class="add-word-title">${e(s("teacher.newSet"))}</p>
            <form id="new-set-form" class="form">
              <input name="title" placeholder="${e(s("teacher.placeholder.setTitle"))}" required maxlength="200" />
              <select name="language" required>
                <option value="" disabled selected>${e(s("teacher.placeholder.selectLanguage"))}</option>
                ${F.map(r=>`<option value="${e(r)}">${e(r)}</option>`).join("")}
              </select>
              <button type="submit" class="btn btn--secondary btn--sm">${e(s("btn.create"))}</button>
            </form>
            <p id="set-err" class="err"></p>
          </section>
          ${o?`<ul class="sets">${o}</ul>`:`<p class="empty-msg">${e(s("teacher.noSets"))}</p>`}
        </section>
      </main>
    `)),k(t,n),t.querySelector("#back").addEventListener("click",()=>n("teacher-dashboard")),t.querySelector("#toggle-add-set").addEventListener("click",()=>{const r=t.querySelector("#add-set-box");r.hidden=!r.hidden,r.hidden||r.querySelector("[name=title]").focus()}),t.querySelector("#new-set-form").addEventListener("submit",async r=>{r.preventDefault();const l=t.querySelector("#set-err");l.textContent="";const i=new FormData(r.target),u=String(i.get("title")||"").trim(),d=String(i.get("language")||"").trim();if(u.length<1||u.length>200){l.textContent=s("teacher.err.setTitle");return}if(!d){l.textContent=s("teacher.err.setLanguage");return}try{const m=await b("/api/word-sets",{method:"POST",body:JSON.stringify({title:u,language:d})});a.wordSetId=m.id,n("teacher-word-set")}catch(m){l.textContent=m.message}}),t.querySelectorAll(".open-set").forEach(r=>{r.addEventListener("click",()=>{a.wordSetId=Number(r.getAttribute("data-id")),n("teacher-word-set")})})}async function j(t,n){const[c,o]=await Promise.all([b("/api/word-sets/"+a.wordSetId),b("/api/word-sets/"+a.wordSetId+"/cards")]),r=(o||[]).map(l=>`<li class="set-row">
        ${l.image_url?`<img class="card-thumb" src="${e(l.image_url)}" alt="${e(l.word)}" />`:'<span class="card-thumb card-thumb--empty">🖼</span>'}
        <span class="set-title">${e(l.word)}</span>
        <span class="meta">${e(l.translation)}</span>
        <button type="button" class="btn btn--ghost btn--sm del-card" data-id="${l.id}">×</button>
      </li>`).join("");t.replaceChildren(g(`
      <main class="box box--wide box--deck">
        ${S(a.user,null,`<button type="button" id="back" class="btn btn--ghost btn--sm">${e(s("btn.backCabinet"))}</button><button type="button" id="toggle-add" class="btn btn--primary btn--sm">${e(s("teacher.addWord"))}</button>`).outerHTML}
        <h2 class="deck-heading">${e(c.title)}</h2>
        <p class="deck-hint">${e(c.language)}</p>
        <section class="add-word-box" id="add-word-box" hidden>
          <p class="add-word-title">${e(s("teacher.addCard"))}</p>
          <form id="add-card-form" class="form-row">
            <input name="word" placeholder="${e(s("teacher.placeholder.word"))}" required />
            <input name="translation" placeholder="${e(s("teacher.placeholder.translation"))}" required />
            <input name="image_url" type="url" placeholder="${e(s("teacher.placeholder.imageUrl"))}" />
            <button type="submit" class="btn btn--secondary btn--sm">${e(s("teacher.btn.add"))}</button>
          </form>
          <p id="card-err" class="err"></p>
        </section>
        ${r?`<ul class="sets">${r}</ul>`:`<p class="empty-msg">${e(s("teacher.noCards"))}</p>`}
      </main>
    `)),k(t,n),t.querySelector("#back").addEventListener("click",()=>n("teacher-dashboard")),t.querySelector("#toggle-add").addEventListener("click",()=>{const l=t.querySelector("#add-word-box");l.hidden=!l.hidden,l.hidden||l.querySelector("[name=word]").focus()}),t.querySelector("#add-card-form").addEventListener("submit",async l=>{l.preventDefault();const i=t.querySelector("#card-err");i.textContent="";const u=new FormData(l.target);try{await b("/api/word-sets/"+a.wordSetId+"/cards",{method:"POST",body:JSON.stringify({word:String(u.get("word")||""),translation:String(u.get("translation")||""),image_url:String(u.get("image_url")||"")})}),l.target.reset(),await j(t,n)}catch(d){i.textContent=d.message}}),t.querySelectorAll(".del-card").forEach(l=>{l.addEventListener("click",async()=>{window.confirm(s("teacher.deleteCardConfirm"))&&(await b("/api/word-cards/"+l.getAttribute("data-id"),{method:"DELETE"}),await j(t,n))})})}async function ce(t,n){const[c,o]=await Promise.all([b("/api/classes"),b("/api/word-sets")]),r=(c||[]).map(d=>`<option value="${d.id}">${e(d.title)}</option>`).join(""),l=(o||[]).map(d=>`<option value="${d.id}">${e(d.title)}</option>`).join(""),i=new Date().toISOString().slice(0,10),u=new Date(Date.now()+7*864e5).toISOString().slice(0,10);t.replaceChildren(g(`
      <main class="box box--wide">
        ${S(a.user,null,`<button type="button" id="back" class="btn btn--ghost btn--sm">${e(s("btn.backClass"))}</button>`).outerHTML}
        <h2 class="deck-heading">${e(s("teacher.assign.title"))}</h2>
        <form id="assign-form" class="form">
          <label>${e(s("teacher.assign.class"))} <select name="class_id" required>${r}</select></label>
          <label>${e(s("teacher.assign.wordSet"))} <select name="word_set_id" required>${l}</select></label>
          <label>${e(s("teacher.assign.name"))} <input name="title" required placeholder="${e(s("teacher.assign.namePlaceholder"))}" /></label>
          <label>${e(s("teacher.assign.start"))} <input name="start_date" type="date" value="${i}" required /></label>
          <label>${e(s("teacher.assign.deadline"))} <input name="deadline" type="date" value="${u}" required /></label>
          <label>${e(s("teacher.assign.mode"))}
            <select name="mode">
              <option value="mixed">${e(v("mixed"))}</option>
              <option value="study">${e(v("study"))}</option>
              <option value="test">${e(v("test"))}</option>
            </select>
          </label>
          <button type="submit" class="btn btn--primary">${e(s("teacher.assign.submit"))}</button>
        </form>
        <p id="assign-err" class="err"></p>
      </main>
    `)),k(t,n),a.classId&&(t.querySelector("[name=class_id]").value=String(a.classId)),t.querySelector("#back").addEventListener("click",()=>n("teacher-class")),t.querySelector("#assign-form").addEventListener("submit",async d=>{d.preventDefault();const m=t.querySelector("#assign-err");m.textContent="";const h=new FormData(d.target);try{await b("/api/assignments",{method:"POST",body:JSON.stringify({class_id:Number(h.get("class_id")),word_set_id:Number(h.get("word_set_id")),title:String(h.get("title")||""),start_date:String(h.get("start_date")||""),deadline:String(h.get("deadline")||""),mode:String(h.get("mode")||"mixed")})}),a.classId=Number(h.get("class_id")),n("teacher-class")}catch(w){m.textContent=w.message}})}async function le(t,n){const o=(await b("/api/student/assignments")||[]).map(r=>`<li class="set-row">
        <span class="set-title">${e(r.title)}</span>
        <span class="meta">${e(r.class_title)} · ${e(s("teacher.deadlineUntil",{date:D(r.deadline)}))}</span>
        <button type="button" class="btn btn--primary btn--sm open-assign" data-id="${r.id}" data-mode="${e(r.mode)}">${e(s("btn.open"))}</button>
      </li>`).join("");t.replaceChildren(g(`
      <main class="box box--wide box--deck">
        ${S(a.user,null,`<button type="button" id="join" class="btn btn--secondary btn--sm">${e(s("student.joinBtn"))}</button>`).outerHTML}
        <section class="deck-section">
          <h2 class="deck-heading">${e(s("student.activeAssignments"))}</h2>
          ${o?`<ul class="sets">${o}</ul>`:`<p class="empty-msg">${e(s("student.noAssignments"))}</p>`}
        </section>
      </main>
    `)),k(t,n),t.querySelector("#join").addEventListener("click",()=>n("student-join")),t.querySelectorAll(".open-assign").forEach(r=>{r.addEventListener("click",()=>{a.assignmentId=Number(r.getAttribute("data-id")),n("assignment-detail")})})}function de(t,n){t.replaceChildren(g(`
      <main class="box">
        ${S(a.user,null,`<button type="button" id="back" class="btn btn--ghost btn--sm">${e(s("btn.backCabinet"))}</button>`).outerHTML}
        <h2 class="deck-heading">${e(s("student.joinTitle"))}</h2>
        <form id="join-form" class="form">
          <label>${e(s("label.classCode"))} <input name="class_code" placeholder="DEMO01" required maxlength="10" style="text-transform:uppercase" /></label>
          <button type="submit" class="btn btn--primary btn--block">${e(s("btn.join"))}</button>
        </form>
        <p id="join-err" class="err"></p>
      </main>
    `)),k(t,n),t.querySelector("#back").addEventListener("click",()=>n("student-dashboard")),t.querySelector("#join-form").addEventListener("submit",async c=>{c.preventDefault();const o=t.querySelector("#join-err");o.textContent="";const r=new FormData(c.target);try{await b("/api/classes/join",{method:"POST",body:JSON.stringify({class_code:String(r.get("class_code")||"").toUpperCase()})}),n("student-dashboard")}catch(l){o.textContent=l.message}})}async function oe(t,n){var l,i,u;const c=await b("/api/assignments/"+a.assignmentId),o=c.mode==="study"||c.mode==="mixed",r=c.mode==="test"||c.mode==="mixed";t.replaceChildren(g(`
      <main class="box box--wide">
        ${S(a.user,null,`<button type="button" id="back" class="btn btn--ghost btn--sm">${e(s("btn.backCabinet"))}</button>`).outerHTML}
        <h2 class="deck-heading">${e(c.title)}</h2>
        <p class="deck-hint">${e(c.class_title)} · ${e(c.word_set_title)} · ${e(s("teacher.deadlineUntil",{date:D(c.deadline)}))}</p>
        <p class="hint">${e(s("student.assignment.status",{status:v(c.student_status),count:c.card_count||0}))}</p>
        <div class="card-actions card-actions--stack">
          ${o?`<button type="button" id="go-study" class="btn btn--primary">${e(s("student.assignment.study"))}</button>`:""}
          ${o?`<button type="button" id="go-review" class="btn btn--secondary">${e(s("student.assignment.review"))}</button>`:""}
          ${r?`<button type="button" id="go-test" class="btn btn--secondary">${e(s("student.assignment.test"))}</button>`:""}
        </div>
      </main>
    `)),k(t,n),t.querySelector("#back").addEventListener("click",()=>n("student-dashboard")),(l=t.querySelector("#go-study"))==null||l.addEventListener("click",()=>{q(),a.reviewErrorsOnly=!1,n("study")}),(i=t.querySelector("#go-review"))==null||i.addEventListener("click",()=>{q(),a.reviewErrorsOnly=!0,n("study")}),(u=t.querySelector("#go-test"))==null||u.addEventListener("click",()=>{_(),n("test")})}async function O(t,n){var w,C,x,R;let c;a.reviewErrorsOnly?c=(await b("/api/assignments/"+a.assignmentId+"/review-errors")).cards||[]:c=(await b("/api/assignments/"+a.assignmentId+"/study")).cards||[],a.studyCards||(a.studyCards=c,a.studyQueue=ee(c.map((f,L)=>L)),a.studyIndex=0,a.studyCorrect=0,a.studyChecked=!1,a.studyTyped="",a.studyLastCorrect=!1);const o=a.studyQueue,r=o.length,l=o[a.studyIndex],i=a.studyCards[l],u=!i||r===0,d=a.reviewErrorsOnly?s("student.study.reviewTitle"):s("student.study.title");let m;if(u)if(r===0)m=`<p class="study-done-msg">${e(s("student.study.noWords"))}</p>
        <button type="button" id="back-assign" class="btn btn--secondary">${e(s("student.study.back"))}</button>`;else{const f=a.studyCorrect===r;m=`<p class="study-done-msg">${e(s(f?"student.study.doneAll":"student.study.donePartial"))}</p>
        <p class="study-done-counter">${e(s("student.study.correctLabel"))}: <strong>${a.studyCorrect}</strong> / <strong>${r}</strong></p>
        ${f?"":`<p class="study-hint study-hint--done">${e(s("student.study.reviewHint"))}</p>`}
        <button type="button" id="back-assign" class="btn btn--primary">${e(s("student.study.back"))}</button>`}else if(a.studyChecked){const f=a.studyLastCorrect,L=a.studyIndex+1>=r;m=`
      <p class="counter">${a.studyIndex+1} / ${r}</p>
      ${i.image_url?`<img class="card-image" src="${e(i.image_url)}" alt="${e(i.word)}" />`:""}
      <p class="card-tr">${e(i.translation)}</p>
      <p class="feedback ${f?"feedback--ok":"feedback--bad"}">
        ${e(s(f?"student.study.correct":"student.study.incorrect"))}
      </p>
      <p class="feedback-detail">${e(s("student.study.yourAnswerLabel"))}: <strong>${e(a.studyTyped||"—")}</strong></p>
      ${f?"":`<p class="feedback-detail">${e(s("student.study.correctAnswerLabel"))}: <strong>${e(i.word)}</strong></p>`}
      <div class="card-actions card-actions--stack">
        <button type="button" id="next" class="btn btn--primary">${e(s(L?"btn.finish":"btn.next"))}</button>
      </div>`}else m=`
      <p class="counter">${a.studyIndex+1} / ${r}</p>
      ${i.image_url?`<img class="card-image" src="${e(i.image_url)}" alt="${e(i.word)}" />`:""}
      <p class="card-tr">${e(i.translation)}</p>
      <p class="study-hint">${e(s("student.study.prompt"))}</p>
      <form id="answer-form" class="study-answer">
        <input id="answer-input" type="text" class="study-input" autocomplete="off" autocapitalize="off"
          spellcheck="false" placeholder="${e(s("student.study.answerPlaceholder"))}" />
        <button type="submit" class="btn btn--primary btn--block">${e(s("btn.check"))}</button>
      </form>`;t.replaceChildren(g(`
      <main class="box box--wide">
        ${S(a.user,null,`<button type="button" id="back" class="btn btn--ghost btn--sm">${e(s("btn.backAssignment"))}</button>`).outerHTML}
        <h2 class="deck-heading">${e(d)}</h2>
        ${m}
      </main>
    `)),k(t,n),(w=t.querySelector("#back"))==null||w.addEventListener("click",()=>{q(),n("assignment-detail")}),(C=t.querySelector("#back-assign"))==null||C.addEventListener("click",()=>{q(),n("assignment-detail")});const h=t.querySelector("#answer-input");h==null||h.focus(),(x=t.querySelector("#answer-form"))==null||x.addEventListener("submit",async f=>{f.preventDefault();const L=h?h.value:"",T=P(L)===P(i.word);a.studyTyped=L.trim(),a.studyLastCorrect=T,a.studyChecked=!0,T&&(a.studyCorrect+=1);try{await b("/api/assignments/"+a.assignmentId+"/progress",{method:"POST",body:JSON.stringify({word_card_id:i.id,status:T?"know":"repeat"})})}catch{}O(t,n)}),(R=t.querySelector("#next"))==null||R.addEventListener("click",()=>{a.studyIndex+=1,a.studyChecked=!1,a.studyTyped="",a.studyLastCorrect=!1,O(t,n)})}async function K(t,n){var i;if(!a.testQuestions){const u=await b("/api/assignments/"+a.assignmentId+"/test");a.testQuestions=u.questions||[],a.testAnswers=[],a.testIndex=0}const c=a.testQuestions,o=a.testIndex,r=c[o];if(!r){const u=a.testAnswers;try{const d=await b("/api/assignments/"+a.assignmentId+"/test/submit",{method:"POST",body:JSON.stringify({answers:u})});_(),a.testResults=d,n("test-results")}catch(d){t.replaceChildren(g(`<main class="box"><p class="err">${e(d.message)}</p></main>`))}return}const l=(r.options||[]).map((u,d)=>`<button type="button" class="btn btn--secondary btn--block test-opt" data-idx="${d}">${e(u)}</button>`).join("");t.replaceChildren(g(`
      <main class="box box--wide">
        ${S(a.user,null,`<button type="button" id="back" class="btn btn--ghost btn--sm">${e(s("btn.cancel"))}</button>`).outerHTML}
        <p class="counter">${e(s("student.test.question",{current:o+1,total:c.length}))}</p>
        <p class="card-term">${e(r.word)}</p>
        <p class="hint">${e(s("student.test.pickTranslation"))}</p>
        <div class="card-actions card-actions--stack">${l}</div>
      </main>
    `)),k(t,n),(i=t.querySelector("#back"))==null||i.addEventListener("click",()=>{_(),n("assignment-detail")}),t.querySelectorAll(".test-opt").forEach(u=>{u.addEventListener("click",()=>{const d=Number(u.getAttribute("data-idx"));a.testAnswers.push({word_card_id:r.word_card_id,selected_translation:r.options[d]}),a.testIndex+=1,K(t,n)})})}function ie(t,n){const c=a.testResults;if(!c){n("student-dashboard");return}const o=(c.wrong_words||[]).map(r=>`<li>${e(s("student.testResults.wrongLine",{word:r.word,translation:r.correct_translation}))}</li>`).join("");t.replaceChildren(g(`
      <main class="box box--wide">
        ${S(a.user,null,`<button type="button" id="back" class="btn btn--ghost btn--sm">${e(s("btn.backCabinet"))}</button>`).outerHTML}
        <h2 class="deck-heading">${e(s("student.testResults.title"))}</h2>
        <p class="study-done-msg">${e(s("student.testResults.scoreLabel"))}: <strong>${c.score}%</strong> (${c.correct_answers}/${c.total})</p>
        ${o?`<section class="deck-section"><h3 class="deck-heading">${e(s("student.testResults.reviewWords"))}</h3><ul class="sets">${o}</ul></section>`:`<p class="hint">${e(s("student.testResults.allCorrect"))}</p>`}
        <button type="button" id="done" class="btn btn--primary">${e(s("btn.done"))}</button>
      </main>
    `)),k(t,n),t.querySelector("#back").addEventListener("click",()=>n("student-dashboard")),t.querySelector("#done").addEventListener("click",()=>{a.testResults=null,n("student-dashboard")})}const y=document.querySelector("#app");function p(t,n={}){Object.assign(a,n),a.screen=t,Y()}async function Y(){try{switch(ae(a.user,p),a.screen){case"home":te(y,p);break;case"login":se(y,p);break;case"register":ne(y,p);break;case"teacher-dashboard":await Q(y,p);break;case"teacher-class":await B(y,p);break;case"teacher-word-sets":await re(y,p);break;case"teacher-word-set":await j(y,p);break;case"teacher-create-assignment":await ce(y,p);break;case"student-dashboard":await le(y,p);break;case"student-join":de(y,p);break;case"assignment-detail":await oe(y,p);break;case"study":await O(y,p);break;case"test":await K(y,p);break;case"test-results":ie(y,p);break;default:p("home")}}catch(t){if(t.message===s("error.tokenRequired")||t.message===s("error.tokenInvalid")||t.message==="Потрібен токен"||t.message==="Недійсний токен"){N(),a.user=null,p("login");return}const n=document.createElement("main");n.className="box",n.innerHTML=`<p class="err">${t.message||s("error.generic")}</p>`,y.replaceChildren(n)}}async function ue(){if(z())try{a.user=await b("/api/auth/me"),p(a.user.role==="teacher"?"teacher-dashboard":"student-dashboard");return}catch{N()}p("home")}X();Z(document.querySelector("#lang-switcher"));W();U(()=>{W(),Y()});ue();
