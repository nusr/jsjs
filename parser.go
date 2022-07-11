package main

import (
	"fmt"
)

const maxParameterCount = 255

type Parser struct {
	tokens  []*Token
	current int
}

func NewParser(tokens []*Token) *Parser {
	return &Parser{
		current: 0,
		tokens:  tokens,
	}
}
func (parser *Parser) peek() *Token {
	return parser.tokens[parser.current]
}

func (parser *Parser) advance() {
	if parser.isAtEnd() {
		return
	}
	parser.current++
}

func (parser *Parser) previous() *Token {
	return parser.tokens[parser.current-1]
}

func (parser *Parser) consume(tokenType TokenType, message string) *Token {
	if parser.peek().tokenType != tokenType {
		panic(any(message))
	}
	parser.advance()
	return parser.previous()
}

func (parser *Parser) check(tokenType TokenType) bool {
	if parser.isAtEnd() {
		return false
	}
	return parser.peek().tokenType == tokenType
}

func (parser *Parser) match(tokenTypes ...TokenType) bool {
	for _, tokenType := range tokenTypes {
		if parser.check(tokenType) {
			parser.advance()
			return true
		}
	}
	return false
}

func (parser *Parser) varDeclaration() Statement {
	name := parser.consume(IDENTIFIER, "expect identifier after var")
	if parser.match(EQUAL) {
		initializer := parser.expression()
		parser.match(SEMICOLON)
		return VariableStatement{
			name:        name,
			initializer: initializer,
		}
	} else {
		parser.match(SEMICOLON)
		return VariableStatement{
			name: name,
		}
	}

}
func (parser *Parser) primary() Expression {
	if parser.match(TRUE) {
		return LiteralExpression{
			tokenType: TRUE,
		}
	}
	if parser.match(FALSE) {
		return LiteralExpression{
			tokenType: FALSE,
		}
	}
	if parser.match(NULL) {
		return LiteralExpression{
			tokenType: NULL,
		}
	}
	if parser.match(FLOAT64, INT64) {
		token := parser.previous()
		return LiteralExpression{
			string:    token.lexeme,
			tokenType: token.tokenType,
		}

	}
	if parser.match(STRING) {
		return LiteralExpression{
			string:    parser.previous().lexeme,
			tokenType: STRING,
		}
	}
	if parser.match(IDENTIFIER) {
		return VariableExpression{
			name: parser.previous(),
		}
	}
	if parser.match(LeftParen) {
		expr := parser.expression()
		parser.consume(RightParen, fmt.Sprintf("parser expected ')', actual:%s", parser.peek()))
		return GroupingExpression{
			expression: expr,
		}
	}
	panic(any(fmt.Sprintf("parser can not handle token: %s", parser.peek())))
}
func (parser *Parser) finishCall(callee Expression) Expression {
	var params []Expression
	if !parser.check(RightParen) {
		count := 0
		for ok := true; ok; ok = parser.match(COMMA) {
			params = append(params, parser.expression())
			count++
			if count > maxParameterCount {
				panic(any("over max parameter count"))
			}
		}
	}
	paren := parser.consume(RightParen, "expect )")
	return CallExpression{
		callee:       callee,
		argumentList: params,
		paren:        paren,
	}
}
func (parser *Parser) call() Expression {
	expr := parser.primary()
	for {
		if parser.match(LeftParen) {
			expr = parser.finishCall(expr)
		} else {
			break
		}
	}
	return expr
}

func (parser *Parser) unary() Expression {
	if parser.match(MINUS, PLUS, BANG, MinusMinus, PlusPlus) {
		operator := parser.previous()
		value := parser.unary()
		return UnaryExpression{
			operator: operator,
			right:    value,
		}
	}
	return parser.call()

}
func (parser *Parser) factor() Expression {
	unary := parser.unary()
	for parser.match(STAR, SLASH) {
		operator := parser.previous()
		right := parser.unary()
		unary = BinaryExpression{
			left:     unary,
			operator: operator,
			right:    right,
		}
	}
	return unary
}

