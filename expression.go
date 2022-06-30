package main

type AssignExpression struct {
	name  *Token
	value Expression
}

func (assignExpression AssignExpression) accept(visitor ExpressionVisitor) any {
	return visitor.visitAssignExpression(assignExpression)
}

type BinaryExpression struct {
	left     Expression
	operator *Token
	right    Expression
}

func (binaryExpression BinaryExpression) accept(visitor ExpressionVisitor) any {
	return visitor.visitBinaryExpression(binaryExpression)
}

type CallExpression struct {
	callee       Expression
	paren        *Token
	argumentList []Expression
}

func (callExpression CallExpression) accept(visitor ExpressionVisitor) any {
	return visitor.visitCallExpression(callExpression)
}

type GetExpression struct {
	object Expression
	name   *Token
}

func (getExpression GetExpression) accept(visitor ExpressionVisitor) any {
	return visitor.visitGetExpression(getExpression)
}

type SetExpression struct {
	object Expression
	name   *Token
	value  Expression
}

func (setExpression SetExpression) accept(visitor ExpressionVisitor) any {
	return visitor.visitSetExpression(setExpression)
}

type GroupingExpression struct {
	expression Expression
}

func (groupingExpression GroupingExpression) accept(visitor ExpressionVisitor) any {
	return visitor.visitGroupingExpression(groupingExpression)
}

type LiteralExpression struct {
	string    string
	tokenType TokenType
}

func (literalExpression LiteralExpression) accept(visitor ExpressionVisitor) any {
	return visitor.visitLiteralExpression(literalExpression)
}

type LogicalExpression struct {
	left     Expression
	operator *Token
	right    Expression
}

func (logicalExpression LogicalExpression) accept(visitor ExpressionVisitor) any {
	return visitor.visitLogicalExpression(logicalExpression)
}

type SuperExpression struct {
	keyword *Token
	value   Expression
}

func (superExpression SuperExpression) accept(visitor ExpressionVisitor) any {
	return visitor.visitSuperExpression(superExpression)
}

type ThisExpression struct {
	keyword *Token
}

func (thisExpression ThisExpression) accept(visitor ExpressionVisitor) any {
	return visitor.visitThisExpression(thisExpression)
}

type UnaryExpression struct {
	operator *Token
	right    Expression
}

func (unaryExpression UnaryExpression) accept(visitor ExpressionVisitor) any {
	return visitor.visitUnaryExpression(unaryExpression)
}

type VariableExpression struct {
	name *Token
}

func (variableExpression VariableExpression) accept(visitor ExpressionVisitor) any {
	return visitor.visitVariableExpression(variableExpression)
}

type ExpressionVisitor interface {
	visitAssignExpression(expression AssignExpression) any
	visitBinaryExpression(expression BinaryExpression) any
	visitCallExpression(expression CallExpression) any
	visitGetExpression(expression GetExpression) any
	visitSetExpression(expression SetExpression) any
	visitGroupingExpression(expression GroupingExpression) any
	visitLiteralExpression(expression LiteralExpression) any
	visitLogicalExpression(expression LogicalExpression) any
	visitSuperExpression(expression SuperExpression) any
	visitThisExpression(expression ThisExpression) any
	visitUnaryExpression(expression UnaryExpression) any
	visitVariableExpression(expression VariableExpression) any
}

type Expression interface {
	accept(visitor ExpressionVisitor) any
}
