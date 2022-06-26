package main

import (
	"fmt"
	"strings"
)

const (
	EMPTY_DATA = 0
)

var KEYWORD_MAP = map[string]TokenType{
	"class":    CLASS,
	"else":     ELSE,
	"false":    FALSE,
	"for":      FOR,
	"function": FUNCTION,
	"if":       IF,
	"null":     NULL,
	"print":    PRINT,
	"return":   RETURN,
	"super":    SUPER,
	"this":     THIS,
	"true":     TRUE,
	"var":      VAR,
	"while":    WHILE,
	"do":       DO,
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

func (scanner *Scanner) addOneToken(tokenType TokenType) {
	text := scanner.getSubString(scanner.start, scanner.current)
	scanner.appendToken(tokenType, text)
}

func (scanner *Scanner) appendToken(tokenType TokenType, text string) {
	scanner.tokens = append(scanner.tokens, &Token{
		tokenType: tokenType,
		lexeme:    text,
		line:      scanner.line,
	})
}

func (scanner *Scanner) addToken(tokenType TokenType) {
	scanner.addOneToken(tokenType)
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
	return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c == '\\' || c == '_' || c == '$' || c == '#' || (c >= '\u4e00' && c <= '\u9fa5')
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
		scanner.addToken(FLOAT64)
	} else {
		scanner.addToken(INT64)
	}

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
	scanner.appendToken(STRING, text)
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
		if scanner.match('+') {
			scanner.addToken(MINUS_MINUS)
		} else {
			scanner.addToken(MINUS)
		}
	case '+':
		if scanner.match('+') {
			scanner.addToken(PLUS_PLUS)
		} else {
			scanner.addToken(PLUS)
		}
	case ';':
		scanner.addToken(SEMICOLON)
	case ':':
		scanner.addToken(COLON)
	case '%':
		scanner.addToken(PERCENT)
	case '?':
		scanner.addToken(MARK)
	case '&':
		if scanner.match('&') {
			scanner.addToken(AND)
		} else {
			scanner.addToken(BIT_AND)
		}
	case '|':
		if scanner.match('|') {
			scanner.addToken(OR)
		} else {
			scanner.addToken(BIT_OR)
		}
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
			text := scanner.getSubString(scanner.start, scanner.current)
			if strings.Contains(text, "expect:") {
				scanner.appendToken(LINE_COMMENT, text)
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
	scanner.appendToken(EOF, "")
	return scanner.tokens
}
