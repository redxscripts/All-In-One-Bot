# BlueStacks Anti-Cheat Protector

A comprehensive anti-cheat protection system for BlueStacks emulators that monitors for memory modifications, DLL injections, file tampering, and suspicious hotkey usage. All security events are automatically logged to Discord via webhook.

## Features

- 🔍 **Process Monitoring**: Continuously monitors BlueStacks processes for unauthorized modifications
- 🛡️ **DLL Injection Detection**: Detects and prevents DLL injections into BlueStacks processes
- 🧠 **Memory Protection**: Monitors for suspicious memory modifications and changes
- 📁 **File Integrity**: Watches for unauthorized modifications to BlueStacks executables
- ⌨️ **Hotkey Detection**: Monitors for common cheat hotkeys (F8, F9)
- 🚀 **Auto-Start**: Runs as a Windows service that starts automatically with the system
- 📊 **Discord Logging**: Sends real-time alerts to Discord webhook
- ⚡ **Multi-threaded**: Efficient monitoring using separate threads for each protection type

## Monitored BlueStacks Versions

- BlueStacks 5 (HD-Player.exe): `C:\Program Files\BlueStacks_nxt\HD-Player.exe`
- BlueStacks MSI: `C:\Program Files\BlueStacks_msi5\HD-Player.exe`

## Requirements

- Windows 10/11
- Visual Studio 2019 or later (with C++ development tools)
- CMake 3.10 or later
- Administrator privileges for installation

## Installation

### Method 1: Automated Installation (Recommended)

1. **Download/Clone** this repository to your Windows machine
2. **Right-click** on `build_and_install.bat` and select **"Run as administrator"**
3. The script will automatically:
   - Build the project
   - Install the service
   - Start protection immediately

### Method 2: Manual Installation

1. **Build the project:**
   ```cmd
   mkdir build
   cd build
   cmake .. -G "Visual Studio 16 2019" -A x64
   cmake --build . --config Release
   ```

2. **Install as Windows service:**
   ```cmd
   BlueStacksProtector.exe --install
   ```

3. **Start the service:**
   ```cmd
   net start BlueStacksProtector
   ```

## Usage Commands

```cmd
# Install as Windows service
BlueStacksProtector.exe --install

# Uninstall the service
BlueStacksProtector.exe --uninstall

# Run in console mode (for testing)
BlueStacksProtector.exe --console

# Check service status
sc query BlueStacksProtector
```

## Discord Webhook Configuration

The tool is pre-configured with your Discord webhook URL. All security events will be sent to:
`https://discord.com/api/webhooks/1402522536138248263/ntSzOgKpG9KGHjd1ScMSK61yv87QH1CjR9eajEPsPDOmTvOOJYGyAUzcUEn1LMWQ1oLd`

### Alert Types

1. **🔒 Service Started/Stopped**: When protection starts or stops
2. **⚠️ DLL Injection Alert**: When unauthorized DLLs are injected
3. **⚠️ Memory Modification Alert**: When suspicious memory changes are detected
4. **⚠️ File Modification Alert**: When BlueStacks executables are tampered with
5. **⚠️ Suspicious Hotkey Alert**: When F8/F9 keys are pressed (common cheat hotkeys)

## How It Works

### DLL Injection Protection
- Continuously scans running BlueStacks processes for loaded modules
- Detects when new DLLs are injected into the process
- Immediately terminates the process if unauthorized injection is detected

### Memory Modification Detection
- Monitors process memory usage patterns
- Triggers alerts on significant memory changes (>50MB threshold)
- Helps detect memory-based cheats like those from Cheat Engine

### File Integrity Monitoring
- Watches BlueStacks executable files for unauthorized modifications
- Detects if someone replaces the original executable with a modified version

### Hotkey Monitoring
- Monitors for F8 and F9 key presses (commonly used for cheat activation)
- Logs suspicious hotkey usage for investigation

## Protection Actions

When a threat is detected, the protector will:
1. **Log the incident** to Discord with detailed information
2. **Terminate the affected process** to prevent cheating
3. **Continue monitoring** for new instances

## Service Management

### Start/Stop Service
```cmd
# Start
net start BlueStacksProtector

# Stop
net stop BlueStacksProtector

# Restart
net stop BlueStacksProtector && net start BlueStacksProtector
```

### Check Service Status
```cmd
sc query BlueStacksProtector
```

### View Service Configuration
```cmd
sc qc BlueStacksProtector
```

## Troubleshooting

### Service Won't Start
1. Ensure you're running as Administrator
2. Check Windows Event Viewer for error details
3. Try running in console mode first: `BlueStacksProtector.exe --console`

### No Discord Messages
1. Verify your Discord webhook URL is correct
2. Check your internet connection
3. Ensure Windows Firewall isn't blocking the application

### BlueStacks Not Detected
1. Verify BlueStacks is installed in the standard locations
2. Check if you're using a different BlueStacks version
3. Modify the `targetPaths` in the source code if needed

## File Structure

```
BlueStacksProtector/
├── BlueStacksProtector.cpp    # Main source code
├── CMakeLists.txt            # Build configuration
├── build_and_install.bat     # Automated installer
└── README.md                 # This file
```

## Technical Details

- **Language**: C++17
- **Platform**: Windows 10/11
- **Architecture**: x64
- **Service Type**: Windows Service (Auto-start)
- **Dependencies**: WinHTTP, PSAPI, AdvAPI32

## Security Features

- Runs with minimal required privileges
- Uses Windows APIs for secure process monitoring
- Encrypted HTTPS communication to Discord
- Thread-safe implementation
- Graceful error handling and recovery

## Limitations

- Requires Administrator privileges for installation
- Only monitors specified BlueStacks versions
- May produce false positives with legitimate software
- Dependent on Windows API availability

## Support

For issues or questions:
1. Check the Discord webhook for real-time logs
2. Run in console mode to see debug output
3. Check Windows Event Viewer for system errors

## License

This software is provided as-is for educational and security purposes.

---

**⚠️ Important**: This tool is designed to protect against cheating in games. Use responsibly and in accordance with your local laws and game terms of service.
