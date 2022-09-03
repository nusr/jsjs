import type { TokenType } from './tokenType';
class Token {
  readonly type: TokenType;
  readonly lexeme: string;
  readonly line: number;

  constructor(
    type: TokenType,
    lexeme: string,
    line: number,
  ) {
    this.type = type;
    this.lexeme = lexeme;
    this.line = line;
  }

  public toString() {
    return this.lexeme;
  }
}

export default Token;
