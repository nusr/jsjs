package main

import (
	"fmt"
	"os"
	"strings"
	"unicode"
)

func lowerFistLetter(text string) string {
	list := []rune(text)
	list[0] = unicode.ToLower(list[0])
	return string(list)
}

func defineAST(fileName string, list []string) {
	var result []string
	result = append(result, "package main\n")
	var visitorList []string
	realFileName := lowerFistLetter(fileName)
	for _, item := range list {
		temp := strings.Split(item, "#")
		className := strings.TrimSpace(temp[0])
		params := strings.Split(temp[1], ",")
		name := className + fileName
		receiver := lowerFistLetter(name)
		var paramsList []string
		for _, t := range params {
			data := strings.Split(strings.TrimSpace(t), " ")
			if strings.TrimSpace(data[1]) == "Token" {
				paramsList = append(paramsList, "     "+data[0]+" *Token")
			} else {
				paramsList = append(paramsList, "    "+t)
			}
		}

		structName := fmt.Sprintf("type %s struct {\n%s\n}\n", name, strings.Join(paramsList, "\n"))
		method := fmt.Sprintf("func (%s %s) accept(visitor %sVisitor) LiteralType {\n    return visitor.visit%s(%s)\n}\n", receiver, name, fileName, name, receiver)
		result = append(result, structName, method)
		visitorList = append(visitorList, fmt.Sprintf("    visit%s(%s %s) LiteralType", name, realFileName, name))
	}
	visitor := fmt.Sprintf("type %sVisitor interface {\n%s\n}\n", fileName, strings.Join(visitorList, "\n"))
	result = append(result, visitor, fmt.Sprintf("type %s interface{\n    accept(visitor %sVisitor) LiteralType\n}", fileName, fileName))
	content := strings.Join(result, "\n")
	os.WriteFile("../"+realFileName+".go", []byte(content), 0644)
}

func main() {
	const expressionName = "Expression"
	const statementName = "Statement"
	expressionList := []string{
		fmt.Sprintf("Assign # name Token, value %s", expressionName),
		fmt.Sprintf("Binary # left %s, operator Token, right %s", expressionName, expressionName),
		fmt.Sprintf("Call # callee %s, paren Token, argumentList []%s", expressionName, expressionName),
		fmt.Sprintf("Get # object %s, name Token", expressionName),
		fmt.Sprintf("Set # object %s, name Token, value %s", expressionName, expressionName),
		fmt.Sprintf("Grouping # expression %s", expressionName),
		"Literal # string string, tokenType TokenType",
		fmt.Sprintf("Logical # left %s, operator Token, right %s", expressionName, expressionName),
		fmt.Sprintf("Super # keyword Token, value %s", expressionName),
		"This # keyword Token",
		fmt.Sprintf("Unary # operator Token, right %s", expressionName),
		"Variable # name Token",
	}
	statementList := []string{
		fmt.Sprintf("Block # statements []%s", statementName),
		"Class # name Token, superClass VariableExpression, methods []FunctionStatement",
		fmt.Sprintf("Expression # expression %s", expressionName),
		fmt.Sprintf("Function # name Token, body %s, params []Token", statementName),
		fmt.Sprintf("If # condition %s, thenBranch %s, elseBranch %s", expressionName, statementName, statementName),
		fmt.Sprintf("Print # expression %s, comment Token", expressionName),
		fmt.Sprintf("Return # keyword Token, value %s", expressionName),
		fmt.Sprintf("Variable # name Token, initializer %s", expressionName),
		fmt.Sprintf("While # condition %s, body %s", expressionName, statementName),
	}
	defineAST(expressionName, expressionList)
	defineAST(statementName, statementList)
}
