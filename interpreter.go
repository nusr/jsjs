package main

import (
	"fmt"
	"math"
	"strconv"
	"strings"
)

const (
	nanNumber = "NaN"
)

const whileMaxIteration = 100000

func convertBtoF(b bool) float64 {
	if b {
		return float64(1)
	}
	return float64(0)
}

func convertLtoI(left any, right any) (int64, int64, bool) {
	leftInt, leftType := left.(int64)
	rightInt, rightType := right.(int64)
	if leftType && rightType {
		return leftInt, rightInt, true
	}
	return 0, 0, false
}

func convertLtoF(left any, right any) (float64, float64, bool) {
	a := float64(0)
	b := float64(0)
	count := 0
	if left == nil && right == nil {
		count = 2
	}
	if left == nil {
		count++
	}
	if right == nil {
		count++
	}
	if val, ok := left.(float64); ok {
		a = val
		count++
	}
	if val, ok := right.(float64); ok {
		b = val
		count++
	}
	if val, ok := left.(bool); ok {
		a = convertBtoF(val)
		count++
	}
	if val, ok := right.(bool); ok {
		b = convertBtoF(val)
		count++
	}
	if val, ok := left.(int64); ok {
		a = float64(val)
		count++
	}
	if val, ok := right.(int64); ok {
		b = float64(val)
		count++
	}
	return a, b, count >= 2
}

type Interpreter struct {
	environment *Environment
	globals     *Environment
}

func NewInterpreter(environment *Environment) *Interpreter {
	return &Interpreter{
		environment: environment,
		globals:     environment,
	}
}

func (interpreter *Interpreter) Interpret(list []Statement) {
	for _, item := range list {
		interpreter.execute(item)
	}
}

func (interpreter *Interpreter) execute(statement Statement) any {
	return statement.accept(interpreter)
}

func (interpreter *Interpreter) evaluate(expression Expression) any {
	return expression.accept(interpreter)
}

func (interpreter *Interpreter) isTruth(value any) bool {
	if value == true {
		return true
	}
	list := []interface{}{
		nil,
		"",
		int64(0),
		float64(0),
		false,
	}
	for _, item := range list {
		if item == value {
			return false
		}
	}
	text := literalTypeToString(value)
	result := text != ""
	return result
}

func (interpreter *Interpreter) executeBlock(statement BlockStatement, environment *Environment) {
	previous := interpreter.environment

	defer func() {
		if err := recover(); err != any(nil) {
			interpreter.environment = previous
		}
	}()
	interpreter.environment = environment
	for _, statement := range statement.statements {
		interpreter.execute(statement)
	}
}

func (interpreter *Interpreter) visitExpressionStatement(statement ExpressionStatement) any {
	return interpreter.evaluate(statement.expression)
}
func (interpreter *Interpreter) visitVariableStatement(statement VariableStatement) any {
	if statement.initializer != nil {
		value := interpreter.evaluate(statement.initializer)
		interpreter.environment.define(statement.name.lexeme, value)
	} else {
		interpreter.environment.define(statement.name.lexeme, nil)
	}
	return nil
}
func (interpreter *Interpreter) visitBlockStatement(statement BlockStatement) any {
	interpreter.executeBlock(statement, NewEnvironment(interpreter.environment))
	return nil
}
func (interpreter *Interpreter) visitClassStatement(statement ClassStatement) any {
	// TODO
	return nil
}
func (interpreter *Interpreter) visitFunctionStatement(statement FunctionStatement) any {
	interpreter.environment.define(statement.name.lexeme, NewCallable(statement))
	return nil
}

func (interpreter *Interpreter) visitIfStatement(statement IfStatement) any {
	if interpreter.isTruth(interpreter.evaluate(statement.condition)) {
		interpreter.execute(statement.thenBranch)
	} else if statement.elseBranch != nil {
		interpreter.execute(statement.elseBranch)
	}
	return nil
}
func (interpreter *Interpreter) visitPrintStatement(statement PrintStatement) any {
	result := interpreter.evaluate(statement.expression)
	actual := literalTypeToString(result)
	//fmt.Printf("%s\n", actual)
	if statement.comment != nil {
		data := strings.Split(statement.comment.lexeme, ":")
		if len(data) >= 2 {
			expected := strings.TrimSpace(data[1])
			if expected == actual {
				globalExpect.addSuccess()
			} else {
				globalExpect.addFail()
			}
		}
	}
	return result
}

