```bnf
program        := declaration* EOF ;

declaration    := classDeclaration
               | functionDeclaration
               | varDeclaration
               | statement ;
classDeclaration      := "class" identifier ( "extends" identifier )?
                 "{" function* "}" ;
functionDeclaration        := "function" function ;
varDeclaration        := "var" identifier ( "=" expression )? ";" ;


statement      := expressionStatement
               | forStatement
               | ifStatement
               | returnStatement
               | whileStatement
               | blockStatement ;
expressionStatement       := expression ";" ;
forStatement        := "for" "(" ( varDeclaration | expressionStatement | ";" )
                           expression? ";"
                           expression? ")" statement ;
ifStatement         := "if" "(" expression ")" statement
                 ( "else" statement )? ;
returnStatement     := "return" expression? ";" ;
whileStatement      := "while" "(" expression ")" statement ;
blockStatement          := "{" declaration* "}" ;



expression     := assignment ;
assignment     := ( call "." )? identifier "=" assignment
               | logic_or ;
logic_or       := logic_and ( "or" logic_and )* ;
logic_and      := equality ( "and" equality )* ;
equality       := comparison ( ( "!=" | "==" ) comparison )* ;
comparison     := term ( ( ">" | ">=" | "<" | "<=" ) term )* ;
term           := factor ( ( "-" | "+" ) factor )* ;
factor         := unary ( ( "/" | "*" ) unary )* ;
unary          := ( "!" | "-" ) unary | call ;
call           := primary ( "(" arguments? ")" | "." identifier )* ;
primary        := literal | "this" | identifier | "(" expression ")"
               | "super" "." identifier ;

function       := identifier "(" parameters? ")" blockStatement ;
parameters     := identifier ( "," identifier )* ;
arguments      := expression ( "," expression )* ;

literal        := number | string | boolean | null
boolean        := "true" | "false"
null           := "null"
number         := digit+ ( "." digit+ )? ;
string         := "\"" <any char except "\"">* "\"" ;
identifier     := alpha ( alpha | digit )* ;
alpha          := "a" ... "z" | "A" ... "Z" | "_" ;
digit          := "0" ... "9" ;
```
