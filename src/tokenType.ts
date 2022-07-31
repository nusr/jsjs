export enum TokenType {
  // single-character tokens
  LEFT_PAREN, // (
  RIGHT_PAREN, // )
  lEFT_BRACE, // {
  RIGHT_BRACE, // }
  COMMA, // ,
  DOT, // .
  MINUS, // -
  PLUS, // +
  SEMICOLON, // ;
  SLASH, // /
  STAR, // *

  // one or two character tokens
  BANG, // !
  BANG_EQUAL, // !=
  EQUAL, // =
  EQUAL_EQUAL, // ==
  GREATER, // >
  GREATER_EQUAL, // >=
  LESS, // <
  LESS_EQUAL, // <=
  // Literals
  IDENTIFIER,
  STRING,
  NUMBER,
  // keywords
  CLASS,
  ELSE,
  FALSE,
  TRUE,
  FUN,
  FOR,
  IF,
  NIL, // null
  AND,
  OR,
  BIT_AND,
  BIT_OR,
  PRINT,
  RETURN,
  SUPER,
  THIS,
  VAR, // variable
  WHILE,
  DO_WHILE, // do while
  EOF, // end
  LINE_COMMENT,
}
