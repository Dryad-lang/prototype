/*
    ---------------------------------------------------------------------------

                        Dryad lang
                            2023

    ---------------------------------------------------------------------------
*/ 



// Token types

// Literals

let TT_L_NUMBER = "NUMBER";
let TT_L_STRING = "STRING";
let TT_L_IDENTIFYER = "IDENTIFYER";
let TT_L_KEYWORD = "KEYWORD";


// Operators

// Aritimetic
TT_OP_PLUS = "+";
TT_OP_MINUS = "-";
TT_OP_DIVIDER = "/";
TT_OP_MULTIPLY = "*";
TT_OP_MODULO = "%";
TT_OP_POWER = "^";

// Atribuction
TT_OP_EQUALS = "=";

// Atribuction + Aritimetic
TT_OP_PLUS_EQUALS = "+=";
TT_OP_MINUS_EQUALS = "-=";
TT_OP_DIVIDER_EQUALS = "/=";
TT_OP_MULTIPLY_EQUALS = "*=";

// Comparison
TT_OP_EQUALS_EQUALS = "==";
TT_OP_NOT_EQUALS = "!=";
TT_OP_GREATER = ">";
TT_OP_LESS = "<";
TT_OP_GREATER_EQUALS = ">=";
TT_OP_LESS_EQUALS = "<=";

// Logical
TT_OP_NOT = "!";
TT_OP_AND = "&&";
TT_OP_OR = "||";

// Increment and Decrement
TT_OP_INCREMENT = "++";
TT_OP_DECREMENT = "--";

// Keywords

TT_KW_VAR = "var";
TT_KW_FUNC = "fn";
TT_KW_RETURN = "return";
TT_KW_IF = "if";
TT_KW_ELSE = "else";

// Punctuation

TT_PUNC_COMMA = ",";
TT_PUNC_SEMICOLON = ";";
TT_PUNC_LPAREN = "(";
TT_PUNC_RPAREN = ")";
TT_PUNC_LBRACE = "{";
TT_PUNC_RBRACE = "}";
TT_PUNC_LBRACKET = "[";
TT_PUNC_RBRACKET = "]";

// Other

TT_EOF = "EOF";





//  __________________________________________________________ [ BASIC CLASSES ] ____________________________________________________________

// Position class
class Position {
    constructor(index, line, column, filename) {
        this.index = index;
        this.line = line;
        this.column = column;
        this.filename = filename;
    }
    get index() {
        return this.index;
    }
    get line() {
        return this.line;
    }
    get column() {
        return this.column;
    }
    get filename() {
        return this.filename;
    }
    get filetext() {
        return this.filetext;
    }

    advance(current_char) {
        this.index++;
        this.column++;
        if (current_char == "\n") {
            this.line++;
            this.column = 0;
        }
        return this;
    }

    copy() {
        return new Position(this.index, this.line, this.column, this.filename);
    }

    toString() {
        return `Position(index=${this.index}, line=${this.line}, column=${this.column}, filename=${this.filename})`;
    }
}

//  Token class
class Token {
    constructor(type, value, position_start, position_end) {
        this.type = type;
        this.value = value;
        this.position_start = position_start;
        this.position_end = position_end;
    }
    get type() {
        return this.type;
    }
    get value() {
        return this.value;
    }
    get position_start() {
        return this.position_start;
    }
    get position_end() {
        return this.position_end;
    }

    matches(type, value) {
        return this.type == type && this.value == value;
    }

    toString() {
        if (this.value) {
            return `Token(type=${this.type}, value=${this.value})`;
        }
        return `Token(type=${this.type})`;
    }
}

//  Error class
class Error {
    constructor(error_name, details, position_start, position_end) {
        this.error_name = error_name;
        this.details = details;
        this.position_start = position_start;
        this.position_end = position_end;
    }
    get error_name() {
        return this.error_name;
    }
    get details() {
        return this.details;
    }
    get position_start() {
        return this.position_start;
    }
    get position_end() {
        return this.position_end;
    }

    toString() {
        return `${this.error_name}: ${this.details}\nFile ${this.position_start.filename}, line ${this.position_start.line + 1}`;
    }
}

// Ast
class Ast{
    constructor(root) {
        this.root = root;
    }
    get root() {
        return this.root;
    }
    toString() {
        return `${this.root}`;
    }
}

// Node
class Node{
    constructor(token, value, left_childreen, midle_childreen, right_childreen){
        this.token = token;
        this.value = value;
        this.left_childreen = left_childreen;
        this.midle_childreen = midle_childreen;
        this.right_childreen = right_childreen;
    }

    token() {
        return this.token;
    }
    value() {
        return this.value;
    }
    get_left_childreen(index) {
        return this.left_childreen[index??0];
    }
    get_midle_childreen(index) {
        return this.midle_childreen[index??0];
    }
    get_right_childreen(index) {
        return this.right_childreen[index??0];
    }

    toString() {
        return `${this.token}`;
    }
}

//  __________________________________________________________ [ Errors ] ____________________________________________________________

// Illegal Char Error
class IllegalCharError extends Error {
    constructor(details, position_start, position_end) {
        super("Illegal Character", details, position_start, position_end);
    }
}

// Expected Char Error
class ExpectedCharError extends Error {
    constructor(details, position_start, position_end) {
        super("Expected Character", details, position_start, position_end);
    }
}

// Invalid Syntax Error
class InvalidSyntaxError extends Error {
    constructor(details, position_start, position_end) {
        super("Invalid Syntax", details, position_start, position_end);
    }
}

// ERROR STACK

class ErrorStack {
    constructor() {
        this.errors = [];
    }

    push(error) {
        this.errors.push(error);
    }

    pop() {
        this.errors.pop();
    }

    get length() {
        return this.errors.length;
    }

    get(index) {
        return this.errors[index];
    }

    toString() {
        return `${this.errors}`;
    }
}

let ERROR_STACK = new ErrorStack();

// TROW ERRORS STACK ON COMPILATION ENDS OR CRITICAL PROCESS FIND

function errors_trow(){
    if (ERROR_STACK.length > 0) {
        console.log(ERROR_STACK.toString());
        process.exit();
    }
}


//  __________________________________________________________ [ Lexer ] ____________________________________________________________