/*
---------------------------------------------------------------------------------------------------------------------

    Dryad programing language
    2023, by Dryad team

---------------------------------------------------------------------------------------------------------------------


    Tokenizer

*/

// Token table
const TOKEN_TABLE = {
    // Punctuators
    "punctuators":     {
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
        '==': 'EQUAL',
        '!=': 'NOT_EQUAL',
        '>': 'GREATER_THAN',
        '<': 'LESS_THAN',
        '>=': 'GREATER_THAN_OR_EQUAL',
        '<=': 'LESS_THAN_OR_EQUAL',
    },

    // Logical operators
    "logical_operators":    {
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

// Tokenizer class
class Tokenizer {
    constructor() {
        this.tokens = [];
        this.token = '';
        this.line = 1;
        this.column = 1;
        this.file = '';
        this.file_content = '';
        this.file_length = 0;
        this.file_index = 0;
        this.token_table = TOKEN_TABLE;
    }
}

// Exporting module
module.exports = Tokenizer;