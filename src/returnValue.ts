import type { LiteralType } from './type';

class ReturnValue extends Error {
  value: LiteralType;
  constructor(value: LiteralType) {
    super(value);
    this.value = value;
  }
}

export { ReturnValue };
