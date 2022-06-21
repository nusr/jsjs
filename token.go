package main

import (
	"fmt"
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
	PERCENT                        // %
	MARK                           // ?
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
	FLOAT64
	INT64
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
	BIT_AND
	BIT_OR
	PRINT
	RETURN
	SUPER
	THIS
	VAR // variable
	WHILE
	EOF // end
	LINE_COMMENT
)

type LiteralType interface{}

func literalTypeToString(text LiteralType) string {
	switch data := text.(type) {
	case nil:
		return "null"
	case string:
		return data
	case float64:
		return strconv.FormatFloat(data, 'f', 10, 64)
	case int64:
		return strconv.FormatInt(data, 10)
	default:
		return ""
	}
	return ""
}

type Token struct {
	tokenType TokenType
	lexeme    string
	line      int
}

func (token *Token) String() string {
	return fmt.Sprintf("tokenType: %s, lexeme: %s, line: %d", strconv.Itoa(int(token.tokenType)), token.lexeme, token.line)
}
