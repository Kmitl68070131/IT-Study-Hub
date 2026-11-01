#!/usr/bin/env python3
"""Apply the final-study pack to an existing clone of pakk49/IT-Study-Hub.
Usage: python apply-update.py /path/to/IT-Study-Hub
Can safely be rerun; does not touch unrelated subject content.
"""
from pathlib import Path
import argparse, shutil, runpy

p=argparse.ArgumentParser(description='เพิ่ม Multimedia Midterm/Final เข้า IT-Study-Hub')
p.add_argument('repo',nargs='?',default='.',help='ที่อยู่โฟลเดอร์ repo ที่มี index.html และ assets/')
a=p.parse_args()
repo=Path(a.repo).resolve()
source=Path(__file__).resolve().parent
required=['index.html','assets/app.js','assets/content.js','assets/styles.css','README.md']
missing=[p for p in required if not (repo/p).is_file()]
if missing:raise SystemExit('ไม่พบไฟล์ใน repo: '+', '.join(missing)+'\nต้องรันกับโฟลเดอร์ IT-Study-Hub เดิม ไม่ใช่โฟลเดอร์ไฟล์ ZIP')

# Preserve old version of the original site files once.
backup=(repo/'.git'/'it-study-backup-before-final') if (repo/'.git').is_dir() else (repo.parent/(repo.name+'-backup-before-final'))
backup.mkdir(exist_ok=True)
for file in ['assets/app.js','assets/content.js','assets/styles.css','README.md']:
    dest=backup/file
    dest.parent.mkdir(parents=True,exist_ok=True)
    if not dest.exists():shutil.copy2(repo/file,dest)

# Reuse the existing glossary/theme improvement from the previous update pack.
oldscript=source/'update_flashcards_and_colors.py'
tempscript=repo/'_temp_flashcard_update.py'
if oldscript.is_file():
    shutil.copy2(oldscript,tempscript)
    try:runpy.run_path(str(tempscript),run_name='__main__')
    finally:tempscript.unlink(missing_ok=True)

for path in ['assets/final-chapters.js','assets/midterm-chapters.js']:
    (repo/path).parent.mkdir(parents=True,exist_ok=True)
    # Never discard actual Midterm content that the user may add later.
    if path == 'assets/midterm-chapters.js' and (repo/path).exists():
        continue
    shutil.copy2(source/path,repo/path)

content=repo/'assets/content.js'
s=content.read_text(encoding='utf-8')
imports="import { finalChapters } from './final-chapters.js';\nimport { midtermChapters } from './midterm-chapters.js';\n"
if "from './final-chapters.js'" not in s:
    s=imports+s
s=s.replace('chapters: [chapter]', 'chapters: [...midtermChapters, chapter, ...finalChapters]')
if 'chapters: [...midtermChapters, chapter, ...finalChapters]' not in s:
    raise SystemExit('ไม่พบตำแหน่ง chapters ของ MULTIMEDIA TECHNOLOGY ใน assets/content.js')
content.write_text(s,encoding='utf-8')

