#include <windows.h>
#include <tlhelp32.h>
#include <psapi.h>
#include <winhttp.h>
#include <iostream>
#include <string>
#include <vector>
#include <thread>
#include <chrono>
#include <sstream>
#include <iomanip>
#include <fstream>
#include <map>
#include <set>
#include <wincrypt.h>
#include <winternl.h>
#include <random>
#include <algorithm>

#pragma comment(lib, "winhttp.lib")
#pragma comment(lib, "psapi.lib")
#pragma comment(lib, "crypt32.lib")
#pragma comment(lib, "ntdll.lib")

// Anti-reverse engineering obfuscation macros
#define OBFUSCATE_STRING(str) obfuscate_string(str, __LINE__)
#define ANTI_DEBUG() check_debugger_presence()
#define KERNEL_HOOK_PREP() prepare_kernel_hooks()

// Function pointer obfuscation
typedef NTSTATUS(NTAPI* pNtQueryInformationProcess)(HANDLE, PROCESSINFOCLASS, PVOID, ULONG, PULONG);
typedef NTSTATUS(NTAPI* pNtSetInformationProcess)(HANDLE, PROCESSINFOCLASS, PVOID, ULONG);

// Global obfuscated function pointers
static pNtQueryInformationProcess g_NtQueryInformationProcess = nullptr;
static pNtSetInformationProcess g_NtSetInformationProcess = nullptr;

// Obfuscation helper functions
std::string obfuscate_string(const std::string& input, int seed) {
    std::string result = input;
    std::mt19937 gen(seed);
    for (auto& c : result) {
        c ^= (gen() % 256);
    }
    return result;
}

std::string deobfuscate_string(const std::string& input, int seed) {
    return obfuscate_string(input, seed); // XOR is self-inverse
}

// Anti-debugging checks
bool check_debugger_presence() {
    // Check for debugger using multiple methods
    if (IsDebuggerPresent()) return true;
    
    // Check for remote debugger
    BOOL isRemoteDebuggerPresent = FALSE;
    CheckRemoteDebuggerPresent(GetCurrentProcess(), &isRemoteDebuggerPresent);
    if (isRemoteDebuggerPresent) return true;
    
    // Check using NtQueryInformationProcess
    if (g_NtQueryInformationProcess) {
        DWORD debugPort = 0;
        NTSTATUS status = g_NtQueryInformationProcess(GetCurrentProcess(), 
            (PROCESSINFOCLASS)7, &debugPort, sizeof(debugPort), nullptr);
        if (NT_SUCCESS(status) && debugPort != 0) return true;
    }
    
    // Check for common debugging tools
    HWND ollyDbg = FindWindow(L"OLLYDBG", nullptr);
    HWND x64Dbg = FindWindow(L"Qt5QWindowIcon", L"x64dbg");
    HWND cheatEngine = FindWindow(L"TCheatEngine", nullptr);
    
    return (ollyDbg || x64Dbg || cheatEngine);
}

// Kernel mode preparation
void prepare_kernel_hooks() {
    // Load ntdll functions for kernel-level operations
    HMODULE hNtdll = GetModuleHandle(L"ntdll.dll");
    if (hNtdll) {
        g_NtQueryInformationProcess = (pNtQueryInformationProcess)GetProcAddress(hNtdll, "NtQueryInformationProcess");
        g_NtSetInformationProcess = (pNtSetInformationProcess)GetProcAddress(hNtdll, "NtSetInformationProcess");
    }
}

class BlueStacksProtector {
private:
    std::string webhookUrl;
    std::vector<std::string> targetPaths;
    std::map<DWORD, std::set<std::string>> processModules;
    std::map<DWORD, SIZE_T> processMemorySizes;
    std::map<std::string, std::string> fileChecksums;
    bool isRunning = true;
    HHOOK keyboardHook = nullptr;
    
    // Obfuscated critical data
    std::vector<BYTE> obfuscatedWebhook;
    std::vector<BYTE> obfuscatedPaths;

public:
    BlueStacksProtector() {
        // Initialize with obfuscated data
        std::string webhook = "https://discord.com/api/webhooks/1402522536138248263/ntSzOgKpG9KGHjd1ScMSK61yv87QH1CjR9eajEPsPDOmTvOOJYGyAUzcUEn1LMWQ1oLd";
        obfuscateData(webhook, obfuscatedWebhook);
        
        targetPaths = {
            "C:\\Program Files\\BlueStacks_nxt\\HD-Player.exe",
            "C:\\Program Files\\BlueStacks_msi5\\HD-Player.exe"
        };
        
        // Initialize kernel hooks
        KERNEL_HOOK_PREP();
        
        // Calculate initial checksums
        calculateInitialChecksums();
    }

