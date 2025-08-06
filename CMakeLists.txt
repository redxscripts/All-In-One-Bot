cmake_minimum_required(VERSION 3.10)
project(BlueStacksProtector)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Set output directory
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin)

# Add executable
add_executable(BlueStacksProtector BlueStacksProtector.cpp)

# Link Windows libraries
target_link_libraries(BlueStacksProtector 
    winhttp
    psapi
    advapi32
    kernel32
    user32
)

# Set Windows subsystem
if(WIN32)
    set_target_properties(BlueStacksProtector PROPERTIES
        WIN32_EXECUTABLE TRUE
    )
endif()

# Compiler specific options
if(MSVC)
    target_compile_options(BlueStacksProtector PRIVATE /W4)
else()
    target_compile_options(BlueStacksProtector PRIVATE -Wall -Wextra -Wpedantic)
endif()