package main

import "strconv"

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
	INTEGER
	FLOAT
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
)

type LiteralType interface{}

func literalTypeToString(text LiteralType) string {
	switch data := text.(type) {
	case nil:
		return ""
	case string:
		return data
	case int64:
		return strconv.FormatInt(data, 10)
	case float64:
		return strconv.FormatFloat(data, 'f', 10, 64)
	default:
		return "literalTypeToString: not handle type"
	}
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

type ExpressionType string

type VisitorType interface{}

type Statement interface {
	accept(visitor VisitorType) ExpressionType
}

type Expression interface {
	accept(visitor VisitorType) ExpressionType
}
