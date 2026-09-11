@echo off
set "PATH=C:\Users\ASUS\.tools\mingit\cmd;C:\Users\ASUS\.tools\mingit\mingw64\bin;%PATH%"
cd /d "%~dp0"
echo ============================================================
echo   Pushing SIH-updated-26 to GitHub
echo   Repository: https://github.com/aaryanpote4-cpu/SIH-updated-26
echo ============================================================
echo.
git push -u origin main
echo.
if %ERRORLEVEL% equ 0 (
    echo [SUCCESS] Code successfully pushed to GitHub!
) else (
    echo [NOTICE] If prompt appeared or login failed, you can also push using a Personal Access Token:
    echo git push https://YOUR_GITHUB_PAT@github.com/aaryanpote4-cpu/SIH-updated-26.git main
)
echo.
pause