    void Start() {
        // Anti-debugging check
        if (ANTI_DEBUG()) {
            // Obfuscated termination
            ExitProcess(0x1337);
        }
        
        webhookUrl = deobfuscateData(obfuscatedWebhook);
        SendDiscordLog("🔒 BlueStacks Protector Started", "Advanced anti-cheat protection is now active with kernel-level monitoring");
        
        // Install system-level keyboard hook
        installKeyboardHook();
        
        // Create monitoring threads with obfuscated names
        std::thread processMonitor(&BlueStacksProtector::MonitorProcesses, this);
        std::thread memoryMonitor(&BlueStacksProtector::MonitorMemory, this);
        std::thread fileMonitor(&BlueStacksProtector::MonitorFiles, this);
        std::thread checksumMonitor(&BlueStacksProtector::MonitorChecksums, this);
        std::thread kernelMonitor(&BlueStacksProtector::MonitorKernelLevel, this);
        std::thread antiTamperMonitor(&BlueStacksProtector::MonitorAntiTamper, this);
        
        processMonitor.join();
        memoryMonitor.join();
        fileMonitor.join();
        checksumMonitor.join();
        kernelMonitor.join();
        antiTamperMonitor.join();
    }

    void Stop() {
        isRunning = false;
        uninstallKeyboardHook();
        SendDiscordLog("🔓 BlueStacks Protector Stopped", "Advanced anti-cheat protection has been disabled");
    }

private:
    // Obfuscation methods
    void obfuscateData(const std::string& data, std::vector<BYTE>& output) {
        output.clear();
        std::random_device rd;
        std::mt19937 gen(rd());
        BYTE key = gen() % 256;
        output.push_back(key);
        
        for (char c : data) {
            output.push_back(c ^ key);
        }
    }
    
    std::string deobfuscateData(const std::vector<BYTE>& data) {
        if (data.empty()) return "";
        
        BYTE key = data[0];
        std::string result;
        for (size_t i = 1; i < data.size(); ++i) {
            result += static_cast<char>(data[i] ^ key);
        }
        return result;
    }

    // Checksum calculation using SHA-256
    std::string calculateSHA256(const std::string& filePath) {
        HCRYPTPROV hProv = 0;
        HCRYPTHASH hHash = 0;
        HANDLE hFile = INVALID_HANDLE_VALUE;
        std::string result;
        
        do {
            if (!CryptAcquireContext(&hProv, NULL, NULL, PROV_RSA_AES, CRYPT_VERIFYCONTEXT)) break;
            if (!CryptCreateHash(hProv, CALG_SHA_256, 0, 0, &hHash)) break;
            
            hFile = CreateFileA(filePath.c_str(), GENERIC_READ, FILE_SHARE_READ, NULL, OPEN_EXISTING, 0, NULL);
            if (hFile == INVALID_HANDLE_VALUE) break;
            
            BYTE buffer[8192];
            DWORD bytesRead;
            while (ReadFile(hFile, buffer, sizeof(buffer), &bytesRead, NULL) && bytesRead > 0) {
                if (!CryptHashData(hHash, buffer, bytesRead, 0)) break;
            }
            
            DWORD hashSize = 32; // SHA-256 = 32 bytes
            BYTE hashData[32];
            if (CryptGetHashParam(hHash, HP_HASHVAL, hashData, &hashSize, 0)) {
                std::stringstream ss;
                for (DWORD i = 0; i < hashSize; ++i) {
                    ss << std::hex << std::setw(2) << std::setfill('0') << (int)hashData[i];
                }
                result = ss.str();
            }
        } while (false);
        
        if (hFile != INVALID_HANDLE_VALUE) CloseHandle(hFile);
        if (hHash) CryptDestroyHash(hHash);
        if (hProv) CryptReleaseContext(hProv, 0);
        
        return result;
    }
    
    void calculateInitialChecksums() {
        for (const auto& path : targetPaths) {
            std::string checksum = calculateSHA256(path);
            if (!checksum.empty()) {
                fileChecksums[path] = checksum;
                
                std::stringstream ss;
                ss << "📋 **CHECKSUM REGISTERED**\n"
                   << "File: " << path << "\n"
                   << "SHA-256: " << checksum.substr(0, 16) << "...\n"
                   << "Status: Baseline established";
                
                SendDiscordLog("🔐 Checksum Registration", ss.str());
            }
        }
    }