app=repo/'assets/app.js'
s=app.read_text(encoding='utf-8')
start=s.find('function chapters(s) {')
end=s.find('function readerShell(s,c) {')
new_chapters=r'''function chapters(s, exam='final') {
  const isMultimedia = s.id === 'multimedia-technology';
  const selected = isMultimedia ? (exam === 'midterm' ? 'midterm' : 'final') : null;
  const chaptersToShow = isMultimedia ? s.chapters.filter(c => (c.exam || 'final') === selected) : s.chapters;
  const examNav = isMultimedia ? `<div class="exam-switch" role="navigation" aria-label="เลือกช่วงสอบ">
    <a href="#${base(s,null)}/midterm" class="exam-switch-item ${selected==='midterm'?'active':''}" ${selected==='midterm'?'aria-current="page"':''}><span class="exam-icon">📘</span><span><b>Midterm · กลางภาค</b><small>${s.chapters.filter(c=>c.exam==='midterm').length} บท · ${selected==='midterm'?'กำลังแสดง':'รอเอกสารกลางภาค'}</small></span></a>
    <a href="#${base(s,null)}/final" class="exam-switch-item ${selected==='final'?'active':''}" ${selected==='final'?'aria-current="page"':''}><span class="exam-icon">🟠</span><span><b>Final · ปลายภาค</b><small>${s.chapters.filter(c=>(c.exam||'final')==='final').length} บท · สรุป + แฟลชการ์ด + ข้อสอบ</small></span></a>
  </div>` : '';
  const intro = `<p class="intro-note">${s.description}</p>${examNav}`;
  const cards = chaptersToShow.length ? `<div class="section-heading"><h2>${isMultimedia?(selected==='final'?'บทเรียน Final':'บทเรียน Midterm'):'บทเรียนทั้งหมด'}</h2><span>${chaptersToShow.length} CHAPTER</span></div><div class="chapters">${chaptersToShow.map(c=>{
    const p=chapterState(c), best=validBest(p.best);
    return `<a class="chapter-card" href="#${base(s,c)}/summary"><span class="chapter-number">${String(c.number).padStart(2,'0')}</span><div class="chapter-info"><div class="chapter-meta"><span>CHAPTER ${String(c.number).padStart(2,'0')}</span>${p.read?'<span class="pill ready">อ่านแล้ว</span>':''}</div><h2>${esc(c.title)}</h2><p>${esc(c.description)}</p><div class="chapter-details"><span>${icon('clock')}${c.minutes} นาที</span><span>${icon('cards')}${c.flashcards.length} แฟลชการ์ด</span><span>${icon('quiz')}${c.questions.length} ข้อ</span></div></div><div class="chapter-trailing">${best!==null?`<small>คะแนนสูงสุด</small><strong>${best}%</strong>`:'<span class="pill ready">พร้อมอ่าน</span>'}${icon('arrow')}</div></a>`;
  }).join('')}</div><p class="muted source-note">เนื้อหาสรุปเรียบเรียงจากสไลด์ Multimedia Technology พร้อมคำถามฝึกหัด ไม่ใช่ข้อสอบจริง</p>` : isMultimedia && selected==='midterm'
    ? `<div class="exam-placeholder"><div class="exam-placeholder-mark">📚</div><h2>เตรียมพื้นที่ Midterm ไว้แล้ว</h2><p>ยังไม่มีสไลด์กลางภาคในชุดข้อมูลนี้ เมื่อได้รับไฟล์จะเพิ่มสรุป แฟลชการ์ด และข้อสอบแยกจาก Final โดยไม่กระทบความคืบหน้าที่บันทึกไว้</p><a class="button secondary" href="#${base(s,null)}/final">ไปทบทวน Final ${icon('arrow')}</a></div>`
    : `<div class="empty"><h2>ยังไม่มีบทเรียนในวิชานี้</h2><p>เมื่อเพิ่มเอกสารแล้ว สรุปและข้อสอบจะปรากฏแยกตามบท</p></div>`;
  main.innerHTML = crumbs([[`ปี ${s.year}`,`/year/${s.year}`],[`เทอม ${s.term}`,`/year/${s.year}/term/${s.term}`],[s.title]]) + steps(3) + banner(`${s.code} / YEAR ${s.year} / SEMESTER ${s.term}`,s.title,s.thai) + intro + cards;
}
'''
if start>=0 and end>start:
    s=s[:start]+new_chapters+s[end:]
elif 'function chapters(s, exam=' not in s:
    raise SystemExit('ไม่พบฟังก์ชัน chapters() ที่ต้องแก้ใน app.js')
old="if(route.length===6)chapters(s);"
new="if(route.length===6)chapters(s);\n   else if(route.length===7 && s.id==='multimedia-technology' && ['midterm','final'].includes(route[6])) chapters(s,route[6]);"
if new in s:
    pass  # มี route Midterm/Final แล้ว
elif old in s:
    s=s.replace(old,new,1)
else:raise SystemExit('ไม่พบ routing สำหรับ chapters()')
app.write_text(s,encoding='utf-8')

