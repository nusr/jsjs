import type { LiteralType, IBaseCallable, IBaseSetGet } from './type';
import { ClassStatement, FunctionStatement } from './statement';
import type Interpreter from './interpreter';
import { FunctionObject } from './function';
import Environment from './environment';

export class ClassInstance implements IBaseSetGet {
  private readonly methods: Record<string, LiteralType> = {};
  get(name: string): LiteralType {
    if (name in this.methods) {
      return this.methods[name];
    }
    throw new Error(`not defined property ${name}`);
  }
  set(name: string, value: LiteralType): void {
    this.methods[name] = value;
  }
}

export class ClassObject extends ClassInstance implements IBaseCallable {
  private readonly statement: ClassStatement;
  constructor(statement: ClassStatement) {
    super();
    this.statement = statement;
  }
  call(argumentList: LiteralType[], interpreter: Interpreter): LiteralType {
    const instance = new ClassInstance();
    const env = new Environment(interpreter.environment);
    env.define('this', instance);
    for (const item of this.statement.methods) {
      if (item.static) {
        continue;
      }
      if (item instanceof FunctionStatement) {
        if (item.name.lexeme === 'constructor') {
          const temp = new FunctionObject(item, env);
          temp.call(argumentList, interpreter);
        } else {
          instance.set(item.name.lexeme, new FunctionObject(item, env));
        }
      } else {
        let temp: LiteralType = null;
        if (item.initializer != null) {
          temp = interpreter.evaluate(item.initializer);
        }
        instance.set(item.name.lexeme, temp);
      }
    }
    return instance;
  }
  override toString() {
    return this.statement.toString();
  }
}
