@echo off
echo BlueStacks Protector - Build and Installation Script
echo ====================================================

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
echo Building BlueStacks Protector...
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
if not exist "C:\BlueStacksProtector" mkdir "C:\BlueStacksProtector"
copy "build\bin\Release\BlueStacksProtector.exe" "C:\BlueStacksProtector\"

REM Install as Windows service
echo.
echo Installing BlueStacks Protector as Windows Service...
"C:\BlueStacksProtector\BlueStacksProtector.exe" --install

if %ERRORLEVEL% neq 0 (
    echo ERROR: Service installation failed!
    pause
    exit /b 1
)

REM Start the service
echo.
echo Starting BlueStacks Protector service...
net start BlueStacksProtector

if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to start service!
    pause
    exit /b 1
)

echo.
echo ====================================================
echo BlueStacks Protector installed and started successfully!
echo.
echo The service will automatically start with Windows.
echo Logs will be sent to your Discord webhook.
echo.
echo To uninstall: "C:\BlueStacksProtector\BlueStacksProtector.exe" --uninstall
echo To test in console: "C:\BlueStacksProtector\BlueStacksProtector.exe" --console
echo ====================================================
pause