func (parser *Parser) term() Expression {
	factor := parser.factor()
	for parser.match(PLUS, MINUS) {
		operator := parser.previous()
		right := parser.factor()
		factor = BinaryExpression{
			left:     factor,
			operator: operator,
			right:    right,
		}
	}
	return factor
}

func (parser *Parser) comparison() Expression {
	term := parser.term()
	for parser.match(GREATER, GreaterEqual, LESS, LessEqual) {
		operator := parser.previous()
		right := parser.term()
		term = BinaryExpression{
			left:     term,
			operator: operator,
			right:    right,
		}
	}
	return term
}

func (parser *Parser) equality() Expression {
	expr := parser.comparison()
	for parser.match(BangEqual, EqualEqual) {
		operator := parser.previous()
		right := parser.comparison()
		expr = BinaryExpression{
			left:     expr,
			operator: operator,
			right:    right,
		}
	}
	return expr
}

func (parser *Parser) and() Expression {
	expr := parser.equality()
	for parser.match(AND) {
		operator := parser.previous()
		right := parser.and()
		expr = LogicalExpression{
			left:     expr,
			operator: operator,
			right:    right,
		}
	}
	return expr
}
func (parser *Parser) or() Expression {
	expr := parser.and()
	for parser.match(OR) {
		operator := parser.previous()
		right := parser.and()
		expr = LogicalExpression{
			left:     expr,
			operator: operator,
			right:    right,
		}
	}
	return expr
}
func (parser *Parser) assignment() Expression {
	expr := parser.or()
	if parser.match(EQUAL) {
		equal := parser.previous()
		value := parser.assignment()
		if val, ok := expr.(VariableExpression); ok {
			return AssignExpression{
				name:  val.name,
				value: value,
			}
		}
		panic(any(fmt.Sprintf("invalid assign target: %s", equal)))
	}
	return expr
}

func (parser *Parser) expression() Expression {
	return parser.assignment()
}

func (parser *Parser) ifStatement() Statement {
	parser.consume(LeftParen, "expect ( after if")
	expression := parser.expression()
	parser.consume(RightParen, "expected ) after if")
	thenBranch := parser.statement()
	if parser.match(ELSE) {
		elseBranch := parser.statement()
		return IfStatement{
			condition:  expression,
			thenBranch: thenBranch,
			elseBranch: elseBranch,
		}
	} else {
		return IfStatement{
			condition:  expression,
			thenBranch: thenBranch,
		}
	}
}

func (parser *Parser) printStatement() Statement {
	expr := parser.expression()
	if !parser.isAtEnd() {
		parser.match(SEMICOLON)
	}
	if parser.match(LineComment) {
		comment := parser.previous()
		return PrintStatement{
			expression: expr,
			comment:    comment,
		}
	}
	return PrintStatement{
		expression: expr,
		comment:    nil,
	}
}

func (parser *Parser) expressionStatement() Statement {
	expr := parser.expression()
	if !parser.isAtEnd() {
		parser.match(SEMICOLON)
	}
	return ExpressionStatement{
		expression: expr,
	}
}

func (parser *Parser) block() BlockStatement {
	var statements []Statement
	for !parser.isAtEnd() && parser.peek().tokenType != RightBrace {
		statements = append(statements, parser.declaration())
	}
	parser.consume(RightBrace, "expected } after block")
	return BlockStatement{
		statements: statements,
	}
}

