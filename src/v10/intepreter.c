// Imports
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include <math.h>

/*
Tokens:

TT_INT			= 'INT' <integer>
TT_FLOAT    	= 'FLOAT' <float>
TT_STRING		= 'STRING' <string>
TT_IDENTIFIER	= 'IDENTIFIER' <identifyer>
TT_KEYWORD		= 'KEYWORD' <keyword>
TT_PLUS     	= 'PLUS' +
TT_MINUS    	= 'MINUS' -
TT_MUL      	= 'MUL' * 
TT_DIV      	= 'DIV' /
TT_POW			= 'POW' ^
TT_EQ			= 'EQ' =
TT_LPAREN   	= 'LPAREN' (
TT_RPAREN   	= 'RPAREN' ]
TT_LSQUARE      = 'LSQUARE' [
TT_RSQUARE      = 'RSQUARE' ]
TT_EE           = 'EE' ==
TT_NE           = 'NE' !=
TT_LT           = 'LT' <
TT_GT           = 'GT' >
TT_LTE			= 'LTE' <=
TT_GTE			= 'GTE' >=
TT_COMMA		= 'COMMA' ,
TT_ARROW		= 'ARROW' ->
TT_NEWLINE		= 'NEWLINE' \n  \r
TT_EOF			= 'EOF' \0

Keywords

KEYWORDS = [
  'VAR',
  'AND',
  'OR',
  'NOT',
  'IF',
  'ELIF',
  'ELSE',
  'FOR',
  'TO',
  'STEP',
  'WHILE',
  'FUN',
  'THEN',
  'END',
  'RETURN',
  'CONTINUE',
  'BREAK',
]

Letters
A-Z
a-z
_

Numbers
0-9
*/

// Token Types
typedef enum {
    TT_INT,
    TT_FLOAT,
    TT_STRING,
    TT_IDENTIFIER,
    TT_KEYWORD,
    TT_PLUS,
    TT_MINUS,
    TT_MULTIPLY,
    TT_DIVIDE,
    TT_POW,
    TT_MODULE,
    TT_EQUAL,
    TT_LPAREN,
    TT_RPAREN,
    TT_LBRACE,
    TT_RBRACE,
    TT_LBRACKET,
    TT_RBRACKET,
    TT_EQUAL_EQUAL,
    TT_NOT_EQUAL,
    TT_LESS_THAN,
    TT_GREATER_THAN,
    TT_LESS_THAN_EQUAL,
    TT_GREATER_THAN_EQUAL,
    TT_NOT,
    TT_AND,
    TT_OR,
    TT_COMMA,
    TT_ARROW,
    TT_NEWLINE,
    TT_EOF,
    TT_INCREMENT,
    TT_DECREMENT,
    TT_SEMICOLON,
    TT_COLON,
    TT_DOT,
} TokenType;

// Keywords
char *KEYWORDS[] = {
    "import",
    "var",
    "and",
    "or",
    "not",
    "if",
    "elif",
    "else",
    "for",
    "to",
    "step",
    "while",
    "function",
    "then",
    "end",
    "return",
    "continue",
    "break",
    "true",
    "false",
    "null",
    "in",
    "as",
    "class",
    "static",
    "this",
    "super",
    "new"
};

// Letters
char LETTERS[] = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_";

// Digits
char NUMBERS[] = "0123456789";

// Letters And Numbers
char LETTERS_AND_NUMBERS[] = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_0123456789";

// Is letter
int is_letter(char c) {
    for (int i = 0; i < strlen(LETTERS); i++) {
        if (c == LETTERS[i]) {
            return 1;
        }
    }
    return 0;
}

// Is number
int is_number(char c) {
    for (int i = 0; i < strlen(NUMBERS); i++) {
        if (c == NUMBERS[i]) {
            return 1;
        }
    }
    return 0;
}

// Is letter or number
int is_letter_or_number(char c) {
    for (int i = 0; i < strlen(LETTERS_AND_NUMBERS); i++) {
        if (c == LETTERS_AND_NUMBERS[i]) {
            return 1;
        }
    }
    return 0;
}

// ----------------------------------------------------------------

// Errors
/*
Bascicaly errors will work like python 

SyntaxError: invalid syntax
NameError: name 'x' is not defined
TypeError,: unsupported operand type(s) for +: 'int' and 'str'

i = 0;
^
Error on pos 1;

errors will be a traceback 
this means:

Errors will have a list whe the process end if has errors throw
*/ 
// Position struct
typedef struct {
    int line;
    int column;
    char *file;
} Position;

// Error Struct
typedef struct {
    char *message;
    int line;
    int column;
    char *file;
    Position start;
    Position end;
} Error;

// Token Struct
typedef struct {
    TokenType type;
    char *value;
    int line;
    int column;
    char *file;
} Token;

