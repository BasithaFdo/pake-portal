@echo off
title SkyLine Hub Core 3D & Web Server
chcp 65001 >nul
echo =========================================================
echo   Starting SkyLine Hub Engine & 3D Web Telemetry Server...
echo =========================================================
powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
