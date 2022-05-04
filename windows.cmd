gcc -std=c99 -Wall -Wextra -Wno-unused-parameter -g  -c .\c\compiler.c -o .\c\obj\Debug\compiler.o
gcc -std=c99 -Wall -Wextra -Wno-unused-parameter -g  -c .\c\debug.c -o .\c\obj\Debug\debug.o
gcc -std=c99 -Wall -Wextra -Wno-unused-parameter -g  -c .\c\main.c -o .\c\obj\Debug\main.o
gcc -std=c99 -Wall -Wextra -Wno-unused-parameter -g  -c .\c\memory.c -o .\c\obj\Debug\memory.o
gcc -std=c99 -Wall -Wextra -Wno-unused-parameter -g  -c .\c\scanner.c -o .\c\obj\Debug\scanner.o
gcc -std=c99 -Wall -Wextra -Wno-unused-parameter -g  -c .\c\value.c -o .\c\obj\Debug\value.o
gcc -std=c99 -Wall -Wextra -Wno-unused-parameter -g  -c .\c\vm.c -o .\c\obj\Debug\vm.o
gcc -o .\c\bin\Debug\clox.exe .\c\obj\Debug\compiler.o .\c\obj\Debug\debug.o .\c\obj\Debug\main.o .\c\obj\Debug\memory.o .\c\obj\Debug\scanner.o .\c\obj\Debug\value.o .\c\obj\Debug\vm.o 
.\c\bin\Debug\clox.exe