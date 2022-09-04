import type { LiteralType } from './type';

import {
  BinaryExpression,
  GroupingExpression,
  LiteralExpression,
  UnaryExpression,
  AssignExpression,
  CallExpression,
  GetExpression,
  SetExpression,
  LogicalExpression,
  SuperExpression,
  ThisExpression,
  Expression,
  ExpressionVisitor,
  VariableExpression,
} from './expression';
import { TokenType } from './tokenType';

import type {
  FunctionStatement,
  IfStatement,
  PrintStatement,
  ReturnStatement,
  StatementVisitor,
  ExpressionStatement,
  Statement,
  BlockStatement,
  WhileStatement,
  ClassStatement,
  VariableStatement,
} from './statement';
import Environment from './environment';
import {
  isBaseCallable,
  assert,
} from './util';
import { LoxCallable } from './loxCallable';
import { ReturnValue } from './returnValue';
import { LoxClass, LoxInstance } from './class';

class Interpreter implements ExpressionVisitor, StatementVisitor {
  globals = new Environment(null);
  private environment = this.globals;
  errors: string[] = [];

  interpret = (list: Statement[], env: Environment): LiteralType[] => {
    this.globals = env;
    this.environment = env;
    const result: LiteralType[] = []
    for (const item of list) {
      result.push(this.execute(item))
    }
    return result;
  };
  private execute = (statement: Statement) => {
    return statement.accept(this);
  };
  private evaluate = (expr: Expression): LiteralType => {
    return expr.accept(this);
  };
  visitExpressionStatement = (statement: ExpressionStatement) => {
    return this.evaluate(statement.expression);
  };
  visitBlockStatement = (statement: BlockStatement) => {
    return this.executeBlock(statement, new Environment(this.environment));
  };
  executeBlock = (
    statement: BlockStatement,
    environment: Environment,
  ): LiteralType => {
    const previous = this.environment;
    let result: LiteralType | null = null;
    try {
      this.environment = environment;
      for (let item of statement.statements) {
        this.execute(item);
      }
    } catch (error) {
      if (error instanceof ReturnValue) {
        result = error.value;
      }
    } finally {
      this.environment = previous;
    }
    return result;
  };
  visitClassStatement = (statement: ClassStatement) => {
    this.environment.define(statement.name.lexeme, null);
    const instance = new LoxClass(statement.name.lexeme);
    this.environment.assign(statement.name, instance);
    return null;
  };
  visitFunctionStatement = (statement: FunctionStatement) => {
    this.environment.define(
      statement.name.lexeme,
      new LoxCallable(statement, this.environment),
    );
    return null;
  };
  visitIfStatement = (statement: IfStatement) => {
    if (this.isTruthy(this.evaluate(statement.condition))) {
      this.execute(statement.thenBranch);
    } else if (statement.elseBranch) {
      this.execute(statement.elseBranch);
    }
    return null;
  };
  visitPrintStatement = (statement: PrintStatement) => {
    let result: LiteralType = this.evaluate(statement.expression);
    if (result && result.toString && typeof result.toString === 'function') {
      result = result.toString();
    }
    console.log(result);
    return null;
  };
  visitReturnStatement = (statement: ReturnStatement) => {
    if (statement.value !== null) {
      const result = this.evaluate(statement.value);
      throw new ReturnValue(result);
    }
    return null;
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
      this.execute(statement.body);
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
        return Number(left) - Number(right);
      case TokenType.PLUS:
        if (typeof left === 'number' && typeof right === 'number') {
          return Number(left) + Number(right);
        }
        if (typeof left === 'string' || typeof right === 'string') {
          return String(left) + String(right);
        }
        if (
          (typeof left === 'string' && typeof right === 'number') ||
          (typeof left === 'number' && typeof right === 'string')
        ) {
          return String(left) + String(right);
        }
        return null;
      case TokenType.STAR:
        return Number(left) * Number(right);
      case TokenType.SLASH: {
        const temp = Number(right);
        if (temp === 0) {
          throw new Error('slash is zero');
        }
        return Number(left) / temp;
      }

      case TokenType.GREATER:
        return Number(left) > Number(right);
      case TokenType.GREATER_EQUAL:
        return Number(left) >= Number(right);
      case TokenType.LESS:
        return Number(left) < Number(right);
      case TokenType.LESS_EQUAL:
        return Number(left) <= Number(right);
      case TokenType.BANG_EQUAL:
        return !this.isEqual(left, right);
      case TokenType.EQUAL_EQUAL:
        return this.isEqual(left, right);
    }
    return null;
  };
  visitCallExpression = (expr: CallExpression): LiteralType => {
    const callee: LiteralType = this.evaluate(expr.callee);
    const argumentList: LiteralType[] = [];
    for (let item of expr.argumentList) {
      argumentList.push(this.evaluate(item));
    }
    if (!isBaseCallable(callee)) {
      throw new Error(`can only call functions ${expr.paren.type} ${expr.paren.lexeme}`);
    }
    return callee.call(this, argumentList);
  };
  visitGetExpression = (expr: GetExpression) => {
    const temp = this.evaluate(expr.object);
    if (temp instanceof LoxInstance) {
      return temp.get(expr.name);
    }
    throw new Error('error GetExpression');
  };
  visitSetExpression = (expr: SetExpression) => {
    const temp = this.evaluate(expr.object);
    if (!(temp instanceof LoxInstance)) {
      return new Error('error SetExpression');
    }
    const value = this.evaluate(expr.value);
    temp.set(expr.name, value);
    return value;
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
  visitSuperExpression = (expr: SuperExpression): LiteralType => {
    return expr;
  };
  visitThisExpression = (expr: ThisExpression): LiteralType => {
    return expr;
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
        return -Number(right);
      case TokenType.BANG:
        return !this.isTruthy(right);
      case TokenType.PLUS_PLUS:
      case TokenType.MINUS_MINUS: {
        assert(typeof right === 'number', 'must be number');
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

  print = (expr: Expression) => {
    return expr.accept(this);
  };
  isEqual(left: LiteralType, right: LiteralType) {
    if (left === null && right === null) {
      return true;
    }
    if (left === null) {
      return false;
    }
    return left === right;
  }
  isTruthy(value: LiteralType) {
    if (value === null) {
      return false;
    }
    return Boolean(value);
  }
}

export default Interpreter;
