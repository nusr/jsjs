import type Interpreter from './interpreter';

export type LiteralType = any;
// string | number | boolean | null;

export interface BaseCallable {
  size: () => number;
  call: (interpreter: Interpreter, argumentList: LiteralType[]) => LiteralType;
  toString: () => string;
}
