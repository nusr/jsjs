#ifndef clox_debug_h
#define clox_debug_h

#include "chunk.h"

void disassembleChunk(Chunk *chunk, const char *name);
int disassembleInstruct(Chunk *chunk, int offset);

#endif