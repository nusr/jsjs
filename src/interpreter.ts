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
import { convertLiteralTypeToString } from './token';
import { LoxCallable } from './loxCallable';
import { ReturnValue } from './returnValue';

class Interpreter
  implements ExpressionVisitor<LiteralType>, StatementVisitor<LiteralType>
{
  globals = new Environment(null);
  private environment = this.globals;

  interpret = (list: Statement<LiteralType>[], env: Environment): void => {
    this.globals = env;
    this.environment = env;
    for (const item of list) {
      this.execute(item);
    }
  };
  private execute = (statement: Statement<LiteralType>) => {
    return statement.accept(this);
  };
  private evaluate = (expr: Expression<LiteralType>): LiteralType => {
    return expr.accept(this);
  };
  visitExpressionStatement = (statement: ExpressionStatement<LiteralType>) => {
    return this.evaluate(statement.expression);
  };
  visitBlockStatement = (statement: BlockStatement<LiteralType>) => {
    return this.executeBlock(statement, new Environment(this.environment));
  };
  executeBlock = (
    statement: BlockStatement<LiteralType>,
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
  visitClassStatement = (statement: ClassStatement<LiteralType>) => {
    console.log(statement);
    return null;
  };
  visitFunctionStatement = (statement: FunctionStatement<LiteralType>) => {
    this.environment.define(statement.name, new LoxCallable(statement));
    return null;
  };
  visitIfStatement = (statement: IfStatement<LiteralType>) => {
    if (this.isTruthy(this.evaluate(statement.condition))) {
      this.execute(statement.thenBranch);
    } else if (statement.elseBranch) {
      this.execute(statement.elseBranch);
    }
    return null;
  };
  visitPrintStatement = (statement: PrintStatement<LiteralType>) => {
    const result: LiteralType = this.evaluate(statement.expression);
    console.log(result);
    eventEmitter.emit('print', { value: result });
    if (statement.comment !== null) {
      const expect = statement.comment.lexeme;
      const actual = convertLiteralTypeToString(result);
      if (expect === actual) {
        globalExpect.addSuccess();
      }
    }
    return null;
  };
  visitReturnStatement = (statement: ReturnStatement<LiteralType>) => {
    if (statement.value !== null) {
      const result = this.evaluate(statement.value);
      throw new ReturnValue(result);
    }
    return null;
  };
  visitVariableStatement = (statement: VariableStatement<LiteralType>) => {
    let value = null;
    if (statement.initializer !== null) {
      value = this.evaluate(statement.initializer);
    }
    this.environment.define(statement.name, value);
    return null;
  };
  visitWhileStatement = (statement: WhileStatement<LiteralType>) => {
    while (this.isTruthy(this.evaluate(statement.condition))) {
      this.execute(statement.body);
    }
    return null;
  };

  visitAssignExpression = (expr: AssignExpression<LiteralType>) => {
    const temp: LiteralType = this.evaluate(expr.value);
    this.environment.assign(expr.name, temp);
    return temp;
  };
  visitBinaryExpression = (
    expr: BinaryExpression<LiteralType>,
  ): LiteralType => {
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
  visitCallExpression = (expr: CallExpression<LiteralType>): LiteralType => {
    const callee: LiteralType = this.evaluate(expr.callee);
    const args: LiteralType[] = [];
    for (let item of expr.argumentList) {
      args.push(this.evaluate(item));
    }
    if (!(callee instanceof Function)) {
      throw new RuntimeError(expr.paren, 'can only call functions');
    }
    // const func: LoxCallable = callee;
    // return func.call(this, args);
    return args[0] as LiteralType;
  };
  visitGetExpression = (expr: GetExpression<LiteralType>) => {
    return this.parenthesize(expr.name.lexeme, expr.object);
  };
  visitSetExpression = (expr: SetExpression<LiteralType>) => {
    return this.parenthesize(expr.name.lexeme, expr.object, expr.value);
  };
  visitLogicalExpression = (expr: LogicalExpression<LiteralType>) => {
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
  visitSuperExpression = (expr: SuperExpression<LiteralType>) => {
    return this.parenthesize(expr.keyword.lexeme, expr.value);
  };
  visitThisExpression = (expr: ThisExpression<LiteralType>) => {
    return this.parenthesize(expr.keyword.lexeme);
  };
  visitVariableExpression = (expr: VariableExpression<LiteralType>) => {
    return this.environment.get(expr.name);
  };
  visitGroupingExpression = (
    expr: GroupingExpression<LiteralType>,
  ): LiteralType => {
    return this.evaluate(expr.expression);
  };
  visitLiteralExpression = (
    expr: LiteralExpression<LiteralType>,
  ): LiteralType => {
    return expr.value;
  };
  visitUnaryExpression = (expr: UnaryExpression<LiteralType>): LiteralType => {
    const right: LiteralType = this.evaluate(expr.right);
    switch (expr.operator.type) {
      case TokenType.MINUS:
        return -Number(right);
      case TokenType.BANG:
        return !this.isTruthy(right);
    }
    return null;
  };

  print = (expr: Expression<LiteralType>) => {
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
  private parenthesize(
    name: string,
    ...exprs: Expression<LiteralType>[]
  ): LiteralType {
    const list: LiteralType[] = [];
    for (let expr of exprs) {
      list.push(expr.accept(this));
    }
    return `(${name} ${list.join(' ')})`;
  }
}

export default Interpreter;
