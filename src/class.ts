import type { LiteralType, BaseCallable } from './type';
import type Token from './token';
import type { ClassStatement } from './statement';
import { LoxCallable } from './loxCallable';
import type Environment from './environment';

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
      throw new Error(`not defined property ${name.lexeme}`);
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
  private readonly statement: ClassStatement;
  private readonly closure: Environment | null;
  constructor(statement: ClassStatement, closure: Environment | null) {
    this.statement = statement;
    this.closure = closure;
  }
  call(): LiteralType {
    const instance = new LoxInstance(this);
    for (const item of this.statement.methods) {
      instance.set(item.name, new LoxCallable(item, this.closure));
    }
    return instance;
  }
  toString() {
    return this.statement.toString();
  }
}
