(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))l(r);new MutationObserver(r=>{for(const d of r)if(d.type==="childList")for(const o of d.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&l(o)}).observe(document,{childList:!0,subtree:!0});function i(r){const d={};return r.integrity&&(d.integrity=r.integrity),r.referrerPolicy&&(d.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?d.credentials="include":r.crossOrigin==="anonymous"?d.credentials="omit":d.credentials="same-origin",d}function l(r){if(r.ep)return;r.ep=!0;const d=i(r);fetch(r.href,d)}})();const F="learnly_locale",_={uk:{"brand.tag":"навчальна платформа","lang.uk":"UA","lang.en":"EN","lang.switch":"Мова інтерфейсу","btn.login":"Увійти","btn.register":"Реєстрація","btn.logout":"Вийти","btn.open":"Відкрити","btn.create":"Створити","btn.save":"Зберегти","btn.backCabinet":"← Кабінет","btn.backClass":"← Клас","btn.backAssignment":"← Завдання","btn.join":"Приєднатись","btn.next":"Далі","btn.finish":"Завершити","btn.check":"Перевірити","btn.done":"Готово","btn.cancel":"Скасувати","label.email":"Email","label.password":"Пароль","label.name":"Ім'я","label.role":"Роль","label.classCode":"Код класу","role.student":"Учень","role.teacher":"Викладач","error.login":"Помилка входу","error.register":"Помилка реєстрації","error.generic":"Помилка","error.tokenRequired":"Потрібен токен","error.tokenInvalid":"Недійсний токен","home.hint":"Навчальна платформа для вивчення слів: класи, завдання, картки та тести.","login.title":"Вхід","login.noAccount":"Немає акаунта? Зареєструватись","register.title":"Реєстрація","register.hasAccount":"Вже є акаунт? Увійти","register.submit":"Зареєструватись","teacher.dashboard.title":"Кабінет викладача","teacher.dashboard.stats":"Класів: {classes} · Активних завдань: {assignments} · Виконання: {percent}%","teacher.myClasses":"Мої класи","teacher.wordSets":"Набори слів","teacher.createClass":"+ Створити клас","teacher.addSet":"+ Додати набір","teacher.newClass":"Новий клас","teacher.newSet":"Новий набір","teacher.noClasses":"Ще немає класів.","teacher.noSets":"Немає наборів.","teacher.classMeta":"{subject} · {count} учнів · код: {code}","teacher.setMeta":"{language} · {count} карток","teacher.placeholder.classTitle":"Назва класу","teacher.placeholder.subject":"Предмет / мова","teacher.placeholder.description":"Короткий опис","teacher.placeholder.setTitle":"Назва набору","teacher.placeholder.selectLanguage":"Оберіть мову","teacher.err.classTitle":"Назва класу має бути 1–200 символів","teacher.err.setTitle":"Назва набору має бути 1–200 символів","teacher.err.setLanguage":"Оберіть мову набору","teacher.classCode":"Код класу","teacher.students":"Учні","teacher.noStudents":"Ще немає учнів.","teacher.assignments":"Завдання","teacher.noAssignments":"Завдань ще немає.","teacher.editClass":"Редагувати","teacher.deleteClass":"Видалити","teacher.editClassTitle":"Редагувати клас","teacher.deleteClassConfirm":"Видалити клас разом з усіма завданнями та списком учнів?","teacher.newAssignment":"Завдання","teacher.deadlineUntil":"до {date}","teacher.addWord":"+ Додати слово","teacher.addCard":"Додати картку","teacher.placeholder.word":"Слово","teacher.placeholder.translation":"Переклад","teacher.placeholder.imageUrl":"Посилання на фото (необов'язково)","teacher.btn.add":"Додати","teacher.noCards":"Немає карток.","teacher.deleteCardConfirm":"Ви точно бажаєте видалити це слово?","teacher.assign.title":"Призначити завдання","teacher.assign.class":"Клас","teacher.assign.wordSet":"Набір слів","teacher.assign.name":"Назва","teacher.assign.namePlaceholder":"Назва завдання","teacher.assign.start":"Початок","teacher.assign.deadline":"Дедлайн","teacher.assign.mode":"Режим","teacher.assign.submit":"Створити завдання","student.activeAssignments":"Активні завдання","student.noAssignments":"Немає активних завдань.","student.joinBtn":"Приєднатись","student.joinTitle":"Приєднатися до класу","student.assignment.status":"Статус: {status} · Карток: {count}","student.assignment.study":"Вчити слова","student.assignment.review":"Повторити складні","student.assignment.test":"Пройти тест","student.study.reviewTitle":"Повторення помилок","student.study.title":"Вчити слова","student.study.noWords":"Немає слів для проходження.","student.study.back":"До завдання","student.study.doneAll":"Набір успішно завершено!","student.study.donePartial":"Прохід завершено.","student.study.correctLabel":"Правильних","student.study.reviewHint":"Помилки можна пропрацювати через «Повторити складні».","student.study.correct":"Правильно!","student.study.incorrect":"Неправильно","student.study.yourAnswerLabel":"Ваша відповідь","student.study.correctAnswerLabel":"Правильна відповідь","student.study.prompt":"Впишіть слово відповідно до перекладу:","student.study.answerPlaceholder":"Ваша відповідь","student.test.question":"Питання {current} / {total}","student.test.pickTranslation":"Оберіть правильний переклад:","student.testResults.title":"Результат тесту","student.testResults.scoreLabel":"Бал","student.testResults.reviewWords":"Слова для повторення","student.testResults.allCorrect":"Усі відповіді правильні!","student.testResults.wrongLine":"{word} — правильно: {translation}","status.not_started":"Не почато","status.in_progress":"У процесі","status.completed":"Завершено","status.know":"Знаю","status.almost":"Майже знаю","status.repeat":"Повторити","status.active":"Активне","status.draft":"Чернетка","status.closed":"Закрито","status.study":"Вивчення","status.test":"Тест","status.mixed":"Змішаний","api.forbidden":"Недостатньо прав доступу","api.invalidClassId":"Невірний id класу","api.classNotFound":"Клас не знайдено","api.classCodeRequired":"Введіть код класу","api.classCodeNotFound":"Клас з таким кодом не знайдено","api.invalidWordSetId":"Невірний id набору","api.wordSetNotFound":"Набір слів не знайдено","api.setNotFound":"Набір не знайдено","api.assignmentTitleLength":"Назва завдання 1–200 символів","api.datesRequired":"Вкажіть start_date і deadline (YYYY-MM-DD)","api.invalidMode":"mode: study, test або mixed","api.invalidAssignmentId":"Невірний id завдання","api.assignmentNotFound":"Завдання не знайдено","api.nameLength":"Ім'я 2–100 символів","api.invalidEmail":"Невірний email","api.passwordMin":"Пароль мінімум 6 символів","api.invalidRole":"Роль: teacher або student","api.emailTaken":"Такий email вже є","api.credentialsRequired":"Вкажіть email і пароль","api.invalidCredentials":"Невірний email або пароль","api.wordTranslationRequired":"Введіть слово і переклад","api.invalidCardId":"Невірний id картки","api.cardNotFound":"Картку не знайдено","api.noCardsForTest":"У наборі немає карток для тесту","api.answersRequired":"Надішліть answers[]","api.invalidWordCardId":"Невірний word_card_id","api.invalidStatus":"status: know, almost або repeat"},en:{"brand.tag":"learning platform","lang.uk":"UA","lang.en":"EN","lang.switch":"Interface language","btn.login":"Log in","btn.register":"Sign up","btn.logout":"Log out","btn.open":"Open","btn.create":"Create","btn.save":"Save","btn.backCabinet":"← Dashboard","btn.backClass":"← Class","btn.backAssignment":"← Assignment","btn.join":"Join","btn.next":"Next","btn.finish":"Finish","btn.check":"Check","btn.done":"Done","btn.cancel":"Cancel","label.email":"Email","label.password":"Password","label.name":"Name","label.role":"Role","label.classCode":"Class code","role.student":"Student","role.teacher":"Teacher","error.login":"Login failed","error.register":"Registration failed","error.generic":"Error","error.tokenRequired":"Token required","error.tokenInvalid":"Invalid token","home.hint":"A platform for learning vocabulary: classes, assignments, flashcards, and tests.","login.title":"Log in","login.noAccount":"Don't have an account? Sign up","register.title":"Sign up","register.hasAccount":"Already have an account? Log in","register.submit":"Sign up","teacher.dashboard.title":"Teacher dashboard","teacher.dashboard.stats":"Classes: {classes} · Active assignments: {assignments} · Completion: {percent}%","teacher.myClasses":"My classes","teacher.wordSets":"Word sets","teacher.createClass":"+ Create class","teacher.addSet":"+ Add set","teacher.newClass":"New class","teacher.newSet":"New set","teacher.noClasses":"No classes yet.","teacher.noSets":"No word sets yet.","teacher.classMeta":"{subject} · {count} students · code: {code}","teacher.setMeta":"{language} · {count} cards","teacher.placeholder.classTitle":"Class name","teacher.placeholder.subject":"Subject / language","teacher.placeholder.description":"Short description","teacher.placeholder.setTitle":"Set name","teacher.placeholder.selectLanguage":"Choose language","teacher.err.classTitle":"Class name must be 1–200 characters","teacher.err.setTitle":"Set name must be 1–200 characters","teacher.err.setLanguage":"Choose a language for the set","teacher.classCode":"Class code","teacher.students":"Students","teacher.noStudents":"No students yet.","teacher.assignments":"Assignments","teacher.noAssignments":"No assignments yet.","teacher.editClass":"Edit","teacher.deleteClass":"Delete","teacher.editClassTitle":"Edit class","teacher.deleteClassConfirm":"Delete this class with all assignments and the student list?","teacher.newAssignment":"Assignment","teacher.deadlineUntil":"due {date}","teacher.addWord":"+ Add word","teacher.addCard":"Add card","teacher.placeholder.word":"Word","teacher.placeholder.translation":"Translation","teacher.placeholder.imageUrl":"Image URL (optional)","teacher.btn.add":"Add","teacher.noCards":"No cards yet.","teacher.deleteCardConfirm":"Delete this word?","teacher.assign.title":"Create assignment","teacher.assign.class":"Class","teacher.assign.wordSet":"Word set","teacher.assign.name":"Title","teacher.assign.namePlaceholder":"Assignment title","teacher.assign.start":"Start date","teacher.assign.deadline":"Deadline","teacher.assign.mode":"Mode","teacher.assign.submit":"Create assignment","student.activeAssignments":"Active assignments","student.noAssignments":"No active assignments.","student.joinBtn":"Join class","student.joinTitle":"Join a class","student.assignment.status":"Status: {status} · Cards: {count}","student.assignment.study":"Study words","student.assignment.review":"Review mistakes","student.assignment.test":"Take test","student.study.reviewTitle":"Review mistakes","student.study.title":"Study words","student.study.noWords":"No words to practice.","student.study.back":"Back to assignment","student.study.doneAll":"Set completed successfully!","student.study.donePartial":"Session complete.","student.study.correctLabel":"Correct","student.study.reviewHint":"You can review mistakes via “Review mistakes”.","student.study.correct":"Correct!","student.study.incorrect":"Incorrect","student.study.yourAnswerLabel":"Your answer","student.study.correctAnswerLabel":"Correct answer","student.study.prompt":"Type the word for this translation:","student.study.answerPlaceholder":"Your answer","student.test.question":"Question {current} / {total}","student.test.pickTranslation":"Choose the correct translation:","student.testResults.title":"Test results","student.testResults.scoreLabel":"Score","student.testResults.reviewWords":"Words to review","student.testResults.allCorrect":"All answers correct!","student.testResults.wrongLine":"{word} — correct: {translation}","status.not_started":"Not started","status.in_progress":"In progress","status.completed":"Completed","status.know":"Know","status.almost":"Almost","status.repeat":"Review","status.active":"Active","status.draft":"Draft","status.closed":"Closed","status.study":"Study","status.test":"Test","status.mixed":"Mixed","api.forbidden":"Insufficient permissions","api.invalidClassId":"Invalid class id","api.classNotFound":"Class not found","api.classCodeRequired":"Enter a class code","api.classCodeNotFound":"No class with this code","api.invalidWordSetId":"Invalid word set id","api.wordSetNotFound":"Word set not found","api.setNotFound":"Set not found","api.assignmentTitleLength":"Assignment title must be 1–200 characters","api.datesRequired":"Provide start_date and deadline (YYYY-MM-DD)","api.invalidMode":"mode must be study, test, or mixed","api.invalidAssignmentId":"Invalid assignment id","api.assignmentNotFound":"Assignment not found","api.nameLength":"Name must be 2–100 characters","api.invalidEmail":"Invalid email","api.passwordMin":"Password must be at least 6 characters","api.invalidRole":"Role must be teacher or student","api.emailTaken":"This email is already registered","api.credentialsRequired":"Email and password are required","api.invalidCredentials":"Invalid email or password","api.wordTranslationRequired":"Word and translation are required","api.invalidCardId":"Invalid card id","api.cardNotFound":"Card not found","api.noCardsForTest":"No cards in the set for a test","api.answersRequired":"Send answers[]","api.invalidWordCardId":"Invalid word_card_id","api.invalidStatus":"status must be know, almost, or repeat"}},z={"Потрібен токен":"error.tokenRequired","Недійсний токен":"error.tokenInvalid","Недостатньо прав доступу":"api.forbidden","Назва класу 1–200 символів":"teacher.err.classTitle","Невірний id класу":"api.invalidClassId","Клас не знайдено":"api.classNotFound","Введіть код класу":"api.classCodeRequired","Клас з таким кодом не знайдено":"api.classCodeNotFound","Невірний class_id":"api.invalidClassId","Невірний word_set_id":"api.invalidWordSetId","Назва завдання 1–200 символів":"api.assignmentTitleLength","Вкажіть start_date і deadline (YYYY-MM-DD)":"api.datesRequired","mode: study, test або mixed":"api.invalidMode","Набір слів не знайдено":"api.wordSetNotFound","Невірний id завдання":"api.invalidAssignmentId","Завдання не знайдено":"api.assignmentNotFound","Ім'я 2–100 символів":"api.nameLength","Невірний email":"api.invalidEmail","Пароль мінімум 6 символів":"api.passwordMin","Роль: teacher або student":"api.invalidRole","Такий email вже є":"api.emailTaken","Вкажіть email і пароль":"api.credentialsRequired","Невірний email або пароль":"api.invalidCredentials","Назва набору 1–200 символів":"teacher.err.setTitle","Невірний id набору":"api.invalidWordSetId","Набір не знайдено":"api.setNotFound","Введіть слово і переклад":"api.wordTranslationRequired","Невірний id картки":"api.invalidCardId","Картку не знайдено":"api.cardNotFound","У наборі немає карток для тесту":"api.noCardsForTest","Надішліть answers[]":"api.answersRequired","Невірний word_card_id":"api.invalidWordCardId","status: know, almost або repeat":"api.invalidStatus"};let $="uk";const A=new Set;function G(){return $==="en"?"en-GB":"uk-UA"}function s(t,a={}){let l=(_[$]||_.uk)[t]??_.uk[t]??t;for(const[r,d]of Object.entries(a))l=l.replaceAll(`{${r}}`,String(d));return l}function V(t){const a=String(t??"");if(!a)return s("error.generic");const i=z[a];return i?s(i):a}function X(t){const a=String(t??"");return a==="Потрібен токен"||a==="Недійсний токен"||a===s("error.tokenRequired")||a===s("error.tokenInvalid")}function Z(t){t!=="uk"&&t!=="en"||$!==t&&($=t,localStorage.setItem(F,$),document.documentElement.lang=$==="en"?"en":"uk",A.forEach(a=>a($)))}function P(t){return A.add(t),()=>A.delete(t)}function ee(){const t=localStorage.getItem(F);(t==="uk"||t==="en")&&($=t),document.documentElement.lang=$==="en"?"en":"uk"}function W(){const t=document.querySelector(".brand__tag");t&&(t.textContent=s("brand.tag"))}function te(t){if(!t)return;const a=()=>{t.replaceChildren();const i=document.createElement("div");i.className="lang-switcher",i.setAttribute("role","group"),i.setAttribute("aria-label",s("lang.switch"));for(const l of["uk","en"]){const r=document.createElement("button");r.type="button",r.className="lang-switcher__btn"+($===l?" lang-switcher__btn--active":""),r.textContent=s(l==="uk"?"lang.uk":"lang.en"),r.setAttribute("aria-pressed",$===l?"true":"false"),r.addEventListener("click",()=>Z(l)),i.appendChild(r)}t.appendChild(i)};a(),P(a)}const T="learnly_token";async function b(t,a={}){const i={...a.headers};!i["Content-Type"]&&a.body&&(i["Content-Type"]="application/json");const l=localStorage.getItem(T);l&&(i.Authorization="Bearer "+l);const r=await fetch(t,{...a,headers:i}),d=await r.text();let o=null;if(d)try{o=JSON.parse(d)}catch{o={error:d}}if(!r.ok){const u=o&&o.error?o.error:r.statusText;throw new Error(V(u))}return o}function se(){return localStorage.getItem(T)}function H(t){localStorage.setItem(T,t)}function j(){localStorage.removeItem(T)}function Y(){j()}const n={screen:"home",user:null,classId:null,wordSetId:null,assignmentId:null,studyQueue:null,studyCards:null,studyIndex:0,showTranslation:!1,reviewErrorsOnly:!1,studyCorrect:0,studyChecked:!1,studyTyped:"",studyLastCorrect:!1,testQuestions:null,testAnswers:null,testIndex:0,testResults:null};function q(){n.studyQueue=null,n.studyCards=null,n.studyIndex=0,n.showTranslation=!1,n.reviewErrorsOnly=!1,n.studyCorrect=0,n.studyChecked=!1,n.studyTyped="",n.studyLastCorrect=!1}function I(){n.testQuestions=null,n.testAnswers=null,n.testIndex=0,n.testResults=null}function g(t){const a=document.createElement("template");return a.innerHTML=t.trim(),a.content.firstElementChild}function e(t){return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function D(t){if(!t)return"—";try{return new Intl.DateTimeFormat(G(),{year:"numeric",month:"short",day:"numeric"}).format(new Date(t))}catch{return t}}function ae(t){const a=t.slice();for(let i=a.length-1;i>0;i--){const l=Math.floor(Math.random()*(i+1));[a[i],a[l]]=[a[l],a[i]]}return a}function M(t){return String(t??"").trim().toLowerCase().replace(/\s+/g," ")}function L(t){const a="status."+t,i=s(a);return i===a?t:i}function ne(t,a){t.replaceChildren(g(`
      <main class="box">
        <h1>Learnly</h1>
        <p class="hint">${e(s("home.hint"))}</p>
        <div class="card-actions card-actions--stack">
          <button type="button" id="go-login" class="btn btn--primary btn--block">${e(s("btn.login"))}</button>
          <button type="button" id="go-register" class="btn btn--secondary btn--block">${e(s("btn.register"))}</button>
        </div>
      </main>
    `)),t.querySelector("#go-login").addEventListener("click",()=>a("login")),t.querySelector("#go-register").addEventListener("click",()=>a("register"))}function re(t,a){t.replaceChildren(g(`
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
    `));const i=t.querySelector("#login-err");t.querySelector("#to-register").addEventListener("click",()=>a("register")),t.querySelector("#login-form").addEventListener("submit",async l=>{l.preventDefault(),i.textContent="";const r=new FormData(l.target);try{const d=await b("/api/auth/login",{method:"POST",body:JSON.stringify({email:String(r.get("email")||""),password:String(r.get("password")||"")})});H(d.token),n.user=d.user,a(d.user.role==="teacher"?"teacher-dashboard":"student-dashboard")}catch(d){i.textContent=d.message||s("error.login")}})}function ie(t,a){t.replaceChildren(g(`
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
    `));const i=t.querySelector("#reg-err");t.querySelector("#to-login").addEventListener("click",()=>a("login")),t.querySelector("#register-form").addEventListener("submit",async l=>{l.preventDefault(),i.textContent="";const r=new FormData(l.target);try{await b("/api/auth/register",{method:"POST",body:JSON.stringify({name:String(r.get("name")||""),email:String(r.get("email")||""),password:String(r.get("password")||""),role:String(r.get("role")||"student")})});const d=await b("/api/auth/login",{method:"POST",body:JSON.stringify({email:String(r.get("email")||""),password:String(r.get("password")||"")})});H(d.token),n.user=d.user,a(d.user.role==="teacher"?"teacher-dashboard":"student-dashboard")}catch(d){i.textContent=d.message||s("error.register")}})}function S(t,a,i=""){return g(`
    <header class="top">
      <div class="card-actions">
        ${i}
      </div>
    </header>
  `)}function de(t,a){const i=document.querySelector("#brand-account");if(!i)return;if(!t){i.replaceChildren();return}const l=t.role==="teacher"?s("role.teacher"):s("role.student");i.replaceChildren(g(`
      <div class="brand__account-inner">
        <div class="brand__user">
          <span class="brand__name">${e(t.name)}</span>
          <span class="brand__role">${e(l)} · ${e(t.email)}</span>
        </div>
        <button type="button" id="brand-logout" class="btn brand__logout btn--sm">${e(s("btn.logout"))}</button>
      </div>
    `)),i.querySelector("#brand-logout").addEventListener("click",()=>{Y(),n.user=null,a("home")})}function k(t,a){var i;(i=t.querySelector("#logout"))==null||i.addEventListener("click",()=>{Y(),n.user=null,a("home")})}const J=["English","Deutsch","Français","Español","Italiano","Polski","Українська"];async function U(t,a){const[i,l,r]=await Promise.all([b("/api/teacher/dashboard"),b("/api/classes"),b("/api/word-sets")]),d=(l||[]).map(c=>`<li class="set-row">
        <span class="set-title">${e(c.title)}</span>
        <span class="meta">${e(s("teacher.classMeta",{subject:c.subject||"—",count:c.student_count||0,code:c.class_code}))}</span>
        <button type="button" class="btn btn--primary btn--sm open-class" data-id="${c.id}">${e(s("btn.open"))}</button>
      </li>`).join(""),o=(r||[]).map(c=>`<li class="set-row">
        <span class="set-title">${e(c.title)}</span>
        <span class="meta">${e(s("teacher.setMeta",{language:c.language||"—",count:c.card_count||0}))}</span>
        <button type="button" class="btn btn--primary btn--sm open-set" data-id="${c.id}">${e(s("btn.open"))}</button>
      </li>`).join(""),u=g(`
    <main class="box box--wide box--deck">
      ${S(n.user,null,`<button type="button" id="toggle-add-class" class="btn btn--primary btn--sm">${e(s("teacher.createClass"))}</button>`).outerHTML}
      <section class="deck-section">
        <h2 class="deck-heading">${e(s("teacher.dashboard.title"))}</h2>
        <p class="deck-hint">${e(s("teacher.dashboard.stats",{classes:i.stats.class_count,assignments:i.stats.active_assignments,percent:i.stats.completion_percent}))}</p>
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
        ${d?`<ul class="sets">${d}</ul>`:`<p class="empty-msg">${e(s("teacher.noClasses"))}</p>`}
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
              ${J.map(c=>`<option value="${e(c)}">${e(c)}</option>`).join("")}
            </select>
            <button type="submit" class="btn btn--secondary btn--sm">${e(s("btn.create"))}</button>
          </form>
          <p id="set-err" class="err"></p>
        </section>
        ${o?`<ul class="sets">${o}</ul>`:`<p class="empty-msg">${e(s("teacher.noSets"))}</p>`}
      </section>
    </main>
  `);t.replaceChildren(u),k(t,a),t.querySelector("#toggle-add-class").addEventListener("click",()=>{const c=t.querySelector("#add-class-box");c.hidden=!c.hidden,c.hidden||c.querySelector("[name=title]").focus()}),t.querySelector("#new-class-form").addEventListener("submit",async c=>{c.preventDefault();const m=t.querySelector("#class-err");m.textContent="";const p=new FormData(c.target),w=String(p.get("title")||"").trim();if(w.length<1||w.length>200){m.textContent=s("teacher.err.classTitle");return}try{await b("/api/classes",{method:"POST",body:JSON.stringify({title:w,subject:String(p.get("subject")||"").trim(),description:String(p.get("description")||"").trim()})}),c.target.reset(),await U(t,a)}catch(C){m.textContent=C.message}}),t.querySelectorAll(".open-class").forEach(c=>{c.addEventListener("click",()=>{n.classId=Number(c.getAttribute("data-id")),a("teacher-class")})}),t.querySelector("#toggle-add-set").addEventListener("click",()=>{const c=t.querySelector("#add-set-box");c.hidden=!c.hidden,c.hidden||c.querySelector("[name=title]").focus()}),t.querySelector("#new-set-form").addEventListener("submit",async c=>{c.preventDefault();const m=t.querySelector("#set-err");m.textContent="";const p=new FormData(c.target),w=String(p.get("title")||"").trim(),C=String(p.get("language")||"").trim();if(w.length<1||w.length>200){m.textContent=s("teacher.err.setTitle");return}if(!C){m.textContent=s("teacher.err.setLanguage");return}try{const v=await b("/api/word-sets",{method:"POST",body:JSON.stringify({title:w,language:C})});n.wordSetId=v.id,a("teacher-word-set")}catch(v){m.textContent=v.message}}),t.querySelectorAll(".open-set").forEach(c=>{c.addEventListener("click",()=>{n.wordSetId=Number(c.getAttribute("data-id")),a("teacher-word-set")})})}async function Q(t,a){const i=await b("/api/classes/"+n.classId),l=(i.students||[]).map(d=>`<li>${e(d.name)} (${e(d.email)})</li>`).join(""),r=(i.assignments||[]).map(d=>`<li class="set-row">
        <span class="set-title">${e(d.title)}</span>
        <span class="meta">${e(d.word_set_title)} · ${e(s("teacher.deadlineUntil",{date:D(d.deadline)}))} · ${e(L(d.mode))}</span>
      </li>`).join("");t.replaceChildren(g(`
      <main class="box box--wide box--deck">
        ${S(n.user,null,`<button type="button" id="back" class="btn btn--ghost btn--sm">${e(s("btn.backCabinet"))}</button><button type="button" id="new-assignment" class="btn btn--primary btn--sm">${e(s("teacher.newAssignment"))}</button>`).outerHTML}
        <div class="deck-section-head">
          <h2 class="deck-heading">${e(i.title)}</h2>
          <div>
            <button type="button" id="edit-class" class="btn btn--secondary btn--sm">${e(s("teacher.editClass"))}</button>
            <button type="button" id="delete-class" class="btn btn--ghost btn--sm">${e(s("teacher.deleteClass"))}</button>
          </div>
        </div>
        <p class="deck-hint">${e(i.subject||"—")} · ${e(s("teacher.classCode"))}: <strong>${e(i.class_code)}</strong></p>
        ${i.description?`<p class="deck-hint">${e(i.description)}</p>`:""}
        <section class="add-word-box" id="edit-class-box" hidden>
          <p class="add-word-title">${e(s("teacher.editClassTitle"))}</p>
          <form id="edit-class-form" class="form">
            <input name="title" placeholder="${e(s("teacher.placeholder.classTitle"))}" required maxlength="200" value="${e(i.title)}" />
            <input name="subject" placeholder="${e(s("teacher.placeholder.subject"))}" maxlength="100" value="${e(i.subject||"")}" />
            <input name="description" placeholder="${e(s("teacher.placeholder.description"))}" maxlength="300" value="${e(i.description||"")}" />
            <button type="submit" class="btn btn--secondary btn--sm">${e(s("btn.save"))}</button>
          </form>
          <p id="edit-class-err" class="err"></p>
        </section>
        <section class="deck-section">
          <h3 class="deck-heading">${e(s("teacher.students"))}</h3>
          ${l?`<ul class="sets">${l}</ul>`:`<p class="empty-msg">${e(s("teacher.noStudents"))}</p>`}
        </section>
        <section class="deck-section">
          <h3 class="deck-heading">${e(s("teacher.assignments"))}</h3>
          ${r?`<ul class="sets">${r}</ul>`:`<p class="empty-msg">${e(s("teacher.noAssignments"))}</p>`}
        </section>
      </main>
    `)),k(t,a),t.querySelector("#back").addEventListener("click",()=>a("teacher-dashboard")),t.querySelector("#new-assignment").addEventListener("click",()=>a("teacher-create-assignment")),t.querySelector("#edit-class").addEventListener("click",()=>{const d=t.querySelector("#edit-class-box");d.hidden=!d.hidden,d.hidden||d.querySelector("[name=title]").focus()}),t.querySelector("#edit-class-form").addEventListener("submit",async d=>{d.preventDefault();const o=t.querySelector("#edit-class-err");o.textContent="";const u=new FormData(d.target),c=String(u.get("title")||"").trim();if(c.length<1||c.length>200){o.textContent=s("teacher.err.classTitle");return}try{await b("/api/classes/"+n.classId,{method:"PUT",body:JSON.stringify({title:c,subject:String(u.get("subject")||"").trim(),description:String(u.get("description")||"").trim()})}),await Q(t,a)}catch(m){o.textContent=m.message}}),t.querySelector("#delete-class").addEventListener("click",async()=>{if(window.confirm(s("teacher.deleteClassConfirm")))try{await b("/api/classes/"+n.classId,{method:"DELETE"}),a("teacher-dashboard")}catch(d){window.alert(d.message)}})}async function ce(t,a){const l=(await b("/api/word-sets")||[]).map(r=>`<li class="set-row">
        <span class="set-title">${e(r.title)}</span>
        <span class="meta">${e(s("teacher.setMeta",{language:r.language||"—",count:r.card_count||0}))}</span>
        <button type="button" class="btn btn--primary btn--sm open-set" data-id="${r.id}">${e(s("btn.open"))}</button>
      </li>`).join("");t.replaceChildren(g(`
      <main class="box box--wide box--deck">
        ${S(n.user,null,`<button type="button" id="back" class="btn btn--ghost btn--sm">${e(s("btn.backCabinet"))}</button><button type="button" id="toggle-add-set" class="btn btn--primary btn--sm">${e(s("teacher.addSet"))}</button>`).outerHTML}
        <section class="deck-section">
          <h2 class="deck-heading">${e(s("teacher.wordSets"))}</h2>
          <section class="add-word-box" id="add-set-box" hidden>
            <p class="add-word-title">${e(s("teacher.newSet"))}</p>
            <form id="new-set-form" class="form">
              <input name="title" placeholder="${e(s("teacher.placeholder.setTitle"))}" required maxlength="200" />
              <select name="language" required>
                <option value="" disabled selected>${e(s("teacher.placeholder.selectLanguage"))}</option>
                ${J.map(r=>`<option value="${e(r)}">${e(r)}</option>`).join("")}
              </select>
              <button type="submit" class="btn btn--secondary btn--sm">${e(s("btn.create"))}</button>
            </form>
            <p id="set-err" class="err"></p>
          </section>
          ${l?`<ul class="sets">${l}</ul>`:`<p class="empty-msg">${e(s("teacher.noSets"))}</p>`}
        </section>
      </main>
    `)),k(t,a),t.querySelector("#back").addEventListener("click",()=>a("teacher-dashboard")),t.querySelector("#toggle-add-set").addEventListener("click",()=>{const r=t.querySelector("#add-set-box");r.hidden=!r.hidden,r.hidden||r.querySelector("[name=title]").focus()}),t.querySelector("#new-set-form").addEventListener("submit",async r=>{r.preventDefault();const d=t.querySelector("#set-err");d.textContent="";const o=new FormData(r.target),u=String(o.get("title")||"").trim(),c=String(o.get("language")||"").trim();if(u.length<1||u.length>200){d.textContent=s("teacher.err.setTitle");return}if(!c){d.textContent=s("teacher.err.setLanguage");return}try{const m=await b("/api/word-sets",{method:"POST",body:JSON.stringify({title:u,language:c})});n.wordSetId=m.id,a("teacher-word-set")}catch(m){d.textContent=m.message}}),t.querySelectorAll(".open-set").forEach(r=>{r.addEventListener("click",()=>{n.wordSetId=Number(r.getAttribute("data-id")),a("teacher-word-set")})})}async function N(t,a){const[i,l]=await Promise.all([b("/api/word-sets/"+n.wordSetId),b("/api/word-sets/"+n.wordSetId+"/cards")]),r=(l||[]).map(d=>`<li class="set-row">
        ${d.image_url?`<img class="card-thumb" src="${e(d.image_url)}" alt="${e(d.word)}" />`:'<span class="card-thumb card-thumb--empty">🖼</span>'}
        <span class="set-title">${e(d.word)}</span>
        <span class="meta">${e(d.translation)}</span>
        <button type="button" class="btn btn--ghost btn--sm del-card" data-id="${d.id}">×</button>
      </li>`).join("");t.replaceChildren(g(`
      <main class="box box--wide box--deck">
        ${S(n.user,null,`<button type="button" id="back" class="btn btn--ghost btn--sm">${e(s("btn.backCabinet"))}</button><button type="button" id="toggle-add" class="btn btn--primary btn--sm">${e(s("teacher.addWord"))}</button>`).outerHTML}
        <h2 class="deck-heading">${e(i.title)}</h2>
        <p class="deck-hint">${e(i.language)}</p>
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
    `)),k(t,a),t.querySelector("#back").addEventListener("click",()=>a("teacher-dashboard")),t.querySelector("#toggle-add").addEventListener("click",()=>{const d=t.querySelector("#add-word-box");d.hidden=!d.hidden,d.hidden||d.querySelector("[name=word]").focus()}),t.querySelector("#add-card-form").addEventListener("submit",async d=>{d.preventDefault();const o=t.querySelector("#card-err");o.textContent="";const u=new FormData(d.target);try{await b("/api/word-sets/"+n.wordSetId+"/cards",{method:"POST",body:JSON.stringify({word:String(u.get("word")||""),translation:String(u.get("translation")||""),image_url:String(u.get("image_url")||"")})}),d.target.reset(),await N(t,a)}catch(c){o.textContent=c.message}}),t.querySelectorAll(".del-card").forEach(d=>{d.addEventListener("click",async()=>{window.confirm(s("teacher.deleteCardConfirm"))&&(await b("/api/word-cards/"+d.getAttribute("data-id"),{method:"DELETE"}),await N(t,a))})})}async function le(t,a){const[i,l]=await Promise.all([b("/api/classes"),b("/api/word-sets")]),r=(i||[]).map(c=>`<option value="${c.id}">${e(c.title)}</option>`).join(""),d=(l||[]).map(c=>`<option value="${c.id}">${e(c.title)}</option>`).join(""),o=new Date().toISOString().slice(0,10),u=new Date(Date.now()+7*864e5).toISOString().slice(0,10);t.replaceChildren(g(`
      <main class="box box--wide">
        ${S(n.user,null,`<button type="button" id="back" class="btn btn--ghost btn--sm">${e(s("btn.backClass"))}</button>`).outerHTML}
        <h2 class="deck-heading">${e(s("teacher.assign.title"))}</h2>
        <form id="assign-form" class="form">
          <label>${e(s("teacher.assign.class"))} <select name="class_id" required>${r}</select></label>
          <label>${e(s("teacher.assign.wordSet"))} <select name="word_set_id" required>${d}</select></label>
          <label>${e(s("teacher.assign.name"))} <input name="title" required placeholder="${e(s("teacher.assign.namePlaceholder"))}" /></label>
          <label>${e(s("teacher.assign.start"))} <input name="start_date" type="date" value="${o}" required /></label>
          <label>${e(s("teacher.assign.deadline"))} <input name="deadline" type="date" value="${u}" required /></label>
          <label>${e(s("teacher.assign.mode"))}
            <select name="mode">
              <option value="mixed">${e(L("mixed"))}</option>
              <option value="study">${e(L("study"))}</option>
              <option value="test">${e(L("test"))}</option>
            </select>
          </label>
          <button type="submit" class="btn btn--primary">${e(s("teacher.assign.submit"))}</button>
        </form>
        <p id="assign-err" class="err"></p>
      </main>
    `)),k(t,a),n.classId&&(t.querySelector("[name=class_id]").value=String(n.classId)),t.querySelector("#back").addEventListener("click",()=>a("teacher-class")),t.querySelector("#assign-form").addEventListener("submit",async c=>{c.preventDefault();const m=t.querySelector("#assign-err");m.textContent="";const p=new FormData(c.target);try{await b("/api/assignments",{method:"POST",body:JSON.stringify({class_id:Number(p.get("class_id")),word_set_id:Number(p.get("word_set_id")),title:String(p.get("title")||""),start_date:String(p.get("start_date")||""),deadline:String(p.get("deadline")||""),mode:String(p.get("mode")||"mixed")})}),n.classId=Number(p.get("class_id")),a("teacher-class")}catch(w){m.textContent=w.message}})}async function oe(t,a){const l=(await b("/api/student/assignments")||[]).map(r=>`<li class="set-row">
        <span class="set-title">${e(r.title)}</span>
        <span class="meta">${e(r.class_title)} · ${e(s("teacher.deadlineUntil",{date:D(r.deadline)}))}</span>
        <button type="button" class="btn btn--primary btn--sm open-assign" data-id="${r.id}" data-mode="${e(r.mode)}">${e(s("btn.open"))}</button>
      </li>`).join("");t.replaceChildren(g(`
      <main class="box box--wide box--deck">
        ${S(n.user,null,`<button type="button" id="join" class="btn btn--secondary btn--sm">${e(s("student.joinBtn"))}</button>`).outerHTML}
        <section class="deck-section">
          <h2 class="deck-heading">${e(s("student.activeAssignments"))}</h2>
          ${l?`<ul class="sets">${l}</ul>`:`<p class="empty-msg">${e(s("student.noAssignments"))}</p>`}
        </section>
      </main>
    `)),k(t,a),t.querySelector("#join").addEventListener("click",()=>a("student-join")),t.querySelectorAll(".open-assign").forEach(r=>{r.addEventListener("click",()=>{n.assignmentId=Number(r.getAttribute("data-id")),a("assignment-detail")})})}function ue(t,a){t.replaceChildren(g(`
      <main class="box">
        ${S(n.user,null,`<button type="button" id="back" class="btn btn--ghost btn--sm">${e(s("btn.backCabinet"))}</button>`).outerHTML}
        <h2 class="deck-heading">${e(s("student.joinTitle"))}</h2>
        <form id="join-form" class="form">
          <label>${e(s("label.classCode"))} <input name="class_code" placeholder="DEMO01" required maxlength="10" style="text-transform:uppercase" /></label>
          <button type="submit" class="btn btn--primary btn--block">${e(s("btn.join"))}</button>
        </form>
        <p id="join-err" class="err"></p>
      </main>
    `)),k(t,a),t.querySelector("#back").addEventListener("click",()=>a("student-dashboard")),t.querySelector("#join-form").addEventListener("submit",async i=>{i.preventDefault();const l=t.querySelector("#join-err");l.textContent="";const r=new FormData(i.target);try{await b("/api/classes/join",{method:"POST",body:JSON.stringify({class_code:String(r.get("class_code")||"").toUpperCase()})}),a("student-dashboard")}catch(d){l.textContent=d.message}})}async function be(t,a){var d,o,u;const i=await b("/api/assignments/"+n.assignmentId),l=i.mode==="study"||i.mode==="mixed",r=i.mode==="test"||i.mode==="mixed";t.replaceChildren(g(`
      <main class="box box--wide">
        ${S(n.user,null,`<button type="button" id="back" class="btn btn--ghost btn--sm">${e(s("btn.backCabinet"))}</button>`).outerHTML}
        <h2 class="deck-heading">${e(i.title)}</h2>
        <p class="deck-hint">${e(i.class_title)} · ${e(i.word_set_title)} · ${e(s("teacher.deadlineUntil",{date:D(i.deadline)}))}</p>
        <p class="hint">${e(s("student.assignment.status",{status:L(i.student_status),count:i.card_count||0}))}</p>
        <div class="card-actions card-actions--stack">
          ${l?`<button type="button" id="go-study" class="btn btn--primary">${e(s("student.assignment.study"))}</button>`:""}
          ${l?`<button type="button" id="go-review" class="btn btn--secondary">${e(s("student.assignment.review"))}</button>`:""}
          ${r?`<button type="button" id="go-test" class="btn btn--secondary">${e(s("student.assignment.test"))}</button>`:""}
        </div>
      </main>
    `)),k(t,a),t.querySelector("#back").addEventListener("click",()=>a("student-dashboard")),(d=t.querySelector("#go-study"))==null||d.addEventListener("click",()=>{q(),n.reviewErrorsOnly=!1,a("study")}),(o=t.querySelector("#go-review"))==null||o.addEventListener("click",()=>{q(),n.reviewErrorsOnly=!0,a("study")}),(u=t.querySelector("#go-test"))==null||u.addEventListener("click",()=>{I(),a("test")})}async function R(t,a){var w,C,v,O;let i;n.reviewErrorsOnly?i=(await b("/api/assignments/"+n.assignmentId+"/review-errors")).cards||[]:i=(await b("/api/assignments/"+n.assignmentId+"/study")).cards||[],n.studyCards||(n.studyCards=i,n.studyQueue=ae(i.map((f,x)=>x)),n.studyIndex=0,n.studyCorrect=0,n.studyChecked=!1,n.studyTyped="",n.studyLastCorrect=!1);const l=n.studyQueue,r=l.length,d=l[n.studyIndex],o=n.studyCards[d],u=!o||r===0,c=n.reviewErrorsOnly?s("student.study.reviewTitle"):s("student.study.title");let m;if(u)if(r===0)m=`<p class="study-done-msg">${e(s("student.study.noWords"))}</p>
        <button type="button" id="back-assign" class="btn btn--secondary">${e(s("student.study.back"))}</button>`;else{const f=n.studyCorrect===r;m=`<p class="study-done-msg">${e(s(f?"student.study.doneAll":"student.study.donePartial"))}</p>
        <p class="study-done-counter">${e(s("student.study.correctLabel"))}: <strong>${n.studyCorrect}</strong> / <strong>${r}</strong></p>
        ${f?"":`<p class="study-hint study-hint--done">${e(s("student.study.reviewHint"))}</p>`}
        <button type="button" id="back-assign" class="btn btn--primary">${e(s("student.study.back"))}</button>`}else if(n.studyChecked){const f=n.studyLastCorrect,x=n.studyIndex+1>=r;m=`
      <p class="counter">${n.studyIndex+1} / ${r}</p>
      ${o.image_url?`<img class="card-image" src="${e(o.image_url)}" alt="${e(o.word)}" />`:""}
      <p class="card-tr">${e(o.translation)}</p>
      <p class="feedback ${f?"feedback--ok":"feedback--bad"}">
        ${e(s(f?"student.study.correct":"student.study.incorrect"))}
      </p>
      <p class="feedback-detail">${e(s("student.study.yourAnswerLabel"))}: <strong>${e(n.studyTyped||"—")}</strong></p>
      ${f?"":`<p class="feedback-detail">${e(s("student.study.correctAnswerLabel"))}: <strong>${e(o.word)}</strong></p>`}
      <div class="card-actions card-actions--stack">
        <button type="button" id="next" class="btn btn--primary">${e(s(x?"btn.finish":"btn.next"))}</button>
      </div>`}else m=`
      <p class="counter">${n.studyIndex+1} / ${r}</p>
      ${o.image_url?`<img class="card-image" src="${e(o.image_url)}" alt="${e(o.word)}" />`:""}
      <p class="card-tr">${e(o.translation)}</p>
      <p class="study-hint">${e(s("student.study.prompt"))}</p>
      <form id="answer-form" class="study-answer">
        <input id="answer-input" type="text" class="study-input" autocomplete="off" autocapitalize="off"
          spellcheck="false" placeholder="${e(s("student.study.answerPlaceholder"))}" />
        <button type="submit" class="btn btn--primary btn--block">${e(s("btn.check"))}</button>
      </form>`;t.replaceChildren(g(`
      <main class="box box--wide">
        ${S(n.user,null,`<button type="button" id="back" class="btn btn--ghost btn--sm">${e(s("btn.backAssignment"))}</button>`).outerHTML}
        <h2 class="deck-heading">${e(c)}</h2>
        ${m}
      </main>
    `)),k(t,a),(w=t.querySelector("#back"))==null||w.addEventListener("click",()=>{q(),a("assignment-detail")}),(C=t.querySelector("#back-assign"))==null||C.addEventListener("click",()=>{q(),a("assignment-detail")});const p=t.querySelector("#answer-input");p==null||p.focus(),(v=t.querySelector("#answer-form"))==null||v.addEventListener("submit",async f=>{f.preventDefault();const x=p?p.value:"",E=M(x)===M(o.word);n.studyTyped=x.trim(),n.studyLastCorrect=E,n.studyChecked=!0,E&&(n.studyCorrect+=1);try{await b("/api/assignments/"+n.assignmentId+"/progress",{method:"POST",body:JSON.stringify({word_card_id:o.id,status:E?"know":"repeat"})})}catch{}R(t,a)}),(O=t.querySelector("#next"))==null||O.addEventListener("click",()=>{n.studyIndex+=1,n.studyChecked=!1,n.studyTyped="",n.studyLastCorrect=!1,R(t,a)})}async function B(t,a){var o;if(!n.testQuestions){const u=await b("/api/assignments/"+n.assignmentId+"/test");n.testQuestions=u.questions||[],n.testAnswers=[],n.testIndex=0}const i=n.testQuestions,l=n.testIndex,r=i[l];if(!r){const u=n.testAnswers;try{const c=await b("/api/assignments/"+n.assignmentId+"/test/submit",{method:"POST",body:JSON.stringify({answers:u})});I(),n.testResults=c,a("test-results")}catch(c){t.replaceChildren(g(`<main class="box"><p class="err">${e(c.message)}</p></main>`))}return}const d=(r.options||[]).map((u,c)=>`<button type="button" class="btn btn--secondary btn--block test-opt" data-idx="${c}">${e(u)}</button>`).join("");t.replaceChildren(g(`
      <main class="box box--wide">
        ${S(n.user,null,`<button type="button" id="back" class="btn btn--ghost btn--sm">${e(s("btn.cancel"))}</button>`).outerHTML}
        <p class="counter">${e(s("student.test.question",{current:l+1,total:i.length}))}</p>
        <p class="card-term">${e(r.word)}</p>
        <p class="hint">${e(s("student.test.pickTranslation"))}</p>
        <div class="card-actions card-actions--stack">${d}</div>
      </main>
    `)),k(t,a),(o=t.querySelector("#back"))==null||o.addEventListener("click",()=>{I(),a("assignment-detail")}),t.querySelectorAll(".test-opt").forEach(u=>{u.addEventListener("click",()=>{const c=Number(u.getAttribute("data-idx"));n.testAnswers.push({word_card_id:r.word_card_id,selected_translation:r.options[c]}),n.testIndex+=1,B(t,a)})})}function me(t,a){const i=n.testResults;if(!i){a("student-dashboard");return}const l=(i.wrong_words||[]).map(r=>`<li>${e(s("student.testResults.wrongLine",{word:r.word,translation:r.correct_translation}))}</li>`).join("");t.replaceChildren(g(`
      <main class="box box--wide">
        ${S(n.user,null,`<button type="button" id="back" class="btn btn--ghost btn--sm">${e(s("btn.backCabinet"))}</button>`).outerHTML}
        <h2 class="deck-heading">${e(s("student.testResults.title"))}</h2>
        <p class="study-done-msg">${e(s("student.testResults.scoreLabel"))}: <strong>${i.score}%</strong> (${i.correct_answers}/${i.total})</p>
        ${l?`<section class="deck-section"><h3 class="deck-heading">${e(s("student.testResults.reviewWords"))}</h3><ul class="sets">${l}</ul></section>`:`<p class="hint">${e(s("student.testResults.allCorrect"))}</p>`}
        <button type="button" id="done" class="btn btn--primary">${e(s("btn.done"))}</button>
      </main>
    `)),k(t,a),t.querySelector("#back").addEventListener("click",()=>a("student-dashboard")),t.querySelector("#done").addEventListener("click",()=>{n.testResults=null,a("student-dashboard")})}const y=document.querySelector("#app");function h(t,a={}){Object.assign(n,a),n.screen=t,K()}async function K(){try{switch(de(n.user,h),n.screen){case"home":ne(y,h);break;case"login":re(y,h);break;case"register":ie(y,h);break;case"teacher-dashboard":await U(y,h);break;case"teacher-class":await Q(y,h);break;case"teacher-word-sets":await ce(y,h);break;case"teacher-word-set":await N(y,h);break;case"teacher-create-assignment":await le(y,h);break;case"student-dashboard":await oe(y,h);break;case"student-join":ue(y,h);break;case"assignment-detail":await be(y,h);break;case"study":await R(y,h);break;case"test":await B(y,h);break;case"test-results":me(y,h);break;default:h("home")}}catch(t){if(X(t.message)){j(),n.user=null,h("login");return}const a=document.createElement("main");a.className="box",a.innerHTML=`<p class="err">${t.message||s("error.generic")}</p>`,y.replaceChildren(a)}}async function pe(){if(se())try{n.user=await b("/api/auth/me"),h(n.user.role==="teacher"?"teacher-dashboard":"student-dashboard");return}catch{j()}h("home")}ee();te(document.querySelector("#lang-switcher"));W();P(()=>{W(),K()});pe();
