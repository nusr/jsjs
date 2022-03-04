import {
  BinaryExpression,
  Expression,
  GroupingExpression,
  LiteralExpression,
  UnaryExpression,
} from './expression';
import { ExpressionType } from './type';
import { TokenType } from './tokenType';
import Token from './token';
import { ExpressionStatement, PrintStatement, Statement } from './statement';

class Parser {
  private readonly tokens: Token[];
  private current = 0;
  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }
  parse(): Statement<ExpressionType>[] {
    const statements: Statement<ExpressionType>[] = [];
    while (!this.isAtEnd()) {
      statements.push(this.statement());
    }
    return statements;
  }
  private statement(): Statement<ExpressionType> {
    if (this.match(TokenType.PRINT)) {
      return this.printStatement();
    }
    return this.expressionStatement();
  }
  private printStatement(): Statement<ExpressionType> {
    const expr = this.expression();
    this.consume(TokenType.COMMA, 'expected ; after print');
    return new PrintStatement<ExpressionType>(expr);
  }
  private expressionStatement(): Statement<ExpressionType> {
    const expr = this.expression();
    this.consume(TokenType.COMMA, 'expected ; after expression');
    return new ExpressionStatement<ExpressionType>(expr);
  }
  public expression(): Expression<ExpressionType> {
    return this.equality();
  }
  private equality(): Expression<ExpressionType> {
    let expr: Expression<ExpressionType> = this.comparison();
    while (this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
      const operator: Token = this.previous();
      const right: Expression<ExpressionType> = this.comparison();
      expr = new BinaryExpression(expr, operator, right);
    }
    return expr;
  }
  private comparison(): Expression<ExpressionType> {
    let term: Expression<ExpressionType> = this.term();
    while (
      this.match(
        TokenType.GREATER,
        TokenType.GREATER_EQUAL,
        TokenType.LESS,
        TokenType.LESS_EQUAL,
      )
    ) {
      const operator: Token = this.previous();
      const right: Expression<ExpressionType> = this.term();
      term = new BinaryExpression(term, operator, right);
    }
    return term;
  }
  private term(): Expression<ExpressionType> {
    let factor: Expression<ExpressionType> = this.factor();
    while (this.match(TokenType.PLUS, TokenType.MINUS)) {
      const operator: Token = this.previous();
      const right: Expression<ExpressionType> = this.factor();
      factor = new BinaryExpression(factor, operator, right);
    }
    return factor;
  }
  private factor(): Expression<ExpressionType> {
    let unary: Expression<ExpressionType> = this.unary();
    while (this.match(TokenType.STAR, TokenType.SLASH)) {
      const operator: Token = this.previous();
      const right: Expression<ExpressionType> = this.unary();
      unary = new BinaryExpression(unary, operator, right);
    }
    return unary;
  }
  private unary(): Expression<ExpressionType> {
    if (this.match(TokenType.MINUS, TokenType.BANG)) {
      const operator: Token = this.previous();
      const value = this.unary();
      return new UnaryExpression(operator, value);
    }
    return this.primary();
  }
  private primary(): Expression<ExpressionType> {
    if (this.match(TokenType.TRUE)) {
      return new LiteralExpression(true);
    }
    if (this.match(TokenType.FALSE)) {
      return new LiteralExpression(false);
    }
    if (this.match(TokenType.NIL)) {
      return new LiteralExpression(null);
    }
    if (this.match(TokenType.NUMBER, TokenType.STRING)) {
      return new LiteralExpression(this.previous().literal);
    }
    if (this.match(TokenType.LEFT_PAREN)) {
      const expr: Expression<ExpressionType> = this.expression();
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
      return;
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
