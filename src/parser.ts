import {
  ArrayLiteralExpression,
  AssignExpression,
  BinaryExpression,
  CallExpression,
  Expression,
  FunctionExpression,
  GetExpression,
  GroupingExpression,
  LiteralExpression,
  LogicalExpression,
  NewExpression,
  ObjectLiteralExpression,
  SetExpression,
  TokenExpression,
  UnaryExpression,
  VariableExpression,
} from './expression';
import { TokenType } from './tokenType';
import Token from './token';
import {
  BlockStatement,
  ClassStatement,
  ExpressionStatement,
  FunctionStatement,
  IfStatement,
  ReturnStatement,
  Statement,
  VariableStatement,
  WhileStatement,
} from './statement';

const assignmentMap: Map<TokenType, TokenType> = new Map([
  [TokenType.PLUS_EQUAL, TokenType.PLUS],
  [TokenType.PLUS_EQUAL, TokenType.PLUS],
  [TokenType.MINUS_EQUAL, TokenType.MINUS],
  [TokenType.STAR_EQUAL, TokenType.STAR],
  [TokenType.SLASH_EQUAL, TokenType.SLASH],
  [TokenType.REMAINDER_EQUAL, TokenType.REMAINDER],
  [TokenType.LEFT_SHIFT_EQUAL, TokenType.LEFT_SHIFT],
  [TokenType.RIGHT_SHIFT_EQUAL, TokenType.RIGHT_SHIFT],
  [TokenType.UNSIGNED_RIGHT_SHIFT_EQUAL, TokenType.UNSIGNED_RIGHT_SHIFT],
  [TokenType.OR_EQUAL, TokenType.OR],
  [TokenType.AND_EQUAL, TokenType.AND],
]);

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
      return this.functionDeclaration('Function');
    }

    return this.statement();
  }
  private classDeclaration(): ClassStatement {
    const name = this.consume(TokenType.IDENTIFIER, 'expect class name');
    let superClass: VariableExpression | null = null;
    if (this.match(TokenType.EXTENDS)) {
      const name = this.consume(TokenType.IDENTIFIER, 'expect class');
      superClass = new VariableExpression(name);
    }
    this.consume(TokenType.lEFT_BRACE, 'expect {');
    let methods: Array<VariableStatement | FunctionStatement> = [];
    while (!this.isAtEnd() && !this.check(TokenType.RIGHT_BRACE)) {
      const isStatic = this.match(TokenType.STATIC);
      if (this.checkNext(TokenType.LEFT_BRACKET)) {
        methods.push(this.functionDeclaration('Class', isStatic));
      } else {
        methods.push(this.varDeclaration(isStatic));
      }
    }
    this.consume(TokenType.RIGHT_BRACE, 'expect }');
    return new ClassStatement(name, superClass, methods);
  }
  private varDeclaration(isStatic = false): VariableStatement {
    const name: Token = this.consume(
      TokenType.IDENTIFIER,
      'expect identifier after var',
    );
    let initializer: Expression | null = null;
    if (this.match(TokenType.EQUAL)) {
      initializer = this.expression();
    }
    this.match(TokenType.SEMICOLON);
    return new VariableStatement(name, initializer, isStatic);
  }
  private functionDeclaration(
    name: string,
    isStatic = false,
  ): FunctionStatement {
    const functionName: Token = this.consume(
      TokenType.IDENTIFIER,
      `${name} statements require a function name`,
    );
    const params = this.getTokens(name);
    this.consume(TokenType.lEFT_BRACE, 'expect { after function parameters');
    const block = this.blockStatement();
    return new FunctionStatement(functionName, block, params, isStatic);
  }
  private statement(): Statement {
    if (this.match(TokenType.IF)) {
      return this.ifStatement();
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
    this.consume(TokenType.LEFT_BRACKET, 'expect (');
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
    if (!this.check(TokenType.RIGHT_BRACKET)) {
      end = this.expression();
    }
    this.consume(TokenType.RIGHT_BRACKET, 'expect )');
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
    this.consume(TokenType.LEFT_BRACKET, 'expect (');
    const expr = this.expression();
    this.consume(TokenType.RIGHT_BRACKET, 'expect )');
    const value = new WhileStatement(expr, body);
    return new BlockStatement([body, value]);
  }
  private returnStatement(): ReturnStatement {
    let value: Expression | null = null;
    if (!this.check(TokenType.SEMICOLON)) {
      value = this.expression();
    }
    this.match(TokenType.SEMICOLON);
    return new ReturnStatement(value);
  }
  private whileStatement(): WhileStatement {
    this.consume(TokenType.LEFT_BRACKET, 'expect ( after while');
    const expression = this.expression();
    this.consume(TokenType.RIGHT_BRACKET, 'expect ) after while');
    const body = this.statement();
    return new WhileStatement(expression, body);
  }
  private ifStatement(): IfStatement {
    this.consume(TokenType.LEFT_BRACKET, 'expect ( after if');
    const expression = this.expression();
    this.consume(TokenType.RIGHT_BRACKET, 'expect ) after if');
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
  private expressionStatement(): ExpressionStatement {
    const expr = this.expression();
    this.match(TokenType.SEMICOLON);
    return new ExpressionStatement(expr);
  }
  public expression(): Expression {
    return this.assignment();
  }
  private assignment(): Expression {
    const expr = this.or();
    if (this.match(TokenType.EQUAL, ...assignmentMap.keys())) {
      const equal: Token = this.previous();
      let value = this.assignment();
      const temp = assignmentMap.get(equal.type);
      if (temp) {
        const operator = new Token(
          temp,
          equal.lexeme.replace('=', ''),
          equal.line,
        );
        if (
          equal.type === TokenType.AND_EQUAL ||
          equal.type === TokenType.OR_EQUAL
        ) {
          value = new LogicalExpression(expr, operator, value);
        } else {
          value = new BinaryExpression(expr, operator, value);
        }
      }
      if (expr instanceof VariableExpression) {
        const name = expr.name;
        return new AssignExpression(name, value);
      } else if (expr instanceof GetExpression) {
        return new SetExpression(expr, value);
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
    while (
      this.match(
        TokenType.BANG_EQUAL,
        TokenType.BANG_EQUAL_EQUAL,
        TokenType.EQUAL_EQUAL,
        TokenType.EQUAL_EQUAL_EQUAL,
      )
    ) {
      const operator: Token = this.previous();
      const right: Expression = this.comparison();
      expr = new BinaryExpression(expr, operator, right);
    }
    return expr;
  }
  private comparison(): Expression {
    let bitwiseShift: Expression = this.bitwiseShift();
    while (
      this.match(
        TokenType.GREATER,
        TokenType.GREATER_EQUAL,
        TokenType.LESS,
        TokenType.LESS_EQUAL,
      )
    ) {
      const operator: Token = this.previous();
      const right: Expression = this.bitwiseShift();
      bitwiseShift = new BinaryExpression(bitwiseShift, operator, right);
    }
    return bitwiseShift;
  }
  private bitwiseShift(): Expression {
    let term: Expression = this.term();
    while (
      this.match(
        TokenType.LEFT_SHIFT,
        TokenType.RIGHT_SHIFT,
        TokenType.UNSIGNED_RIGHT_SHIFT,
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
    while (this.match(TokenType.STAR, TokenType.SLASH, TokenType.REMAINDER)) {
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
    return this.newExpression();
  }
  private newExpression(): Expression {
    if (this.match(TokenType.NEW)) {
      return new NewExpression(this.call());
    }
    return this.call();
  }
  private call(): Expression {
    let expr: Expression = this.primary();
    while (true) {
      if (this.match(TokenType.LEFT_BRACKET)) {
        expr = this.finishCall(expr);
      } else if (this.match(TokenType.DOT)) {
        const property = this.consume(TokenType.IDENTIFIER, 'expect name');
        expr = new GetExpression(expr, new TokenExpression(property));
      } else if (this.match(TokenType.LEFT_SQUARE_BRACKET)) {
        const property = this.expression();
        this.consume(TokenType.RIGHT_SQUARE_BRACKET, 'expect ]');
        expr = new GetExpression(expr, property);
      } else {
        break;
      }
    }
    return expr;
  }
  private getExpressions(tokenType: TokenType) {
    const params: Expression[] = [];
    if (!this.check(tokenType)) {
      do {
        params.push(this.expression());
      } while (this.match(TokenType.COMMA));
    }
    return params;
  }
  private finishCall(callee: Expression): Expression {
    const params = this.getExpressions(TokenType.RIGHT_BRACKET);
    this.consume(TokenType.RIGHT_BRACKET, 'expect ) after arguments');
    return new CallExpression(callee, params);
  }
  private getTokens(name: string): Token[] {
    const params: Token[] = [];
    this.consume(TokenType.LEFT_BRACKET, `expect ( after ${name}`);
    if (!this.check(TokenType.RIGHT_BRACKET)) {
      do {
        params.push(
          this.consume(TokenType.IDENTIFIER, 'expect parameter name'),
        );
      } while (this.match(TokenType.COMMA));
    }
    this.consume(TokenType.RIGHT_BRACKET, `expect ) after ${name}`);
    return params;
  }

  private functionExpression(): FunctionExpression {
    let functionName: Token | null = null;
    if (this.match(TokenType.IDENTIFIER)) {
      functionName = this.previous();
    }
    const params = this.getTokens('expression');
    this.consume(TokenType.lEFT_BRACE, 'expect { after function parameters');
    const block = this.blockStatement();
    return new FunctionExpression(functionName, block, params);
  }
  private primary(): Expression {
    if (this.match(TokenType.TRUE)) {
      return new LiteralExpression(true);
    }
    if (this.match(TokenType.FALSE)) {
      return new LiteralExpression(false);
    }
    if (this.match(TokenType.UNDEFINED)) {
      return new LiteralExpression(undefined);
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
    if (this.match(TokenType.LEFT_BRACKET)) {
      const expr: Expression = this.expression();
      this.consume(
        TokenType.RIGHT_BRACKET,
        `parser expected: '(',actual: ${this.peek().toString()}`,
      );
      return new GroupingExpression(expr);
    }
    if (this.match(TokenType.FUNCTION)) {
      return this.functionExpression();
    }
    if (this.match(TokenType.LEFT_SQUARE_BRACKET)) {
      const value = this.getExpressions(TokenType.RIGHT_SQUARE_BRACKET);
      this.consume(TokenType.RIGHT_SQUARE_BRACKET, 'expect ]');
      return new ArrayLiteralExpression(value);
    }
    if (this.match(TokenType.lEFT_BRACE)) {
      const valueList: Array<{ key: Expression; value: Expression }> = [];
      if (!this.check(TokenType.RIGHT_BRACE)) {
        do {
          if (this.check(TokenType.RIGHT_BRACE)) {
            break;
          }
          const key = this.primary();
          this.consume(TokenType.COLON, 'expect :');
          const value = this.expression();
          valueList.push({ key, value });
        } while (this.match(TokenType.COMMA));
      }
      this.consume(TokenType.RIGHT_BRACE, 'expect }');
      return new ObjectLiteralExpression(valueList);
    }

    throw new Error(`parser can not handle token: ${this.peek().toString()}`);
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
  private checkNext(type: TokenType) {
    if (this.isAtEnd()) {
      return false;
    }
    return (this.tokens[this.current + 1] as Token).type === type;
  }
  private isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF;
  }
  private peek(): Token {
    return this.tokens[this.current] as Token;
  }
}

export default Parser;
