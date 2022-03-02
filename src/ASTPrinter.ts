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
import { ExpressionType } from './type';

class ASTPrinter implements ExpressionVisitor<ExpressionType> {
  visitAssignExpression = (expr: AssignExpression<ExpressionType>) => {
    return this.parenthesize(expr.name.lexeme, expr.value);
  };
  visitBinaryExpression = (expr: BinaryExpression<ExpressionType>) => {
    return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
  };
  visitCallExpression = (expr: CallExpression<ExpressionType>) => {
    return this.parenthesize(
      expr.paren.lexeme,
      expr.callee,
      ...expr.argumentList,
    );
  };
  visitGetExpression = (expr: GetExpression<ExpressionType>) => {
    return this.parenthesize(expr.name.lexeme, expr.object);
  };
  visitSetExpression = (expr: SetExpression<ExpressionType>) => {
    return this.parenthesize(expr.name.lexeme, expr.object, expr.value);
  };
  visitLogicalExpression = (expr: LogicalExpression<ExpressionType>) => {
    return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
  };
  visitSuperExpression = (expr: SuperExpression<ExpressionType>) => {
    return this.parenthesize(expr.keyword.lexeme, expr.value);
  };
  visitThisExpression = (expr: ThisExpression<ExpressionType>) => {
    return this.parenthesize(expr.keyword.lexeme);
  };
  visitVariableExpression = (expr: VariableExpression<ExpressionType>) => {
    return this.parenthesize(expr.name.lexeme);
  };
  visitGroupingExpression = (expr: GroupingExpression<ExpressionType>) => {
    return this.parenthesize('group', expr.expression);
  };
  visitLiteralExpression = (expr: LiteralExpression<ExpressionType>) => {
    if (expr.value === null) {
      return 'nil';
    }
    return expr.value.toString();
  };
  visitUnaryExpression = (expr: UnaryExpression<ExpressionType>) => {
    return this.parenthesize(expr.operator.lexeme, expr.right);
  };
  print = (expr: Expression<ExpressionType>) => {
    return expr.accept(this);
  };
  private parenthesize(
    name: string,
    ...exprs: Expression<ExpressionType>[]
  ): ExpressionType {
    const list: ExpressionType[] = [];
    for (let expr of exprs) {
      list.push(expr.accept(this));
    }
    return `(${name} ${list.join(' ')})`;
  }
}

export default ASTPrinter;
