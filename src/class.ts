import type { LiteralType, BaseCallable } from './type';
import type Token from './token';

export class ClassInstance {
  private readonly classObject: ClassObject;
  constructor(classObject: ClassObject) {
    this.classObject = classObject;
  }
  get(name: Token): LiteralType {
    if (name.lexeme in this.classObject.methods) {
      return this.classObject.methods[name.lexeme];
    }
    throw new Error(`not defined property ${name.lexeme}`);
  }
  set(name: Token, value: LiteralType): void {
    this.classObject.methods[name.lexeme] = value;
  }
  toString() {
    return this.classObject.toString();
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
    const instance = new ClassInstance(this);
    return instance;
  }
  toString() {
    return this.name;
  }
}
