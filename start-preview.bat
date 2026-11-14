@echo off
setlocal EnableExtensions
cd /d "%~dp0"

rem This is the fixed local preview address used every day.
set "PORT=4173"
set "PREVIEW_URL=http://127.0.0.1:%PORT%/"

rem If the preview is already running, just reopen it instead of starting a second server.
netstat -ano | findstr /R /C:":%PORT% .*LISTENING" >nul
if not errorlevel 1 (
  start "" "%PREVIEW_URL%"
  exit /b 0
)

echo Starting Pure Divine Energy preview...
echo Keep this window open while working on the website.
echo.

rem Open the preview automatically after the build has completed.
start "" cmd /c "timeout /t 5 /nobreak ^>nul ^& start \"\" \"%PREVIEW_URL%\""
set "PORT=%PORT%"
call npm run dev
pause
