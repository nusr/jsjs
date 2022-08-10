import type Token from './token';
import type { Expression, VariableExpression } from './expression';
import type { LiteralType } from './type';;
export interface StatementVisitor {
  visitBlockStatement: (statement: BlockStatement) => LiteralType;
  visitClassStatement: (statement: ClassStatement) => LiteralType;
  visitExpressionStatement: (statement: ExpressionStatement) => LiteralType;
  visitFunctionStatement: (statement: FunctionStatement) => LiteralType;
  visitIfStatement: (statement: IfStatement) => LiteralType;
  visitPrintStatement: (statement: PrintStatement) => LiteralType;
  visitReturnStatement: (statement: ReturnStatement) => LiteralType;
  visitVariableStatement: (statement: VariableStatement) => LiteralType;
  visitWhileStatement: (statement: WhileStatement) => LiteralType;
}
export abstract class Statement {
  abstract accept(visitor: StatementVisitor): LiteralType;
}
export class BlockStatement extends Statement {
  readonly statements: Statement[];
  constructor(statements: Statement[]) {
    super();
    this.statements = statements;
  }
  accept(visitor: StatementVisitor): LiteralType {
    return visitor.visitBlockStatement(this);
  }
}
export class ClassStatement extends Statement {
  readonly name: Token;
  readonly superClass: VariableExpression | null;
  readonly methods: FunctionStatement[];
  constructor(name: Token, superClass: VariableExpression | null, methods: FunctionStatement[]) {
    super();
    this.name = name;
    this.superClass = superClass;
    this.methods = methods;
  }
  accept(visitor: StatementVisitor): LiteralType {
    return visitor.visitClassStatement(this);
  }
}
export class ExpressionStatement extends Statement {
  readonly expression: Expression;
  constructor(expression: Expression) {
    super();
    this.expression = expression;
  }
  accept(visitor: StatementVisitor): LiteralType {
    return visitor.visitExpressionStatement(this);
  }
}
export class FunctionStatement extends Statement {
  readonly name: Token;
  readonly body: BlockStatement;
  readonly params: Token[];
  constructor(name: Token, body: BlockStatement, params: Token[]) {
    super();
    this.name = name;
    this.body = body;
    this.params = params;
  }
  accept(visitor: StatementVisitor): LiteralType {
    return visitor.visitFunctionStatement(this);
  }
}
export class IfStatement extends Statement {
  readonly condition: Expression;
  readonly thenBranch: Statement;
  readonly elseBranch: Statement | null;
  constructor(condition: Expression, thenBranch: Statement, elseBranch: Statement | null) {
    super();
    this.condition = condition;
    this.thenBranch = thenBranch;
    this.elseBranch = elseBranch;
  }
  accept(visitor: StatementVisitor): LiteralType {
    return visitor.visitIfStatement(this);
  }
}
export class PrintStatement extends Statement {
  readonly expression: Expression;
  constructor(expression: Expression) {
    super();
    this.expression = expression;
  }
  accept(visitor: StatementVisitor): LiteralType {
    return visitor.visitPrintStatement(this);
  }
}
export class ReturnStatement extends Statement {
  readonly keyword: Token;
  readonly value: Expression | null;
  constructor(keyword: Token, value: Expression | null) {
    super();
    this.keyword = keyword;
    this.value = value;
  }
  accept(visitor: StatementVisitor): LiteralType {
    return visitor.visitReturnStatement(this);
  }
}
export class VariableStatement extends Statement {
  readonly name: Token;
  readonly initializer: Expression | null;
  constructor(name: Token, initializer: Expression | null) {
    super();
    this.name = name;
    this.initializer = initializer;
  }
  accept(visitor: StatementVisitor): LiteralType {
    return visitor.visitVariableStatement(this);
  }
}
export class WhileStatement extends Statement {
  readonly condition: Expression;
  readonly body: Statement;
  constructor(condition: Expression, body: Statement) {
    super();
    this.condition = condition;
    this.body = body;
  }
  accept(visitor: StatementVisitor): LiteralType {
    return visitor.visitWhileStatement(this);
  }
}
  