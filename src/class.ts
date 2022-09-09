import type { LiteralType, BaseCallable } from './type';
import type Token from './token';

export class ClassInstance {
  private readonly methods: Record<string, LiteralType>;
  constructor(methods: Record<string, LiteralType>) {
    this.methods = methods;
  }
  get(name: Token): LiteralType {
    if (name.lexeme in this.methods) {
      return this.methods[name.lexeme];
    }
    throw new Error(`not defined property ${name.lexeme}`);
  }
  set(name: Token, value: LiteralType): void {
    this.methods[name.lexeme] = value;
  }
  toString() {
    return this.methods.toString();
  }
}

export class ClassObject implements BaseCallable {
  private readonly name: string;
  readonly methods: Record<string, LiteralType> = {};
  constructor(name: string, methods: Record<string, LiteralType>) {
    this.name = name;
    this.methods = methods;
  }
  call(): LiteralType {
    const instance = new ClassInstance({
      ...this.methods,
    });
    return instance;
  }
  toString() {
    return this.name;
  }
}
