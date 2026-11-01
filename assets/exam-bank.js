// Question selection is derived from the chapter banks already grounded in the provided slides.
// We do not fabricate Midterm items before receiving the Midterm lecture material.
export const EXAM_SIZE = 60;
const FINAL_QUOTAS = new Map([[6,9],[7,9],[8,9],[9,9],[10,8],[11,8],[12,8]]);

// Stable selection within each chapter, visiting topics in turn instead of taking the first items only.
function balancedPick(chapter, count) {
  if (!chapter || !Array.isArray(chapter.questions) || chapter.questions.length < count) return [];
  const byTopic = new Map();
  for (const q of chapter.questions) {
    if (!byTopic.has(q.topic)) byTopic.set(q.topic, []);
    byTopic.get(q.topic).push(q);
  }
  const groups = [...byTopic.values()];
  const picked = [];
  while (picked.length < count && groups.some(g => g.length > 0)) {
    for (const group of groups) {
      if (group.length && picked.length < count) picked.push(group.shift());
    }
  }
  return picked;
}

export function buildExamBank(subject, period) {
  const chapters = (subject.chapters || [])
    .filter(c => (c.exam || 'final') === period)
    .sort((a,b) => a.number - b.number);
  // For future Midterm content, distribute 60 across all available chapters,
  // respecting each chapter's question count (some chapters may be shorter).
  const needed = period === 'final' ? chapters.map(c => FINAL_QUOTAS.get(c.number) || 0) : chapters.map(() => 0);
  if (period === 'midterm') {
    let remaining = EXAM_SIZE;
    while (remaining > 0) {
      let filled = false;
      for (let i=0; i<chapters.length && remaining>0; i++) {
        if (needed[i] < (chapters[i].questions?.length || 0)) {
          needed[i]++; remaining--; filled = true;
        }
      }
      if (!filled) break;
    }
  }
  const ready = !!chapters.length && needed.reduce((a,b) => a+b,0) === EXAM_SIZE && chapters.every((c,i) => (c.questions || []).length >= needed[i]);
  if (!ready) return {ready:false,period,questions:[],total:EXAM_SIZE,chapters,available:chapters.reduce((n,c)=>n+(c.questions?.length||0),0)};
  const questions = chapters.flatMap((c,i) => balancedPick(c,needed[i]).map(q => ({
    ...q,
    id: `${c.id}::${q.id}`,
    topic: `${c.id}::${q.topic}`,
    chapterId: c.id,
    chapterNo: c.number,
    chapterTitle: c.title,
    sectionTitle: c.sections.find(s=>s.id===q.topic)?.title || 'หัวข้อทบทวน'
  })));
  const ids = questions.map(q=>q.id);
  if (questions.length !== EXAM_SIZE || new Set(ids).size !== EXAM_SIZE) throw new Error('ชุดข้อสอบมีจำนวนหรือ ID ไม่ครบ 60 ข้อ');
  return {ready:true,period,questions,total:EXAM_SIZE,chapters,available:questions.length};
}
