package main

import "fmt"

func interpret(source string) {
	scanner := NewScanner(source)
	tokens := scanner.ScanTokens()
	for _, token := range tokens {
		fmt.Println(token)
	}
	parser := NewParser(tokens)
	statements := parser.Parse()
	interpreter := NewInterpreter()
	interpreter.Interpret(statements)
}
