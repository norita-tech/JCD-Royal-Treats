@echo off
title JCD Royal Treats - Server
echo.
echo  ==========================================
echo    JCD Royal Treats - Starting Server...
echo  ==========================================
echo.

cd /d "%~dp0server"

if not exist node_modules (
    echo  Installing dependencies, please wait...
    npm install
    echo.
)

echo  Server starting at http://localhost:3000
echo  Press Ctrl+C to stop.
echo.

node server.js

pause
