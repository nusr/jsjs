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
} from './Expression';
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
} from './Statement';

import eventEmitter from './EventEmitter';
import Environment from './Environment';
import Debug from './debug';

const debug = new Debug('interpreter').init();

class Interpreter
  implements ExpressionVisitor<LiteralType>, StatementVisitor<LiteralType>
{
  private environment = new Environment(null);

  interpret = (list: Statement<LiteralType>[]): void => {
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
    this.executeBlock(statement.statements, new Environment(this.environment));
    return null;
  };
  private executeBlock = (
    statements: Statement<LiteralType>[],
    environment: Environment,
  ): void => {
    const previous = this.environment;
    try {
      this.environment = environment;
      for (let statement of statements) {
        this.execute(statement);
      }
    } finally {
      this.environment = previous;
    }
  };
  visitClassStatement = (statement: ClassStatement<LiteralType>) => {
    console.log(statement);
    return null;
  };
  visitFunctionStatement = (statement: FunctionStatement<LiteralType>) => {
    console.log(statement);
    return null;
  };
  visitIfStatement = (statement: IfStatement<LiteralType>) => {
    console.log(statement);
    return null;
  };
  visitPrintStatement = (statement: PrintStatement<LiteralType>) => {
    const result: LiteralType = this.evaluate(statement.expression);
    console.log(result);
    eventEmitter.emit('print', { value: result });
    return result;
  };
  visitReturnStatement = (statement: ReturnStatement<LiteralType>) => {
    console.log(statement);
    return null;
  };
  visitVariableStatement = (statement: VariableStatement<LiteralType>) => {
    let value = null;
    if (statement.initializer !== null) {
      value = this.evaluate(statement.initializer);
    }
    this.environment.define(statement.name.lexeme, value);
    return value;
  };
  visitWhileStatement = (statement: WhileStatement<LiteralType>) => {
    console.log(statement);
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
        break;
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
  visitCallExpression = (expr: CallExpression<LiteralType>) => {
    return this.parenthesize(
      expr.paren.lexeme,
      expr.callee,
      ...expr.argumentList,
    );
  };
  visitGetExpression = (expr: GetExpression<LiteralType>) => {
    return this.parenthesize(expr.name.lexeme, expr.object);
  };
  visitSetExpression = (expr: SetExpression<LiteralType>) => {
    return this.parenthesize(expr.name.lexeme, expr.object, expr.value);
  };
  visitLogicalExpression = (expr: LogicalExpression<LiteralType>) => {
    return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
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