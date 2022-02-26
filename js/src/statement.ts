import { Expression, VariableExpression, ExpressionType } from './expression';
import Token from './token';

export type StatementType = string;
export interface StatementVisitor<T> {
  visitBlockStatement(statement: BlockStatement<T>): T;
  visitClassStatement(statement: ClassStatement<T>): T;
  visitExpressionStatement(statement: ExpressionStatement<T>): T;
  visitFunctionStatement(statement: FunctionStatement<T>): T;
  visitIfStatement(statement: IfStatement<T>): T;
  visitPrintStatement(statement: PrintStatement<T>): T;
  visitReturnStatement(statement: ReturnStatement<T>): T;
  visitVariableStatement(statement: VariableStatement<T>): T;
  visitWhileStatement(statement: WhileStatement<T>): T;
}
export abstract class Statement<T> {
  abstract accept(visitor: StatementVisitor<T>): T;
}

export class BlockStatement<T> extends Statement<T> {
  readonly statements: Statement<T>[];
  constructor(statements: Statement<T>[]) {
    super();
    this.statements = statements;
  }
  accept(visitor: StatementVisitor<T>): T {
    return visitor.visitBlockStatement(this);
  }
}
export class ClassStatement<T> extends Statement<T> {
  readonly name: Token;
  readonly superClass: VariableExpression<ExpressionType>;
  readonly methods: FunctionStatement<T>[];
  constructor(
    name: Token,
    superClass: VariableExpression<ExpressionType>,
    methods: FunctionStatement<T>[],
  ) {
    super();
    this.name = name;
    this.superClass = superClass;
    this.methods = methods;
  }
  accept(visitor: StatementVisitor<T>): T {
    return visitor.visitClassStatement(this);
  }
}

export class ExpressionStatement<T> extends Statement<T> {
  readonly expression: Expression<ExpressionType>;
  constructor(expression: Expression<ExpressionType>) {
    super();
    this.expression = expression;
  }
  accept(visitor: StatementVisitor<T>): T {
    return visitor.visitExpressionStatement(this);
  }
}
export class FunctionStatement<T> extends Statement<T> {
  readonly name: Token;
  readonly body: Statement<T>;
  readonly params: Token[];
  constructor(name: Token, params: Token[], body: Statement<T>) {
    super();
    this.name = name;
    this.body = body;
    this.params = params;
  }
  accept(visitor: StatementVisitor<T>): T {
    return visitor.visitFunctionStatement(this);
  }
}
export class IfStatement<T> extends Statement<T> {
  readonly condition: Expression<ExpressionType>;
  readonly thenBranch: Statement<T>;
  readonly elseBranch: Statement<T>;
  constructor(
    condition: Expression<ExpressionType>,
    thenBranch: Statement<T>,
    elseBranch: Statement<T>,
  ) {
    super();
    this.condition = condition;
    this.thenBranch = thenBranch;
    this.elseBranch = elseBranch;
  }
  accept(visitor: StatementVisitor<T>): T {
    return visitor.visitIfStatement(this);
  }
}
export class PrintStatement<T> extends Statement<T> {
  readonly expression: Expression<ExpressionType>;
  constructor(expression: Expression<ExpressionType>) {
    super();
    this.expression = expression;
  }
  accept(visitor: StatementVisitor<T>): T {
    return visitor.visitPrintStatement(this);
  }
}
export class ReturnStatement<T> extends Statement<T> {
  readonly keyword: Token;
  readonly value: Expression<ExpressionType>;
  constructor(keyword: Token, value: VariableExpression<ExpressionType>) {
    super();
    this.keyword = keyword;
    this.value = value;
  }
  accept(visitor: StatementVisitor<T>): T {
    return visitor.visitReturnStatement(this);
  }
}

export class VariableStatement<T> extends Statement<T> {
  readonly name: Token;
  readonly initializer: Expression<ExpressionType>;
  constructor(name: Token, initializer: VariableExpression<ExpressionType>) {
    super();
    this.name = name;
    this.initializer = initializer;
  }
  accept(visitor: StatementVisitor<T>): T {
    return visitor.visitVariableStatement(this);
  }
}
export class WhileStatement<T> extends Statement<T> {
  readonly condition: Expression<ExpressionType>;
  readonly body: Statement<T>;
  constructor(condition: Expression<ExpressionType>, body: Statement<T>) {
    super();
    this.condition = condition;
    this.body = body;
  }
  accept(visitor: StatementVisitor<T>): T {
    return visitor.visitWhileStatement(this);
  }
}