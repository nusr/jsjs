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

import eventEmitter from './eventEmitter';
import Environment from './environment';
import { RuntimeError } from './error';
import globalExpect from './expect';
import {
  convertLiteralTypeToString,
  isBaseCallable,
  isTestEnv,
  assert,
} from './util';
import { LoxCallable } from './loxCallable';
import { ReturnValue } from './returnValue';

class Interpreter implements ExpressionVisitor, StatementVisitor {
  globals = new Environment(null);
  private environment = this.globals;

  interpret = (list: Statement[], env: Environment): void => {
    this.globals = env;
    this.environment = env;
    for (const item of list) {
      this.execute(item);
    }
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
    console.log(statement);
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
    const result: LiteralType = this.evaluate(statement.expression);
    console.log(result);
    eventEmitter.emit('print', { value: result });
    if (isTestEnv() && statement.comment !== null) {
      const expect = statement.comment.lexeme;
      const actual = convertLiteralTypeToString(result);
      globalExpect.add();
      if (expect === actual) {
        globalExpect.addSuccess();
      }
    }
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
      throw new RuntimeError(expr.paren, 'can only call functions');
    }
    return callee.call(this, argumentList);
  };
  visitGetExpression = (expr: GetExpression) => {
    return this.parenthesize(expr.name.lexeme, expr.object);
  };
  visitSetExpression = (expr: SetExpression) => {
    return this.parenthesize(expr.name.lexeme, expr.object, expr.value);
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
  visitSuperExpression = (expr: SuperExpression) => {
    return this.parenthesize(expr.keyword.lexeme, expr.value);
  };
  visitThisExpression = (expr: ThisExpression) => {
    return this.parenthesize(expr.keyword.lexeme);
  };
  visitVariableExpression = (expr: VariableExpression) => {
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
  private parenthesize(name: string, ...exprs: Expression[]): LiteralType {
    const list: LiteralType[] = [];
    for (let expr of exprs) {
      list.push(expr.accept(this));
    }
    return `(${name} ${list.join(' ')})`;
  }
}

export default Interpreter;
