import type { LiteralType, IBaseCallable, ObjectType } from './type';
import { ClassStatement, FunctionStatement } from './statement';
import type Interpreter from './interpreter';
import { FunctionObject } from './function';
import Environment from './environment';

export class ClassObject implements IBaseCallable {
  private readonly statement: ClassStatement;
  constructor(statement: ClassStatement) {
    this.statement = statement;
  }
  call(argumentList: LiteralType[], interpreter: Interpreter): LiteralType {
    const instance: ObjectType = {};
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
          instance[item.name.lexeme] = new FunctionObject(item, env);
        }
      } else {
        let temp: LiteralType = null;
        if (item.initializer != null) {
          temp = interpreter.evaluate(item.initializer);
        }
        instance[item.name.lexeme] = temp;
      }
    }
    return instance;
  }
  toString() {
    return this.statement.toString();
  }
}
