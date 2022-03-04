import Token, { LiteralType } from './token';
export interface ExpressionVisitor<T> {
  visitAssignExpression: (expression: AssignExpression<T>) => T;
  visitBinaryExpression: (expression: BinaryExpression<T>) => T;
  visitCallExpression: (expression: CallExpression<T>) => T;
  visitGetExpression: (expression: GetExpression<T>) => T;
  visitSetExpression: (expression: SetExpression<T>) => T;
  visitGroupingExpression: (expression: GroupingExpression<T>) => T;
  visitLiteralExpression: (expression: LiteralExpression<T>) => T;
  visitLogicalExpression: (expression: LogicalExpression<T>) => T;
  visitSuperExpression: (expression: SuperExpression<T>) => T;
  visitThisExpression: (expression: ThisExpression<T>) => T;
  visitUnaryExpression: (expression: UnaryExpression<T>) => T;
  visitVariableExpression: (expression: VariableExpression<T>) => T;
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
    return visitor.visitAssignExpression(this);
  }
}
export class BinaryExpression<T> extends Expression<T> {
  readonly left: Expression<T>;
  readonly operator: Token;
  readonly right: Expression<T>;
  constructor(left: Expression<T>, operator: Token, right: Expression<T>) {
    super();
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
  accept(visitor: ExpressionVisitor<T>): T {
    return visitor.visitBinaryExpression(this);
  }
}
export class CallExpression<T> extends Expression<T> {
  readonly callee: Expression<T>;
  readonly paren: Token;
  readonly argumentList: Expression<T>[];
  constructor(
    callee: Expression<T>,
    paren: Token,
    argumentList: Expression<T>[],
  ) {
    super();
    this.callee = callee;
    this.paren = paren;
    this.argumentList = argumentList;
  }
  accept(visitor: ExpressionVisitor<T>): T {
    return visitor.visitCallExpression(this);
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
    return visitor.visitGetExpression(this);
  }
}
export class SetExpression<T> extends Expression<T> {
  readonly object: Expression<T>;
  readonly name: Token;
  readonly value: Expression<T>;
  constructor(object: Expression<T>, name: Token, value: Expression<T>) {
    super();
    this.object = object;
    this.name = name;
    this.value = value;
  }
  accept(visitor: ExpressionVisitor<T>): T {
    return visitor.visitSetExpression(this);
  }
}
export class GroupingExpression<T> extends Expression<T> {
  readonly expression: Expression<T>;
  constructor(expression: Expression<T>) {
    super();
    this.expression = expression;
  }
  accept(visitor: ExpressionVisitor<T>): T {
    return visitor.visitGroupingExpression(this);
  }
}
export class LiteralExpression<T> extends Expression<T> {
  readonly value: LiteralType;
  constructor(value: LiteralType) {
    super();
    this.value = value;
  }
  accept(visitor: ExpressionVisitor<T>): T {
    return visitor.visitLiteralExpression(this);
  }
}
export class LogicalExpression<T> extends Expression<T> {
  readonly left: Expression<T>;
  readonly operator: Token;
  readonly right: Expression<T>;
  constructor(left: Expression<T>, operator: Token, right: Expression<T>) {
    super();
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
  accept(visitor: ExpressionVisitor<T>): T {
    return visitor.visitLogicalExpression(this);
  }
}
export class SuperExpression<T> extends Expression<T> {
  readonly keyword: Token;
  readonly value: Expression<T>;
  constructor(keyword: Token, value: Expression<T>) {
    super();
    this.keyword = keyword;
    this.value = value;
  }
  accept(visitor: ExpressionVisitor<T>): T {
    return visitor.visitSuperExpression(this);
  }
}
export class ThisExpression<T> extends Expression<T> {
  readonly keyword: Token;
  constructor(keyword: Token) {
    super();
    this.keyword = keyword;
  }
  accept(visitor: ExpressionVisitor<T>): T {
    return visitor.visitThisExpression(this);
  }
}
export class UnaryExpression<T> extends Expression<T> {
  readonly operator: Token;
  readonly right: Expression<T>;
  constructor(operator: Token, right: Expression<T>) {
    super();
    this.operator = operator;
    this.right = right;
  }
  accept(visitor: ExpressionVisitor<T>): T {
    return visitor.visitUnaryExpression(this);
  }
}
export class VariableExpression<T> extends Expression<T> {
  readonly name: Token;
  constructor(name: Token) {
    super();
    this.name = name;
  }
  accept(visitor: ExpressionVisitor<T>): T {
    return visitor.visitVariableExpression(this);
  }
}
