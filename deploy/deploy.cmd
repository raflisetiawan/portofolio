@echo off
rem Builds the site and sends it to the VPS. Run from cmd: PowerShell 5.1 corrupts binary pipes.
setlocal
cd /d "%~dp0.."

for /f %%c in ('git rev-parse --short HEAD') do set COMMIT=%%c
git status --porcelain | findstr . >nul && echo Peringatan: ada perubahan yang belum di-commit, dan ikut ter-build.

echo Build %COMMIT%...
call vp run build || goto :failed

echo Mengirim ke server...
C:\Windows\System32\tar.exe -czf - dist dist-server | C:\Windows\System32\OpenSSH\ssh.exe -o BatchMode=yes staging ./deploy-portfolio.sh - %COMMIT% || goto :failed

echo Selesai: https://raflisetiawan.tech
exit /b 0

:failed
echo Deploy gagal.
exit /b 1
