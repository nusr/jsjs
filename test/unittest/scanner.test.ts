import Scanner from '../../src/scanner';
import Token from '../../src/token';
import { TokenType } from '../../src/tokenType';

const inputData = `var a = 'a';
/**
 * @param {number} x
 * @param {number} y
 */
function add(x, y) {
  return x + y;
}
var cond = add(1, 2 * 3);
console.log(cond);
if (cond) {
  a = 'b';
} else {
  a = 'c';
}
console.log(a);

function makeCounter() {
  var i = 0;
  function count() {
    i = i + 1;
    console.log(i);
  }

  return count;
}

var counter = makeCounter();
counter();
counter();
var n = 1;
++n;
console.log(n);
--n;
console.log(n);
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}
console.log(fib(30));
var globalA = 'global';
{
  function showA() {
    console.log(globalA);
  }

  showA();
  var globalA = 'block';
  showA();
}
class Test {
  b = 5;
  print(a) {
      console.log(a);
  }
}
var b = new Test();
b.print(3);
console.log(b.b);
b.b = '9';
console.log(b.b);
b.print = '1';
console.log(b.print);
var c = new Test();
console.log(c.b);
c.print(4);
1==2
1===2
b ??= 1
1 <= 2
1 < 2
1 ^ 2.2
1 ^= 2.2
1 > 2
1 >= 2
`;

type TokenItem = {
  type: TokenType;
  lexeme: string;
};

const getToken = (type: TokenType, lexeme: string): TokenItem => ({
  type,
  lexeme,
});

