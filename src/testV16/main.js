/*

    Dryad lang


    Gramar:

    <program> ::= <statement> | <statement> <program>

    <statement> ::= <assignment> | <if> | <while> | <range> | <function> | <return> | <break> | <continue> | <function_call> |

    <assignment> ::= <variable> "=" <expression> ";"

    <if> ::= "if" "(" <expression> ")" <statement> | "if" "(" <expression> ")" <statement> "else" <statement>

    <while> ::= "while" "(" <expression> ")" <statement> 

    <range> ::= "range" "(" <number_literal> ")" <statement> <- Equivalent to for range(10){ body }

    <function> ::= "function" <variable> "(" <variable> ")" <statement>

    <return> ::= "return" <expression> ";"

    <break> ::= "break" ";"

    <continue> ::= "continue" ";"

    <function_call> ::= <variable> "(" <args> ")" ";"

    <args> ::= <expression> | <expression> "," <args>

    <expression> ::= <variable> | <number_literal> | <string_literal> | <boolean_literal> | <function_call> | <expression> <operator> <expression>

    <operator> ::= "+" | "-" | "*" | "/" | "%" | "==" | "!=" | ">" | "<" | ">=" | "<=" | "&&" | "||" | "!" | "="

    <variable> ::= <letter> | <letter> <variable>

    <number_literal> ::= <digit> | <digit> <number_literal>

    <string_literal> ::= <character> | <character> <string_literal>

    <boolean_literal> ::= "true" | "false"



    Example:

    function main(){
        a = 10;
        b = 20;
        c = a + b;
        if(c == 30){
            print("c is 30");
        }else{
            print("c is not 30");
        }
    }

    function print(str){
        range(10){
            print(str);
        }        
    }

    main();

*/ 


// Token types

const TT = {
            // Single character tokens
            PLUS: '+',
            MINUS: '-',
            MUL: '*',
            DIV: '/',
            MOD: '%',
            LPAREN: '(',
            RPAREN: ')',
            LBRACE: '{',
            RBRACE: '}',
            COMMA: ',',
            SEMICOLON: ';',
            EQUALS: '=',
            // Double character tokens
            AEQ: '==',
            NE: '!=',
            GT: '>',
            LT: '<',
            GE: '>=',
            LE: '<=',
            AND: '&&',
            OR: '||',
            NOT: '!',
            NE: '!=',
            // Literals
            IDENTIFIER: 'IDENTIFIER',
            NUMBER: 'NUMBER',
            STRING: 'STRING',
            BOOLEAN_FALSE: 'BOOLEAN_FALSE',
            BOOLEAN_TRUE: 'BOOLEAN_TRUE',
            // Keywords
            FUNCTION: 'function',
            IF: 'if',
            ELSE: 'else',
            WHILE: 'while',
            RANGE: 'range',
            RETURN: 'return',
            BREAK: 'break',
            CONTINUE: 'continue',
            // End of file
            EOF: 'EOF'
        }

// Token class

class Token {
    constructor(type, value){
        this.type = type;
        this.value = value;
    }

    toString(){
        return `Token(${this.type}, ${this.value})`;
    }
}

// Position class

class Position {
    constructor(index, line, column){
        this.index = index;
        this.line = line;
        this.column = column;
    }

    advance(current_char){
        this.index++;
        this.column++;

        if(current_char == '\n'){
            this.line++;
            this.column = 0;
        }

        return this;
    }

    copy(){
        return new Position(this.index, this.line, this.column);
    }

    toString(){
        return `Position(${this.index}, ${this.line}, ${this.column})`;
    }
}

// Error class

class Error {
    constructor(message, position_start, position_end){
        this.message = message;
        this.position_start = position_start;
        this.position_end = position_end;
    }

    toString(){
        return `Error(${this.message}, ${this.position_start}, ${this.position_end})`;
    }
}

// ERROR STACK

let error_stack = [];

// Lexer class

class Lexer{
    constructor(input){
        this.input = input;
        this.position = new Position(-1, 0, -1);
        this.current_char = "";
        this.tokens = [];
    }

    advance(){
        this.position.advance(this.current_char);
        this.current_char = this.input[this.position.index];
    }

    make_sting(){
        let string = '';
        let position_start = this.position.copy();

        this.advance();

        while(this.current_char != '"'){
            string += this.current_char;
            this.advance();
        }

        this.advance();

        return new Token(TT.STRING, string);
    }

    make_number(){
        let number = '';
        let position_start = this.position.copy();

        while(this.current_char != null && this.current_char.match(/[0-9]/)){
            number += this.current_char;
            this.advance();
        }

        return new Token(TT.NUMBER, parseInt(number));
    }

    make_identifier(){
        let identifier = '';
        let position_start = this.position.copy();

        while(this.current_char != null && this.current_char.match(/[a-zA-Z]/)){
            identifier += this.current_char;
            this.advance();
        }

        switch(identifier){
            case 'function':
                return new Token(TT.FUNCTION, identifier);
            case 'if':
                return new Token(TT.IF, identifier);
            case 'else':
                return new Token(TT.ELSE, identifier);
            case 'while':
                return new Token(TT.WHILE, identifier);
            case 'range':
                return new Token(TT.RANGE, identifier);
            case 'return':
                return new Token(TT.RETURN, identifier);
            case 'break':
                return new Token(TT.BREAK, identifier);
            case 'continue':
                return new Token(TT.CONTINUE, identifier);
            case 'true':
                return new Token(TT.BOOLEAN_TRUE, identifier);
            case 'false':
                return new Token(TT.BOOLEAN_FALSE, identifier);
        }

        return new Token(TT.IDENTIFIER, identifier);
    }

