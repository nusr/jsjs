import type Token from './token';
import type { Expression, VariableExpression } from './expression';
import type { LiteralType } from './type';
export interface StatementVisitor {
  visitBlockStatement: (statement: BlockStatement) => LiteralType;
  visitClassStatement: (statement: ClassStatement) => LiteralType;
  visitExpressionStatement: (statement: ExpressionStatement) => LiteralType;
  visitFunctionStatement: (statement: FunctionStatement) => LiteralType;
  visitIfStatement: (statement: IfStatement) => LiteralType;
  visitReturnStatement: (statement: ReturnStatement) => LiteralType;
  visitVariableStatement: (statement: VariableStatement) => LiteralType;
  visitWhileStatement: (statement: WhileStatement) => LiteralType;
}
export interface Statement {
  accept(visitor: StatementVisitor): LiteralType;
  toString(): string;
}
export class BlockStatement implements Statement {
  readonly statements: Statement[];
  constructor(statements: Statement[]) {
    this.statements = statements;
  }
  accept(visitor: StatementVisitor): LiteralType {
    return visitor.visitBlockStatement(this);
  }
  toString() {
    return `{${this.statements.map((item) => item.toString()).join('')}}`;
  }
}
export class ClassStatement implements Statement {
  readonly name: Token;
  readonly superClass: VariableExpression | null;
  readonly methods: Array<VariableStatement | FunctionStatement>;
  constructor(
    name: Token,
    superClass: VariableExpression | null,
    methods: Array<VariableStatement | FunctionStatement>,
  ) {
    this.name = name;
    this.superClass = superClass;
    this.methods = methods;
  }
  accept(visitor: StatementVisitor): LiteralType {
    return visitor.visitClassStatement(this);
  }
  toString() {
    return `class ${this.name.toString()}{${this.methods
      .map((item) => {
        const temp = item.toString();
        const index = temp.indexOf(' ');
        return temp.slice(index + 1);
      })
      .join('')}}`;
  }
}
export class ExpressionStatement implements Statement {
  readonly expression: Expression;
  constructor(expression: Expression) {
    this.expression = expression;
  }
  accept(visitor: StatementVisitor): LiteralType {
    return visitor.visitExpressionStatement(this);
  }
  toString() {
    return this.expression.toString() + ';';
  }
}
export class FunctionStatement implements Statement {
  readonly name: Token;
  readonly body: BlockStatement;
  readonly params: Token[];
  readonly static: boolean;
  constructor(
    name: Token,
    body: BlockStatement,
    params: Token[],
    isStatic = false,
  ) {
    this.name = name;
    this.body = body;
    this.params = params;
    this.static = isStatic;
  }
  accept(visitor: StatementVisitor): LiteralType {
    return visitor.visitFunctionStatement(this);
  }
  toString() {
    return `function ${
      this.static ? 'static ' : ''
    }${this.name.toString()}(${this.params
      .map((item) => item.toString())
      .join(',')})${this.body.toString()}`;
  }
}
export class IfStatement implements Statement {
  readonly condition: Expression;
  readonly thenBranch: Statement;
  readonly elseBranch: Statement | null;
  constructor(
    condition: Expression,
    thenBranch: Statement,
    elseBranch: Statement | null,
  ) {
    this.condition = condition;
    this.thenBranch = thenBranch;
    this.elseBranch = elseBranch;
  }
  accept(visitor: StatementVisitor): LiteralType {
    return visitor.visitIfStatement(this);
  }
  toString() {
    const temp = `if(${this.condition.toString()})${this.thenBranch.toString()}`;
    if (this.elseBranch === null) {
      return temp;
    }
    return `${temp} else ${this.elseBranch.toString()}`;
  }
}
export class ReturnStatement implements Statement {
  readonly keyword: Token;
  readonly value: Expression | null;
  constructor(keyword: Token, value: Expression | null) {
    this.keyword = keyword;
    this.value = value;
  }
  accept(visitor: StatementVisitor): LiteralType {
    return visitor.visitReturnStatement(this);
  }
  toString() {
    return `return ${this.value === null ? '' : this.value.toString()};`;
  }
}
export class VariableStatement implements Statement {
  readonly name: Token;
  readonly initializer: Expression | null;
  readonly static: boolean;
  constructor(name: Token, initializer: Expression | null, isStatic = false) {
    this.name = name;
    this.initializer = initializer;
    this.static = isStatic;
  }
  accept(visitor: StatementVisitor): LiteralType {
    return visitor.visitVariableStatement(this);
  }
  toString() {
    const temp = `var ${this.static ? 'static ' : ''}${this.name.toString()}`;
    if (this.initializer === null) {
      return temp + ';';
    }
    return `${temp} = ${this.initializer.toString()};`;
  }
}
export class WhileStatement implements Statement {
  readonly condition: Expression;
  readonly body: Statement;
  constructor(condition: Expression, body: Statement) {
    this.condition = condition;
    this.body = body;
  }
  accept(visitor: StatementVisitor): LiteralType {
    return visitor.visitWhileStatement(this);
  }
  toString() {
    return `while(${this.condition.toString()})${this.body.toString()}`;
  }
}
