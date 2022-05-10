cmake_minimum_required(VERSION 3.5)

set(CMAKE_C_STANDARD 99)
set(CMAKE_C_STANDARD_REQUIRED ON)
set(CMAKE_C_EXTENSIONS OFF)

# output build progress log
# set(CMAKE_VERBOSE_MAKEFILE ON)

if (NOT CMAKE_BUILD_TYPE)
   set (CMAKE_BUILD_TYPE "Release")
endif ()

message("CMAKE_BUILD_TYPE: ${CMAKE_BUILD_TYPE}")

if( CMAKE_BUILD_TYPE STREQUAL "Debug")
    set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_SOURCE_DIR}/build/Debug)
elseif( CMAKE_BUILD_TYPE STREQUAL "Release")
    set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_SOURCE_DIR}/build/Release)
else()
    MESSAGE( STATUS "CMAKE_BUILD_TYPE not set yet ${CMAKE_BUILD_TYPE}" )
endif()


project(clox)

# compiling options
add_compile_options(
    -Wall 
    -Wextra 
    -Wno-unused-parameter
    # -Werror
)

aux_source_directory(./c SOURCE_DIRECTORY)

add_executable(clox ${SOURCE_DIRECTORY})