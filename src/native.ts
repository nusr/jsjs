import type {
  LiteralType,
  IBaseCallable,
  ObjectType,
  IGlobalConsole,
  Environment,
} from './type';
import { isBaseCallable } from './util';

const consoleTypes = ['log', 'error'] as const;
type ConsoleType = typeof consoleTypes[number];

function getConsoleImplement(
  type: ConsoleType,
  consoleObject: IGlobalConsole,
): IBaseCallable {
  return {
    call(_, argumentList: LiteralType[]) {
      const result: LiteralType[] = [];
      for (const item of argumentList) {
        if (isBaseCallable(item)) {
          result.push(item.toString());
        } else {
          result.push(item);
        }
      }
      consoleObject[type](...result);
    },
    toString() {
      return `function ${type}() { [native code] }`;
    },
  };
}

function getGlobalObject(consoleObject: IGlobalConsole) {
  const consoleInstance: ObjectType = {};
  for (const type of consoleTypes) {
    consoleInstance[type] = getConsoleImplement(type, consoleObject);
  }
  return {
    console: consoleInstance,
  };
}

function registerGlobal(environment: Environment) {
  const temp = getGlobalObject(console);
  const keyList = Object.keys(temp) as Array<
    keyof ReturnType<typeof getGlobalObject>
  >;
  for (const key of keyList) {
    environment.define(key, temp[key]);
  }
}

export { getGlobalObject, registerGlobal };