func (interpreter *Interpreter) visitReturnStatement(statement ReturnStatement) any {
	if statement.value == nil {
		return nil
	}
	result := interpreter.evaluate(statement.value)
	return result
}
func (interpreter *Interpreter) visitWhileStatement(statement WhileStatement) any {
	count := 0
	for interpreter.isTruth(interpreter.evaluate(statement.condition)) {
		interpreter.execute(statement.body)
		count++
		if count > whileMaxIteration {
			panic(any("over max iteration count"))
		}
	}
	return nil
}

func (interpreter *Interpreter) visitVariableExpression(expression VariableExpression) any {
	return interpreter.environment.get(expression.name)
}
func (interpreter *Interpreter) visitLiteralExpression(expression LiteralExpression) any {
	switch expression.tokenType {
	case NULL:
		return nil
	case STRING:
		return expression.string
	case FLOAT64:
		{
			result, _ := strconv.ParseFloat(expression.string, 64)
			return result
		}
	case INT64:
		{
			result, _ := strconv.ParseInt(expression.string, 10, 64)
			return result
		}
	case TRUE:
		return true
	case FALSE:
		return false
	}
	return nil
}

func (interpreter *Interpreter) visitBinaryExpression(expression BinaryExpression) any {
	left := interpreter.evaluate(expression.left)
	right := interpreter.evaluate(expression.right)
	switch expression.operator.tokenType {
	case EqualEqual:
		return left == right
	case BangEqual:
		return left != right
	case LESS:
		{
			_, stringType1 := left.(string)
			_, stringType2 := right.(string)
			if stringType1 || stringType2 {
				return false
			}
			a, b, check := convertLtoF(left, right)
			if !check {
				panic(any(fmt.Sprintf("LESS can not handle value left:%v,right:%v", left, right)))
			}
			return a < b
		}
	case LessEqual:
		{
			_, stringType1 := left.(string)
			_, stringType2 := right.(string)
			if stringType1 || stringType2 {
				return false
			}
			a, b, check := convertLtoF(left, right)
			if !check {
				panic(any(fmt.Sprintf("LESS_EQUAL can not handle value left:%v,right:%v", left, right)))
			}
			return a <= b
		}
	case GREATER:
		{
			_, stringType1 := left.(string)
			_, stringType2 := right.(string)
			if stringType1 || stringType2 {
				return false
			}
			a, b, check := convertLtoF(left, right)
			if !check {
				panic(any(fmt.Sprintf("GREATER can not handle value left:%v,right:%v", left, right)))
			}
			return a > b
		}
	case GreaterEqual:
		{
			_, stringType1 := left.(string)
			_, stringType2 := right.(string)
			if stringType1 || stringType2 {
				return false
			}
			a, b, check := convertLtoF(left, right)
			if !check {
				panic(any(fmt.Sprintf("GREATER_EQUAL can not handle value left:%v,right:%v", left, right)))
			}
			return a >= b
		}
	case PLUS:
		{
			_, stringType1 := left.(string)
			_, stringType2 := right.(string)
			if stringType1 || stringType2 {
				return literalTypeToString(left) + literalTypeToString(right)
			}
			if a, b, check := convertLtoI(left, right); check {
				return a + b
			}
			a, b, check := convertLtoF(left, right)
			if !check {
				panic(any(fmt.Sprintf("PLUS can not handle value left:%v,right:%v", left, right)))
			}
			return a + b
		}
	case MINUS:
		{
			_, stringType1 := left.(string)
			_, stringType2 := right.(string)
			if stringType1 || stringType2 {
				return nanNumber
			}
			if a, b, check := convertLtoI(left, right); check {
				return a - b
			}
			a, b, check := convertLtoF(left, right)
			if !check {
				panic(any(fmt.Sprintf("MINUS can not handle value left:%v,right:%v", left, right)))
			}
			return a - b
		}
	case STAR:
		{
			_, stringType1 := left.(string)
			_, stringType2 := right.(string)
			if stringType1 || stringType2 {
				return nanNumber
			}
			if a, b, check := convertLtoI(left, right); check {
				return a * b
			}
			a, b, check := convertLtoF(left, right)
			if !check {
				panic(any(fmt.Sprintf("STAR can not handle value left:%v,right:%v", left, right)))
			}
			return a * b
		}
	case SLASH:
		{
			_, stringType1 := left.(string)
			_, stringType2 := right.(string)
			if stringType1 || stringType2 {
				return nanNumber
			}
			if a, b, check := convertLtoI(left, right); check {
				return a / b
			}
			a, b, check := convertLtoF(left, right)
			if !check {
				panic(any(fmt.Sprintf("STAR can not handle value left:%v,right:%v", left, right)))
			}
			if b == 0 {
				return math.MaxFloat64
			}
			return a / b
		}
	}
	return nil
}

