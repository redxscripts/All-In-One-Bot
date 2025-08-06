# Makefile for BlueStacks Protector
# For use with MinGW-w64 or similar on Windows

CXX = g++
CXXFLAGS = -std=c++17 -Wall -Wextra -O2
TARGET = BlueStacksProtector.exe
SOURCE = BlueStacksProtector.cpp
LIBS = -lwinhttp -lpsapi -ladvapi32 -lkernel32 -luser32

# Default target
all: $(TARGET)

# Build the executable
$(TARGET): $(SOURCE)
	$(CXX) $(CXXFLAGS) -o $(TARGET) $(SOURCE) $(LIBS)

# Clean build artifacts
clean:
	del $(TARGET) 2>nul || true

# Install the service (requires admin privileges)
install: $(TARGET)
	copy $(TARGET) "C:\BlueStacksProtector\"
	$(TARGET) --install
	net start BlueStacksProtector

# Uninstall the service
uninstall:
	net stop BlueStacksProtector 2>nul || true
	"C:\BlueStacksProtector\$(TARGET)" --uninstall 2>nul || true
	del "C:\BlueStacksProtector\$(TARGET)" 2>nul || true

# Run in console mode for testing
test: $(TARGET)
	$(TARGET) --console

.PHONY: all clean install uninstall test