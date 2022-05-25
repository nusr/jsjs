#include <string.h>
#include "scanner.h"
#include "common.h"

Scanner scanner;

static bool isAtEnd()
{
  return *scanner.current == '\0';
}
static Token makeToken(TokenType type)
{
  Token token;
  token.type = type;
  token.length = (int)(scanner.current - scanner.start);
  token.start = scanner.start;
  token.line = scanner.line;
  return token;
}
static Token errorToken(const char *message)
{
  Token token;
  token.type = TOKEN_ERROR;
  token.start = message;
  token.length = (int)strlen(message);
  token.line = scanner.line;
  return token;
}

static bool match(char expected)
{
  if (isAtEnd())
  {
    return false;
  }
  if (*scanner.current != expected)
  {
    return false;
  }
  scanner.current++;
  return true;
}

static char peek()
{
  if (isAtEnd())
  {
    return '\0';
  }
  return *scanner.current;
}

static char peekNext()
{
  if (isAtEnd())
  {
    return '\0';
  }
  return scanner.current[1];
}

static bool isDigit(char c)
{
  return c >= '0' && c <= '9';
}
static bool isAlpha(char c)
{
  return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c == '_';
}

static char advance()
{
  char c = *scanner.current;
  scanner.current++;
  return c;
}

static Token number()
{
  while (isDigit(peek()))
  {
    advance();
  }
  if (peek() == '.')
  {
    advance();
    while (isDigit(peek()))
    {
      advance();
    }
  }

  return makeToken(TOKEN_NUMBER);
}

static void skipWhiteSpace()
{

  for (;;)
  {
    switch (peek())
    {
    case ' ':
    case '\r':
    case '\t':
    {
      advance();
      break;
    }
    default:
      return;
    }
  }
}

static Token string()
{
  while (peek() != '"' && !isAtEnd())
  {
    if (peek() == '\n')
    {
      scanner.line++;
    }
    advance();
  }
  if (isAtEnd())
  {
    return errorToken("unterminated string");
  }
  advance();
  return makeToken(TOKEN_STRING);
}

static TokenType checkKeyword(int start, int rest, const char *data, TokenType type)
{
  if (scanner.current - scanner.start == start + rest && memcmp(scanner.start + start, data, rest * sizeof(char)) == 0)
  {
    return type;
  }
  return TOKEN_IDENTIFIER;
}

static TokenType makeTokenType()
{
  while (isAlpha(peek()) || isDigit(peek()))
  {
    advance();
  }
  switch (scanner.start[0])
  {
  case 'a':
    return checkKeyword(1, 2, "nd", TOKEN_AND);
  case 'c':
    return checkKeyword(1, 4, "lass", TOKEN_CLASS);
  case 'e':
    return checkKeyword(1, 3, "lse", TOKEN_ELSE);
  case 'f':
  {
    if (scanner.current - scanner.start > 1)
    {
      switch (scanner.start[1])
      {
      case 'a':
        return checkKeyword(2, 2, "lse", TOKEN_FALSE);
      case 'o':
        return checkKeyword(2, 1, "r", TOKEN_FOR);
      case 'u':
        return checkKeyword(2, 1, "n", TOKEN_FOR);
      }
    }
    break;
  }

  case 'i':
    return checkKeyword(1, 1, "f", TOKEN_IF);
  case 'n':
    return checkKeyword(1, 2, "il", TOKEN_NIL);
  case 'o':
    return checkKeyword(1, 1, "r", TOKEN_OR);
  case 'p':
    return checkKeyword(1, 4, "rint", TOKEN_PRINT);
  case 'r':
    return checkKeyword(1, 4, "eturn", TOKEN_RETURN);
  case 's':
    return checkKeyword(1, 4, "uper", TOKEN_SUPER);
  case 't':
  {
    switch (scanner.start[1])
    {
    case 'h':
      return checkKeyword(2, 2, "is", TOKEN_THIS);
    case 'r':
      return checkKeyword(2, 2, "ue", TOKEN_TRUE);
    }
    break;
  }
  case 'v':
    return checkKeyword(1, 2, "ar", TOKEN_VAR);
  case 'w':
    return checkKeyword(1, 4, "hile", TOKEN_WHILE);
  }
  return TOKEN_IDENTIFIER;
}

void initScanner(const char *source)
{
  scanner.current = source;
  scanner.start = source
  scanner.line = 1;
}
Token scanToken()
{
  skipWhiteSpace();
  scanner.start = scanner.current;
  if (isAtEnd())
  {
    return makeToken(TOKEN_EOF);
  }

  char c = advance();
  if (isAlpha(c))
  {
    return makeToken(makeTokenType());
  }
  if (isDigit(c))
  {
    return number();
  }
  switch (c)
  {
  case '(':
    return makeToken(TOKEN_LEFT_PAREN);
  case ')':
    return makeToken(TOKEN_RIGHT_PAREN);
  case '{':
    return makeToken(TOKEN_LEFT_BRACE);
  case '}':
    return makeToken(TOKEN_RIGHT_BRACE);
  case '.':
    return makeToken(TOKEN_DOT);
  case ';':
    return makeToken(TOKEN_SEMICOLON);
  case ',':
    return makeToken(TOKEN_COMMA);
  case '-':
    return makeToken(TOKEN_MINUS);
  case '+':
    return makeToken(TOKEN_PLUS);
  case '/':
  {
    if (peekNext() == '/')
    {
      advance();
      while (!isAtEnd() && peek() != '\n')
      {
        advance();
      }
      break;
    }
    else
    {
      return makeToken(TOKEN_SLASH);
    }
  }

  case '*':
    return makeToken(TOKEN_STAR);
  case '!':
    return makeToken(match('=') ? TOKEN_BANG_EQUAL : TOKEN_BANG);
  case '>':
    return makeToken(match('>') ? TOKEN_GREATER_EQUAL : TOKEN_GREATER);
  case '<':
    return makeToken(match('<') ? TOKEN_LESS_EQUAL : TOKEN_LESS);
  case '\n':
    scanner.line++;
    advance();
    break;
  case '"':
    return string();
  }
  return errorToken("Unexpected character.");
}
