gcc  -std=c99 -Wall -Wextra -Wno-unused-parameter -g   -c D:\work\compiler\c\chunk.c -o D:\work\compiler\build\debug\chunk.o
gcc  -std=c99 -Wall -Wextra -Wno-unused-parameter -g   -c D:\work\compiler\c\compiler.c -o D:\work\compiler\build\debug\compiler.o
gcc  -std=c99 -Wall -Wextra -Wno-unused-parameter -g   -c D:\work\compiler\c\debug.c -o D:\work\compiler\build\debug\debug.o
gcc  -std=c99 -Wall -Wextra -Wno-unused-parameter -g   -c D:\work\compiler\c\main.c -o D:\work\compiler\build\debug\main.o
gcc  -std=c99 -Wall -Wextra -Wno-unused-parameter -g   -c D:\work\compiler\c\memory.c -o D:\work\compiler\build\debug\memory.o
gcc  -std=c99 -Wall -Wextra -Wno-unused-parameter -g   -c D:\work\compiler\c\scanner.c -o D:\work\compiler\build\debug\scanner.o
gcc  -std=c99 -Wall -Wextra -Wno-unused-parameter -g   -c D:\work\compiler\c\value.c -o D:\work\compiler\build\debug\value.o
gcc  -std=c99 -Wall -Wextra -Wno-unused-parameter -g   -c D:\work\compiler\c\vm.c -o D:\work\compiler\build\debug\vm.o
gcc -o D:\work\compiler\build\debug\clox.exe D:\work\compiler\build\debug\chunk.o D:\work\compiler\build\debug\compiler.o D:\work\compiler\build\debug\debug.o D:\work\compiler\build\debug\main.o D:\work\compiler\build\debug\memory.o D:\work\compiler\build\debug\scanner.o D:\work\compiler\build\debug\value.o D:\work\compiler\build\debug\vm.o
D:\work\compiler\build\debug\clox.exe