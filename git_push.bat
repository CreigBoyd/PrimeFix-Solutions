@echo off
title Git Quick Push - PrimeFix
cd /d "C:\React_Projects\primefix-react"

echo Current Status:
git status -s

echo.
set /p msg="Enter commit message (or press ENTER for 'minor updates'): "
if "%msg%"=="" set msg=minor updates

git add .
git commit -m "%msg%"
git push origin main

echo.
echo [DONE] Code pushed to GitHub!
pause