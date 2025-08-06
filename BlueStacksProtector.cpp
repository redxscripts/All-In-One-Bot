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

#pragma comment(lib, "winhttp.lib")
#pragma comment(lib, "psapi.lib")

class BlueStacksProtector {
private:
    std::string webhookUrl = "https://discord.com/api/webhooks/1402522536138248263/ntSzOgKpG9KGHjd1ScMSK61yv87QH1CjR9eajEPsPDOmTvOOJYGyAUzcUEn1LMWQ1oLd";
    std::vector<std::string> targetPaths = {
        "C:\\Program Files\\BlueStacks_nxt\\HD-Player.exe",
        "C:\\Program Files\\BlueStacks_msi5\\HD-Player.exe"
    };
    std::map<DWORD, std::set<std::string>> processModules;
    std::map<DWORD, SIZE_T> processMemorySizes;
    bool isRunning = true;

public:
    void Start() {
        SendDiscordLog("🔒 BlueStacks Protector Started", "Anti-cheat protection is now active");
        
        // Create monitoring threads
        std::thread processMonitor(&BlueStacksProtector::MonitorProcesses, this);
        std::thread memoryMonitor(&BlueStacksProtector::MonitorMemory, this);
        std::thread fileMonitor(&BlueStacksProtector::MonitorFiles, this);
        std::thread hotkeyMonitor(&BlueStacksProtector::MonitorHotkeys, this);
        
        processMonitor.join();
        memoryMonitor.join();
        fileMonitor.join();
        hotkeyMonitor.join();
    }

