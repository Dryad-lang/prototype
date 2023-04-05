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
            EQ: '==',
            NE: '!=',
            GT: '>',
            LT: '<',
            GE: '>=',
            LE: '<=',
            AND: '&&',
            OR: '||',
            NOT: '!',
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

// Lexer class

class lexer{
    constructor(input){
        this.input = input;
        this.position = new Position(-1, 0, -1);
        this.current_char = null;
        this.tokens = [];
        this.advance();
    }


    advance(){
        position.advance(current_char);
        current_char = input[position.index];
    }

    make_string(){
        let str = '';
        let position_start = position.copy();
        advance();

        while(current_char != '"' && current_char != null){
            str += current_char;
            advance();
        }

        advance();

        return new Token(TT.STRING, str, position_start, position.copy());
    }

    make_number(){
        let num_str = '';
        let dot_count = 0;
        let position_start = position.copy();

        while(current_char != null && (current_char >= '0' && current_char <= '9' || current_char == '.')){
            if(current_char == '.'){
                if(dot_count == 1) break;
                dot_count++;
            }
            num_str += current_char;
            advance();
        }

        if(dot_count == 0){
            return new Token(TT.NUMBER, parseInt(num_str), position_start, position.copy());
        }else{
            return new Token(TT.NUMBER, parseFloat(num_str), position_start, position.copy());
        }
    }

    make_identifier(){
        let id_str = '';
        let position_start = position.copy();

        while(current_char != null && isAlphaNumeric(current_char)){
            id_str += current_char;
            advance();
        }

        let token_type = TT.IDENTIFIER;

        switch(id_str){
            case 'function': token_type = TT.FUNCTION; break;
            case 'if': token_type = TT.IF; break;
            case 'else': token_type = TT.ELSE; break;
            case 'while': token_type = TT.WHILE; break;
            case 'range': token_type = TT.RANGE; break;
            case 'return': token_type = TT.RETURN; break;
            case 'break': token_type = TT.BREAK; break;
            case 'continue': token_type = TT.CONTINUE; break;
            case 'true': token_type = TT.BOOLEAN_TRUE; break;
            case 'false': token_type = TT.BOOLEAN_FALSE; break;
        }

    }

    make_tokens(){
        while(current_char != null){
            
        }
    }
}