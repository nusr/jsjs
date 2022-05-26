package main

import (
	"fmt"
	"io/ioutil"
	"os"
	"strconv"
)

type TokenType int

const (
	LEFT_PAREN    TokenType = iota // (
	RIGHT_PAREN                    // )
	lEFT_BRACE                     // {
	RIGHT_BRACE                    // }
	LEFT_SQUARE                    // [
	RIGHT_SQUARE                   // ]
	COMMA                          // ,
	DOT                            // .
	MINUS                          // -
	PLUS                           // +
	SEMICOLON                      // ;
	COLON                          // :
	SLASH                          // /
	STAR                           // *
	BANG                           // one or two character tokens !
	BANG_EQUAL                     // !=
	EQUAL                          // =
	EQUAL_EQUAL                    // ==
	GREATER                        // >
	GREATER_EQUAL                  // >=
	LESS                           // <
	LESS_EQUAL                     // <=
	IDENTIFIER                     // Literals
	STRING
	NUMBER
	AND // keywords
	CLASS
	ELSE
	FALSE
	TRUE
	FUNCTION
	FOR
	IF
	NULL // null
	OR
	PRINT
	RETURN
	SUPER
	THIS
	VAR // variable
	WHILE
	EOF // end
)

var KEYWORD_MAP = map[string]TokenType{
	"and":      AND,
	"class":    CLASS,
	"else":     ELSE,
	"false":    FALSE,
	"for":      FOR,
	"function": FUNCTION,
	"if":       IF,
	"null":     NULL,
	"or":       OR,
	"print":    PRINT,
	"return":   RETURN,
	"super":    SUPER,
	"this":     THIS,
	"true":     TRUE,
	"var":      VAR,
	"while":    WHILE,
}

const EMPTY_DATA = 0

type LiteralType interface{}

func literalTypeToString(text LiteralType) string {
	switch data := text.(type) {
	case nil:
		return ""
	case string:
		return data
	case int32:
		return strconv.FormatInt(int64(data), 10)
	case int:
		return strconv.Itoa(data)
	case int64:
		return strconv.FormatInt(data, 10)
	case float32:
	case float64:
		return strconv.FormatFloat(data, 'f', 10, 64)
	default:
		return ""
	}
	return ""
}

type Token struct {
	tokenType TokenType
	lexeme    string
	literal   LiteralType
	line      int
}

func (token *Token) String() string {
	return strconv.Itoa(int(token.tokenType)) + " " + token.lexeme + " " + literalTypeToString(token.literal)
}

type Scanner struct {
	source  []rune
	tokens  []*Token
	start   int
	current int
	line    int
}

func NewScanner(source string) *Scanner {
	var tokens []*Token
	return &Scanner{
		source:  []rune(source),
		tokens:  tokens,
		start:   0,
		current: 0,
		line:    1,
	}
}

func (scanner *Scanner) isAtEnd() bool {
	return scanner.current >= len(scanner.source)
}
func (scanner *Scanner) getChar(index int) rune {
	return scanner.source[index]
}
func (scanner *Scanner) peek() rune {
	if scanner.isAtEnd() {
		return EMPTY_DATA
	}
	return scanner.getChar(scanner.current)
}
func (scanner *Scanner) peekNext() rune {
	if scanner.current+1 < len(scanner.source) {
		return scanner.getChar(scanner.current + 1)
	}
	return EMPTY_DATA
}
func (scanner *Scanner) advance() rune {
	c := scanner.getChar(scanner.current)
	scanner.current++
	return c
}

func (scanner *Scanner) getSubString(start int, end int) string {
	text := string(scanner.source[start:end])
	return text
}

func (scanner *Scanner) addOneToken(tokenType TokenType, literal LiteralType) {
	text := scanner.getSubString(scanner.start, scanner.current)
	scanner.tokens = append(scanner.tokens, &Token{
		tokenType: tokenType,
		lexeme:    text,
		literal:   literal,
		line:      scanner.line,
	})
}

