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

    lex(input){
        let result = [];
        let token = this.getNextToken();
        while(token.type != EOF){
            result.push(token);
            token = this.getNextToken();
        }
        return result;
    }

}


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
    constructor(lexer) {
        this.lexer = lexer;
        this.currentToken = this.lexer.getNextToken();
    }

    error() {
        throw "Invalid syntax";
    }

    eat(tokenType) {
        if (this.currentToken.type == tokenType) {
            this.currentToken = this.lexer.getNextToken();
        } else {
            this.error();
        }
    }

    getNextBody(node, position){
        return node.body[position];
    }

    parse(input) {
        let ast = new AST();
        ast.root = this.program();
        return ast;
    }

    program() {
        let node = new ASTNode("program", "");
        while (this.currentToken.type != EOF) {
            node.children.push(this.statement());
        }
        return node;
    }

    statement() {
        if (this.currentToken.type == IDENTIFIER) {
            return this.choiceIdentifyer();
        } else if (this.currentToken.type == FN) {
            return this.functionDefinition();
        } else if (this.currentToken.type == RETURN) {
            return this.returnStatement();
        } else if (this.currentToken.type == STRING) {
            return this.stringLiteral();
        } else if (this.currentToken.type == NUMBER) {
            return this.numberLiteral();
        } else {
            return this.expressionStatement();
        }
    }

    choiceIdentifyer() {
        // Switch between function calls and assingment statement
        let type = this.currentToken;
        this.eat(IDENTIFIER);
        if (this.currentToken.type == LPAREN) {
            return this.functionCall(type);
        }
        return this.assignmentStatement(type);
    }

    functionCall(type) {
        let node = new ASTNode("functionCall", type.value);
        this.eat(LPAREN);
        while (this.currentToken.type != RPAREN) {
            node.children.push(this.expression());
            if (this.currentToken.type == COMMA) {
                this.eat(COMMA);
            }
        }
        this.eat(RPAREN);
        return node;
    }

    assignmentStatement(type) {
        /*
        Types of assingments:

        a = 2; literals
        a = 1 + 1; expressions
        a = sum(1, 1); functions call
        */

        let node = new ASTNode("assignmentStatement", type.value);
        this.eat(ASSIGN);
        node.children.push(this.expression());
        this.eat(SEMICOLON);
        return node;
    }

    functionDefinition() {
        let node = new ASTNode("functionDefinition", "");
        this.eat(FN);
        node.children.push(this.identifier());
        this.eat(LPAREN);
        node.children.push(this.functionParameters());
        this.eat(RPAREN);
        node.children.push(this.blockStatement());
        return node;
    }

    functionParameters() {
        let node = new ASTNode("functionParameters", "");
        while (this.currentToken.type != RPAREN) {
            node.children.push(this.identifier());
            if (this.currentToken.type == COMMA) {
                this.eat(COMMA);
            }
        }
        return node;
    }

    returnStatement() {
        let node = new ASTNode("returnStatement", "");
        this.eat(RETURN);
        node.children.push(this.expression());
        this.eat(SEMICOLON);
        return node;
    }

    expressionStatement() {
        let node = new ASTNode("expressionStatement", "");
        node.children.push(this.expression());
        this.eat(SEMICOLON);
        return node;
    }

    blockStatement() {
        let node = new ASTNode("blockStatement", "");
        this.eat(LBRACE);
        while (this.currentToken.type != RBRACE) {
            node.children.push(this.statement());
        }
        this.eat(RBRACE);
        return node;
    }

    expression() {
        return this.addition();
    }

    addition() {
        let node = this.multiplication();
        while (this.currentToken.type == PLUS || this.currentToken.type == MINUS) {
            let token = this.currentToken;
            if (token.type == PLUS) {
                this.eat(PLUS);
            } else if (token.type == MINUS) {
                this.eat(MINUS);
            }
            node = new ASTNode("MathExpression", token.value, [node, this.multiplication()]);
        }
        return node;
    }

    multiplication() {
        let node = this.factor();
        while (this.currentToken.type == MULTIPLY || this.currentToken.type == DIVIDE) {
            let token = this.currentToken;
            if (token.type == MULTIPLY) {
                this.eat(MULTIPLY);
            } else if (token.type == DIVIDE) {
                this.eat(DIVIDE);
            }
            node = new ASTNode("MathExpression", token.value, [node, this.factor()]);
        }
        return node;
    }

    factor() {
        let token = this.currentToken;
        if (token.type == PLUS) {
            this.eat(PLUS);
            return new ASTNode("MathExpression", token.value, [this.factor()]);
        } else if (token.type == MINUS) {
            this.eat(MINUS);
            return new ASTNode("MathExpression", token.value, [this.factor()]);
        } else if (token.type == NUMBER) {
            this.eat(NUMBER);
            return new ASTNode("NumberLiteral", token.value);
        } else if (token.type == LPAREN) {
            this.eat(LPAREN);
            let node = this.expression();
            this.eat(RPAREN);
            return node;
        } else if (token.type == IDENTIFIER) {
            return this.identifier();
        }
    }

    identifier() {
        let token = this.currentToken;
        this.eat(IDENTIFIER);
        return new ASTNode("Identifier", token.value);
    }

    stringLiteral() {
        let token = this.currentToken;
        this.eat(STRING);
        return new ASTNode("StringLiteral", token.value);
    }

    numberLiteral() {
        let token = this.currentToken;
        this.eat(NUMBER);
        return new ASTNode("NumberLiteral", token.value);
    }

    eat(tokenType) {
        if (this.currentToken.type == tokenType) {
            this.currentToken = this.lexer.getNextToken();
        } else {
            this.error();
        }
    }

    error() {
        throw "Syntax Error";
    }
}

// Test

// let text = `
// fn sum(a, b) {
//     return a + b;
// }
// `

// let lexer = new Lexer(text);

// let parser = new Parser(lexer);

// let ast = parser.parse();

// console.log(
//     JSON.stringify(ast, null, 2)
// );