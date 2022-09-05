import Scanner from './scanner';
import Parser from './parser';
import Interpreter from './interpreter';
import type Environment from './environment';
import { NativeClock } from './native';
import type { LiteralType } from './type';

class Jsjs {
  errors: string[] = [];
  public run(text: string, env: Environment): LiteralType[] {
    const scanner = new Scanner(text);
    const tokens = scanner.scanTokens();
    if (scanner.errors.length > 0) {
      this.errors = scanner.errors;
      return [];
    }
    const parser = new Parser(tokens);
    const statements = parser.parse();
    const interpreter = new Interpreter();
    env.define('clock', new NativeClock())
    return interpreter.interpret(statements, env);
  }
}

export default Jsjs