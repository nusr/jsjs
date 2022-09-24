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

export interface IBaseCallable {
  call: (interpreter: Interpreter, argumentList: LiteralType[]) => LiteralType;
  toString: () => string;
}

export type IGlobalConsole = Pick<Console, 'log' | 'error'>;

export type ObjectType = Record<LiteralType, LiteralType>;
