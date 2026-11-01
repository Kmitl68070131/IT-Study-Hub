IT STUDY HUB — MULTIMEDIA Midterm / Final + ข้อสอบรวม 60 ข้อ
======================================================

สิ่งที่เพิ่มในเว็บ
-----------------
• หน้าเลือก Midterm / Final ของ MULTIMEDIA TECHNOLOGY
• Final: บท 6 (เดิม) และบท 7–12 จากสไลด์ที่ส่งมา พร้อมสรุปรายหัวข้อ
• Final: ชุดข้อสอบรวม 60 ข้อ (คัดจากคำถามในบท 6–12) มีตัวเลือก 4 ข้อ
• กระจาย Final 60 ข้อ: บท 6–9 บทละ 9 ข้อ และบท 10–12 บทละ 8 ข้อ
• ตรวจคำตอบทันที พร้อมเฉลยและเหตุผลของคำตอบถูก/ผิดทุกตัวเลือก
• คะแนนรวมสุดท้าย + คะแนนสูงสุดบนเบราว์เซอร์ + ฝึกเฉพาะข้อที่ผิด
• ยังมีแบบฝึกหัดรายบทจากเดิมครบ (รวม 186 ข้อ สำหรับ Final)
• Midterm: เตรียมหน้าข้อสอบชุด 60 ข้อ แต่ยังไม่สร้างคำถามเพราะรอสไลด์กลางภาค
• สีฟ้าน้ำเงินสดใส/ส้ม และกล่องความหมายคำศัพท์บนแฟลชการ์ด
• README.md มีลิงก์ไปยังชุดข้อสอบของแต่ละช่วงสอบ

วิธีนำไปใช้กับ Repository เดิม (Windows)
-----------------------------------------
1) เปิด https://github.com/pakk49/IT-Study-Hub
2) ดาวน์โหลด repo เป็น ZIP (Code > Download ZIP) แล้วแตกไฟล์ หรือ git clone repo
3) แตก ZIP ชุดอัปเดตนี้แยกออกมา ไม่จำเป็นต้องคัดลอกไฟล์ลง repo ก่อน
4) เปิดชุดอัปเดตที่แตก แล้วดับเบิลคลิก "อัปเดตเว็บ.bat" และใส่ path โฟลเดอร์ repo เดิม
   ตัวอย่าง: C:\Users\User\Desktop\IT-Study-Hub
   หรือสั่งใน Terminal ของชุดอัปเดต:
      python apply-exams.py "C:\path\to\IT-Study-Hub"
5) ระบบจะเก็บสำเนาไฟล์สำคัญ และอัปเดตเฉพาะไฟล์ที่เกี่ยวข้องใน repo เดิม
6) ทดสอบ:
      cd "C:\path\to\IT-Study-Hub"
      npm test
      python -m http.server 8000
   เปิด http://localhost:8000
7) อัปขึ้น GitHub ด้วย Git:
      git add .
      git commit -m "เพิ่มข้อสอบ Multimedia Final 60 ข้อ และเตรียม Midterm 60 ข้อ"
      git push origin main
   จากนั้นเปิด https://pakk49.github.io/IT-Study-Hub/

ลิงก์โดยตรง (หลัง push)
-----------------------
Final:   https://pakk49.github.io/IT-Study-Hub/#/year/2/term/1/subject/multimedia-technology/final/exam
Midterm: https://pakk49.github.io/IT-Study-Hub/#/year/2/term/1/subject/multimedia-technology/midterm/exam

ข้อควรทราบ
----------
• ชุดฝึกทำเป็นแบบจำลองจากสไลด์ ไม่ใช่ข้อสอบจริงหรือเฉลยอย่างเป็นทางการ
• Midterm ยังไม่มีข้อสอบ 60 ข้อจนกว่าจะได้รับเอกสารที่ใช้สร้างคำถาม
• ต้องใช้เว็บเซิร์ฟเวอร์ (GitHub Pages หรือ http.server) เพราะใช้ ES modules
• การรัน apply-exams.py ซ้ำไม่ควรสร้างรายการเนื้อหาหรือเมนูซ้ำ
• GitHub Connector ในแชตก่อนหน้านี้ตอบ 403 ตอนพยายามเขียน repo จึงไม่ได้อัปโหลดให้อัตโนมัติ
