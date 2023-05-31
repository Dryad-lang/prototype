/*
---------------------------------------------------------------------------------------------------------------------

    Dryad programing language
    2023, by Dryad team

---------------------------------------------------------------------------------------------------------------------


    Tokenizer

*/

/*

Token table is an table of objects that contain the tokens and their types. 
The token table is used to identify the tokens and is a struct to use for makeing the tokens.

token table format:

{
    "token_class": {
        "tester": function (imput_char/text) {
            // This function will test if the char matches with one of the tokens in the token class
            // The tester is an way to make simple to add new tokens to the token class
            // This make the tokenizer more flexible and easy to use because some tokens
            // can have different ways to be identified and it can be the same for all the tokens
            // ex: some tokens are char but others are string 

            // This return an object with the token and the type
            -> { 
                match: true/false, 
                token: [The token that matches], 
                type: [Type of the token that matches]
            }

            -> Some regex for testing the char
            -> Some way to get the tested token if it matches
        },
        'token': 'type',
        ...
    },
    ...
}
*/ 

// Token table
const TOKEN_TABLE = {
    // Punctuators
    "punctuators":     {
        "tester": function (input) { 
            let match = false;
            let token = null;
            let type = null;

            if (input in this) {
                match = true;
                token = input;
                type = this[input];
            }

            return {
                match: match,
                token: token,
                type: type,
            };
        },
        '(': 'LPAREN',
        ')': 'RPAREN',
        '{': 'LBRACE',
        '}': 'RBRACE',
        '[': 'LBRACKET',
        ']': 'RBRACKET',
        ',': 'COMMA',
        '.': 'DOT',
        ';': 'SEMICOLON',
        ':': 'COLON',
    },

    // Math operators
    "math_operators":       {
        "tester": function (input) {
            let match = false;
            let token = null;
            let type = null;

            if (input in this) {
                match = true;
                token = input;
                type = this[input];
            }

            return {
                match: match,
                token: token,
                type: type,
            };

        },
        '+': 'PLUS',
        '-': 'MINUS',
        '*': 'MULTIPLY',
        '/': 'DIVIDE',
        '%': 'MODULO',
        '**': 'POWER',
        '++': 'INCREMENT',
        '--': 'DECREMENT',
    },

    // Assignment operators
    "assignment_operators": {
        function (input) {

        },
        '=': 'ASSIGN',
        '+=': 'PLUS_ASSIGN',
        '-=': 'MINUS_ASSIGN',
        '*=': 'MULTIPLY_ASSIGN',
        '/=': 'DIVIDE_ASSIGN',
        '%=': 'MODULO_ASSIGN',
        '**=': 'POWER_ASSIGN',
    },

    // Comparison operators
    "comparison_operators": {
        'tester': function (input) {

            
        },
        '==': 'EQUAL',
        '!=': 'NOT_EQUAL',
        '>': 'GREATER_THAN',
        '<': 'LESS_THAN',
        '>=': 'GREATER_THAN_OR_EQUAL',
        '<=': 'LESS_THAN_OR_EQUAL',
    },

    // Logical operators
    "logical_operators":    {
        'tester': function (input) {

        },
        '&&': 'AND',
        '||': 'OR',
        '!': 'NOT',
    },

    // Keywords
    "keywords":             {
        'if': 'IF',
        'else': 'ELSE',
        'for': 'FOR',
        'while': 'WHILE',
        'do': 'DO',
        'break': 'BREAK',
        'continue': 'CONTINUE',
        'return': 'RETURN',
        'var': 'VAR',
        'let': 'LET',
        'const': 'CONST',
        'function': 'FUNCTION',
        'true': 'TRUE',
        'false': 'FALSE',
        'undefined': 'UNDEFINED',
    },

    // Types
    "types":                {
        'int': 'INT',
        'float': 'FLOAT',
        'string': 'STRING',
        'bool': 'BOOL',
        'array': 'ARRAY',
        'function': 'FUNCTION',
    },

    // Identifiers
    "identifiers":          {
        'identifier': 'IDENTIFIER',
    },

    // Literals
    "literals":             {
        'int_literal': 'INT_LITERAL',
        'float_literal': 'FLOAT_LITERAL',
        'string_literal': 'STRING_LITERAL',
        'bool_literal': 'BOOL_LITERAL',
        'array_literal': 'ARRAY_LITERAL',
        'object_literal': 'OBJECT_LITERAL',
        'function_literal': 'FUNCTION_LITERAL',
    },

    // Comments
    "comments":             {
        'comment': 'COMMENT',
    },

    // Whitespace
    "whitespace":           {
        'whitespace': 'WHITESPACE',
    },

    // Newline
    "newline":              {
        'newline': 'NEWLINE',
    },

    // End of file
    "eof":                  {
        'eof': 'EOF',
    },

    // Unknown
    "unknown":              {
        'unknown': 'UNKNOWN',
    },

    // Error
    "error":                {
        'error': 'ERROR',
    },
};