describe('scanner.test.ts', () => {
  test('scan tokens', () => {
    const expectTokens: TokenItem[] = [
      getToken(TokenType.VAR, 'var'),
      getToken(TokenType.IDENTIFIER, 'a'),
      getToken(TokenType.EQUAL, '='),
      getToken(TokenType.STRING, 'a'),
      getToken(TokenType.SEMICOLON, ';'),

      getToken(TokenType.FUNCTION, 'function'),
      getToken(TokenType.IDENTIFIER, 'add'),
      getToken(TokenType.LEFT_BRACKET, '('),
      getToken(TokenType.IDENTIFIER, 'x'),
      getToken(TokenType.COMMA, ','),
      getToken(TokenType.IDENTIFIER, 'y'),
      getToken(TokenType.RIGHT_BRACKET, ')'),
      getToken(TokenType.lEFT_BRACE, '{'),
      getToken(TokenType.RETURN, 'return'),
      getToken(TokenType.IDENTIFIER, 'x'),
      getToken(TokenType.PLUS, '+'),
      getToken(TokenType.IDENTIFIER, 'y'),
      getToken(TokenType.SEMICOLON, ';'),
      getToken(TokenType.RIGHT_BRACE, '}'),

      getToken(TokenType.VAR, 'var'),
      getToken(TokenType.IDENTIFIER, 'cond'),
      getToken(TokenType.EQUAL, '='),
      getToken(TokenType.IDENTIFIER, 'add'),
      getToken(TokenType.LEFT_BRACKET, '('),
      getToken(TokenType.NUMBER, '1'),
      getToken(TokenType.COMMA, ','),
      getToken(TokenType.NUMBER, '2'),
      getToken(TokenType.STAR, '*'),
      getToken(TokenType.NUMBER, '3'),
      getToken(TokenType.RIGHT_BRACKET, ')'),
      getToken(TokenType.SEMICOLON, ';'),

      getToken(TokenType.IDENTIFIER, 'console'),
      getToken(TokenType.DOT, '.'),
      getToken(TokenType.IDENTIFIER, 'log'),
      getToken(TokenType.LEFT_BRACKET, '('),
      getToken(TokenType.IDENTIFIER, 'cond'),
      getToken(TokenType.RIGHT_BRACKET, ')'),
      getToken(TokenType.SEMICOLON, ';'),

      getToken(TokenType.IF, 'if'),
      getToken(TokenType.LEFT_BRACKET, '('),
      getToken(TokenType.IDENTIFIER, 'cond'),
      getToken(TokenType.RIGHT_BRACKET, ')'),
      getToken(TokenType.lEFT_BRACE, '{'),
      getToken(TokenType.IDENTIFIER, 'a'),
      getToken(TokenType.EQUAL, '='),
      getToken(TokenType.STRING, 'b'),
      getToken(TokenType.SEMICOLON, ';'),
      getToken(TokenType.RIGHT_BRACE, '}'),
      getToken(TokenType.ELSE, 'else'),
      getToken(TokenType.lEFT_BRACE, '{'),
      getToken(TokenType.IDENTIFIER, 'a'),
      getToken(TokenType.EQUAL, '='),
      getToken(TokenType.STRING, 'c'),
      getToken(TokenType.SEMICOLON, ';'),
      getToken(TokenType.RIGHT_BRACE, '}'),

      getToken(TokenType.IDENTIFIER, 'console'),
      getToken(TokenType.DOT, '.'),
      getToken(TokenType.IDENTIFIER, 'log'),
      getToken(TokenType.LEFT_BRACKET, '('),
      getToken(TokenType.IDENTIFIER, 'a'),
      getToken(TokenType.RIGHT_BRACKET, ')'),
      getToken(TokenType.SEMICOLON, ';'),

      getToken(TokenType.FUNCTION, 'function'),
      getToken(TokenType.IDENTIFIER, 'makeCounter'),
      getToken(TokenType.LEFT_BRACKET, '('),
      getToken(TokenType.RIGHT_BRACKET, ')'),
      getToken(TokenType.lEFT_BRACE, '{'),
      getToken(TokenType.VAR, 'var'),
      getToken(TokenType.IDENTIFIER, 'i'),
      getToken(TokenType.EQUAL, '='),
      getToken(TokenType.NUMBER, '0'),
      getToken(TokenType.SEMICOLON, ';'),

      getToken(TokenType.FUNCTION, 'function'),
      getToken(TokenType.IDENTIFIER, 'count'),
      getToken(TokenType.LEFT_BRACKET, '('),
      getToken(TokenType.RIGHT_BRACKET, ')'),
      getToken(TokenType.lEFT_BRACE, '{'),
      getToken(TokenType.IDENTIFIER, 'i'),
      getToken(TokenType.EQUAL, '='),
      getToken(TokenType.IDENTIFIER, 'i'),
      getToken(TokenType.PLUS, '+'),
      getToken(TokenType.NUMBER, '1'),
      getToken(TokenType.SEMICOLON, ';'),

      getToken(TokenType.IDENTIFIER, 'console'),
      getToken(TokenType.DOT, '.'),
      getToken(TokenType.IDENTIFIER, 'log'),
      getToken(TokenType.LEFT_BRACKET, '('),
      getToken(TokenType.IDENTIFIER, 'i'),
      getToken(TokenType.RIGHT_BRACKET, ')'),
      getToken(TokenType.SEMICOLON, ';'),

      getToken(TokenType.RIGHT_BRACE, '}'),
      getToken(TokenType.RETURN, 'return'),
      getToken(TokenType.IDENTIFIER, 'count'),
      getToken(TokenType.SEMICOLON, ';'),
      getToken(TokenType.RIGHT_BRACE, '}'),

      getToken(TokenType.VAR, 'var'),
      getToken(TokenType.IDENTIFIER, 'counter'),
      getToken(TokenType.EQUAL, '='),
      getToken(TokenType.IDENTIFIER, 'makeCounter'),
      getToken(TokenType.LEFT_BRACKET, '('),
      getToken(TokenType.RIGHT_BRACKET, ')'),
      getToken(TokenType.SEMICOLON, ';'),
      getToken(TokenType.IDENTIFIER, 'counter'),
      getToken(TokenType.LEFT_BRACKET, '('),
      getToken(TokenType.RIGHT_BRACKET, ')'),
      getToken(TokenType.SEMICOLON, ';'),
      getToken(TokenType.IDENTIFIER, 'counter'),
      getToken(TokenType.LEFT_BRACKET, '('),
      getToken(TokenType.RIGHT_BRACKET, ')'),
      getToken(TokenType.SEMICOLON, ';'),

      getToken(TokenType.VAR, 'var'),
      getToken(TokenType.IDENTIFIER, 'n'),
      getToken(TokenType.EQUAL, '='),
      getToken(TokenType.NUMBER, '1'),
      getToken(TokenType.SEMICOLON, ';'),

      getToken(TokenType.PLUS_PLUS, '++'),
      getToken(TokenType.IDENTIFIER, 'n'),
      getToken(TokenType.SEMICOLON, ';'),

      getToken(TokenType.IDENTIFIER, 'console'),
      getToken(TokenType.DOT, '.'),
      getToken(TokenType.IDENTIFIER, 'log'),
      getToken(TokenType.LEFT_BRACKET, '('),
      getToken(TokenType.IDENTIFIER, 'n'),
      getToken(TokenType.RIGHT_BRACKET, ')'),
      getToken(TokenType.SEMICOLON, ';'),

      getToken(TokenType.MINUS_MINUS, '--'),
      getToken(TokenType.IDENTIFIER, 'n'),
      getToken(TokenType.SEMICOLON, ';'),

      getToken(TokenType.IDENTIFIER, 'console'),
      getToken(TokenType.DOT, '.'),
      getToken(TokenType.IDENTIFIER, 'log'),
      getToken(TokenType.LEFT_BRACKET, '('),
      getToken(TokenType.IDENTIFIER, 'n'),
      getToken(TokenType.RIGHT_BRACKET, ')'),
      getToken(TokenType.SEMICOLON, ';'),

      getToken(TokenType.FUNCTION, 'function'),
      getToken(TokenType.IDENTIFIER, 'fib'),
      getToken(TokenType.LEFT_BRACKET, '('),
      getToken(TokenType.IDENTIFIER, 'n'),
      getToken(TokenType.RIGHT_BRACKET, ')'),
      getToken(TokenType.lEFT_BRACE, '{'),

      getToken(TokenType.IF, 'if'),
      getToken(TokenType.LEFT_BRACKET, '('),
      getToken(TokenType.IDENTIFIER, 'n'),
      getToken(TokenType.LESS_EQUAL, '<='),
      getToken(TokenType.NUMBER, '1'),
      getToken(TokenType.RIGHT_BRACKET, ')'),
      getToken(TokenType.RETURN, 'return'),
      getToken(TokenType.IDENTIFIER, 'n'),
      getToken(TokenType.SEMICOLON, ';'),

      getToken(TokenType.RETURN, 'return'),
      getToken(TokenType.IDENTIFIER, 'fib'),
      getToken(TokenType.LEFT_BRACKET, '('),
      getToken(TokenType.IDENTIFIER, 'n'),
      getToken(TokenType.MINUS, '-'),
      getToken(TokenType.NUMBER, '1'),
      getToken(TokenType.RIGHT_BRACKET, ')'),
      getToken(TokenType.PLUS, '+'),
      getToken(TokenType.IDENTIFIER, 'fib'),
      getToken(TokenType.LEFT_BRACKET, '('),
      getToken(TokenType.IDENTIFIER, 'n'),
      getToken(TokenType.MINUS, '-'),
      getToken(TokenType.NUMBER, '2'),
      getToken(TokenType.RIGHT_BRACKET, ')'),
      getToken(TokenType.SEMICOLON, ';'),

      getToken(TokenType.RIGHT_BRACE, '}'),

      getToken(TokenType.IDENTIFIER, 'console'),
      getToken(TokenType.DOT, '.'),
      getToken(TokenType.IDENTIFIER, 'log'),
      getToken(TokenType.LEFT_BRACKET, '('),
      getToken(TokenType.IDENTIFIER, 'fib'),
      getToken(TokenType.LEFT_BRACKET, '('),
      getToken(TokenType.NUMBER, '30'),
      getToken(TokenType.RIGHT_BRACKET, ')'),
      getToken(TokenType.RIGHT_BRACKET, ')'),
      getToken(TokenType.SEMICOLON, ';'),

      getToken(TokenType.VAR, 'var'),
      getToken(TokenType.IDENTIFIER, 'globalA'),
      getToken(TokenType.EQUAL, '='),
      getToken(TokenType.STRING, 'global'),
      getToken(TokenType.SEMICOLON, ';'),

      getToken(TokenType.lEFT_BRACE, '{'),

      getToken(TokenType.FUNCTION, 'function'),
      getToken(TokenType.IDENTIFIER, 'showA'),
      getToken(TokenType.LEFT_BRACKET, '('),
      getToken(TokenType.RIGHT_BRACKET, ')'),
      getToken(TokenType.lEFT_BRACE, '{'),

      getToken(TokenType.IDENTIFIER, 'console'),
      getToken(TokenType.DOT, '.'),
      getToken(TokenType.IDENTIFIER, 'log'),
      getToken(TokenType.LEFT_BRACKET, '('),
      getToken(TokenType.IDENTIFIER, 'globalA'),
      getToken(TokenType.RIGHT_BRACKET, ')'),
      getToken(TokenType.SEMICOLON, ';'),

      getToken(TokenType.RIGHT_BRACE, '}'),

      getToken(TokenType.IDENTIFIER, 'showA'),
      getToken(TokenType.LEFT_BRACKET, '('),
      getToken(TokenType.RIGHT_BRACKET, ')'),
      getToken(TokenType.SEMICOLON, ';'),

      getToken(TokenType.VAR, 'var'),
      getToken(TokenType.IDENTIFIER, 'globalA'),
      getToken(TokenType.EQUAL, '='),
      getToken(TokenType.STRING, 'block'),
      getToken(TokenType.SEMICOLON, ';'),

      getToken(TokenType.IDENTIFIER, 'showA'),
      getToken(TokenType.LEFT_BRACKET, '('),
      getToken(TokenType.RIGHT_BRACKET, ')'),
      getToken(TokenType.SEMICOLON, ';'),

      getToken(TokenType.RIGHT_BRACE, '}'),

      getToken(TokenType.CLASS, 'class'),
      getToken(TokenType.IDENTIFIER, 'Test'),
      getToken(TokenType.lEFT_BRACE, '{'),

      getToken(TokenType.IDENTIFIER, 'b'),
      getToken(TokenType.EQUAL, '='),
      getToken(TokenType.NUMBER, '5'),
      getToken(TokenType.SEMICOLON, ';'),

      getToken(TokenType.IDENTIFIER, 'print'),
      getToken(TokenType.LEFT_BRACKET, '('),
      getToken(TokenType.IDENTIFIER, 'a'),
      getToken(TokenType.RIGHT_BRACKET, ')'),
      getToken(TokenType.lEFT_BRACE, '{'),

      getToken(TokenType.IDENTIFIER, 'console'),
      getToken(TokenType.DOT, '.'),
      getToken(TokenType.IDENTIFIER, 'log'),
      getToken(TokenType.LEFT_BRACKET, '('),
      getToken(TokenType.IDENTIFIER, 'a'),
      getToken(TokenType.RIGHT_BRACKET, ')'),
      getToken(TokenType.SEMICOLON, ';'),

      getToken(TokenType.RIGHT_BRACE, '}'),
      getToken(TokenType.RIGHT_BRACE, '}'),

      getToken(TokenType.VAR, 'var'),
      getToken(TokenType.IDENTIFIER, 'b'),
      getToken(TokenType.EQUAL, '='),
      getToken(TokenType.NEW, 'new'),
      getToken(TokenType.IDENTIFIER, 'Test'),
      getToken(TokenType.LEFT_BRACKET, '('),
      getToken(TokenType.RIGHT_BRACKET, ')'),
      getToken(TokenType.SEMICOLON, ';'),

      getToken(TokenType.IDENTIFIER, 'b'),
      getToken(TokenType.DOT, '.'),
      getToken(TokenType.IDENTIFIER, 'print'),
      getToken(TokenType.LEFT_BRACKET, '('),
      getToken(TokenType.NUMBER, '3'),
      getToken(TokenType.RIGHT_BRACKET, ')'),
      getToken(TokenType.SEMICOLON, ';'),

      getToken(TokenType.IDENTIFIER, 'console'),
      getToken(TokenType.DOT, '.'),
      getToken(TokenType.IDENTIFIER, 'log'),
      getToken(TokenType.LEFT_BRACKET, '('),
      getToken(TokenType.IDENTIFIER, 'b'),
      getToken(TokenType.DOT, '.'),
      getToken(TokenType.IDENTIFIER, 'b'),
      getToken(TokenType.RIGHT_BRACKET, ')'),
      getToken(TokenType.SEMICOLON, ';'),

      getToken(TokenType.IDENTIFIER, 'b'),
      getToken(TokenType.DOT, '.'),
      getToken(TokenType.IDENTIFIER, 'b'),
      getToken(TokenType.EQUAL, '='),
      getToken(TokenType.STRING, '9'),
      getToken(TokenType.SEMICOLON, ';'),

      getToken(TokenType.IDENTIFIER, 'console'),
      getToken(TokenType.DOT, '.'),
      getToken(TokenType.IDENTIFIER, 'log'),
      getToken(TokenType.LEFT_BRACKET, '('),
      getToken(TokenType.IDENTIFIER, 'b'),
      getToken(TokenType.DOT, '.'),
      getToken(TokenType.IDENTIFIER, 'b'),
      getToken(TokenType.RIGHT_BRACKET, ')'),
      getToken(TokenType.SEMICOLON, ';'),

      getToken(TokenType.IDENTIFIER, 'b'),
      getToken(TokenType.DOT, '.'),
      getToken(TokenType.IDENTIFIER, 'print'),
      getToken(TokenType.EQUAL, '='),
      getToken(TokenType.STRING, '1'),
      getToken(TokenType.SEMICOLON, ';'),

      getToken(TokenType.IDENTIFIER, 'console'),
      getToken(TokenType.DOT, '.'),
      getToken(TokenType.IDENTIFIER, 'log'),
      getToken(TokenType.LEFT_BRACKET, '('),
      getToken(TokenType.IDENTIFIER, 'b'),
      getToken(TokenType.DOT, '.'),
      getToken(TokenType.IDENTIFIER, 'print'),
      getToken(TokenType.RIGHT_BRACKET, ')'),
      getToken(TokenType.SEMICOLON, ';'),

      getToken(TokenType.VAR, 'var'),
      getToken(TokenType.IDENTIFIER, 'c'),
      getToken(TokenType.EQUAL, '='),
      getToken(TokenType.NEW, 'new'),
      getToken(TokenType.IDENTIFIER, 'Test'),
      getToken(TokenType.LEFT_BRACKET, '('),
      getToken(TokenType.RIGHT_BRACKET, ')'),
      getToken(TokenType.SEMICOLON, ';'),

      getToken(TokenType.IDENTIFIER, 'console'),
      getToken(TokenType.DOT, '.'),
      getToken(TokenType.IDENTIFIER, 'log'),
      getToken(TokenType.LEFT_BRACKET, '('),
      getToken(TokenType.IDENTIFIER, 'c'),
      getToken(TokenType.DOT, '.'),
      getToken(TokenType.IDENTIFIER, 'b'),
      getToken(TokenType.RIGHT_BRACKET, ')'),
      getToken(TokenType.SEMICOLON, ';'),

      getToken(TokenType.IDENTIFIER, 'c'),
      getToken(TokenType.DOT, '.'),
      getToken(TokenType.IDENTIFIER, 'print'),
      getToken(TokenType.LEFT_BRACKET, '('),
      getToken(TokenType.NUMBER, '4'),
      getToken(TokenType.RIGHT_BRACKET, ')'),
      getToken(TokenType.SEMICOLON, ';'),

      getToken(TokenType.NUMBER, '1'),
      getToken(TokenType.EQUAL_EQUAL, '=='),
      getToken(TokenType.NUMBER, '2'),

      getToken(TokenType.NUMBER, '1'),
      getToken(TokenType.EQUAL_EQUAL_EQUAL, '==='),
      getToken(TokenType.NUMBER, '2'),

      getToken(TokenType.IDENTIFIER, 'b'),
      getToken(TokenType.NULLISH_COALESCING_EQUAL, '??='),
      getToken(TokenType.NUMBER, '1'),

      getToken(TokenType.NUMBER, '1'),
      getToken(TokenType.LESS_EQUAL, '<='),
      getToken(TokenType.NUMBER, '2'),

      getToken(TokenType.NUMBER, '1'),
      getToken(TokenType.LESS, '<'),
      getToken(TokenType.NUMBER, '2'),

      getToken(TokenType.NUMBER, '1'),
      getToken(TokenType.BIT_X_OR, '^'),
      getToken(TokenType.NUMBER, '2.2'),

      getToken(TokenType.NUMBER, '1'),
      getToken(TokenType.BIT_X_OR_EQUAL, '^='),
      getToken(TokenType.NUMBER, '2.2'),

      getToken(TokenType.NUMBER, '1'),
      getToken(TokenType.GREATER, '>'),
      getToken(TokenType.NUMBER, '2'),

      getToken(TokenType.NUMBER, '1'),
      getToken(TokenType.GREATER_EQUAL, '>='),
      getToken(TokenType.NUMBER, '2'),

      getToken(TokenType.EOF, ''),
    ];
    const list = new Scanner(inputData).scan();
    const actual: TokenItem[] = list.map((item) => ({
      type: item.type,
      lexeme: item.lexeme,
    }));
    expect(actual).toEqual(expectTokens);
  });
});