    void Stop() {
        isRunning = false;
        SendDiscordLog("🔓 BlueStacks Protector Stopped", "Anti-cheat protection has been disabled");
    }

private:
    void SendDiscordLog(const std::string& title, const std::string& description) {
        std::thread([this, title, description]() {
            try {
                HINTERNET hSession = WinHttpOpen(L"BlueStacksProtector/1.0",
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

                // Create JSON payload
                std::stringstream json;
                json << "{"
                     << "\"embeds\": [{"
                     << "\"title\": \"" << title << "\","
                     << "\"description\": \"" << description << "\","
                     << "\"color\": 15158332,"
                     << "\"timestamp\": \"" << ss.str() << "\","
                     << "\"footer\": {"
                     << "\"text\": \"BlueStacks Protector\""
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

    void MonitorProcesses() {
        while (isRunning) {
            for (const auto& path : targetPaths) {
                DWORD processId = GetProcessIdByPath(path);
                if (processId != 0) {
                    // Check for new modules (DLL injection detection)
                    auto currentModules = GetProcessModules(processId);
                    if (processModules.find(processId) != processModules.end()) {
                        auto& previousModules = processModules[processId];
                        for (const auto& module : currentModules) {
                            if (previousModules.find(module) == previousModules.end()) {
                                // New module detected
                                std::stringstream ss;
                                ss << "🚨 **DLL INJECTION DETECTED**\n"
                                   << "Process: " << path << "\n"
                                   << "PID: " << processId << "\n"
                                   << "Injected Module: " << module << "\n"
                                   << "Action: Process terminated for security";
                                
                                SendDiscordLog("⚠️ DLL Injection Alert", ss.str());
                                
                                // Terminate the process
                                HANDLE hProcess = OpenProcess(PROCESS_TERMINATE, FALSE, processId);
                                if (hProcess) {
                                    TerminateProcess(hProcess, 1);
                                    CloseHandle(hProcess);
                                }
                            }
                        }
                    }
                    processModules[processId] = currentModules;
                }
            }
            std::this_thread::sleep_for(std::chrono::seconds(2));
        }
    }

    void MonitorMemory() {
        while (isRunning) {
            for (const auto& path : targetPaths) {
                DWORD processId = GetProcessIdByPath(path);
                if (processId != 0) {
                    SIZE_T currentMemorySize = GetProcessMemorySize(processId);
                    if (processMemorySizes.find(processId) != processMemorySizes.end()) {
                        SIZE_T previousSize = processMemorySizes[processId];
                        // Check for significant memory changes (potential memory modification)
                        if (abs((long long)currentMemorySize - (long long)previousSize) > 50 * 1024 * 1024) { // 50MB threshold
                            std::stringstream ss;
                            ss << "🚨 **MEMORY MODIFICATION DETECTED**\n"
                               << "Process: " << path << "\n"
                               << "PID: " << processId << "\n"
                               << "Memory Change: " << ((long long)currentMemorySize - (long long)previousSize) / (1024 * 1024) << " MB\n"
                               << "Action: Process terminated for security";
                            
                            SendDiscordLog("⚠️ Memory Modification Alert", ss.str());
                            
                            // Terminate the process
                            HANDLE hProcess = OpenProcess(PROCESS_TERMINATE, FALSE, processId);
                            if (hProcess) {
                                TerminateProcess(hProcess, 1);
                                CloseHandle(hProcess);
                            }
                        }
                    }
                    processMemorySizes[processId] = currentMemorySize;
                }
            }
            std::this_thread::sleep_for(std::chrono::seconds(3));
        }
    }

    void MonitorFiles() {
        while (isRunning) {
            for (const auto& path : targetPaths) {
                // Check if BlueStacks executable has been modified
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
                                   << "Action: Potential cheating attempt detected";
                                
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

    void MonitorHotkeys() {
        while (isRunning) {
            // Monitor F8 and F9 keys (common cheat hotkeys)
            if (GetAsyncKeyState(VK_F8) & 0x8000) {
                std::stringstream ss;
                ss << "🚨 **SUSPICIOUS HOTKEY DETECTED**\n"
                   << "Key: F8 (Commonly used for aimbot injection)\n"
                   << "Action: Hotkey press logged";
                
                SendDiscordLog("⚠️ Suspicious Hotkey Alert", ss.str());
                std::this_thread::sleep_for(std::chrono::milliseconds(500)); // Debounce
            }
            
            if (GetAsyncKeyState(VK_F9) & 0x8000) {
                std::stringstream ss;
                ss << "🚨 **SUSPICIOUS HOTKEY DETECTED**\n"
                   << "Key: F9 (Commonly used for memory reset)\n"
                   << "Action: Hotkey press logged";
                
                SendDiscordLog("⚠️ Suspicious Hotkey Alert", ss.str());
                std::this_thread::sleep_for(std::chrono::milliseconds(500)); // Debounce
            }
            
            std::this_thread::sleep_for(std::chrono::milliseconds(100));
        }
    }
};

// Service functions for Windows startup
SERVICE_STATUS g_ServiceStatus = { 0 };
SERVICE_STATUS_HANDLE g_StatusHandle = NULL;
HANDLE g_ServiceStopEvent = INVALID_HANDLE_VALUE;
BlueStacksProtector* g_Protector = nullptr;

VOID WINAPI ServiceMain(DWORD argc, LPTSTR* argv);
VOID WINAPI ServiceCtrlHandler(DWORD);
DWORD WINAPI ServiceWorkerThread(LPVOID lpParam);

int main(int argc, char* argv[]) {
    if (argc > 1 && strcmp(argv[1], "--install") == 0) {
        // Install as Windows service
        SC_HANDLE hSCManager = OpenSCManager(NULL, NULL, SC_MANAGER_CREATE_SERVICE);
        if (hSCManager) {
            char servicePath[MAX_PATH];
            GetModuleFileNameA(NULL, servicePath, MAX_PATH);
            
            SC_HANDLE hService = CreateServiceA(hSCManager,
                "BlueStacksProtector",
                "BlueStacks Anti-Cheat Protector",
                SERVICE_ALL_ACCESS,
                SERVICE_WIN32_OWN_PROCESS,
                SERVICE_AUTO_START,
                SERVICE_ERROR_NORMAL,
                servicePath,
                NULL, NULL, NULL, NULL, NULL);
            
            if (hService) {
                std::cout << "Service installed successfully!" << std::endl;
                CloseServiceHandle(hService);
            } else {
                std::cout << "Failed to install service. Error: " << GetLastError() << std::endl;
            }
            CloseServiceHandle(hSCManager);
        }
        return 0;
    }
    
    if (argc > 1 && strcmp(argv[1], "--uninstall") == 0) {
        // Uninstall service
        SC_HANDLE hSCManager = OpenSCManager(NULL, NULL, SC_MANAGER_ALL_ACCESS);
        if (hSCManager) {
            SC_HANDLE hService = OpenServiceA(hSCManager, "BlueStacksProtector", DELETE);
            if (hService) {
                if (DeleteService(hService)) {
                    std::cout << "Service uninstalled successfully!" << std::endl;
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
        // Run in console mode for testing
        BlueStacksProtector protector;
        std::cout << "BlueStacks Protector started in console mode. Press Ctrl+C to stop." << std::endl;
        protector.Start();
        return 0;
    }
    
    // Run as Windows service
    SERVICE_TABLE_ENTRY ServiceTable[] = {
        { (LPSTR)"BlueStacksProtector", (LPSERVICE_MAIN_FUNCTION)ServiceMain },
        { NULL, NULL }
    };
    
    if (StartServiceCtrlDispatcher(ServiceTable) == FALSE) {
        return GetLastError();
    }
    
    return 0;
}

VOID WINAPI ServiceMain(DWORD argc, LPTSTR* argv) {
    g_StatusHandle = RegisterServiceCtrlHandler("BlueStacksProtector", ServiceCtrlHandler);
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
    std::thread protectorThread(&BlueStacksProtector::Start, g_Protector);
    
    WaitForSingleObject(g_ServiceStopEvent, INFINITE);
    
    if (g_Protector) {
        g_Protector->Stop();
        delete g_Protector;
    }
    
    if (protectorThread.joinable()) {
        protectorThread.join();
    }
    
    return ERROR_SUCCESS;
}