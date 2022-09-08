import Scanner from '../../src/scanner';
import Token from '../../src/token';
import { TokenType } from '../../src/tokenType';
import * as fs from 'fs';
import * as path from 'path';

let inputData = '';
beforeAll(() => {
  inputData = fs.readFileSync(path.join(__dirname, 'testData.js'), 'utf-8');
});

describe('scanner.test.ts', () => {
  test('scan tokens', () => {
    const exepctTokens: Token[] = [
      new Token(TokenType.VAR, 'var', 1),
      new Token(TokenType.IDENTIFIER, 'a', 1),
      new Token(TokenType.EQUAL, '=', 1),
      new Token(TokenType.STRING, 'a', 1),
      new Token(TokenType.SEMICOLON, ';', 1),

      new Token(TokenType.FUNCTION, 'function', 6),
      new Token(TokenType.IDENTIFIER, 'add', 6),
      new Token(TokenType.LEFT_PAREN, '(', 6),
      new Token(TokenType.IDENTIFIER, 'x', 6),
      new Token(TokenType.COMMA, ',', 6),
      new Token(TokenType.IDENTIFIER, 'y', 6),
      new Token(TokenType.RIGHT_PAREN, ')', 6),
      new Token(TokenType.lEFT_BRACE, '{', 6),
      new Token(TokenType.RETURN, 'return', 7),
      new Token(TokenType.IDENTIFIER, 'x', 7),
      new Token(TokenType.PLUS, '+', 7),
      new Token(TokenType.IDENTIFIER, 'y', 7),
      new Token(TokenType.SEMICOLON, ';', 7),
      new Token(TokenType.RIGHT_BRACE, '}', 8),

      new Token(TokenType.VAR, 'var', 9),
      new Token(TokenType.IDENTIFIER, 'cond', 9),
      new Token(TokenType.EQUAL, '=', 9),
      new Token(TokenType.IDENTIFIER, 'add', 9),
      new Token(TokenType.LEFT_PAREN, '(', 9),
      new Token(TokenType.NUMBER, '1', 9),
      new Token(TokenType.COMMA, ',', 9),
      new Token(TokenType.NUMBER, '2', 9),
      new Token(TokenType.STAR, '*', 9),
      new Token(TokenType.NUMBER, '3', 9),
      new Token(TokenType.RIGHT_PAREN, ')', 9),
      new Token(TokenType.SEMICOLON, ';', 9),

      new Token(TokenType.IDENTIFIER, 'log', 10),
      new Token(TokenType.LEFT_PAREN, '(', 10),
      new Token(TokenType.IDENTIFIER, 'cond', 10),
      new Token(TokenType.RIGHT_PAREN, ')', 10),
      new Token(TokenType.SEMICOLON, ';', 10),

      new Token(TokenType.IF, 'if', 11),
      new Token(TokenType.LEFT_PAREN, '(', 11),
      new Token(TokenType.IDENTIFIER, 'cond', 11),
      new Token(TokenType.RIGHT_PAREN, ')', 11),
      new Token(TokenType.lEFT_BRACE, '{', 11),
      new Token(TokenType.IDENTIFIER, 'a', 12),
      new Token(TokenType.EQUAL, '=', 12),
      new Token(TokenType.STRING, 'b', 12),
      new Token(TokenType.SEMICOLON, ';', 12),
      new Token(TokenType.RIGHT_BRACE, '}', 13),
      new Token(TokenType.ELSE, 'else', 13),
      new Token(TokenType.lEFT_BRACE, '{', 13),
      new Token(TokenType.IDENTIFIER, 'a', 14),
      new Token(TokenType.EQUAL, '=', 14),
      new Token(TokenType.STRING, 'c', 14),
      new Token(TokenType.SEMICOLON, ';', 14),
      new Token(TokenType.RIGHT_BRACE, '}', 15),

      new Token(TokenType.IDENTIFIER, 'log', 16),
      new Token(TokenType.LEFT_PAREN, '(', 16),
      new Token(TokenType.IDENTIFIER, 'a', 16),
      new Token(TokenType.RIGHT_PAREN, ')', 16),
      new Token(TokenType.SEMICOLON, ';', 16),

      new Token(TokenType.FUNCTION, 'function', 18),
      new Token(TokenType.IDENTIFIER, 'makeCounter', 18),
      new Token(TokenType.LEFT_PAREN, '(', 18),
      new Token(TokenType.RIGHT_PAREN, ')', 18),
      new Token(TokenType.lEFT_BRACE, '{', 18),
      new Token(TokenType.VAR, 'var', 19),
      new Token(TokenType.IDENTIFIER, 'i', 19),
      new Token(TokenType.EQUAL, '=', 19),
      new Token(TokenType.NUMBER, '0', 19),
      new Token(TokenType.SEMICOLON, ';', 19),

      new Token(TokenType.FUNCTION, 'function', 20),
      new Token(TokenType.IDENTIFIER, 'count', 20),
      new Token(TokenType.LEFT_PAREN, '(', 20),
      new Token(TokenType.RIGHT_PAREN, ')', 20),
      new Token(TokenType.lEFT_BRACE, '{', 20),
      new Token(TokenType.IDENTIFIER, 'i', 21),
      new Token(TokenType.EQUAL, '=', 21),
      new Token(TokenType.IDENTIFIER, 'i', 21),
      new Token(TokenType.PLUS, '+', 21),
      new Token(TokenType.NUMBER, '1', 21),
      new Token(TokenType.SEMICOLON, ';', 21),

      new Token(TokenType.IDENTIFIER, 'log', 22),
      new Token(TokenType.LEFT_PAREN, '(', 22),
      new Token(TokenType.IDENTIFIER, 'i', 22),
      new Token(TokenType.RIGHT_PAREN, ')', 22),
      new Token(TokenType.SEMICOLON, ';', 22),

      new Token(TokenType.RIGHT_BRACE, '}', 23),
      new Token(TokenType.RETURN, 'return', 25),
      new Token(TokenType.IDENTIFIER, 'count', 25),
      new Token(TokenType.SEMICOLON, ';', 25),
      new Token(TokenType.RIGHT_BRACE, '}', 26),

      new Token(TokenType.VAR, 'var', 28),
      new Token(TokenType.IDENTIFIER, 'counter', 28),
      new Token(TokenType.EQUAL, '=', 28),
      new Token(TokenType.IDENTIFIER, 'makeCounter', 28),
      new Token(TokenType.LEFT_PAREN, '(', 28),
      new Token(TokenType.RIGHT_PAREN, ')', 28),
      new Token(TokenType.SEMICOLON, ';', 28),
      new Token(TokenType.IDENTIFIER, 'counter', 29),
      new Token(TokenType.LEFT_PAREN, '(', 29),
      new Token(TokenType.RIGHT_PAREN, ')', 29),
      new Token(TokenType.SEMICOLON, ';', 29),
      new Token(TokenType.IDENTIFIER, 'counter', 30),
      new Token(TokenType.LEFT_PAREN, '(', 30),
      new Token(TokenType.RIGHT_PAREN, ')', 30),
      new Token(TokenType.SEMICOLON, ';', 30),

      new Token(TokenType.VAR, 'var', 31),
      new Token(TokenType.IDENTIFIER, 'n', 31),
      new Token(TokenType.EQUAL, '=', 31),
      new Token(TokenType.NUMBER, '1', 31),
      new Token(TokenType.SEMICOLON, ';', 31),

      new Token(TokenType.PLUS_PLUS, '++', 32),
      new Token(TokenType.IDENTIFIER, 'n', 32),
      new Token(TokenType.SEMICOLON, ';', 32),

      new Token(TokenType.IDENTIFIER, 'log', 33),
      new Token(TokenType.LEFT_PAREN, '(', 33),
      new Token(TokenType.IDENTIFIER, 'n', 33),
      new Token(TokenType.RIGHT_PAREN, ')', 33),
      new Token(TokenType.SEMICOLON, ';', 33),

      new Token(TokenType.MINUS_MINUS, '--', 34),
      new Token(TokenType.IDENTIFIER, 'n', 34),
      new Token(TokenType.SEMICOLON, ';', 34),

      new Token(TokenType.IDENTIFIER, 'log', 35),
      new Token(TokenType.LEFT_PAREN, '(', 35),
      new Token(TokenType.IDENTIFIER, 'n', 35),
      new Token(TokenType.RIGHT_PAREN, ')', 35),
      new Token(TokenType.SEMICOLON, ';', 35),

      new Token(TokenType.FUNCTION, 'function', 36),
      new Token(TokenType.IDENTIFIER, 'fib', 36),
      new Token(TokenType.LEFT_PAREN, '(', 36),
      new Token(TokenType.IDENTIFIER, 'n', 36),
      new Token(TokenType.RIGHT_PAREN, ')', 36),
      new Token(TokenType.lEFT_BRACE, '{', 36),

      new Token(TokenType.IF, 'if', 37),
      new Token(TokenType.LEFT_PAREN, '(', 37),
      new Token(TokenType.IDENTIFIER, 'n', 37),
      new Token(TokenType.LESS_EQUAL, '<=', 37),
      new Token(TokenType.NUMBER, '1', 37),
      new Token(TokenType.RIGHT_PAREN, ')', 37),
      new Token(TokenType.RETURN, 'return', 37),
      new Token(TokenType.IDENTIFIER, 'n', 37),
      new Token(TokenType.SEMICOLON, ';', 37),

      new Token(TokenType.RETURN, 'return', 38),
      new Token(TokenType.IDENTIFIER, 'fib', 38),
      new Token(TokenType.LEFT_PAREN, '(', 38),
      new Token(TokenType.IDENTIFIER, 'n', 38),
      new Token(TokenType.MINUS, '-', 38),
      new Token(TokenType.NUMBER, '1', 38),
      new Token(TokenType.RIGHT_PAREN, ')', 38),
      new Token(TokenType.PLUS, '+', 38),
      new Token(TokenType.IDENTIFIER, 'fib', 38),
      new Token(TokenType.LEFT_PAREN, '(', 38),
      new Token(TokenType.IDENTIFIER, 'n', 38),
      new Token(TokenType.MINUS, '-', 38),
      new Token(TokenType.NUMBER, '2', 38),
      new Token(TokenType.RIGHT_PAREN, ')', 38),
      new Token(TokenType.SEMICOLON, ';', 38),

      new Token(TokenType.RIGHT_BRACE, '}', 39),

      new Token(TokenType.IDENTIFIER, 'log', 40),
      new Token(TokenType.LEFT_PAREN, '(', 40),
      new Token(TokenType.IDENTIFIER, 'fib', 40),
      new Token(TokenType.LEFT_PAREN, '(', 40),
      new Token(TokenType.NUMBER, '30', 40),
      new Token(TokenType.RIGHT_PAREN, ')', 40),
      new Token(TokenType.RIGHT_PAREN, ')', 40),
      new Token(TokenType.SEMICOLON, ';', 40),

      new Token(TokenType.VAR, 'var', 41),
      new Token(TokenType.IDENTIFIER, 'globalA', 41),
      new Token(TokenType.EQUAL, '=', 41),
      new Token(TokenType.STRING, 'global', 41),
      new Token(TokenType.SEMICOLON, ';', 41),

      new Token(TokenType.lEFT_BRACE, '{', 42),

      new Token(TokenType.FUNCTION, 'function', 43),
      new Token(TokenType.IDENTIFIER, 'showA', 43),
      new Token(TokenType.LEFT_PAREN, '(', 43),
      new Token(TokenType.RIGHT_PAREN, ')', 43),
      new Token(TokenType.lEFT_BRACE, '{', 43),

      new Token(TokenType.IDENTIFIER, 'log', 44),
      new Token(TokenType.LEFT_PAREN, '(', 44),
      new Token(TokenType.IDENTIFIER, 'globalA', 44),
      new Token(TokenType.RIGHT_PAREN, ')', 44),
      new Token(TokenType.SEMICOLON, ';', 44),

      new Token(TokenType.RIGHT_BRACE, '}', 45),

      new Token(TokenType.IDENTIFIER, 'showA', 47),
      new Token(TokenType.LEFT_PAREN, '(', 47),
      new Token(TokenType.RIGHT_PAREN, ')', 47),
      new Token(TokenType.SEMICOLON, ';', 47),

      new Token(TokenType.VAR, 'var', 48),
      new Token(TokenType.IDENTIFIER, 'globalA', 48),
      new Token(TokenType.EQUAL, '=', 48),
      new Token(TokenType.STRING, 'block', 48),
      new Token(TokenType.SEMICOLON, ';', 48),

      new Token(TokenType.IDENTIFIER, 'showA', 49),
      new Token(TokenType.LEFT_PAREN, '(', 49),
      new Token(TokenType.RIGHT_PAREN, ')', 49),
      new Token(TokenType.SEMICOLON, ';', 49),

      new Token(TokenType.RIGHT_BRACE, '}', 50),
      
      new Token(TokenType.CLASS, 'class', 51),
      new Token(TokenType.IDENTIFIER, 'Test', 51),
      new Token(TokenType.lEFT_BRACE, '{', 51),
      
      new Token(TokenType.IDENTIFIER, 'print', 52),
      new Token(TokenType.LEFT_PAREN, '(', 52),
      new Token(TokenType.RIGHT_PAREN, ')', 52),
      new Token(TokenType.lEFT_BRACE, '{', 52),
      
      new Token(TokenType.IDENTIFIER, 'log', 53),
      new Token(TokenType.LEFT_PAREN, '(', 53),
      new Token(TokenType.NUMBER, '1', 53),
      new Token(TokenType.RIGHT_PAREN, ')', 53),
      new Token(TokenType.SEMICOLON, ';', 53),
      
      new Token(TokenType.RIGHT_BRACE, '}', 54),
      new Token(TokenType.RIGHT_BRACE, '}', 55),
      
      new Token(TokenType.VAR, 'var', 56),
      new Token(TokenType.IDENTIFIER, 'a', 56),
      new Token(TokenType.EQUAL, '=', 56),
      new Token(TokenType.NEW, 'new', 56),
      new Token(TokenType.IDENTIFIER, 'Test', 56),
      new Token(TokenType.LEFT_PAREN, '(', 56),
      new Token(TokenType.RIGHT_PAREN, ')', 56),
      new Token(TokenType.SEMICOLON, ';', 56),
      
      new Token(TokenType.IDENTIFIER, 'a', 57),
      new Token(TokenType.DOT, '.', 57),
      new Token(TokenType.IDENTIFIER, 'print', 57),
      new Token(TokenType.LEFT_PAREN, '(', 57),
      new Token(TokenType.RIGHT_PAREN, ')', 57),
      new Token(TokenType.SEMICOLON, ';', 57),

      new Token(TokenType.EOF, '', 57),
    ];

    expect(new Scanner(inputData).scanTokens()).toEqual(exepctTokens);
  });
});