func (parser *Parser) forStatement() Statement {
	parser.consume(LeftParen, "expect (")

	var initializer Statement
	if parser.match(SEMICOLON) {
		initializer = nil
	} else if parser.match(VAR) {
		initializer = parser.varDeclaration()
	} else {
		initializer = parser.expressionStatement()
	}

	var condition Expression
	if !parser.check(SEMICOLON) {
		condition = parser.expression()
	}
	parser.consume(SEMICOLON, "expect ;")

	var increment Statement
	if !parser.check(RightParen) {
		increment = parser.expressionStatement()
	}
	parser.consume(RightParen, "expect )")

	body := parser.statement()

	if condition == nil {
		condition = LiteralExpression{
			tokenType: TRUE,
		}
	}

	if increment != nil {
		body = BlockStatement{
			statements: []Statement{
				body,
				increment,
			},
		}
	}

	body = WhileStatement{
		body:      body,
		condition: condition,
	}

	if initializer != nil {
		body = BlockStatement{
			statements: []Statement{
				initializer,
				body,
			},
		}
	}
	return body
}
func (parser *Parser) doWhile() Statement {
	parser.consume(LeftBrace, "expect {")
	body := parser.block()
	parser.consume(WHILE, "expect while")
	parser.consume(LeftParen, "expect (")
	condition := parser.expression()
	parser.consume(RightParen, "expect )")
	return BlockStatement{
		statements: []Statement{
			body,
			WhileStatement{
				body:      body,
				condition: condition,
			},
		},
	}
}
func (parser *Parser) while() Statement {
	parser.consume(LeftParen, "expect ( after while")
	condition := parser.expression()
	parser.consume(RightParen, "expected ) after while")
	body := parser.statement()
	return WhileStatement{
		condition: condition,
		body:      body,
	}
}

func (parser *Parser) returnStatement() Statement {
	token := parser.previous()
	expr := parser.expression()
	parser.match(SEMICOLON)
	return ReturnStatement{
		keyword: token,
		value:   expr,
	}
}

func (parser *Parser) statement() Statement {
	if parser.match(IF) {
		return parser.ifStatement()
	}
	if parser.match(RETURN) {
		return parser.returnStatement()
	}
	if parser.match(PRINT) {
		return parser.printStatement()
	}
	if parser.match(LeftBrace) {
		return parser.block()
	}
	if parser.match(DO) {
		return parser.doWhile()
	}
	if parser.match(FOR) {
		return parser.forStatement()
	}
	if parser.match(WHILE) {
		return parser.while()
	}
	return parser.expressionStatement()
}

func (parser *Parser) functionDeclaration() FunctionStatement {
	name := parser.consume(IDENTIFIER, "expect name")
	parser.consume(LeftParen, "expect (")
	var parameters []*Token
	if !parser.check(RightParen) {
		count := 0
		for ok := true; ok; ok = parser.match(COMMA) {
			parameters = append(parameters, parser.consume(IDENTIFIER, "expect parameter name"))
			count++
			if count > maxParameterCount {
				panic(any("over max parameter count"))
			}
		}
	}
	parser.consume(RightParen, "expect )")
	parser.consume(LeftBrace, "expect {")
	body := parser.block()
	return FunctionStatement{
		name:   name,
		params: parameters,
		body:   body,
	}
}
func (parser *Parser) classDeclaration() ClassStatement {
	name := parser.consume(IDENTIFIER, "expect class name")
	parser.consume(LeftBrace, "expect {")
	var methods []FunctionStatement
	for !parser.check(RightBrace) && !parser.isAtEnd() {
		methods = append(methods, parser.functionDeclaration())
	}

	parser.consume(RightBrace, "expect }")
	return ClassStatement{
		methods: methods,
		name:    name,
	}
}
func (parser *Parser) declaration() Statement {
	if parser.match(CLASS) {
		return parser.classDeclaration()
	}
	if parser.match(FUNCTION) {
		return parser.functionDeclaration()
	}
	if parser.match(VAR) {
		return parser.varDeclaration()
	}

	return parser.statement()
}

func (parser *Parser) Parse() []Statement {
	var statements []Statement
	for !parser.isAtEnd() {
		statements = append(statements, parser.declaration())
	}
	return statements
}

func (parser *Parser) isAtEnd() bool {
	return parser.peek().tokenType == EOF
}
