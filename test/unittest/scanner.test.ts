import Scanner from "../../src/scanner";
import Token from "../../src/token";
import { TokenType } from "../../src/tokenType";
import * as fs from 'fs';
import *  as path from 'path';

let inputData = '';
beforeAll(() => {
  inputData = fs.readFileSync(path.join(__dirname, 'testData.js'), 'utf-8');
})

describe("scanner.test.ts", () => {
  test('scan tokens', () => {

    const exepctTokens: Token[] = [
      new Token(TokenType.VAR, "var", 1),
      new Token(TokenType.IDENTIFIER, "a", 1),
      new Token(TokenType.EQUAL, "=", 1),
      new Token(TokenType.STRING, "a", 1),
      new Token(TokenType.SEMICOLON, ";", 1),
      new Token(TokenType.FUNCTION, "function", 6),
      new Token(TokenType.IDENTIFIER, "add", 6),
      new Token(TokenType.LEFT_PAREN, "(", 6),
      new Token(TokenType.IDENTIFIER, "x", 6),
      new Token(TokenType.COMMA, ",", 6),
      new Token(TokenType.IDENTIFIER, "y", 6),
      new Token(TokenType.RIGHT_PAREN, ")", 6),
      new Token(TokenType.lEFT_BRACE, "{", 6),
      new Token(TokenType.RETURN, "return", 7),
      new Token(TokenType.IDENTIFIER, "x", 7),
      new Token(TokenType.PLUS, "+", 7),
      new Token(TokenType.IDENTIFIER, "y", 7),
      new Token(TokenType.SEMICOLON, ";", 7),
      new Token(TokenType.RIGHT_BRACE, "}", 8),
      new Token(TokenType.VAR, "var", 9),
      new Token(TokenType.IDENTIFIER, "cond", 9),
      new Token(TokenType.EQUAL, "=", 9),
      new Token(TokenType.IDENTIFIER, "add", 9),
      new Token(TokenType.LEFT_PAREN, "(", 9),
      new Token(TokenType.NUMBER, "1", 9),
      new Token(TokenType.COMMA, ",", 9),
      new Token(TokenType.NUMBER, "2", 9),
      new Token(TokenType.STAR, "*", 9),
      new Token(TokenType.NUMBER, "3", 9),
      new Token(TokenType.RIGHT_PAREN, ")", 9),
      new Token(TokenType.SEMICOLON, ";", 9),
      new Token(TokenType.IDENTIFIER, "cond", 10),
      new Token(TokenType.SEMICOLON, ";", 10),
      new Token(TokenType.IF, "if", 11),
      new Token(TokenType.LEFT_PAREN, "(", 11),
      new Token(TokenType.IDENTIFIER, "cond", 11),
      new Token(TokenType.RIGHT_PAREN, ")", 11),
      new Token(TokenType.lEFT_BRACE, "{", 11),
      new Token(TokenType.IDENTIFIER, "a", 12),
      new Token(TokenType.EQUAL, "=", 12),
      new Token(TokenType.STRING, "b", 12),
      new Token(TokenType.SEMICOLON, ";", 12),
      new Token(TokenType.RIGHT_BRACE, "}", 13),
      new Token(TokenType.ELSE, "else", 13),
      new Token(TokenType.lEFT_BRACE, "{", 13),
      new Token(TokenType.IDENTIFIER, "a", 14),
      new Token(TokenType.EQUAL, "=", 14),
      new Token(TokenType.STRING, "c", 14),
      new Token(TokenType.SEMICOLON, ";", 14),
      new Token(TokenType.RIGHT_BRACE, "}", 15),
      new Token(TokenType.IDENTIFIER, "a", 16),
      new Token(TokenType.SEMICOLON, ";", 16),
      new Token(TokenType.EOF, "", 16),
    ]

    expect(new Scanner(inputData).scanTokens()).toEqual(exepctTokens);
  })
});
