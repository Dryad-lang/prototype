/*
--------------------------------------------------------------------------------

    parser.js

--------------------------------------------------------------------------------
*/ 

const { tokens_table } = require('./tokenstable.js');
const { Tokenizer, Token, TokenStack } = require('./tokenizer.js');


/*

AST STRUCTURE

    Program
        - statements: Statement[]

    Statement
        - type: string
        - value: any

    BinExpression
        - type: string
        - left: Expression
        - right: Expression
        
    UnExpression
        - type: string
        - value: Expression

    Literal
        - type: string
        - value: any

    Identifier
        - type: string
        - value: string

    Assignment
        - type: string
        - left: Identifier
        - right: Expression

    VariableDeclaration
        - type: string
        - name: Identifier
        - value: Expression

    FunctionDeclaration
        - type: string
        - name: Identifier
        - args: Identifier[]
        - body: Statement[]
        - return: Expression

    FunctionCall
        - type: string
        - name: Identifier
        - args: Expression[]

    IfStatement
        - type: string
        - condition: Expression
        - body: Statement[]
        - else: Statement[]

    ForStatement
        - type: string
        - init: Statement
        - condition: Expression
        - increment: Statement
        - body: Statement[]

    WhileStatement
        - type: string
        - condition: Expression
        - body: Statement[]

    DoWhileStatement
        - type: string
        - condition: Expression
        - body: Statement[]

    BreakStatement
        - type: string

    ContinueStatement
        - type: string

    ReturnStatement
        - type: string
        - value: Expression

    ArrayDeclaration
        - type: string
        - name: Identifier
        - values: Expression[]
        - size: Expression

    ArrayAccess
        - type: string
        - name: Identifier
        - index: Expression
*/ 