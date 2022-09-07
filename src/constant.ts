import { TokenType } from './tokenType';

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
  ['this', TokenType.THIS],
  ['true', TokenType.TRUE],
  ['var', TokenType.VAR],
  ['while', TokenType.WHILE],
])

export const EMPTY_DATA = '\0';