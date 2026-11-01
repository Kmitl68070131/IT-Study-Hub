// เพิ่มวิชา/บทที่นี่: year + term + subject.id + chapter.id เป็นเส้นทางถาวรของแต่ละบท
// คงศัพท์เฉพาะภาษาอังกฤษ; สรุปเรียบเรียงใหม่จาก mm169_ch6.pdf ไม่ใช่สำเนาสไลด์
const sections = [
  {
    id: 'vector', title: 'Vector Graphics Basics', pages: 'หน้า 5–24',
    intro: 'เริ่มจากความต่างของภาพที่เก็บเป็น pixels กับภาพที่อธิบายด้วยรูปทรงทางคณิตศาสตร์',
    table: { headers: ['ประเด็น', 'Vector Graphics', 'Bitmapped Image'], rows: [
      ['การแทนภาพ', 'Geometric shapes และสมการ', 'ตาราง pixels ที่เก็บค่าสี'],
      ['การขยาย', 'คำนวณรูปทรงใหม่ตามความละเอียดอุปกรณ์', 'เมื่อขยายมาก อาจเห็น pixels หรือความเบลอ'],
      ['เหมาะกับ', 'Logo, icon, symbol, line art', 'ภาพถ่ายและภาพธรรมชาติ'],
      ['ขนาดไฟล์', 'มักเล็กเมื่อรูปทรงไม่ซับซ้อน', 'ขึ้นกับความละเอียดและการบีบอัด']
    ]},
    points: [
      'Coordinate System ทำให้ตำแหน่งและรูปทรงแทนด้วยตัวเลข เพื่อคำนวณหรือเขียนโปรแกรมจัดการได้',
      'Point ระบุตำแหน่ง เช่น (3, 5); Vector มีทั้ง direction และ magnitude โดย Vector จาก A ไป B = B − A',
      'Line กำหนดด้วยจุดปลาย 2 จุด ส่วน Circle กำหนดด้วย center และ radius',
      'Rendering หรือ Rasterization ใน 2D คือการแปลง geometric shapes เป็น pixels สำหรับแสดงผล',
      'ตามระบบพิกัดหน้าจอในบทเรียน มุมซ้ายบนเป็น (0, 0), x เพิ่มไปทางขวา และ y เพิ่มลงด้านล่าง',
      'การวาดเส้นต้องเลือก pixels ที่ใกล้แนวเส้นจริง เช่น หลักการของ Bresenham ที่เลือก pixel positions ด้วยการคำนวณแบบไม่ต่อเนื่อง'
    ],
    formula: 'Circle: (x − x₀)² + (y − y₀)² = r²\nA = (1, 2), B = (4, 6) → AB = (3, 4), magnitude = √(3² + 4²) = 5',
    remember: 'Vector Graphics ไม่ได้มีไฟล์เล็กกว่าเสมอไป ภาพธรรมชาติที่ซับซ้อนอาจต้องใช้ geometric shapes จำนวนมาก'
  },
  {
    id: 'curves', title: 'Curves & Bezier Curves', pages: 'หน้า 25–36',
    intro: 'Curve ที่เหมาะกับการออกแบบควร smooth และควบคุมรูปร่างได้ง่าย Bezier Curve ใช้ control points กำหนดรูปร่าง',
    table: { headers: ['ประเภท', 'Degree', 'Control points'], rows: [['Linear Bezier', '1', '2 จุด'], ['Quadratic Bezier', '2', '3 จุด'], ['Cubic Bezier', '3', '4 จุด']] },
    points: [
      'Linear Bezier เป็นเส้นตรง และใช้หลัก Linear Interpolation ระหว่างจุดปลาย',
      'Cubic Bezier ใช้ P₀, P₁, P₂, P₃ โดย P₀ และ P₃ เป็นจุดปลาย ส่วน P₁ และ P₂ ควบคุมรูปร่างและแนวสัมผัสใกล้จุดปลาย',
      'P₁ − P₀ เกี่ยวข้องกับแนวสัมผัสที่จุดเริ่ม และ P₃ − P₂ เกี่ยวข้องกับแนวสัมผัสที่จุดสิ้นสุด',
      'Curve ไม่จำเป็นต้องผ่าน control points ภายในทุกจุด',
      'นำ Bezier Curve หลาย segments มาต่อกันได้ และสร้าง Closed Curve ได้เมื่อปลายสุดกลับมาที่จุดเริ่ม',
      'C⁰ Continuity: จุดเชื่อมตรงกัน แต่ยังหักมุมได้',
      'C¹ Continuity: มี C⁰ และ first derivative เท่ากันทั้ง direction และ magnitude'
    ],
    formula: 'P(t) = (1 − t)P₀ + tP₁\nt = 0 → P₀ | t = 1 → P₁ | t = 0.5 → จุดกึ่งกลาง\nP₀ = (2, 4), P₁ = (10, 12), t = 0.25 → P = (4, 6)',
    remember: 'Degree n ใช้ control points n + 1 จุด; แนวสัมผัสทิศเดียวกันเพียงอย่างเดียว ยังสรุปว่าเป็น C¹ ไม่ได้ (สไลด์ใช้ 0 < t < 1 สำหรับช่วงภายใน; รวมจุดปลายเป็น 0 ≤ t ≤ 1)'
  },
  {
    id: 'manipulations', title: 'Properties & Manipulations', pages: 'หน้า 37–47',
    intro: 'นอกจากรูปร่าง เรายังปรับเส้นขอบ พื้นผิว ตำแหน่ง และรวมรูปทรงด้วย Boolean Operators ได้',
    table: { headers: ['Boolean Operator', 'ผลลัพธ์'], rows: [
      ['AND / Intersection', 'เก็บเฉพาะพื้นที่ซ้อนทับ'], ['OR / Union', 'รวมพื้นที่ของทั้งสองวัตถุ'],
      ['Difference A − B', 'เอาพื้นที่ A โดยตัดส่วนที่ทับกับ B ออก'], ['XOR', 'รวมพื้นที่แต่ไม่เอาส่วนซ้อนทับ']
    ]},
    points: [
      'Border / Stroke: color, width, style และรูปแบบปลายเส้นหรือรอยต่อ',
      'Fill / Face: color, transparency, gradient และ texture',
      'Affine Transforms ได้แก่ Translation (เลื่อน), Rotation (หมุน), Scale (ปรับขนาด), Reflection (สะท้อน), Shearing (เอียง)',
      'Affine Transforms รักษาความขนานของเส้น และอัตราส่วนการแบ่งระยะบนเส้นเดียวกัน แต่ไม่จำเป็นต้องรักษาความยาวหรือมุม',
      'Non-affine Transforms เช่น Projective Transform และ Non-linear Transform อาจทำให้เส้นที่เดิมขนานกันไม่ขนานกัน',
      'Boolean Operators ใช้กับทั้ง 2D objects และ 3D solid shapes ได้'
    ],
    remember: 'AND = ส่วนร่วม, OR = รวมทั้งหมด, XOR = ตัดส่วนร่วม; Difference ต้องดูว่าเอาอะไรลบอะไร โดยทั่วไป A − B ≠ B − A'
  },
  {
    id: 'modeling', title: '3D Graphics Modeling', pages: 'หน้า 48–73',
    intro: 'Modeling สร้างรูปร่างวัตถุในพื้นที่ (x, y, z) โดยประกอบจาก 3D Primitives หรือสร้างต่อจากรูปทรง 2D',
    table: { headers: ['คำศัพท์ / เทคนิค', 'ความหมาย / การใช้งาน'], rows: [
      ['3D Primitives', 'รูปทรงพื้นฐาน เช่น sphere, cube, cylinder'],
      ['Extrusion', 'ยืดรูปหรือพื้นที่ 2D ไปตามทิศทาง เช่น ตัวอักษรนูน'],
      ['Lathe / Lathing', 'หมุนเส้นหน้าตัดรอบแกน เช่น แจกันสมมาตรรอบแกน'],
      ['Vertex / Edge / Face', 'จุดยอด / เส้นขอบ / พื้นผิว polygon'],
      ['Polygon Mesh', 'พื้นผิวที่ประกอบจาก polygons เชื่อมต่อกัน'],
      ['Parametric Surface Modeling', 'สร้างผิวเรียบด้วยแบบจำลองทางคณิตศาสตร์ เช่น NURBS']
    ]},
    points: [
      'ใช้ Transformations ปรับ primitives แล้วใช้ Union, Intersection หรือ Difference เพื่อสร้างรูปทรงซับซ้อน เช่น เจาะรูด้วย Difference',
      'Polygon เป็นพื้นผิวแบนราบที่ล้อมด้วย line segments; ที่ใช้บ่อยคือ Triangle และ Quadrilateral',
      'เพิ่มจำนวน polygons ช่วยแทนรายละเอียดรูปทรงได้มากขึ้น และสามารถแก้ Model ในระดับ polygon ได้',
      'Parametric Surface มักแปลงเป็น Polygon Mesh ก่อน Rendering ใน workflow ที่บทเรียนอธิบาย',
      'หลังสร้าง shape ต้องกำหนด Material, Texture และการจำลองลักษณะผิว เช่น ความขรุขระ รวมถึงการตอบสนองต่อแสง'
    ],
    remember: 'เพิ่ม polygons ช่วยเรื่อง geometry แต่ความสมจริงยังขึ้นกับ Material, Texture, Light และ Rendering ด้วย'
  },
  {
    id: 'rendering', title: '3D Graphics Rendering', pages: 'หน้า 74–94',
    intro: 'Rendering สร้างภาพจาก 3D Model พร้อมการตั้งค่า Light และ Virtual Camera โดยจำลองการปฏิสัมพันธ์ระหว่างแสงกับผิว',
    table: { headers: ['ขั้นตอนแบบย่อ', 'หน้าที่'], rows: [
      ['1. Perspective Projection', 'ฉายตำแหน่ง 3D ลงบน camera plane เพื่อสร้างภาพ 2D'],
      ['2. Visibility Check', 'ตรวจส่วนที่มองเห็นและส่วนที่ถูกบังจาก Camera'],
      ['3. Shading', 'คำนวณสีและความสว่างของพื้นผิวจากแสงและคุณสมบัติผิว']
    ]},
    points: [
      'Surface Normal คือทิศตั้งฉากกับพื้นผิว ใช้อ้างอิงมุมของแสง',
      'Specular Reflection: สะท้อนมีทิศทางเด่นชัด เช่น โลหะขัดมัน โดยมุมตกกระทบเท่ากับมุมสะท้อนเมื่อวัดจาก Surface Normal',
      'Diffuse Reflection (ในสไลด์ใช้ Diffused reflection): แสงกระจายหลายทิศทาง เช่น ผิวไม้หรือผิวด้าน',
      'สีและความสว่างขึ้นกับชนิด สี และความเข้มของ Light, Material, ตำแหน่งและมุม Camera, การบังแสง และแสงสะท้อนจากพื้นผิวอื่น',
      'Perspective Projection ทำให้วัตถุขนาดเท่ากันที่อยู่ไกลกว่าดูเล็กกว่า',
      'Flat Shading: แต่ละ polygon มีสีและความเข้มคงที่ จึงเห็นหน้าเหลี่ยมชัด',
      'Gouraud Shading: ช่วยให้ความสว่างระหว่าง polygons ดูต่อเนื่องขึ้น',
      'Phong Shading: ผิวดูเรียบต่อเนื่องและแสดงรายละเอียดแสงได้ดีในการเปรียบเทียบของบทเรียน'
    ],
    remember: 'Flat Shading ยังเป็น Shading; คำว่า “no shading” ในสไลด์เป็นการเปรียบเทียบว่าไม่มีการไล่ความสว่างภายในแต่ละ polygon ขั้นตอน Rendering ในบทนี้เป็นแบบย่อ'
  }
];
const pairs = [
 ['Vector Graphics แทนภาพอย่างไร?', 'ใช้ geometric shapes และข้อมูลทางคณิตศาสตร์'],
 ['Bitmapped Image แทนภาพอย่างไร?', 'ใช้ตาราง pixels ที่เก็บค่าสี'],
 ['ทำไม Logo เหมาะกับ Vector Graphics?', 'รูปร่างแทนด้วย geometric shapes จำนวนไม่มาก และขยายแล้วยังคงขอบคม'],
 ['ทำไมภาพถ่ายเหมาะกับ Bitmapped Image?', 'มี textures รูปร่าง และเฉดสีซับซ้อนจำนวนมาก'],
 ['Point ต่างจาก Vector อย่างไร?', 'Point ระบุตำแหน่ง; Vector มี direction และ magnitude'],
 ['หา Vector จาก A ไป B อย่างไร?', 'B − A เช่น A = (1, 2), B = (4, 6) ได้ (3, 4)'],
 ['Circle กำหนดด้วยข้อมูลใด?', 'Center และ radius'],
 ['Rasterization คืออะไร?', 'การแปลง geometric shapes ให้เป็น pixels'],
 ['ระบบพิกัดหน้าจอในบทเรียน y เพิ่มไปทางไหน?', 'ลงด้านล่าง โดยมุมซ้ายบนเป็น (0, 0)'],
 ['Curve ที่ดีควรมีลักษณะใด?', 'Smooth และควบคุมรูปร่างได้ง่าย'],
 ['Linear / Quadratic / Cubic Bezier ใช้กี่ control points?', '2 / 3 / 4 จุด ตามลำดับ'],
 ['สมการ Linear Bezier คืออะไร?', 'P(t) = (1 − t)P₀ + tP₁'],
 ['Linear Bezier ที่ t = 0.5 ให้จุดใด?', 'จุดกึ่งกลางระหว่าง P₀ และ P₁'],
 ['จุดปลายของ Cubic Bezier คือจุดใด?', 'P₀ และ P₃'],
 ['P₁, P₂ ใน Cubic Bezier ใช้ทำอะไร?', 'ควบคุมรูปร่างและแนวสัมผัสใกล้จุดปลาย ไม่จำเป็นต้องอยู่บน Curve'],
 ['C⁰ Continuity คืออะไร?', 'จุดปลายของ segment แรกตรงกับจุดเริ่มของ segment ถัดไป'],
 ['C¹ ต่างจาก C⁰ อย่างไร?', 'C¹ ต้องมี first derivative เท่ากันทั้ง direction และ magnitude เพิ่มจาก C⁰'],
 ['Stroke กับ Fill ต่างกันอย่างไร?', 'Stroke คือคุณสมบัติเส้นขอบ; Fill คือคุณสมบัติพื้นที่ภายใน'],
 ['Affine Transforms มีอะไรบ้าง?', 'Translation, Rotation, Scale, Reflection, Shearing'],
 ['Affine Transform รักษาอะไร?', 'ความขนาน และอัตราส่วนการแบ่งระยะบนเส้นเดียวกัน'],
 ['AND กับ OR ต่างกันอย่างไร?', 'AND เก็บส่วนร่วม; OR รวมพื้นที่ทั้งหมด'],
 ['Difference กับ XOR ต่างกันอย่างไร?', 'A − B ตัด B ออกจาก A; XOR เก็บส่วนไม่ซ้อนทับของทั้งคู่'],
 ['Extrusion คืออะไร?', 'ยืดรูปหรือพื้นที่ 2D ไปตามทิศทางเพื่อสร้าง 3D'],
 ['Lathe คืออะไร?', 'หมุนเส้นหน้าตัดรอบแกนเพื่อสร้างรูปทรง 3D'],
 ['Vertex / Edge / Face คืออะไร?', 'จุดยอด / เส้นขอบ / พื้นผิวของ polygon'],
 ['Polygon Mesh คืออะไร?', 'พื้นผิวจาก polygons หลายชิ้นเชื่อมต่อกัน'],
 ['Parametric Surface Modeling เหมาะกับอะไร?', 'สร้างผิวเรียบด้วยแบบจำลองทางคณิตศาสตร์ เช่น NURBS'],
 ['Modeling ต่างจาก Rendering อย่างไร?', 'Modeling สร้างรูปทรง; Rendering สร้างภาพจาก Model, Light และ Camera'],
 ['Specular กับ Diffuse Reflection ต่างกันอย่างไร?', 'Specular สะท้อนมีทิศทางเด่น; Diffuse กระจายหลายทิศทาง'],
 ['Rendering แบบย่อมีกี่ขั้นตอน?', 'Perspective Projection → Visibility Check → Shading; Shading มี Flat, Gouraud และ Phong']
];
// แต่ละข้อมีเหตุผลครบทุกตัวเลือก; answer เป็น index 0–3
const rawQuestions = [
 ['vector','วิเคราะห์','Logo ที่ต้องใช้ทั้งบนไอคอนและป้ายขนาดใหญ่ ควรเลือกแบบใด?', ['Bitmapped Image เพราะ pixels เพิ่มเองเมื่อขยาย','Vector Graphics เพราะคำนวณรูปทรงใหม่ตามขนาดได้','Bitmapped Image เพราะไม่ขึ้นกับความละเอียด','Vector Graphics เพราะทุกภาพมีไฟล์เล็กกว่าเสมอ'],1, ['การขยายไม่ได้สร้างรายละเอียดต้นฉบับเพิ่มโดยอัตโนมัติ','Geometric shapes ถูกคำนวณใหม่ตามขนาดและความละเอียดของอุปกรณ์ได้','Bitmapped Image ผูกกับจำนวน pixels ของภาพ','ขนาดไฟล์ขึ้นกับความซับซ้อน ภาพ Vector ไม่ได้เล็กกว่าเสมอ']],
 ['vector','เข้าใจ','ตามพิกัดหน้าจอในบทเรียน A = (7, 4), B = (7, 5) จุด A อยู่ตำแหน่งใดเมื่อเทียบกับ B?', ['ทางซ้าย','ทางขวา','เหนือ','ใต้'],2,['ทั้งสองจุดมี x เท่ากัน จึงไม่เยื้องซ้าย','ทั้งสองจุดมี x เท่ากัน จึงไม่เยื้องขวา','y เพิ่มลงล่าง ดังนั้น y = 4 อยู่เหนือ y = 5','จุดที่ y มากกว่าคือ B จึงเป็น B ที่อยู่ต่ำกว่า']],
 ['vector','คำนวณ','A = (−1, 2), B = (3, 5) Vector จาก A ไป B คือข้อใด?', ['(4, 3)','(2, 7)','(−4, −3)','(3, 4)'],0,['B − A = (3 − (−1), 5 − 2) = (4, 3)','(2, 7) เกิดจากบวกพิกัด ซึ่งไม่ใช่ Vector จาก A ไป B','(−4, −3) เป็น A − B หรือทิศย้อนกลับ','ลำดับองค์ประกอบต้องเป็น x แล้ว y จึงได้ (4, 3)']],
 ['vector','เข้าใจ','ข้อใดอธิบาย Rasterization ได้ตรงที่สุด?', ['เปลี่ยน bitmap ทุกภาพเป็นเส้นโค้ง','สร้างวัตถุ 3D จากเส้นหน้าตัด','เปลี่ยนตำแหน่ง Camera','แปลง geometric shapes เป็น pixels'],3,['การย้อนภาพเป็นรูปทรงเป็นอีกกระบวนการหนึ่ง','การสร้าง 3D จากหน้าตัดเกี่ยวข้องกับ Modeling','การย้าย Camera เปลี่ยนมุมมอง ไม่ใช่นิยาม Rasterization','Rasterization เลือก pixels เพื่อแสดงรูปทรงบนหน้าจอ']],
 ['vector','วิเคราะห์','ภาพใดเหมาะกับ Bitmapped Image มากที่สุด?', ['ป้ายลูกศรสีเดียว','ภาพถ่ายป่าที่มีใบไม้และแสงเงาซับซ้อน','Logo วงกลมกับข้อความ','ไอคอนรูปสามเหลี่ยม'],1,['ลูกศรอธิบายด้วย geometric shapes ได้น้อยชิ้น','ภาพถ่ายมี textures และเฉดสีจำนวนมาก การแทนด้วย pixels เหมาะสม','Logo แบบเรียบเหมาะกับ geometric shapes','ไอคอนเรียบใช้ Vector ได้กระชับและขยายได้คม']],
 ['curves','คำนวณ','Linear Bezier มี P₀ = (2, 4), P₁ = (10, 12) เมื่อ t = 0.25 ได้จุดใด?', ['(6, 8)','(8, 10)','(4, 6)','(3, 3)'],2,['(6, 8) เป็นจุดกึ่งกลางที่ t = 0.5','(8, 10) เป็นจุดที่ t = 0.75','0.75(2, 4) + 0.25(10, 12) = (4, 6)','ต้องถ่วงน้ำหนักทั้งสองจุดตามสูตร จึงได้ (4, 6)']],
 ['curves','เข้าใจ','Cubic Bezier Curve ใช้ control points กี่จุด?', ['2 จุด','3 จุด','5 จุด','4 จุด'],3,['2 จุดใช้กับ Linear Bezier','3 จุดใช้กับ Quadratic Bezier','Degree 3 ใช้ n + 1 = 4 จุด','Cubic มี degree 3 จึงใช้ 4 control points']],
 ['curves','วิเคราะห์','เงื่อนไขใดเพียงพอสำหรับรอยต่อแบบ C¹ ของสอง Bezier segments?', ['จุดเชื่อมตรงกัน และ first derivative เท่ากัน','จุดเชื่อมตรงกันเพียงอย่างเดียว','แนวสัมผัสทิศเดียวกัน แต่ magnitude ต่างกัน','จำนวน control points เท่ากัน'],0,['C¹ ต้องมีตำแหน่งต่อกันและ first derivative เท่ากันทั้ง direction และ magnitude','ตำแหน่งตรงกันรับรองเพียง C⁰','ทิศเดียวกันอย่างเดียวยังไม่ทำให้ first derivative เท่ากัน','จำนวนจุดเท่ากันไม่ได้กำหนดความต่อเนื่องที่รอยต่อ']],
 ['curves','เข้าใจ','ข้อใดถูกต้องเกี่ยวกับ P₁ และ P₂ ของ Cubic Bezier?', ['Curve ต้องผ่านทั้งคู่เสมอ','ใช้ควบคุมรูปร่างและแนวสัมผัสใกล้จุดปลาย','เป็นจุดปลายของ Curve','ไม่มีผลเมื่อ P₀ และ P₃ คงเดิม'],1,['Curve ไม่จำเป็นต้องผ่าน control points ภายใน','P₁ และ P₂ เปลี่ยนรูปร่างและแนวสัมผัสใกล้จุดปลายได้','จุดปลายคือ P₀ และ P₃','แม้จุดปลายเดิม การย้าย control points ภายในเปลี่ยนรูปร่างได้']],
 ['curves','คำนวณ','P₀ = (2, 6), P₁ = (14, 10) จุด P(0.75) ของ Linear Bezier คือข้อใด?', ['(5, 7)','(8, 8)','(11, 9)','(12, 4)'],2,['(5, 7) ตรงกับ t = 0.25','(8, 8) เป็นจุดกึ่งกลางที่ t = 0.5','0.25(2, 6) + 0.75(14, 10) = (11, 9)','พิกัดต้องถ่วงน้ำหนักทั้ง x และ y จึงได้ (11, 9)']],
 ['manipulations','เข้าใจ','ข้อใดเป็นคุณสมบัติที่ Affine Transform รักษา?', ['ความยาวทุกเส้น','มุมทุกมุม','พื้นที่ทุกวัตถุ','ความขนานของเส้น'],3,['Scale สามารถเปลี่ยนความยาวได้','Shearing เปลี่ยนมุมได้','Scale เปลี่ยนพื้นที่ได้','Affine Transform รักษาความขนานของเส้น']],
 ['manipulations','ประยุกต์','ต้องการพื้นที่ของวงกลม A และ B โดยตัดส่วนซ้อนทับออก ควรใช้ข้อใด?', ['XOR','AND','OR','Difference A − B'],0,['XOR เก็บพื้นที่ที่อยู่ในเพียงวัตถุเดียว','AND เก็บเฉพาะส่วนซ้อนทับ','OR ยังรวมส่วนซ้อนทับไว้ด้วย','A − B เก็บเฉพาะด้านของ A และไม่เก็บส่วน B ที่อยู่นอก A']],
 ['manipulations','ประยุกต์','ต้องการเจาะรูทรงกระบอก B ออกจากกล่อง A ควรใช้ข้อใด?', ['Union A กับ B','Difference A − B','Intersection A กับ B','Difference B − A'],1,['Union รวมเนื้อวัตถุแทนการเจาะ','A − B เก็บกล่องโดยตัดส่วนที่ทรงกระบอกทับอยู่ออก','Intersection เหลือเฉพาะเนื้อที่กล่องกับทรงกระบอกมีร่วมกัน','B − A เก็บส่วนของทรงกระบอกที่อยู่นอกกล่อง']],
 ['manipulations','เข้าใจ','ต้องการเปลี่ยนความหนาและรูปแบบเส้นขอบ ต้องปรับ Properties กลุ่มใด?', ['Fill / Face','Texture ของพื้นที่ภายใน','Border / Stroke','Camera'],2,['Fill / Face ควบคุมพื้นที่ภายใน','Texture ภายในไม่ได้กำหนดความหนาเส้นขอบ','Border / Stroke มี width และ styles ของเส้นขอบ','Camera ควบคุมมุมมอง ไม่ใช่เส้นขอบวัตถุ']],
 ['manipulations','เข้าใจ','ข้อใดเป็น Non-affine Transform ตามบทเรียน?', ['Translation','Reflection','Shearing','Projective Transform'],3,['Translation เป็น Affine','Reflection เป็น Affine','Shearing เป็น Affine','Projective Transform อยู่ในกลุ่ม Non-affine ตามบทเรียน']],
 ['modeling','ประยุกต์','ต้องการสร้างแจกันสมมาตรรอบแกนจากเส้นหน้าตัด ควรใช้เทคนิคใด?', ['Lathe','Extrusion','Visibility Check','Rasterization'],0,['Lathe หมุนเส้นหน้าตัดรอบแกนเพื่อสร้างรูปทรง','Extrusion ยืดรูปไปตามทิศทาง ไม่ใช่การหมุนรอบแกน','Visibility Check ตรวจส่วนที่มองเห็น','Rasterization แปลงรูปทรงเป็น pixels']],
 ['modeling','ประยุกต์','ต้องการเปลี่ยนตัวอักษร 2D ให้เป็นตัวอักษรนูนหนา ควรใช้ข้อใด?', ['Lathe','Extrusion','Phong Shading','Intersection เท่านั้น'],1,['Lathe หมุนหน้าตัด ซึ่งไม่เหมาะกับการเพิ่มความหนาของตัวอักษรทั่วไป','Extrusion ยืดพื้นที่ 2D ให้มีความหนาได้','Phong Shading เปลี่ยนการแสดงความสว่าง ไม่ได้สร้างความหนา','Intersection เก็บส่วนร่วม ไม่ใช่เทคนิคหลักในการยืดตัวอักษร']],
 ['modeling','วิเคราะห์','ทรงกลมมี silhouette เป็นเหลี่ยมชัด ควรแก้ที่ใดตรงจุดที่สุด?', ['เพิ่มความเข้ม Light','เปลี่ยนสี Texture','เพิ่มความละเอียด Polygon Mesh','ใช้ Phong Shading อย่างเดียว'],2,['ความเข้ม Light ไม่เพิ่มรายละเอียด geometry','สี Texture ไม่เปลี่ยนรูปขอบวัตถุ','Silhouette ขึ้นกับ geometry การเพิ่ม mesh resolution ช่วยให้ขอบละเอียดขึ้น','Shading ช่วยความสว่างบนผิว แต่ไม่เพิ่ม geometry ของ silhouette']],
 ['modeling','เข้าใจ','Vertex, Edge, Face หมายถึงอะไรตามลำดับ?', ['ผิว เส้นขอบ จุดยอด','เส้นขอบ จุดยอด ผิว','จุดยอด ผิว เส้นขอบ','จุดยอด เส้นขอบ ผิว'],3,['Vertex คือจุดยอด ไม่ใช่ผิว','Edge คือเส้นขอบ ส่วน Vertex คือจุดยอด','Face คือผิว ไม่ใช่เส้นขอบ','Vertex = จุดยอด, Edge = เส้นขอบ, Face = ผิว']],
 ['modeling','วิเคราะห์','สร้าง shape ถูกต้องแล้ว แต่ต้องการลายบนผิวและการสะท้อนแบบเซรามิก ควรปรับอะไรเป็นหลัก?', ['Material และ Texture','เพิ่ม polygons อย่างเดียว','เปลี่ยนชื่อ Model','เปลี่ยน Coordinate System'],0,['Material กำหนดการตอบสนองต่อแสง และ Texture เพิ่มลวดลาย','เพิ่ม polygons เปลี่ยนรายละเอียดรูปทรง แต่ไม่ได้กำหนดลายและการสะท้อนเอง','ชื่อ Model ไม่เปลี่ยนลักษณะภาพ','การเปลี่ยนระบบพิกัดไม่ใช่การกำหนดคุณสมบัติผิว']],
 ['rendering','เข้าใจ','วัตถุขนาดจริงเท่ากัน แต่ชิ้นหนึ่งไกลจาก Camera กว่า ภายใต้ Perspective Projection ผลทั่วไปคืออะไร?', ['ชิ้นไกลดูใหญ่กว่า','ชิ้นไกลดูเล็กกว่า','ขนาดบนภาพเท่ากันเสมอ','ชิ้นไกลต้องถูกตัดออกเสมอ'],1,['Perspective ทำให้วัตถุไกลดูเล็กลง','ขนาดที่ฉายบนภาพลดลงเมื่อระยะจาก Camera เพิ่ม โดยเงื่อนไขอื่นเหมือนกัน','การเท่ากันเสมอไม่ใช่ลักษณะทั่วไปของ Perspective','ไกลกว่าไม่ได้แปลว่ามองไม่เห็นเสมอ']],
 ['rendering','วิเคราะห์','เห็นพื้นผิวด้านหลังทะลุวัตถุทึบ ควรตรวจส่วนใดก่อน?', ['Extrusion','Texture Mapping','Visibility Check','Scale'],2,['Extrusion สร้างรูปทรง ไม่ได้คัดส่วนที่ถูกบัง','Texture Mapping กำหนดลวดลาย','Visibility Check แยกพื้นผิวที่มองเห็นออกจากพื้นผิวที่ถูกบัง','Scale ปรับขนาด ไม่ใช่การตรวจการบัง']],
 ['rendering','เข้าใจ','ผิวโลหะขัดมันมีการสะท้อนแบบใดเด่น?', ['Diffuse Reflection เท่านั้น','ไม่มี Reflection','Reflection ไม่ขึ้นกับผิว','Specular Reflection'],3,['Diffuse เด่นในผิวด้านมากกว่าเมื่อเทียบกับตัวอย่างในบทเรียน','โลหะขัดมันสะท้อนแสงได้','คุณสมบัติผิวส่งผลต่อการสะท้อนโดยตรง','ผิวขัดมันมีการสะท้อนอย่างมีทิศทางเด่นชัด']],
 ['rendering','วิเคราะห์','Silhouette เรียบแล้ว แต่ความสว่างเป็นหน้าเหลี่ยมจาก Flat Shading ควรทำอะไร?', ['ลอง Gouraud หรือ Phong Shading','ปิด Visibility Check','เปลี่ยน Vector Graphics เป็นภาพถ่าย','ลดจำนวน polygons เสมอ'],0,['Gouraud และ Phong ช่วยให้ความสว่างของผิวดูต่อเนื่องกว่า Flat','ปิด Visibility Check อาจทำให้ส่วนที่ถูกบังแสดงผิด','ชนิดภาพถ่ายไม่แก้ shading ของ 3D Model โดยตรง','ลด polygons อาจยิ่งทำให้รายละเอียดรูปทรงลดลง']],
 ['rendering','เข้าใจ','มุมตกกระทบและมุมสะท้อนใน Specular Reflection วัดจากแนวใด?', ['แกน x เสมอ','Surface Normal','แนวขอบหน้าจอ','แนวขนานกับผิวเสมอ'],1,['แกน x ไม่จำเป็นต้องตั้งฉากกับผิว','Surface Normal เป็นทิศตั้งฉากกับพื้นผิวและเป็นแนวอ้างอิงมุม','ขอบหน้าจอไม่ใช่แนวอ้างอิงของกฎการสะท้อน','มุมตามกฎนี้วัดจากแนวตั้งฉากกับผิว ไม่ใช่แนวขนาน']]
];
export const chapter = {
 id: 'chapter-6', number: 6, title: '2D & 3D Graphics', description: 'จากรูปทรงบนระนาบ สู่โลกสามมิติที่สร้างด้วยแสง', minutes: 25,
 source: 'เรียบเรียงจาก mm169_ch6.pdf · Multimedia Technology · N. Chotikakamthorn · Semester 1/2026 · IT KMITL · เลขหน้าอ้างอิงตามลำดับหน้า PDF',
 sections, flashcards: pairs.map(([front, back], i) => ({id: `f${i + 1}`, front, back})),
 questions: rawQuestions.map(([topic, level, prompt, options, answer, reasons], i) => ({id: `q${i+1}`, topic, level, prompt, options, answer, reasons}))
};
export const subjects = [{ id: 'multimedia-technology', code: '06016403', title: 'MULTIMEDIA TECHNOLOGY', thai: 'เทคโนโลยีสื่อประสม', year: 2, term: 1, label: 'MM', description: 'ทำความเข้าใจภาพ กราฟิก และสื่อดิจิทัล ผ่านสรุปที่อ่านง่ายและการลงมือทบทวน', chapters: [chapter] }];

