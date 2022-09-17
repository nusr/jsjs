import type { LiteralType, IBaseCallable } from './type';
import type Interpreter from './interpreter';
import type { FunctionStatement } from './statement';
import Environment from './environment';
import { FunctionExpression } from './expression'

class FunctionObject implements IBaseCallable {
  private readonly declaration: FunctionStatement | FunctionExpression;
  private readonly closure: Environment | null;
  constructor(declaration: FunctionStatement | FunctionExpression, closure: Environment | null) {
    this.declaration = declaration;
    this.closure = closure;
  }
  call(argumentList: LiteralType[], interpreter: Interpreter): LiteralType {
    const env = new Environment(this.closure);
    if (this.declaration instanceof FunctionExpression && this.declaration.name !== null) {
      env.define(this.declaration.name.lexeme, this);
    }
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
