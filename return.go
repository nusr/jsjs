package main

import "fmt"

type ReturnValue struct {
	value any
}

func NewReturnValue(value any) ReturnValue {
	return ReturnValue{
		value: value,
	}
}

func (r ReturnValue) String() string {
	return fmt.Sprintf("return value : %s\n", literalTypeToString(r.value))
}
