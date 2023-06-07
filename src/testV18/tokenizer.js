/*
-------------------------------------------------------------------------------------------------

    tokenizer.js - 

-------------------------------------------------------------------------------------------------

*/ 

const { tokens_table } = require('./tokenstable.js');


const keywords = [
    'if',
    'else',
    'for',
    'while',
    'do',
    'break',
    'continue',
    'return',
    'function',
    'var',
    'const',
    'let',
    'true',
    'false',
    'null',
    'undefined',
    'int',
    'float',
    'string',
    'bool',
    'void',
    'array',
    'function'
];

const operators = [
    '+',
    '-',
    '*',
    '/',
    '%',
    '^',
    '==',
    '!=',
    '>',
    '<',
    '>=',
    '<=',
    '&&',
    '||',
    '!',
    '=',
    '+=',
    '-=',
    '*=',
    '/=',
    '%=',
    '^='
];

const punctuation = [
    '(',
    ')',
    '{',
    '}',
    '[',
    ']',
    ',',
    '.',
    ';',
    ':'
];

const types = [
    'int',
    'float',
    'string',
    'bool',
    'void',
    'object',
    'array',
    'function'
];

const special = [
    'EOF'
];

const whitespace = [
    ' ',
    '\t',
    '\n'
];

const digits = [
    '0',
    '1',
    '2',
    '3', 
    '4', 
    '5', 
    '6', 
    '7', 
    '8', 
    '9'
];

const letters = [
    'a',
    'b',
    'c', 
    'd', 
    'e', 
    'f', 
    'g', 
    'h', 
    'i', 
    'j', 
    'k', 
    'l', 
    'm', 
    'n', 
    'o', 
    'p', 
    'q', 
    'r', 
    's', 
    't', 
    'u', 
    'v', 
    'w', 
    'x', 
    'y', 
    'z',
    'A',
    'B',
    'C', 
    'D', 
    'E', 
    'F', 
    'G', 
    'H', 
    'I', 
    'J', 
    'K', 
    'L', 
    'M', 
    'N', 
    'O', 
    'P', 
    'Q', 
    'R', 
    'S', 
    'T', 
    'U', 
    'V', 
    'W', 
    'X', 
    'Y', 
    'Z'
];

const alphanum = letters.concat(digits);

const hex = digits.concat([
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F'
]);


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

// Modular tokenizer
class Tokenizer {
    constructor(input) {
        this.input = input;
        this.index = 0;
        this.line = 1;
        this.column = 1;
        this.tokenStack = new TokenStack();
    }
    
    // Get the next character in the input
    peek() {
        return this.input[this.index];
    }

    // Get the next character in the input and advance the index
    next() {
        const char = this.input[this.index++];
        if (char === '\n') {
            this.line++;
            this.column = 1;
        } else {
            this.column++;
        }
        return char;
    }

    // Check if the input has been fully tokenized
    eof() {
        return this.index >= this.input.length;
    }

    // Check if the input starts with a given string
    startsWith(str) {
        return this.input.slice(this.index).startsWith(str);
    }

    // Check if the input starts with a given regex
    startsWithRegex(regex) {
        return regex.test(this.input.slice(this.index));
    }

    // Check if the input starts with a given character
    startsWithChar(char) {
        return this.peek() === char;
    }

    // Check if the input starts with a given character and advance the index
    startsWithCharAndAdvance(char) {
        if (this.startsWithChar(char)) {
            this.next();
            return true;
        }
        return false;
    }

    // Make String 
    makeString() {
        let str = '';
        while (!this.eof() && !this.startsWithChar('"')) {
            str += this.next();
        }
        return str;
    }

    // Make Number
    makeNumber() {
        let str = '';
        while (!this.eof() && digits.includes(this.peek())) {
            str += this.next();
        }
        if (this.startsWithChar('.')) {
            str += this.next();
            while (!this.eof() && digits.includes(this.peek())) {
                str += this.next();
            }
            return new Token('FLOAT', parseFloat(str), this.line, this.column);
        }
        return new Token('INT', parseInt(str), this.line, this.column);
    }

    // Make Identifier
    makeIdentifier() {
        let str = '';
        while (!this.eof() && alphanum.includes(this.peek())) {
            str += this.next();
        }
        if (keywords.includes(str)) {
            return new Token(tokens_table[str], str, this.line, this.column);
        }
        else {
            return new Token('IDENTIFIER', str, this.line, this.column);
        }
        
    }

    // Make Hexadecimal
    makeHexadecimal() {
        let str = '';
        while (!this.eof() && hex.includes(this.peek())) {
            str += this.next();
        }
        return new Token('INT', parseInt(str, 16), this.line, this.column);
    }
    
    // Make Character
    makeCharacter() {
        let str = '';
        while (!this.eof() && !this.startsWithChar("'")) {
            // If length is greater than 1, then it's an escape sequence or an error
            if (str.length > 1) {
                if (str.length === 2) {
                    // Check for escape sequences
                    if (str === '\\n') {
                        str = '\n';
                    } else if (str === '\\t') {
                        str = '\t';
                    } else if (str === '\\r') {
                        str = '\r';
                    } else if (str === '\\\'') {
                        str = '\'';
                    } else if (str === '\\"') {
                        str = '\"';
                    } else if (str === '\\\\') {
                        str = '\\';
                    } else {
                        throw new Error(`Invalid escape sequence: ${str}`);
                    }
                } else {
                    throw new Error(`Invalid character: ${str}`);
                }
            }
        }
        return new Token('CHAR', str, this.line, this.column);
    }

    // Make Token
    makeToken() {
        // Ignore whitespace
        while (!this.eof() && whitespace.includes(this.peek())) {
            this.next();
        }
        // Return EOF token
        if (this.eof()) {
            return new Token('EOF', null, this.line, this.column);
        }
        // Return punctuation token
        if (punctuation.includes(this.peek())) {
            return new Token(tokens_table[this.next()], null, this.line, this.column);
        }
        // Return operator token
        if (operators.includes(this.peek())) {
            let str = this.next();
            if (this.startsWithChar('=')) {
                str += this.next();
            }
            return new Token(tokens_table[str], null, this.line, this.column);
        }
        // Return string token
        if (this.startsWithChar('"')) {
            this.next();
            const str = this.makeString();
            this.next();
            return new Token('STRING', str, this.line, this.column);
        }
        // Return number token
        if (digits.includes(this.peek())) {
            return this.makeNumber();
        }
        // Return identifier token
        if (letters.includes(this.peek())) {
            return this.makeIdentifier();
        }
        // Return character token
        if (this.startsWithChar("'")) {
            this.next();
            const str = this.makeCharacter();
            this.next();
            return new Token('CHAR', str, this.line, this.column);
        }
        // Return invalid token
        throw new Error(`Invalid token: ${this.peek()}`);
    }

    // Tokenize
    tokenize() {
        while (!this.eof()) {
            this.tokenStack.push(this.makeToken());
        }
        return this.tokenStack;
    }
}

// Test
// const input = `
//     var x = 5;
//     var y = 10;
//     var z = x + y;
//     print(z);
//     "Hello World!"
// `;

// const tokenizer = new Tokenizer(input);
// const tokens = tokenizer.tokenize();
// console.log(tokens);

module.exports = {
    Tokenizer: Tokenizer,
    Token: Token,
    TokenStack: TokenStack
};