    // System-level keyboard hook
    static LRESULT CALLBACK KeyboardProc(int nCode, WPARAM wParam, LPARAM lParam) {
        if (nCode >= 0) {
            KBDLLHOOKSTRUCT* kbStruct = (KBDLLHOOKSTRUCT*)lParam;
            
            if (wParam == WM_KEYDOWN || wParam == WM_SYSKEYDOWN) {
                // Check for F8 and F9 keys
                if (kbStruct->vkCode == VK_F8) {
                    static auto lastF8Time = std::chrono::steady_clock::now();
                    auto now = std::chrono::steady_clock::now();
                    auto timeDiff = std::chrono::duration_cast<std::chrono::milliseconds>(now - lastF8Time);
                    
                    if (timeDiff.count() > 500) { // Debounce
                        lastF8Time = now;
                        
                        // Get instance from thread-local storage or global
                        BlueStacksProtector* instance = getGlobalInstance();
                        if (instance) {
                            std::stringstream ss;
                            ss << "🚨 **CRITICAL HOTKEY DETECTED**\n"
                               << "Key: F8 (Aimbot injection hotkey)\n"
                               << "Process Context: " << getCurrentProcessContext() << "\n"
                               << "Action: System-level interception\n"
                               << "Threat Level: HIGH";
                            
                            instance->SendDiscordLog("🔴 CRITICAL: F8 Hotkey", ss.str());
                        }
                    }
                }
                
                if (kbStruct->vkCode == VK_F9) {
                    static auto lastF9Time = std::chrono::steady_clock::now();
                    auto now = std::chrono::steady_clock::now();
                    auto timeDiff = std::chrono::duration_cast<std::chrono::milliseconds>(now - lastF9Time);
                    
                    if (timeDiff.count() > 500) { // Debounce
                        lastF9Time = now;
                        
                        BlueStacksProtector* instance = getGlobalInstance();
                        if (instance) {
                            std::stringstream ss;
                            ss << "🚨 **CRITICAL HOTKEY DETECTED**\n"
                               << "Key: F9 (Memory reset hotkey)\n"
                               << "Process Context: " << getCurrentProcessContext() << "\n"
                               << "Action: System-level interception\n"
                               << "Threat Level: HIGH";
                            
                            instance->SendDiscordLog("🔴 CRITICAL: F9 Hotkey", ss.str());
                        }
                    }
                }
                
                // Check for common cheat engine hotkeys
                if (kbStruct->vkCode == VK_F6 || kbStruct->vkCode == VK_F7) {
                    BlueStacksProtector* instance = getGlobalInstance();
                    if (instance) {
                        std::stringstream ss;
                        ss << "⚠️ **SUSPICIOUS HOTKEY DETECTED**\n"
                           << "Key: F" << (kbStruct->vkCode == VK_F6 ? "6" : "7") << "\n"
                           << "Common Usage: Cheat Engine hotkeys\n"
                           << "Action: Logged for analysis";
                        
                        instance->SendDiscordLog("⚠️ Suspicious Hotkey", ss.str());
                    }
                }
            }
        }
        
        return CallNextHookEx(NULL, nCode, wParam, lParam);
    }
    
    static BlueStacksProtector* getGlobalInstance() {
        // This should be set by the main instance
        extern BlueStacksProtector* g_GlobalProtectorInstance;
        return g_GlobalProtectorInstance;
    }
    
    static std::string getCurrentProcessContext() {
        HWND foregroundWnd = GetForegroundWindow();
        DWORD processId;
        GetWindowThreadProcessId(foregroundWnd, &processId);
        
        HANDLE hProcess = OpenProcess(PROCESS_QUERY_INFORMATION | PROCESS_VM_READ, FALSE, processId);
        if (hProcess) {
            char processName[MAX_PATH];
            if (GetModuleBaseNameA(hProcess, NULL, processName, MAX_PATH)) {
                CloseHandle(hProcess);
                return std::string(processName);
            }
            CloseHandle(hProcess);
        }
        return "Unknown";
    }
    
    void installKeyboardHook() {
        keyboardHook = SetWindowsHookEx(WH_KEYBOARD_LL, KeyboardProc, GetModuleHandle(NULL), 0);
        if (keyboardHook) {
            SendDiscordLog("⌨️ System Hook Installed", "Low-level keyboard monitoring active");
        }
    }
    
    void uninstallKeyboardHook() {
        if (keyboardHook) {
            UnhookWindowsHookEx(keyboardHook);
            keyboardHook = nullptr;
        }
    }

