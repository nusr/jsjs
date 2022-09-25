import { TokenType } from './tokenType';
class Token {
  readonly type: TokenType;
  readonly lexeme: string;
  readonly line: number;

  constructor(type: TokenType, lexeme: string, line: number) {
    this.type = type;
    this.lexeme = lexeme;
    this.line = line;
  }

  toString() {
    if (this.type === TokenType.STRING) {
      return `'${this.lexeme}'`;
    }
    return this.lexeme;
  }
}

export default Token;
