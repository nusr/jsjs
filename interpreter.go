package main

import "fmt"

type Interpreter struct {
	environment *Environment
	globals     *Environment
}

func NewInterpreter() *Interpreter {
	environment := NewEnvironment(nil)
	return &Interpreter{
		environment: environment,
		globals:     environment,
	}
}

func (interpreter *Interpreter) execute(statement Statement) LiteralType {
	return statement.accept(interpreter)
}

func (interpreter *Interpreter) evaluate(expression Expression) LiteralType {
	return expression.accept(interpreter)
}

func (interpreter *Interpreter) Interpret(list []Statement) {
	for _, item := range list {
		fmt.Println(interpreter.execute(item))
	}
}
