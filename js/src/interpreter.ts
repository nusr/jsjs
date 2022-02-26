import { LiteralType } from './token';
import {
  ExpressionVisitor,
  Expression,
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
  VariableExpression,
} from './expression';
import { TokenType } from './tokenType';

class Interpreter implements ExpressionVisitor<LiteralType> {
  visitAssignExpr = (expr: AssignExpression<LiteralType>) => {
    return this.parenthesize(expr.name.lexeme, expr.value);
  };
  visitBinaryExpr = (expr: BinaryExpression<LiteralType>): LiteralType => {
    const left: LiteralType = this.evaluate(expr.left);
    const right: LiteralType = this.evaluate(expr.right);
    switch (expr.operator.type) {
      case TokenType.MINUS:
        return Number(left) - Number(right);
      case TokenType.PLUS:
        if (typeof left === 'number' && typeof right === 'number') {
          return Number(left) + Number(right);
        }
        if (typeof left === 'string' && typeof right === 'string') {
          return String(left) + String(right);
        }
        break;
      case TokenType.STAR:
        return Number(left) * Number(right);
      case TokenType.SLASH:
        return Number(left) / Number(right);
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
  visitCallExpr = (expr: CallExpression<LiteralType>) => {
    return this.parenthesize(
      expr.paren.lexeme,
      expr.callee,
      ...expr.argumentsList,
    );
  };
  visitGetExpr = (expr: GetExpression<LiteralType>) => {
    return this.parenthesize(expr.name.lexeme, expr.object);
  };
  visitSetExpr = (expr: SetExpression<LiteralType>) => {
    return this.parenthesize(expr.name.lexeme, expr.object, expr.value);
  };
  visitLogicalExpr = (expr: LogicalExpression<LiteralType>) => {
    return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
  };
  visitSuperExpr = (expr: SuperExpression<LiteralType>) => {
    return this.parenthesize(expr.keyword.lexeme, expr.value);
  };
  visitThisExpr = (expr: ThisExpression<LiteralType>) => {
    return this.parenthesize(expr.keyword.lexeme);
  };
  visitVariableExpr = (expr: VariableExpression<LiteralType>) => {
    return this.parenthesize(expr.name.lexeme);
  };
  visitGroupingExpr = (expr: GroupingExpression<LiteralType>): LiteralType => {
    return this.evaluate(expr.expression);
  };
  visitLiteralExpr = (expr: LiteralExpression<LiteralType>): LiteralType => {
    return expr.value;
  };
  visitUnaryExpr = (expr: UnaryExpression<LiteralType>): LiteralType => {
    const right: LiteralType = this.evaluate(expr.right);
    switch (expr.operator.type) {
      case TokenType.MINUS:
        return -Number(right);
      case TokenType.BANG:
        return !this.isTruthy(right);
    }
    return null;
  };

  evaluate = (expr: Expression<LiteralType>) => {
    return expr.accept(this);
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