// Tests
// Punchtuators
console.log(TOKEN_TABLE.punctuators.tester('('));
// Math operators
console.log(TOKEN_TABLE.math_operators.tester('+'));


class Token{
    constructor(type, value, line, column) {
        this.type = type;
        this.value = value;
        this.line = line;
        this.column = column;
    }

    // Set the type
    setType(type) {
        this.type = type;
    }

    // Set the value
    setValue(value) {
        this.value = value;
    }

    // Set the line
    setLine(line) {
        this.line = line;
    }

    // Set the column
    setColumn(column) {
        this.column = column;
    }

    // Get the type
    getType() {
        return this.type;
    }

    // Get the value
    getValue() {
        return this.value;
    }

    // Get the line
    getLine() {
        return this.line;
    }

    // Get the column
    getColumn() {
        return this.column;
    }
}

// Tokenizer class
class Tokenizer {
    constructor() {
        this.token_table = TOKEN_TABLE;
        this.tokens = [];
        this.current_token = '';
        this.line = 1;
        this.column = 1;
        this.cursor = 0;
        this.current_char = '';
        this.input_text = '';
    }

    // Set The imput text
    setInputText(input_text) {
        this.input_text = input_text;
    }

    // Advance the cursor
    advanceCursor() {
        this.cursor++;
    }

    // Get the next char
    getNextChar() {
        // This will return the next char and advance the cursor
        let char = this.input_text[this.cursor];
        this.advanceCursor();
        return char;

        // this.advanceCursor();
        // return this.input_text[this.cursor++];
    }

    // Peek at the next char
    peekNextChar() {
        // This will return the next char but not advance the cursor
        return this.input_text[this.cursor + 1];
    }

    // Make Numbers
    makeNumber() {
        let number = '';
        let dot_count = 0;
        let digit_table = '0123456789';
        while (digit_table.includes(this.current_char) || this.current_char === '.') {
            if (this.current_char === '.') {
                dot_count++;
            }
            if (dot_count > 1) {
                return this.makeError('Invalid float number');
            }
            number += this.current_char;
            this.current_char = this.getNextChar();
        }

        if (number.includes('.')) {
            return new Token(this.token_table['literals']['float_literal'], parseFloat(number), this.line, this.column);
        }
        return new Token(this.token_table['literals']['int_literal'], parseInt(number), this.line, this.column);
    }

    // Make string
    makeString() {
        /*
        What is a string?
        A string is a sequence of characters. that start with " and end with "

        Example:
        "Hello world"
        But if you want to use " inside the string, you need to use \ before the "
        Example:
        "Hello \"world\""

        Can use \ caracters to use special characters like \n, \t, \r, \b, \f, \v, \0, \\, \', \" ... etc

        Warn: If is ' this is not a string, this is a character
        */ 

        let string = '';
        this.current_char = this.getNextChar();

        
    }

    // Make identifier
    makeIdentifier() {
        let identifier = '';
        function isAlphanum(char) {
            let alphanum_table = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_';
            return alphanum_table.includes(char);
        }

        while (isAlphanum(this.current_char)) {
            identifier += this.current_char;
            this.current_char = this.getNextChar();
        }

        if (this.token_table['keywords'].hasOwnProperty(identifier)) {
            return new Token(this.token_table['keywords'][identifier], identifier, this.line, this.column);
        }

        return new Token(this.token_table['identifiers']['identifier'], identifier, this.line, this.column);
    }
}

// Test make number
// let tokenizer = new Tokenizer();
// tokenizer.setInputText('123.456');
// console.log(tokenizer.makeNumber());

// // Test make string
let tokenizer = new Tokenizer();
tokenizer.setInputText('"Hello \\n world"');
console.log(tokenizer.makeString());

// Test make identifier
// let tokenizer = new Tokenizer();
// tokenizer.setInputText('hello');
// console.log(tokenizer.makeIdentifier());


// Exporting module
module.exports = Tokenizer;