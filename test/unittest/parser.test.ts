import Parser from '../../src/parser';
import Scanner from '../../src/scanner';
import {
  BlockStatement,
  ClassStatement,
  ExpressionStatement,
  FunctionStatement,
  IfStatement,
  ReturnStatement,
  Statement,
  VariableStatement,
} from '../../src/statement';
import * as fs from 'fs';
import * as path from 'path';
import Token from '../../src/token';
import { TokenType } from '../../src/tokenType';
import {
  AssignExpression,
  BinaryExpression,
  CallExpression,
  GetExpression,
  LiteralExpression,
  NewExpression,
  UnaryExpression,
  VariableExpression,
} from '../../src/expression';

let inputData = '';
beforeAll(() => {
  inputData = fs.readFileSync(path.join(__dirname, 'testData.js'), 'utf-8');
});

describe('parser.test.ts', () => {
  test('parser', () => {
    const scanner = new Scanner(inputData);
    const tokens = scanner.scanTokens();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const expectAst: Statement[] = [
      new VariableStatement(
        new Token(TokenType.IDENTIFIER, 'a', 1),
        new LiteralExpression('a'),
      ),
      new FunctionStatement(
        new Token(TokenType.IDENTIFIER, 'add', 6),
        new BlockStatement([
          new ReturnStatement(
            new Token(TokenType.RETURN, 'return', 7),
            new BinaryExpression(
              new VariableExpression(new Token(TokenType.IDENTIFIER, 'x', 7)),
              new Token(TokenType.PLUS, '+', 7),
              new VariableExpression(new Token(TokenType.IDENTIFIER, 'y', 7)),
            ),
          ),
        ]),
        [
          new Token(TokenType.IDENTIFIER, 'x', 6),
          new Token(TokenType.IDENTIFIER, 'y', 6),
        ],
      ),
      new VariableStatement(
        new Token(TokenType.IDENTIFIER, 'cond', 9),
        new CallExpression(
          new VariableExpression(new Token(TokenType.IDENTIFIER, 'add', 9)),
          new Token(TokenType.RIGHT_PAREN, ')', 9),
          [
            new LiteralExpression(1),
            new BinaryExpression(
              new LiteralExpression(2),
              new Token(TokenType.STAR, '*', 9),
              new LiteralExpression(3),
            ),
          ],
        ),
      ),
      new ExpressionStatement(
        new CallExpression(
          new VariableExpression(new Token(TokenType.IDENTIFIER, 'log', 10)),
          new Token(TokenType.RIGHT_PAREN, ')', 10),
          [new VariableExpression(new Token(TokenType.IDENTIFIER, 'cond', 10))],
        ),
      ),
      new IfStatement(
        new VariableExpression(new Token(TokenType.IDENTIFIER, 'cond', 11)),
        new BlockStatement([
          new ExpressionStatement(
            new AssignExpression(
              new Token(TokenType.IDENTIFIER, 'a', 12),
              new LiteralExpression('b'),
            ),
          ),
        ]),
        new BlockStatement([
          new ExpressionStatement(
            new AssignExpression(
              new Token(TokenType.IDENTIFIER, 'a', 14),
              new LiteralExpression('c'),
            ),
          ),
        ]),
      ),
      new ExpressionStatement(
        new CallExpression(
          new VariableExpression(new Token(TokenType.IDENTIFIER, 'log', 16)),
          new Token(TokenType.RIGHT_PAREN, ')', 16),
          [new VariableExpression(new Token(TokenType.IDENTIFIER, 'a', 16))],
        ),
      ),
      new FunctionStatement(
        new Token(TokenType.IDENTIFIER, 'makeCounter', 18),
        new BlockStatement([
          new VariableStatement(
            new Token(TokenType.IDENTIFIER, 'i', 19),
            new LiteralExpression(0),
          ),
          new FunctionStatement(
            new Token(TokenType.IDENTIFIER, 'count', 20),
            new BlockStatement([
              new ExpressionStatement(
                new AssignExpression(
                  new Token(TokenType.IDENTIFIER, 'i', 21),
                  new BinaryExpression(
                    new VariableExpression(
                      new Token(TokenType.IDENTIFIER, 'i', 21),
                    ),
                    new Token(TokenType.PLUS, '+', 21),
                    new LiteralExpression(1),
                  ),
                ),
              ),

              new ExpressionStatement(
                new CallExpression(
                  new VariableExpression(
                    new Token(TokenType.IDENTIFIER, 'log', 22),
                  ),
                  new Token(TokenType.RIGHT_PAREN, ')', 22),
                  [
                    new VariableExpression(
                      new Token(TokenType.IDENTIFIER, 'i', 22),
                    ),
                  ],
                ),
              ),
            ]),
            [],
          ),
          new ReturnStatement(
            new Token(TokenType.RETURN, 'return', 25),
            new VariableExpression(
              new Token(TokenType.IDENTIFIER, 'count', 25),
            ),
          ),
        ]),
        [],
      ),
      new VariableStatement(
        new Token(TokenType.IDENTIFIER, 'counter', 28),
        new CallExpression(
          new VariableExpression(
            new Token(TokenType.IDENTIFIER, 'makeCounter', 28),
          ),
          new Token(TokenType.RIGHT_PAREN, ')', 28),
          [],
        ),
      ),
      new ExpressionStatement(
        new CallExpression(
          new VariableExpression(
            new Token(TokenType.IDENTIFIER, 'counter', 29),
          ),
          new Token(TokenType.RIGHT_PAREN, ')', 29),
          [],
        ),
      ),
      new ExpressionStatement(
        new CallExpression(
          new VariableExpression(
            new Token(TokenType.IDENTIFIER, 'counter', 30),
          ),
          new Token(TokenType.RIGHT_PAREN, ')', 30),
          [],
        ),
      ),
      new VariableStatement(
        new Token(TokenType.IDENTIFIER, 'n', 31),
        new LiteralExpression(1),
      ),
      new ExpressionStatement(
        new UnaryExpression(
          new Token(TokenType.PLUS_PLUS, '++', 32),
          new VariableExpression(new Token(TokenType.IDENTIFIER, 'n', 32)),
        ),
      ),
      new ExpressionStatement(
        new CallExpression(
          new VariableExpression(new Token(TokenType.IDENTIFIER, 'log', 33)),
          new Token(TokenType.RIGHT_PAREN, ')', 33),
          [new VariableExpression(new Token(TokenType.IDENTIFIER, 'n', 33))],
        ),
      ),
      new ExpressionStatement(
        new UnaryExpression(
          new Token(TokenType.MINUS_MINUS, '--', 34),
          new VariableExpression(new Token(TokenType.IDENTIFIER, 'n', 34)),
        ),
      ),
      new ExpressionStatement(
        new CallExpression(
          new VariableExpression(new Token(TokenType.IDENTIFIER, 'log', 35)),
          new Token(TokenType.RIGHT_PAREN, ')', 35),
          [new VariableExpression(new Token(TokenType.IDENTIFIER, 'n', 35))],
        ),
      ),
      new FunctionStatement(
        new Token(TokenType.IDENTIFIER, 'fib', 36),
        new BlockStatement([
          new IfStatement(
            new BinaryExpression(
              new VariableExpression(new Token(TokenType.IDENTIFIER, 'n', 37)),
              new Token(TokenType.LESS_EQUAL, '<=', 37),
              new LiteralExpression(1),
            ),
            new ReturnStatement(
              new Token(TokenType.RETURN, 'return', 37),
              new VariableExpression(new Token(TokenType.IDENTIFIER, 'n', 37)),
            ),
            null,
          ),
          new ReturnStatement(
            new Token(TokenType.RETURN, 'return', 38),
            new BinaryExpression(
              new CallExpression(
                new VariableExpression(
                  new Token(TokenType.IDENTIFIER, 'fib', 38),
                ),
                new Token(TokenType.RIGHT_PAREN, ')', 38),
                [
                  new BinaryExpression(
                    new VariableExpression(
                      new Token(TokenType.IDENTIFIER, 'n', 38),
                    ),
                    new Token(TokenType.MINUS, '-', 38),
                    new LiteralExpression(1),
                  ),
                ],
              ),
              new Token(TokenType.PLUS, '+', 38),
              new CallExpression(
                new VariableExpression(
                  new Token(TokenType.IDENTIFIER, 'fib', 38),
                ),
                new Token(TokenType.RIGHT_PAREN, ')', 38),
                [
                  new BinaryExpression(
                    new VariableExpression(
                      new Token(TokenType.IDENTIFIER, 'n', 38),
                    ),
                    new Token(TokenType.MINUS, '-', 38),
                    new LiteralExpression(2),
                  ),
                ],
              ),
            ),
          ),
        ]),
        [new Token(TokenType.IDENTIFIER, 'n', 36)],
      ),
      new ExpressionStatement(
        new CallExpression(
          new VariableExpression(new Token(TokenType.IDENTIFIER, 'log', 40)),
          new Token(TokenType.RIGHT_PAREN, ')', 40),
          [
            new CallExpression(
              new VariableExpression(
                new Token(TokenType.IDENTIFIER, 'fib', 40),
              ),
              new Token(TokenType.RIGHT_PAREN, ')', 40),
              [new LiteralExpression(30)],
            ),
          ],
        ),
      ),
      new VariableStatement(
        new Token(TokenType.IDENTIFIER, 'globalA', 41),
        new LiteralExpression('global'),
      ),
      new BlockStatement([
        new FunctionStatement(
          new Token(TokenType.IDENTIFIER, 'showA', 43),
          new BlockStatement([
            new ExpressionStatement(
              new CallExpression(
                new VariableExpression(
                  new Token(TokenType.IDENTIFIER, 'log', 44),
                ),
                new Token(TokenType.RIGHT_PAREN, ')', 44),
                [
                  new VariableExpression(
                    new Token(TokenType.IDENTIFIER, 'globalA', 44),
                  ),
                ],
              ),
            ),
          ]),
          [],
        ),
        new ExpressionStatement(
          new CallExpression(
            new VariableExpression(
              new Token(TokenType.IDENTIFIER, 'showA', 47),
            ),
            new Token(TokenType.RIGHT_PAREN, ')', 47),
            [],
          ),
        ),
        new VariableStatement(
          new Token(TokenType.IDENTIFIER, 'globalA', 48),
          new LiteralExpression('block'),
        ),
        new ExpressionStatement(
          new CallExpression(
            new VariableExpression(
              new Token(TokenType.IDENTIFIER, 'showA', 49),
            ),
            new Token(TokenType.RIGHT_PAREN, ')', 49),
            [],
          ),
        ),
      ]),
      new ClassStatement(new Token(TokenType.IDENTIFIER, 'Test', 51), null, [
        new FunctionStatement(
          new Token(TokenType.IDENTIFIER, 'print', 52),
          new BlockStatement([
            new ExpressionStatement(
              new CallExpression(
                new VariableExpression(
                  new Token(TokenType.IDENTIFIER, 'log', 53),
                ),
                new Token(TokenType.RIGHT_PAREN, ')', 53),
                [new LiteralExpression(1)],
              ),
            ),
          ]),
          [],
        ),
      ]),

      new VariableStatement(
        new Token(TokenType.IDENTIFIER, 'a', 56),
        new NewExpression(
          new Token(TokenType.NEW, 'new', 56),
          new CallExpression(
            new VariableExpression(new Token(TokenType.IDENTIFIER, 'Test', 56)),
            new Token(TokenType.RIGHT_PAREN, ')', 56),
            [],
          ),
        ),
      ),
      new ExpressionStatement(
        new CallExpression(
          new GetExpression(
            new VariableExpression(new Token(TokenType.IDENTIFIER, 'a', 57)),
            new Token(TokenType.IDENTIFIER, 'print', 57),
          ),
          new Token(TokenType.RIGHT_PAREN, ')', 57),
          [],
        ),
      ),
    ];
    expect(ast).toEqual(expectAst);
  });
  test('associativity', () => {
    const scanner = new Scanner(inputData);
    const tokens = scanner.scanTokens();
    const parser = new Parser(tokens);
    const statements = parser.parse();
    const result: string[] = [];
    for (const item of statements) {
      result.push(item.toString());
    }
    expect(result).toEqual([
      "var a = 'a';",
      'function add(x,y){return x + y;}',
      'var cond = add(1,2 * 3);',
      'log(cond);',
      "if(cond){a = 'b';} else {a = 'c';}",
      'log(a);',
      'function makeCounter(){var i = 0;function count(){i = i + 1;log(i);}return count;}',
      'var counter = makeCounter();',
      'counter();',
      'counter();',
      'var n = 1;',
      '++n;',
      'log(n);',
      '--n;',
      'log(n);',
      'function fib(n){if(n <= 1)return n;return fib(n - 1) + fib(n - 2);}',
      'log(fib(30));',
      "var globalA = 'global';",
      "{function showA(){log(globalA);}showA();var globalA = 'block';showA();}",
      'class Test{print(){log(1);}}',
      'var a = new Test();',
      'a.print();',
    ]);
  });
});
