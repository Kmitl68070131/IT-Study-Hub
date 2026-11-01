import { buildExamBank, EXAM_SIZE } from './exam-bank.js';

const escapeHTML = text => String(text ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shuffle = items => {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
};
const course = '/year/2/term/1/subject/multimedia-technology';
const storageKey = period => `it-study-hub-multimedia-${period}-exam-60-v1`;
function readScore(period){
  try {const value=JSON.parse(localStorage.getItem(storageKey(period))||'{}');return Number.isInteger(value.best)?value.best:null;} catch {return null;}
}
function writeScore(period,result){
  try {localStorage.setItem(storageKey(period),JSON.stringify({best:Math.max(readScore(period)??0,result.percent),last:result.percent,date:new Date().toISOString()}));return true;}catch{return false;}
}

export function showExam(subject, period, root) {
  const bank = buildExamBank(subject,period);
  const label = period === 'final' ? 'Final' : 'Midterm';
  const accent = period === 'final' ? 'orange' : 'blue';
  const back = `#${course}/${period}`;
  const heading = `<nav class="breadcrumbs" aria-label="ตำแหน่งปัจจุบัน"><a href="#/">คลังวิชา</a> / <a href="#${course}">MULTIMEDIA TECHNOLOGY</a> / <a href="${back}">${label}</a> / <span aria-current="page">ข้อสอบ 60 ข้อ</span></nav>
  <header class="mock-heading"><span class="mock-kicker">MULTIMEDIA TECHNOLOGY · ${label.toUpperCase()}</span><h1>ข้อสอบจำลอง ${label} <span class="mock-orange">60 ข้อ</span></h1><p>แบบฝึกหัดอิงจากสไลด์ที่ได้รับ พร้อมเฉลยและเหตุผลทุกตัวเลือก · ไม่ใช่ข้อสอบจริงของอาจารย์</p></header>`;
  root.innerHTML = `<div class="mock-exam ${accent}">${heading}<div id="mock-exam-body"></div></div>`;
  const body = root.querySelector('#mock-exam-body');
  if (!bank.ready) {
    body.innerHTML = `<section class="mock-panel mock-pending"><span class="mock-large-icon">📚</span><h2>รอเนื้อหา ${label}</h2><p>เตรียมระบบข้อสอบ ${EXAM_SIZE} ข้อไว้แล้ว แต่ยังไม่มีข้อมูลที่เพียงพอสำหรับสร้างข้อสอบให้ถูกต้องตามสไลด์</p><p>${period==='midterm'?'เมื่อได้รับสไลด์กลางภาค จะเพิ่มคำถามให้ครบ 60 ข้อโดยแยกจาก Final':'กรุณาตรวจสอบว่ามีบทเรียน Final 6–12 ครบ และได้ติดตั้งชุดเนื้อหาแล้ว'}</p><a class="button secondary" href="${back}">← กลับไปหน้าบทเรียน</a></section>`;
    return;
  }
  let session = null;
  const chapterTags = bank.chapters.map(c=>`<span>บท ${c.number}</span>`).join('');

  function start(items=bank.questions,mode='full') {
    session = {questions:shuffle(items),mode,index:0,selected:null,checked:false,answers:{}};
    renderQuestion();
  }
  function renderStart(){
    session = null;
    const best=readScore(period);
    body.innerHTML = `<section class="mock-panel mock-start"><div class="mock-pill">ข้อสอบรวม ${EXAM_SIZE} ข้อ · 4 ตัวเลือก</div><h2>ทดสอบความเข้าใจก่อนสอบ ${label}</h2><p>เลือกคำตอบทีละข้อแล้วกดตรวจคำตอบ ระบบจะแสดงเฉลยพร้อมเหตุผลทันที และสรุปคะแนนเมื่อทำครบทั้งหมด</p><div class="mock-tags">${chapterTags}</div><div class="mock-meta"><div><strong>${EXAM_SIZE}</strong><small>คำถาม</small></div><div><strong>${bank.chapters.length}</strong><small>บทเรียน</small></div><div><strong>${best===null?'—':best+'%'}</strong><small>คะแนนสูงสุด</small></div></div><button type="button" class="button primary mock-begin" id="mock-begin">เริ่มทำข้อสอบ ${EXAM_SIZE} ข้อ →</button></section>`;
    body.querySelector('#mock-begin').onclick = () => start();
  }
  function renderQuestion(){
    const s = session;
    const q = s.questions[s.index];
    const n = s.questions.length;
    const checked=s.checked;
    const ok=s.selected===q.answer;
    const options = q.options.map((o,i)=>`<label class="mock-option ${s.selected===i?'selected':''} ${checked&&i===q.answer?'correct':''} ${checked&&i===s.selected&&!ok?'incorrect':''}"><input type="radio" name="mock-choice" value="${i}" ${s.selected===i?'checked':''} ${checked?'disabled':''}><b>${'ABCD'[i]}</b><span>${escapeHTML(o)}</span>${checked&&i===q.answer?'<span aria-label="คำตอบที่ถูก">✓</span>':''}</label>`).join('');
    const explanation = checked ? `<section class="mock-feedback ${ok?'correct':'incorrect'}" role="status"><h3>${ok?'✓ ตอบถูกแล้ว':'✕ ข้อนี้ยังไม่ถูก'}</h3><p><b>เฉลย: ${'ABCD'[q.answer]}. ${escapeHTML(q.options[q.answer])}</b></p>${!ok?`<p>เหตุผลที่ตัวเลือกของคุณไม่ถูก: ${escapeHTML(q.reasons[s.selected])}</p>`:''}<p>เหตุผลของคำตอบ: ${escapeHTML(q.reasons[q.answer])}</p><details><summary>ดูเหตุผลของตัวเลือกทั้งหมด</summary>${q.options.map((o,i)=>`<p><b>${'ABCD'[i]}. ${escapeHTML(o)}</b> — ${escapeHTML(q.reasons[i])}</p>`).join('')}</details><a class="mock-read-more" href="#${course}/chapter/${encodeURIComponent(q.chapterId)}/summary">กลับไปอ่านสรุปบท ${q.chapterNo}</a></section>` : '';
    body.innerHTML = `<div class="mock-toolbar"><span>${s.mode==='wrong'?'ทบทวนเฉพาะข้อที่ผิด':`ชุด ${label} · ${EXAM_SIZE} ข้อ`}</span><strong>ข้อ ${s.index+1} / ${n}</strong></div><div class="mock-meter"><div style="width:${Math.round((s.index+(checked?1:0))/n*100)}%"></div></div><article class="mock-panel mock-question"><div class="mock-question-meta"><span>บท ${q.chapterNo} · ${escapeHTML(q.chapterTitle)}</span><span>${escapeHTML(q.sectionTitle)}</span>${q.level?`<span>${escapeHTML(q.level)}</span>`:''}</div><h2>${escapeHTML(q.prompt)}</h2><fieldset ${checked?'disabled':''} class="mock-choices"><legend class="sr-only">เลือกคำตอบเดียว</legend>${options}</fieldset>${explanation}<div class="mock-question-footer"><span>${checked?'อ่านคำอธิบายแล้วกดไปต่อ':'เลือกคำตอบที่ถูกที่สุด 1 ข้อ'}</span><button class="button primary" id="mock-action" ${!checked&&s.selected===null?'disabled':''}>${checked?(s.index===n-1?'ดูคะแนน':'ข้อต่อไป →'):'ตรวจคำตอบ'}</button></div></article><button class="mock-plain-button" id="mock-restart">เริ่มชุดนี้ใหม่</button>`;
    body.querySelectorAll('input[name="mock-choice"]').forEach(r=>r.onchange=()=>{s.selected=Number(r.value);renderQuestion();body.querySelector(`input[value="${s.selected}"]`)?.focus();});
    body.querySelector('#mock-action').onclick=()=>{
      if (!s.checked) {
        if(s.selected===null)return;
        s.checked=true;s.answers[q.id]=s.selected;renderQuestion();return;
      }
      if(s.index<n-1){s.index++;s.checked=false;s.selected=null;renderQuestion();return;}
      renderResult();
    };
    body.querySelector('#mock-restart').onclick=()=>start(s.questions,s.mode);
  }
  function renderResult(){
    const s=session;
    const wrong=s.questions.filter(q=>s.answers[q.id]!==q.answer);
    const correct=s.questions.length-wrong.length;
    const percent=Math.round(correct/s.questions.length*100);
    const result={correct,wrong,percent};
    const saved=s.mode==='full'?writeScore(period,result):null;
    body.innerHTML=`<section class="mock-panel mock-result"><div class="mock-pill">${s.mode==='wrong'?'ทบทวนข้อที่ผิด':'ทำข้อสอบครบแล้ว'}</div><h2>ผลคะแนน ${label}</h2><div class="mock-score"><strong>${percent}%</strong><span>ตอบถูก ${correct} จาก ${s.questions.length} ข้อ</span></div><p>ตอบผิด ${wrong.length} ข้อ — ${wrong.length?'ดูเฉลยแล้วทบทวนเพิ่มเติมได้':'ทำได้ครบทุกข้อแล้ว'}</p><div class="mock-actions">${wrong.length?'<button class="button primary" id="mock-wrong">ฝึกเฉพาะข้อที่ผิด ↻</button>':''}<button class="button secondary" id="mock-again">ทำชุดเต็มใหม่</button><a class="button secondary" href="${back}">กลับไปหน้า ${label}</a></div>${saved===false?'<p class="mock-save-note">ไม่สามารถบันทึกคะแนนในเบราว์เซอร์นี้</p>':''}</section>${wrong.length?`<div class="mock-wrong-list"><h2>เฉลยข้อที่ตอบผิด (${wrong.length})</h2>${wrong.map((q,i)=>`<article class="mock-panel"><span class="mock-kicker">บท ${q.chapterNo} · ข้อทบทวน ${i+1}</span><h3>${escapeHTML(q.prompt)}</h3><p class="mock-wrong-choice">คุณตอบ: ${'ABCD'[s.answers[q.id]]}. ${escapeHTML(q.options[s.answers[q.id]])}</p><p class="mock-right-choice">คำตอบที่ถูก: ${'ABCD'[q.answer]}. ${escapeHTML(q.options[q.answer])}</p><p>เหตุผล: ${escapeHTML(q.reasons[q.answer])}</p></article>`).join('')}</div>`:''}`;
    if(wrong.length)body.querySelector('#mock-wrong').onclick=()=>start(wrong,'wrong');
    body.querySelector('#mock-again').onclick=()=>start();
  }
  renderStart();
}
