@echo off
echo BlueStacks Protector - Uninstaller
echo ===================================

REM Check if running as administrator
net session >nul 2>&1
if %errorLevel% == 0 (
    echo Running with administrator privileges...
) else (
    echo ERROR: This script must be run as Administrator!
    echo Right-click and select "Run as administrator"
    pause
    exit /b 1
)

echo.
echo Stopping BlueStacks Protector service...
net stop BlueStacksProtector 2>nul
if %ERRORLEVEL% == 0 (
    echo Service stopped successfully.
) else (
    echo Service was not running or already stopped.
)

echo.
echo Uninstalling BlueStacks Protector service...
"C:\BlueStacksProtector\BlueStacksProtector.exe" --uninstall 2>nul
if %ERRORLEVEL% == 0 (
    echo Service uninstalled successfully.
) else (
    echo Service may not have been installed or already removed.
)

echo.
echo Removing files...
if exist "C:\BlueStacksProtector\BlueStacksProtector.exe" (
    del "C:\BlueStacksProtector\BlueStacksProtector.exe"
    echo Executable removed.
)

if exist "C:\BlueStacksProtector" (
    rmdir "C:\BlueStacksProtector" 2>nul
    if %ERRORLEVEL% == 0 (
        echo Directory removed.
    ) else (
        echo Directory may contain other files.
    )
)

echo.
echo ===================================
echo BlueStacks Protector has been uninstalled.
echo All protection services have been stopped.
echo ===================================
pause