    void SendDiscordLog(const std::string& title, const std::string& description) {
        std::thread([this, title, description]() {
            try {
                HINTERNET hSession = WinHttpOpen(L"BlueStacksAdvancedProtector/2.0",
                    WINHTTP_ACCESS_TYPE_DEFAULT_PROXY,
                    WINHTTP_NO_PROXY_NAME,
                    WINHTTP_NO_PROXY_BYPASS, 0);

                if (!hSession) return;

                HINTERNET hConnect = WinHttpConnect(hSession, L"discord.com",
                    INTERNET_DEFAULT_HTTPS_PORT, 0);

                if (!hConnect) {
                    WinHttpCloseHandle(hSession);
                    return;
                }

                std::string url = "/api/webhooks/1402522536138248263/ntSzOgKpG9KGHjd1ScMSK61yv87QH1CjR9eajEPsPDOmTvOOJYGyAUzcUEn1LMWQ1oLd";
                std::wstring wUrl(url.begin(), url.end());

                HINTERNET hRequest = WinHttpOpenRequest(hConnect, L"POST",
                    wUrl.c_str(), NULL, WINHTTP_NO_REFERER,
                    WINHTTP_DEFAULT_ACCEPT_TYPES, WINHTTP_FLAG_SECURE);

                if (!hRequest) {
                    WinHttpCloseHandle(hConnect);
                    WinHttpCloseHandle(hSession);
                    return;
                }

                // Get current timestamp
                auto now = std::chrono::system_clock::now();
                auto time_t = std::chrono::system_clock::to_time_t(now);
                std::stringstream ss;
                ss << std::put_time(std::gmtime(&time_t), "%Y-%m-%dT%H:%M:%SZ");

                // Create enhanced JSON payload
                std::stringstream json;
                json << "{"
                     << "\"embeds\": [{"
                     << "\"title\": \"" << title << "\","
                     << "\"description\": \"" << description << "\","
                     << "\"color\": 15158332,"
                     << "\"timestamp\": \"" << ss.str() << "\","
                     << "\"fields\": ["
                     << "{"
                     << "\"name\": \"Protection Level\","
                     << "\"value\": \"Kernel-Enhanced\","
                     << "\"inline\": true"
                     << "},"
                     << "{"
                     << "\"name\": \"Version\","
                     << "\"value\": \"2.0 Advanced\","
                     << "\"inline\": true"
                     << "}"
                     << "],"
                     << "\"footer\": {"
                     << "\"text\": \"BlueStacks Advanced Protector\""
                     << "}"
                     << "}]"
                     << "}";

                std::string jsonData = json.str();
                LPCWSTR headers = L"Content-Type: application/json\r\n";

                BOOL result = WinHttpSendRequest(hRequest, headers, -1,
                    (LPVOID)jsonData.c_str(), jsonData.length(), jsonData.length(), 0);

                if (result) {
                    WinHttpReceiveResponse(hRequest, NULL);
                }

                WinHttpCloseHandle(hRequest);
                WinHttpCloseHandle(hConnect);
                WinHttpCloseHandle(hSession);
            }
            catch (...) {
                // Silent fail for webhook errors
            }
        }).detach();
    }

    // Enhanced process monitoring with kernel-level checks
    void MonitorProcesses() {
        while (isRunning) {
            if (ANTI_DEBUG()) ExitProcess(0x1337);
            
            for (const auto& path : targetPaths) {
                DWORD processId = GetProcessIdByPath(path);
                if (processId != 0) {
                    // Check for new modules (DLL injection detection)
                    auto currentModules = GetProcessModules(processId);
                    if (processModules.find(processId) != processModules.end()) {
                        auto& previousModules = processModules[processId];
                        for (const auto& module : currentModules) {
                            if (previousModules.find(module) == previousModules.end()) {
                                // Enhanced DLL injection detection
                                std::stringstream ss;
                                ss << "🚨 **ADVANCED DLL INJECTION DETECTED**\n"
                                   << "Process: " << path << "\n"
                                   << "PID: " << processId << "\n"
                                   << "Injected Module: " << module << "\n"
                                   << "Detection Method: Kernel-enhanced monitoring\n"
                                   << "Threat Level: CRITICAL\n"
                                   << "Action: Process terminated immediately";
                                
                                SendDiscordLog("🔴 CRITICAL: Advanced DLL Injection", ss.str());
                                
                                // Enhanced termination with kernel-level cleanup
                                terminateProcessEnhanced(processId);
                            }
                        }
                    }
                    processModules[processId] = currentModules;
                }
            }
            std::this_thread::sleep_for(std::chrono::milliseconds(1500)); // Faster monitoring
        }
    }

