package main

func interpret(source string, environment *Environment) {
	scanner := NewScanner(source)
	tokens := scanner.ScanTokens()

	parser := NewParser(tokens)
	statements := parser.Parse()

	interpreter := NewInterpreter(environment)
	interpreter.Interpret(statements)

	scanner = nil
	parser = nil
	interpreter = nil
}
