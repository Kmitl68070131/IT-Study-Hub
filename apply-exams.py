#!/usr/bin/env python3
"""Install Final 60-question test and Midterm 60-question shell after the existing study update.

Usage: python apply-exams.py PATH_TO_IT-STUDY-HUB
"""
from pathlib import Path
import subprocess, sys, shutil

root = Path(sys.argv[1] if len(sys.argv) > 1 else '.').resolve()
source = Path(__file__).resolve().parent
if not (root/'index.html').is_file() or not (root/'assets/app.js').is_file():
    raise SystemExit('ต้องระบุโฟลเดอร์ IT-Study-Hub จริงที่มี index.html และ assets/app.js')
subprocess.run([sys.executable,str(source/'apply-update.py'),str(root)],check=True)
assets = root/'assets'
for name in ['exam-bank.js','exam.js','exam.css']:
    shutil.copy2(source/'assets'/name,assets/name)
(root/'tests').mkdir(exist_ok=True)
shutil.copy2(source/'tests'/'exams-60.test.js',root/'tests'/'exams-60.test.js')

app = assets/'app.js'
s = app.read_text(encoding='utf-8')
if "from './exam.js'" not in s:
    s="import { showExam } from './exam.js';\n"+s

# Add the two exam entry cards to Multimedia's exam-period navigation.
if 'mock-exam-entry-v1' not in s:
    needle='  const intro = `<p class="intro-note">${s.description}</p>${examNav}`;'
    insert='''  // mock-exam-entry-v1: a separate 60-question test for each examination period.
  const examEntry = isMultimedia ? `<section class="mock-exam-entry" aria-label="ข้อสอบจำลอง 60 ข้อ"><div class="mock-entry-copy"><strong>ข้อสอบรวม 60 ข้อ</strong><span>เลือกช่วงสอบเพื่อฝึกทำชุดใหญ่ พร้อมตรวจคะแนนและเฉลยทันที</span></div><div class="mock-entry-links"><a href="#${base(s,null)}/midterm/exam" class="mock-entry-link midterm">Midterm 60 ข้อ <small>รอสไลด์กลางภาค</small></a><a href="#${base(s,null)}/final/exam" class="mock-entry-link final">Final 60 ข้อ <small>พร้อมทำ · บท 6–12</small></a></div></section>` : '';
'''
    if needle not in s: raise SystemExit('ไม่พบตำแหน่ง examNav ใน app.js กรุณาตรวจเวอร์ชันไฟล์')
    s=s.replace(needle,needle+'\n'+insert,1)
    old=' + intro + cards;'
    if old not in s: raise SystemExit('ไม่พบตำแหน่งต่อท้าย intro + cards ของ chapters()')
    s=s.replace(old,' + intro + examEntry + cards;',1)

# Keep routes for /midterm and /final, while supporting /final/exam and /midterm/exam.
line="   else if(route.length===7 && s.id==='multimedia-technology' && ['midterm','final'].includes(route[6])) chapters(s,route[6]);"
new=line+"\n   else if(route.length===8 && s.id==='multimedia-technology' && ['midterm','final'].includes(route[6]) && route[7]==='exam') showExam(s,route[6],main);"
if 'showExam(s,route[6],main)' not in s:
    if line not in s: raise SystemExit('ไม่พบ routing Midterm/Final ใน app.js')
    s=s.replace(line,new,1)
app.write_text(s,encoding='utf-8')

css=assets/'styles.css';style=css.read_text(encoding='utf-8')
if '/* Midterm & Final: 60-question mock exam interface */' not in style:
    style+='\n'+(assets/'exam.css').read_text(encoding='utf-8')