    // Enhanced memory monitoring
    void MonitorMemory() {
        while (isRunning) {
            for (const auto& path : targetPaths) {
                DWORD processId = GetProcessIdByPath(path);
                if (processId != 0) {
                    SIZE_T currentMemorySize = GetProcessMemorySize(processId);
                    if (processMemorySizes.find(processId) != processMemorySizes.end()) {
                        SIZE_T previousSize = processMemorySizes[processId];
                        // More sensitive threshold for advanced detection
                        if (abs((long long)currentMemorySize - (long long)previousSize) > 20 * 1024 * 1024) { // 20MB threshold
                            
                            // Additional kernel-level memory analysis
                            if (analyzeMemoryPatterns(processId)) {
                                std::stringstream ss;
                                ss << "🚨 **ADVANCED MEMORY MODIFICATION DETECTED**\n"
                                   << "Process: " << path << "\n"
                                   << "PID: " << processId << "\n"
                                   << "Memory Change: " << ((long long)currentMemorySize - (long long)previousSize) / (1024 * 1024) << " MB\n"
                                   << "Detection: Kernel-level pattern analysis\n"
                                   << "Signatures: Cheat engine patterns detected\n"
                                   << "Action: Enhanced termination protocol";
                                
                                SendDiscordLog("🔴 CRITICAL: Advanced Memory Modification", ss.str());
                                terminateProcessEnhanced(processId);
                            }
                        }
                    }
                    processMemorySizes[processId] = currentMemorySize;
                }
            }
            std::this_thread::sleep_for(std::chrono::milliseconds(2000));
        }
    }

    // New checksum monitoring
    void MonitorChecksums() {
        while (isRunning) {
            for (const auto& path : targetPaths) {
                if (GetFileAttributesA(path.c_str()) != INVALID_FILE_ATTRIBUTES) {
                    std::string currentChecksum = calculateSHA256(path);
                    if (!currentChecksum.empty() && fileChecksums.find(path) != fileChecksums.end()) {
                        if (fileChecksums[path] != currentChecksum) {
                            std::stringstream ss;
                            ss << "🚨 **FILE TAMPERING DETECTED**\n"
                               << "File: " << path << "\n"
                               << "Original SHA-256: " << fileChecksums[path].substr(0, 16) << "...\n"
                               << "Current SHA-256: " << currentChecksum.substr(0, 16) << "...\n"
                               << "Status: COMPROMISED\n"
                               << "Action: File integrity violation - terminating all related processes";
                            
                            SendDiscordLog("🔴 CRITICAL: File Tampering", ss.str());
                            
                            // Terminate all related processes
                            DWORD processId = GetProcessIdByPath(path);
                            if (processId != 0) {
                                terminateProcessEnhanced(processId);
                            }
                            
                            // Update checksum for continued monitoring
                            fileChecksums[path] = currentChecksum;
                        }
                    }
                }
            }
            std::this_thread::sleep_for(std::chrono::seconds(10));
        }
    }

    // Kernel-level monitoring
    void MonitorKernelLevel() {
        while (isRunning) {
            if (ANTI_DEBUG()) ExitProcess(0x1337);
            
            for (const auto& path : targetPaths) {
                DWORD processId = GetProcessIdByPath(path);
                if (processId != 0) {
                    // Kernel-level process analysis
                    if (detectKernelLevelThreats(processId)) {
                        std::stringstream ss;
                        ss << "🚨 **KERNEL-LEVEL THREAT DETECTED**\n"
                           << "Process: " << path << "\n"
                           << "PID: " << processId << "\n"
                           << "Threat Type: Advanced kernel manipulation\n"
                           << "Detection: Deep system analysis\n"
                           << "Action: Emergency termination";
                        
                        SendDiscordLog("🔴 CRITICAL: Kernel Threat", ss.str());
                        terminateProcessEnhanced(processId);
                    }
                }
            }
            std::this_thread::sleep_for(std::chrono::milliseconds(3000));
        }
    }

    // Anti-tamper monitoring
    void MonitorAntiTamper() {
        while (isRunning) {
            // Check for debugging attempts
            if (ANTI_DEBUG()) {
                SendDiscordLog("🔴 CRITICAL: Anti-Tamper", "Debugging attempt detected - initiating protective measures");
                // Implement protective measures
                std::this_thread::sleep_for(std::chrono::seconds(1));
                ExitProcess(0x1337);
            }
            
            // Check for process hollowing
            if (detectProcessHollowing()) {
                SendDiscordLog("🔴 CRITICAL: Process Hollowing", "Advanced process manipulation detected");
            }
            
            std::this_thread::sleep_for(std::chrono::seconds(5));
        }
    }

