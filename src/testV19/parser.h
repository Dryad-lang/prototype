/*

Parser.h

std::map<std::string, std::regex> lexeme_map = {
    // Keywords
    {"LX_IF", std::regex("if(?![a-zA-Z0-9_])")},
    {"LX_ELSE", std::regex("else(?![a-zA-Z0-9_])")},
    {"LX_WHILE", std::regex("while(?![a-zA-Z0-9_])")},
    {"LX_DO", std::regex("do(?![a-zA-Z0-9_])")},
    {"LX_FOR", std::regex("for(?![a-zA-Z0-9_])")},
    {"LX_FUNC", std::regex("function(?![a-zA-Z0-9_])")},
    {"LX_VAR", std::regex("var(?![a-zA-Z0-9_])")},
    {"LX_TRUE", std::regex("true(?![a-zA-Z0-9_])")},
    {"LX_FALSE", std::regex("false(?![a-zA-Z0-9_])")},
    {"LX_EMPTY", std::regex("empty(?![a-zA-Z0-9_])")},
    {"LX_RETURN", std::regex("return(?![a-zA-Z0-9_])")},
    {"LX_IMPORT", std::regex("import(?![a-zA-Z0-9_])")},
    {"LX_EXPORT", std::regex("export(?![a-zA-Z0-9_])")},
    {"LX_AS", std::regex("as(?![a-zA-Z0-9_])")},
    {"LX_FROM", std::regex("from(?![a-zA-Z0-9_])")},

    // Constants
    {"LX_ID", std::regex("[a-zA-Z_][a-zA-Z0-9_]*")},
    {"LX_NUMBER", std::regex("[0-9]+(\\.[0-9]*)?")},
    {"LX_STRING", std::regex("\"(\\\\\"|[^\"])*\"|'(\\\\'|[^'])*'")},

    // Punctuation
    {"LX_LPAREN", std::regex("\\(")},
    {"LX_RPAREN", std::regex("\\)")},
    {"LX_LCURLY", std::regex("\\{")},
    {"LX_RCURLY", std::regex("\\}")},
    {"LX_LBRACKET", std::regex("\\[")},
    {"LX_RBRACKET", std::regex("\\]")},
    {"LX_SEMICOLON", std::regex(";")},
    {"LX_COLON", std::regex(":")},
    {"LX_COMMA", std::regex(",")},
    {"LX_DOT", std::regex("\\.")},

    // Logical
    {"LX_LAND", std::regex("&&")},
    {"LX_LOR", std::regex("\\|\\|")},

    // Special assign
    {"LX_PLUSSET", std::regex("\\+=")},
    {"LX_MINUSSET", std::regex("-=")},
    {"LX_MULTSET", std::regex("\\*=")},
    {"LX_DIVSET", std::regex("/=")},
    {"LX_MODULOSET", std::regex("%=")},
    {"LX_ANDSET", std::regex("&=")},
    {"LX_ORSET", std::regex("\\|=")},
    {"LX_XORSET", std::regex("\\^=")},
    {"LX_LSHIFTSET", std::regex("<<=")},
    {"LX_RSHIFTSET", std::regex(">>=")},

    // Binary
    {"LX_AND", std::regex("&")},
    {"LX_OR", std::regex("\\|")},
    {"LX_XOR", std::regex("\\^")},
    {"LX_NOT", std::regex("~")},
    {"LX_LSHIFT", std::regex("<<")},
    {"LX_RSHIFT", std::regex(">>")},

    // Comparison
    {"LX_EQ", std::regex("==")},
    {"LX_NEQ", std::regex("!=")},
    {"LX_LE", std::regex("<=")},
    {"LX_GE", std::regex(">=")},
    {"LX_LT", std::regex("<")},
    {"LX_GT", std::regex(">")},

    // Logical not
    {"LX_LNOT", std::regex("!")},

    // Assignment
    {"LX_ASSIGN", std::regex("=")},

    // Operators
    {"LX_INC", std::regex("\\+\\+")},
    {"LX_DEC", std::regex("--")},
    {"LX_POW", std::regex("\\*\\*")},
    {"LX_PLUS", std::regex("\\+")},
    {"LX_MINUS", std::regex("-")},
    {"LX_MULT", std::regex("\\*")},
    {"LX_DIV", std::regex("/")},
    {"LX_MODULO", std::regex("%")}
};


// Grammar

// Program
// program -> statement_list
// statement_list -> statement | statement statement_list
// statement -> expression_statement | declaration_statement | if_statement | while_statement | do_while_statement 
| for_statement | function_statement | return_statement | import_statement | export_statement

// Chain: Program -> statement_list -> statement -> expression_statement -> expression -> assignment_expression -> 
primary_expression -> id | number | string | ( expression | unary_expression | postfix_expression | binary_expression )

// expression_statement -> expression ;
// declaration_statement -> var id = expression ;
// if_statement -> if ( expression ) statement | if ( expression ) statement else statement
// while_statement -> while ( expression ) statement
// do_while_statement -> do statement while ( expression ) ;
// for_statement -> for ( expression ; expression ; expression ) statement
// function_statement -> function id ( parameter_list ) statement
// return_statement -> return expression ;

// import_statement -> from string(path) import id ;
// Variants:
// import_statement -> import id ;
// import_statement -> import id as id ;
// import_statement -> import id as id from string(path) ;
// import_statement -> import id from string(path) ;
// import_statement -> import id from string(path) as id ;

// export_statement -> export id ;
// export_statement -> export id as id ;

// expression -> assignment_expression | binary_expression | unary_expression | postfix_expression | primary_expression

// assignment_expression -> primary_expression = expression | primary_expression += expression 
| primary_expression -= expression | primary_expression *= expression | primary_expression /= expression 
| primary_expression %= expression | primary_expression &= expression | primary_expression |= expression 
| primary_expression ^= expression | primary_expression <<= expression | primary_expression >>= expression

// binary_expression -> expression + expression | expression - expression | expression * expression 
| expression / expression | expression % expression | expression & expression | expression | expression 
| expression ^ expression | expression << expression | expression >> expression | expression && expression 
| expression || expression | expression == expression | expression != expression | expression <= expression 
| expression >= expression | expression < expression | expression > expression


*/ 

#include <iostream>
#include <string>
#include <vector>
#include <regex>
#include <map>

#include "tokenizer.h"

struct Node {
    std::string name;
    std::vector<Node> children;
};

struct ParseResult {
    bool success;
    std::string error;
    Node node;
};

// Include necessary headers

// Define lexeme_map and other structures

class Parser {
public:
    Parser(const std::vector<Token>& tokens) : tokens(tokens), index(0) {}

    ParseResult parseProgram() {
        Node programNode;
        // Call statement_list parsing function here
        // Set programNode.children accordingly
        return ParseResult{true, "", programNode};
    }

    // Implement other parsing functions here
    
private:
    std::vector<Token> tokens;
    size_t index;

    // Define helper functions for parsing expressions and statements
};

// int main() {
//     // Tokenize your input source code and store the tokens in a vector

//     Parser parser(tokens);
//     ParseResult result = parser.parseProgram();

//     if (result.success) {
//         // Use the resulting parse tree for further processing or analysis
//     } else {
//         std::cout << "Parsing error: " << result.error << std::endl;
//     }

//     return 0;
// }
