/*

TOKENS:

//MATH
PLUS, MINUS, MULTIPLY, DIVIDE,

//OPERATORS
ASSING

//PUNCTUATION
LPAREN, RPAREN, LBRACE, RBRACE, LBRACKET, RBRACKET, SEMICOLON, COMMA, SEMICOLON

//KEYWORDS
FN, RETURN,

//LITERALS
IDENTIFIER, NUMBER, STRING

//COMMENTS
COMMENT #

//SPECIALS
EOF

*/


const PLUS = "PLUS";
const MINUS = "MINUS";
const MULTIPLY = "MULTIPLY";
const DIVIDE = "DIVIDE";

const ASSIGN = "ASSIGN";

const LPAREN = "LPAREN";
const RPAREN = "RPAREN";
const LBRACE = "LBRACE";
const RBRACE = "RBRACE";
const LBRACKET = "LBRACKET";
const RBRACKET = "RBRACKET";
const SEMICOLON = "SEMICOLON";
const COMMA = "COMMA";
const COLON = "COLON";

const FN = "FN";
const RETURN = "RETURN";

const IDENTIFIER = "IDENTIFIER";
const NUMBER = "NUMBER";
const STRING = "STRING";

const COMMENT = "COMMENT";

const EOF = "EOF";

class Token {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}

class Lexer {
    constructor(text) {
        this.text = text;
        this.pos = 0;
        this.currentChar = this.text[this.pos];
    }

    error() {
        throw "Invalid character";
    }

    advance() {
        this.pos++;
        if (this.pos > this.text.length - 1) {
            this.currentChar = null;
        } else {
            this.currentChar = this.text[this.pos];
        }
    }

    peek() {
        let peekPos = this.pos + 1;
        if (peekPos > this.text.length - 1) {
            return null;
        } else {
            return this.text[peekPos];
        }
    }

    skipWhitespace() {
        while (this.currentChar != null && this.currentChar.match(/\s/)) {
            this.advance();
        }
    }

    skipComment() {
        while (this.currentChar != null && this.currentChar != "\n") {
            this.advance();
        }
    }

    number() {
        let result = "";
        while (this.currentChar != null && this.currentChar.match(/[0-9]/)) {
            result += this.currentChar;
            this.advance();
        }

        return new Token(NUMBER, result);
    }

    identifier() {
        let result = "";
        while (this.currentChar != null && this.currentChar.match(/[a-zA-Z0-9_]/)) {
            result += this.currentChar;
            this.advance();
        }

        switch (result) {
            case "fn":
                return new Token(FN, result);
            case "return":
                return new Token(RETURN, result);
            default:
                return new Token(IDENTIFIER, result);
        }
    }

    string() {
        let result = "";
        this.advance();
        while (this.currentChar != null && this.currentChar != '"') {
            result += this.currentChar;
            this.advance();
        }
        this.advance();
        return new Token(STRING, result);
    }

    getNextToken() {
        let result = null;

        while (this.currentChar != null) {
            if (this.currentChar.match(/\s/)) {
                this.skipWhitespace();
                continue;
            }

            if (this.currentChar == "#") {
                this.skipComment();
                continue;
            }

            if (this.currentChar.match(/[0-9]/)) {
                return this.number();
            }

            if (this.currentChar.match(/[a-zA-Z_]/)) {
                return this.identifier();
            }

            if (this.currentChar == '"') {
                return this.string();
            }

            if (this.currentChar == "+") {
                result = new Token(PLUS, this.currentChar);
            } else if (this.currentChar == "-") {
                result = new Token(MINUS, this.currentChar);
            } else if (this.currentChar == "*") {
                result = new Token(MULTIPLY, this.currentChar);
            } else if (this.currentChar == "/") {
                result = new Token(DIVIDE, this.currentChar);
            } else if (this.currentChar == "=") {
                result = new Token(ASSIGN, this.currentChar);
            } else if (this.currentChar == "(") {
                result = new Token(LPAREN, this.currentChar);
            } else if (this.currentChar == ")") {
                result = new Token(RPAREN, this.currentChar);
            } else if (this.currentChar == "{") {
                result = new Token(LBRACE, this.currentChar);
            } else if (this.currentChar == "}") {
                result = new Token(RBRACE, this.currentChar);
            } else if (this.currentChar == "[") {
                result = new Token(LBRACKET, this.currentChar);
            } else if (this.currentChar == "]") {
                result = new Token(RBRACKET, this.currentChar);
            } else if (this.currentChar == ";") {
                result = new Token(SEMICOLON, this.currentChar);
            } else if (this.currentChar == ",") {
                result = new Token(COMMA, this.currentChar);
            } else if (this.currentChar == ":") {
                result = new Token(COLON, this.currentChar);
            } else {
                this.error();
            }

            this.advance();
            return result;
        }

        return new Token(EOF, null);
    }

    lex(){
        let result = [];
        let token = this.getNextToken();
        while(token.type != EOF){
            result.push(token);
            token = this.getNextToken();
        }
        return result;
    }

}

// Test

let text = `
fn add(a, b) {
    return a + b;
}

add(2, 3);
`;

let lexer = new Lexer(text);

let tokens = lexer.lex();

// console.log(tokens)

class AST {
    constructor() {
        this.root = null;
    }
}

class ASTNode {
    constructor(type, value) {
        this.type = type;
        this.value = value;
        this.children = [];
    }
}

/*

{
    "type": "program",
    "value": "",
    "children": [
        {
            "type": "MathExpression",
            "value": "+",
            "children": [
                {
                    "type": "NumberLiteral",
                    "value":"2",
                    "children": []
                },
                {
                    "type": "NumberLiteral",
                    "value":"3",
                    "children": []
                }
            ]
        }        
}
*/

class Parser {
    constructor(tokens){
        this.tokens = tokens;
        this.pos = 0;
        this.currentToken = this.tokens[this.pos];
    }

    error(){
        throw "Invalid syntax";
    }

    advance(){
        this.pos++;
        if(this.pos > this.tokens.length - 1){
            this.currentToken = null;
        } else {
            this.currentToken = this.tokens[this.pos];
        }
    }

    eat(tokenType){
        if(this.currentToken.type == tokenType){
            this.advance();
        } else {
            this.error();
        }
    }

    parse(){
        let ast = new AST();
        ast.root = this.program();
        return ast;
    }
}

let parser = new Parser(tokens);

let ast = parser.parse();

console.log(
    JSON.stringify(ast, null, 2)
)