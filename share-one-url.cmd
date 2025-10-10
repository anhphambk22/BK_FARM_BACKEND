@echo off
setlocal ENABLEDELAYEDEXPANSION

REM Usage:
REM   share-one-url.cmd           -> background ngrok (auto-detect URL via inspector)
REM   share-one-url.cmd foreground -> run ngrok inline (see Forwarding URL directly here)

set "MODE=BACKGROUND"
if /I "%1"=="foreground" set "MODE=FOREGROUND"
if /I "%1"=="/F" set "MODE=FOREGROUND"

REM Resolve absolute path of this script directory
set "ROOT=%~dp0"
pushd "%ROOT%" >nul

echo [1/4] Building frontend and starting backend on port 3000...
start "BKF Serve" cmd /K "cd /D %ROOT% && npm run serve"

REM Wait for server to listen on port 3000 (max ~30s)
set "SERVER_READY="
for /L %%I in (1,1,15) do (
  for /f "usebackq delims=" %%P in (`powershell -NoLogo -NoProfile -Command "(Test-NetConnection -ComputerName 127.0.0.1 -Port 3000 -WarningAction SilentlyContinue).TcpTestSucceeded"`) do set SERVER_READY=%%P
  if /I "%SERVER_READY%"=="True" goto :START_NGROK
  ping -n 3 127.0.0.1 >nul
)
echo Backend on port 3000 did not become ready yet. Continuing anyway...

:START_NGROK

if /I "%MODE%"=="FOREGROUND" (
  echo [2/3] Starting ngrok (foreground) for port 3000...
  set "NGROK_PATH=%USERPROFILE%\AppData\Local\ngrok\ngrok.exe"
  if exist "%NGROK_PATH%" (
    echo Showing ngrok logs here. Press Ctrl+C to stop when done.
    "%NGROK_PATH%" http 3000
  ) else (
    echo Showing ngrok logs here. Press Ctrl+C to stop when done.
    ngrok http 3000
  )
  goto :END
)

echo [2/4] Starting ngrok tunnel for port 3000...
set "NGROK_PATH=%USERPROFILE%\AppData\Local\ngrok\ngrok.exe"
if exist "%NGROK_PATH%" (
  start "ngrok 3000" "%NGROK_PATH%" http 3000
) else (
  start "ngrok 3000" ngrok http 3000
)

echo [3/4] Fetching public URL from ngrok inspector...
set "NGROK_URL="
for /L %%I in (1,1,20) do (
  for /f "usebackq delims=" %%A in (`powershell -NoLogo -NoProfile -Command "try { (Invoke-RestMethod 'http://127.0.0.1:4040/api/tunnels').tunnels ^| Where-Object { $_.public_url -match '^https://' } ^| Select-Object -First 1 -ExpandProperty public_url } catch { '' }"`) do set NGROK_URL=%%A
  if defined NGROK_URL goto :PRINT_URL
  ping -n 3 127.0.0.1 >nul
)
echo Could not detect ngrok URL automatically.
echo Please check the ngrok window for the Forwarding URL (https://....ngrok-free.dev)
goto :END

:PRINT_URL
echo [4/4] Public URL:
echo %NGROK_URL%

:END
popd >nul
endlocal
