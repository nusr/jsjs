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
  SetExpression,
  UnaryExpression,
  VariableExpression,
} from '../../src/expression';

let inputData = '';
beforeAll(() => {
  inputData = fs.readFileSync(path.join(__dirname, 'testData.js'), 'utf-8');
});

describe('parser.test.ts', () => {
  const env = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...env };
    process.env.NODE_ENV = 'production';
  });

  afterEach(() => {
    process.env = env;
  });
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
          new GetExpression(
            new VariableExpression(
              new Token(TokenType.IDENTIFIER, 'console', 10),
            ),
            new Token(TokenType.IDENTIFIER, 'log', 10),
          ),
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
          new GetExpression(
            new VariableExpression(
              new Token(TokenType.IDENTIFIER, 'console', 16),
            ),
            new Token(TokenType.IDENTIFIER, 'log', 16),
          ),
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
                  new GetExpression(
                    new VariableExpression(
                      new Token(TokenType.IDENTIFIER, 'console', 22),
                    ),
                    new Token(TokenType.IDENTIFIER, 'log', 22),
                  ),
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
          [],
        ),
      ),
      new ExpressionStatement(
        new CallExpression(
          new VariableExpression(
            new Token(TokenType.IDENTIFIER, 'counter', 29),
          ),
          [],
        ),
      ),
      new ExpressionStatement(
        new CallExpression(
          new VariableExpression(
            new Token(TokenType.IDENTIFIER, 'counter', 30),
          ),
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
          new GetExpression(
            new VariableExpression(
              new Token(TokenType.IDENTIFIER, 'console', 33),
            ),
            new Token(TokenType.IDENTIFIER, 'log', 33),
          ),
          [
            new VariableExpression(new Token(TokenType.IDENTIFIER, 'n', 33))
          ],
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
          new GetExpression(
            new VariableExpression(
              new Token(TokenType.IDENTIFIER, 'console', 35),
            ),
            new Token(TokenType.IDENTIFIER, 'log', 35),
          ),
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
              new VariableExpression(new Token(TokenType.IDENTIFIER, 'n', 37)),
            ),
            null,
          ),
          new ReturnStatement(
            new BinaryExpression(
              new CallExpression(
                new VariableExpression(
                  new Token(TokenType.IDENTIFIER, 'fib', 38),
                ),
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
          new GetExpression(
            new VariableExpression(
              new Token(TokenType.IDENTIFIER, 'console', 40),
            ),
            new Token(TokenType.IDENTIFIER, 'log', 40),
          ),
          [
            new CallExpression(
              new VariableExpression(
                new Token(TokenType.IDENTIFIER, 'fib', 40),
              ),
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
                new GetExpression(
                  new VariableExpression(
                    new Token(TokenType.IDENTIFIER, 'console', 44),
                  ),
                  new Token(TokenType.IDENTIFIER, 'log', 44),
                ),
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
            [],
          ),
        ),
      ]),
      new ClassStatement(new Token(TokenType.IDENTIFIER, 'Test', 51), null, [
        new VariableStatement(
          new Token(TokenType.IDENTIFIER, 'b', 52),
          new LiteralExpression(5),
        ),
        new FunctionStatement(
          new Token(TokenType.IDENTIFIER, 'print', 53),
          new BlockStatement([
            new ExpressionStatement(
              new CallExpression(
                new GetExpression(
                  new VariableExpression(
                    new Token(TokenType.IDENTIFIER, 'console', 54),
                  ),
                  new Token(TokenType.IDENTIFIER, 'log', 54),
                ),
                [
                  new VariableExpression(
                    new Token(TokenType.IDENTIFIER, 'a', 54),
                  ),
                ],
              ),
            ),
          ]),
          [new Token(TokenType.IDENTIFIER, 'a', 53)],
        ),
      ]),
      new VariableStatement(
        new Token(TokenType.IDENTIFIER, 'b', 57),
        new NewExpression(
          new CallExpression(
            new VariableExpression(new Token(TokenType.IDENTIFIER, 'Test', 57)),
            [],
          ),
        ),
      ),
      new ExpressionStatement(
        new CallExpression(
          new GetExpression(
            new VariableExpression(new Token(TokenType.IDENTIFIER, 'b', 58)),
            new Token(TokenType.IDENTIFIER, 'print', 58),
          ),
          [new LiteralExpression(3)],
        ),
      ),
      new ExpressionStatement(
        new CallExpression(
          new GetExpression(
            new VariableExpression(
              new Token(TokenType.IDENTIFIER, 'console', 59),
            ),
            new Token(TokenType.IDENTIFIER, 'log', 59),
          ),
          [
            new GetExpression(
              new VariableExpression(new Token(TokenType.IDENTIFIER, 'b', 59)),
              new Token(TokenType.IDENTIFIER, 'b', 59),
            ),
          ],
        ),
      ),
      new ExpressionStatement(
        new SetExpression(
          new GetExpression(
            new VariableExpression(new Token(TokenType.IDENTIFIER, 'b', 60)),
            new Token(TokenType.IDENTIFIER, 'b', 60),
          ),
          new LiteralExpression('9'),
        ),
      ),
      new ExpressionStatement(
        new CallExpression(
          new GetExpression(
            new VariableExpression(
              new Token(TokenType.IDENTIFIER, 'console', 61),
            ),
            new Token(TokenType.IDENTIFIER, 'log', 61),
          ),
          [
            new GetExpression(
              new VariableExpression(new Token(TokenType.IDENTIFIER, 'b', 61)),
              new Token(TokenType.IDENTIFIER, 'b', 61),
            ),
          ],
        ),
      ),
      new ExpressionStatement(
        new SetExpression(
          new GetExpression(
            new VariableExpression(new Token(TokenType.IDENTIFIER, 'b', 62)),
            new Token(TokenType.IDENTIFIER, 'print', 62),
          ),
          new LiteralExpression('1'),
        ),
      ),
      new ExpressionStatement(
        new CallExpression(
          new GetExpression(
            new VariableExpression(
              new Token(TokenType.IDENTIFIER, 'console', 63),
            ),
            new Token(TokenType.IDENTIFIER, 'log', 63),
          ),
          [
            new GetExpression(
              new VariableExpression(new Token(TokenType.IDENTIFIER, 'b', 63)),
              new Token(TokenType.IDENTIFIER, 'print', 63),
            ),
          ],
        ),
      ),
      new VariableStatement(
        new Token(TokenType.IDENTIFIER, 'c', 64),
        new NewExpression(
          new CallExpression(
            new VariableExpression(new Token(TokenType.IDENTIFIER, 'Test', 64)),
            [],
          ),
        ),
      ),
      new ExpressionStatement(
        new CallExpression(
          new GetExpression(
            new VariableExpression(
              new Token(TokenType.IDENTIFIER, 'console', 65),
            ),
            new Token(TokenType.IDENTIFIER, 'log', 65),
          ),
          [
            new GetExpression(
              new VariableExpression(new Token(TokenType.IDENTIFIER, 'c', 65)),
              new Token(TokenType.IDENTIFIER, 'b', 65),
            ),
          ],
        ),
      ),
      new ExpressionStatement(
        new CallExpression(
          new GetExpression(
            new VariableExpression(new Token(TokenType.IDENTIFIER, 'c', 66)),
            new Token(TokenType.IDENTIFIER, 'print', 66),
          ),
          [new LiteralExpression(4)],
        ),
      ),
    ];
    expect(ast).toEqual(expectAst);
  });
  test('print', () => {
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
      'console.log(cond);',
      "if(cond){a = 'b';} else {a = 'c';}",
      'console.log(a);',
      'function makeCounter(){var i = 0;function count(){i = i + 1;console.log(i);}return count;}',
      'var counter = makeCounter();',
      'counter();',
      'counter();',
      'var n = 1;',
      '++n;',
      'console.log(n);',
      '--n;',
      'console.log(n);',
      'function fib(n){if(n <= 1)return n;return fib(n - 1) + fib(n - 2);}',
      'console.log(fib(30));',
      "var globalA = 'global';",
      "{function showA(){console.log(globalA);}showA();var globalA = 'block';showA();}",
      'class Test{b = 5;print(a){console.log(a);}}',
      'var b = new Test();',
      'b.print(3);',
      'console.log(b.b);',
      "b.b = '9';",
      'console.log(b.b);',
      "b.print = '1';",
      'console.log(b.print);',
      'var c = new Test();',
      'console.log(c.b);',
      'c.print(4);',
    ]);
  });
});