func (scanner *Scanner) addToken(tokenType TokenType) {
	scanner.addOneToken(tokenType, nil)
}
func (scanner *Scanner) match(char rune) bool {
	if scanner.isAtEnd() {
		return false
	}
	if scanner.getChar(scanner.current) != char {
		return false
	}
	scanner.current++
	return true
}

func (scanner *Scanner) isDigit(c rune) bool {
	return c >= '0' && c <= '9'
}

func (scanner *Scanner) isAlpha(c rune) bool {
	return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c == '_' || (c >= '\u4e00' && c <= '\u9fa5')
}

func (scanner *Scanner) number() {
	for scanner.isDigit(scanner.peek()) {
		scanner.advance()
	}
	if scanner.peek() == '.' && scanner.isDigit(scanner.peekNext()) {
		scanner.advance()
		for scanner.isDigit(scanner.peek()) {
			scanner.advance()
		}
	}
	text := scanner.getSubString(scanner.start, scanner.current)
	val, _ := strconv.ParseFloat(text, 64)
	scanner.addOneToken(NUMBER, val)
}

func (scanner *Scanner) string(end rune) {
	for scanner.peek() != end && !scanner.isAtEnd() {
		if scanner.peek() == '\n' {
			scanner.line++
		}
		scanner.advance()
	}
	if scanner.isAtEnd() {
		fmt.Println("unterminated string")
		return
	}
	scanner.advance() // skip "
	text := scanner.getSubString(scanner.start+1, scanner.current-1)
	scanner.addOneToken(STRING, text)
}

func (scanner *Scanner) identifier() {
	for scanner.isAlpha(scanner.peek()) {
		scanner.advance()
	}
	text := scanner.getSubString(scanner.start, scanner.current)
	tokenType := IDENTIFIER
	if val, ok := KEYWORD_MAP[text]; ok {
		tokenType = val
	}
	scanner.addToken(tokenType)
}

func (scanner *Scanner) scanToken() {
	c := scanner.advance()
	switch c {
	case '(':
		scanner.addToken(LEFT_PAREN)
	case ')':
		scanner.addToken(RIGHT_PAREN)
	case '{':
		scanner.addToken(lEFT_BRACE)
	case '}':
		scanner.addToken(RIGHT_BRACE)
	case '[':
		scanner.addToken(LEFT_SQUARE)
	case ']':
		scanner.addToken(RIGHT_SQUARE)
	case ',':
		scanner.addToken(COMMA)
	case '.':
		scanner.addToken(DOT)
	case '-':
		scanner.addToken(MINUS)
	case '+':
		scanner.addToken(PLUS)
	case ';':
		scanner.addToken(SEMICOLON)
	case ':':
		scanner.addToken(COLON)
	case '*':
		scanner.addToken(STAR)
	case '!':
		if scanner.match('=') {
			scanner.addToken(BANG_EQUAL)
		} else {
			scanner.addToken(BANG)
		}
	case '=':
		if scanner.match('=') {
			scanner.addToken(EQUAL_EQUAL)
		} else {
			scanner.addToken(EQUAL)
		}
	case '>':
		if scanner.match('=') {
			scanner.addToken(GREATER_EQUAL)
		} else {
			scanner.addToken(GREATER)
		}
	case '<':
		if scanner.match('=') {
			scanner.addToken(LESS_EQUAL)
		} else {
			scanner.addToken(LESS)
		}
	case '/':
		if scanner.match('/') {
			for scanner.peek() != '\n' && !scanner.isAtEnd() {
				scanner.advance()
			}
		} else if scanner.match('*') {
			for !((scanner.peek() == '*' && scanner.peekNext() == '/') || scanner.isAtEnd()) {
				scanner.advance()
			}
			scanner.advance() // skip *
			scanner.advance() // skip /
		} else {
			scanner.addToken(SLASH)
		}
	case ' ':
	case '\r':
	case '\t':
		break
	case '\n':
		scanner.line++
	case '\'':
	case '"':
		scanner.string(c)
	default:
		if scanner.isDigit(c) {
			scanner.number()
		} else if scanner.isAlpha(c) {
			scanner.identifier()
		} else {
			fmt.Printf("Unexpected character:%c\n", c)
		}
	}
}

