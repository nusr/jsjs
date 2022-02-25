import {
  VisitType,
  Visitor,
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

class ASTPrinter implements Visitor {
  visitAssignExpr = (expr: AssignExpression) => {
    return this.parenthesize(expr.name.lexeme, expr.value);
  };
  visitBinaryExpr = (expr: BinaryExpression) => {
    return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
  };
  visitCallExpr = (expr: CallExpression) => {
    return this.parenthesize(
      expr.paren.lexeme,
      expr.callee,
      ...expr.argumentsList,
    );
  };
  visitGetExpr = (expr: GetExpression) => {
    return this.parenthesize(expr.name.lexeme, expr.object);
  };
  visitSetExpr = (expr: SetExpression) => {
    return this.parenthesize(expr.name.lexeme, expr.object, expr.value);
  };
  visitLogicalExpr = (expr: LogicalExpression) => {
    return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
  };
  visitSuperExpr = (expr: SuperExpression) => {
    return this.parenthesize(expr.keyword.lexeme, expr.value);
  };
  visitThisExpr = (expr: ThisExpression) => {
    return this.parenthesize(expr.keyword.lexeme);
  };
  visitVariableExpr = (expr: VariableExpression) => {
    return this.parenthesize(expr.name.lexeme);
  };
  visitGroupingExpr = (expr: GroupingExpression) => {
    return this.parenthesize('group', expr.expression);
  };
  visitLiteralExpr = (expr: LiteralExpression) => {
    if (expr.value === null) {
      return 'nil';
    }
    return expr.value.toString();
  };
  visitUnaryExpr = (expr: UnaryExpression) => {
    return this.parenthesize(expr.operator.lexeme, expr.right);
  };
  print = (expr: Expression) => {
    return expr.accept(this);
  };
  private parenthesize(name: string, ...exprs: Expression[]): VisitType {
    const list: string[] = [];
    for (let expr of exprs) {
      list.push(expr.accept(this));
    }
    return `(${name} ${list.join(' ')})`;
  }
}

export default ASTPrinter;