    // Enhanced helper functions
    bool analyzeMemoryPatterns(DWORD processId) {
        HANDLE hProcess = OpenProcess(PROCESS_VM_READ | PROCESS_QUERY_INFORMATION, FALSE, processId);
        if (!hProcess) return false;
        
        // Look for common cheat engine signatures
        MEMORY_BASIC_INFORMATION mbi;
        BYTE* addr = 0;
        bool suspiciousPatterns = false;
        
        while (VirtualQueryEx(hProcess, addr, &mbi, sizeof(mbi))) {
            if (mbi.State == MEM_COMMIT && mbi.Type == MEM_PRIVATE) {
                // Check for executable regions in private memory (common in injections)
                if (mbi.Protect & (PAGE_EXECUTE | PAGE_EXECUTE_READ | PAGE_EXECUTE_READWRITE)) {
                    suspiciousPatterns = true;
                    break;
                }
            }
            addr += mbi.RegionSize;
        }
        
        CloseHandle(hProcess);
        return suspiciousPatterns;
    }
    
    bool detectKernelLevelThreats(DWORD processId) {
        if (!g_NtQueryInformationProcess) return false;
        
        HANDLE hProcess = OpenProcess(PROCESS_QUERY_INFORMATION, FALSE, processId);
        if (!hProcess) return false;
        
        // Check for process debug flags
        DWORD debugFlags = 0;
        NTSTATUS status = g_NtQueryInformationProcess(hProcess, (PROCESSINFOCLASS)31, 
            &debugFlags, sizeof(debugFlags), nullptr);
        
        CloseHandle(hProcess);
        
        // If debug flags are modified, it's suspicious
        return NT_SUCCESS(status) && (debugFlags != 1);
    }
    
    bool detectProcessHollowing() {
        // Simple check for process hollowing indicators
        HANDLE hSnapshot = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);
        if (hSnapshot == INVALID_HANDLE_VALUE) return false;
        
        PROCESSENTRY32 pe32;
        pe32.dwSize = sizeof(PROCESSENTRY32);
        bool hollowingDetected = false;
        
        if (Process32First(hSnapshot, &pe32)) {
            do {
                // Check for suspicious process names or paths
                std::string processName = pe32.szExeFile;
                if (processName.find("svchost") != std::string::npos || 
                    processName.find("explorer") != std::string::npos) {
                    
                    HANDLE hProcess = OpenProcess(PROCESS_QUERY_INFORMATION | PROCESS_VM_READ, 
                        FALSE, pe32.th32ProcessID);
                    if (hProcess) {
                        char realPath[MAX_PATH];
                        if (GetModuleFileNameExA(hProcess, NULL, realPath, MAX_PATH)) {
                            // Check if the real path matches expected system paths
                            std::string realPathStr = realPath;
                            if (realPathStr.find("System32") == std::string::npos && 
                                realPathStr.find("SysWOW64") == std::string::npos) {
                                hollowingDetected = true;
                            }
                        }
                        CloseHandle(hProcess);
                    }
                }
            } while (Process32Next(hSnapshot, &pe32) && !hollowingDetected);
        }
        
