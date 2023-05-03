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