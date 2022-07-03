package main

import "time"

func interpret(source string, environment *Environment) {
	scanner := NewScanner(source)
	tokens := scanner.ScanTokens()

	parser := NewParser(tokens)
	statements := parser.Parse()

	environment.define("clock", GlobalClock{value: time.Now()})

	interpreter := NewInterpreter(environment)
	interpreter.Interpret(statements)

	scanner = nil
	parser = nil
	interpreter = nil
}
