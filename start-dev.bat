@echo off
echo Starting UBB Health Check Development Environment...

echo.
echo Starting Backend Server...
cd server
start "Backend Server" cmd /k "npm run dev"

echo.
echo Starting Frontend Client...
cd ..\client
start "Frontend Client" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
pause
