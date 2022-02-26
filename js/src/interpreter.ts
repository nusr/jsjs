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

class Interpreter implements ExpressionVisitor<LiteralType> {
  visitAssignExpr = (expr: AssignExpression<LiteralType>) => {
    return this.parenthesize(expr.name.lexeme, expr.value);
  };
  visitBinaryExpr = (expr: BinaryExpression<LiteralType>) => {
    return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
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
  visitGroupingExpr = (expr: GroupingExpression<LiteralType>) => {
    return this.parenthesize('group', expr.expression);
  };
  visitLiteralExpr = (expr: LiteralExpression<LiteralType>) => {
    if (expr.value === null) {
      return 'nil';
    }
    return expr.value.toString();
  };
  visitUnaryExpr = (expr: UnaryExpression<LiteralType>) => {
    return this.parenthesize(expr.operator.lexeme, expr.right);
  };
  print = (expr: Expression<LiteralType>) => {
    return expr.accept(this);
  };
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
