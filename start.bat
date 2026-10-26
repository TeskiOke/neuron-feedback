@echo off
cd /d "%~dp0"
echo ==================================================
echo   Starting Neuron...
echo   Local: http://localhost:5173
echo   Network: connect to your PC's IP on port 5173
echo ==================================================
npm run dev
pause
