import type {
  LiteralType,
  IBaseCallable,
  Interpreter,
  Environment,
} from './type';
import type { FunctionStatement } from './statement';
import EnvironmentImpl from './environment';
import { FunctionExpression } from './expression';

class FunctionObject implements IBaseCallable {
  private readonly declaration: FunctionStatement | FunctionExpression;
  private readonly closure: Environment | null;
  constructor(
    declaration: FunctionStatement | FunctionExpression,
    closure: Environment | null,
  ) {
    this.declaration = declaration;
    this.closure = closure;
  }
  call(interpreter: Interpreter, argumentList: LiteralType[]): LiteralType {
    const env = new EnvironmentImpl(this.closure);
    if (
      this.declaration instanceof FunctionExpression &&
      this.declaration.name !== null
    ) {
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
