import type { LiteralType, Environment } from './type';
class EnvironmentImpl implements Environment {
  private readonly values = new Map<string, LiteralType>();
  private parent: Environment | null = null;
  constructor(parent: Environment | null) {
    this.parent = parent;
  }
  get(name: string): LiteralType {
    if (this.values.has(name)) {
      return this.values.get(name) as LiteralType;
    }
    if (this.parent !== null) {
      return this.parent.get(name);
    }
    return undefined
  }
  define(name: string, value: LiteralType) {
    this.values.set(name, value);
  }
  assign(name: string, value: LiteralType) {
    if (this.values.has(name)) {
      this.values.set(name, value);
      return;
    }
    if (this.parent !== null) {
      this.parent.assign(name, value);
      return;
    }
    this.values.set(name, value)
  }
}

export default EnvironmentImpl;
