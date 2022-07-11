package main

import "time"

func interpret(source string, environment *Environment) {
	scanner := NewScanner(source)
	tokens := scanner.ScanTokens()

	parser := NewParser(tokens)
	statements := parser.Parse()

	environment.define("clock", GlobalClock(time.Now().UnixMilli()))

	interpreter := NewInterpreter(environment)
	interpreter.Interpret(statements)

	scanner = nil
	parser = nil
	interpreter = nil
}
