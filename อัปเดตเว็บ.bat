@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo IT Study Hub - Multimedia Midterm / Final (60 questions each)
set /p REPO=ระบุที่อยู่โฟลเดอร์ IT-Study-Hub เดิม (วางเป็น path): 
if "%REPO%"=="" (echo กรุณาระบุโฟลเดอร์ & pause & exit /b 1)
py -3 apply-exams.py "%REPO%"
if errorlevel 1 python apply-exams.py "%REPO%"
pause
