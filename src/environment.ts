import type { LiteralType } from './type';
import type Token from './token';
class Environment {
  private readonly values = new Map<string, LiteralType>();
  private parent: Environment | null = null;
  constructor(parent: Environment | null) {
    this.parent = parent;
  }
  get(name: Token): LiteralType {
    if (this.values.has(name.lexeme)) {
      return this.values.get(name.lexeme) as LiteralType;
    }
    if (this.parent !== null) {
      return this.parent.get(name);
    }
    return undefined
  }
  define(name: string, value: LiteralType) {
    this.values.set(name, value);
  }
  assign(name: Token, value: LiteralType) {
    if (this.values.has(name.lexeme)) {
      this.values.set(name.lexeme, value);
      return;
    }
    if (this.parent !== null) {
      this.parent.assign(name, value);
      return;
    }
    this.values.set(name.lexeme, value)
  }
}

export default Environment;
