@echo off
echo BlueStacks Advanced Protector - Build and Installation Script
echo =============================================================

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

REM Build the project
echo.
echo Building BlueStacks Advanced Protector...
if not exist "build" mkdir build
cd build

cmake .. -G "Visual Studio 16 2019" -A x64
if %ERRORLEVEL% neq 0 (
    echo ERROR: CMake configuration failed!
    pause
    exit /b 1
)

cmake --build . --config Release
if %ERRORLEVEL% neq 0 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)

cd ..

REM Copy executable to a permanent location
if not exist "C:\BlueStacksAdvancedProtector" mkdir "C:\BlueStacksAdvancedProtector"
copy "build\bin\Release\BlueStacksProtector.exe" "C:\BlueStacksAdvancedProtector\"

REM Install as Windows service
echo.
echo Installing BlueStacks Advanced Protector as Windows Service...
"C:\BlueStacksAdvancedProtector\BlueStacksProtector.exe" --install

if %ERRORLEVEL% neq 0 (
    echo ERROR: Service installation failed!
    pause
    exit /b 1
)

REM Start the service
echo.
echo Starting BlueStacks Advanced Protector service...
net start BlueStacksAdvancedProtector

if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to start service!
    pause
    exit /b 1
)

echo.
echo =============================================================
echo BlueStacks Advanced Protector installed and started successfully!
echo.
echo ADVANCED FEATURES ENABLED:
echo * SHA-256 checksum verification for executable integrity
echo * Kernel-level memory protection and analysis
echo * System-wide keyboard hook for hotkey detection
echo * Anti-debugging and anti-reverse engineering protection
echo * Real-time Discord logging with enhanced details
echo.
echo The service will automatically start with Windows.
echo All security events will be sent to your Discord webhook.
echo.
echo To uninstall: "C:\BlueStacksAdvancedProtector\BlueStacksProtector.exe" --uninstall
echo To test in console: "C:\BlueStacksAdvancedProtector\BlueStacksProtector.exe" --console
echo =============================================================
pause