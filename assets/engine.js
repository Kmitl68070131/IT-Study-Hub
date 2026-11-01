// แยกตรรกะที่ตรวจสอบได้ออกจาก UI; ทุกคะแนนใช้จำนวนข้อในรอบนั้นจริง ๆ
export function grade(questions, answers) {
  const wrong = questions.filter(q => answers[q.id] !== q.answer);
  return { total: questions.length, correct: questions.length - wrong.length, wrong, percent: questions.length ? Math.round((questions.length - wrong.length) * 100 / questions.length) : 0 };
}
export function shuffle(items, random = Math.random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function readProgress(storage) {
  try {
    const value = JSON.parse(storage.getItem('it-study-hub:v1') || '{}');
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  } catch { return {}; }
}
export function saveProgress(storage, value) {
  try { storage.setItem('it-study-hub:v1', JSON.stringify(value)); return true; }
  catch { return false; }
}
export function validBest(value) {
  return Number.isInteger(value) && value >= 0 && value <= 100 ? value : null;
}
