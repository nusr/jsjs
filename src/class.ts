import type { LiteralType, IBaseCallable, ObjectType } from './type';
import { ClassStatement, FunctionStatement } from './statement';
import type Interpreter from './interpreter';
import { FunctionObject } from './function';
import Environment from './environment';
import { ClassExpression } from './expression';

export class ClassObject implements IBaseCallable {
  private readonly statement: ClassStatement | ClassExpression;
  readonly staticMethods: ObjectType = {};
  constructor(statement: ClassStatement | ClassExpression) {
    this.statement = statement;
  }
  call(interpreter: Interpreter, argumentList: LiteralType[]): LiteralType {
    const instance: ObjectType = {};
    const env = new Environment(interpreter.environment);

    if (
      this.statement instanceof ClassExpression &&
      this.statement.name !== null
    ) {
      env.define(this.statement.name.lexeme, this);
    }
    if (this.statement.superClass !== null) {
      const temp = interpreter.evaluate(this.statement.superClass);
      if (temp instanceof ClassObject) {
        const superData: IBaseCallable = {
          call(interpreter: Interpreter, argumentList: LiteralType[]) {
            const originInstance = temp.call(interpreter, argumentList);
            for (const key of Object.keys(originInstance)) {
              instance[key] = originInstance[key];
            }
          },
          toString() {
            return 'super';
          },
        };
        env.define('super', superData);
      } else {
        throw new Error(
          `Class extends value ${temp} is not a constructor or null`,
        );
      }
    }
    env.define('this', instance);
    for (const item of this.statement.methods) {
      if (item.static) {
        continue;
      }
      if (item instanceof FunctionStatement) {
        if (item.name.lexeme === 'constructor') {
          const temp = new FunctionObject(item, env);
          temp.call(interpreter, argumentList);
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
