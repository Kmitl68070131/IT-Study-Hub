from pathlib import Path
import re
root = Path(__file__).resolve().parent
content = root / 'assets' / 'content.js'
app = root / 'assets' / 'app.js'
css = root / 'assets' / 'styles.css'
for p in (content,app,css):
    if not p.exists():
        raise SystemExit(f'ไม่พบ {p.relative_to(root)} — วางไฟล์นี้ไว้ที่โฟลเดอร์หลักของ IT-Study-Hub ก่อน')
glossary = [
('Vector Graphics','กราฟิกเวกเตอร์ คือภาพที่สร้างจากรูปทรงทางคณิตศาสตร์ ขยายแล้วเส้นยังคม'),
('Bitmapped Image','ภาพบิตแมป คือภาพที่ประกอบด้วยจุดภาพหรือพิกเซลจำนวนมาก'),
('Logo','โลโก้ คือสัญลักษณ์ของแบรนด์หรือองค์กร มักสร้างเป็นเวกเตอร์เพื่อให้ปรับขนาดได้'),
('Photograph / Bitmap','ภาพถ่ายบิตแมป คือภาพที่เก็บรายละเอียดแสง สี และพื้นผิวด้วยพิกเซล'),
('Point / Vector','Point คือจุดตำแหน่ง ส่วน Vector คือปริมาณที่มีขนาดและทิศทาง'),
('Displacement Vector','เวกเตอร์การกระจัด คือเวกเตอร์จากจุดเริ่มไปจุดปลาย คำนวณด้วย B − A'),
('Circle','วงกลม คือจุดทั้งหมดที่อยู่ห่างจากศูนย์กลางเท่ากับรัศมี'),
('Rasterization','แรสเตอร์ไรเซชัน คือการแปลงรูปทรงเรขาคณิตเป็นพิกเซลบนหน้าจอ'),
('Screen Coordinates','พิกัดหน้าจอ คือระบบตำแหน่งที่โดยทั่วไปแกน y เพิ่มลงล่าง'),
('Curve','เส้นโค้ง คือเส้นที่เปลี่ยนทิศอย่างต่อเนื่องและควบคุมรูปร่างได้'),
('Bézier Curve','เส้นโค้งเบซิเยร์ คือเส้นโค้งที่ควบคุมด้วยจุด โดยแบบเส้นตรงใช้ 2 จุด กำลังสองใช้ 3 จุด กำลังสามใช้ 4 จุด'),
('Linear Bézier','เส้นเบซิเยร์แบบเส้นตรง คือจุดระหว่างปลายทั้งสองที่กำหนดด้วยค่า t'),
('Interpolation','การประมาณค่าระหว่างจุด คือการคำนวณตำแหน่งระหว่างค่าที่ทราบ'),
('Cubic Bézier','เส้นเบซิเยร์กำลังสาม คือเส้นโค้งที่มีจุดควบคุม 4 จุด'),
('Control Points','จุดควบคุม คือจุดที่มีผลต่อรูปร่างและทิศสัมผัสของเส้นโค้ง'),
('C⁰ Continuity','ความต่อเนื่อง C⁰ คือเส้นสองช่วงเชื่อมกันที่ตำแหน่งเดียวกัน'),
('C¹ Continuity','ความต่อเนื่อง C¹ คือจุดเชื่อมตรงกันและอนุพันธ์อันดับหนึ่งเท่ากัน'),
('Stroke / Fill','Stroke คือเส้นขอบของรูป ส่วน Fill คือสีหรือเนื้อด้านใน'),
('Affine Transform','การแปลงแบบ Affine คือการเลื่อน หมุน ย่อขยาย สะท้อนหรือเฉือนที่รักษาความขนาน'),
('Parallelism','ความขนาน คือคุณสมบัติของเส้นคู่หนึ่งที่ยังคงเดิมหลังแปลงแบบ Affine'),
('Boolean AND / OR','การดำเนินการบูลีน คือ AND หาส่วนซ้อนทับ และ OR รวมพื้นที่ทั้งหมด'),
('Difference / XOR','Difference คือลบพื้นที่หนึ่งออกจากอีกพื้นที่ XOR คือเลือกเฉพาะส่วนไม่ทับกัน'),
('Extrusion','เอ็กซ์ทรูชัน คือการยืดรูปร่าง 2D เพื่อให้เกิดความหนาเป็น 3D'),
('Lathe','เลธ คือการหมุนเส้นหน้าตัดรอบแกนเพื่อสร้างรูปทรงสามมิติ'),
('Vertex / Edge / Face','Vertex คือจุดยอด Edge คือเส้นขอบ และ Face คือผิวหน้า'),
('Polygon Mesh','ตาข่ายโพลีกอน คือผิววัตถุสามมิติที่ประกอบจากรูปหลายเหลี่ยมเชื่อมกัน'),
('Parametric Surface Modeling','การสร้างผิวพาราเมตริก คือการสร้างพื้นผิวด้วยสมการและพารามิเตอร์ เช่น NURBS'),
('Modeling / Rendering','Modeling คือสร้างแบบจำลอง ส่วน Rendering คือสร้างภาพจากแบบจำลอง แสงและกล้อง'),
('Specular / Diffuse Reflection','Specular คือสะท้อนแสงเด่นตามทิศ ส่วน Diffuse คือกระจายแสงหลายทิศ'),
('Rendering Pipeline','ขั้นตอนเรนเดอร์ คือการฉายภาพ ตรวจส่วนที่มองเห็น และคำนวณแสงเงา')]
assert len(glossary)==30
import json
s=content.read_text(encoding='utf-8')
if 'const glossary = ' not in s:
    tag='// แต่ละข้อมีเหตุผลครบทุกตัวเลือก'
    assert s.count(tag)==1
    s=s.replace(tag,'// คำอธิบายศัพท์ของแฟลชการ์ด 30 ใบ\nconst glossary = '+json.dumps(glossary,ensure_ascii=False,indent=2)+';\n'+tag)
    old='sections, flashcards: pairs.map(([front, back], i) => ({id: `f${i + 1}`, front, back})),'
    assert s.count(old)==1
    s=s.replace(old,'sections, flashcards: pairs.map(([front, back], i) => ({id: `f${i + 1}`, front, back, term: glossary[i][0], meaning: glossary[i][1]})),')
    content.write_text(s,encoding='utf-8')
