import { TokenType } from './tokenType';
// await break case catch class const continue debugger default delete do else enum export extends false finally for function if import in instanceof new null return super switch this throw true try typeof var void while with yield
export const KEYWORD_MAP: Map<string, TokenType> = new Map([
  ['class', TokenType.CLASS],
  ['else', TokenType.ELSE],
  ['false', TokenType.FALSE],
  ['for', TokenType.FOR],
  ['function', TokenType.FUNCTION],
  ['if', TokenType.IF],
  ['null', TokenType.NULL],
  ['return', TokenType.RETURN],
  ['super', TokenType.SUPER],
  // ['this', TokenType.THIS],
  ['true', TokenType.TRUE],
  ['var', TokenType.VAR],
  ['while', TokenType.WHILE],
  ['do', TokenType.DO_WHILE],
  ['new', TokenType.NEW],
  ['static', TokenType.STATIC],
  ['undefined', TokenType.UNDEFINED]
])

export const EMPTY_DATA = '\0';