import type { LiteralType, IBaseCallable } from './type';
import type Interpreter from './interpreter';
import type { FunctionStatement } from './statement';
import Environment from './environment';

class FunctionObject implements IBaseCallable {
  private readonly declaration: FunctionStatement;
  private readonly closure: Environment | null;
  constructor(declaration: FunctionStatement, closure: Environment | null) {
    this.declaration = declaration;
    this.closure = closure;
  }
  call(argumentList: LiteralType[], interpreter: Interpreter): LiteralType {
    const argumentObject: Record<string | number, LiteralType> = [];
    for (let i = 0; i < argumentList.length; i++) {
      argumentObject[i] = argumentList[i];
    }
    argumentObject['length'] = argumentList.length;
    const env = new Environment(this.closure);
    env.define('arguments', argumentObject);
    for (let i = 0; i < this.declaration.params.length; i++) {
      env.define(this.declaration.params[i]?.lexeme!, argumentList[i]);
    }
    return interpreter.executeBlock(this.declaration.body, env);
  }
  toString() {
    return this.declaration.toString();
  }
}

export { FunctionObject };
