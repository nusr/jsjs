import Token, { LiteralType } from './token';

export type VisitType = string;
export interface Visitor {
  visitAssignExpr: (expr: AssignExpression) => VisitType;
  visitBinaryExpr: (expr: BinaryExpression) => VisitType;
  visitCallExpr: (expr: CallExpression) => VisitType;
  visitGetExpr: (expr: GetExpression) => VisitType;
  visitGroupingExpr: (expr: GroupingExpression) => VisitType;
  visitLiteralExpr: (expr: LiteralExpression) => VisitType;
  visitLogicalExpr: (expr: LogicalExpression) => VisitType;
  visitSetExpr: (expr: SetExpression) => VisitType;
  visitSuperExpr: (expr: SuperExpression) => VisitType;
  visitThisExpr: (expr: ThisExpression) => VisitType;
  visitUnaryExpr: (expr: UnaryExpression) => VisitType;
  visitVariableExpr: (expr: VariableExpression) => VisitType;
}

export abstract class Expression {
  abstract accept(visitor: Visitor): VisitType;
}

export class AssignExpression extends Expression {
  readonly name: Token;
  readonly value: Expression;
  constructor(name: Token, value: Expression) {
    super();
    this.name = name;
    this.value = value;
  }
  accept(visitor: Visitor): string {
    return visitor.visitAssignExpr(this);
  }
}

export class BinaryExpression extends Expression {
  readonly operator: Token;
  readonly left: Expression;
  readonly right: Expression;
  constructor(left: Expression, operator: Token, right: Expression) {
    super();
    this.operator = operator;
    this.left = left;
    this.right = right;
  }
  accept(visitor: Visitor): string {
    return visitor.visitBinaryExpr(this);
  }
}

export class CallExpression extends Expression {
  readonly paren: Token;
  readonly callee: Expression;
  readonly argumentsList: Expression[] = [];
  constructor(callee: Expression, paren: Token, argumentsList: Expression[]) {
    super();
    this.paren = paren;
    this.callee = callee;
    this.argumentsList = argumentsList;
  }
  accept(visitor: Visitor): string {
    return visitor.visitCallExpr(this);
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
  accept(visitor: Visitor): string {
    return visitor.visitGetExpr(this);
  }
}
export class SetExpression extends Expression {
  readonly object: Expression;
  readonly name: Token;
  readonly value: Expression;
  constructor(object: Expression, name: Token, value: Expression) {
    super();
    this.object = object;
    this.value = value;
    this.name = name;
  }
  accept(visitor: Visitor): string {
    return visitor.visitSetExpr(this);
  }
}

export class GroupingExpression extends Expression {
  readonly expression: Expression;
  constructor(expression: Expression) {
    super();
    this.expression = expression;
  }
  accept(visitor: Visitor): string {
    return visitor.visitGroupingExpr(this);
  }
}
export class LiteralExpression extends Expression {
  readonly value: LiteralType;
  constructor(value: LiteralType) {
    super();
    this.value = value;
  }
  accept(visitor: Visitor): string {
    return visitor.visitLiteralExpr(this);
  }
}

export class LogicalExpression extends Expression {
  readonly operator: Token;
  readonly left: Expression;
  readonly right: Expression;
  constructor(left: Expression, operator: Token, right: Expression) {
    super();
    this.operator = operator;
    this.left = left;
    this.right = right;
  }
  accept(visitor: Visitor): string {
    return visitor.visitLogicalExpr(this);
  }
}

export class SuperExpression extends Expression {
  readonly value: Expression;
  readonly keyword: Token;
  constructor(keyword: Token, value: Expression) {
    super();
    this.keyword = keyword;
    this.value = value;
  }
  accept(visitor: Visitor): string {
    return visitor.visitSuperExpr(this);
  }
}

export class ThisExpression extends Expression {
  readonly keyword: Token;
  constructor(keyword: Token) {
    super();
    this.keyword = keyword;
  }
  accept(visitor: Visitor): string {
    return visitor.visitThisExpr(this);
  }
}

export class UnaryExpression extends Expression {
  readonly right: Expression;
  readonly operator: Token;
  constructor(operator: Token, right: Expression) {
    super();
    this.operator = operator;
    this.right = right;
  }
  accept(visitor: Visitor): string {
    return visitor.visitUnaryExpr(this);
  }
}
export class VariableExpression extends Expression {
  readonly name: Token;
  constructor(name: Token) {
    super();
    this.name = name;
  }
  accept(visitor: Visitor): string {
    return visitor.visitVariableExpr(this);
  }
}
