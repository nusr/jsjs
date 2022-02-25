import Scanner from './scanner';
import ASTPrinter from './ASTPrinter';
import { Expression } from './expression';
import Parser from './parser';

export class Lox {
  public run(text: string) {
    const scanner = new Scanner(text);
    const tokens = scanner.scanTokens();
    const expression: Expression = new Parser(tokens).expression();
    console.log(new ASTPrinter().print(expression));
  }
}
