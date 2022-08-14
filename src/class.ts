import type { LiteralType, BaseCallable } from './type';
import type Interpreter from './interpreter';
import type Token from './token';

export class LoxInstance {
  private readonly classObject: LoxClass;
  private readonly fields: Map<string, LiteralType> = new Map<
    string,
    LiteralType
  >();
  constructor(classObject: LoxClass) {
    this.classObject = classObject;
  }
  get(name: Token): LiteralType {
    if (!this.fields.has(name.lexeme)) {
      throw new Error(`not defined property ${name.lexeme}`)
    }
    return this.fields.get(name.lexeme);
  }
  set(name: Token, value: LiteralType): void {
    this.fields.set(name.lexeme, value);
  }
  toString() {
    return this.classObject.toString();
  }
}

export class LoxClass implements BaseCallable {
  private readonly name: string;
  constructor(name: string) {
    this.name = name;
  }
  size() {
    return 0;
  }
  call(interpreter: Interpreter, argumentList: LiteralType[]): LiteralType {
    return new LoxInstance(this);
  }
  toString() {
    return this.name;
  }
}
