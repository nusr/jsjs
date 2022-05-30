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
	for _, statement := range statements {
		fmt.Println(statement)
	}
}
