/*
--------------------------------------------------------------------------------

    parser.js

--------------------------------------------------------------------------------
*/ 

const { tokens_table } = require('./tokenstable.js');
// const { Tokenizer, Token, TokenStack } = require('./tokenizer.js');


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

class Token {
    constructor(type, value, line, column) {
        this.type = type;
        this.value = value;
        this.line = line;
        this.column = column;
    }
}

class TokenStack{
    constructor(){
        this.stack = [];
    }

    push(token){
        this.stack.push(token);
    }

    pop(){
        return this.stack.pop();
    }

    peek(){
        return this.stack[this.stack.length - 1];
    }

    isEmpty(){
        return this.stack.length === 0;
    }

    size(){
        return this.stack.length;
    }
}

class Parser {
    constructor(TokenStack) {
        this.tokenStack = TokenStack;
        this.index = 0;
    }

    parse() {
        return this.program();
    }

    program() {
        const statements = [];
        while (!this.tokenStack.isEmpty()) {
            statements.push(this.statement());
        }
        return {
            type: 'Program',
            statements
        };
    }

    // Statement
    statement() {
        const token = this.tokenStack.peek();
        switch (token.type) {
            case 'IF':
                return this.ifStatement();
            case 'FOR':
                return this.forStatement();
            case 'WHILE':
                return this.whileStatement();
            case 'DO':
                return this.doWhileStatement();
            case 'BREAK':
                return this.breakStatement();
            case 'CONTINUE':
                return this.continueStatement();
            case 'RETURN':
                return this.returnStatement();
            case 'VAR':
                return this.variableDeclaration();
            case 'CONST':
                return this.variableDeclaration();
            case 'LET':
                return this.variableDeclaration();
            case 'FUNCTION':
                return this.functionDeclaration();
            case 'EOF':
                return this.tokenStack.pop();
            default:
                return this.expressionStatement();
        }
    }

    // ExpressionStatement
    expressionStatement() {
        return {
            type: 'ExpressionStatement',
            expression: this.expression()
        };
    }
}