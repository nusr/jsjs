#include <string.h>
#include "scanner.h"
#include "common.h"

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
  return *scanner.current
}

static char peekNext()
{
  if (isAtEnd())
  {
    return '\0';
  }
  return *scanner.current[1];
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

void initScanner(const char *source)
{
  scanner.current = source;
  scanner.start = source;
  scanner.line = 1;
}
Token scanToken()
{
  scanner.start = scanner.current;
  if (isAtEnd())
  {
    return makeToken(TOKEN_EOF);
  }
  const c = advance();
  if (isAlpha(c))
  {
    return makeToken(TOKEN_IDENTIFIER);
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
    return makeToken(match('=') ? makeToken(TOKEN_BANG_EQUAL) : makeToken(TOKEN_BANG));
  case '>':
    return makeToken(match('>') ? makeToken(TOKEN_GREATER_EQUAL) : makeToken(TOKEN_GREATER));
  case '<':
    return makeToken(match('<') ? makeToken(TOKEN_LESS_EQUAL) : makeToken(TOKEN_LESS));
  }
  return errorToken("Unexpected character.");
}