@echo off
echo BlueStacks Advanced Protector - Build Commands
echo =============================================

echo.
echo Available build methods:
echo 1. Visual Studio with CMake (Recommended)
echo 2. Visual Studio Command Line (MSVC)
echo 3. MinGW-w64 with g++
echo 4. Clang
echo.

set /p choice="Choose build method (1-4): "

if "%choice%"=="1" goto cmake_build
if "%choice%"=="2" goto msvc_build
if "%choice%"=="3" goto mingw_build
if "%choice%"=="4" goto clang_build

echo Invalid choice. Using CMake build...

:cmake_build
echo.
echo ==========================================
echo Building with Visual Studio and CMake...
echo ==========================================

REM Create build directory
if not exist "build" mkdir build
cd build

REM Configure with CMake
echo Configuring project...
cmake .. -G "Visual Studio 16 2019" -A x64
if %ERRORLEVEL% neq 0 (
    echo ERROR: CMake configuration failed!
    echo Make sure Visual Studio 2019 and CMake are installed.
    pause
    exit /b 1
)

REM Build Release version
echo Building Release version...
cmake --build . --config Release --parallel
if %ERRORLEVEL% neq 0 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)

cd ..
echo.
echo SUCCESS: Executable created at: build\bin\Release\BlueStacksProtector.exe
goto end

:msvc_build
echo.
echo ==========================================
echo Building with MSVC Command Line...
echo ==========================================

REM Check if MSVC is available
where cl >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Setting up Visual Studio environment...
    call "C:\Program Files (x86)\Microsoft Visual Studio\2019\Community\VC\Auxiliary\Build\vcvars64.bat"
    if %ERRORLEVEL% neq 0 (
        echo ERROR: Could not find Visual Studio 2019
        echo Please install Visual Studio 2019 with C++ development tools
        pause
        exit /b 1
    )
)

echo Compiling with MSVC...
cl /EHsc /O2 /MT ^
   /I"C:\Program Files (x86)\Windows Kits\10\Include\10.0.19041.0\um" ^
   /I"C:\Program Files (x86)\Windows Kits\10\Include\10.0.19041.0\shared" ^
   BlueStacksProtector.cpp ^
   /link winhttp.lib psapi.lib crypt32.lib ntdll.lib advapi32.lib kernel32.lib user32.lib ^
   /LIBPATH:"C:\Program Files (x86)\Windows Kits\10\Lib\10.0.19041.0\um\x64" ^
   /LIBPATH:"C:\Program Files (x86)\Windows Kits\10\Lib\10.0.19041.0\ucrt\x64" ^
   /OUT:BlueStacksProtector.exe

if %ERRORLEVEL% neq 0 (
    echo ERROR: MSVC compilation failed!
    pause
    exit /b 1
)

echo.
echo SUCCESS: Executable created: BlueStacksProtector.exe
goto end

:mingw_build
echo.
echo ==========================================
echo Building with MinGW-w64...
echo ==========================================

REM Check if g++ is available
where g++ >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ERROR: g++ not found!
    echo Please install MinGW-w64 from: https://www.mingw-w64.org/downloads/
    echo Or install via MSYS2: pacman -S mingw-w64-x86_64-gcc
    pause
    exit /b 1
)

echo Compiling with g++...
g++ -std=c++17 -O2 -static-libgcc -static-libstdc++ ^
    -DWIN32_LEAN_AND_MEAN -D_WIN32_WINNT=0x0601 ^
    BlueStacksProtector.cpp ^
    -lwinhttp -lpsapi -lcrypt32 -ladvapi32 -lkernel32 -luser32 -lntdll ^
    -o BlueStacksProtector.exe

if %ERRORLEVEL% neq 0 (
    echo ERROR: MinGW compilation failed!
    pause
    exit /b 1
)

echo.
echo SUCCESS: Executable created: BlueStacksProtector.exe
goto end

:clang_build
echo.
echo ==========================================
echo Building with Clang...
echo ==========================================

REM Check if clang++ is available
where clang++ >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ERROR: clang++ not found!
    echo Please install LLVM/Clang from: https://llvm.org/builds/
    pause
    exit /b 1
)

echo Compiling with clang++...
clang++ -std=c++17 -O2 -target x86_64-pc-windows-msvc ^
    -DWIN32_LEAN_AND_MEAN -D_WIN32_WINNT=0x0601 ^
    BlueStacksProtector.cpp ^
    -lwinhttp -lpsapi -lcrypt32 -ladvapi32 -lkernel32 -luser32 -lntdll ^
    -o BlueStacksProtector.exe

if %ERRORLEVEL% neq 0 (
    echo ERROR: Clang compilation failed!
    pause
    exit /b 1
)

echo.
echo SUCCESS: Executable created: BlueStacksProtector.exe
goto end

:end
echo.
echo ==========================================
echo Build completed successfully!
echo ==========================================
echo.
echo Next steps:
echo 1. Test the executable: BlueStacksProtector.exe --console
echo 2. Install as service: BlueStacksProtector.exe --install
echo 3. Or use the automated installer: build_and_install.bat
echo.
pause