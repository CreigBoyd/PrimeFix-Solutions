@echo off
title PrimeFix Solutions - Production Build
color 0A

echo ===================================================
echo   Starting Production Build for PrimeFix Solutions
echo ===================================================
echo.

:: Navigate to your project directory
cd /d "C:\React_Projects\primefix-react"

echo Checking dependencies...
if not exist "node_modules\" (
    echo.
    echo [!] node_modules not found. Running npm install first...
    call npm install
)

echo.
echo Running build script...
call npm run build
if %ERRORLEVEL% EQU 0 (
    echo Launching local preview...
    call npm run preview
)

:: Check build status
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ===================================================
    echo   [SUCCESS] Build completed successfully!
    echo   Output generated in the 'dist' folder.
    echo ===================================================
) else (
    color 0C
    echo.
    echo ===================================================
    echo   [ERROR] Build failed. Review the log above.
    echo ===================================================
)

echo.
pause