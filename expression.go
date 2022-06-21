package main

type AssignExpression struct {
	name  *Token
	value Expression
}

func (assignExpression AssignExpression) accept(visitor ExpressionVisitor) LiteralType {
	return visitor.visitAssignExpression(assignExpression)
}

type BinaryExpression struct {
	left     Expression
	operator *Token
	right    Expression
}

func (binaryExpression BinaryExpression) accept(visitor ExpressionVisitor) LiteralType {
	return visitor.visitBinaryExpression(binaryExpression)
}

type CallExpression struct {
	callee       Expression
	paren        *Token
	argumentList []Expression
}

func (callExpression CallExpression) accept(visitor ExpressionVisitor) LiteralType {
	return visitor.visitCallExpression(callExpression)
}

type GetExpression struct {
	object Expression
	name   *Token
}

func (getExpression GetExpression) accept(visitor ExpressionVisitor) LiteralType {
	return visitor.visitGetExpression(getExpression)
}

type SetExpression struct {
	object Expression
	name   *Token
	value  Expression
}

func (setExpression SetExpression) accept(visitor ExpressionVisitor) LiteralType {
	return visitor.visitSetExpression(setExpression)
}

type GroupingExpression struct {
	expression Expression
}

func (groupingExpression GroupingExpression) accept(visitor ExpressionVisitor) LiteralType {
	return visitor.visitGroupingExpression(groupingExpression)
}

type LiteralExpression struct {
	string    string
	tokenType TokenType
}

func (literalExpression LiteralExpression) accept(visitor ExpressionVisitor) LiteralType {
	return visitor.visitLiteralExpression(literalExpression)
}

type LogicalExpression struct {
	left     Expression
	operator *Token
	right    Expression
}

func (logicalExpression LogicalExpression) accept(visitor ExpressionVisitor) LiteralType {
	return visitor.visitLogicalExpression(logicalExpression)
}

type SuperExpression struct {
	keyword *Token
	value   Expression
}

func (superExpression SuperExpression) accept(visitor ExpressionVisitor) LiteralType {
	return visitor.visitSuperExpression(superExpression)
}

type ThisExpression struct {
	keyword *Token
}

func (thisExpression ThisExpression) accept(visitor ExpressionVisitor) LiteralType {
	return visitor.visitThisExpression(thisExpression)
}

type UnaryExpression struct {
	operator *Token
	right    Expression
}

func (unaryExpression UnaryExpression) accept(visitor ExpressionVisitor) LiteralType {
	return visitor.visitUnaryExpression(unaryExpression)
}

type VariableExpression struct {
	name *Token
}

func (variableExpression VariableExpression) accept(visitor ExpressionVisitor) LiteralType {
	return visitor.visitVariableExpression(variableExpression)
}

type ExpressionVisitor interface {
	visitAssignExpression(expression AssignExpression) LiteralType
	visitBinaryExpression(expression BinaryExpression) LiteralType
	visitCallExpression(expression CallExpression) LiteralType
	visitGetExpression(expression GetExpression) LiteralType
	visitSetExpression(expression SetExpression) LiteralType
	visitGroupingExpression(expression GroupingExpression) LiteralType
	visitLiteralExpression(expression LiteralExpression) LiteralType
	visitLogicalExpression(expression LogicalExpression) LiteralType
	visitSuperExpression(expression SuperExpression) LiteralType
	visitThisExpression(expression ThisExpression) LiteralType
	visitUnaryExpression(expression UnaryExpression) LiteralType
	visitVariableExpression(expression VariableExpression) LiteralType
}

type Expression interface {
	accept(visitor ExpressionVisitor) LiteralType
}
