@echo off
setlocal

REM Resolve absolute path of this script directory
set "ROOT=%~dp0"

REM --- Backend ---
pushd "%ROOT%bkfarmers-backend" >nul
if not exist node_modules (
	echo Installing backend dependencies...
	call npm install
)
REM Start backend on port 3000 in a new window
start "BKF Backend" cmd /K "cd /D %ROOT%bkfarmers-backend && set PORT=3000 && npm run dev"
popd >nul

REM Small delay to let backend start
ping -n 3 127.0.0.1 >nul

REM --- Frontend ---
pushd "%ROOT%" >nul
if not exist node_modules (
	echo Installing frontend dependencies...
	call npm install
)
REM Start frontend (Vite) in a new window
start "BKF Frontend" cmd /K "cd /D %ROOT% && npm run dev"
popd >nul

endlocal
