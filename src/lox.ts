import Scanner from './Scanner';
import Parser from './Parser';
import Interpreter from './Interpreter';
import type { Statement } from './Statement';
import type { LiteralType } from './type';
import Debug from './debug';

const debug = new Debug('lox').init();

export class Lox {
  public run(text = '') {
    const scanner = new Scanner(text);
    const tokens = scanner.scanTokens();
    debug(tokens);
    const parser = new Parser(tokens);
    const statements = parser.parse();
    debug(statements);
    const interpreter = new Interpreter();
    interpreter.interpret(statements as Statement<LiteralType>[]);
  }
}
