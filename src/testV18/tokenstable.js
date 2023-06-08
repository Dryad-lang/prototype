const tokens_table = {
    
    // Punctuation
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
    
    // Operators
    '+': 'PLUS',
    '-': 'MINUS',
    '*': 'MULTIPLY',
    '/': 'DIVIDE',
    '%': 'MODULO',
    '^': 'POWER',

    // Comparison
    '==': 'EQUALS',
    '!=': 'NOT_EQUALS',
    '>': 'GREATER_THAN',
    '<': 'LESS_THAN',
    '>=': 'GREATER_THAN_OR_EQUAL',
    '<=': 'LESS_THAN_OR_EQUAL',
    '&&': 'AND',
    '||': 'OR',
    '!': 'NOT',

    // Assignment
    '=': 'ASSIGN',
    '+=': 'PLUS_ASSIGN',
    '-=': 'MINUS_ASSIGN',
    '*=': 'MULTIPLY_ASSIGN',
    '/=': 'DIVIDE_ASSIGN',
    '%=': 'MODULO_ASSIGN',
    '^=': 'POWER_ASSIGN',

    // Keywords
    'if': 'IF',
    'else': 'ELSE',
    'for': 'FOR',
    'while': 'WHILE',
    'do': 'DO',
    'break': 'BREAK',
    'continue': 'CONTINUE',
    'return': 'RETURN',
    'function': 'FUNCTION',
    'var': 'VAR',
    'const': 'CONST',
    'let': 'LET',
    'true': 'TRUE',
    'false': 'FALSE',
    'null': 'NULL',
    'undefined': 'UNDEFINED',
    
    // Types
    'int': 'INT',
    'float': 'FLOAT',
    'string': 'STRING',
    'bool': 'BOOL',
    'void': 'VOID',
    'object': 'OBJECT',
    'array': 'ARRAY',
    'function': 'FUNCTION',
    
    // Special
    'EOF': 'EOF'
};

module.exports = {
    tokens_table
};