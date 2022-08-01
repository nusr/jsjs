import type Token from './token';
import type { LiteralType } from './type';
export interface ExpressionVisitor {
  visitAssignExpression: (expression: AssignExpression) => LiteralType;
  visitBinaryExpression: (expression: BinaryExpression) => LiteralType;
  visitCallExpression: (expression: CallExpression) => LiteralType;
  visitGetExpression: (expression: GetExpression) => LiteralType;
  visitSetExpression: (expression: SetExpression) => LiteralType;
  visitGroupingExpression: (expression: GroupingExpression) => LiteralType;
  visitLiteralExpression: (expression: LiteralExpression) => LiteralType;
  visitLogicalExpression: (expression: LogicalExpression) => LiteralType;
  visitSuperExpression: (expression: SuperExpression) => LiteralType;
  visitThisExpression: (expression: ThisExpression) => LiteralType;
  visitUnaryExpression: (expression: UnaryExpression) => LiteralType;
  visitVariableExpression: (expression: VariableExpression) => LiteralType;
}
export abstract class Expression {
  abstract accept(visitor: ExpressionVisitor): LiteralType;
}
export class AssignExpression extends Expression {
  readonly name: Token;
  readonly value: Expression;
  constructor(name: Token, value: Expression) {
    super();
    this.name = name;
    this.value = value;
  }
  accept(visitor: ExpressionVisitor): LiteralType {
    return visitor.visitAssignExpression(this);
  }
}
export class BinaryExpression extends Expression {
  readonly left: Expression;
  readonly operator: Token;
  readonly right: Expression;
  constructor(left: Expression, operator: Token, right: Expression) {
    super();
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
  accept(visitor: ExpressionVisitor): LiteralType {
    return visitor.visitBinaryExpression(this);
  }
}
export class CallExpression extends Expression {
  readonly callee: Expression;
  readonly paren: Token;
  readonly argumentList: Expression[];
  constructor(callee: Expression, paren: Token, argumentList: Expression[]) {
    super();
    this.callee = callee;
    this.paren = paren;
    this.argumentList = argumentList;
  }
  accept(visitor: ExpressionVisitor): LiteralType {
    return visitor.visitCallExpression(this);
  }
}
export class GetExpression extends Expression {
  readonly object: Expression;
  readonly name: Token;
  constructor(object: Expression, name: Token) {
    super();
    this.object = object;
    this.name = name;
  }
  accept(visitor: ExpressionVisitor): LiteralType {
    return visitor.visitGetExpression(this);
  }
}
export class SetExpression extends Expression {
  readonly object: Expression;
  readonly name: Token;
  readonly value: Expression;
  constructor(object: Expression, name: Token, value: Expression) {
    super();
    this.object = object;
    this.name = name;
    this.value = value;
  }
  accept(visitor: ExpressionVisitor): LiteralType {
    return visitor.visitSetExpression(this);
  }
}
export class GroupingExpression extends Expression {
  readonly expression: Expression;
  constructor(expression: Expression) {
    super();
    this.expression = expression;
  }
  accept(visitor: ExpressionVisitor): LiteralType {
    return visitor.visitGroupingExpression(this);
  }
}
export class LiteralExpression extends Expression {
  readonly value: LiteralType;
  constructor(value: LiteralType) {
    super();
    this.value = value;
  }
  accept(visitor: ExpressionVisitor): LiteralType {
    return visitor.visitLiteralExpression(this);
  }
}
export class LogicalExpression extends Expression {
  readonly left: Expression;
  readonly operator: Token;
  readonly right: Expression;
  constructor(left: Expression, operator: Token, right: Expression) {
    super();
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
  accept(visitor: ExpressionVisitor): LiteralType {
    return visitor.visitLogicalExpression(this);
  }
}
export class SuperExpression extends Expression {
  readonly keyword: Token;
  readonly value: Expression;
  constructor(keyword: Token, value: Expression) {
    super();
    this.keyword = keyword;
    this.value = value;
  }
  accept(visitor: ExpressionVisitor): LiteralType {
    return visitor.visitSuperExpression(this);
  }
}
export class ThisExpression extends Expression {
  readonly keyword: Token;
  constructor(keyword: Token) {
    super();
    this.keyword = keyword;
  }
  accept(visitor: ExpressionVisitor): LiteralType {
    return visitor.visitThisExpression(this);
  }
}
export class UnaryExpression extends Expression {
  readonly operator: Token;
  readonly right: Expression;
  constructor(operator: Token, right: Expression) {
    super();
    this.operator = operator;
    this.right = right;
  }
  accept(visitor: ExpressionVisitor): LiteralType {
    return visitor.visitUnaryExpression(this);
  }
}
export class VariableExpression extends Expression {
  readonly name: Token;
  constructor(name: Token) {
    super();
    this.name = name;
  }
  accept(visitor: ExpressionVisitor): LiteralType {
    return visitor.visitVariableExpression(this);
  }
}
