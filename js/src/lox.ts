import Scanner from './scanner';
import Parser from './parser';
import Interpreter from './interpreter';
import { Expression } from './expression';
import { LiteralType } from './token';
import ASTPrinter from './ASTPrinter';

export class Lox {
  public run(text = '') {
    const scanner = new Scanner(text);
    const tokens = scanner.scanTokens();
    const parser = new Parser(tokens);
    const expression = parser.expression();
    const printer = new ASTPrinter();
    const interpreter = new Interpreter();
    const result = interpreter.evaluate(expression as Expression<LiteralType>);
    console.log('ast:', printer.print(expression));
    return result;
  }
}
