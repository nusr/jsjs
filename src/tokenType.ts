export enum TokenType {
  // single-character tokens
  LEFT_PAREN, // (
  RIGHT_PAREN, // )
  lEFT_BRACE, // {
  RIGHT_BRACE, // }
  COMMA, // ,
  DOT, // .
  MINUS, // -
  MINUS_MINUS, // --
  PLUS, // +
  PLUS_PLUS, // ++
  SEMICOLON, // ;
  SLASH, // /
  STAR, // *
  REMAINDER, // %

  // one or two character tokens
  BANG, // !
  BANG_EQUAL, // !=
  BANG_EQUAL_EQUAL, // !==
  EQUAL, // =
  EQUAL_EQUAL, // ==
  EQUAL_EQUAL_EQUAL, // ===
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
  FUNCTION,
  FOR,
  IF,
  NULL, // null
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
}
