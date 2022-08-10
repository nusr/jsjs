import type { LiteralType, BaseCallable } from './type';
import type Interpreter from './interpreter';

export class LoxInstance {
  classObject: LoxClass;
  constructor(classObject: LoxClass) {
    this.classObject = classObject;
  }
  toString() {
    return this.classObject.toString()
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
