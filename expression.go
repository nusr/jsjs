package main

type AssignExpression struct {
     name *Token
     value Expression
}

func (assignExpression AssignExpression) accept(visitor VisitorType) ExpressionType {
    return "AssignExpression"
}

type BinaryExpression struct {
     left Expression
     operator *Token
     right Expression
}

func (binaryExpression BinaryExpression) accept(visitor VisitorType) ExpressionType {
    return "BinaryExpression"
}

type CallExpression struct {
     callee Expression
     paren *Token
     argumentList []Expression
}

func (callExpression CallExpression) accept(visitor VisitorType) ExpressionType {
    return "CallExpression"
}

type GetExpression struct {
     object Expression
     name *Token
}

func (getExpression GetExpression) accept(visitor VisitorType) ExpressionType {
    return "GetExpression"
}

type SetExpression struct {
     object Expression
     name *Token
     value Expression
}

func (setExpression SetExpression) accept(visitor VisitorType) ExpressionType {
    return "SetExpression"
}

type GroupingExpression struct {
     expression Expression
}

func (groupingExpression GroupingExpression) accept(visitor VisitorType) ExpressionType {
    return "GroupingExpression"
}

type LiteralExpression struct {
     value LiteralType
}

func (literalExpression LiteralExpression) accept(visitor VisitorType) ExpressionType {
    return "LiteralExpression"
}

type LogicalExpression struct {
     left Expression
     operator *Token
     right Expression
}

func (logicalExpression LogicalExpression) accept(visitor VisitorType) ExpressionType {
    return "LogicalExpression"
}

type SuperExpression struct {
     keyword *Token
     value Expression
}

func (superExpression SuperExpression) accept(visitor VisitorType) ExpressionType {
    return "SuperExpression"
}

type ThisExpression struct {
     keyword *Token
}

func (thisExpression ThisExpression) accept(visitor VisitorType) ExpressionType {
    return "ThisExpression"
}

type UnaryExpression struct {
     operator *Token
     right Expression
}

func (unaryExpression UnaryExpression) accept(visitor VisitorType) ExpressionType {
    return "UnaryExpression"
}

type VariableExpression struct {
     name *Token
}

func (variableExpression VariableExpression) accept(visitor VisitorType) ExpressionType {
    return "VariableExpression"
}
