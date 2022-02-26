import Scanner from './scanner';
import Parser from './parser';
import Interpreter from './interpreter';
import { Expression } from './expression';
import { LiteralType } from './token';
import ASTPrinter from './ASTPrinter';

export class Lox {
  public run(text: string) {
    const scanner = new Scanner(text);
    const tokens = scanner.scanTokens();
    const parser = new Parser(tokens);
    const expression = parser.expression();
    const printer = new ASTPrinter();
    const interpreter = new Interpreter();
    const result = interpreter.evaluate(expression as Expression<LiteralType>);
    console.log(printer.print(expression));
    this.print(result);
  }
  print(value: LiteralType) {
    if (value === null) {
      return 'nil';
    }
    if (typeof value === 'number') {
      const text = value.toString();
      if (text.endsWith('.0')) {
        return text.slice(0, text.length - 2);
      }
      return text;
    }
    return value.toString();
  }
}
