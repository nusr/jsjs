import Scanner from './scanner';
import Parser from './parser';
import Interpreter from './interpreter';
import type { Statement } from './statement';
import type { LiteralType } from './type';

export class Lox {
  public run(text = '') {
    const scanner = new Scanner(text);
    const tokens = scanner.scanTokens();
    console.log(tokens);
    const parser = new Parser(tokens);
    const statements = parser.parse();
    console.log(statements);
    const interpreter = new Interpreter();
    interpreter.interpret(statements as Statement<LiteralType>[]);
  }
}
