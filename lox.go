package main

func interpret(source string) {
	scanner := NewScanner(source)
	tokens := scanner.ScanTokens()
	parser := NewParser(tokens)
	statements := parser.Parse()
	interpreter := NewInterpreter()
	interpreter.Interpret(statements)
}
