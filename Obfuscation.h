#pragma once

#ifndef OBFUSCATION_H
#define OBFUSCATION_H

#include <windows.h>
#include <string>
#include <vector>
#include <random>
#include <algorithm>
#include <intrin.h>

// Compile-time string obfuscation using XOR cipher
template<int KEY, typename T, int N>
class ObfuscatedString {
private:
    T obfuscated[N];
    
public:
    constexpr ObfuscatedString(const T* str) : obfuscated{} {
        for (int i = 0; i < N; ++i) {
            obfuscated[i] = str[i] ^ KEY;
        }
    }
    
    std::basic_string<T> decrypt() const {
        std::basic_string<T> result;
        result.reserve(N);
        for (int i = 0; i < N - 1; ++i) {
            result += static_cast<T>(obfuscated[i] ^ KEY);
        }
        return result;
    }
};

// Macro for compile-time string obfuscation
#define OBFUSCATE(str) (ObfuscatedString<__COUNTER__, char, sizeof(str)>(str).decrypt().c_str())
#define OBFUSCATE_W(str) (ObfuscatedString<__COUNTER__, wchar_t, sizeof(str)/sizeof(wchar_t)>(str).decrypt().c_str())

// Control flow obfuscation macros
#define JUNK_CODE() \
    do { \
        volatile int junk = 0; \
        junk += GetTickCount() & 0x1; \
        junk *= 2; \
        junk /= 2; \
        (void)junk; \
    } while(0)

#define FAKE_CONDITION() \
    if (GetTickCount() % 2 == 3) { \
        ExitProcess(0); \
    }

// Function call obfuscation
template<typename Func>
class ObfuscatedCall {
private:
    Func* func_ptr;
    
public:
    ObfuscatedCall(Func* f) : func_ptr(f) {}
    
    template<typename... Args>
    auto operator()(Args&&... args) -> decltype(func_ptr(std::forward<Args>(args)...)) {
        // Add junk operations before call
        volatile int dummy = GetTickCount();
        dummy ^= 0x12345678;
        dummy *= 7;
        dummy /= 7;
        
        // Call the actual function
        auto result = func_ptr(std::forward<Args>(args)...);
        
        // Add junk operations after call
        dummy += GetTickCount();
        dummy ^= 0x87654321;
        
        return result;
    }
};

#define OBFUSCATED_CALL(func) ObfuscatedCall<decltype(func)>(&func)

// Anti-debugging techniques
class AntiDebugging {
public:
    // Check for debugger presence using multiple methods
    static bool IsDebuggerPresent() {
        // Method 1: Standard API
        if (::IsDebuggerPresent()) return true;
        
        // Method 2: PEB check
        if (CheckPEB()) return true;
        
        // Method 3: Remote debugger check
        BOOL isRemoteDebugger = FALSE;
        CheckRemoteDebuggerPresent(GetCurrentProcess(), &isRemoteDebugger);
        if (isRemoteDebugger) return true;
        
        // Method 4: Hardware breakpoint check
        if (CheckHardwareBreakpoints()) return true;
        
        // Method 5: Timing check
        if (CheckTiming()) return true;
        
        // Method 6: Exception-based check
        if (CheckExceptions()) return true;
        
        return false;
    }
    
    // Check for virtual machine presence
    static bool IsVirtualMachine() {
        // Check CPUID for hypervisor bit
        int cpuid[4];
        __cpuid(cpuid, 1);
        if (cpuid[2] & (1 << 31)) return true;
        
        // Check for VM-specific registry keys
        HKEY hKey;
        if (RegOpenKeyExA(HKEY_LOCAL_MACHINE, OBFUSCATE("HARDWARE\\DESCRIPTION\\System"), 0, KEY_READ, &hKey) == ERROR_SUCCESS) {
            char buffer[256];
            DWORD bufferSize = sizeof(buffer);
            if (RegQueryValueExA(hKey, OBFUSCATE("SystemBiosVersion"), NULL, NULL, (LPBYTE)buffer, &bufferSize) == ERROR_SUCCESS) {
                std::string biosVersion = buffer;
                std::transform(biosVersion.begin(), biosVersion.end(), biosVersion.begin(), ::tolower);
                if (biosVersion.find("vbox") != std::string::npos ||
                    biosVersion.find("vmware") != std::string::npos ||
                    biosVersion.find("qemu") != std::string::npos) {
                    RegCloseKey(hKey);
                    return true;
                }
            }
            RegCloseKey(hKey);
        }
        
        // Check for VM-specific processes
        const char* vmProcesses[] = {
            "vmtoolsd.exe", "vmwaretray.exe", "vmwareuser.exe",
            "vboxservice.exe", "vboxtray.exe", "sandboxiedcomlaunch.exe",
            "sandboxierpcss.exe", "procmon.exe", "regmon.exe",
            "processmonitor.exe", "wireshark.exe", "fiddler.exe"
        };
        
        for (const char* process : vmProcesses) {
            if (IsProcessRunning(process)) return true;
        }
        
        return false;
    }
    
