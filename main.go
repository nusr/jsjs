package main

import (
	"fmt"
	"io/ioutil"
	"os"
	"strconv"
)

type TokenType int

const (
	LEFT_PAREN  TokenType = iota // (
	RIGHT_PAREN                  // )
	lEFT_BRACE                   // {
	RIGHT_BRACE                  // }
	COMMA                        // ,
	DOT                          // .
	MINUS                        // -
	PLUS                         // +
	SEMICOLON                    // ;
	SLASH                        // /
	STAR                         // *
	// one or two character tokens
	BANG          // !
	BANG_EQUAL    // !=
	EQUAL         // =
	EQUAL_EQUAL   // ==
	GREATER       // >
	GREATER_EQUAL // >=
	LESS          // <
	LESS_EQUAL    // <=
	// Literals
	IDENTIFIER
	STRING
	NUMBER
	// keywords
	AND
	CLASS
	ELSE
	FALSE
	TRUE
	FUN
	FOR
	IF
	NIL // null
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
	"and":    AND,
	"class":  CLASS,
	"else":   ELSE,
	"false":  FALSE,
	"for":    FOR,
	"fun":    FUN,
	"if":     IF,
	"nil":    NIL,
	"or":     OR,
	"print":  PRINT,
	"return": RETURN,
	"super":  SUPER,
	"this":   THIS,
	"true":   TRUE,
	"var":    VAR,
	"while":  WHILE,
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
		return strconv.FormatFloat(float64(data), 'f', 10, 64)
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

func (token *Token) toString() string {
	return strconv.Itoa(int(token.tokenType)) + " " + token.lexeme + " " + literalTypeToString(token.literal)
}

type Scanner struct {
	source  string
	tokens  []*Token
	start   int
	current int
	line    int
}

func NewScanner(source string) *Scanner {
	var tokens []*Token
	return &Scanner{
		source:  source,
		tokens:  tokens,
		start:   0,
		current: 0,
		line:    1,
	}
}

func (scanner *Scanner) isAtEnd() bool {
	return scanner.current >= len(scanner.source)
}
func (scanner *Scanner) getChar(index int) byte {
	r := []byte(scanner.source)
	return r[index]
}
func (scanner *Scanner) peek() byte {
	if scanner.isAtEnd() {
		return EMPTY_DATA
	}
	return scanner.getChar(scanner.current)
}
func (scanner *Scanner) peekNext() byte {
	if scanner.current+1 < len(scanner.source) {
		return scanner.getChar(scanner.current + 1)
	}
	return EMPTY_DATA
}
func (scanner *Scanner) advance() byte {
	c := scanner.getChar(scanner.current)
	scanner.current++
	return c
}

func (scanner *Scanner) getSubString(start int, end int) string {
	r := []rune(scanner.source)
	text := string(r[start:end])
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
func (scanner *Scanner) match(char byte) bool {
	if scanner.isAtEnd() {
		return false
	}
	if scanner.getChar(scanner.current) != char {
		return false
	}
	scanner.current++
	return true
}

func (scanner *Scanner) isDigit(c byte) bool {
	return c >= '0' && c <= '9'
}

func (scanner *Scanner) isAlpha(c byte) bool {
	return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c == '_'
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

func (scanner *Scanner) string() {
	for scanner.peek() != '"' && !scanner.isAtEnd() {
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
	case '*':
		scanner.addToken(STAR)
	case '!':
		if scanner.match('=') {
			scanner.addToken(BANG_EQUAL)
		} else {
			scanner.addToken(EQUAL)
		}
	case '=':
		if scanner.match('=') {
			scanner.addToken(BANG_EQUAL)
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
	case 't':
		break
	case '\n':
		scanner.line++
	case '"':
		scanner.string()
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
	var result []*Token
	for !scanner.isAtEnd() {
		scanner.start = scanner.current
		scanner.scanToken()
	}
	result = append(result, &Token{
		tokenType: EOF,
		lexeme:    "",
		line:      scanner.line,
		literal:   "",
	})
	scanner.tokens = result
	return scanner.tokens
}

func interpret(source string) {
	fmt.Println(source)
	scanner := NewScanner(source)
	list := scanner.ScanTokens()
	for _, item := range list {
		fmt.Println(item.toString())
	}
}

func repl() {
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
	len := len(os.Args)
	if len == 1 {
		repl()
	} else if len == 2 {
		funFile(os.Args[1])
	} else {
		fmt.Println("Usage: glox [path]")
		os.Exit(64)
	}
}
