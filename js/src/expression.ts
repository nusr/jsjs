import Token, { LiteralType } from './token';

export type ExpressionType = string;
export interface ExpressionVisitor<T> {
  visitAssignExpr: (expr: AssignExpression<T>) => T;
  visitBinaryExpr: (expr: BinaryExpression<T>) => T;
  visitCallExpr: (expr: CallExpression<T>) => T;
  visitGetExpr: (expr: GetExpression<T>) => T;
  visitGroupingExpr: (expr: GroupingExpression<T>) => T;
  visitLiteralExpr: (expr: LiteralExpression<T>) => T;
  visitLogicalExpr: (expr: LogicalExpression<T>) => T;
  visitSetExpr: (expr: SetExpression<T>) => T;
  visitSuperExpr: (expr: SuperExpression<T>) => T;
  visitThisExpr: (expr: ThisExpression<T>) => T;
  visitUnaryExpr: (expr: UnaryExpression<T>) => T;
  visitVariableExpr: (expr: VariableExpression<T>) => T;
}

export abstract class Expression<T> {
  abstract accept(visitor: ExpressionVisitor<T>): T;
}

export class AssignExpression<T> extends Expression<T> {
  readonly name: Token;
  readonly value: Expression<T>;
  constructor(name: Token, value: Expression<T>) {
    super();
    this.name = name;
    this.value = value;
  }
  accept(visitor: ExpressionVisitor<T>): T {
    return visitor.visitAssignExpr(this);
  }
}

export class BinaryExpression<T> extends Expression<T> {
  readonly operator: Token;
  readonly left: Expression<T>;
  readonly right: Expression<T>;
  constructor(left: Expression<T>, operator: Token, right: Expression<T>) {
    super();
    this.operator = operator;
    this.left = left;
    this.right = right;
  }
  accept(visitor: ExpressionVisitor<T>): T {
    return visitor.visitBinaryExpr(this);
  }
}

export class CallExpression<T> extends Expression<T> {
  readonly paren: Token;
  readonly callee: Expression<T>;
  readonly argumentsList: Expression<T>[] = [];
  constructor(
    callee: Expression<T>,
    paren: Token,
    argumentsList: Expression<T>[],
  ) {
    super();
    this.paren = paren;
    this.callee = callee;
    this.argumentsList = argumentsList;
  }
  accept(visitor: ExpressionVisitor<T>): T {
    return visitor.visitCallExpr(this);
  }
}

export class GetExpression<T> extends Expression<T> {
  readonly object: Expression<T>;
  readonly name: Token;
  constructor(object: Expression<T>, name: Token) {
    super();
    this.object = object;
    this.name = name;
  }
  accept(visitor: ExpressionVisitor<T>): T {
    return visitor.visitGetExpr(this);
  }
}
export class SetExpression<T> extends Expression<T> {
  readonly object: Expression<T>;
  readonly name: Token;
  readonly value: Expression<T>;
  constructor(object: Expression<T>, name: Token, value: Expression<T>) {
    super();
    this.object = object;
    this.value = value;
    this.name = name;
  }
  accept(visitor: ExpressionVisitor<T>): T {
    return visitor.visitSetExpr(this);
  }
}

export class GroupingExpression<T> extends Expression<T> {
  readonly expression: Expression<T>;
  constructor(expression: Expression<T>) {
    super();
    this.expression = expression;
  }
  accept(visitor: ExpressionVisitor<T>): T {
    return visitor.visitGroupingExpr(this);
  }
}
export class LiteralExpression<T> extends Expression<T> {
  readonly value: LiteralType;
  constructor(value: LiteralType) {
    super();
    this.value = value;
  }
  accept(visitor: ExpressionVisitor<T>): T {
    return visitor.visitLiteralExpr(this);
  }
}

export class LogicalExpression<T> extends Expression<T> {
  readonly operator: Token;
  readonly left: Expression<T>;
  readonly right: Expression<T>;
  constructor(left: Expression<T>, operator: Token, right: Expression<T>) {
    super();
    this.operator = operator;
    this.left = left;
    this.right = right;
  }
  accept(visitor: ExpressionVisitor<T>): T {
    return visitor.visitLogicalExpr(this);
  }
}

export class SuperExpression<T> extends Expression<T> {
  readonly value: Expression<T>;
  readonly keyword: Token;
  constructor(keyword: Token, value: Expression<T>) {
    super();
    this.keyword = keyword;
    this.value = value;
  }
  accept(visitor: ExpressionVisitor<T>): T {
    return visitor.visitSuperExpr(this);
  }
}

export class ThisExpression<T> extends Expression<T> {
  readonly keyword: Token;
  constructor(keyword: Token) {
    super();
    this.keyword = keyword;
  }
  accept(visitor: ExpressionVisitor<T>): T {
    return visitor.visitThisExpr(this);
  }
}

export class UnaryExpression<T> extends Expression<T> {
  readonly right: Expression<T>;
  readonly operator: Token;
  constructor(operator: Token, right: Expression<T>) {
    super();
    this.operator = operator;
    this.right = right;
  }
  accept(visitor: ExpressionVisitor<T>): T {
    return visitor.visitUnaryExpr(this);
  }
}
export class VariableExpression<T> extends Expression<T> {
  readonly name: Token;
  constructor(name: Token) {
    super();
    this.name = name;
  }
  accept(visitor: ExpressionVisitor<T>): T {
    return visitor.visitVariableExpr(this);
  }
}
