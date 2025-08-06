@echo off
echo BlueStacks Advanced Protector - Uninstaller
echo ===========================================

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
echo Stopping BlueStacks Advanced Protector service...
net stop BlueStacksAdvancedProtector 2>nul
if %ERRORLEVEL% == 0 (
    echo Service stopped successfully.
) else (
    echo Service was not running or already stopped.
)

echo.
echo Uninstalling BlueStacks Advanced Protector service...
"C:\BlueStacksAdvancedProtector\BlueStacksProtector.exe" --uninstall 2>nul
if %ERRORLEVEL% == 0 (
    echo Service uninstalled successfully.
) else (
    echo Service may not have been installed or already removed.
)

echo.
echo Removing files...
if exist "C:\BlueStacksAdvancedProtector\BlueStacksProtector.exe" (
    del "C:\BlueStacksAdvancedProtector\BlueStacksProtector.exe"
    echo Executable removed.
)

if exist "C:\BlueStacksAdvancedProtector" (
    rmdir "C:\BlueStacksAdvancedProtector" 2>nul
    if %ERRORLEVEL% == 0 (
        echo Directory removed.
    ) else (
        echo Directory may contain other files.
    )
)

echo.
echo ===========================================
echo BlueStacks Advanced Protector has been uninstalled.
echo All advanced protection services have been stopped.
echo System-level hooks have been removed.
echo ===========================================
pause