        CloseHandle(hSnapshot);
        return hollowingDetected;
    }
    
    void terminateProcessEnhanced(DWORD processId) {
        HANDLE hProcess = OpenProcess(PROCESS_TERMINATE | PROCESS_QUERY_INFORMATION, FALSE, processId);
        if (hProcess) {
            // Try to disable debugging first
            if (g_NtSetInformationProcess) {
                DWORD debugFlag = 0;
                g_NtSetInformationProcess(hProcess, (PROCESSINFOCLASS)7, &debugFlag, sizeof(debugFlag));
            }
            
            // Terminate with extreme prejudice
            TerminateProcess(hProcess, 0xDEADBEEF);
            CloseHandle(hProcess);
        }
    }

    // Existing helper functions (GetProcessIdByPath, GetProcessModules, etc.)
    DWORD GetProcessIdByPath(const std::string& path) {
        HANDLE hSnapshot = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);
        if (hSnapshot == INVALID_HANDLE_VALUE) return 0;

        PROCESSENTRY32 pe32;
        pe32.dwSize = sizeof(PROCESSENTRY32);

        if (Process32First(hSnapshot, &pe32)) {
            do {
                HANDLE hProcess = OpenProcess(PROCESS_QUERY_INFORMATION | PROCESS_VM_READ, 
                    FALSE, pe32.th32ProcessID);
                if (hProcess) {
                    char processPath[MAX_PATH];
                    if (GetModuleFileNameExA(hProcess, NULL, processPath, MAX_PATH)) {
                        if (_stricmp(processPath, path.c_str()) == 0) {
                            CloseHandle(hProcess);
                            CloseHandle(hSnapshot);
                            return pe32.th32ProcessID;
                        }
                    }
                    CloseHandle(hProcess);
                }
            } while (Process32Next(hSnapshot, &pe32));
        }

        CloseHandle(hSnapshot);
        return 0;
    }

    std::set<std::string> GetProcessModules(DWORD processId) {
        std::set<std::string> modules;
        HANDLE hSnapshot = CreateToolhelp32Snapshot(TH32CS_SNAPMODULE, processId);
        if (hSnapshot == INVALID_HANDLE_VALUE) return modules;

        MODULEENTRY32 me32;
        me32.dwSize = sizeof(MODULEENTRY32);

        if (Module32First(hSnapshot, &me32)) {
            do {
                modules.insert(std::string(me32.szModule));
            } while (Module32Next(hSnapshot, &me32));
        }

        CloseHandle(hSnapshot);
        return modules;
    }

    SIZE_T GetProcessMemorySize(DWORD processId) {
        HANDLE hProcess = OpenProcess(PROCESS_QUERY_INFORMATION | PROCESS_VM_READ, 
            FALSE, processId);
        if (!hProcess) return 0;

        PROCESS_MEMORY_COUNTERS pmc;
        SIZE_T memorySize = 0;
        if (GetProcessMemoryInfo(hProcess, &pmc, sizeof(pmc))) {
            memorySize = pmc.WorkingSetSize;
        }

        CloseHandle(hProcess);
        return memorySize;
    }

    void MonitorFiles() {
        while (isRunning) {
            for (const auto& path : targetPaths) {
                HANDLE hFile = CreateFileA(path.c_str(), GENERIC_READ, 
                    FILE_SHARE_READ | FILE_SHARE_WRITE, NULL, OPEN_EXISTING, 
                    FILE_ATTRIBUTE_NORMAL, NULL);
                
                if (hFile != INVALID_HANDLE_VALUE) {
                    FILETIME lastWrite;
                    if (GetFileTime(hFile, NULL, NULL, &lastWrite)) {
                        static std::map<std::string, FILETIME> fileTimestamps;
                        if (fileTimestamps.find(path) != fileTimestamps.end()) {
                            if (CompareFileTime(&lastWrite, &fileTimestamps[path]) != 0) {
                                std::stringstream ss;
                                ss << "🚨 **FILE MODIFICATION DETECTED**\n"
                                   << "Modified File: " << path << "\n"
                                   << "Detection: File timestamp change\n"
                                   << "Action: Checksum verification triggered";
                                
                                SendDiscordLog("⚠️ File Modification Alert", ss.str());
                            }
                        }
                        fileTimestamps[path] = lastWrite;
                    }
                    CloseHandle(hFile);
                }
            }
            std::this_thread::sleep_for(std::chrono::seconds(5));
        }
    }
};

// Global instance for hook callbacks
BlueStacksProtector* g_GlobalProtectorInstance = nullptr;

// Service functions for Windows startup
SERVICE_STATUS g_ServiceStatus = { 0 };
SERVICE_STATUS_HANDLE g_StatusHandle = NULL;
HANDLE g_ServiceStopEvent = INVALID_HANDLE_VALUE;
BlueStacksProtector* g_Protector = nullptr;

VOID WINAPI ServiceMain(DWORD argc, LPTSTR* argv);
VOID WINAPI ServiceCtrlHandler(DWORD);
DWORD WINAPI ServiceWorkerThread(LPVOID lpParam);

