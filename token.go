package main

import (
	"fmt"
	"strconv"
)

type TokenType int

const (
	LeftParen    TokenType = iota // (
	RightParen                    // )
	leftBrace                     // {
	RightBrace                    // }
	LeftSquare                    // [
	RightSquare                   // ]
	COMMA                         // ,
	DOT                           // .
	MINUS                         // -
	MinusMinus                    // --i
	PLUS                          // +
	PlusPlus                      // ++
	SEMICOLON                     // ;
	COLON                         // :
	SLASH                         // /
	STAR                          // *
	PERCENT                       // %
	MARK                          // ?
	BANG                          // one or two character tokens !
	BangEqual                     // !=
	EQUAL                         // =
	EqualEqual                    // ==
	GREATER                       // >
	GreaterEqual                  // >=
	LESS                          // <
	LessEqual                     // <=
	IDENTIFIER                    // Literals
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
	BitAnd
	BitOr
	PRINT
	RETURN
	SUPER
	THIS
	VAR // variable
	DO  // do while
	WHILE
	EOF // end
	LineComment
)

func literalTypeToString(text any) string {
	switch data := text.(type) {
	case nil:
		return "null"
	case string:
		return data
	case float64:
		return strconv.FormatFloat(data, 'f', 10, 64)
	case int64:
		return strconv.FormatInt(data, 10)
	case bool:
		{
			if data {
				return "true"
			}
			return "false"
		}
	default:
		return ""
	}
}

type Token struct {
	tokenType TokenType
	lexeme    string
	line      int
}

func (token *Token) String() string {
	return fmt.Sprintf("tokenType: %s, lexeme: %s, line: %d", strconv.Itoa(int(token.tokenType)), token.lexeme, token.line)
}
