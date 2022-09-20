import type { LiteralType } from './type';

import type {
  BinaryExpression,
  GroupingExpression,
  LiteralExpression,
  UnaryExpression,
  AssignExpression,
  CallExpression,
  GetExpression,
  SetExpression,
  LogicalExpression,
  Expression,
  ExpressionVisitor,
  NewExpression,
  FunctionExpression,
  ArrayLiteralExpression,
  IndexExpression,
  ObjectLiteralExpression,
} from './expression';
import { VariableExpression } from './expression';
import { TokenType } from './tokenType';

import type {
  IfStatement,
  ReturnStatement,
  StatementVisitor,
  ExpressionStatement,
  Statement,
  BlockStatement,
  WhileStatement,
  ClassStatement,
  VariableStatement,
} from './statement';
import { FunctionStatement } from './statement';
import type Environment from './environment';
import { isBaseCallable, assert, isBaseSetGet } from './util';
import { FunctionObject } from './function';
import { ReturnValue } from './returnValue';
import { ClassObject, ClassInstance } from './class';
import { ArrayObject } from './array';

class Interpreter implements ExpressionVisitor, StatementVisitor {
  environment: Environment;
  private readonly statements: Statement[];
  errors: string[] = [];
  constructor(statements: Statement[], environment: Environment) {
    this.environment = environment;
    this.statements = statements;
  }
  interpret = (): LiteralType => {
    let result: LiteralType = null;
    for (const item of this.statements) {
      result = this.execute(item);
      if (result instanceof ReturnValue) {
        return result.value;
      }
    }
    return result;
  };
  private execute = (statement: Statement): LiteralType => {
    return statement.accept(this);
  };
  evaluate = (expr: Expression): LiteralType => {
    const result = expr.accept(this);
    if (result instanceof ReturnValue) {
      return result.value;
    }
    return result;
  };

  visitExpressionStatement = (statement: ExpressionStatement) => {
    return this.evaluate(statement.expression);
  };
  visitBlockStatement = (statement: BlockStatement) => {
    return this.executeBlock(statement, this.environment);
  };
  executeBlock = (
    statement: BlockStatement,
    environment: Environment,
  ): LiteralType => {
    const previous = this.environment;
    let result: LiteralType = null;
    this.environment = environment;
    for (let item of statement.statements) {
      result = this.execute(item);
      if (result instanceof ReturnValue) {
        this.environment = previous;
        return result;
      }
    }
    this.environment = previous;
    return result;
  };
  visitClassStatement = (statement: ClassStatement) => {
    const instance = new ClassObject(statement);
    for (const item of statement.methods) {
      if (item.static) {
        if (item instanceof FunctionStatement) {
          instance.set(
            item.name.lexeme,
            new FunctionObject(item, this.environment),
          );
        } else {
          let temp: LiteralType = null;
          if (item.initializer != null) {
            temp = this.evaluate(item.initializer);
          }
          instance.set(item.name.lexeme, temp);
        }
      }
    }

    this.environment.define(statement.name.lexeme, instance);
    return null;
  };
  visitNewExpression = (expression: NewExpression) => {
    const classObject = this.evaluate(expression.name);
    assert(
      classObject instanceof ClassInstance,
      `Class constructor ${expression.name.toString()} cannot be invoked without 'new'`,
    );
    return classObject;
  };
  visitFunctionStatement = (statement: FunctionStatement) => {
    this.environment.define(
      statement.name.lexeme,
      new FunctionObject(statement, this.environment),
    );
    return null;
  };
  visitFunctionExpression = (expression: FunctionExpression) => {
    return new FunctionObject(expression, this.environment);
  };
  visitCallExpression = (expr: CallExpression): LiteralType => {
    const callee: LiteralType = this.evaluate(expr.callee);
    const argumentList: LiteralType[] = [];
    for (let item of expr.argumentList) {
      argumentList.push(this.evaluate(item));
    }
    if (!isBaseCallable(callee)) {
      throw new Error(
        `can only call functions ${expr.paren.type} ${expr.paren.lexeme}`,
      );
    }
    return callee.call(argumentList, this);
  };
  visitIfStatement = (statement: IfStatement) => {
    let result: LiteralType = null;
    if (this.isTruthy(this.evaluate(statement.condition))) {
      result = this.execute(statement.thenBranch);
    } else if (statement.elseBranch) {
      result = this.execute(statement.elseBranch);
    }
    if (result instanceof ReturnValue) {
      return result;
    }
    return null;
  };