// Errors list structure
typedef struct {
    Error *errors;
    int length;
} Errors;

// Token list structure
typedef struct {
    Token *tokens;
    int length;
} Tokens;

// Position
Position *pos;

// Errors
Errors *errors;

// Tokens
Tokens *tokens;


// Error functions
void add_error(char *message, int line, int column, char *file, Position *start, Position *end) {
    errors->length++;
    errors->errors = realloc(errors->errors, sizeof(Error) * errors->length);
    Error *error = &errors->errors[errors->length - 1];
    error->message = message;
    error->line = line;
    error->column = column;
    error->file = file;
    error->start = *start;
    error->end = *end;
}

// Token functions
void add_token(TokenType type, char *value, int line, int column, char *file) {
    tokens->length++;
    tokens->tokens = realloc(tokens->tokens, sizeof(Token) * tokens->length);
    Token *token = &tokens->tokens[tokens->length - 1];
    token->type = type;
    token->value = value;
    token->line = line;
    token->column = column;
    token->file = file;
}

int get_token_lengt(){
    return tokens->length;
}

Token *get_token(int index){
    return &tokens->tokens[index];
}


// ----------------------------------------------------------------
// -------------------------Lexer----------------------------------
// ----------------------------------------------------------------

int _pos = 0;
char *_file = NULL;
char _current_char = '\0';
int _line = 1;
int _column = 1;

void advance() {
    _pos++;
    _column++;
    if (_pos >= strlen(_file)) {
        _current_char = '\0';
    } else {
        _current_char = _file[_pos];
    }
}

void skip_whitespace() {
    while (_current_char != '\0' && (_current_char == ' ' || _current_char == '\t' || _current_char == '\r')) {
        advance();
    }
}

void skip_comment() {
    while (_current_char != '\0' && _current_char != ' ' && _current_char != '\t' && _current_char != '\r') {
        advance();
    }
}

char peek_next(){
    if (_pos + 1 >= strlen(_file)) {
        return '\0';
    } else {
        return _file[_pos + 1];
    }
}

void jumpLine() {
    _line++;
    _column = 1;
    advance();
}

char *make_string() {
    int start_pos = _pos;
    while (_current_char != '\0' && _current_char != '"') {
        advance();
    }
    int end_pos = _pos;
    int length = end_pos - start_pos;
    char *value = malloc(length + 1);
    memcpy(value, &_file[start_pos], length);
    value[length] = '\0';
    return value;
}

char *make_number() {
    int start_pos = _pos;
    int dots = 0;
    while (_current_char != '\0' && (_current_char == '.' || (_current_char >= '0' && _current_char <= '9'))) {
        if (_current_char == '.') {
            dots++;
        }
        advance();
    }
    int end_pos = _pos;
    int length = end_pos - start_pos;
    char *value = malloc(length + 1);
    memcpy(value, &_file[start_pos], length);
    value[length] = '\0';
    if (dots == 0) {
        add_token(TT_INT, value, _line, _column, _file);
    } else if (dots == 1) {
        add_token(TT_FLOAT, value, _line, _column, _file);
    } else {
        add_error("Invalid number", _line, _column, _file, NULL, NULL);
    }
    return value;
}



char *make_identifier() {
    int start_pos = _pos;
    // Verify if is a keyword
    while (_current_char != '\0' && (_current_char == '_' || (_current_char >= '0' && _current_char <= '9') || (_current_char >= 'a' && _current_char <= 'z') || (_current_char >= 'A' && _current_char <= 'Z'))) {
        advance();
    }
    int end_pos = _pos;
    int length = end_pos - start_pos;
    char *value = malloc(length + 1);
    memcpy(value, &_file[start_pos], length);
    value[length] = '\0';
    // Verify if is a keyword
    for (int i = 0; i < sizeof(KEYWORDS) / sizeof(char *); i++) {
        if (strcmp(value, KEYWORDS[i]) == 0) {
            add_token(TT_KEYWORD, value, _line, _column, _file);
            return value;
        }
    }
    add_token(TT_IDENTIFIER, value, _line, _column, _file);
    return value;
}

void make_tokens() {
    // Use recursivity for better efficiency
    printf("Current char: %c", _current_char);
    if (_current_char == '\0'){
        return;
    }
    else if (_current_char == ' ' || _current_char == '\t' || _current_char == '\r') {
        skip_whitespace();
        make_tokens();
        return;
    }
    else if (_current_char == '#') {
        skip_comment();
        make_tokens();
        return;
    }
    else if (_current_char == '+') {
        if(peek_next() == '+') {
            add_token(TT_INCREMENT, "++", _line, _column, _file);
            advance();
            advance();
        } else {
            add_token(TT_PLUS, "+", _line, _column, _file);
            advance();
        }
        make_tokens();
        return;
    }
}