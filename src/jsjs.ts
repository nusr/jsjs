import Scanner from './scanner';
import Parser from './parser';
import Interpreter from './interpreter';
import type Environment from './environment';
import type { LiteralType } from './type';
import { Log } from './native'

class Jsjs {
  errors: string[] = [];
  private readonly text: string;
  private readonly environment: Environment;
  constructor(text: string, environment: Environment) {
    this.text = text;
    this.environment = environment;
    this.register('log', new Log())
  }
  register(name: string, value: LiteralType) {
    this.environment.define(name, value)
  }
  public run(): LiteralType {
    const scanner = new Scanner(this.text);
    const tokens = scanner.scanTokens();
    if (scanner.errors.length > 0) {
      this.errors = scanner.errors;
      return null;
    }
    const parser = new Parser(tokens);
    const statements = parser.parse();
    const interpreter = new Interpreter(statements, this.environment);
    return interpreter.interpret();
  }
}

export default Jsjs