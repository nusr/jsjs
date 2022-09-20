import type Interpreter from './interpreter';

export type LiteralType = any;
// | string
// | number
// | boolean
// | null
// | ClassInstance
// | ClassObject
// | FunctionObject
// | ReturnValue;

export interface IBaseSetGet {
  get: (name: LiteralType) => LiteralType;
  set: (name: LiteralType, value: LiteralType) => void;
}

export interface IBaseCallable {
  call: (argumentList: LiteralType[], interpreter: Interpreter) => LiteralType;
  toString: () => string;
}

export type IGlobalConsole = Pick<Console, 'log' | 'error'>;
