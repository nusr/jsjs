import Scanner from './scanner';
import Parser from './parser';
import InterpreterImpl from './interpreter';
import type { LiteralType, Environment } from './type';

export function interpret(text: string, environment: Environment): LiteralType {
  const scanner = new Scanner(text);
  const tokens = scanner.scan();
  const parser = new Parser(tokens);
  const statements = parser.parse();
  const interpreter = new InterpreterImpl(statements, environment);
  return interpreter.interpret();
}
