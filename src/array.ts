import type { LiteralType } from './type';

class ArrayObject {
  readonly value: LiteralType[];
  constructor(value: LiteralType[]) {
    this.value = value;
  }
}
export { ArrayObject };
