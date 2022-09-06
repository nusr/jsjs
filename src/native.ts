import type { LiteralType, BaseCallable } from './type';
import { isBaseCallable } from './util';
class Log implements BaseCallable {
  log(result: LiteralType[]) {
    console.log(...result);
  }
  call(argumentList: LiteralType[]): LiteralType {
    const result: LiteralType[] = [];
    for (const item of argumentList) {
      if (isBaseCallable(item)) {
        result.push(item.toString());
      } else {
        result.push(item);
      }
    }
    this.log(result);
    return null;
  }
  toString() {
    return `log`;
  }
}

export { Log };