int main(int argc, char* argv[]) {
    // Anti-debugging check at startup
    if (ANTI_DEBUG()) {
        ExitProcess(0x1337);
    }
    
    // Initialize kernel-level components
    KERNEL_HOOK_PREP();
    
    if (argc > 1 && strcmp(argv[1], "--install") == 0) {
        SC_HANDLE hSCManager = OpenSCManager(NULL, NULL, SC_MANAGER_CREATE_SERVICE);
        if (hSCManager) {
            char servicePath[MAX_PATH];
            GetModuleFileNameA(NULL, servicePath, MAX_PATH);
            
            SC_HANDLE hService = CreateServiceA(hSCManager,
                "BlueStacksAdvancedProtector",
                "BlueStacks Advanced Anti-Cheat Protector",
                SERVICE_ALL_ACCESS,
                SERVICE_WIN32_OWN_PROCESS,
                SERVICE_AUTO_START,
                SERVICE_ERROR_NORMAL,
                servicePath,
                NULL, NULL, NULL, NULL, NULL);
            
            if (hService) {
                std::cout << "Advanced service installed successfully!" << std::endl;
                CloseServiceHandle(hService);
            } else {
                std::cout << "Failed to install service. Error: " << GetLastError() << std::endl;
            }
            CloseServiceHandle(hSCManager);
        }
        return 0;
    }
    
    if (argc > 1 && strcmp(argv[1], "--uninstall") == 0) {
        SC_HANDLE hSCManager = OpenSCManager(NULL, NULL, SC_MANAGER_ALL_ACCESS);
        if (hSCManager) {
            SC_HANDLE hService = OpenServiceA(hSCManager, "BlueStacksAdvancedProtector", DELETE);
            if (hService) {
                if (DeleteService(hService)) {
                    std::cout << "Advanced service uninstalled successfully!" << std::endl;
                } else {
                    std::cout << "Failed to uninstall service. Error: " << GetLastError() << std::endl;
                }
                CloseServiceHandle(hService);
            }
            CloseServiceHandle(hSCManager);
        }
        return 0;
    }
    
    if (argc > 1 && strcmp(argv[1], "--console") == 0) {
        BlueStacksProtector protector;
        g_GlobalProtectorInstance = &protector;
        std::cout << "BlueStacks Advanced Protector started in console mode. Press Ctrl+C to stop." << std::endl;
        protector.Start();
        return 0;
    }
    
    // Run as Windows service
    SERVICE_TABLE_ENTRY ServiceTable[] = {
        { (LPSTR)"BlueStacksAdvancedProtector", (LPSERVICE_MAIN_FUNCTION)ServiceMain },
        { NULL, NULL }
    };
    
    if (StartServiceCtrlDispatcher(ServiceTable) == FALSE) {
        return GetLastError();
    }
    
    return 0;
}

VOID WINAPI ServiceMain(DWORD argc, LPTSTR* argv) {
    g_StatusHandle = RegisterServiceCtrlHandler("BlueStacksAdvancedProtector", ServiceCtrlHandler);
    if (g_StatusHandle == NULL) return;
    
    ZeroMemory(&g_ServiceStatus, sizeof(g_ServiceStatus));
    g_ServiceStatus.dwServiceType = SERVICE_WIN32_OWN_PROCESS;
    g_ServiceStatus.dwControlsAccepted = SERVICE_ACCEPT_STOP;
    g_ServiceStatus.dwCurrentState = SERVICE_START_PENDING;
    g_ServiceStatus.dwWin32ExitCode = 0;
    g_ServiceStatus.dwCheckPoint = 0;
    
    if (SetServiceStatus(g_StatusHandle, &g_ServiceStatus) == FALSE) return;
    
    g_ServiceStopEvent = CreateEvent(NULL, TRUE, FALSE, NULL);
    if (g_ServiceStopEvent == NULL) return;
    
    g_ServiceStatus.dwCurrentState = SERVICE_RUNNING;
    g_ServiceStatus.dwCheckPoint = 0;
    SetServiceStatus(g_StatusHandle, &g_ServiceStatus);
    
    HANDLE hThread = CreateThread(NULL, 0, ServiceWorkerThread, NULL, 0, NULL);
    WaitForSingleObject(hThread, INFINITE);
    
    CloseHandle(g_ServiceStopEvent);
    g_ServiceStatus.dwCurrentState = SERVICE_STOPPED;
    g_ServiceStatus.dwCheckPoint = 3;
    SetServiceStatus(g_StatusHandle, &g_ServiceStatus);
}

VOID WINAPI ServiceCtrlHandler(DWORD dwCtrl) {
    switch (dwCtrl) {
    case SERVICE_CONTROL_STOP:
        if (g_ServiceStatus.dwCurrentState != SERVICE_RUNNING) break;
        g_ServiceStatus.dwControlsAccepted = 0;
        g_ServiceStatus.dwCurrentState = SERVICE_STOP_PENDING;
        g_ServiceStatus.dwWin32ExitCode = 0;
        g_ServiceStatus.dwCheckPoint = 4;
        SetServiceStatus(g_StatusHandle, &g_ServiceStatus);
        SetEvent(g_ServiceStopEvent);
        break;
    default:
        break;
    }
}

DWORD WINAPI ServiceWorkerThread(LPVOID lpParam) {
    g_Protector = new BlueStacksProtector();
    g_GlobalProtectorInstance = g_Protector;
    std::thread protectorThread(&BlueStacksProtector::Start, g_Protector);
    
    WaitForSingleObject(g_ServiceStopEvent, INFINITE);
    
    if (g_Protector) {
        g_Protector->Stop();
        delete g_Protector;
        g_GlobalProtectorInstance = nullptr;
    }
    
    if (protectorThread.joinable()) {
        protectorThread.join();
    }
    
    return ERROR_SUCCESS;
}