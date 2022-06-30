package main

type BlockStatement struct {
	statements []Statement
}

func (blockStatement BlockStatement) accept(visitor StatementVisitor) any {
	return visitor.visitBlockStatement(blockStatement)
}

type ClassStatement struct {
	name       *Token
	superClass VariableExpression
	methods    []FunctionStatement
}

func (classStatement ClassStatement) accept(visitor StatementVisitor) any {
	return visitor.visitClassStatement(classStatement)
}

type ExpressionStatement struct {
	expression Expression
}

func (expressionStatement ExpressionStatement) accept(visitor StatementVisitor) any {
	return visitor.visitExpressionStatement(expressionStatement)
}

type FunctionStatement struct {
	name   *Token
	body   BlockStatement
	params []*Token
}

func (functionStatement FunctionStatement) accept(visitor StatementVisitor) any {
	return visitor.visitFunctionStatement(functionStatement)
}

type IfStatement struct {
	condition  Expression
	thenBranch Statement
	elseBranch Statement
}

func (ifStatement IfStatement) accept(visitor StatementVisitor) any {
	return visitor.visitIfStatement(ifStatement)
}

type PrintStatement struct {
	expression Expression
	comment    *Token
}

func (printStatement PrintStatement) accept(visitor StatementVisitor) any {
	return visitor.visitPrintStatement(printStatement)
}

type ReturnStatement struct {
	keyword *Token
	value   Expression
}

func (returnStatement ReturnStatement) accept(visitor StatementVisitor) any {
	return visitor.visitReturnStatement(returnStatement)
}

type VariableStatement struct {
	name        *Token
	initializer Expression
}

func (variableStatement VariableStatement) accept(visitor StatementVisitor) any {
	return visitor.visitVariableStatement(variableStatement)
}

type WhileStatement struct {
	condition Expression
	body      Statement
}

func (whileStatement WhileStatement) accept(visitor StatementVisitor) any {
	return visitor.visitWhileStatement(whileStatement)
}

type StatementVisitor interface {
	visitBlockStatement(statement BlockStatement) any
	visitClassStatement(statement ClassStatement) any
	visitExpressionStatement(statement ExpressionStatement) any
	visitFunctionStatement(statement FunctionStatement) any
	visitIfStatement(statement IfStatement) any
	visitPrintStatement(statement PrintStatement) any
	visitReturnStatement(statement ReturnStatement) any
	visitVariableStatement(statement VariableStatement) any
	visitWhileStatement(statement WhileStatement) any
}

type Statement interface {
	accept(visitor StatementVisitor) any
}
