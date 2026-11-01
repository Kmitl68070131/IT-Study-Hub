import { subjects } from './content.js';
import { grade, shuffle, readProgress, saveProgress, validBest } from './engine.js';
const $ = s => document.querySelector(s);
const main = $('#main');
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon = (name, cls = '') => {
  const paths = {book:'<path d="M3 4h7a3 3 0 0 1 3 3v14a4 4 0 0 0-4-3H3z"/><path d="M13 7a3 3 0 0 1 3-3h5v14h-4a4 4 0 0 0-4 3"/>',arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',check:'<path d="m5 12 4 4L19 6"/>',cards:'<rect x="7" y="6" width="13" height="15" rx="2"/><path d="M16 3H5a2 2 0 0 0-2 2v12"/>',quiz:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h3"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',layers:'<path d="m3 7 9-4 9 4-9 4zM3 12l9 4 9-4M3 17l9 4 9-4"/>',flag:'<path d="M5 21V4m0 0c5-4 9 4 14 0v10c-5 4-9-4-14 0"/>'};
  return `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.book}</svg>`;
};
let storage; try { storage = window.localStorage; } catch { storage = { getItem: () => null, setItem: () => { throw new Error('storage unavailable'); } }; }
let progress = readProgress(storage);
let route = [], activeSubject, activeChapter, view = 'summary', quiz = null, flash = {index:0, flipped:false, cards:[]};
const base = (s = activeSubject, c = activeChapter) => `/year/${s.year}/term/${s.term}/subject/${s.id}${c ? `/chapter/${c.id}` : ''}`;
const href = path => `#${path}`;
const chapterState = c => progress[c.id] || {};
function persist() {
  if (!saveProgress(storage, progress)) {
    const status = $('#storage-status'); if (status) status.textContent = 'เบราว์เซอร์นี้ไม่อนุญาตให้บันทึก ความคืบหน้าจะอยู่เฉพาะรอบนี้';
  }
}
function banner(eyebrow, title, desc, aside='') {
  return `<section class="page-heading"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p class="lead">${desc}</p></div>${aside}</section>`;
}
function crumbs(items) {
  return `<nav class="breadcrumbs" aria-label="ตำแหน่งปัจจุบัน"><a href="#/">คลังวิชา</a>${items.map(([label,path]) => `<span aria-hidden="true">/</span>${path ? `<a href="${href(path)}">${esc(label)}</a>` : `<span aria-current="page">${esc(label)}</span>`}`).join('')}</nav>`;
}
function steps(step) {
 return `<div class="steps">${['เลือกชั้นปี','เลือกเทอม','เลือกวิชา','เลือกบทเรียน'].map((t,i)=>`<span class="${i===step?'current':i<step?'done':''}"><b>${i<step?'✓':i+1}</b>${t}</span>`).join('<i></i>')}</div>`;
}
function empty(title, desc) {return `<div class="empty">${icon('book')}<h2>${title}</h2><p>${desc}</p><a class="button secondary" href="#/year/2/term/1">ดูวิชาในปี 2 เทอม 1 ${icon('arrow')}</a></div>`;}
function years() {
 const count = subjects.length, lessons = subjects.flatMap(s=>s.chapters), done = lessons.filter(c=>chapterState(c).read).length;
 main.innerHTML = crumbs([])+banner('A LITTLE LEARNING, EVERY DAY','วันนี้ อยากทบทวนอะไร<span class="green">?</span>','รวมทุกวิชาไว้ในที่เดียว เลือกชั้นปี แล้วเริ่มจากบทที่อยากเข้าใจ')+`
 <div class="welcome-banner"><div><span class="pill light">YOUR STUDY COMPANION</span><h2>อ่านให้เข้าใจ<br>ลองทำให้จำได้<span>✳</span></h2><p>สรุปรายบท · แฟลชการ์ด · ข้อสอบพร้อมเหตุผล</p><a class="button lime" href="#/year/2">เริ่มทบทวน ปี 2 ${icon('arrow')}</a></div><div class="banner-art" aria-hidden="true"><div class="orbit"></div><div class="art-sheet"><span>CHAPTER 06</span><div class="art-lines"></div><svg viewBox="0 0 160 100"><path d="M10 80C30-20 130 120 150 20" fill="none" stroke="#1c5383" stroke-width="3"/><path d="m10 80 30-65m110 5-30 65" fill="none" stroke="#a9bccd" stroke-width="1.5"/><g fill="#1c5383"><circle cx="10" cy="80" r="4"/><circle cx="40" cy="15" r="4"/><circle cx="120" cy="85" r="4"/><circle cx="150" cy="20" r="4"/></g></svg><strong>Make it make sense.</strong></div><span class="art-tag">learn. practice. repeat.</span></div></div>
 <div class="stats"><div>${icon('book')}<span><b>${count}</b> วิชาในคลัง</span></div><div>${icon('layers')}<span><b>${lessons.length}</b> บทเรียนพร้อมอ่าน</span></div><div>${icon('check')}<span><b>${done}</b> บทที่อ่านแล้ว</span></div></div>
 <div class="section-heading"><h2>เลือกชั้นปีของคุณ</h2><span>YOUR LEARNING JOURNEY</span></div><div class="year-grid">${[1,2,3,4].map(y=>{
 const n=subjects.filter(s=>s.year===y).length;
 return `<a class="year-card ${n?'available':''}" href="#/year/${y}"><span class="year-number">0${y}</span><span class="year-card-top">YEAR ${y}<span>${n?'มีวิชาในคลัง':'ยังไม่มีเนื้อหา'}</span></span><div><h3>ชั้นปีที่ ${y}</h3><p>${n?`${n} วิชา · เทอม 1 พร้อมเลือก`:'พื้นที่สำหรับบทเรียนในอนาคต'}</p></div><span class="circle-arrow">${icon('arrow')}</span></a>`;
 }).join('')}</div><div class="small-note">${icon('flag')} เริ่มต้นด้วยปี 2 เทอม 1 — เพิ่มรายวิชาและบทเรียนได้เรื่อย ๆ</div>`;
}
function terms(year) {
 main.innerHTML=crumbs([[`ปี ${year}`]])+steps(1)+banner(`YEAR ${year}`,`ปี ${year} <span class="thin">/</span> เลือกเทอม`,'แบ่งเนื้อหาตามเทอม หาเรื่องที่กำลังเรียนได้ง่ายขึ้น')+`<div class="term-grid">${[1,2].map(t=>{
 const list=subjects.filter(s=>s.year===year&&s.term===t); const n=list.reduce((a,s)=>a+s.chapters.length,0);
 return `<a class="term-card" href="#/year/${year}/term/${t}"><span class="tile-icon">${icon('layers')}</span><span class="eyebrow">SEMESTER 0${t}</span><h2>เทอม ${t}</h2><p>${list.length?`${list.length} วิชา · ${n} บทเรียนพร้อมอ่าน`:'ยังไม่มีรายวิชาในเทอมนี้'}</p><span class="text-link">เลือกเทอมนี้ ${icon('arrow')}</span></a>`;
 }).join('')}</div>`;
}
function subjectList(year,term) {
 const list=subjects.filter(s=>s.year===year&&s.term===term);
 main.innerHTML=crumbs([[`ปี ${year}`,`/year/${year}`],[`เทอม ${term}`]])+steps(2)+banner(`YEAR ${year} / SEMESTER ${term}`,`วิชาของคุณ <span class="green">ปี ${year} เทอม ${term}</span>`,'เลือกวิชาเพื่อดูบทเรียน สรุป และแบบทดสอบ',`<span class="count-badge">${list.length} วิชา</span>`)+ (list.length?`<div class="subject-grid">${list.map((s,i)=>`<a class="subject-card tone-${i%3}" href="#${base(s,null)}"><div class="subject-top"><span class="subject-symbol">${s.label}</span><span class="pill ${s.chapters.length?'ready':''}">${s.chapters.length?'พร้อมทบทวน':'รอเพิ่มบทเรียน'}</span></div><p class="course-code">${s.code}</p><h2>${s.title}</h2><p>${s.thai}</p><div class="subject-bottom"><span>${s.chapters.length} บทเรียน</span>${icon('arrow')}</div></a>`).join('')}</div>`:empty('เทอมนี้ยังไม่มีวิชา','รายวิชาจะปรากฏที่นี่เมื่อเพิ่มเนื้อหาแล้ว'));
}
function chapters(s) {
 main.innerHTML=crumbs([[`ปี ${s.year}`,`/year/${s.year}`],[`เทอม ${s.term}`,`/year/${s.year}/term/${s.term}`],[s.title]])+steps(3)+banner(`${s.code} / YEAR ${s.year} / SEMESTER ${s.term}`,s.title,s.thai)+`<p class="intro-note">${s.description}</p>`+(s.chapters.length?`<div class="section-heading"><h2>บทเรียนทั้งหมด</h2><span>${s.chapters.length} CHAPTER</span></div><div class="chapters">${s.chapters.map(c=>{
 const p=chapterState(c),best=validBest(p.best);
 return `<a class="chapter-card" href="#${base(s,c)}/summary"><span class="chapter-number">${String(c.number).padStart(2,'0')}</span><div class="chapter-info"><div class="chapter-meta"><span>CHAPTER ${String(c.number).padStart(2,'0')}</span>${p.read?'<span class="pill ready">อ่านแล้ว</span>':''}</div><h2>${c.title}</h2><p>${c.description}</p><div class="chapter-details"><span>${icon('clock')}${c.minutes} นาที</span><span>${icon('cards')}${c.flashcards.length} แฟลชการ์ด</span><span>${icon('quiz')}${c.questions.length} ข้อ</span></div></div><div class="chapter-trailing">${best!==null?`<small>คะแนนสูงสุด</small><strong>${best}%</strong>`:'<span class="pill ready">พร้อมอ่าน</span>'}${icon('arrow')}</div></a>`;
 }).join('')}</div><p class="muted source-note">ขณะนี้มีเอกสารบท 6 เท่านั้น บทอื่นจะเพิ่มเมื่อได้รับเนื้อหา</p>`:empty('ยังไม่มีบทเรียนในวิชานี้','เพิ่มเอกสารของวิชานี้ แล้วจะมีสรุปและข้อสอบแยกเป็นรายบท'));
}
function readerShell(s,c) {
 const tabs=[['summary','book','สรุปบทเรียน'],['flashcards','cards',`แฟลชการ์ด (${c.flashcards.length})`],['quiz','quiz',`ลองทำข้อสอบ (${c.questions.length})`]];
 main.innerHTML=crumbs([[`ปี ${s.year}`,`/year/${s.year}`],[`เทอม ${s.term}`,`/year/${s.year}/term/${s.term}`],[s.title,base(s,null)],[`บท ${c.number}`]])+`<section class="reader-heading"><p class="eyebrow">${s.code} · ${s.title} / CHAPTER ${String(c.number).padStart(2,'0')}</p><h1>${c.title}</h1><p class="lead">${c.description}</p><div class="reader-meta"><span>${icon('clock')}อ่านประมาณ ${c.minutes} นาที</span><span>${icon('layers')}${c.sections.length} หัวข้อ</span><span class="pill ready">ระดับมหาวิทยาลัย ปี 2</span></div></section><nav class="tabs" aria-label="รูปแบบการทบทวน">${tabs.map(([id,ic,label])=>`<a href="#${base(s,c)}/${id}" class="${view===id?'active':''}" ${view===id?'aria-current="page"':''}>${icon(ic)}${label}</a>`).join('')}</nav><div id="reader-content"></div><p class="storage-status" id="storage-status" role="status"></p>`;
 if(view==='summary') renderSummary(c);
 if(view==='flashcards') renderFlash(c);
 if(view==='quiz') renderQuiz(c);
}
function renderSummary(c) {
 $('#reader-content').innerHTML=`<div class="reading-layout"><article class="summary">${c.sections.map((sec,i)=>`<section class="summary-section" id="section-${sec.id}"><p class="section-index">PART 0${i+1} <span>${sec.pages}</span></p><h2>${sec.title}</h2><p>${sec.intro}</p>${sec.table?`<div class="table-scroll"><table><thead><tr>${sec.table.headers.map(h=>`<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${sec.table.rows.map(row=>`<tr>${row.map(t=>`<td>${t}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`:''}<ul>${sec.points.map(p=>`<li>${p}</li>`).join('')}</ul>${sec.formula?`<div class="formula"><span>FORMULA / EXAMPLE</span><pre>${sec.formula}</pre></div>`:''}<div class="remember"><b>จำตรงนี้ให้แม่น</b><p>${sec.remember}</p></div></section>`).join('')}<div class="reading-finish"><h3>อ่านครบแล้ว ลองเช็กความเข้าใจกัน</h3><p>ทบทวนด้วยแฟลชการ์ด หรือลองทำข้อสอบพร้อมเหตุผลทุกตัวเลือก</p><div class="actions"><button class="button primary" id="mark-read">${chapterState(c).read?'✓ อ่านบทนี้แล้ว':'ทำเครื่องหมายว่าอ่านแล้ว'}</button><a class="button secondary" href="#${base()}/quiz">ลองทำข้อสอบ ${icon('arrow')}</a></div></div><p class="source-note">แหล่งเนื้อหา: ${c.source}</p></article><aside class="toc"><p class="eyebrow">ในบทนี้</p>${c.sections.map((s,i)=>`<button data-section="${s.id}"><span>0${i+1}</span>${s.title}</button>`).join('')}<div class="toc-note">อ่านทีละหัวข้อ<br>แล้วใช้คำถามช่วยทบทวน</div></aside></div>`;
 $('#mark-read').onclick=()=>{progress[c.id]={...chapterState(c),read:true};persist();$('#mark-read').textContent='✓ อ่านบทนี้แล้ว';};
 document.querySelectorAll('[data-section]').forEach(b=>b.onclick=()=>document.getElementById(`section-${b.dataset.section}`).scrollIntoView({behavior:'smooth',block:'start'}));
}
function renderFlash(c) {
 if(!flash.cards.length || flash.chapter!==c.id) flash={chapter:c.id,index:0,flipped:false,cards:[...c.flashcards]};
 const f=flash.cards[flash.index];
 $('#reader-content').innerHTML=`<div class="practice-intro"><div><p class="eyebrow">ACTIVE RECALL</p><h2>นึกคำตอบก่อน แล้วค่อยเปิดดู</h2><p>แตะการ์ดหรือกด Space เมื่อโฟกัสที่การ์ดเพื่อพลิกดูคำตอบ</p></div><button class="button secondary" id="shuffle-cards">สลับการ์ด ↻</button></div><div class="flash-wrap"><div class="flash-counter"><span>FLASHCARD</span><b>${flash.index+1} / ${flash.cards.length}</b></div><button class="flash-card ${flash.flipped?'flipped':''}" id="flip-card" aria-label="${flash.flipped?'คำตอบ':'คำถาม'}: ${esc(flash.flipped?f.back:f.front)}. กดเพื่อพลิก"><span class="flash-type">${flash.flipped?'THE ANSWER':'THE QUESTION'}</span><strong>${esc(flash.flipped?f.back:f.front)}</strong><span class="flip-hint">↻ ${flash.flipped?'แตะเพื่อกลับไปดูคำถาม':'แตะเพื่อเปิดคำตอบ'}</span></button><div class="flash-controls"><button class="button secondary" id="prev-card" ${flash.index===0?'disabled':''}>← ก่อนหน้า</button><span>${flash.flipped?'ลองอธิบายด้วยคำของตัวเอง':'ให้เวลาตัวเองคิดสักนิด'}</span><button class="button primary" id="next-card" ${flash.index===flash.cards.length-1?'disabled':''}>ถัดไป →</button></div><div class="progress-track"><div style="width:${(flash.index+1)/flash.cards.length*100}%"></div></div></div>`;
 $('#flip-card').onclick=()=>{flash.flipped=!flash.flipped;renderFlash(c);$('#flip-card').focus();};
 $('#prev-card').onclick=()=>{flash.index--;flash.flipped=false;renderFlash(c);};
 $('#next-card').onclick=()=>{flash.index++;flash.flipped=false;renderFlash(c);};
 $('#shuffle-cards').onclick=()=>{flash.cards=shuffle(c.flashcards);flash.index=0;flash.flipped=false;renderFlash(c);};
}
function startQuiz(c,questions=c.questions,mode='full') {
 quiz={chapter:c.id,questions:shuffle(questions),mode,index:0,selected:null,answers:{},checked:false,finished:false};renderQuiz(c);
}
function renderQuiz(c) {
 const target=$('#reader-content');
 if(!quiz || quiz.chapter!==c.id) {
  const best=validBest(chapterState(c).best);
  target.innerHTML=`<div class="quiz-start"><span class="quiz-emblem">${icon('quiz')}</span><p class="eyebrow">PUT YOUR KNOWLEDGE TO THE TEST</p><h2>เข้าใจแค่ไหน ลองทำดู</h2><p>ข้อสอบฝึกทบทวนจากบทนี้ ระดับมหาวิทยาลัยปี 2<br>มีทั้งความเข้าใจ วิเคราะห์สถานการณ์ และคำนวณ</p><div class="quiz-facts"><span><b>${c.questions.length}</b> ข้อ</span><span><b>4</b> ตัวเลือก</span><span><b>ทันที</b> รู้ผลพร้อมเหตุผล</span></div><div class="quiz-guide"><p>① เลือกคำตอบ แล้วกด “ตรวจคำตอบ”</p><p>② ดูเฉลยและเหตุผลก่อนทำข้อถัดไป</p><p>③ เมื่อทำครบ เลือกฝึกเฉพาะข้อที่ผิดได้</p></div><button class="button primary large" id="start-quiz">เริ่มทำข้อสอบ ${icon('arrow')}</button>${best!==null?`<p class="best-score">คะแนนสูงสุดของชุดเต็ม ${best}%</p>`:''}<p class="source-note">เป็นแบบฝึกหัดที่สร้างจากเนื้อหา ไม่ใช่ข้อสอบจริงของรายวิชา<br>บันทึกคะแนนเฉพาะเบราว์เซอร์นี้</p></div>`;
  $('#start-quiz').onclick=()=>startQuiz(c);return;
 }
 if(quiz.finished){renderResult(c);return;}
 const q=quiz.questions[quiz.index],selected=quiz.selected,checked=quiz.checked,ok=selected===q.answer;
 target.innerHTML=`<div class="quiz-work"><div class="quiz-top"><span>${quiz.mode==='wrong'?'ทบทวนข้อที่ผิด':'แบบทดสอบประจำบท'}</span><b>ข้อ ${quiz.index+1} / ${quiz.questions.length}</b></div><div class="progress-track"><div style="width:${quiz.index/quiz.questions.length*100}%"></div></div><div class="question-card"><div class="question-tags"><span class="pill">${q.level}</span><span>${c.sections.find(s=>s.id===q.topic).title}</span></div><h2>${esc(q.prompt)}</h2><fieldset class="options" ${checked?'disabled':''}><legend class="sr-only">เลือกคำตอบเดียว</legend>${q.options.map((opt,i)=>`<label class="option ${selected===i?'selected':''} ${checked&&i===q.answer?'correct':''} ${checked&&i===selected&&!ok?'incorrect':''}"><input type="radio" name="answer" value="${i}" ${selected===i?'checked':''}><span class="option-letter">${'ABCD'[i]}</span><span>${esc(opt)}</span>${checked&&i===q.answer?'<span class="option-status">✓</span>':checked&&i===selected&&!ok?'<span class="option-status">×</span>':''}</label>`).join('')}</fieldset>${checked?`<section class="feedback ${ok?'good':'bad'}" role="status"><h3>${ok?'✓ ตอบถูกแล้ว':'ยังไม่ถูก มาทำความเข้าใจกัน'}</h3><p><b>คำตอบที่ถูก: ${'ABCD'[q.answer]}. ${esc(q.options[q.answer])}</b></p>${!ok?`<p>คำตอบของคุณ: ${esc(q.reasons[selected])}</p>`:''}<p>เหตุผล: ${esc(q.reasons[q.answer])}</p><details><summary>เหตุผลของทุกตัวเลือก</summary>${q.options.map((opt,i)=>`<p><b>${'ABCD'[i]}. ${esc(opt)}</b><br>${esc(q.reasons[i])}</p>`).join('')}</details><button class="review-link" data-review="${q.topic}">กลับไปอ่าน ${c.sections.find(s=>s.id===q.topic).title} ↗</button></section>`:''}<div class="question-bottom"><span>${checked?'อ่านเหตุผลแล้วค่อยไปต่อได้เลย':'เลือกได้ 1 คำตอบ'}</span><button class="button primary" id="quiz-action" ${!checked&&selected===null?'disabled':''}>${checked?(quiz.index===quiz.questions.length-1?'ดูผลคะแนน':'ข้อถัดไป →'):'ตรวจคำตอบ'}</button></div></div><button class="text-button" id="restart-quiz">เริ่มชุดนี้ใหม่</button></div>`;
 document.querySelectorAll('input[name="answer"]').forEach(input=>input.onchange=()=>{quiz.selected=Number(input.value);renderQuiz(c);document.querySelector(`input[name="answer"][value="${quiz.selected}"]`)?.focus();});
 $('#quiz-action').onclick=()=>{
  if(!quiz.checked){if(quiz.selected===null)return;quiz.answers[q.id]=quiz.selected;quiz.checked=true;renderQuiz(c);}
  else if(quiz.index<quiz.questions.length-1){quiz.index++;quiz.checked=false;quiz.selected=null;renderQuiz(c);$('.question-card').scrollIntoView({behavior:'smooth',block:'start'});}
  else {quiz.finished=true;const result=grade(quiz.questions,quiz.answers);if(quiz.mode==='full'){const old=validBest(chapterState(c).best)??0;progress[c.id]={...chapterState(c),best:Math.max(old,result.percent),last:result.percent};persist();}renderResult(c);}
 };
 $('#restart-quiz').onclick=()=>startQuiz(c,quiz.questions,quiz.mode);
 const review=$('[data-review]');if(review)review.onclick=()=>{const topic=review.dataset.review;location.hash=`${base()}/summary`;requestAnimationFrame(()=>requestAnimationFrame(()=>document.getElementById(`section-${topic}`)?.scrollIntoView({behavior:'smooth'})));};
}
function renderResult(c) {
 const result=grade(quiz.questions,quiz.answers);
 $('#reader-content').innerHTML=`<div class="result-panel"><p class="eyebrow">${quiz.mode==='wrong'?'REVIEW SESSION COMPLETE':'PRACTICE COMPLETE'}</p><h2>${result.percent===100?'เก็บครบทุกข้อแล้ว!':'ทุกข้อที่ผิด คือเรื่องที่ได้เข้าใจเพิ่ม'}</h2><div class="score-ring"><strong>${result.percent}<small>%</small></strong><span>${result.correct} / ${result.total} ข้อ</span></div><p>ตอบถูก ${result.correct} ข้อ · ตอบผิด ${result.wrong.length} ข้อ</p><div class="actions">${result.wrong.length?'<button class="button primary" id="retry-wrong">ฝึกเฉพาะข้อที่ผิด ↻</button>':''}<button class="button secondary" id="retry-all">ทำชุดเต็มใหม่</button><a class="button secondary" href="#${base()}/summary">กลับไปอ่านสรุป</a></div>${quiz.mode==='wrong'?'<p class="muted">รอบฝึกข้อผิดแยกจากคะแนนสูงสุดของชุดเต็ม</p>':''}</div>${result.wrong.length?`<div class="section-heading"><h2>ทบทวนข้อที่ยังไม่เข้าใจ</h2><span>${result.wrong.length} QUESTIONS</span></div><div class="wrong-list">${result.wrong.map((q,i)=>`<article><span class="eyebrow">REVIEW ${i+1}</span><h3>${esc(q.prompt)}</h3><p class="wrong-answer">คุณตอบ: ${'ABCD'[quiz.answers[q.id]]}. ${esc(q.options[quiz.answers[q.id]])}</p><p class="right-answer">เฉลย: ${'ABCD'[q.answer]}. ${esc(q.options[q.answer])}</p><p>เหตุผล: ${esc(q.reasons[q.answer])}</p></article>`).join('')}</div>`:''}`;
 if($('#retry-wrong'))$('#retry-wrong').onclick=()=>startQuiz(c,result.wrong,'wrong');
 $('#retry-all').onclick=()=>startQuiz(c);
}
function searchResults(query) {
 const needle=query.toLocaleLowerCase().trim(); const matches=[];
 for(const s of subjects){if(`${s.code} ${s.title} ${s.thai}`.toLocaleLowerCase().includes(needle))matches.push({title:s.title,label:`ปี ${s.year} / เทอม ${s.term} · ${s.code}`,path:base(s,null)});for(const c of s.chapters){const found=[c.title,...c.sections.map(x=>`${x.title} ${x.intro} ${x.points.join(' ')}`)].join(' ').toLocaleLowerCase().includes(needle);if(found)matches.push({title:`บท ${c.number} · ${c.title}`,label:s.title,path:`${base(s,c)}/summary`});}}
 main.innerHTML=crumbs([['ค้นหา']])+banner('FIND YOUR NEXT CHAPTER','ผลการค้นหา',`“${esc(query)}” · พบ ${matches.length} รายการ`)+(matches.length?`<div class="search-results">${matches.map(m=>`<a href="#${m.path}"><span>${icon('book')}</span><div><small>${esc(m.label)}</small><h2>${esc(m.title)}</h2></div>${icon('arrow')}</a>`).join('')}</div>`:`<div class="empty"><h2>ยังไม่พบเนื้อหาที่ค้นหา</h2><p>ลองใช้ชื่อวิชา รหัสวิชา หรือคำศัพท์ เช่น Bezier, Mesh, Shading</p></div>`);
}
function navigate() {
 let path;try{path=decodeURIComponent(location.hash.slice(1)||'/');}catch{path='/invalid';}
 route=path.split('/').filter(Boolean);
 $('#search').value=route[0]==='search'?(route.slice(1).join('/')||''):'';
 activeSubject=null;activeChapter=null;
 const y=Number(route[1]),t=Number(route[3]);
 $('#year-nav').innerHTML=[1,2,3,4].map(year=>`<a class="${y===year&&route[0]==='year'?'selected':''}" href="#/year/${year}"><span class="nav-year-number">0${year}</span> ชั้นปีที่ ${year}${subjects.some(s=>s.year===year)?'<span class="year-indicator"></span>':''}</a>`).join('');
 if(!route.length)years();
 else if(route[0]==='search'&&route.length>1)searchResults(route.slice(1).join('/'));
 else if(route[0]!=='year'||![1,2,3,4].includes(y))notFound();
 else if(route.length===2)terms(y);
 else if(route[2]!=='term'||![1,2].includes(t))notFound();
 else if(route.length===4)subjectList(y,t);
 else {
  const s=subjects.find(s=>s.id===route[5]&&s.year===y&&s.term===t);
  if(route[4]!=='subject'||!s){notFound();return;}
  activeSubject=s;
  if(route.length===6)chapters(s);
  else {
   const c=s.chapters.find(c=>c.id===route[7]);
   if(route[6]!=='chapter'||!c||route.length>9||!['summary','flashcards','quiz'].includes(route[8]||'summary')){notFound();return;}
   activeChapter=c;view=route[8]||'summary';readerShell(s,c);
  }
 }
 document.title=activeChapter?`${activeChapter.title} — IT Study Hub`:activeSubject?`${activeSubject.title} — IT Study Hub`:'IT Study Hub — พื้นที่ทบทวนของเรา';
 window.scrollTo({top:0,behavior:'instant'});
}
function notFound(){main.innerHTML=empty('ไม่พบหน้าที่ต้องการ','เส้นทางนี้ไม่มีในคลังบทเรียน เลือกวิชาใหม่ได้จากหน้าคลัง');}
let searchTimer;
$('#search').addEventListener('input',e=>{clearTimeout(searchTimer);const q=e.target.value.trim();searchTimer=setTimeout(()=>{if(q)location.hash=`/search/${encodeURIComponent(q)}`;else if(route[0]==='search')location.hash='/';},350);});
$('#search').addEventListener('keydown',e=>{if(e.key==='Enter'){clearTimeout(searchTimer);const q=e.target.value.trim();if(q)location.hash=`/search/${encodeURIComponent(q)}`;}});
window.addEventListener('keydown',e=>{if(e.key==='/'&&!/INPUT|TEXTAREA/.test(document.activeElement.tagName)){e.preventDefault();$('#search').focus();}});
document.querySelector('.skip-link').addEventListener('click', e => { e.preventDefault(); main.focus(); main.scrollIntoView(); });
window.addEventListener('hashchange',navigate);
navigate();