  visitReturnStatement = (statement: ReturnStatement) => {
    let result: LiteralType = undefined;
    if (statement.value !== null) {
      result = this.evaluate(statement.value);
    }
    return new ReturnValue(result);
  };
  visitVariableStatement = (statement: VariableStatement) => {
    let value = null;
    if (statement.initializer !== null) {
      value = this.evaluate(statement.initializer);
    }
    this.environment.define(statement.name.lexeme, value);
    return null;
  };
  visitWhileStatement = (statement: WhileStatement) => {
    while (this.isTruthy(this.evaluate(statement.condition))) {
      const result = this.execute(statement.body);
      if (result instanceof ReturnValue) {
        return result;
      }
    }
    return null;
  };

  visitAssignExpression = (expr: AssignExpression) => {
    const temp: LiteralType = this.evaluate(expr.value);
    this.environment.assign(expr.name, temp);
    return temp;
  };
  visitBinaryExpression = (expr: BinaryExpression): LiteralType => {
    const left: LiteralType = this.evaluate(expr.left);
    const right: LiteralType = this.evaluate(expr.right);
    switch (expr.operator.type) {
      case TokenType.MINUS:
        return left - right;
      case TokenType.PLUS:
        return left + right;
      case TokenType.STAR:
        return left * right;
      case TokenType.REMAINDER:
        return left % right;
      case TokenType.SLASH:
        return left / right;
      case TokenType.GREATER:
        return left > right;
      case TokenType.GREATER_EQUAL:
        return left >= right;
      case TokenType.LESS:
        return left < right;
      case TokenType.LESS_EQUAL:
        return left <= right;
      case TokenType.BANG_EQUAL:
        return left != right;
      case TokenType.BANG_EQUAL_EQUAL:
        return left !== right;
      case TokenType.EQUAL_EQUAL:
        return left == right;
      case TokenType.EQUAL_EQUAL_EQUAL:
        return left === right;
    }
    return null;
  };

  visitGetExpression = (expr: GetExpression) => {
    const temp = this.evaluate(expr.object);
    if (isBaseSetGet(temp)) {
      return temp.get(expr.name.lexeme);
    }
    throw new Error('error GetExpression');
  };
  visitSetExpression = (expr: SetExpression): LiteralType => {
    const temp = this.evaluate(expr.object.object);
    if (isBaseSetGet(temp)) {
      const value = this.evaluate(expr.value);
      temp.set(expr.object.name.lexeme, value);
      return value;
    }
    throw new Error('error SetExpression');
  };
  visitLogicalExpression = (expr: LogicalExpression) => {
    const left = this.evaluate(expr.left);
    if (expr.operator.type === TokenType.OR) {
      if (this.isTruthy(left)) {
        return left;
      }
    } else {
      if (!this.isTruthy(left)) {
        return left;
      }
    }
    return this.evaluate(expr.right);
  };
  visitSuperExpression = (): LiteralType => {
    return null;
  };
  visitThisExpression = (): LiteralType => {
    return null;
  };
  visitVariableExpression = (expr: VariableExpression): LiteralType => {
    return this.environment.get(expr.name);
  };
  visitGroupingExpression = (expr: GroupingExpression): LiteralType => {
    return this.evaluate(expr.expression);
  };
  visitLiteralExpression = (expr: LiteralExpression): LiteralType => {
    return expr.value;
  };
  visitUnaryExpression = (expr: UnaryExpression): LiteralType => {
    const right: LiteralType = this.evaluate(expr.right);
    switch (expr.operator.type) {
      case TokenType.MINUS:
        return -right;
      case TokenType.BANG:
        return !this.isTruthy(right);
      case TokenType.PLUS_PLUS:
      case TokenType.MINUS_MINUS: {
        assert(
          expr.right instanceof VariableExpression,
          'Invalid left-hand side expression in prefix operation',
        );
        let result = right;
        if (expr.operator.type === TokenType.MINUS_MINUS) {
          result--;
        } else {
          result++;
        }
        this.environment.assign(expr.right.name, result);
        return result;
      }
    }
    return null;
  };

  isTruthy(value: LiteralType) {
    if (value === null) {
      return false;
    }
    return Boolean(value);
  }
  visitArrayLiteralExpression = (expression: ArrayLiteralExpression) => {
    const value = expression.value.map((item) => this.evaluate(item));
    return new ArrayObject(value);
  };
  visitIndexExpression = (expression: IndexExpression) => {
    const callee = this.evaluate(expression.value);
    const index = this.evaluate(expression.index);
    if (callee instanceof ArrayObject) {
      return callee.value[index]
    }
    if (callee instanceof ClassInstance) {
      return callee.get(index);
    }
    return undefined;
  };
  visitObjectLiteralExpression = (expression: ObjectLiteralExpression) => {
    const instance = new ClassInstance();
    for (const item of expression.value) {
      const key = this.evaluate(item.key);
      const value = this.evaluate(item.value);
      instance.set(key.toString(), value);
    }
    return instance;
  }
}

export default Interpreter;