    make_tokens(){
        while(this.current_char != null){
            if(this.current_char == ' ' || this.current_char == '\n' || this.current_char == '\t'){
                this.advance();
            }else if(this.current_char == '"'){
                this.tokens.push(this.make_sting());
            }else if(this.current_char.match(/[0-9]/)){
                this.tokens.push(this.make_number());
            }else if(this.current_char.match(/[a-zA-Z]/)){
                this.tokens.push(this.make_identifier());
            }else if(this.current_char == '+'){
                this.tokens.push(new Token(TT.PLUS, this.current_char));
                this.advance();
            }else if(this.current_char == '-'){
                this.tokens.push(new Token(TT.MINUS, this.current_char));
                this.advance();
            }else if(this.current_char == '*'){
                this.tokens.push(new Token(TT.MUL, this.current_char));
                this.advance();
            }else if(this.current_char == '/'){
                this.tokens.push(new Token(TT.DIV, this.current_char));
                this.advance();
            }else if(this.current_char == '%'){
                this.tokens.push(new Token(TT.MOD, this.current_char));
                this.advance();
            }else if(this.current_char == '('){
                this.tokens.push(new Token(TT.LPAREN, this.current_char));
                this.advance();
            }else if(this.current_char == ')'){
                this.tokens.push(new Token(TT.RPAREN, this.current_char));
                this.advance();
            }else if(this.current_char == '{'){
                this.tokens.push(new Token(TT.LBRACE, this.current_char));
                this.advance();
            }else if(this.current_char == '}'){
                this.tokens.push(new Token(TT.RBRACE, this.current_char));
                this.advance();
            }else if(this.current_char == ','){
                this.tokens.push(new Token(TT.COMMA, this.current_char));
                this.advance();
            }else if(this.current_char == ';'){
                this.tokens.push(new Token(TT.SEMICOLON, this.current_char));
                this.advance();
            }else if(this.current_char == '='){
                this.tokens.push(new Token(TT.EQUALS, this.current_char));
                this.advance();
            }else if(this.current_char == '!'){
                this.advance();
                if(this.current_char == '='){
                    this.tokens.push(new Token(TT.NE, '!='));
                    this.advance();
                }else{
                    this.tokens.push(new Token(TT.NOT, '!'));
                }
            }else if(this.current_char == '<'){
                this.advance();
                if(this.current_char == '='){
                    this.tokens.push(new Token(TT.LE, '<='));
                    this.advance();
                }else{
                    this.tokens.push(new Token(TT.LT, '<'));
                }
            }else if(this.current_char == '>'){
                this.advance();
                if(this.current_char == '='){
                    this.tokens.push(new Token(TT.GE, '>='));
                    this.advance();
                }else{
                    this.tokens.push(new Token(TT.GT, '>'));
                }
            }else if(this.current_char == '&'){
                this.advance();
                if(this.current_char == '&'){
                    this.tokens.push(new Token(TT.AND, '&&'));
                    this.advance();
                }else{
                    error_stack.push(new Error(this.position, 'Expected "&"'))
                }
            }else if(this.current_char == '|'){
                this.advance();
                if(this.current_char == '|'){
                    this.tokens.push(new Token(TT.OR, '||'));
                    this.advance();
                }else{
                    error_stack.push(new Error(this.position, 'Expected "|"'))
                }
            }else{
                error_stack.push(new Error(this.position, 'Invalid character'));
                this.advance();
            }
        }

        this.tokens.push(new Token(TT.EOF, null));
        return this.tokens;
    }
}

// // Test
// let code = `
//     function add(a, b){
//         return a + b;
//     }
// `

// let lexer = new Lexer(code);
// let tokens = lexer.make_tokens();

// console.log(error_stack);
// console.log(tokens);


/*
⁞—————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————⁞
⁞                                                                                                                                 ⁞
⁞    PARSER                                                                                                                       ⁞
⁞                                                                                                                                 ⁞
⁞—————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————⁞

    The parser takes the tokens from the lexer and turns them into an abstract syntax tree (AST).
    The AST is a tree structure that represents the code. It is used to generate the bytecode.

    Structure:

    [
        {
            type: 'function',
            value: {},
            childreen: []
        }
    ]

    a = 1;

    [
        {
            type: 'assignment',
            value: 'a',
            childreen: [
                {
                    type: 'number',
                    value: {"0":1},
                    childreen: []
                }
            ]
        }
    ]

    a = 1 + 2;

    [
        {
            type: 'assignment',
            value: 'a',
            childreen: [
                {
                    type: 'math_expression',
                    value: {"0":"+"},
                    childreen: [
                        {
                            type: 'number',
                            value: {"0":1},
                            childreen: []
                        },
                        {
                            type: 'number',
                            value: {"0":2},
                            childreen: []
                        }
                    ]
                }
            ]
        }
    ]

*/

class Parser{
    constructor(tokens){
        this.tokens = tokens;
        this.position = 0;
        this.current_token = this.tokens[this.position];
    }

    advance(){
        this.position++;
        if(this.position > this.tokens.length - 1){
            this.current_token = null;
        }else{
            this.current_token = this.tokens[this.position];
        }
    }

    eat(token){
        if(this.current_token.type == token){
            this.advance();
        }else{
            error_stack.push(new Error(this.current_token.position, 'Expected "' + token + '"'));
        }
    }

    parse(){
        let ast = [];
        while(this.current_token != null){
            ast.push(this.select());
        }
        return ast;
    }
}