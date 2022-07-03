package main

import "time"

type BaseCallable interface {
	size() int
	call(interpreter *Interpreter, params []any) any
	String() string
}

type GlobalClock struct {
	value time.Time
}

func (globalClock GlobalClock) size() int {
	return 0
}

func (globalClock GlobalClock) call(interpreter *Interpreter, params []any) any {
	return time.Now().UnixMilli()
}

func (globalClock GlobalClock) String() string {
	return "<native fn>"
}