func (scanner *Scanner) ScanTokens() []*Token {
	for !scanner.isAtEnd() {
		scanner.start = scanner.current
		scanner.scanToken()
	}
	scanner.tokens = append(scanner.tokens, &Token{
		tokenType: EOF,
		lexeme:    "",
		line:      scanner.line,
		literal:   "",
	})
	return scanner.tokens
}

type ExpressionType string

type VisitorType interface{}

type Statement interface {
	accept(visitor VisitorType) ExpressionType
}

type Expression interface {
	accept(visitor VisitorType) ExpressionType
}

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
	return VariableStatement{
		name:        name,
		initializer: nil,
	}
}
func (parser *Parser) primary() Expression {
	if parser.match(TRUE) {
		return LiteralExpression{
			value: true,
		}
	}
	if parser.match(FALSE) {
		return LiteralExpression{
			value: false,
		}
	}
	if parser.match(NULL) {
		return LiteralExpression{
			value: nil,
		}
	}
	if parser.match(NUMBER, STRING) {
		return LiteralExpression{
			value: parser.previous().literal,
		}
	}
	if parser.match(IDENTIFIER) {
		expr := parser.expression()
		parser.consume(RIGHT_PAREN, fmt.Sprintf("parser expected '(', actual:%s", parser.peek()))
		return GroupingExpression{
			expression: expr,
		}
	}
	panic(fmt.Sprintf("parser can not handle token: %s", parser.peek()))
}
func (parser *Parser) unary() Expression {
	if parser.match(MINUS, BANG) {
		operator := parser.previous()
		value := parser.unary()
		return UnaryExpression{
			operator: operator,
			right:    value,
		}
	}
	return parser.primary()

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
		if val, ok := value.(VariableExpression); ok {
			name := val.name
			return AssignExpression{
				name:  name,
				value: val,
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
	parser.consume(RIGHT_BRACE, "expected ) after if")
	thenBranch := parser.statement()
	// elseBranch := interface{}
	// if parser.match(ELSE) {
	// 	elseBranch = parser.statement()
	// }
	return IfStatement{
		condition:  expression,
		thenBranch: thenBranch,
		// elseBranch: elseBranch,
	}
}

func (parser *Parser) printStatement() Statement {
	expr := parser.expression()
	if !parser.isAtEnd() {
		parser.consume(SEMICOLON, "expected ; after print")
	}
	return PrintStatement{
		expression: expr,
	}
}

func (parser *Parser) expressionStatement() Statement {
	expr := parser.expression()
	if !parser.isAtEnd() {
		parser.consume(SEMICOLON, "expected ; after expression")
	}
	return ExpressionStatement{
		expression: expr,
	}
}

func (parser *Parser) statement() Statement {
	if parser.match(IF) {
		return parser.ifStatement()
	}
	if parser.match(PRINT) {
		return parser.printStatement()
	}
	// if parser.match(WHILE) {
	// 	return
	// }
	return parser.expressionStatement()
}

func (parser *Parser) declaration() Statement {
	if parser.match(VAR) {
		return parser.varStatement()
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
func interpret(source string) {
	scanner := NewScanner(source)
	tokens := scanner.ScanTokens()
	for _, token := range tokens {
		fmt.Println(token)
	}
	// parser := NewParser(tokens)
	// statements := parser.Parse()
	// for _, statement := range statements {
	// 	fmt.Println(statement)
	// }
}

func reply() {
	var line string
	for {
		fmt.Print("> ")
		_, err := fmt.Scanln(&line)
		if err != nil {
			fmt.Println(err)
			break
		}
		interpret(line)
	}
}

func funFile(fileName string) {
	content, err := ioutil.ReadFile(fileName)
	if err != nil {
		fmt.Printf("can not open file \"%s\", error: %v", fileName, err)
		return
	}
	interpret(string(content))
}

func main() {
	argc := len(os.Args)
	if argc == 1 {
		reply()
	} else if argc == 2 {
		funFile(os.Args[1])
	} else {
		fmt.Println("Usage: lox [path]")
		os.Exit(64)
	}
}
