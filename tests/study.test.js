import test from 'node:test';
import assert from 'node:assert/strict';
import { subjects, chapter } from '../assets/content.js';
import { grade, shuffle, readProgress, saveProgress, validBest } from '../assets/engine.js';
test('หกรายวิชาตรงปี 2 เทอม 1 และรหัสไม่ซ้ำ',()=>{
 assert.equal(subjects.length,6); assert.equal(new Set(subjects.map(s=>s.code)).size,6);
 assert.ok(subjects.every(s=>s.year===2&&s.term===1&&/^\d{8}$/.test(s.code)));
 assert.equal(subjects.find(s=>s.id==='multimedia-technology').code,'06016403');
});
test('บท 6 ครบ 5 หัวข้อ 30 การ์ด 25 ข้อ และข้อมูลอ้างอิงถูกเชื่อม',()=>{
 assert.equal(chapter.sections.length,5);assert.equal(chapter.flashcards.length,30);assert.equal(chapter.questions.length,25);
 assert.equal(new Set(chapter.questions.map(q=>q.id)).size,25);
 for(const q of chapter.questions){assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.equal(q.reasons.length,4);assert.ok(q.reasons.every(Boolean));assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4);assert.ok(chapter.sections.some(s=>s.id===q.topic));}
});
test('ตรวจคะแนนและชุดข้อผิดจากคำตอบจริง รวม index 0',()=>{
 const qs=chapter.questions;const all=Object.fromEntries(qs.map(q=>[q.id,q.answer]));assert.equal(grade(qs,all).percent,100);
 all[qs[0].id]=(qs[0].answer+1)%4;const result=grade(qs,all);assert.equal(result.correct,24);assert.equal(result.percent,96);assert.deepEqual(result.wrong,[qs[0]]);
 assert.equal(grade([qs[0]],{}).correct,0);assert.equal(grade([],{}).percent,0);
});
test('สลับข้อไม่ทำให้คำตอบหรือข้อมูลต้นฉบับเปลี่ยน',()=>{
 const before=chapter.questions.map(q=>q.id);const mixed=shuffle(chapter.questions,()=>0);
 assert.deepEqual(chapter.questions.map(q=>q.id),before);assert.equal(mixed.length,25);assert.equal(new Set(mixed.map(q=>q.id)).size,25);
 for(const q of mixed)assert.equal(q.answer,chapter.questions.find(o=>o.id===q.id).answer);
});
test('สูตรตัวอย่าง Linear Bezier และ Vector คำนวณได้ตรงเฉลย',()=>{
 const bez=(a,b,t)=>a.map((v,i)=>(1-t)*v+t*b[i]);assert.deepEqual(bez([2,4],[10,12],.25),[4,6]);assert.deepEqual(bez([2,6],[14,10],.75),[11,9]);assert.deepEqual([3-(-1),5-2],[4,3]);
});
test('บันทึกและอ่านความคืบหน้า รับมือ JSON เสียและ storage ถูกปิด',()=>{
 let data;const storage={getItem:()=>data,setItem:(_,v)=>data=v};const p={'chapter-6':{read:true,best:96}};
 assert.equal(saveProgress(storage,p),true);assert.deepEqual(readProgress(storage),p);
 data='broken';assert.deepEqual(readProgress(storage),{});data='[]';assert.deepEqual(readProgress(storage),{});
 const bad={getItem:()=>{throw Error();},setItem:()=>{throw Error();}};assert.deepEqual(readProgress(bad),{});assert.equal(saveProgress(bad,p),false);
 assert.equal(validBest(0),0);assert.equal(validBest(100),100);assert.equal(validBest('90'),null);assert.equal(validBest(-1),null);
});
