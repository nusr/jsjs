import type { ExpressionVisitor, Expression } from './expression';
import type { StatementVisitor, BlockStatement } from './statement';
export type LiteralType = any;
// | string
// | number
// | boolean
// | null
// | ClassInstance
// | ClassObject
// | FunctionObject
// | ReturnValue;

export interface Interpreter extends ExpressionVisitor, StatementVisitor {
  environment: Environment;
  evaluate: (expr: Expression) => LiteralType;
  executeBlock: (
    statement: BlockStatement,
    environment: Environment,
  ) => LiteralType;
}

export interface Environment {
  get(name: string): LiteralType;
  define(name: string, value: LiteralType): LiteralType;
  assign(name: string, value: LiteralType): LiteralType;
}

export interface IBaseCallable {
  call: (
    interpreter: Interpreter,
    argumentList: LiteralType[],
  ) => LiteralType;
  toString: () => string;
}

export type IGlobalConsole = Pick<Console, 'log' | 'error'>;

export type ObjectType = Record<LiteralType, LiteralType>;