if '/* mock-exam-entry-v1 */' not in style:
    style+='''
/* mock-exam-entry-v1 */
.mock-exam-entry{display:flex;justify-content:space-between;gap:18px;align-items:center;margin:20px 0 35px;background:#edf7ff;border:1px solid #bfdcf1;border-radius:12px;padding:20px 23px}
.mock-entry-copy{display:grid;gap:4px}.mock-entry-copy strong{font-size:17px;color:#215c88}.mock-entry-copy span{font-size:11px;color:#5e819b}
.mock-entry-links{display:flex;gap:10px}.mock-entry-link{border:1.5px solid #a7cbeb;border-radius:8px;background:#fff;padding:12px 18px;font-size:13px;font-weight:700;white-space:nowrap;color:#276f9f;text-align:center}.mock-entry-link:hover{background:#dff0fe}.mock-entry-link.final{border-color:#f4b77a;background:#fff2e5;color:#9e632d}.mock-entry-link.final:hover{background:#ffe6d0}.mock-entry-link small{display:block;font-size:9px;line-height:2;font-weight:400;opacity:.85}
@media(max-width:820px){.mock-exam-entry{flex-direction:column;align-items:stretch}.mock-entry-links{width:100%}.mock-entry-link{flex:1;padding:11px 8px}}
'''
css.write_text(style,encoding='utf-8')

readme=root/'README.md';readme_text=readme.read_text(encoding='utf-8')
start='<!-- MOCK-EXAMS-60-START -->';end='<!-- MOCK-EXAMS-60-END -->'
section='''<!-- MOCK-EXAMS-60-START -->

### 📝 ข้อสอบจำลอง 60 ข้อ — Midterm / Final

| ชุดสอบ | จำนวน | สถานะ | ลิงก์ |
|---|---:|---|---|
| 📘 Midterm | 60 ข้อ | รอไฟล์เนื้อหากลางภาค (ยังไม่สร้างคำถามสมมติ) | [เปิดหน้าข้อสอบ Midterm](https://pakk49.github.io/IT-Study-Hub/#/year/2/term/1/subject/multimedia-technology/midterm/exam) |
| 🟠 Final | 60 ข้อ | พร้อมทำ: คัดข้อสอบอย่างสมดุลจากบท 6–12 | [ทำข้อสอบ Final 60 ข้อ](https://pakk49.github.io/IT-Study-Hub/#/year/2/term/1/subject/multimedia-technology/final/exam) |

**ข้อสอบ Final:** สุ่มลำดับคำถามทุกครั้งที่เริ่ม, 4 ตัวเลือก, เฉลยพร้อมเหตุผลหลังตรวจคำตอบ, ดูเฉลยทุกตัวเลือก, สรุปคะแนนและฝึกเฉพาะข้อผิด, เก็บคะแนนสูงสุดใน localStorage ของเบราว์เซอร์นั้น

**การกระจายข้อสอบ Final:** บท 6–9 บทละ 9 ข้อ และบท 10–12 บทละ 8 ข้อ รวม 60 ข้อพอดี โดยกระจายไปตามหัวข้อย่อย ไม่ใช้ข้อซ้ำภายในชุด

เมื่อได้รับเนื้อหา Midterm แล้ว ให้นำ chapter objects ที่มีคำถามและเฉลยครบมาใส่ใน `assets/midterm-chapters.js` (รวมไม่น้อยกว่า 60 ข้อ) หน้า Midterm จะเปิดชุดข้อสอบ 60 ข้ออัตโนมัติ

> ข้อสอบเป็นชุดฝึกทำจากสไลด์ ไม่ใช่ข้อสอบจริงของอาจารย์หรือเฉลยอย่างเป็นทางการ

<!-- MOCK-EXAMS-60-END -->'''
if start in readme_text and end in readme_text:
    i=readme_text.index(start);j=readme_text.index(end)+len(end)
    readme_text=readme_text[:i]+section+readme_text[j:]
else: readme_text=readme_text.rstrip()+'\n\n'+section+'\n'
readme.write_text(readme_text,encoding='utf-8')
print('ติดตั้ง Mock Exam Final 60 ข้อ และหน้า Midterm 60 ข้อ (รอเนื้อหา) เรียบร้อย')