    // Check for analysis tools
    static bool IsAnalysisToolPresent() {
        const char* analysisTools[] = {
            "ollydbg.exe", "x64dbg.exe", "x32dbg.exe", "windbg.exe",
            "ida.exe", "ida64.exe", "idaq.exe", "idaq64.exe",
            "cheatengine-x86_64.exe", "cheatengine-i386.exe",
            "processhacker.exe", "procexp.exe", "regshot.exe"
        };
        
        for (const char* tool : analysisTools) {
            if (IsProcessRunning(tool)) return true;
        }
        
        return false;
    }

private:
    static bool CheckPEB() {
        // Check PEB BeingDebugged flag using inline assembly
        bool beingDebugged = false;
        
        #ifdef _WIN64
        __asm {
            mov rax, gs:[60h]    // PEB
            mov al, [rax + 2h]   // BeingDebugged flag
            mov beingDebugged, al
        }
        #else
        __asm {
            mov eax, fs:[30h]    // PEB
            mov al, [eax + 2h]   // BeingDebugged flag
            mov beingDebugged, al
        }
        #endif
        
        return beingDebugged;
    }
    
    static bool CheckHardwareBreakpoints() {
        CONTEXT ctx = { 0 };
        ctx.ContextFlags = CONTEXT_DEBUG_REGISTERS;
        
        if (GetThreadContext(GetCurrentThread(), &ctx)) {
            return (ctx.Dr0 != 0 || ctx.Dr1 != 0 || ctx.Dr2 != 0 || ctx.Dr3 != 0);
        }
        
        return false;
    }
    
    static bool CheckTiming() {
        DWORD start = GetTickCount();
        DWORD end = GetTickCount();
        
        // If there's a significant delay, likely being debugged
        return (end - start) > 100;
    }
    
    static bool CheckExceptions() {
        __try {
            // Trigger an exception
            *(int*)0 = 0;
        }
        __except (EXCEPTION_EXECUTE_HANDLER) {
            // If we reach here, debugger might be present
            return false;
        }
        
        // If exception wasn't caught, likely being debugged
        return true;
    }
    
    static bool IsProcessRunning(const char* processName) {
        HANDLE hSnapshot = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);
        if (hSnapshot == INVALID_HANDLE_VALUE) return false;
        
        PROCESSENTRY32 pe32;
        pe32.dwSize = sizeof(PROCESSENTRY32);
        
        bool found = false;
        if (Process32First(hSnapshot, &pe32)) {
            do {
                if (_stricmp(pe32.szExeFile, processName) == 0) {
                    found = true;
                    break;
                }
            } while (Process32Next(hSnapshot, &pe32));
        }
        
        CloseHandle(hSnapshot);
        return found;
    }
};

// Code integrity verification
class CodeIntegrity {
public:
    // Calculate checksum of current module
    static DWORD CalculateModuleChecksum() {
        HMODULE hModule = GetModuleHandle(NULL);
        PIMAGE_DOS_HEADER dosHeader = (PIMAGE_DOS_HEADER)hModule;
        PIMAGE_NT_HEADERS ntHeaders = (PIMAGE_NT_HEADERS)((BYTE*)hModule + dosHeader->e_lfanew);
        
        DWORD checksum = 0;
        BYTE* moduleBase = (BYTE*)hModule;
        DWORD moduleSize = ntHeaders->OptionalHeader.SizeOfImage;
        
        for (DWORD i = 0; i < moduleSize; i++) {
            checksum += moduleBase[i];
            checksum = (checksum << 1) | (checksum >> 31); // Rotate left
        }
        
        return checksum;
    }
    
    // Verify that critical functions haven't been hooked
    static bool VerifyFunctionIntegrity(void* functionPtr, size_t functionSize) {
        BYTE* funcBytes = (BYTE*)functionPtr;
        
        // Check for common hook patterns
        // JMP instruction (0xE9)
        if (funcBytes[0] == 0xE9) return false;
        
        // JMP short (0xEB)
        if (funcBytes[0] == 0xEB) return false;
        
        // PUSH + RET combo (0x68 + 0xC3)
        if (funcBytes[0] == 0x68 && funcBytes[5] == 0xC3) return false;
        
        // MOV + JMP combo for x64
        if (funcBytes[0] == 0x48 && funcBytes[1] == 0xB8 && funcBytes[10] == 0xFF && funcBytes[11] == 0xE0) {
            return false;
        }
        
        return true;
    }
};

