import type { LiteralType, ObjectType, Interpreter, Environment } from './type';

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
  NewExpression,
  FunctionExpression,
  ArrayLiteralExpression,
  ObjectLiteralExpression,
  TokenExpression,
  ClassExpression,
} from './expression';
import { VariableExpression } from './expression';
import { TokenType } from './tokenType';

import type {
  IfStatement,
  ReturnStatement,
  ExpressionStatement,
  Statement,
  BlockStatement,
  WhileStatement,
  ClassStatement,
  VariableStatement,
} from './statement';
import { FunctionStatement } from './statement';
import { isBaseCallable, assert, isObject } from './util';
import { FunctionObject } from './function';
import { ReturnValue } from './return';
import { ClassObject } from './class';

class InterpreterImpl implements Interpreter {
  environment: Environment;
  private readonly statements: Statement[];
  private calleeKey: string = '';
  private calleeValue: ObjectType | undefined = undefined;
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
  private visitClass = (
    expression: ClassExpression | ClassStatement,
  ): ClassObject => {
    const instance = new ClassObject(expression);
    if (expression.superClass !== null) {
      const temp = this.evaluate(expression.superClass);
      if (temp instanceof ClassObject) {
        for (const key of Object.keys(temp.staticMethods)) {
          instance.staticMethods[key] = temp.staticMethods[key];
        }
      } else {
        throw new Error(
          `Class extends value ${temp} is not a constructor or null`,
        );
      }
    }
    for (const item of expression.methods) {
      if (item.static) {
        let temp: LiteralType = null;
        if (item instanceof FunctionStatement) {
          temp = new FunctionObject(item, this.environment);
        } else {
          if (item.initializer != null) {
            temp = this.evaluate(item.initializer);
          }
        }
        instance.staticMethods[item.name.lexeme] = temp;
      }
    }
    return instance;
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
    const instance = this.visitClass(statement);
    this.environment.define(statement.name.lexeme, instance);
    return null;
  };
  visitNewExpression = (expression: NewExpression) => {
    const classObject = this.evaluate(expression.callee);
    assert(
      isObject(classObject),
      `Class constructor ${expression.callee.toString()} cannot be invoked without 'new'`,
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
      throw new Error('can only call functions');
    }
    return callee.call(this, argumentList);
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
    if (statement.argument !== null) {
      result = this.evaluate(statement.argument);
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
    const temp: LiteralType = this.evaluate(expr.right);
    this.environment.assign(expr.left.lexeme, temp);
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
      case TokenType.LEFT_SHIFT:
        return left << right;
      case TokenType.RIGHT_SHIFT:
        return left >> right;
      case TokenType.UNSIGNED_RIGHT_SHIFT:
        return left >>> right;
      case TokenType.STAR_STAR:
        return left ** right;
      case TokenType.BIT_AND:
        return left & right;
      case TokenType.BIT_OR:
        return left | right;
      case TokenType.BIT_X_OR:
        return left ^ right;
      case TokenType.IN:
        return left in right;
      case TokenType.INSTANCE_OF:
        return left instanceof right;
    }
    return null;
  };

  visitGetExpression = (expr: GetExpression) => {
    const callee = this.evaluate(expr.object);
    const key = this.evaluate(expr.property);
    this.calleeKey = key;
    if (callee instanceof ClassObject && key in callee.staticMethods) {
      this.calleeValue = callee.staticMethods;
      return callee.staticMethods[key];
    }
    this.calleeValue = callee;
    return callee[key];
  };
  visitSetExpression = (expr: SetExpression): LiteralType => {
    this.calleeKey = '';
    this.calleeValue = undefined;
    this.evaluate(expr.object);
    const key = this.calleeKey;
    const callee: ObjectType | undefined = this.calleeValue;
    const value = this.evaluate(expr.value);
    if (callee && isObject(callee)) {
      // @ts-ignore
      callee[key] = value;
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
    } else if (expr.operator.type === TokenType.AND) {
      if (!this.isTruthy(left)) {
        return left;
      }
    } else if (expr.operator.type === TokenType.NULLISH_COALESCING) {
      if (left !== null && left !== undefined) {
        return left;
      }
    } else {
      throw new Error(
        `can no handle logic operator: ${expr.operator.toString()}`,
      );
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
    return this.environment.get(expr.name.lexeme);
  };
  visitGroupingExpression = (expr: GroupingExpression): LiteralType => {
    return this.evaluate(expr.expression);
  };
  visitLiteralExpression = (expr: LiteralExpression): LiteralType => {
    return expr.value;
  };
  visitUnaryExpression = (expr: UnaryExpression): LiteralType => {
    const isDelete = expr.operator.type === TokenType.DELETE;
    if (isDelete) {
      this.calleeKey = '';
      this.calleeValue = undefined;
    }
    const right: LiteralType = this.evaluate(expr.right);
    switch (expr.operator.type) {
      case TokenType.MINUS:
        return -right;
      case TokenType.PLUS:
        return right;
      case TokenType.BIT_NOT:
        return ~right;
      case TokenType.BANG:
        return !this.isTruthy(right);
      case TokenType.TYPEOF:
        return typeof right;
      case TokenType.DELETE: {
        if (this.calleeValue === undefined) {
          throw new ReferenceError('is not defined');
        }
        return delete this.calleeValue[this.calleeKey];
      }
      case TokenType.VOID:
        return undefined;
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
        this.environment.assign(expr.right.name.lexeme, result);
        return result;
      }
    }
    return null;
  };

  private isTruthy(value: LiteralType) {
    if (value === null) {
      return false;
    }
    return Boolean(value);
  }
  visitArrayLiteralExpression = (expression: ArrayLiteralExpression) => {
    const value = expression.elements.map((item) => this.evaluate(item));
    return value;
  };
  visitObjectLiteralExpression = (expression: ObjectLiteralExpression) => {
    const instance: ObjectType = {};
    for (const item of expression.properties) {
      const key = this.evaluate(item.key);
      const value = this.evaluate(item.value);
      instance[key] = value;
    }
    return instance;
  };
  visitTokenExpression = (expression: TokenExpression) => {
    return expression.token.lexeme;
  };
  visitClassExpression = (expression: ClassExpression) => {
    return this.visitClass(expression);
  };
}

export default InterpreterImpl;
