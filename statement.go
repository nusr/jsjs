package main

type BlockStatement struct {
     statements []Statement
}

func (blockStatement BlockStatement) accept(visitor VisitorType) ExpressionType {
    return "BlockStatement"
}

type ClassStatement struct {
     name *Token
     superClass VariableExpression
     methods []FunctionStatement
}

func (classStatement ClassStatement) accept(visitor VisitorType) ExpressionType {
    return "ClassStatement"
}

type ExpressionStatement struct {
     expression Expression
}

func (expressionStatement ExpressionStatement) accept(visitor VisitorType) ExpressionType {
    return "ExpressionStatement"
}

type FunctionStatement struct {
     name *Token
     body Statement
     params []Token
}

func (functionStatement FunctionStatement) accept(visitor VisitorType) ExpressionType {
    return "FunctionStatement"
}

type IfStatement struct {
     condition Expression
     thenBranch Statement
     elseBranch Statement
}

func (ifStatement IfStatement) accept(visitor VisitorType) ExpressionType {
    return "IfStatement"
}

type PrintStatement struct {
     expression Expression
}

func (printStatement PrintStatement) accept(visitor VisitorType) ExpressionType {
    return "PrintStatement"
}

type ReturnStatement struct {
     keyword *Token
     value Expression
}

func (returnStatement ReturnStatement) accept(visitor VisitorType) ExpressionType {
    return "ReturnStatement"
}

type VariableStatement struct {
     name *Token
     initializer Expression
}

func (variableStatement VariableStatement) accept(visitor VisitorType) ExpressionType {
    return "VariableStatement"
}

type WhileStatement struct {
     condition Expression
     body Statement
}

func (whileStatement WhileStatement) accept(visitor VisitorType) ExpressionType {
    return "WhileStatement"
}
