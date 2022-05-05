#ifndef clox_scanner_h
#define clox_scanner_h

#include "common.h"

typedef enum
{
  TOKEN_LEFT_PAREN,  // (
  TOKEN_RIGHT_PAREN, // )
  TOKEN_LEFT_BRACE,  // {
  TOKEN_RIGHT_BRACE, // }
  TOKEN_COMMA,       // ,
  TOKEN_SEMICOLON,   // ;
  TOKEN_DOT,         // .
  TOKEN_MINUS,       // -
  TOKEN_PLUS,        // +
  TOKEN_SLASH,       // /
  TOKEN_STAR,        // *
  TOKEN_BANG,        // !
  TOKEN_BANG_EQUAL,  // !=
  TOKEN_EQUAL,
  TOKEN_EQUAL_EQUAL,
  TOKEN_GREATER,
  TOKEN_GREATER_EQUAL,
  TOKEN_LESS,
  TOKEN_LESS_EQUAL,
  TOKEN_IDENTIFIER,
  TOKEN_STRING,
  TOKEN_NUMBER,
  TOKEN_AND,
  TOKEN_OR,
  TOKEN_TRUE,
  TOKEN_FALSE,
  TOKEN_FOR,
  TOKEN_FUN,
  TOKEN_IF,
  TOKEN_WHILE,
  TOKEN_SUPER,
  TOKEN_CLASS,
  TOKEN_NIL,
  TOKEN_THIS,
  TOKEN_VAR,
  TOKEN_RETURN,
  TOKEN_PRINT,
  TOKEN_ERROR,
  TOKEN_EOF,
  TOKEN_ELSE,
} TokenType;

typedef struct
{
  TokenType type;
  const char *start;
  int length;
  int line;
} Token;

typedef struct
{
  char *current;
  char *start;
  int line;
} Scanner;

void initScanner(const char *source);
Token scanToken();

#endif