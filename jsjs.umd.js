/* 
MIT License

Copyright (c) 2022 Steve Xu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 
*/(function (global, factory) {
            typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
            typeof define === 'function' && define.amd ? define(['exports'], factory) :
              (global = global || self, factory(global.jsjs = {}));
       })(this, (function (exports) { 'use strict';
"use strict";
var __export__ = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/index.ts
  var src_exports = {};
  __export(src_exports, {
    Environment: () => environment_default,
    getGlobalObject: () => getGlobalObject,
    interpret: () => interpret
  });

  // src/token.ts
  var Token = class {
    constructor(type, lexeme, line) {
      this.type = type;
      this.lexeme = lexeme;
      this.line = line;
    }
    toString() {
      if (this.type === 44 /* STRING */) {
        return `'${this.lexeme}'`;
      }
      return this.lexeme;
    }
  };
  var token_default = Token;

  // src/constant.ts
  var KEYWORD_MAP = /* @__PURE__ */ new Map([
    ["class", 46 /* CLASS */],
    ["else", 47 /* ELSE */],
    ["false", 48 /* FALSE */],
    ["for", 51 /* FOR */],
    ["function", 50 /* FUNCTION */],
    ["if", 52 /* IF */],
    ["null", 53 /* NULL */],
    ["return", 60 /* RETURN */],
    // ['super', TokenType.SUPER],
    // ['this', TokenType.THIS],
    ["true", 49 /* TRUE */],
    ["var", 63 /* VAR */],
    ["while", 64 /* WHILE */],
    ["do", 65 /* DO_WHILE */],
    ["new", 66 /* NEW */],
    ["static", 67 /* STATIC */],
    ["undefined", 69 /* UNDEFINED */],
    ["extends", 70 /* EXTENDS */],
    ["typeof", 74 /* TYPEOF */],
    ["delete", 75 /* DELETE */],
    ["void", 76 /* VOID */],
    ["in", 77 /* IN */],
    ["instanceof", 78 /* INSTANCE_OF */]
  ]);
  var EMPTY_DATA = "\0";

  // src/scanner.ts
  var Scanner = class {
    constructor(text) {
      this.tokens = [];
      this.errors = [];
      this.start = 0;
      this.current = 0;
      this.line = 1;
      this.scan = () => {
        while (!this.isAtEnd()) {
          this.start = this.current;
          this.scanToken();
        }
        this.tokens.push(new token_default(81 /* EOF */, "", this.line));
        return this.tokens;
      };
      this.addError = (line, message) => {
        const msg = `line: ${line},scanner error : ${message} `;
        throw new Error(msg);
      };
      this.source = [...text];
    }
    isAtEnd() {
      return this.current >= this.source.length;
    }
    substr(start = this.start, end = this.current) {
      return this.source.slice(start, end).join("");
    }
    addOneToken(type, value = this.substr()) {
      this.tokens.push(new token_default(type, value, this.line));
    }
    getChar(index) {
      return this.source[index];
    }
    peek() {
      if (this.isAtEnd()) {
        return EMPTY_DATA;
      }
      return this.getChar(this.current);
    }
    peekNext() {
      if (this.current + 1 < this.source.length) {
        return this.getChar(this.current + 1);
      }
      return EMPTY_DATA;
    }
    match(expected) {
      if (this.isAtEnd()) {
        return false;
      }
      if (this.getChar(this.current) !== expected) {
        return false;
      }
      this.current++;
      return true;
    }
    advance() {
      return this.getChar(this.current++);
    }
    scanToken() {
      const c = this.advance();
      switch (c) {
        case "(":
          this.addOneToken(0 /* LEFT_BRACKET */);
          break;
        case ")":
          this.addOneToken(1 /* RIGHT_BRACKET */);
          break;
        case "{":
          this.addOneToken(2 /* lEFT_BRACE */);
          break;
        case "}":
          this.addOneToken(3 /* RIGHT_BRACE */);
          break;
        case "[":
          this.addOneToken(4 /* LEFT_SQUARE_BRACKET */);
          break;
        case "]":
          this.addOneToken(5 /* RIGHT_SQUARE_BRACKET */);
          break;
        case ":":
          this.addOneToken(8 /* COLON */);
          break;
        case ",":
          this.addOneToken(6 /* COMMA */);
          break;
        case ".":
          this.addOneToken(7 /* DOT */);
          break;
        case "-":
          if (this.match("-")) {
            this.addOneToken(10 /* MINUS_MINUS */);
          } else {
            if (this.match("=")) {
              this.addOneToken(29 /* MINUS_EQUAL */);
            } else {
              this.addOneToken(9 /* MINUS */);
            }
          }
          break;
        case "+":
          if (this.match("+")) {
            this.addOneToken(12 /* PLUS_PLUS */);
          } else {
            if (this.match("=")) {
              this.addOneToken(28 /* PLUS_EQUAL */);
            } else {
              this.addOneToken(11 /* PLUS */);
            }
          }
          break;
        case ";":
          this.addOneToken(13 /* SEMICOLON */);
          break;
        case "*":
          if (this.match("=")) {
            this.addOneToken(30 /* STAR_EQUAL */);
          } else if (this.match("*")) {
            if (this.match("=")) {
              this.addOneToken(32 /* STAR_STAR_EQUAL */);
            } else {
              this.addOneToken(16 /* STAR_STAR */);
            }
          } else {
            this.addOneToken(15 /* STAR */);
          }
          break;
        case "%":
          if (this.match("=")) {
            this.addOneToken(33 /* REMAINDER_EQUAL */);
          } else {
            this.addOneToken(17 /* REMAINDER */);
          }
          break;
        case "!":
          if (this.match("=")) {
            if (this.match("=")) {
              this.addOneToken(20 /* BANG_EQUAL_EQUAL */);
            } else {
              this.addOneToken(19 /* BANG_EQUAL */);
            }
          } else {
            this.addOneToken(18 /* BANG */);
          }
          break;
        case "=":
          if (this.match("=")) {
            if (this.match("=")) {
              this.addOneToken(22 /* EQUAL_EQUAL_EQUAL */);
            } else {
              this.addOneToken(21 /* EQUAL_EQUAL */);
            }
          } else {
            this.addOneToken(27 /* EQUAL */);
          }
          break;
        case "?":
          if (this.match("?")) {
            if (this.match("=")) {
              this.addOneToken(37 /* NULLISH_COALESCING_EQUAL */);
            } else {
              this.addOneToken(80 /* NULLISH_COALESCING */);
            }
          } else {
            this.addOneToken(79 /* QUESTION_MARK */);
          }
          break;
        case ">":
          if (this.match("=")) {
            this.addOneToken(24 /* GREATER_EQUAL */);
          } else if (this.match(">")) {
            if (this.match(">")) {
              if (this.match("=")) {
                this.addOneToken(36 /* UNSIGNED_RIGHT_SHIFT_EQUAL */);
              } else {
                this.addOneToken(73 /* UNSIGNED_RIGHT_SHIFT */);
              }
            } else if (this.match("=")) {
              this.addOneToken(35 /* RIGHT_SHIFT_EQUAL */);
            } else {
              this.addOneToken(72 /* RIGHT_SHIFT */);
            }
          } else {
            this.addOneToken(23 /* GREATER */);
          }
          break;
        case "<":
          if (this.match("=")) {
            this.addOneToken(26 /* LESS_EQUAL */);
          } else if (this.match("<")) {
            if (this.match("=")) {
              this.addOneToken(34 /* LEFT_SHIFT_EQUAL */);
            } else {
              this.addOneToken(71 /* LEFT_SHIFT */);
            }
          } else {
            this.addOneToken(25 /* LESS */);
          }
          break;
        case "/":
          if (this.match("/")) {
            while (this.peek() !== "\n" && !this.isAtEnd()) {
              this.advance();
            }
          } else if (this.match("*")) {
            while (!(this.peek() === "*" && this.peekNext() === "/" || this.isAtEnd())) {
              this.advance();
              if (this.peek() === "\n") {
                this.line++;
              }
            }
            if (this.peekNext() !== "/") {
              this.addError(this.line, "multiple line comment end error");
            }
            this.advance();
            this.advance();
          } else if (this.match("=")) {
            this.addOneToken(31 /* SLASH_EQUAL */);
          } else {
            this.addOneToken(14 /* SLASH */);
          }
          break;
        case "|":
          if (this.match("|")) {
            if (this.match("=")) {
              this.addOneToken(42 /* OR_EQUAL */);
            } else {
              this.addOneToken(55 /* OR */);
            }
          } else if (this.match("=")) {
            this.addOneToken(40 /* BIT_OR_EQUAL */);
          } else {
            this.addOneToken(57 /* BIT_OR */);
          }
          break;
        case "^":
          if (this.match("=")) {
            this.addOneToken(39 /* BIT_X_OR_EQUAL */);
          } else {
            this.addOneToken(58 /* BIT_X_OR */);
          }
          break;
        case "~":
          this.addOneToken(59 /* BIT_NOT */);
          break;
        case "&":
          if (this.match("&")) {
            if (this.match("=")) {
              this.addOneToken(41 /* AND_EQUAL */);
            } else {
              this.addOneToken(54 /* AND */);
            }
          } else if (this.match("=")) {
            this.addOneToken(38 /* BIT_AND_EQUAL */);
          } else {
            this.addOneToken(56 /* BIT_AND */);
          }
          break;
        case " ":
        case "\r":
        case "	":
          break;
        case "\n":
          this.line++;
          break;
        case '"':
          this.string(c);
          break;
        case "'":
          this.string(c);
          break;
        default:
          if (this.isDigit(c)) {
            this.number();
          } else if (this.identifierChar(c)) {
            this.identifier();
          } else {
            this.addError(this.line, `Unexpected character: ${c}`);
          }
          break;
      }
    }
    string(splitter) {
      while (this.peek() !== splitter && !this.isAtEnd()) {
        if (this.peek() === "\n") {
          this.line++;
        }
        this.advance();
      }
      if (this.isAtEnd()) {
        this.addError(this.line, "Unterminated string");
        return;
      }
      this.advance();
      const value = this.substr(this.start + 1, this.current - 1);
      this.addOneToken(44 /* STRING */, value);
    }
    number() {
      while (this.isDigit(this.peek())) {
        this.advance();
      }
      if (this.peek() === "." && this.isDigit(this.peekNext())) {
        this.advance();
        while (this.isDigit(this.peek())) {
          this.advance();
        }
      }
      this.addOneToken(45 /* NUMBER */);
    }
    identifier() {
      while (this.identifierChar(this.peek())) {
        this.advance();
      }
      const text = this.substr();
      const temp = KEYWORD_MAP.get(text);
      let type = 43 /* IDENTIFIER */;
      if (temp !== void 0) {
        type = temp;
      }
      this.addOneToken(type);
    }
    identifierChar(c) {
      const temp = `()[]{},.=-*/%!&<>|';":`;
      return !(this.isWhiteSpace(c) || temp.includes(c));
    }
    isWhiteSpace(c) {
      return c === " " || c === "\r" || c === "\n" || c === "	";
    }
    isDigit(char) {
      return char >= "0" && char <= "9";
    }
  };
  var scanner_default = Scanner;

  // src/util.ts
  function convertLiteralTypeToString(val) {
    if (val === null) {
      return "null";
    }
    if (val === void 0) {
      return "undefined";
    }
    if (typeof val === "string") {
      return val;
    }
    if (typeof val === "boolean") {
      return val.toString();
    }
    if (typeof val === "number") {
      return val.toString();
    }
    if (val && typeof val.toString === "function") {
      return val.toString();
    }
    return "";
  }
  function isFunction(fun) {
    return typeof fun === "function";
  }
  function isBaseCallable(call) {
    return call && isFunction(call.toString) && isFunction(call.call);
  }
  function getNodeEnv() {
    return "production";
  }
  function isTestEnv() {
    return getNodeEnv() === "test";
  }
  function assert(condition, message = "assert error") {
    if (!condition) {
      if (getNodeEnv() === "production") {
        console.error(message);
        return;
      }
      throw new Error(message);
    }
  }
  function isObject(obj) {
    return obj && typeof obj === "object";
  }

  // src/expression.ts
  var NewExpression = class {
    constructor(callee) {
      this.callee = callee;
    }
    accept(visitor) {
      return visitor.visitNewExpression(this);
    }
    toString() {
      return `new ${this.callee.toString()}`;
    }
  };
  var AssignExpression = class {
    constructor(left, right) {
      this.left = left;
      this.right = right;
    }
    accept(visitor) {
      return visitor.visitAssignExpression(this);
    }
    toString() {
      return `${this.left.toString()} = ${this.right.toString()}`;
    }
  };
  var BinaryExpression = class {
    constructor(left, operator, right) {
      this.left = left;
      this.operator = operator;
      this.right = right;
    }
    accept(visitor) {
      return visitor.visitBinaryExpression(this);
    }
    toString() {
      const temp = `${this.left.toString()} ${this.operator.toString()} ${this.right.toString()}`;
      if (isTestEnv()) {
        return `(${temp})`;
      }
      return temp;
    }
  };
  var CallExpression = class {
    constructor(callee, argumentList) {
      this.callee = callee;
      this.argumentList = argumentList;
    }
    accept(visitor) {
      return visitor.visitCallExpression(this);
    }
    toString() {
      return `${this.callee.toString()}(${this.argumentList.map((item) => item.toString()).join(",")})`;
    }
  };
  var GetExpression = class {
    constructor(object, property) {
      this.object = object;
      this.property = property;
    }
    accept(visitor) {
      return visitor.visitGetExpression(this);
    }
    toString() {
      return `${this.object.toString()}.${this.property.toString()}`;
    }
  };
  var SetExpression = class {
    constructor(object, value) {
      this.object = object;
      this.value = value;
    }
    accept(visitor) {
      return visitor.visitSetExpression(this);
    }
    toString() {
      return `${this.object.toString()} = ${this.value.toString()}`;
    }
  };
  var GroupingExpression = class {
    constructor(expression) {
      this.expression = expression;
    }
    accept(visitor) {
      return visitor.visitGroupingExpression(this);
    }
    toString() {
      return `(${this.expression.toString()})`;
    }
  };
  var LiteralExpression = class {
    constructor(value) {
      this.value = value;
    }
    accept(visitor) {
      return visitor.visitLiteralExpression(this);
    }
    toString() {
      if (typeof this.value === "string") {
        return `'${this.value}'`;
      }
      return convertLiteralTypeToString(this.value);
    }
  };
  var LogicalExpression = class {
    constructor(left, operator, right) {
      this.left = left;
      this.operator = operator;
      this.right = right;
    }
    accept(visitor) {
      return visitor.visitLogicalExpression(this);
    }
    toString() {
      return `${this.left.toString()} ${this.operator.toString()} ${this.right.toString()}`;
    }
  };
  var UnaryExpression = class {
    constructor(operator, right) {
      this.operator = operator;
      this.right = right;
    }
    accept(visitor) {
      return visitor.visitUnaryExpression(this);
    }
    toString() {
      const temp = `${this.operator.toString()}${this.right.toString()}`;
      if (isTestEnv()) {
        return `(${temp})`;
      }
      return temp;
    }
  };
  var VariableExpression = class {
    constructor(name) {
      this.name = name;
    }
    accept(visitor) {
      return visitor.visitVariableExpression(this);
    }
    toString() {
      return this.name.toString();
    }
  };
  var FunctionExpression = class {
    constructor(name, body, params) {
      this.name = name;
      this.body = body;
      this.params = params;
    }
    accept(visitor) {
      return visitor.visitFunctionExpression(this);
    }
    toString() {
      return `function ${this.name === null ? "" : this.name.toString()}(${this.params.map((item) => item.toString()).join(",")})${this.body.toString()}`;
    }
  };
  var ArrayLiteralExpression = class {
    constructor(elements) {
      this.elements = elements;
    }
    accept(visitor) {
      return visitor.visitArrayLiteralExpression(this);
    }
    toString() {
      return `[${this.elements.map((item) => item.toString()).join(",")}]`;
    }
  };
  var ObjectLiteralExpression = class {
    constructor(properties) {
      this.properties = properties;
    }
    accept(visitor) {
      return visitor.visitObjectLiteralExpression(this);
    }
    toString() {
      return `{${this.properties.map(
        (item) => `${item.key.toString()}:${item.value.toString()}`
      )}}`;
    }
  };
  var TokenExpression = class {
    constructor(token) {
      this.token = token;
    }
    accept(visitor) {
      return visitor.visitTokenExpression(this);
    }
    toString() {
      return this.token.toString();
    }
  };
  var ClassExpression = class {
    constructor(name, superClass, methods) {
      this.name = name;
      this.superClass = superClass;
      this.methods = methods;
    }
    accept(visitor) {
      return visitor.visitClassExpression(this);
    }
    toString() {
      return `class ${this.name === null ? "" : this.name.toString()}{${this.methods.map((item) => {
        const temp = item.toString();
        const index = temp.indexOf(" ");
        return temp.slice(index + 1);
      }).join("")}}`;
    }
  };

  // src/statement.ts
  var BlockStatement = class {
    constructor(statements) {
      this.statements = statements;
    }
    accept(visitor) {
      return visitor.visitBlockStatement(this);
    }
    toString() {
      return `{${this.statements.map((item) => item.toString()).join("")}}`;
    }
  };
  var ClassStatement = class {
    constructor(name, superClass, methods) {
      this.name = name;
      this.superClass = superClass;
      this.methods = methods;
    }
    accept(visitor) {
      return visitor.visitClassStatement(this);
    }
    toString() {
      return `class ${this.name.toString()}{${this.methods.map((item) => {
        const temp = item.toString();
        const index = temp.indexOf(" ");
        return temp.slice(index + 1);
      }).join("")}}`;
    }
  };
  var ExpressionStatement = class {
    constructor(expression) {
      this.expression = expression;
    }
    accept(visitor) {
      return visitor.visitExpressionStatement(this);
    }
    toString() {
      return this.expression.toString() + ";";
    }
  };
  var FunctionStatement = class {
    constructor(name, body, params, isStatic = false) {
      this.name = name;
      this.body = body;
      this.params = params;
      this.static = isStatic;
    }
    accept(visitor) {
      return visitor.visitFunctionStatement(this);
    }
    toString() {
      return `function ${this.static ? "static " : ""}${this.name.toString()}(${this.params.map((item) => item.toString()).join(",")})${this.body.toString()}`;
    }
  };
  var IfStatement = class {
    constructor(condition, thenBranch, elseBranch) {
      this.condition = condition;
      this.thenBranch = thenBranch;
      this.elseBranch = elseBranch;
    }
    accept(visitor) {
      return visitor.visitIfStatement(this);
    }
    toString() {
      const temp = `if(${this.condition.toString()})${this.thenBranch.toString()}`;
      if (this.elseBranch === null) {
        return temp;
      }
      return `${temp} else ${this.elseBranch.toString()}`;
    }
  };
  var ReturnStatement = class {
    constructor(argument) {
      this.argument = argument;
    }
    accept(visitor) {
      return visitor.visitReturnStatement(this);
    }
    toString() {
      return `return ${this.argument === null ? "" : this.argument.toString()};`;
    }
  };
  var VariableStatement = class {
    constructor(name, initializer, isStatic = false) {
      this.name = name;
      this.initializer = initializer;
      this.static = isStatic;
    }
    accept(visitor) {
      return visitor.visitVariableStatement(this);
    }
    toString() {
      const temp = `var ${this.static ? "static " : ""}${this.name.toString()}`;
      if (this.initializer === null) {
        return temp + ";";
      }
      return `${temp} = ${this.initializer.toString()};`;
    }
  };
  var WhileStatement = class {
    constructor(condition, body) {
      this.condition = condition;
      this.body = body;
    }
    accept(visitor) {
      return visitor.visitWhileStatement(this);
    }
    toString() {
      return `while(${this.condition.toString()})${this.body.toString()}`;
    }
  };

  // src/parser.ts
  var assignmentMap = /* @__PURE__ */ new Map([
    [28 /* PLUS_EQUAL */, 11 /* PLUS */],
    [28 /* PLUS_EQUAL */, 11 /* PLUS */],
    [29 /* MINUS_EQUAL */, 9 /* MINUS */],
    [32 /* STAR_STAR_EQUAL */, 16 /* STAR_STAR */],
    [30 /* STAR_EQUAL */, 15 /* STAR */],
    [31 /* SLASH_EQUAL */, 14 /* SLASH */],
    [33 /* REMAINDER_EQUAL */, 17 /* REMAINDER */],
    [34 /* LEFT_SHIFT_EQUAL */, 71 /* LEFT_SHIFT */],
    [35 /* RIGHT_SHIFT_EQUAL */, 72 /* RIGHT_SHIFT */],
    [36 /* UNSIGNED_RIGHT_SHIFT_EQUAL */, 73 /* UNSIGNED_RIGHT_SHIFT */],
    [38 /* BIT_AND_EQUAL */, 56 /* BIT_AND */],
    [39 /* BIT_X_OR_EQUAL */, 58 /* BIT_X_OR */],
    [40 /* BIT_OR_EQUAL */, 57 /* BIT_OR */],
    [42 /* OR_EQUAL */, 55 /* OR */],
    [41 /* AND_EQUAL */, 54 /* AND */],
    [37 /* NULLISH_COALESCING_EQUAL */, 80 /* NULLISH_COALESCING */]
  ]);
  var Parser = class {
    constructor(tokens) {
      this.current = 0;
      this.parse = () => {
        const statements = [];
        while (!this.isAtEnd()) {
          statements.push(this.declaration());
        }
        return statements;
      };
      this.tokens = tokens;
    }
    declaration() {
      if (this.match(63 /* VAR */)) {
        return this.varDeclaration();
      }
      if (this.match(46 /* CLASS */)) {
        const className = this.consume(43 /* IDENTIFIER */, "expect class name");
        const { superClass, methods } = this.getClassBody();
        return new ClassStatement(className, superClass, methods);
      }
      if (this.match(50 /* FUNCTION */)) {
        return this.functionDeclaration("Function");
      }
      return this.statement();
    }
    getClassBody() {
      let superClass = null;
      if (this.match(70 /* EXTENDS */)) {
        const name = this.consume(43 /* IDENTIFIER */, "expect class");
        superClass = new VariableExpression(name);
      }
      this.consume(2 /* lEFT_BRACE */, "expect {");
      let methods = [];
      while (!this.isAtEnd() && !this.check(3 /* RIGHT_BRACE */)) {
        const isStatic = this.match(67 /* STATIC */);
        if (this.checkNext(0 /* LEFT_BRACKET */)) {
          methods.push(this.functionDeclaration("Class", isStatic));
        } else {
          methods.push(this.varDeclaration(isStatic));
        }
      }
      this.consume(3 /* RIGHT_BRACE */, "expect }");
      return {
        superClass,
        methods
      };
    }
    varDeclaration(isStatic = false) {
      const name = this.consume(
        43 /* IDENTIFIER */,
        "expect identifier after var"
      );
      let initializer = null;
      if (this.match(27 /* EQUAL */)) {
        initializer = this.expression();
      }
      this.match(13 /* SEMICOLON */);
      return new VariableStatement(name, initializer, isStatic);
    }
    functionDeclaration(name, isStatic = false) {
      const message = `${name} statements require a function name`;
      let functionName;
      if (name === "Function") {
        functionName = this.consume(43 /* IDENTIFIER */, message);
      } else {
        functionName = this.consumeName(message);
      }
      const params = this.getTokens(name);
      this.consume(2 /* lEFT_BRACE */, "expect { after function parameters");
      const block = this.blockStatement();
      return new FunctionStatement(functionName, block, params, isStatic);
    }
    statement() {
      if (this.match(52 /* IF */)) {
        return this.ifStatement();
      }
      if (this.match(64 /* WHILE */)) {
        return this.whileStatement();
      }
      if (this.match(65 /* DO_WHILE */)) {
        return this.doWhileStatement();
      }
      if (this.match(51 /* FOR */)) {
        return this.forStatement();
      }
      if (this.match(2 /* lEFT_BRACE */)) {
        return this.blockStatement();
      }
      if (this.match(60 /* RETURN */)) {
        return this.returnStatement();
      }
      return this.expressionStatement();
    }
    forStatement() {
      this.consume(0 /* LEFT_BRACKET */, "expect (");
      var initializer = null;
      if (this.match(63 /* VAR */)) {
        initializer = this.varDeclaration();
      } else if (!this.check(13 /* SEMICOLON */)) {
        initializer = this.expressionStatement();
      } else {
        this.consume(13 /* SEMICOLON */, "expect ; after initializer");
      }
      let condition = new LiteralExpression(true);
      if (!this.check(13 /* SEMICOLON */)) {
        condition = this.expression();
      }
      this.consume(13 /* SEMICOLON */, "expect ; after for condition");
      let end = null;
      if (!this.check(1 /* RIGHT_BRACKET */)) {
        end = this.expression();
      }
      this.consume(1 /* RIGHT_BRACKET */, "expect )");
      const body = this.statement();
      const list = [body];
      if (end !== null) {
        list.push(new ExpressionStatement(end));
      }
      const whileBody = new BlockStatement(list);
      const whileStatement = new WhileStatement(condition, whileBody);
      const statements = [];
      if (initializer !== null) {
        statements.push(initializer);
      }
      statements.push(whileStatement);
      return new BlockStatement(statements);
    }
    doWhileStatement() {
      this.consume(2 /* lEFT_BRACE */, "expect {");
      const body = this.blockStatement();
      this.consume(64 /* WHILE */, "expect while");
      this.consume(0 /* LEFT_BRACKET */, "expect (");
      const expr = this.expression();
      this.consume(1 /* RIGHT_BRACKET */, "expect )");
      const value = new WhileStatement(expr, body);
      return new BlockStatement([body, value]);
    }
    returnStatement() {
      let value = null;
      if (!this.check(13 /* SEMICOLON */)) {
        value = this.expression();
      }
      this.match(13 /* SEMICOLON */);
      return new ReturnStatement(value);
    }
    whileStatement() {
      this.consume(0 /* LEFT_BRACKET */, "expect ( after while");
      const expression = this.expression();
      this.consume(1 /* RIGHT_BRACKET */, "expect ) after while");
      const body = this.statement();
      return new WhileStatement(expression, body);
    }
    ifStatement() {
      this.consume(0 /* LEFT_BRACKET */, "expect ( after if");
      const expression = this.expression();
      this.consume(1 /* RIGHT_BRACKET */, "expect ) after if");
      const thenBranch = this.statement();
      let elseBranch = null;
      if (this.match(47 /* ELSE */)) {
        elseBranch = this.statement();
      }
      return new IfStatement(expression, thenBranch, elseBranch);
    }
    blockStatement() {
      const statements = [];
      while (!this.check(3 /* RIGHT_BRACE */) && !this.isAtEnd()) {
        statements.push(this.declaration());
      }
      this.consume(3 /* RIGHT_BRACE */, "expect } after block");
      return new BlockStatement(statements);
    }
    expressionStatement() {
      const expr = this.expression();
      this.match(13 /* SEMICOLON */);
      return new ExpressionStatement(expr);
    }
    expression() {
      return this.assignment();
    }
    assignment() {
      const expr = this.or();
      if (this.match(27 /* EQUAL */, ...assignmentMap.keys())) {
        const equal = this.previous();
        let value = this.assignment();
        const temp = assignmentMap.get(equal.type);
        if (temp) {
          const operator = new token_default(
            temp,
            equal.lexeme.replace("=", ""),
            equal.line
          );
          if (equal.type === 41 /* AND_EQUAL */ || equal.type === 42 /* OR_EQUAL */ || equal.type === 37 /* NULLISH_COALESCING_EQUAL */) {
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
    or() {
      let expr = this.and();
      while (this.match(55 /* OR */, 80 /* NULLISH_COALESCING */)) {
        const operator = this.previous();
        const right = this.and();
        expr = new LogicalExpression(expr, operator, right);
      }
      return expr;
    }
    and() {
      let expr = this.bitOr();
      while (this.match(54 /* AND */)) {
        const operator = this.previous();
        const right = this.bitOr();
        expr = new LogicalExpression(expr, operator, right);
      }
      return expr;
    }
    bitOr() {
      let expr = this.bitXOr();
      while (this.match(57 /* BIT_OR */)) {
        const operator = this.previous();
        const right = this.bitXOr();
        expr = new BinaryExpression(expr, operator, right);
      }
      return expr;
    }
    bitXOr() {
      let expr = this.bitAnd();
      while (this.match(58 /* BIT_X_OR */)) {
        const operator = this.previous();
        const right = this.bitAnd();
        expr = new BinaryExpression(expr, operator, right);
      }
      return expr;
    }
    bitAnd() {
      let expr = this.equality();
      while (this.match(56 /* BIT_AND */)) {
        const operator = this.previous();
        const right = this.equality();
        expr = new BinaryExpression(expr, operator, right);
      }
      return expr;
    }
    equality() {
      let expr = this.comparison();
      while (this.match(
        19 /* BANG_EQUAL */,
        20 /* BANG_EQUAL_EQUAL */,
        21 /* EQUAL_EQUAL */,
        22 /* EQUAL_EQUAL_EQUAL */
      )) {
        const operator = this.previous();
        const right = this.comparison();
        expr = new BinaryExpression(expr, operator, right);
      }
      return expr;
    }
    comparison() {
      let bitwiseShift = this.bitwiseShift();
      while (this.match(
        23 /* GREATER */,
        24 /* GREATER_EQUAL */,
        25 /* LESS */,
        26 /* LESS_EQUAL */,
        77 /* IN */,
        78 /* INSTANCE_OF */
      )) {
        const operator = this.previous();
        const right = this.bitwiseShift();
        bitwiseShift = new BinaryExpression(bitwiseShift, operator, right);
      }
      return bitwiseShift;
    }
    bitwiseShift() {
      let term = this.term();
      while (this.match(
        71 /* LEFT_SHIFT */,
        72 /* RIGHT_SHIFT */,
        73 /* UNSIGNED_RIGHT_SHIFT */
      )) {
        const operator = this.previous();
        const right = this.term();
        term = new BinaryExpression(term, operator, right);
      }
      return term;
    }
    term() {
      let factor = this.factor();
      while (this.match(11 /* PLUS */, 9 /* MINUS */)) {
        const operator = this.previous();
        const right = this.factor();
        factor = new BinaryExpression(factor, operator, right);
      }
      return factor;
    }
    factor() {
      let exponentiation = this.exponentiation();
      while (this.match(15 /* STAR */, 14 /* SLASH */, 17 /* REMAINDER */)) {
        const operator = this.previous();
        const right = this.exponentiation();
        exponentiation = new BinaryExpression(exponentiation, operator, right);
      }
      return exponentiation;
    }
    exponentiation() {
      let unary = this.unary();
      while (this.match(16 /* STAR_STAR */)) {
        const operator = this.previous();
        const right = this.exponentiation();
        unary = new BinaryExpression(unary, operator, right);
      }
      return unary;
    }
    unary() {
      if (this.match(
        18 /* BANG */,
        59 /* BIT_NOT */,
        9 /* MINUS */,
        11 /* PLUS */,
        12 /* PLUS_PLUS */,
        10 /* MINUS_MINUS */,
        74 /* TYPEOF */,
        76 /* VOID */,
        75 /* DELETE */
      )) {
        const operator = this.previous();
        const value = this.unary();
        return new UnaryExpression(operator, value);
      }
      return this.newExpression();
    }
    newExpression() {
      if (this.match(66 /* NEW */)) {
        return new NewExpression(this.call());
      }
      return this.call();
    }
    call() {
      let expr = this.primary();
      while (true) {
        if (this.match(0 /* LEFT_BRACKET */)) {
          expr = this.finishCall(expr);
        } else if (this.match(7 /* DOT */)) {
          const property = this.consumeName("expect name");
          expr = new GetExpression(expr, new TokenExpression(property));
        } else if (this.match(4 /* LEFT_SQUARE_BRACKET */)) {
          const property = this.expression();
          this.consume(5 /* RIGHT_SQUARE_BRACKET */, "expect ]");
          expr = new GetExpression(expr, property);
        } else {
          break;
        }
      }
      return expr;
    }
    getExpressions(tokenType) {
      const params = [];
      if (!this.check(tokenType)) {
        do {
          params.push(this.expression());
        } while (this.match(6 /* COMMA */));
      }
      return params;
    }
    finishCall(callee) {
      const params = this.getExpressions(1 /* RIGHT_BRACKET */);
      this.consume(1 /* RIGHT_BRACKET */, "expect ) after arguments");
      return new CallExpression(callee, params);
    }
    getTokens(name) {
      const params = [];
      this.consume(0 /* LEFT_BRACKET */, `expect ( after ${name}`);
      if (!this.check(1 /* RIGHT_BRACKET */)) {
        do {
          params.push(
            this.consume(43 /* IDENTIFIER */, "expect parameter name")
          );
        } while (this.match(6 /* COMMA */));
      }
      this.consume(1 /* RIGHT_BRACKET */, `expect ) after ${name}`);
      return params;
    }
    functionExpression() {
      let functionName = null;
      if (this.match(43 /* IDENTIFIER */)) {
        functionName = this.previous();
      }
      const params = this.getTokens("expression");
      this.consume(2 /* lEFT_BRACE */, "expect { after function parameters");
      const block = this.blockStatement();
      return new FunctionExpression(functionName, block, params);
    }
    classExpression() {
      let name = null;
      if (this.match(43 /* IDENTIFIER */)) {
        name = this.previous();
      }
      const { superClass, methods } = this.getClassBody();
      return new ClassExpression(name, superClass, methods);
    }
    primary() {
      if (this.match(49 /* TRUE */)) {
        return new LiteralExpression(true);
      }
      if (this.match(48 /* FALSE */)) {
        return new LiteralExpression(false);
      }
      if (this.match(69 /* UNDEFINED */)) {
        return new LiteralExpression(void 0);
      }
      if (this.match(53 /* NULL */)) {
        return new LiteralExpression(null);
      }
      if (this.match(45 /* NUMBER */)) {
        return new LiteralExpression(parseFloat(this.previous().lexeme));
      }
      if (this.match(44 /* STRING */)) {
        return new LiteralExpression(this.previous().lexeme);
      }
      if (this.match(43 /* IDENTIFIER */)) {
        return new VariableExpression(this.previous());
      }
      if (this.match(0 /* LEFT_BRACKET */)) {
        const expr = this.expression();
        this.consume(
          1 /* RIGHT_BRACKET */,
          `parser expected: '(',actual: ${this.peek().toString()}`
        );
        return new GroupingExpression(expr);
      }
      if (this.match(50 /* FUNCTION */)) {
        return this.functionExpression();
      }
      if (this.match(46 /* CLASS */)) {
        return this.classExpression();
      }
      if (this.match(4 /* LEFT_SQUARE_BRACKET */)) {
        const value = this.getExpressions(5 /* RIGHT_SQUARE_BRACKET */);
        this.consume(5 /* RIGHT_SQUARE_BRACKET */, "expect ]");
        return new ArrayLiteralExpression(value);
      }
      if (this.match(2 /* lEFT_BRACE */)) {
        const valueList = [];
        if (!this.check(3 /* RIGHT_BRACE */)) {
          do {
            if (this.check(3 /* RIGHT_BRACE */)) {
              break;
            }
            const key = this.consumeName("expect key");
            this.consume(8 /* COLON */, "expect :");
            const value = this.expression();
            valueList.push({ key: new TokenExpression(key), value });
          } while (this.match(6 /* COMMA */));
        }
        this.consume(3 /* RIGHT_BRACE */, "expect }");
        return new ObjectLiteralExpression(valueList);
      }
      throw new Error(`parser can not handle token: ${this.peek().toString()}`);
    }
    consume(type, message) {
      if (this.peek().type === type) {
        this.advance();
        return this.previous();
      }
      throw new Error(message);
    }
    consumeName(message) {
      const list = Array.from(KEYWORD_MAP.values());
      list.push(43 /* IDENTIFIER */);
      return this.consumes(message, ...list);
    }
    consumes(message, ...types) {
      const type = this.peek().type;
      if (types.some((v) => v === type)) {
        this.advance();
        return this.previous();
      }
      throw new Error(message);
    }
    previous() {
      return this.tokens[this.current - 1];
    }
    match(...types) {
      for (let type of types) {
        if (this.check(type)) {
          this.advance();
          return true;
        }
      }
      return false;
    }
    advance() {
      if (this.isAtEnd()) {
        return;
      }
      this.current++;
    }
    check(type) {
      if (this.isAtEnd()) {
        return false;
      }
      return this.peek().type === type;
    }
    checkNext(type) {
      if (this.isAtEnd()) {
        return false;
      }
      return this.tokens[this.current + 1].type === type;
    }
    isAtEnd() {
      return this.peek().type === 81 /* EOF */;
    }
    peek() {
      return this.tokens[this.current];
    }
  };
  var parser_default = Parser;

  // src/environment.ts
  var EnvironmentImpl = class {
    constructor(parent) {
      this.values = /* @__PURE__ */ new Map();
      this.parent = null;
      this.parent = parent;
    }
    get(name) {
      if (this.values.has(name)) {
        return this.values.get(name);
      }
      if (this.parent !== null) {
        return this.parent.get(name);
      }
      return void 0;
    }
    define(name, value) {
      this.values.set(name, value);
    }
    assign(name, value) {
      if (this.values.has(name)) {
        this.values.set(name, value);
        return;
      }
      if (this.parent !== null) {
        this.parent.assign(name, value);
        return;
      }
      this.values.set(name, value);
    }
  };
  var environment_default = EnvironmentImpl;

  // src/function.ts
  var FunctionObject = class {
    constructor(declaration, closure) {
      this.declaration = declaration;
      this.closure = closure;
    }
    call(interpreter, argumentList) {
      const env = new environment_default(this.closure);
      if (this.declaration instanceof FunctionExpression && this.declaration.name !== null) {
        env.define(this.declaration.name.lexeme, this);
      }
      for (let i = 0; i < this.declaration.params.length; i++) {
        env.define(this.declaration.params[i]?.lexeme, argumentList[i]);
      }
      return interpreter.executeBlock(this.declaration.body, env);
    }
    toString() {
      return this.declaration.toString();
    }
  };

  // src/return.ts
  var ReturnValue = class {
    constructor(value) {
      this.value = value;
    }
  };

  // src/class.ts
  var ClassObject = class _ClassObject {
    constructor(statement) {
      this.staticMethods = {};
      this.statement = statement;
    }
    call(interpreter, argumentList) {
      const instance = {};
      const env = new environment_default(interpreter.environment);
      if (this.statement instanceof ClassExpression && this.statement.name !== null) {
        env.define(this.statement.name.lexeme, this);
      }
      if (this.statement.superClass !== null) {
        const temp = interpreter.evaluate(this.statement.superClass);
        if (temp instanceof _ClassObject) {
          const superData = {
            call(interpreter2, argumentList2) {
              const originInstance = temp.call(interpreter2, argumentList2);
              for (const key of Object.keys(originInstance)) {
                instance[key] = originInstance[key];
              }
            },
            toString() {
              return "super";
            }
          };
          env.define("super", superData);
        } else {
          throw new Error(
            `Class extends value ${temp} is not a constructor or null`
          );
        }
      }
      env.define("this", instance);
      for (const item of this.statement.methods) {
        if (item.static) {
          continue;
        }
        if (item instanceof FunctionStatement) {
          if (item.name.lexeme === "constructor") {
            const temp = new FunctionObject(item, env);
            temp.call(interpreter, argumentList);
          } else {
            instance[item.name.lexeme] = new FunctionObject(item, env);
          }
        } else {
          let temp = null;
          if (item.initializer != null) {
            temp = interpreter.evaluate(item.initializer);
          }
          instance[item.name.lexeme] = temp;
        }
      }
      return instance;
    }
    toString() {
      return this.statement.toString();
    }
  };

  // src/interpreter.ts
  var InterpreterImpl = class {
    constructor(statements, environment) {
      this.calleeKey = "";
      this.calleeValue = void 0;
      this.interpret = () => {
        let result = null;
        for (const item of this.statements) {
          result = this.execute(item);
          if (result instanceof ReturnValue) {
            return result.value;
          }
        }
        return result;
      };
      this.execute = (statement) => {
        return statement.accept(this);
      };
      this.evaluate = (expr) => {
        const result = expr.accept(this);
        if (result instanceof ReturnValue) {
          return result.value;
        }
        return result;
      };
      this.visitClass = (expression) => {
        const instance = new ClassObject(expression);
        if (expression.superClass !== null) {
          const temp = this.evaluate(expression.superClass);
          if (temp instanceof ClassObject) {
            for (const key of Object.keys(temp.staticMethods)) {
              instance.staticMethods[key] = temp.staticMethods[key];
            }
          } else {
            throw new Error(
              `Class extends value ${temp} is not a constructor or null`
            );
          }
        }
        for (const item of expression.methods) {
          if (item.static) {
            let temp = null;
            if (item instanceof FunctionStatement) {
              temp = new FunctionObject(item, this.environment);
            } else {
              if (item.initializer != null) {
                temp = this.evaluate(item.initializer);
              }
            }
            instance.staticMethods[item.name.lexeme] = temp;
          }
        }
        return instance;
      };
      this.visitExpressionStatement = (statement) => {
        return this.evaluate(statement.expression);
      };
      this.visitBlockStatement = (statement) => {
        return this.executeBlock(statement, this.environment);
      };
      this.executeBlock = (statement, environment) => {
        const previous = this.environment;
        let result = null;
        this.environment = environment;
        for (let item of statement.statements) {
          result = this.execute(item);
          if (result instanceof ReturnValue) {
            this.environment = previous;
            return result;
          }
        }
        this.environment = previous;
        return result;
      };
      this.visitClassStatement = (statement) => {
        const instance = this.visitClass(statement);
        this.environment.define(statement.name.lexeme, instance);
        return null;
      };
      this.visitNewExpression = (expression) => {
        const classObject = this.evaluate(expression.callee);
        assert(
          isObject(classObject),
          `Class constructor ${expression.callee.toString()} cannot be invoked without 'new'`
        );
        return classObject;
      };
      this.visitFunctionStatement = (statement) => {
        this.environment.define(
          statement.name.lexeme,
          new FunctionObject(statement, this.environment)
        );
        return null;
      };
      this.visitFunctionExpression = (expression) => {
        return new FunctionObject(expression, this.environment);
      };
      this.visitCallExpression = (expr) => {
        const callee = this.evaluate(expr.callee);
        const argumentList = [];
        for (let item of expr.argumentList) {
          argumentList.push(this.evaluate(item));
        }
        if (!isBaseCallable(callee)) {
          throw new Error("can only call functions");
        }
        return callee.call(this, argumentList);
      };
      this.visitIfStatement = (statement) => {
        let result = null;
        if (this.isTruthy(this.evaluate(statement.condition))) {
          result = this.execute(statement.thenBranch);
        } else if (statement.elseBranch) {
          result = this.execute(statement.elseBranch);
        }
        if (result instanceof ReturnValue) {
          return result;
        }
        return null;
      };
      this.visitReturnStatement = (statement) => {
        let result = void 0;
        if (statement.argument !== null) {
          result = this.evaluate(statement.argument);
        }
        return new ReturnValue(result);
      };
      this.visitVariableStatement = (statement) => {
        let value = null;
        if (statement.initializer !== null) {
          value = this.evaluate(statement.initializer);
        }
        this.environment.define(statement.name.lexeme, value);
        return null;
      };
      this.visitWhileStatement = (statement) => {
        while (this.isTruthy(this.evaluate(statement.condition))) {
          const result = this.execute(statement.body);
          if (result instanceof ReturnValue) {
            return result;
          }
        }
        return null;
      };
      this.visitAssignExpression = (expr) => {
        const temp = this.evaluate(expr.right);
        this.environment.assign(expr.left.lexeme, temp);
        return temp;
      };
      this.visitBinaryExpression = (expr) => {
        const left = this.evaluate(expr.left);
        const right = this.evaluate(expr.right);
        switch (expr.operator.type) {
          case 9 /* MINUS */:
            return left - right;
          case 11 /* PLUS */:
            return left + right;
          case 15 /* STAR */:
            return left * right;
          case 17 /* REMAINDER */:
            return left % right;
          case 14 /* SLASH */:
            return left / right;
          case 23 /* GREATER */:
            return left > right;
          case 24 /* GREATER_EQUAL */:
            return left >= right;
          case 25 /* LESS */:
            return left < right;
          case 26 /* LESS_EQUAL */:
            return left <= right;
          case 19 /* BANG_EQUAL */:
            return left != right;
          case 20 /* BANG_EQUAL_EQUAL */:
            return left !== right;
          case 21 /* EQUAL_EQUAL */:
            return left == right;
          case 22 /* EQUAL_EQUAL_EQUAL */:
            return left === right;
          case 71 /* LEFT_SHIFT */:
            return left << right;
          case 72 /* RIGHT_SHIFT */:
            return left >> right;
          case 73 /* UNSIGNED_RIGHT_SHIFT */:
            return left >>> right;
          case 16 /* STAR_STAR */:
            return left ** right;
          case 56 /* BIT_AND */:
            return left & right;
          case 57 /* BIT_OR */:
            return left | right;
          case 58 /* BIT_X_OR */:
            return left ^ right;
          case 77 /* IN */:
            return left in right;
          case 78 /* INSTANCE_OF */:
            return left instanceof right;
        }
        return null;
      };
      this.visitGetExpression = (expr) => {
        const callee = this.evaluate(expr.object);
        const key = this.evaluate(expr.property);
        this.calleeKey = key;
        if (callee instanceof ClassObject && key in callee.staticMethods) {
          this.calleeValue = callee.staticMethods;
          return callee.staticMethods[key];
        }
        this.calleeValue = callee;
        return callee[key];
      };
      this.visitSetExpression = (expr) => {
        this.calleeKey = "";
        this.calleeValue = void 0;
        this.evaluate(expr.object);
        const key = this.calleeKey;
        const callee = this.calleeValue;
        const value = this.evaluate(expr.value);
        if (callee && isObject(callee)) {
          callee[key] = value;
          return value;
        }
        throw new Error("error SetExpression");
      };
      this.visitLogicalExpression = (expr) => {
        const left = this.evaluate(expr.left);
        if (expr.operator.type === 55 /* OR */) {
          if (this.isTruthy(left)) {
            return left;
          }
        } else if (expr.operator.type === 54 /* AND */) {
          if (!this.isTruthy(left)) {
            return left;
          }
        } else if (expr.operator.type === 80 /* NULLISH_COALESCING */) {
          if (left !== null && left !== void 0) {
            return left;
          }
        } else {
          throw new Error(
            `can no handle logic operator: ${expr.operator.toString()}`
          );
        }
        return this.evaluate(expr.right);
      };
      this.visitSuperExpression = () => {
        return null;
      };
      this.visitThisExpression = () => {
        return null;
      };
      this.visitVariableExpression = (expr) => {
        return this.environment.get(expr.name.lexeme);
      };
      this.visitGroupingExpression = (expr) => {
        return this.evaluate(expr.expression);
      };
      this.visitLiteralExpression = (expr) => {
        return expr.value;
      };
      this.visitUnaryExpression = (expr) => {
        const isDelete = expr.operator.type === 75 /* DELETE */;
        if (isDelete) {
          this.calleeKey = "";
          this.calleeValue = void 0;
        }
        const right = this.evaluate(expr.right);
        switch (expr.operator.type) {
          case 9 /* MINUS */:
            return -right;
          case 11 /* PLUS */:
            return right;
          case 59 /* BIT_NOT */:
            return ~right;
          case 18 /* BANG */:
            return !this.isTruthy(right);
          case 74 /* TYPEOF */:
            return typeof right;
          case 75 /* DELETE */: {
            if (this.calleeValue === void 0) {
              throw new ReferenceError("is not defined");
            }
            return delete this.calleeValue[this.calleeKey];
          }
          case 76 /* VOID */:
            return void 0;
          case 12 /* PLUS_PLUS */:
          case 10 /* MINUS_MINUS */: {
            assert(
              expr.right instanceof VariableExpression,
              "Invalid left-hand side expression in prefix operation"
            );
            let result = right;
            if (expr.operator.type === 10 /* MINUS_MINUS */) {
              result--;
            } else {
              result++;
            }
            this.environment.assign(expr.right.name.lexeme, result);
            return result;
          }
        }
        return null;
      };
      this.visitArrayLiteralExpression = (expression) => {
        const value = expression.elements.map((item) => this.evaluate(item));
        return value;
      };
      this.visitObjectLiteralExpression = (expression) => {
        const instance = {};
        for (const item of expression.properties) {
          const key = this.evaluate(item.key);
          const value = this.evaluate(item.value);
          instance[key] = value;
        }
        return instance;
      };
      this.visitTokenExpression = (expression) => {
        return expression.token.lexeme;
      };
      this.visitClassExpression = (expression) => {
        return this.visitClass(expression);
      };
      this.environment = environment;
      this.statements = statements;
    }
    isTruthy(value) {
      if (value === null) {
        return false;
      }
      return Boolean(value);
    }
  };
  var interpreter_default = InterpreterImpl;

  // src/jsjs.ts
  function interpret(text, environment) {
    const scanner = new scanner_default(text);
    const tokens = scanner.scan();
    const parser = new parser_default(tokens);
    const statements = parser.parse();
    const interpreter = new interpreter_default(statements, environment);
    return interpreter.interpret();
  }

  // src/native.ts
  var consoleTypes = ["log", "error"];
  function getConsoleImplement(type, consoleObject) {
    return {
      call(_, argumentList) {
        const result = [];
        for (const item of argumentList) {
          if (isBaseCallable(item)) {
            result.push(item.toString());
          } else {
            result.push(item);
          }
        }
        consoleObject[type](...result);
      },
      toString() {
        return `function ${type}() { [native code] }`;
      }
    };
  }
  function getGlobalObject(consoleObject) {
    const consoleInstance = {};
    for (const type of consoleTypes) {
      consoleInstance[type] = getConsoleImplement(type, consoleObject);
    }
    return {
      console: consoleInstance
    };
  }
  return __toCommonJS(src_exports);
})();

    for(var key in __export__) {
            exports[key] = __export__[key]
        }
    }));
//# sourceMappingURL=jsjs.umd.js.map
