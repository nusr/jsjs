#ifndef clox_vm_h
#define clox_vm_h

#include "common.h"
#include "value.h"
#define STACK_MAX 1024

typedef enum
{
  INTERPRET_OK,
  INTERPRET_COMPILE_ERROR,
  INTERPRET_RUNTIME_ERROR,
} InterpretResult;

typedef struct
{
  Value stack[STACK_MAX];
  Value *stackTop;
} VM;

VM vm;

void initVM();
void freeVM();
InterpretResult interpret(const char *source);
void push(Value value);
Value pop();

#endif