import type Token from './token';
import type { LiteralType } from './type';
import { convertLiteralTypeToString, isTestEnv } from './util';
import type { BlockStatement } from './statement';
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
  visitFunctionExpression: (expression: FunctionExpression) => LiteralType;
  visitArrayLiteralExpression: (
    expression: ArrayLiteralExpression,
  ) => LiteralType;
  visitIndexExpression: (expression: IndexExpression) => LiteralType;
  visitObjectLiteralExpression: (
    expression: ObjectLiteralExpression,
  ) => LiteralType;
}
export interface Expression {
  accept(visitor: ExpressionVisitor): LiteralType;
  toString(): string;
}
export class NewExpression implements Expression {
  readonly callee: Expression;
  constructor(callee: Expression) {
    this.callee = callee;
  }
  accept(visitor: ExpressionVisitor): LiteralType {
    return visitor.visitNewExpression(this);
  }
  toString() {
    return `new ${this.callee.toString()}`;
  }
}
export class AssignExpression implements Expression {
  readonly left: Token;
  readonly right: Expression;
  constructor(left: Token, right: Expression) {
    this.left = left;
    this.right = right;
  }
  accept(visitor: ExpressionVisitor): LiteralType {
    return visitor.visitAssignExpression(this);
  }
  toString() {
    return `${this.left.toString()} = ${this.right.toString()}`;
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
    const temp = `${this.left.toString()} ${this.operator.toString()} ${this.right.toString()}`;
    if (isTestEnv()) {
      return `(${temp})`;
    }
    return temp;
  }
}
export class CallExpression implements Expression {
  readonly callee: Expression;
  readonly argumentList: Expression[];
  constructor(callee: Expression, argumentList: Expression[]) {
    this.callee = callee;
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
  readonly property: Token;
  constructor(object: Expression, property: Token) {
    this.object = object;
    this.property = property;
  }
  accept(visitor: ExpressionVisitor): LiteralType {
    return visitor.visitGetExpression(this);
  }
  toString() {
    return `${this.object.toString()}.${this.property.toString()}`;
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
    const temp = `${this.operator.toString()}${this.right.toString()}`;
    if (isTestEnv()) {
      return `(${temp})`;
    }
    return temp;
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

export class FunctionExpression implements Expression {
  readonly name: Token | null;
  readonly body: BlockStatement;
  readonly params: Token[];
  constructor(name: Token | null, body: BlockStatement, params: Token[]) {
    this.name = name;
    this.body = body;
    this.params = params;
  }
  accept(visitor: ExpressionVisitor): LiteralType {
    return visitor.visitFunctionExpression(this);
  }
  toString() {
    return `function ${this.name === null ? '' : this.name.toString()
      }(${this.params
        .map((item) => item.toString())
        .join(',')})${this.body.toString()}`;
  }
}

export class ArrayLiteralExpression implements Expression {
  readonly elements: Expression[];
  constructor(elements: Expression[]) {
    this.elements = elements;
  }
  accept(visitor: ExpressionVisitor) {
    return visitor.visitArrayLiteralExpression(this);
  }
  toString(): string {
    return `[${this.elements.map((item) => item.toString()).join(',')}]`;
  }
}
export class IndexExpression implements Expression {
  readonly property: Expression;
  readonly object: Expression;
  constructor(object: Expression, property: Expression) {
    this.property = property;
    this.object = object;
  }
  accept(visitor: ExpressionVisitor) {
    return visitor.visitIndexExpression(this);
  }
  toString(): string {
    return `${this.object.toString()}[${this.property.toString()}]`;
  }
}

export class ObjectLiteralExpression implements Expression {
  readonly properties: Array<{ key: Expression; value: Expression }>;
  constructor(
    properties: Array<{ key: Expression; value: Expression }>,
  ) {
    this.properties = properties;
  }
  accept(visitor: ExpressionVisitor) {
    return visitor.visitObjectLiteralExpression(this);
  }
  toString(): string {
    return `{${this.properties.map(
      (item) => `${item.key.toString()}:${item.value.toString()}`,
    )}}`;
  }
}
