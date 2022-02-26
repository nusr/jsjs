import Scanner from './scanner';
import ASTPrinter from './ASTPrinter';
import Parser from './parser';

export class Lox {
  public run(text: string) {
    const scanner = new Scanner(text);
    const tokens = scanner.scanTokens();
    const parser = new Parser(tokens);
    const expression = parser.expression();
    console.log(new ASTPrinter().print(expression));
  }
}
