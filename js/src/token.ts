import { TokenType } from './tokenType';
export type LiteralType = null | string | number;
class Token {
  readonly type: TokenType;
  readonly lexeme: string;
  readonly literal: LiteralType;
  readonly line: number;

  constructor(type: TokenType, lexeme: string, literal: LiteralType, line: number) {
    this.type = type;
    this.lexeme = lexeme;
    this.literal = literal;
    this.line = line;
  }

  public toString() {
    return this.type + ' ' + this.lexeme + ' ' + this.literal;
  }
}
export default Token;
