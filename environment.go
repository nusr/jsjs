package main

import "fmt"

type Environment struct {
	parent *Environment
	values map[string]LiteralType
}

func NewEnvironment(parent *Environment) *Environment {
	values := make(map[string]LiteralType)
	return &Environment{
		parent: parent,
		values: values,
	}
}

func (environment *Environment) get(name *Token) LiteralType {
	if val, ok := environment.values[name.lexeme]; ok {
		return val
	}
	if environment.parent != nil {
		return environment.parent.get(name)
	}
	panic(fmt.Sprintf("%s is not defined", name.lexeme))
}
func (environment *Environment) define(name string, value LiteralType) {
	environment.values[name] = value
}

func (environment *Environment) assign(name *Token, value LiteralType) {
	if _, ok := environment.values[name.lexeme]; ok {
		environment.define(name.lexeme, value)
		return
	}
	if environment.parent != nil {
		environment.parent.assign(name, value)
		return
	}
	panic(fmt.Sprintf("%s is not defined", name.lexeme))
}
