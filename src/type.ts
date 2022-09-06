import type Interpreter from './interpreter';

export type LiteralType = any;
// string | number | boolean | null;

export interface BaseCallable {
  call: (argumentList: LiteralType[], interpreter: Interpreter) => LiteralType;
  toString: () => string;
}
