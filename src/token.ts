import type { TokenType } from './tokenType';
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

export function convertLiteralTypeToString(val: LiteralType): string {
  if (val === null) {
    return 'null';
  }
  if (typeof val === 'string') {
    return val;
  }
  if (typeof val === 'boolean') {
    return val.toString();
  }
  if (typeof val === 'number') {
    return val.toString();
  }
  if (val && typeof val.toString === 'function') {
    return val.toString();
  }
  return '';
}
export default Token;
