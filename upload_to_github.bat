@echo off
echo ==========================================
echo      AUTO GITHUB UPLOADER
echo ==========================================
echo.

:: 1. Fix Path temporarily
echo [1/4] Fixing Git Environment...
set "PATH=%PATH%;C:\Program Files\Git\cmd"

:: Check if git works now
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Git command not found in PATH. Using absolute path...
    set "GIT_CMD=C:\Program Files\Git\cmd\git.exe"
) else (
    set "GIT_CMD=git"
)

:: Verify Git is accessible
"%GIT_CMD%" --version
if %errorlevel% neq 0 (
    echo CRITICAL ERROR: Git executable not found at C:\Program Files\Git\cmd\git.exe
    pause
    exit /b
)

echo Git found!
echo.

:: 2. Check Repository Status
echo [2/4] Checking Repository Status...
if not exist .git (
    echo Initializing new repository...
    "%GIT_CMD%" init
)
"%GIT_CMD%" add .
"%GIT_CMD%" commit -m "Auto-save before upload" >nul 2>&1

:: 3. Get URL
echo.
echo [3/4] Connect to GitHub
echo.
echo Please create a NEW repository on GitHub (empty).
echo Paste the URL below (e.g., https://github.com/yourname/myproject.git).
echo.
set /p REPO_URL="Repository URL: "

if "%REPO_URL%"=="" (
    echo.
    echo No URL provided. Operation cancelled.
    pause
    exit /b
)

:: 4. Push
echo.
echo [4/4] Uploading to GitHub...
"%GIT_CMD%" remote remove origin >nul 2>&1
"%GIT_CMD%" remote add origin %REPO_URL%
"%GIT_CMD%" branch -M main
"%GIT_CMD%" push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ==========================================
    echo      SUCCESS! CODE UPLOADED.
    echo ==========================================
) else (
    echo.
    echo Upload failed. Please check your URL and internet connection.
)

pause
