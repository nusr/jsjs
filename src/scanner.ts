import Token from './token';
import { TokenType } from './tokenType';
const EMPTY_DATA = '\0';

class Scanner {
  readonly source: string[];
  readonly tokens: Token[] = [];
  readonly errors: string[] = [];
  static readonly keywordMap: Map<string, TokenType> = new Map([
    ['class', TokenType.CLASS],
    ['else', TokenType.ELSE],
    ['false', TokenType.FALSE],
    ['for', TokenType.FOR],
    ['function', TokenType.FUNCTION],
    ['if', TokenType.IF],
    ['null', TokenType.NULL],
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
    this.source = [...text];
  }
  scanTokens = () => {
    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }
    this.tokens.push(new Token(TokenType.EOF, '', this.line));
    return this.tokens;
  };
  private addError = (line: number, message: string) => {
    const msg = `line: ${line}],scanner error : ${message} `;
    this.errors.push(msg);
  };
  private isAtEnd() {
    return this.current >= this.source.length;
  }
  private substr(start = this.start, end = this.current): string {
    return this.source.slice(start, end).join('');
  }
  private addOneToken(type: TokenType, value = this.substr()) {
    this.tokens.push(new Token(type, value, this.line));
  }
  private getChar(index: number) {
    return this.source[index] as string;
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
        this.addOneToken(TokenType.LEFT_PAREN);
        break;
      case ')':
        this.addOneToken(TokenType.RIGHT_PAREN);
        break;
      case '{':
        this.addOneToken(TokenType.lEFT_BRACE);
        break;
      case '}':
        this.addOneToken(TokenType.RIGHT_BRACE);
        break;
      case ',':
        this.addOneToken(TokenType.COMMA);
        break;
      case '.':
        this.addOneToken(TokenType.DOT);
        break;
      case '-':
        if (this.match('+')) {
          this.addOneToken(TokenType.MINUS_MINUS);
        } else {
          this.addOneToken(TokenType.MINUS);
        }
        break;
      case '+':
        if (this.match('+')) {
          this.addOneToken(TokenType.PLUS_PLUS);
        } else {
          this.addOneToken(TokenType.PLUS);
        }
        break;
      case ';':
        this.addOneToken(TokenType.SEMICOLON);
        break;
      case '*':
        this.addOneToken(TokenType.STAR);
        break;
      case '!':
        this.addOneToken(this.match('=') ? TokenType.BANG_EQUAL : TokenType.BANG);
        break;
      case '=':
        this.addOneToken(
          this.match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL,
        );
        break;
      case '>':
        this.addOneToken(
          this.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER,
        );
        break;
      case '<':
        this.addOneToken(this.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS);
        break;
      case '/':
        // single line comment
        if (this.match('/')) {
          while (this.peek() !== '\n' && !this.isAtEnd()) {
            this.advance();
          }
          // if (isTestEnv()) {
          // const text = this.substr()
          // if (text.includes('expect:')) {
          // const t = text.split(':').pop() || '';
          // if (t.trim()) {
          // globalExpect.addCase(t.trim());
          // }
          // }
          // }
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
            this.addError(
              this.line,
              'multiple line comment end error',
            );
          }
          this.advance(); // skip *
          this.advance(); // skip /
        } else {
          this.addOneToken(TokenType.SLASH);
        }
        break;
      case '|':
        if (this.match('|')) {
          this.addOneToken(TokenType.OR);
        } else {
          this.addOneToken(TokenType.BIT_OR);
        }
        break;
      case '&':
        if (this.match('&')) {
          this.addOneToken(TokenType.AND);
        } else {
          this.addOneToken(TokenType.BIT_AND);
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
          this.addError(this.line, `Unexpected character: ${c}`);
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
      this.addError(this.line, 'Unterminated string');
      return;
    }
    this.advance();
    const value = this.substr(this.start + 1, this.current - 1);
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
    this.addOneToken(TokenType.NUMBER);
  }
  private identifier() {
    while (this.isAlphaNumeric(this.peek())) {
      this.advance();
    }
    const text = this.substr();
    const temp = Scanner.keywordMap.get(text);
    let type: TokenType = TokenType.IDENTIFIER;
    if (temp !== undefined) {
      type = temp;
    }
    this.addOneToken(type);
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
