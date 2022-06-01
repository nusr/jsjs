package main

type BlockStatement struct {
	statements []Statement
}

func (blockStatement BlockStatement) accept(visitor StatementVisitor) LiteralType {
	return visitor.visitBlockStatement(blockStatement)
}

type ClassStatement struct {
	name       *Token
	superClass VariableExpression
	methods    []FunctionStatement
}

func (classStatement ClassStatement) accept(visitor StatementVisitor) LiteralType {
	return visitor.visitClassStatement(classStatement)
}

type ExpressionStatement struct {
	expression Expression
}

func (expressionStatement ExpressionStatement) accept(visitor StatementVisitor) LiteralType {
	return visitor.visitExpressionStatement(expressionStatement)
}

type FunctionStatement struct {
	name   *Token
	body   Statement
	params []Token
}

func (functionStatement FunctionStatement) accept(visitor StatementVisitor) LiteralType {
	return visitor.visitFunctionStatement(functionStatement)
}

type IfStatement struct {
	condition  Expression
	thenBranch Statement
	elseBranch Statement
}

func (ifStatement IfStatement) accept(visitor StatementVisitor) LiteralType {
	return visitor.visitIfStatement(ifStatement)
}

type PrintStatement struct {
	expression Expression
}

func (printStatement PrintStatement) accept(visitor StatementVisitor) LiteralType {
	return visitor.visitPrintStatement(printStatement)
}

type ReturnStatement struct {
	keyword *Token
	value   Expression
}

func (returnStatement ReturnStatement) accept(visitor StatementVisitor) LiteralType {
	return visitor.visitReturnStatement(returnStatement)
}

type VariableStatement struct {
	name        *Token
	initializer Expression
}

func (variableStatement VariableStatement) accept(visitor StatementVisitor) LiteralType {
	return visitor.visitVariableStatement(variableStatement)
}

type WhileStatement struct {
	condition Expression
	body      Statement
}

func (whileStatement WhileStatement) accept(visitor StatementVisitor) LiteralType {
	return visitor.visitWhileStatement(whileStatement)
}

type StatementVisitor interface {
	visitBlockStatement(statement BlockStatement) LiteralType
	visitClassStatement(statement ClassStatement) LiteralType
	visitExpressionStatement(statement ExpressionStatement) LiteralType
	visitFunctionStatement(statement FunctionStatement) LiteralType
	visitIfStatement(statement IfStatement) LiteralType
	visitPrintStatement(statement PrintStatement) LiteralType
	visitReturnStatement(statement ReturnStatement) LiteralType
	visitVariableStatement(statement VariableStatement) LiteralType
	visitWhileStatement(statement WhileStatement) LiteralType
}

type Statement interface {
	accept(visitor StatementVisitor) LiteralType
}
