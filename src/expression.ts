import type Token from './token';
import type { LiteralType } from './type';
import { convertLiteralTypeToString } from './util';
export interface ExpressionVisitor {
  visitNewExpression: (Expression: NewExpression) => LiteralType;
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
export interface Expression {
  accept(visitor: ExpressionVisitor): LiteralType;
  toString(): string;
}
export class NewExpression implements Expression {
  readonly keyword: Token;
  readonly name: Expression;
  constructor(keyword: Token, name: Expression) {
    this.keyword = keyword;
    this.name = name;
  }
  accept(visitor: ExpressionVisitor): LiteralType {
    return visitor.visitNewExpression(this);
  }
  toString() {
    return `${this.keyword.toString()} ${this.name.toString()}`;
  }
}
export class AssignExpression implements Expression {
  readonly name: Token;
  readonly value: Expression;
  constructor(name: Token, value: Expression) {
    this.name = name;
    this.value = value;
  }
  accept(visitor: ExpressionVisitor): LiteralType {
    return visitor.visitAssignExpression(this);
  }
  toString() {
    return `${this.name.toString()} = ${this.value.toString()}`;
  }
}
export class BinaryExpression implements Expression {
  readonly left: Expression;
  readonly operator: Token;
  readonly right: Expression;
  constructor(left: Expression, operator: Token, right: Expression) {
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
  accept(visitor: ExpressionVisitor): LiteralType {
    return visitor.visitBinaryExpression(this);
  }
  toString() {
    return `${this.left.toString()} ${this.operator.toString()} ${this.right.toString()}`;
  }
}
export class CallExpression implements Expression {
  readonly callee: Expression;
  readonly paren: Token;
  readonly argumentList: Expression[];
  constructor(callee: Expression, paren: Token, argumentList: Expression[]) {
    this.callee = callee;
    this.paren = paren;
    this.argumentList = argumentList;
  }
  accept(visitor: ExpressionVisitor): LiteralType {
    return visitor.visitCallExpression(this);
  }
  toString() {
    return `${this.callee.toString()}(${this.argumentList
      .map((item) => item.toString())
      .join(',')})`;
  }
}
export class GetExpression implements Expression {
  readonly object: Expression;
  readonly name: Token;
  constructor(object: Expression, name: Token) {
    this.object = object;
    this.name = name;
  }
  accept(visitor: ExpressionVisitor): LiteralType {
    return visitor.visitGetExpression(this);
  }
  toString() {
    return `${this.object.toString()}.${this.name.toString()}`;
  }
}
export class SetExpression implements Expression {
  readonly object: GetExpression;
  readonly value: Expression;
  constructor(object: GetExpression, value: Expression) {
    this.object = object;
    this.value = value;
  }
  accept(visitor: ExpressionVisitor): LiteralType {
    return visitor.visitSetExpression(this);
  }
  toString() {
    return `${this.object.toString()} = ${this.value.toString()}`;
  }
}
export class GroupingExpression implements Expression {
  readonly expression: Expression;
  constructor(expression: Expression) {
    this.expression = expression;
  }
  accept(visitor: ExpressionVisitor): LiteralType {
    return visitor.visitGroupingExpression(this);
  }
  toString() {
    return `(${this.expression.toString()})`;
  }
}
export class LiteralExpression implements Expression {
  readonly value: LiteralType;
  constructor(value: LiteralType) {
    this.value = value;
  }
  accept(visitor: ExpressionVisitor): LiteralType {
    return visitor.visitLiteralExpression(this);
  }
  toString() {
    if (typeof this.value === 'string') {
      return `'${this.value}'`;
    }
    return convertLiteralTypeToString(this.value);
  }
}
export class LogicalExpression implements Expression {
  readonly left: Expression;
  readonly operator: Token;
  readonly right: Expression;
  constructor(left: Expression, operator: Token, right: Expression) {
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
  accept(visitor: ExpressionVisitor): LiteralType {
    return visitor.visitLogicalExpression(this);
  }
  toString() {
    return `${this.left.toString()} ${this.operator.toString()} ${this.right.toString()}`;
  }
}
export class SuperExpression implements Expression {
  readonly keyword: Token;
  readonly value: Expression;
  constructor(keyword: Token, value: Expression) {
    this.keyword = keyword;
    this.value = value;
  }
  accept(visitor: ExpressionVisitor): LiteralType {
    return visitor.visitSuperExpression(this);
  }
  toString() {
    return '';
  }
}
export class ThisExpression implements Expression {
  readonly keyword: Token;
  constructor(keyword: Token) {
    this.keyword = keyword;
  }
  accept(visitor: ExpressionVisitor): LiteralType {
    return visitor.visitThisExpression(this);
  }
  toString() {
    return '';
  }
}
export class UnaryExpression implements Expression {
  readonly operator: Token;
  readonly right: Expression;
  constructor(operator: Token, right: Expression) {
    this.operator = operator;
    this.right = right;
  }
  accept(visitor: ExpressionVisitor): LiteralType {
    return visitor.visitUnaryExpression(this);
  }
  toString() {
    return `${this.operator.toString()}${this.right.toString()}`;
  }
}
export class VariableExpression implements Expression {
  readonly name: Token;
  constructor(name: Token) {
    this.name = name;
  }
  accept(visitor: ExpressionVisitor): LiteralType {
    return visitor.visitVariableExpression(this);
  }
  toString() {
    return this.name.toString();
  }
}
