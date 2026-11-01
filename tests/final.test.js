import test from 'node:test';
import assert from 'node:assert/strict';
import { finalChapters } from '../assets/final-chapters.js';

test('Final has chapters 7–12 only and ordered', () => {
  assert.deepEqual(finalChapters.map(c=>c.number),[7,8,9,10,11,12]);
  assert.ok(finalChapters.every(c=>c.exam==='final'));
});
test('All chapters have summaries, explanations, flashcards, and usable quizzes', () => {
  const ids = new Set();
  for(const c of finalChapters){
    assert.ok(c.sections.length>=3);
    assert.ok(c.flashcards.length>=15);
    assert.ok(c.questions.length>=18);
    const topics = new Set(c.sections.map(s=>s.id));
    for(const section of c.sections){
      assert.ok(section.title && section.pages && section.intro);
      assert.ok(section.points.length>=4 && section.remember);
    }
    for(const card of c.flashcards){
      assert.ok(card.front && card.back && card.term && card.meaning);
    }
    for(const q of c.questions){
      assert.ok(!ids.has(q.id));ids.add(q.id);
      assert.ok(topics.has(q.topic));
      assert.equal(q.options.length,4);
      assert.equal(new Set(q.options).size,4);
      assert.equal(q.reasons.length,4);
      assert.ok(q.reasons.every(Boolean));
      assert.ok(Number.isInteger(q.answer) && q.answer>=0 && q.answer<=3);
    }
  }
});
