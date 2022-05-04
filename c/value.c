#include <stdio.h>
#include <stdlib.h>
#include "value.h"
#include "memory.h"

void initValueArray(ValueArray *array)
{
  array->capacity = 0;
  array->count = 0;
  array->values = NULL;
}
void writeValueArray(ValueArray *array, Value value)
{
  if (array->capacity < array->count + 1)
  {
    int oldCapacity = array->capacity;
    array->capacity = GROW_CAPACITY(array->capacity);
    array->values = GROW_ARRAY(Value, array->values, oldCapacity, array->capacity);
  }
  array->values[array->count] = value;
  array->count++;
}
void freeValueArray(ValueArray *array)
{

  GROW_ARRAY(Value, array->values, array->capacity, 0);
  initValueArray(array);
}
void printValue(Value value)
{
  printf("%g\n", value);
}