/*
Test lang:

Types:

Literals
- string
- number

Operators
- + - * / % =

Variables
- var

Functions
- fn
- return

Punctiation
- ( ) { } , ;

Others:
- identifyer
- eof

    // Literals
    String,
    Number,

    // Operators
    Plus,
    Minus,
    Multiply,
    Divide,
    Modulo,
    Assign,

    // Variables
    Var,

    // Functions
    Fn,
    Return,

    // Punctiation
    OpenParen,
    CloseParen,
    OpenBrace,
    CloseBrace,
    Comma,
    Semicolon,

    // Others
    Identifyer,
    Eof

*/ 

// Tokens
var STRING: string = "STRING";
var NUMBER: string = "NUMBER";

var PLUS: string = "PLUS";
var MINUS: string = "MINUS";
var MULTIPLY: string = "MULTIPLY";
var DIVIDE: string = "DIVIDE";
var MODULO: string = "MODULO";
var ASSIGN: string = "ASSIGN";

var VAR: string = "VAR";

var FN: string = "FN";
var RETURN: string = "RETURN";

var OPENPAREN: string = "OPENPAREN";
var CLOSEPAREN: string = "CLOSEPAREN";
var OPENBRACE: string = "OPENBRACE";
var CLOSEBRACE: string = "CLOSEBRACE";
var COMMA: string = "COMMA";
var SEMICOLON: string = "SEMICOLON";

var IDENTIFYER: string = "IDENTIFYER";
var EOF: string = "EOF";

// Token class
class Token {
    type: string;
    value: string;

    constructor(type: string, value: string) {
        this.type = type;
        this.value = value;
    }
}

// Lexer class
class Lexer {
    text: string;
    pos: number;
    currentChar: string;

    constructor(text: string) {
        this.text = text;
        this.pos = 0;
        this.currentChar = this.text[this.pos];
    }

    error() {
        throw "Error parsing input on: " + this.currentChar;
    }

    isDigit(char: string) {
        return char >= "0" && char <= "9";
    }

    isLetter(char: string) {
        return char >= "a" && char <= "z" || char >= "A" && char <= "Z";
    }

    isIdentifyer(char: string) {
        return this.isDigit(char) || this.isLetter(char);
    }

    advance() {
        this.pos++;
        if (this.pos > this.text.length - 1) {
            this.currentChar = EOF;
        } else {
            this.currentChar = this.text[this.pos];
        }
    }

    skipWhitespace() {
        while (this.currentChar != EOF && this.currentChar == " ") {
            this.advance();
        }
    }

    number() {
        var result = "";
        while (this.currentChar != EOF && this.isDigit(this.currentChar)) {
            result += this.currentChar;
            this.advance();
        }
        return new Token(NUMBER, result);
    }

    identifyer() {
        var result = "";
        while (this.currentChar != EOF && this.isIdentifyer(this.currentChar)) {
            result += this.currentChar;
            this.advance();
        }

        switch (result) {
            case "var":
                return new Token(VAR, result);
            case "fn":
                return new Token(FN, result);
            case "return":
                return new Token(RETURN, result);
            default:
                return new Token(IDENTIFYER, result);
        }
    }

    tokenize(){
        var tokens = [];
        while (this.currentChar != EOF) {
            if (this.currentChar == " ") {
                this.skipWhitespace();
                continue;
            }
            if (this.isDigit(this.currentChar)) {
                tokens.push(this.number());
                continue;
            }
            if (this.isLetter(this.currentChar)) {
                tokens.push(this.identifyer());
                continue;
            }
            switch (this.currentChar) {
                case "+":
                    tokens.push(new Token(PLUS, "+"));
                    break;
                case "-":
                    tokens.push(new Token(MINUS, "-"));
                    break;
                case "*":
                    tokens.push(new Token(MULTIPLY, "*"));
                    break;
                case "/":
                    tokens.push(new Token(DIVIDE, "/"));
                    break;
                case "%":
                    tokens.push(new Token(MODULO, "%"));
                    break;
                case "=":
                    tokens.push(new Token(ASSIGN, "="));
                    break;
                case "(":
                    tokens.push(new Token(OPENPAREN, "("));
                    break;
                case ")":
                    tokens.push(new Token(CLOSEPAREN, ")"));
                    break;
                case "{":
                    tokens.push(new Token(OPENBRACE, "{"));
                    break;
                case "}":
                    tokens.push(new Token(CLOSEBRACE, "}"));
                    break;
                case ",":
                    tokens.push(new Token(COMMA, ","));
                    break;
                case ";":
                    tokens.push(new Token(SEMICOLON, ";"));
                    break;
                case "\n":
                    break;
                default:
                    this.error();
            }
            this.advance();
        }
        tokens.push(new Token(EOF, EOF));
        return tokens;
    }
}

// Test
// var lexer = new Lexer("var a = 5 + 5;");
// var tokens = lexer.tokenize();

// var lexer = new Lexer(`
//     var a = 5 + 5;
//     fn add(a, b) {
//         return a + b;
//     }
//     var c = add(a, 5);
// `);
// var tokens = lexer.tokenize();

// console.log(tokens);

// Parser

// AST
class Node{
    token: Token;
    children: Node[];
    constructor(token: Token) {
        this.token = token;
        this.children = [];
    }
}

// Parser class
class Parser {
    tokens: Token[];
    pos: number;
    currentToken: Token;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
        this.pos = 0;
        this.currentToken = this.tokens[this.pos];
    }

    error() {
        throw "Error parsing input on: " + this.currentToken.value;
    }

    advance() {
        this.pos++;
        if (this.pos > this.tokens.length - 1) {
            this.currentToken = new Token(EOF, EOF);
        } else {
            this.currentToken = this.tokens[this.pos];
        }
    }

    eat(type: string) {
        if (this.currentToken.type == type) {
            this.advance();
        } else {
            this.error();
        }
    }
}