func (interpreter *Interpreter) visitCallExpression(expression CallExpression) any {
	callable := interpreter.evaluate(expression.callee)
	var params []any
	for _, item := range expression.argumentList {
		params = append(params, interpreter.evaluate(item))
	}
	if val, ok := callable.(*Callable); ok {
		return val.call(interpreter, params)
	}
	panic(any("can only call function and class"))
}
func (interpreter *Interpreter) visitGetExpression(expression GetExpression) any {
	// TODO
	return nil
}
func (interpreter *Interpreter) visitSetExpression(expression SetExpression) any {
	// TODO
	return nil
}
func (interpreter *Interpreter) visitLogicalExpression(expression LogicalExpression) any {
	left := interpreter.evaluate(expression.left)
	check := interpreter.isTruth(left)
	if expression.operator.tokenType == AND {
		if !check {
			return left
		}
	} else {
		if check {
			return left
		}
	}
	return interpreter.evaluate(expression.right)
}

func (interpreter *Interpreter) visitSuperExpression(expression SuperExpression) any {
	// TODO
	return nil
}

func (interpreter *Interpreter) visitGroupingExpression(expression GroupingExpression) any {
	result := interpreter.evaluate(expression.expression)
	return result
}

func (interpreter *Interpreter) visitThisExpression(expression ThisExpression) any {
	// TODO
	return nil
}
func (interpreter *Interpreter) visitUnaryExpression(expression UnaryExpression) any {
	result := interpreter.evaluate(expression.right)
	switch expression.operator.tokenType {
	case PlusPlus:
		{
			if val, check := expression.right.(VariableExpression); check {
				var temp any
				if val, check := result.(int64); check {
					temp = val + 1
				} else {
					a, _, check := convertLtoF(result, 0)
					if check {
						temp = a + 1
					} else {
						panic(any("error type"))
					}
				}
				interpreter.environment.assign(val.name, temp)
				return temp
			} else {
				panic(any("Invalid left-hand side expression in prefix operation"))
			}

		}

	case MinusMinus:
		{
			if val, check := expression.right.(VariableExpression); check {
				var temp any
				if val, check := result.(int64); check {
					temp = val - 1
				} else {
					a, _, check := convertLtoF(result, 0)
					if check {
						temp = a - 1
					} else {
						panic(any("error type"))
					}
				}
				interpreter.environment.assign(val.name, temp)
				return temp
			}
			panic(any("Invalid left-hand side expression in prefix operation"))
		}
	case PLUS:
		return result
	case MINUS:
		{
			if result == nil {
				return -0
			}
			if val, ok := result.(bool); ok {
				return convertBtoF(val)
			}
			if val, ok := result.(float64); ok {
				return -val
			}
			return nanNumber
		}
	case BANG:
		return !interpreter.isTruth(result)
	}
	return nil
}

func (interpreter *Interpreter) visitAssignExpression(expression AssignExpression) any {
	temp := interpreter.evaluate(expression.value)
	interpreter.environment.assign(expression.name, temp)
	return temp
}
