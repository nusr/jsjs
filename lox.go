package main

func interpret(source string) {
	scanner := NewScanner(source)
	scanner.ScanTokens()
	// for _, token := range tokens {
	// fmt.Println(token)
	// }
	// parser := NewParser(tokens)
	// statements := parser.Parse()
	// for _, statement := range statements {
	// 	fmt.Println(statement)
	// }
}