css=repo/'assets/styles.css'
s=css.read_text(encoding='utf-8')
if '/* Multimedia exam tabs v1 */' not in s:
    s += '''\n/* Multimedia exam tabs v1 */
.exam-switch{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin:22px 0 36px}
.exam-switch-item{display:flex;align-items:center;gap:16px;border:2px solid #cbdfee;border-radius:12px;background:#fff;padding:20px 22px;transition:transform .15s,border-color .15s,background .15s}
.exam-switch-item:hover{transform:translateY(-2px);border-color:#77b8e5}
.exam-switch-item.active{border-color:#277fb9;background:#e4f2ff;box-shadow:0 4px 0 #c9e4f6}
.exam-switch-item:last-child.active{border-color:#eea05f;background:#fff2e5;box-shadow:0 4px 0 #f8dec5}
.exam-switch-item .exam-icon{height:48px;width:48px;border-radius:10px;background:#dff0ff;display:grid;place-items:center;font-size:23px;flex-shrink:0}
.exam-switch-item:last-child .exam-icon{background:#fff1df}
.exam-switch-item b{display:block;color:#1b567d;font-size:16px;line-height:1.6}
.exam-switch-item small{display:block;color:#69879c;font-size:11px;line-height:1.7}
.exam-placeholder{margin:28px 0;background:#f0f8ff;border:1px dashed #9bc9e8;border-radius:13px;padding:45px 28px;text-align:center}
.exam-placeholder-mark{font-size:46px;margin-bottom:14px}.exam-placeholder h2{font-size:24px;color:#2b658e}.exam-placeholder p{margin:8px auto 26px;max-width:570px;color:#547a95;font-size:13px;line-height:2}
@media(max-width:650px){.exam-switch{grid-template-columns:1fr;gap:12px}.exam-switch-item{padding:17px}.exam-switch-item b{font-size:14px}.exam-placeholder{padding:32px 19px}}
'''
css.write_text(s,encoding='utf-8')

readme=repo/'README.md'
s=readme.read_text(encoding='utf-8')
start='<!-- MULTIMEDIA-EXAMS-START -->'
end='<!-- MULTIMEDIA-EXAMS-END -->'
section='''<!-- MULTIMEDIA-EXAMS-START -->

## 📚 Multimedia Technology — เลือก Midterm / Final

[📘 เปิด Midterm](https://pakk49.github.io/IT-Study-Hub/#/year/2/term/1/subject/multimedia-technology/midterm) · [🟠 เปิด Final](https://pakk49.github.io/IT-Study-Hub/#/year/2/term/1/subject/multimedia-technology/final) · [🏠 หน้าแรก](https://pakk49.github.io/IT-Study-Hub/)

<a id="multimedia-midterm"></a>
<details>
<summary><b>📘 Midterm (กลางภาค) — รอไฟล์สไลด์</b></summary>

พื้นที่ Midterm เตรียมรองรับสรุปรายบท แฟลชการ์ดและข้อสอบ พร้อมตรวจคำตอบและแสดงเหตุผลแล้ว เนื้อหาจะเพิ่มเมื่อได้รับสไลด์กลางภาค (ยังไม่ได้ใส่บทเรียนสมมติ)

</details>

<a id="multimedia-final"></a>
<details open>
<summary><b>🟠 Final (ปลายภาค) — บท 6–12</b></summary>

| บท | หัวข้อ | สไลด์อ้างอิง |
|:--:|---|---|
| 6 | 2D & 3D Graphics | mm169_ch6.pdf (เนื้อหาเดิม) |
| 7 | Computer Animation | mm169_ch7.pdf |
| 8 | Sound | mm169_ch8.pdf |
| 9 | Text & Typography | mm169_ch9.pdf |
| 10 | Hypermedia and Web Platform | mm169_ch10.pdf |
| 11 | Multimedia Networking & Security | mm169_ch11.pdf |
| 12 | Multimedia Devices | mm169_ch12.pdf |

ในแต่ละบทมี **สรุปแบ่งหัวข้อ** พร้อมจุดจำ, **แฟลชการ์ดคำศัพท์และความหมาย**, **ข้อสอบฝึกทำที่เฉลยทุกตัวเลือก**, และระบบฝึกซ้ำข้อที่ตอบผิด/บันทึกคะแนนในเบราว์เซอร์

> แบบฝึกหัดจัดทำขึ้นเพื่อการทบทวนจากเนื้อหาในสไลด์ ไม่ใช่ข้อสอบจริงหรือเฉลยที่อาจารย์รับรอง

</details>

หากจะเพิ่มบทกลางภาคในอนาคต ให้วาง chapter objects ใน `assets/midterm-chapters.js` โดยกำหนด `exam: "midterm"` และ `id` ไม่ซ้ำกับบทอื่น

<!-- MULTIMEDIA-EXAMS-END -->
'''
if start in s and end in s:
    a=s.index(start);b=s.index(end)+len(end)
    s=s[:a].rstrip()+'\n\n'+section.rstrip()+'\n'+s[b:].lstrip('\n')
else:s=s.rstrip()+'\n\n'+section.rstrip()+'\n'
readme.write_text(s,encoding='utf-8')
print(f'อัปเดตเว็บที่ {repo} เรียบร้อย: Midterm ว่าง, Final บท 6–12, กล่องศัพท์และสีฟ้า-ส้ม')
