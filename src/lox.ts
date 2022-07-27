import Scanner from './scanner';
import Parser from './parser';
import Interpreter from './interpreter';
import Debug from './debug';
import type Environment from './environment';
import { NativeClock } from './native';

const debug = new Debug('lox').init();

export class Lox {
  public run(text: string, env: Environment) {
    const scanner = new Scanner(text);
    const tokens = scanner.scanTokens();
    debug(tokens);
    const parser = new Parser(tokens);
    const statements = parser.parse();
    debug(statements);
    const interpreter = new Interpreter();
    env.define('clock', new NativeClock())
    interpreter.interpret(statements, env);
  }
}
