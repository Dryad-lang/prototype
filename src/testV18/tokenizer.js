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
        'tester': function (input) {
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
        '&&': 'AND',
        '||': 'OR',
        '!': 'NOT',
    },

    // Keywords
    "keywords":             {
        'tester': function (input) {
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
        'if': 'IF_KW',
        'else': 'ELSE_KW',
        'for': 'FOR_KW',
        'while': 'WHILE_KW',
        'do': 'DO_KW',
        'break': 'BREAK_KW',
        'continue': 'CONTINUE_KW',
        'return': 'RETURN_KW',
        'var': 'VAR_KW',
        'let': 'LET_KW',
        'const': 'CONST_KW',
        'function': 'FUNCTION_KW',
        'true': 'TRUE_KW',
        'false': 'FALSE_KW',
        'undefined': 'UNDEFINED_KW',
        'int': 'INT_KW',
        'float': 'FLOAT_KW',
        'string': 'STRING_KW',
        'bool': 'BOOL_KW',
        'array': 'ARRAY_KW',
        'function': 'FUNCTION_KW'
    },

    // Non-char related tokens this is for tokens that are not related to a single character or group
    /*
    This can be:
        - Identifiers
        - Literals
        - Comments
        - Whitespace
        - Newline
        - End of file
    */

    // Identifiers 
    "identifiers":          {
        "tester": function (input) {
            let match = false;
            let token = null;
            let type = null;

            // Test with regex
            let regex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
        },
        'identifier': 'IDENTIFIER',
    },

    // Literals
    "literals":             {
        'tester': function (input) {
            let match = false;
            let token = null;
            let type = null;

            let int_regex = /^[0-9]+$/;
            let float_regex = /^[0-9]+\.[0-9]+$/;
            let bool_regex = /^(true|false)$/;
            let string_regex = /^"$/;

            if (int_regex.test(input)) {
                match = true;
                token = input;
                type = this['int_literal'];
            } else if (float_regex.test(input)) {
                match = true;
                token = input;
                type = this['float_literal'];
            } else if (bool_regex.test(input)) {
                match = true;
                token = input;
                type = this['bool_literal'];
            } else if (string_regex.test(input)) {
                match = true;
                token = input;
                type = this['string_literal'];
            }

            return {
                match: match,
                token: token,
                type: type,
            };
        }, 
        'int_literal': 'INT_LITERAL',
        'float_literal': 'FLOAT_LITERAL',
        'string_literal': 'STRING_LITERAL',
        'bool_literal': 'BOOL_LITERAL',
        'array_literal': 'ARRAY_LITERAL',
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

// Testers 
// console.log(TOKEN_TABLE['punctuators']['tester'](')'));
// console.log(TOKEN_TABLE['math_operators']['tester']('+'));



// Tokenizing Order
const TOKENIZING_ORDER = [
    'punctuators',
    'math_operators',
    'assignment_operators',
    'comparison_operators',
    'logical_operators',
    'keywords',
];

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

class TokenStack {
    constructor() {
        this.tokens = [];
    }

    // Push a token
    push(token) {
        this.tokens.push(token);
    }

    // Pop a token
    pop() {
        return this.tokens.pop();
    }

    // Peek at the top of the stack
    peek() {
        return this.tokens[this.tokens.length - 1];
    }

    // Get the length of the stack
    length() {
        return this.tokens.length;
    }
}

// Tokenizing ORDER

let TOKEN_STACK = new TokenStack();

// Tokenizer class
class Tokenizer {
    constructor() {
        this.token_table = TOKEN_TABLE;
        this.token_stack = TOKEN_STACK;
        this.tokenizing_order = TOKENIZING_ORDER;
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
        let string = '';
        this.advanceCursor();
        while (this.current_char !== '"') {
            string += this.current_char;
            this.current_char = this.getNextChar();
        }
        this.current_char = this.getNextChar();
        return new Token(this.token_table['literals']['string_literal'], string, this.line, this.column);
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

    // Make comment
    makeComment() {
        // This will ignore the comment
        while (this.current_char !== '\n' || this.current_char !== '\r') {
            this.current_char = this.getNextChar();
        }
    }

    // Make error
    makeError(error) {
        return new Token(this.token_table['error']['error'], error, this.line, this.column);
    }

    /*
    
    How this tokenizer works:

    */ 

    // Test char stream
    testCharStream() {
        /*
        How char stream works:

        1. Basically, the cursor will get a certain amount of chars from the input text
        and will create an stack of chars. (the amount will be fixed) then will be tryed for elimination
        to get tokens.

        Example:

        Imput: a = 1 + 2

        Char stream: a=1+2
        
        search for tokens:
        1 2 3 4 5
        a = 1 + 2

        1 > a (identifier) -> push to stack
        2 > = (when find an operator try to get ne nexts 3 chars for verify if is multi char operator like ==) 
        = next 3 chars are + 2 so is not == (comparison operator) -> push to stack
        3 > 1 (int number) -> push to stack
        4 > + (arithmetic operator) -> push to stack
        5 > 2 (int number) -> push to stack

        this funtion only return 1 token at time and will be called until the end of the input text
        and move the cursor to the next token if token is returned

        like

        a = 1 + 2 (identifier)
        ^
        = 1 + 2 (equal)
        ^
        1 + 2   (int number)
        ^
        + 2 (plus)
        ^
        2   (int number)
        ^
        EOF (eof)

        Return the token and move the cursor to the next token

        other example:

        if (a == 1) {return a;}       (if statement)
        ^
        (a == 1) {return a;}    (l_paren)
        ^
        a == 1) {return a;}    (identifier)
        ^
        == 1) {return a;}   (equal)
        ^
        1) {return a;}  (int number)
        ^
        ) {return a;}   (r_paren)
        ^
        {return a;} (l_brace)
        ^
        return a;} (return)
        ^
        a;} (identifier)
        ^
        ;} (semicolon)
        ^
        } (r_brace)
        ^
        EOF (eof)
        
        */ 

        let char_stack = [];    // This will be the char stack
        let char_stack_size = 3; // The size of the char stack (the amount of chars to get from the input text at time)
        let cursor_save = this.cursor; // Save the current cursor position
        let cursor_next = 0; // This will be the next cursor position
        let char_stream = ''; // This will be the char stream

        // Get the char stream ignoring the whitespace and newline
        while (this.cursor < this.input_text.length) {
            if (this.current_char !== ' ' && this.current_char !== '\n' && this.current_char !== '\r') {
                char_stream += this.current_char;
            }
            this.current_char = this.getNextChar();
        }
        // console.log(char_stream);

        /*
        Testing by elimination:

        Test and if not match remove the last char from the char stream and test again until match or the char stream is empty
        if the char stream is empty return an error

        */ 

        // Get the next char stream
        function getNextCharStream(char_stream) {
            let new_char_stream = '';
            for (let i = 0; i < char_stream.length - 1; i++) {
                new_char_stream += char_stream[i];
            }
            return new_char_stream;
        }


        // Validate function for testing the char stream
        function validadeStream(char_stream) {
            let match = false;
            let token = null;
            let type = null;
            console.log(char_stream);

            /*
            ToDo:

            Fix the testing for make tests accuretly
            
            */ 
            // Test the char stream
            for (let i = 0; i < TOKENIZING_ORDER.length; i++) {
                let token_class = TOKENIZING_ORDER[i];
                let token_class_tester = TOKEN_TABLE[token_class]['tester'];
                let token_class_test = token_class_tester(char_stream);
                console.log(token_class_test);
                if (token_class_test['match']) {
                    match = true;
                    token = token_class_test['token'];
                    type = token_class_test['type'];
                    break;
                }
            }

            return {
                match: match,
                token: token,
                type: type,
            };
        }

        console.log(validadeStream("+"));

        // // Test the char stream
        // while (char_stream.length > 0) {
        //     // console.log(char_stream);
        //     let char_stream_test = validadeStream(char_stream);
        //     if (char_stream_test['match']) {
        //         console.log("Match: " + char_stream_test['token']);
        //     }
        //     else if (!char_stream_test['match']) {
        //         console.log("No match");
        //         char_stream = getNextCharStream(char_stream);
        //     }
        // }
    }
}

// Test make number
// let tokenizer = new Tokenizer();
// tokenizer.setInputText('123.456');
// console.log(tokenizer.makeNumber());

// // Test make string
// let tokenizer = new Tokenizer();
// tokenizer.setInputText('"Hello \\n world"');
// console.log(tokenizer.makeString());

// Test make identifier
// let tokenizer = new Tokenizer();
// tokenizer.setInputText('hello');
// console.log(tokenizer.makeIdentifier());

// Test make comment
// let tokenizer = new Tokenizer();
// tokenizer.setInputText('// This is a comment\n');
// console.log(tokenizer.makeComment());

// Test test char stream
let tokenizer = new Tokenizer();
tokenizer.setInputText('a = 1 + 2');
tokenizer.testCharStream();
console.log(tokenizer.tokens);

// Exporting module
module.exports = Tokenizer;