s=app.read_text(encoding='utf-8')
old='<strong>${esc(flash.flipped?f.back:f.front)}</strong><span class="flip-hint">'
new='<strong>${esc(flash.flipped?f.back:f.front)}</strong>${flash.flipped?`<span class="flash-explainer"><span class="flash-explainer-title">คำศัพท์: ${esc(f.term)}</span><span class="flash-explainer-text">${esc(f.meaning)}</span></span>`:""}<span class="flip-hint">'
if old in s:
    s=s.replace(old,new)
    s=s.replace('แตะการ์ดหรือกด Space เมื่อโฟกัสที่การ์ดเพื่อพลิกดูคำตอบ','แตะการ์ดเพื่อพลิกดูคำตอบ พร้อมคำศัพท์และความหมายในแต่ละใบ')
    app.write_text(s,encoding='utf-8')
s=css.read_text(encoding='utf-8')
start=s.find('/* Light blue + warm orange theme.')
if start!=-1:s=s[:start]
addition='''
/* ปรับสีฟ้าให้เข้มขึ้นโดยยังคุมโทนสว่างและสีส้ม */
:root{--forest:#287cb5;--green:#1b70ad;--lime:#ffd6ae;--ink:#20435f;--muted:#567891;--border:#cadeed;--paper:#f5faff;--orange:#f39e55;--orange-soft:#fff0df}
.sidebar{background:#287cb5;color:#fff;border-right:1px solid #2071a9}
.brand-mark{color:#fff}.brand-mark span{color:#ffc08a}.brand small,.sidebar-label{color:#e4f3ff}
.nav-home{background:#ffffff22;border-color:#ffffff40;color:#fff}.nav-dot,.year-indicator{background:#ffba79}
#year-nav a{color:#f1f8ff}#year-nav a:hover,#year-nav a.selected{color:#fff;background:#ffffff30}.nav-year-number{color:#dcefff}
.sidebar-note{color:#fff}.note-spark{color:#ffc08a}.sidebar-note small{color:#e5f3ff}.repo-link{color:#f1f8ff;border-top-color:#ffffff55}
.topbar{background:#fff}.welcome-banner{background:linear-gradient(120deg,#d5edff,#e9f5ff 68%,#fff1e4);border-color:#b1d7ee}
.welcome-banner h2>span{color:#e88738}.welcome-banner p{color:#476d8b}
.button.primary,.button.lime{background:#f6a660;color:#49301e;border-color:#e9964e}.button.primary:hover,.button.lime:hover{background:#f39443}
.button.secondary{border-color:#a8d0ec;background:#eaf6ff;color:#1f6699}.button.secondary:hover{background:#d8edfc}
.pill.ready{background:#fff0dc;color:#986232}.pill.light{background:#fff8ed;border-color:#f2d5b7;color:#8d613e}
.art-tag{background:#ffd9af;color:#7f522e}.year-card.available{background:#e5f3ff;border-color:#9ecbec}
.steps .current b{background:#2f85bf;color:#fff}.tabs a.active{color:#1a70ae;border-bottom-color:#f09a50;font-weight:700}
.subject-symbol{background:#dff0fd;color:#236fa9}.tone-1 .subject-symbol{background:#e7f3ff;color:#2b78b2}.tone-2 .subject-symbol{background:#fff0df;color:#a86d36}
.progress-track>div{background:#318dcb}.score-ring{border-color:#acd2ec;color:#287ab5}
.remember{background:#fff0e1;border-left-color:#f1a263}.remember b{color:#965d30}.remember p{color:#815a3b}
.option.selected .option-letter{background:#2b80bc;border-color:#2b80bc}.option.selected{background:#e2f2ff;border-color:#71afde}
.feedback.good{background:#eaf6ff;border-color:#b5d7ec}.flash-card.flipped{background:#e3f2ff;border-color:#7cb6df}.flash-card.flipped strong{color:#1b5d8b;font-size:21px}
.flash-explainer{display:flex;flex-direction:column;gap:8px;width:100%;max-width:580px;text-align:left;background:#fffaf4;border:1px solid #f0d2b2;border-left:4px solid #ee984e;border-radius:8px;padding:15px 18px}
.flash-explainer-title{font-size:13px;font-weight:700;line-height:1.65;color:#8a5226}.flash-explainer-text{font-size:13px;font-weight:400;line-height:1.85;color:#465b6a}
.flip-hint{color:#487d9f}.reading-finish{background:#e1f1fd}
@media(max-width:600px){.flash-card{padding:22px 16px;min-height:325px;gap:16px}.flash-card.flipped strong{font-size:19px}.flash-explainer{padding:12px 14px}.flash-explainer-title,.flash-explainer-text{font-size:12px}}
'''
if 'flash-explainer-title' not in s:s+=addition
css.write_text(s,encoding='utf-8')
print('แก้ไขเสร็จแล้ว: assets/content.js, assets/app.js, assets/styles.css')
