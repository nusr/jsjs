import type { LiteralType, IBaseCallable, ObjectType } from './type';

export function convertLiteralTypeToString(val: LiteralType): string {
  if (val === null) {
    return 'null';
  }
  if (val === undefined) {
    return 'undefined';
  }
  if (typeof val === 'string') {
    return val;
  }
  if (typeof val === 'boolean') {
    return val.toString();
  }
  if (typeof val === 'number') {
    return val.toString();
  }
  if (val && typeof val.toString === 'function') {
    return val.toString();
  }
  return '';
}

function isFunction(fun: any): fun is Function {
  return typeof fun === 'function';
}

export function isBaseCallable(call: any): call is IBaseCallable {
  return call && isFunction(call.toString) && isFunction(call.call);
}

export function getNodeEnv(): string {
  return process.env['NODE_ENV'] || '';
}

export function isTestEnv(): boolean {
  return getNodeEnv() === 'test';
}

export function assert(
  condition: boolean,
  message = 'assert error',
): asserts condition {
  if (!condition) {
    if (getNodeEnv() === 'production') {
      console.error(message);
      return;
    }
    throw new Error(message);
  }
}

export function isObject(obj: any): obj is ObjectType {
  return obj && typeof obj === 'object';
}
