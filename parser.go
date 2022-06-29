package main

import (
	"fmt"
)

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
		panic(message)
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

func (parser *Parser) varStatement() Statement {
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
	if parser.match(LEFT_PAREN) {
		expr := parser.expression()
		parser.consume(RIGHT_PAREN, fmt.Sprintf("parser expected ')', actual:%s", parser.peek()))
		return GroupingExpression{
			expression: expr,
		}
	}
	panic(fmt.Sprintf("parser can not handle token: %s", parser.peek()))
}
func (parser *Parser) finishCall(callee Expression) Expression {
	var params []Expression
	if !parser.check(RIGHT_PAREN) {
		for ok := true; ok; ok = parser.match(COMMA) {
			params = append(params, parser.expression())
		}
	}
	paren := parser.consume(RIGHT_PAREN, "expect )")
	return CallExpression{
		callee:       callee,
		argumentList: params,
		paren:        paren,
	}
}
func (parser *Parser) call() Expression {
	expr := parser.primary()
	for {
		if parser.match(LEFT_PAREN) {
			expr = parser.finishCall(expr)
		} else {
			break
		}
	}
	return expr
}

func (parser *Parser) unary() Expression {
	if parser.match(MINUS, PLUS, BANG, MINUS_MINUS, PLUS_PLUS) {
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
	for parser.match(GREATER, GREATER_EQUAL, LESS, LESS_EQUAL) {
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
	for parser.match(BANG_EQUAL, EQUAL_EQUAL) {
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
		panic(fmt.Sprintf("invalid assign target: %s", equal))
	}
	return expr
}

func (parser *Parser) expression() Expression {
	return parser.assignment()
}

func (parser *Parser) ifStatement() Statement {
	parser.consume(LEFT_PAREN, "expect ( after if")
	expression := parser.expression()
	parser.consume(RIGHT_PAREN, "expected ) after if")
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
	if parser.match(LINE_COMMENT) {
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
	for !parser.isAtEnd() && parser.peek().tokenType != RIGHT_BRACE {
		statements = append(statements, parser.declaration())
	}
	parser.consume(RIGHT_BRACE, "expected } after block")
	return BlockStatement{
		statements: statements,
	}
}

func (parser *Parser) forStatement() Statement {
	parser.consume(LEFT_PAREN, "expect (")

	var initializer Statement
	if parser.match(SEMICOLON) {
		initializer = nil
	} else if parser.match(VAR) {
		initializer = parser.varStatement()
	} else {
		initializer = parser.expressionStatement()
	}

	var condition Expression
	if !parser.check(SEMICOLON) {
		condition = parser.expression()
	}
	parser.consume(SEMICOLON, "expect ;")

	var increment Statement
	if !parser.check(RIGHT_PAREN) {
		increment = parser.expressionStatement()
	}
	parser.consume(RIGHT_PAREN, "expect )")

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
	parser.consume(lEFT_BRACE, "expect {")
	body := parser.block()
	parser.consume(WHILE, "expect while")
	parser.consume(LEFT_PAREN, "expect (")
	condition := parser.expression()
	parser.consume(RIGHT_PAREN, "expect )")
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
	parser.consume(LEFT_PAREN, "expect ( after while")
	condition := parser.expression()
	parser.consume(RIGHT_PAREN, "expected ) after while")
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
	if parser.match(lEFT_BRACE) {
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

func (parser *Parser) functionStatement() FunctionStatement {
	name := parser.consume(IDENTIFIER, "expect name")
	parser.consume(LEFT_PAREN, "expect (")
	var parameters []*Token
	if !parser.check(RIGHT_PAREN) {
		for ok := true; ok; ok = parser.match(COMMA) {
			parameters = append(parameters, parser.consume(IDENTIFIER, "expect parameter name"))

		}
	}
	parser.consume(RIGHT_PAREN, "expect )")
	parser.consume(lEFT_BRACE, "expect {")
	body := parser.block()
	return FunctionStatement{
		name:   name,
		params: parameters,
		body:   body,
	}
}
func (parser *Parser) declaration() Statement {
	if parser.match(VAR) {
		return parser.varStatement()
	}
	if parser.match(FUNCTION) {
		return parser.functionStatement()
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