// Dynamic API resolution to avoid import table analysis
class DynamicAPI {
private:
    static HMODULE GetModuleHandleByHash(DWORD hash) {
        // Custom GetModuleHandle implementation using PEB walking
        // This avoids using the import table
        
        #ifdef _WIN64
        PPEB peb = (PPEB)__readgsqword(0x60);
        #else
        PPEB peb = (PPEB)__readfsdword(0x30);
        #endif
        
        PLIST_ENTRY moduleList = &peb->Ldr->InMemoryOrderModuleList;
        PLIST_ENTRY currentEntry = moduleList->Flink;
        
        while (currentEntry != moduleList) {
            PLDR_DATA_TABLE_ENTRY moduleEntry = CONTAINING_RECORD(currentEntry, LDR_DATA_TABLE_ENTRY, InMemoryOrderLinks);
            
            if (HashString(moduleEntry->BaseDllName.Buffer) == hash) {
                return (HMODULE)moduleEntry->DllBase;
            }
            
            currentEntry = currentEntry->Flink;
        }
        
        return NULL;
    }
    
    static DWORD HashString(const wchar_t* str) {
        DWORD hash = 0;
        while (*str) {
            hash = ((hash << 5) + hash) + *str++;
        }
        return hash;
    }
    
public:
    template<typename T>
    static T GetFunction(const char* moduleName, const char* functionName) {
        DWORD moduleHash = 0;
        const char* p = moduleName;
        while (*p) {
            moduleHash = ((moduleHash << 5) + moduleHash) + *p++;
        }
        
        HMODULE hModule = GetModuleHandleByHash(moduleHash);
        if (!hModule) {
            hModule = LoadLibraryA(moduleName);
        }
        
        if (hModule) {
            return (T)GetProcAddress(hModule, functionName);
        }
        
        return nullptr;
    }
};

// Memory encryption for sensitive data
class MemoryProtection {
private:
    static std::vector<BYTE> key;
    
public:
    static void InitializeKey() {
        if (key.empty()) {
            std::random_device rd;
            std::mt19937 gen(rd());
            key.resize(32); // 256-bit key
            
            for (auto& byte : key) {
                byte = gen() % 256;
            }
        }
    }
    
    static std::vector<BYTE> Encrypt(const std::vector<BYTE>& data) {
        InitializeKey();
        std::vector<BYTE> encrypted = data;
        
        for (size_t i = 0; i < encrypted.size(); ++i) {
            encrypted[i] ^= key[i % key.size()];
        }
        
        return encrypted;
    }
    
    static std::vector<BYTE> Decrypt(const std::vector<BYTE>& encryptedData) {
        return Encrypt(encryptedData); // XOR is self-inverse
    }
    
    // Secure memory allocation
    static void* SecureAlloc(size_t size) {
        void* ptr = VirtualAlloc(NULL, size, MEM_COMMIT | MEM_RESERVE, PAGE_READWRITE);
        if (ptr) {
            VirtualLock(ptr, size); // Lock in physical memory
        }
        return ptr;
    }
    
    static void SecureFree(void* ptr, size_t size) {
        if (ptr) {
            SecureZeroMemory(ptr, size); // Clear memory
            VirtualUnlock(ptr, size);
            VirtualFree(ptr, 0, MEM_RELEASE);
        }
    }
};

// Control flow obfuscation using indirect calls
#define INDIRECT_CALL(func, ...) \
    do { \
        volatile auto funcPtr = func; \
        JUNK_CODE(); \
        funcPtr(__VA_ARGS__); \
        FAKE_CONDITION(); \
    } while(0)

// Polymorphic code generation
class PolymorphicCode {
public:
    // Generate different versions of the same functionality
    template<int Variant>
    static void PolymorphicFunction() {
        if constexpr (Variant == 0) {
            // Version 1
            for (int i = 0; i < 10; ++i) {
                volatile int dummy = i * 2;
                (void)dummy;
            }
        } else if constexpr (Variant == 1) {
            // Version 2
            int j = 0;
            while (j < 10) {
                volatile int dummy = j + j;
                (void)dummy;
                ++j;
            }
        } else {
            // Version 3
            volatile int dummy = 0;
            for (int k = 0; k < 20; k += 2) {
                dummy += k;
            }
            (void)dummy;
        }
    }
};

// Anti-disassembly techniques
#define ANTI_DISASM() \
    __asm { \
        __asm jmp next \
        __asm _emit 0xFF \
        __asm _emit 0xFF \
        __asm _emit 0xFF \
        __asm next: \
    }

// Initialize static member
std::vector<BYTE> MemoryProtection::key;

#endif // OBFUSCATION_H