import {
  AssignExpression,
  BinaryExpression,
  CallExpression,
  Expression,
  GetExpression,
  GroupingExpression,
  LiteralExpression,
  LogicalExpression,
  SetExpression,
  UnaryExpression,
  VariableExpression,
} from './expression';
import { TokenType } from './tokenType';
import type Token from './token';
import {
  BlockStatement,
  ClassStatement,
  ExpressionStatement,
  FunctionStatement,
  IfStatement,
  PrintStatement,
  ReturnStatement,
  Statement,
  VariableStatement,
  WhileStatement,
} from './statement';

class Parser {
  private readonly tokens: Token[];
  private current = 0;
  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }
  parse = (): Statement[] => {
    const statements: Statement[] = [];
    while (!this.isAtEnd()) {
      statements.push(this.declaration());
    }
    return statements;
  };
  private declaration(): Statement {
    if (this.match(TokenType.VAR)) {
      return this.varDeclaration();
    }

    if (this.match(TokenType.CLASS)) {
      return this.classDeclaration();
    }

    if (this.match(TokenType.FUNCTION)) {
      return this.functionDeclaration('function');
    }

    return this.statement();
  }
  private classDeclaration(): ClassStatement {
    const name = this.consume(TokenType.IDENTIFIER, 'expect class name');
    this.consume(TokenType.lEFT_BRACE, 'expect {');
    let methods: FunctionStatement[] = [];
    while (!this.isAtEnd() && !this.check(TokenType.RIGHT_BRACE)) {
      methods.push(this.functionDeclaration('method'));
    }
    this.consume(TokenType.RIGHT_BRACE, 'expect }');
    return new ClassStatement(name, null, methods);
  }
  private varDeclaration(): VariableStatement {
    const name: Token = this.consume(
      TokenType.IDENTIFIER,
      'expect identifier after var',
    );
    let initializer: Expression | null = null;
    if (this.match(TokenType.EQUAL)) {
      initializer = this.expression();
    }
    this.consume(TokenType.SEMICOLON, 'expected ; after declaration');
    return new VariableStatement(name, initializer);
  }
  private functionDeclaration(name: string): FunctionStatement {
    const functionName: Token = this.consume(
      TokenType.IDENTIFIER,
      `expect identifier after ${name}`,
    );
    this.consume(TokenType.LEFT_PAREN, `expect ( after ${name}`);
    const params: Token[] = [];
    if (!this.check(TokenType.RIGHT_PAREN)) {
      do {
        params.push(
          this.consume(TokenType.IDENTIFIER, 'expect parameter name'),
        );
      } while (this.match(TokenType.COMMA));
    }
    this.consume(TokenType.RIGHT_PAREN, `expect ) after ${name}`);
    this.consume(TokenType.lEFT_BRACE, 'expect { after function parameters');
    const block = this.blockStatement();
    return new FunctionStatement(functionName, block, params);
  }
  private statement(): Statement {
    if (this.match(TokenType.IF)) {
      return this.ifStatement();
    }
    if (this.match(TokenType.PRINT)) {
      return this.printStatement();
    }
    if (this.match(TokenType.WHILE)) {
      return this.whileStatement();
    }
    if (this.match(TokenType.DO_WHILE)) {
      return this.doWhileStatement();
    }
    if (this.match(TokenType.FOR)) {
      return this.forStatement();
    }
    if (this.match(TokenType.lEFT_BRACE)) {
      return this.blockStatement();
    }
    if (this.match(TokenType.RETURN)) {
      return this.returnStatement();
    }
    return this.expressionStatement();
  }
  private forStatement(): BlockStatement {
    this.consume(TokenType.LEFT_PAREN, 'expect (');
    var initializer: Statement | null = null;
    if (this.match(TokenType.VAR)) {
      initializer = this.varDeclaration();
    } else if (!this.check(TokenType.SEMICOLON)) {
      initializer = this.expressionStatement();
    } else {
      this.consume(TokenType.SEMICOLON, 'expect ; after initializer');
    }

    let condition: Expression = new LiteralExpression(true);
    if (!this.check(TokenType.SEMICOLON)) {
      condition = this.expression();
    }
    this.consume(TokenType.SEMICOLON, 'expect ; after for condition');
    let end: Expression | null = null;
    if (!this.check(TokenType.RIGHT_PAREN)) {
      end = this.expression();
    }
    this.consume(TokenType.RIGHT_PAREN, 'expect )');
    const body = this.statement();
    const list: Statement[] = [body];
    if (end !== null) {
      list.push(new ExpressionStatement(end));
    }
    const whileBody = new BlockStatement(list);
    const whileStatement = new WhileStatement(condition, whileBody);
    const statements: Statement[] = [];
    if (initializer !== null) {
      statements.push(initializer);
    }
    statements.push(whileStatement);
    return new BlockStatement(statements);
  }
  private doWhileStatement(): BlockStatement {
    this.consume(TokenType.lEFT_BRACE, 'expect {');
    const body = this.blockStatement();
    this.consume(TokenType.WHILE, 'expect while');
    this.consume(TokenType.LEFT_PAREN, 'expect (');
    const expr = this.expression();
    this.consume(TokenType.RIGHT_PAREN, 'expect )');
    const value = new WhileStatement(expr, body);
    const statements: Statement[] = [];
    statements.push(body, value);
    return new BlockStatement(statements);
  }
  private returnStatement(): ReturnStatement {
    const keyword = this.previous();
    let value: Expression | null = null;
    if (!this.check(TokenType.SEMICOLON)) {
      value = this.expression();
    }
    this.consume(TokenType.SEMICOLON, 'expect ; after return');
    return new ReturnStatement(keyword, value);
  }
  private whileStatement(): WhileStatement {
    this.consume(TokenType.LEFT_PAREN, 'expect ( after while');
    const expression = this.expression();
    this.consume(TokenType.RIGHT_PAREN, 'expect ) after while');
    const body = this.statement();
    return new WhileStatement(expression, body);
  }
  private ifStatement(): IfStatement {
    this.consume(TokenType.LEFT_PAREN, 'expect ( after if');
    const expression = this.expression();
    this.consume(TokenType.RIGHT_PAREN, 'expect ) after if');
    const thenBranch: Statement = this.statement();
    let elseBranch: Statement | null = null;
    if (this.match(TokenType.ELSE)) {
      elseBranch = this.statement();
    }
    return new IfStatement(expression, thenBranch, elseBranch);
  }
  private blockStatement(): BlockStatement {
    const statements: Statement[] = [];
    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      statements.push(this.declaration());
    }
    this.consume(TokenType.RIGHT_BRACE, 'expect } after block');
    return new BlockStatement(statements);
  }
  private printStatement(): PrintStatement {
    const expr = this.expression();
    if (!this.isAtEnd()) {
      this.consume(TokenType.SEMICOLON, 'expected ; after print');
    }
    return new PrintStatement(expr);
  }
  private expressionStatement(): ExpressionStatement {
    const expr = this.expression();
    this.match(TokenType.SEMICOLON)
    return new ExpressionStatement(expr);
  }
  public expression(): Expression {
    return this.assignment();
  }
  private assignment(): Expression {
    const expr = this.or();
    if (this.match(TokenType.EQUAL)) {
      const equal: Token = this.previous();
      const value = this.assignment();
      if (expr instanceof VariableExpression) {
        const name = expr.name;
        return new AssignExpression(name, value);
      } else if (expr instanceof GetExpression) {
        return new SetExpression(expr, expr.name, value);
      }
      throw new Error(`invalid assign target: ${equal}`);
    }
    return expr;
  }

  private or(): Expression {
    let expr = this.and();
    while (this.match(TokenType.OR)) {
      const operator = this.previous();
      const right = this.and();
      expr = new LogicalExpression(expr, operator, right);
    }
    return expr;
  }

  private and(): Expression {
    let expr = this.equality();
    while (this.match(TokenType.AND)) {
      const operator = this.previous();
      const right = this.equality();
      expr = new LogicalExpression(expr, operator, right);
    }
    return expr;
  }

  private equality(): Expression {
    let expr: Expression = this.comparison();
    while (this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
      const operator: Token = this.previous();
      const right: Expression = this.comparison();
      expr = new BinaryExpression(expr, operator, right);
    }
    return expr;
  }
  private comparison(): Expression {
    let term: Expression = this.term();
    while (
      this.match(
        TokenType.GREATER,
        TokenType.GREATER_EQUAL,
        TokenType.LESS,
        TokenType.LESS_EQUAL,
      )
    ) {
      const operator: Token = this.previous();
      const right: Expression = this.term();
      term = new BinaryExpression(term, operator, right);
    }
    return term;
  }
  private term(): Expression {
    let factor: Expression = this.factor();
    while (this.match(TokenType.PLUS, TokenType.MINUS)) {
      const operator: Token = this.previous();
      const right: Expression = this.factor();
      factor = new BinaryExpression(factor, operator, right);
    }
    return factor;
  }
  private factor(): Expression {
    let unary: Expression = this.unary();
    while (this.match(TokenType.STAR, TokenType.SLASH)) {
      const operator: Token = this.previous();
      const right: Expression = this.unary();
      unary = new BinaryExpression(unary, operator, right);
    }
    return unary;
  }
  private unary(): Expression {
    if (
      this.match(
        TokenType.PLUS_PLUS,
        TokenType.MINUS_MINUS,
        TokenType.MINUS,
        TokenType.BANG,
      )
    ) {
      const operator: Token = this.previous();
      const value = this.unary();
      return new UnaryExpression(operator, value);
    }
    return this.call();
  }
  private call(): Expression {
    let expr: Expression = this.primary();
    while (true) {
      if (this.match(TokenType.LEFT_PAREN)) {
        expr = this.finishCall(expr);
      } else if (this.match(TokenType.DOT)) {
        const name = this.consume(TokenType.IDENTIFIER, "expect name");
        expr = new GetExpression(expr, name)
      }
      else{
        break;
      }
    }
    return expr;
  }
  private finishCall(callee: Expression): Expression {
    const params: Expression[] = [];
    if (!this.check(TokenType.RIGHT_PAREN)) {
      do {
        params.push(this.expression());
      } while (this.match(TokenType.COMMA));
    }
    const paren = this.consume(
      TokenType.RIGHT_PAREN,
      'expect ) after arguments',
    );
    return new CallExpression(callee, paren, params);
  }

  private primary(): Expression {
    if (this.match(TokenType.TRUE)) {
      return new LiteralExpression(true);
    }
    if (this.match(TokenType.FALSE)) {
      return new LiteralExpression(false);
    }
    if (this.match(TokenType.NULL)) {
      return new LiteralExpression(null);
    }
    if (this.match(TokenType.NUMBER)) {
      return new LiteralExpression(parseFloat(this.previous().lexeme));
    }
    if (this.match(TokenType.STRING)) {
      return new LiteralExpression(this.previous().lexeme);
    }
    if (this.match(TokenType.IDENTIFIER)) {
      return new VariableExpression(this.previous());
    }
    if (this.match(TokenType.LEFT_PAREN)) {
      const expr: Expression = this.expression();
      this.consume(
        TokenType.RIGHT_PAREN,
        `parser expected: '(',actual: ${JSON.stringify(this.peek())}`,
      );
      return new GroupingExpression(expr);
    }

    throw new Error(
      `parser can not handle token: ${JSON.stringify(this.peek())}`,
    );
  }
  private consume(type: TokenType, message: string) {
    if (this.peek().type === type) {
      this.advance();
      return this.previous();
    }
    throw new Error(message);
  }
  private previous(): Token {
    return this.tokens[this.current - 1] as Token;
  }
  private match(...types: TokenType[]): boolean {
    for (let type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }
  private advance() {
    if (this.isAtEnd()) {
      return;
    }
    this.current++;
  }
  private check(type: TokenType) {
    if (this.isAtEnd()) {
      return false;
    }
    return this.peek().type === type;
  }
  private isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF;
  }
  private peek(): Token {
    return this.tokens[this.current] as Token;
  }
}

export default Parser;
