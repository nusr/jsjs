import { TokenType } from './tokenType';
import type { LiteralType } from './type';
class Token {
  readonly type: TokenType;
  readonly lexeme: string;
  readonly literal: LiteralType;
  readonly line: number;

  constructor(
    type: TokenType,
    lexeme: string,
    literal: LiteralType,
    line: number,
  ) {
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
