#pragma once

#ifndef KERNEL_DRIVER_H
#define KERNEL_DRIVER_H

#ifdef __cplusplus
extern "C" {
#endif

// Kernel driver definitions for BlueStacks Advanced Protector
// This header defines the interface for a future kernel-mode driver

#include <ntdef.h>
#include <ntifs.h>
#include <ntddk.h>

// Driver constants
#define DRIVER_NAME L"BlueStacksKernelProtector"
#define DEVICE_NAME L"\\Device\\BSProtector"
#define SYMBOLIC_LINK L"\\DosDevices\\BSProtector"

// IOCTL codes for communication with user-mode
#define IOCTL_REGISTER_PROCESS    CTL_CODE(FILE_DEVICE_UNKNOWN, 0x800, METHOD_BUFFERED, FILE_ANY_ACCESS)
#define IOCTL_UNREGISTER_PROCESS  CTL_CODE(FILE_DEVICE_UNKNOWN, 0x801, METHOD_BUFFERED, FILE_ANY_ACCESS)
#define IOCTL_GET_PROCESS_INFO    CTL_CODE(FILE_DEVICE_UNKNOWN, 0x802, METHOD_BUFFERED, FILE_ANY_ACCESS)
#define IOCTL_ENABLE_PROTECTION   CTL_CODE(FILE_DEVICE_UNKNOWN, 0x803, METHOD_BUFFERED, FILE_ANY_ACCESS)
#define IOCTL_DISABLE_PROTECTION  CTL_CODE(FILE_DEVICE_UNKNOWN, 0x804, METHOD_BUFFERED, FILE_ANY_ACCESS)

// Structures for kernel-user communication
typedef struct _PROTECTED_PROCESS_INFO {
    ULONG ProcessId;
    WCHAR ProcessName[256];
    WCHAR ProcessPath[512];
    LARGE_INTEGER CreationTime;
    BOOLEAN IsProtected;
    ULONG ProtectionFlags;
} PROTECTED_PROCESS_INFO, *PPROTECTED_PROCESS_INFO;

typedef struct _MEMORY_PROTECTION_INFO {
    ULONG ProcessId;
    PVOID BaseAddress;
    SIZE_T RegionSize;
    ULONG Protection;
    ULONG Type;
    BOOLEAN IsModified;
} MEMORY_PROTECTION_INFO, *PMEMORY_PROTECTION_INFO;

typedef struct _DLL_INJECTION_INFO {
    ULONG ProcessId;
    WCHAR ModuleName[256];
    PVOID BaseAddress;
    SIZE_T ImageSize;
    BOOLEAN IsInjected;
    LARGE_INTEGER InjectionTime;
} DLL_INJECTION_INFO, *PDLL_INJECTION_INFO;

// Protection flags
#define PROTECTION_FLAG_MEMORY_MONITOR    0x00000001
#define PROTECTION_FLAG_DLL_MONITOR       0x00000002
#define PROTECTION_FLAG_THREAD_MONITOR    0x00000004
#define PROTECTION_FLAG_HANDLE_MONITOR    0x00000008
#define PROTECTION_FLAG_REGISTRY_MONITOR  0x00000010
#define PROTECTION_FLAG_FILE_MONITOR      0x00000020
#define PROTECTION_FLAG_ALL               0xFFFFFFFF

// Callback structures
typedef struct _PROCESS_NOTIFICATION_DATA {
    ULONG ProcessId;
    ULONG ParentProcessId;
    BOOLEAN IsCreate;
    WCHAR ImageFileName[256];
} PROCESS_NOTIFICATION_DATA, *PPROCESS_NOTIFICATION_DATA;

typedef struct _IMAGE_LOAD_NOTIFICATION_DATA {
    ULONG ProcessId;
    PVOID ImageBase;
    SIZE_T ImageSize;
    WCHAR ImageFileName[512];
    BOOLEAN IsKernelImage;
} IMAGE_LOAD_NOTIFICATION_DATA, *PIMAGE_LOAD_NOTIFICATION_DATA;

// Function declarations for kernel driver (to be implemented)

// Driver entry and unload
NTSTATUS DriverEntry(PDRIVER_OBJECT DriverObject, PUNICODE_STRING RegistryPath);
VOID DriverUnload(PDRIVER_OBJECT DriverObject);

// Device control functions
NTSTATUS CreateDevice(PDRIVER_OBJECT DriverObject);
VOID DeleteDevice(PDRIVER_OBJECT DriverObject);
NTSTATUS DeviceControl(PDEVICE_OBJECT DeviceObject, PIRP Irp);

// Process monitoring functions
NTSTATUS RegisterProcessNotification();
VOID UnregisterProcessNotification();
VOID ProcessNotifyCallback(PEPROCESS Process, HANDLE ProcessId, PPS_CREATE_NOTIFY_INFO CreateInfo);

// Image load monitoring
NTSTATUS RegisterImageLoadNotification();
VOID UnregisterImageLoadNotification();
VOID ImageLoadNotifyCallback(PUNICODE_STRING FullImageName, HANDLE ProcessId, PIMAGE_INFO ImageInfo);

// Memory protection functions
NTSTATUS ProtectProcessMemory(ULONG ProcessId);
NTSTATUS UnprotectProcessMemory(ULONG ProcessId);
BOOLEAN IsMemoryModificationSuspicious(ULONG ProcessId, PVOID Address, SIZE_T Size);

// DLL injection detection
NTSTATUS DetectDllInjection(ULONG ProcessId, PDLL_INJECTION_INFO InjectionInfo);
BOOLEAN IsModuleInjected(PEPROCESS Process, PVOID BaseAddress);

// Anti-debugging functions
NTSTATUS EnableAntiDebugging(ULONG ProcessId);
NTSTATUS DisableAntiDebugging(ULONG ProcessId);
BOOLEAN IsProcessBeingDebugged(PEPROCESS Process);

// Registry protection
NTSTATUS RegisterRegistryCallback();
VOID UnregisterRegistryCallback();
NTSTATUS RegistryNotifyCallback(PVOID CallbackContext, PVOID Argument1, PVOID Argument2);

// File system protection
NTSTATUS RegisterFileSystemCallback();
VOID UnregisterFileSystemCallback();
FLT_PREOP_CALLBACK_STATUS FileSystemPreOperationCallback(
    PFLT_CALLBACK_DATA Data,
    PCFLT_RELATED_OBJECTS FltObjects,
    PVOID* CompletionContext
);

// Utility functions
NTSTATUS GetProcessNameById(ULONG ProcessId, PUNICODE_STRING ProcessName);
NTSTATUS GetProcessPathById(ULONG ProcessId, PUNICODE_STRING ProcessPath);
BOOLEAN IsTargetProcess(PUNICODE_STRING ProcessPath);
NTSTATUS LogSecurityEvent(PCWSTR EventType, PCWSTR Description);

// Memory management
PVOID AllocateMemory(SIZE_T Size, ULONG Tag);
VOID FreeMemory(PVOID Address);

// Synchronization
NTSTATUS InitializeLocks();
VOID CleanupLocks();

// Global variables (to be defined in driver implementation)
extern PDRIVER_OBJECT g_DriverObject;
extern PDEVICE_OBJECT g_DeviceObject;
extern UNICODE_STRING g_DeviceName;
extern UNICODE_STRING g_SymbolicLink;
extern FAST_MUTEX g_ProcessListMutex;
extern LIST_ENTRY g_ProtectedProcessList;

// Macros for kernel development
#define BS_POOL_TAG 'SBtP'  // 'PtBS' in little endian
#define LOG_PREFIX "[BSKernelProtector] "

#define BSLog(format, ...) \
    DbgPrintEx(DPFLTR_IHVDRIVER_ID, DPFLTR_INFO_LEVEL, LOG_PREFIX format, __VA_ARGS__)

#define BSLogError(format, ...) \
    DbgPrintEx(DPFLTR_IHVDRIVER_ID, DPFLTR_ERROR_LEVEL, LOG_PREFIX "ERROR: " format, __VA_ARGS__)

#define BSLogWarning(format, ...) \
    DbgPrintEx(DPFLTR_IHVDRIVER_ID, DPFLTR_WARNING_LEVEL, LOG_PREFIX "WARNING: " format, __VA_ARGS__)

// Inline helper functions
__forceinline BOOLEAN IsKernelAddress(PVOID Address) {
    return (ULONG_PTR)Address >= (ULONG_PTR)MmSystemRangeStart;
}

__forceinline BOOLEAN IsValidProcessId(ULONG ProcessId) {
    return (ProcessId > 0) && (ProcessId < 0xFFFFFFFF);
}

// Status codes
#define STATUS_BS_PROCESS_NOT_FOUND         ((NTSTATUS)0xE0000001L)
#define STATUS_BS_ALREADY_PROTECTED         ((NTSTATUS)0xE0000002L)
#define STATUS_BS_NOT_PROTECTED             ((NTSTATUS)0xE0000003L)
#define STATUS_BS_INJECTION_DETECTED        ((NTSTATUS)0xE0000004L)
#define STATUS_BS_MEMORY_MODIFIED           ((NTSTATUS)0xE0000005L)
#define STATUS_BS_DEBUGGING_DETECTED        ((NTSTATUS)0xE0000006L)

#ifdef __cplusplus
}
#endif

#endif // KERNEL_DRIVER_H

/*
 * BlueStacks Kernel-Mode Driver Development Notes:
 * 
 * To implement this kernel driver:
 * 
 * 1. Install Windows Driver Kit (WDK)
 * 2. Create a new Kernel Mode Driver project in Visual Studio
 * 3. Implement the functions declared in this header
 * 4. Build and sign the driver
 * 5. Test with Windows Driver Verifier
 * 
 * Key security features to implement:
 * - Process notification callbacks for monitoring BlueStacks processes
 * - Image load notifications to detect DLL injections
 * - Memory protection through page fault handling
 * - Registry callbacks to prevent tampering with BlueStacks settings
 * - File system mini-filter to protect BlueStacks files
 * - Anti-debugging measures at kernel level
 * 
 * The driver should communicate with the user-mode protector through
 * DeviceIoControl calls using the defined IOCTL codes.
 */