import Token from './token';
import { TokenType } from './tokenType';
import { defaultErrorHandler } from './error';
import type { LiteralType } from './type';
import { isTestEnv } from './util';
const EMPTY_DATA = '\0';

class Scanner {
  readonly source: string;
  readonly tokens: Token[] = [];
  static readonly keywordMap: Map<string, TokenType> = new Map([
    ['class', TokenType.CLASS],
    ['else', TokenType.ELSE],
    ['false', TokenType.FALSE],
    ['for', TokenType.FOR],
    ['fun', TokenType.FUN],
    ['if', TokenType.IF],
    ['null', TokenType.NIL],
    ['print', TokenType.PRINT],
    ['return', TokenType.RETURN],
    ['super', TokenType.SUPER],
    ['this', TokenType.THIS],
    ['true', TokenType.TRUE],
    ['var', TokenType.VAR],
    ['while', TokenType.WHILE],
  ]);
  private start = 0;
  private current = 0;
  private line = 1;

  constructor(text: string) {
    this.source = text;
  }
  scanTokens = () => {
    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }
    this.tokens.push(new Token(TokenType.EOF, '', null, this.line));
    return this.tokens;
  };
  private isAtEnd() {
    return this.current >= this.source.length;
  }
  private addToken(type: TokenType) {
    this.addOneToken(type, null);
  }
  private addOneToken(type: TokenType, literal: LiteralType) {
    const text = this.source.substring(this.start, this.current);
    this.tokens.push(new Token(type, text, literal, this.line));
  }
  private getChar(index: number) {
    return this.source.charAt(index);
  }
  private peek() {
    if (this.isAtEnd()) {
      return EMPTY_DATA;
    }
    return this.getChar(this.current);
  }
  private peekNext() {
    if (this.current + 1 < this.source.length) {
      return this.getChar(this.current + 1);
    }
    return EMPTY_DATA;
  }
  private match(expected: string) {
    if (this.isAtEnd()) {
      return false;
    }
    if (this.getChar(this.current) !== expected) {
      return false;
    }

    this.current++;
    return true;
  }
  private advance() {
    return this.getChar(this.current++);
  }
  private scanToken() {
    const c = this.advance();
    switch (c) {
      case '(':
        this.addToken(TokenType.LEFT_PAREN);
        break;
      case ')':
        this.addToken(TokenType.RIGHT_PAREN);
        break;
      case '{':
        this.addToken(TokenType.lEFT_BRACE);
        break;
      case '}':
        this.addToken(TokenType.RIGHT_BRACE);
        break;
      case ',':
        this.addToken(TokenType.COMMA);
        break;
      case '.':
        this.addToken(TokenType.DOT);
        break;
      case '-':
        this.addToken(TokenType.MINUS);
        break;
      case '+':
        this.addToken(TokenType.PLUS);
        break;
      case ';':
        this.addToken(TokenType.SEMICOLON);
        break;
      case '*':
        this.addToken(TokenType.STAR);
        break;
      case '!':
        this.addToken(this.match('=') ? TokenType.BANG_EQUAL : TokenType.BANG);
        break;
      case '=':
        this.addToken(
          this.match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL,
        );
        break;
      case '>':
        this.addToken(
          this.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER,
        );
        break;
      case '<':
        this.addToken(this.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS);
        break;
      case '/':
        // single line comment
        if (this.match('/')) {
          while (this.peek() !== '\n' && !this.isAtEnd()) {
            this.advance();
          }
          if (isTestEnv()) {
            const text = this.source.substring(this.start, this.current);
            if (text.includes('expect:')) {
              const t = text.split(':').pop() || '';
              if (t.trim()) {
                this.tokens.push(
                  new Token(TokenType.LINE_COMMENT, t.trim(), null, this.line),
                );
              }
            }
          }
        } else if (this.match('*')) {
          /* multiple line comments */
          while (
            !(
              (this.peek() === '*' && this.peekNext() === '/') ||
              this.isAtEnd()
            )
          ) {
            this.advance();
          }
          if (this.peekNext() !== '/') {
            defaultErrorHandler.error(
              this.line,
              'multiple line comment end error',
            );
          }
          this.advance(); // skip *
          this.advance(); // skip /
        } else {
          this.addToken(TokenType.SLASH);
        }
        break;
      case '|':
        if (this.match('|')) {
          this.addToken(TokenType.OR);
        } else {
          this.addToken(TokenType.BIT_OR);
        }
        break;
      case '&':
        if (this.match('&')) {
          this.addToken(TokenType.AND);
        } else {
          this.addToken(TokenType.BIT_AND);
        }
        break;
      case ' ':
      case '\r':
      case '\t':
        // whitespace
        break;
      case '\n':
        this.line++;
        break;
      case '"':
        this.string();
        break;
      default:
        if (this.isDigit(c)) {
          this.number();
        } else if (this.isAlpha(c)) {
          this.identifier();
        } else {
          defaultErrorHandler.error(this.line, `Unexpected character: ${c}`);
        }
        break;
    }
  }
  private string() {
    while (this.peek() !== '"' && !this.isAtEnd()) {
      if (this.peek() === '\n') {
        this.line++;
      }
      this.advance();
    }
    if (this.isAtEnd()) {
      defaultErrorHandler.error(this.line, 'Unterminated string');
      return;
    }
    this.advance();
    const value = this.source.substring(this.start + 1, this.current - 1);
    this.addOneToken(TokenType.STRING, value);
  }
  private number() {
    while (this.isDigit(this.peek())) {
      this.advance();
    }
    if (this.peek() === '.' && this.isDigit(this.peekNext())) {
      this.advance();
      while (this.isDigit(this.peek())) {
        this.advance();
      }
    }
    const value = this.source.substring(this.start, this.current);
    this.addOneToken(TokenType.NUMBER, parseFloat(value));
  }
  private identifier() {
    while (this.isAlphaNumeric(this.peek())) {
      this.advance();
    }
    const text = this.source.substring(this.start, this.current);
    const temp = Scanner.keywordMap.get(text);
    let type: TokenType = TokenType.IDENTIFIER;
    if (temp !== undefined) {
      type = temp;
    }
    this.addToken(type);
  }
  private isAlphaNumeric(c: string) {
    return this.isAlpha(c) || this.isDigit(c);
  }
  private isAlpha(c: string) {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_';
  }
  private isDigit(char: string) {
    return char >= '0' && char <= '9';
  }
}
export default Scanner;
