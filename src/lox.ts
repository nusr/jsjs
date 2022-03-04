import Scanner from './scanner';
import Parser from './parser';
import Interpreter from './interpreter';
import { Statement } from './statement';
import { LiteralType } from './token';

export class Lox {
  public run(text = '') {
    const scanner = new Scanner(text);
    const tokens = scanner.scanTokens();
    const parser = new Parser(tokens);
    const statements = parser.parse();
    const interpreter = new Interpreter();
    const result = interpreter.interpret(
      statements as Statement<LiteralType>[],
    );
    return result;
  }
}
