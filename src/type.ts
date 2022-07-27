import type Interpreter from './interpreter';

export type LiteralType = any;

export interface BaseCallable {
  size: () => number;
  call: (interpreter: Interpreter, argumentList: LiteralType[]) => LiteralType;
  toString: () => string;
}
