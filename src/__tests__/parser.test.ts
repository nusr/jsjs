import Parser from "../parser";
import Scanner from "../scanner";
import { BlockStatement, ExpressionStatement, FunctionStatement, IfStatement, ReturnStatement, Statement, VariableStatement } from "../statement";
import * as fs from 'fs';
import *  as path from 'path';
import Token from "../token";
import { TokenType } from "../tokenType";
import { AssignExpression, BinaryExpression, CallExpression, LiteralExpression, VariableExpression } from "../expression";

let inputData = '';
beforeAll(() => {
  inputData = fs.readFileSync(path.join(__dirname, 'testData.js'), 'utf-8');
})

describe("parser.test.ts", () => {
  test("parser", () => {
    const scanner = new Scanner(inputData);
    const tokens = scanner.scanTokens();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const expectAst: Statement[] = [
      new VariableStatement(
        new Token(TokenType.IDENTIFIER, 'a', 1),
        new LiteralExpression('a')
      ),
      new FunctionStatement(
        new Token(TokenType.IDENTIFIER, 'add', 6),
        new BlockStatement(
          [
            new ReturnStatement(new Token(TokenType.RETURN, 'return', 7),
              new BinaryExpression(
                new VariableExpression(new Token(TokenType.IDENTIFIER, 'x', 7)
                ),
                new Token(TokenType.PLUS, '+', 7),
                new VariableExpression(new Token(TokenType.IDENTIFIER, 'y', 7)
                )
              )
            )
          ]
        ),
        [
          new Token(TokenType.IDENTIFIER, 'x', 6),
          new Token(TokenType.IDENTIFIER, 'y', 6),
        ]
      ),
      new VariableStatement(
        new Token(TokenType.IDENTIFIER, 'cond', 9),
        new CallExpression(
          new VariableExpression(
            new Token(TokenType.IDENTIFIER, 'add', 9)
          ),
          new Token(TokenType.RIGHT_PAREN, ')', 9),
          [
            new LiteralExpression(1),
            new BinaryExpression(
              new LiteralExpression(2),
              new Token(TokenType.STAR, '*', 9),
              new LiteralExpression(3)
            )
          ]
        )
      ),
      new ExpressionStatement(
        new VariableExpression(
          new Token(TokenType.IDENTIFIER, 'cond', 10)
        )
      ),
      new IfStatement(
        new VariableExpression(
          new Token(TokenType.IDENTIFIER, 'cond', 11)
        ),
        new BlockStatement(
          [
            new ExpressionStatement(
              new AssignExpression(
                new Token(TokenType.IDENTIFIER, 'a', 12),
                new LiteralExpression('b')
              )
            )
          ]
        ),
        new BlockStatement(
          [
            new ExpressionStatement(
              new AssignExpression(
                new Token(TokenType.IDENTIFIER, 'a', 14),
                new LiteralExpression('c')
              )
            )
          ]
        ),
      ),
      new ExpressionStatement(
        new VariableExpression(
          new Token(TokenType.IDENTIFIER, 'a', 16)
        )
      ),
    ]
    expect(ast).toEqual(expectAst)
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
      "function add(x,y){return x + y;}",
      "var cond = add(1,2 * 3);",
      "cond;",
      "if(cond){a = 'b';} else {a = 'c';}",
      "a;",
    ])
  })
});