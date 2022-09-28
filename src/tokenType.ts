export enum TokenType {
  // single-character tokens
  LEFT_BRACKET, // (
  RIGHT_BRACKET, // )
  lEFT_BRACE, // {
  RIGHT_BRACE, // }
  LEFT_SQUARE_BRACKET, // [
  RIGHT_SQUARE_BRACKET, // ]
  COMMA, // ,
  DOT, // .
  COLON, //
  MINUS, // -
  MINUS_MINUS, // --
  PLUS, // +
  PLUS_PLUS, // ++
  SEMICOLON, // ;
  SLASH, // /
  STAR, // *
  STAR_STAR, // **
  REMAINDER, // %

  // one or two character tokens
  BANG, // !
  BANG_EQUAL, // !=
  BANG_EQUAL_EQUAL, // !==
  EQUAL_EQUAL, // ==
  EQUAL_EQUAL_EQUAL, // ===
  GREATER, // >
  GREATER_EQUAL, // >=
  LESS, // <
  LESS_EQUAL, // <=
  // EQUAL
  EQUAL, // =
  PLUS_EQUAL, // +=
  MINUS_EQUAL, // -=
  STAR_EQUAL, // *=
  SLASH_EQUAL, // /=
  STAR_STAR_EQUAL, // **=
  REMAINDER_EQUAL, // %=
  LEFT_SHIFT_EQUAL, // <<=
  RIGHT_SHIFT_EQUAL, // >>=
  UNSIGNED_RIGHT_SHIFT_EQUAL, // >>>=
  BIT_AND_EQUAL, // &=
  BIT_X_OR_EQUAL, // ^=
  BIT_OR_EQUAL, // |=
  AND_EQUAL, // &&=
  OR_EQUAL, // ||=
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
  BIT_AND, // &
  BIT_OR, // |
  BIT_X_OR, // ^
  BIT_NOT, // ~
  RETURN,
  SUPER,
  THIS,
  VAR, // variable
  WHILE,
  DO_WHILE, // do while
  NEW, // new
  STATIC, // static
  CONSTRUCTOR, // constructor
  UNDEFINED, // undefined
  EXTENDS, // extends
  LEFT_SHIFT, // <<
  RIGHT_SHIFT, // >>
  UNSIGNED_RIGHT_SHIFT, // >>>
  TYPEOF, // typeof
  DELETE, // delete
  VOID, // void
  IN, // in
  INSTANCE_OF, // instanceof
  EOF, // end
}
