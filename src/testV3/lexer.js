// Token obj
class Token{
    constructor(type, value){
        this.type = type;
        this.value = value;
    }
}

// Token factory
function TokenFactory(type, value){
    return new Token(type, value);
}

/*
Operators

+ - * / % ++ --
== != > < >= <=
&& || !
= += -= *= /= %=


*/ 
// Rules
const header = {
    tokens: [
        { type: "MATH_OP_PLUS", value: "+"},
        { type: "MATH_OP_MINUS", value: "-"},
        { type: "MATH_OP_MULTIPLY", value: "*"},
        { type: "MATH_OP_DIVIDE", value: "/"},
        { type: "MATH_OP_MODULO", value: "%"},
        { type: "OP_INCREMENT", value: "++"},
        { type: "OP_DECREMENT", value: "--"},
        { type: "OP_EQUAL", value: "=="},
        { type: "OP_NOT_EQUAL", value: "!="},
        { type: "OP_GREATER_THAN", value: ">"}, 
        { type: "OP_LESS_THAN", value: "<"},
        { type: "OP_GREATER_THAN_OR_EQUAL", value: ">="},
        { type: "OP_LESS_THAN_OR_EQUAL", value: "<="},
        { type: "OP_AND", value: "&&"},
        { type: "OP_OR", value: "||"},
        { type: "OP_NOT", value: "!"},
        { type: "OP_ASSIGN", value: "="},
        { type: "OP_ASSIGN_PLUS", value: "+="},
        { type: "OP_ASSIGN_MINUS", value: "-="},
        { type: "OP_ASSIGN_MULTIPLY", value: "*="},
        { type: "OP_ASSIGN_DIVIDE", value: "/="},
        { type: "OP_ASSIGN_MODULO", value: "%="},
        
        { type: "PAREN_OPEN", value: "("},
        { type: "PAREN_CLOSE", value: ")"},
        { type: "BRACKET_OPEN", value: "{"},
        { type: "BRACKET_CLOSE", value: "}"},
        { type: "BRACE_OPEN", value: "["},
        { type: "BRACE_CLOSE", value: "]"},
        { type: "SEMICOLON", value: ";"},
        { type: "COMMA", value: ","},
        { type: "COLON", value: ":"},
        { type: "DOT", value: "."},
        { type: "QUESTION_MARK", value: "?"},
        
        { type: "STRING", value: "string"},
        { type: "NUMBER", value: "number"},
        { type: "ARRAY", value: "array"},
        { type: "OBJECT", value: "object"},

        { type: "KEYWORD", value: "keyword"},

        { type: "IDENTIFIER", value: "identifier"},

        { type: "WHITESPACE", value: "whitespace"},

        { type: "COMMENT", value: "comment"},

        { type: "NEWLINE", value: "newline"},

        { type: "EOF", value: "eof"},
    ],

    keywords: [
        "true",
        "false",
        "null",
        "void",
        "if",
        "else",
        "for",
        "while",
        "do",
        "return",
        "using",
        "function",
        "in",
        "interface",
        "or",
        "and",
        "not",
        "var"
    ],
};


const IDENTIFIER = /[a-zA-Z_][a-zA-Z0-9_]*/;
const NUMBERS = /[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/;


// Lexer
class Lexer {
    constructor() {
      this.line = 1;
      this.char = 1;
      this.pos = 0;
      this.tok = [];
      this.tokens = header.tokens;
      this.keywords = header.keywords;
      this.current = "";
    }

    // Get next char
    next() {
        this.current = this.code[this.pos];
        this.pos++;
        this.char++;
        return this.current;
    }

    // Peek next char
    peek() {
        return this.code[this.pos];
    }

    // Insert token 
    insertToken(type, value) {
        this.tok.push(TokenFactory(type, value));
    }



    // Make number
    makeNumber() {
        let num = "";
        while (NUMBERS.test(this.current)) {
            num += this.current;
            this.next();
        }
        if (this.current == ".") {
            num += this.current;
            this.next();
            while (NUMBERS.test(this.current)) {
                num += this.current;
                this.next();
            }
        }
        this.insertToken("NUMBER", num);
    }

    // Make identifier
    makeIdentifier() {
        let id = "";
        while (IDENTIFIER.test(this.current)) {
            id += this.current;
            this.next();
        }
        if (this.keywords.includes(id)) {
            this.insertToken("KEYWORD", id);
        } else {
            this.insertToken("IDENTIFIER", id);
        }
    }

    // Make string
    makeString() {
        let str = "";
        this.next();
        while (this.current != '"') {
            str += this.current;
            this.next();
        }
        this.next();
        this.insertToken("STRING", str);
    }

    // Skip comment
    skipComment() {
        this.next();
        this.next();
        while (this.current != "*" && this.peek() != "/") {
            this.next();
        }
        this.next();
        this.next();
    }

    // Tokenize
    tokenize(code) {
        this.code = code;
        this.next();
        while (this.pos < this.code.length) {
            if (this.current == " " || this.current == "\t") {
                this.next();
            } else if (this.current == "\r") {
                this.next();
            } else if (this.current == "\n") {
                this.line++;
                this.char = 1;
                this.next();
            }
            else if (this.current == "/" && this.peek() == "/") {
                this.skipComment();
            }
            else if (this.current == "/" && this.peek() == "*") {
                this.skipComment();
            }
            else if (this.current == '"') {
                this.makeString();
            }
            else if (NUMBERS.test(this.current)) {
                this.makeNumber();
            }
            else if (IDENTIFIER.test(this.current)) {
                this.makeIdentifier();
            }
            else {
                let found = false;
                for (let i = 0; i < this.tokens.length; i++) {
                    if (this.current == this.tokens[i].value) {
                        this.insertToken(this.tokens[i].type, this.current);
                        this.next();
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    throw new Error(`Unexpected token ${this.current} at line ${this.line}, char ${this.char}`);
                }
            }
        }
        this.insertToken("EOF", "EOF");

        return this.tok;
    }
}

// Test
let lexer = new Lexer();
let tok = lexer.tokenize(`
    function main() {
        /* comment */
        var a = 1.0;
        var b = 20;
        if(a<b){
            print("a is less than b");
        }
    }
`);

console.log(tok);

