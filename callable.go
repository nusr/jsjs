package main

import "fmt"

type Callable struct {
	declaration FunctionStatement
}

func NewCallable(declaration FunctionStatement) *Callable {
	return &Callable{
		declaration: declaration,
	}
}

func (callable *Callable) size() int {
	return len(callable.declaration.params)
}

func (callable *Callable) call(interpreter *Interpreter, params []any) any {
	env := NewEnvironment(interpreter.globals)
	for i, item := range callable.declaration.params {
		env.define(item.lexeme, params[i])
	}
	return interpreter.executeBlock(callable.declaration.body, env)
}

func (callable *Callable) String() string {
	return fmt.Sprintf("<Fun %s>", callable.declaration.name.lexeme)
}
