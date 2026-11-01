@echo off
setlocal EnableExtensions EnableDelayedExpansion
chcp 65001 >nul
cd /d "%~dp0"
title IT Study Hub - Upload to GitHub
set "REPO=https://github.com/pakk49/IT-Study-Hub.git"
set "TARGET=%~dp0IT-Study-Hub-Updated"

where git >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Please install Git for Windows first: https://git-scm.com/downloads/win
  goto :failed
)

if exist "%TARGET%\.git" (
  echo Updating local repository...
  git -C "%TARGET%" pull --ff-only origin main
  if errorlevel 1 goto :failed
) else (
  if exist "%TARGET%" (
    echo [ERROR] Target directory already exists without a .git repository.
    echo Please rename: %TARGET%
    goto :failed
  )
  echo Cloning GitHub repository...
  git clone --depth 1 --branch main "%REPO%" "%TARGET%"
  if errorlevel 1 goto :failed
)

echo Installing Multimedia Final chapters and mock exams...
where py >nul 2>nul
if not errorlevel 1 (
  py -3 "%~dp0apply-exams.py" "%TARGET%"
) else (
  where python >nul 2>nul
  if errorlevel 1 (
    echo [ERROR] Python 3 is required: https://www.python.org/downloads/
    goto :failed
  )
  python "%~dp0apply-exams.py" "%TARGET%"
)
if errorlevel 1 goto :failed

copy /Y "%~dp0tests\final.test.js" "%TARGET%\tests\final.test.js" >nul
if errorlevel 1 goto :failed

where npm >nul 2>nul
if not errorlevel 1 (
  echo Running existing project tests...
  pushd "%TARGET%"
  call npm test
  if errorlevel 1 goto :failed
  popd
) else (
  echo [NOTE] Node.js/npm not installed: skipping local tests.
)

echo Staging only the study-hub update files...
git -C "%TARGET%" add -- README.md assets/app.js assets/content.js assets/styles.css assets/final-chapters.js assets/midterm-chapters.js assets/exam-bank.js assets/exam.js assets/exam.css tests/final.test.js tests/exams-60.test.js
if errorlevel 1 goto :failed

git -C "%TARGET%" diff --cached --quiet
if not errorlevel 1 (
  echo Nothing to commit. This repository already has this update.
  goto :done
)

git -C "%TARGET%" var GIT_AUTHOR_IDENT >nul 2>nul
if errorlevel 1 (
  echo Please set your Git commit name and email.
  set /p "AUTHOR_NAME=Git name: "
  set /p "AUTHOR_EMAIL=Git email: "
  if "!AUTHOR_NAME!"=="" goto :failed
  if "!AUTHOR_EMAIL!"=="" goto :failed
  git -C "%TARGET%" config user.name "!AUTHOR_NAME!"
  git -C "%TARGET%" config user.email "!AUTHOR_EMAIL!"
)

git -C "%TARGET%" commit -m "เพิ่มบท Multimedia Final 7-12 และข้อสอบ 60 ข้อ แยก Midterm"
if errorlevel 1 goto :failed

echo Pushing to pakk49/IT-Study-Hub...
echo Git may open a browser for authentication.
git -C "%TARGET%" push origin HEAD:main
if errorlevel 1 goto :failed

:done
echo.
echo DONE. Website: https://pakk49.github.io/IT-Study-Hub/
echo Repository: https://github.com/pakk49/IT-Study-Hub
echo Source copy: %TARGET%
pause
exit /b 0

:failed
echo.
echo Upload not completed. No forced push was performed.
echo Please read README_วิธีอัปเดต.txt for troubleshooting.
pause
exit /b 1
