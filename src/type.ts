import type Interpreter from './interpreter';

export type LiteralType = any;
// string | number | boolean | null;

export interface IBaseSetGet {
  get: (name: string) => LiteralType;
  set: (name: string, value: LiteralType) => void;
}

export interface IBaseCallable {
  call: (argumentList: LiteralType[], interpreter: Interpreter) => LiteralType;
  toString: () => string;
}

export type IGlobalConsole = Pick<Console, 'log' | 'error'>;