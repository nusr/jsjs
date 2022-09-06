import type { LiteralType } from './type';

class ReturnValue {
  value: LiteralType;
  constructor(value: LiteralType) {
    this.value = value;
  }
}

export { ReturnValue };
