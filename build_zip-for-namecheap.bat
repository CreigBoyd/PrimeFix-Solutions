@echo off
title Build & Package Zip - PrimeFix
cd /d "C:\React_Projects\primefix-react"

echo Building production assets...
call npm run build

if %ERRORLEVEL% EQU 0 (
    echo.
    echo Zipping dist folder for Namecheap...
    powershell -Command "Compress-Archive -Path 'dist\*' -DestinationPath 'dist_deploy.zip' -Force"
    echo.
    echo [SUCCESS] Created 'dist_deploy.zip'. Ready for cPanel upload!
) else (
    echo [ERROR] Build failed.
)
pause