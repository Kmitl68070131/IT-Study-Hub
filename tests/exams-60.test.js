import test from 'node:test';
import assert from 'node:assert/strict';
import { finalChapters } from '../assets/final-chapters.js';
import { buildExamBank, EXAM_SIZE } from '../assets/exam-bank.js';

// Stub chapter 6 is only for testing the selector in isolation. The real site uses
// the chapter-6 questions already present in assets/content.js (25 questions).
const first={id:'chapter-6',number:6,title:'2D & 3D Graphics',exam:'final',
  sections:['vector','curves','manipulations','modeling','rendering'].map(id=>({id,title:id})),
  questions:Array.from({length:25},(_,i)=>({id:`q${i+1}`,topic:['vector','curves','manipulations','modeling','rendering'][i%5],prompt:`สมมติข้อที่ ${i+1}`,options:['A','B','C','D'],answer:0,reasons:['A','B','C','D']}))};
const sampleSubject={chapters:[first,...finalChapters]};

test('Final bank contains exactly 60 nonduplicated questions across 7 chapters',()=>{
  const bank=buildExamBank(sampleSubject,'final');
  assert.ok(bank.ready);
  assert.equal(bank.questions.length,EXAM_SIZE);
  assert.equal(new Set(bank.questions.map(q=>q.id)).size,EXAM_SIZE);
  assert.deepEqual([6,7,8,9,10,11,12].map(n=>bank.questions.filter(q=>q.chapterNo===n).length),[9,9,9,9,8,8,8]);
  for (const q of bank.questions) {
    assert.ok(q.chapterId && q.sectionTitle);
    assert.equal(q.options.length,4);
    assert.equal(q.reasons.length,4);
    assert.ok(q.reasons.every(Boolean));
    assert.ok(q.answer>=0 && q.answer<=3);
  }
});
test('Midterm exam remains pending until source material provides 60 validated questions',()=>{
  const bank=buildExamBank(sampleSubject,'midterm');
  assert.equal(bank.ready,false);
  assert.equal(bank.questions.length,0);
  assert.equal(bank.total,EXAM_SIZE);
});
test('Final requires all seven chapters and cannot silently claim 60 when a chapter is absent',()=>{
  const bank=buildExamBank({chapters:finalChapters},'final');
  assert.equal(bank.ready,false);
  assert.equal(bank.questions.length,0);
});
