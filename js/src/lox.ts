import Scanner from './scanner';
import ASTPrinter from './ASTPrinter';
import {
  Expression,
  BinaryExpression,
  GroupingExpression,
  LiteralExpression,
  UnaryExpression,
} from './expression';
import Token from './token';
import { TokenType } from './tokenType';

function test() {
  const expression: Expression = new BinaryExpression(
    new UnaryExpression(
      new Token(TokenType.MINUS, '-', null, 1),
      new LiteralExpression(123),
    ),
    new Token(TokenType.STAR, '*', null, 1),
    new GroupingExpression(new LiteralExpression(45.67)),
  );
  console.log(new ASTPrinter().print(expression));
}
test();
export class Lox {
  public run(text: string) {
    const scanner = new Scanner(text);
    const tokens = scanner.scanTokens();
    for (const item of tokens) {
      console.log(item);
    }
  }
}
