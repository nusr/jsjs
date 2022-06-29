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

func (callable *Callable) call(interpreter *Interpreter, params []LiteralType) LiteralType {
	env := NewEnvironment(interpreter.globals)
	for i, item := range callable.declaration.params {
		env.define(item.lexeme, params[i])
	}
	interpreter.executeBlock(callable.declaration.body, env)
	return nil
}

func (callable *Callable) String() string {
	return fmt.Sprintf("<Fun %s>", callable.declaration.name.lexeme)
}
