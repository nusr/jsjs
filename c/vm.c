#include "vm.h"
#include "compiler.h"

void initVM()
{
  vm.stackTop = vm.stack;
}
void freeVM()
{
}
InterpretResult interpret(const char *source)
{
  compile(source);
  return INTERPRET_OK;
}
void push(Value value)
{
  *vm.stackTop = value;
  vm.stackTop++;
}
Value pop()
{
  vm.stackTop--;
  return *vm.stackTop;
}
