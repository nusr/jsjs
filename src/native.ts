import type { LiteralType, BaseCallable } from './type';

class NativeClock implements BaseCallable {
  call(): LiteralType {
    return Math.floor(new Date().getTime() / 1000);
  }
  size(): number {
    return 0;
  }
  toString() {
    return `<native fn>`;
  }
}

export { NativeClock };