// รายวิชาปี 2 เทอม 1 ตามรายการที่ผู้ใช้ส่งมา ยังไม่สร้างบทเรียนจนกว่าจะมีเอกสาร
subjects.unshift(
 {id:'information-system-analysis-and-design', code:'06066304', title:'INFORMATION SYSTEM ANALYSIS AND DESIGN', thai:'การวิเคราะห์และออกแบบระบบสารสนเทศ', year:2, term:1, label:'IS', description:'พื้นที่รวบรวมสรุปและแบบทดสอบรายบท', chapters:[]},
 {id:'database-system-concepts', code:'06066300', title:'DATABASE SYSTEM CONCEPTS', thai:'แนวคิดระบบฐานข้อมูล', year:2, term:1, label:'DB', description:'พื้นที่รวบรวมสรุปและแบบทดสอบรายบท', chapters:[]},
 {id:'discrete-mathematics', code:'06066000', title:'DISCRETE MATHEMATICS', thai:'คณิตศาสตร์ดิสครีต', year:2, term:1, label:'DM', description:'พื้นที่รวบรวมสรุปและแบบทดสอบรายบท', chapters:[]},
 {id:'introduction-to-network-systems', code:'06016413', title:'INTRODUCTION TO NETWORK SYSTEMS', thai:'ระบบเครือข่ายเบื้องต้น', year:2, term:1, label:'NW', description:'พื้นที่รวบรวมสรุปและแบบทดสอบรายบท', chapters:[]},
 {id:'physical-computing', code:'06016409', title:'PHYSICAL COMPUTING', thai:'การประมวลผลทางกายภาพ', year:2, term:1, label:'PC', description:'พื้นที่รวบรวมสรุปและแบบทดสอบรายบท', chapters:[]}
);
