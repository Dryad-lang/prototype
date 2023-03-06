using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace testV6.Lexer
{
    public enum TokenTypes{
        // Operators
        MATH_OP_PLUS, MATH_OP_MINUS, MATH_OP_MULT, MATH_OP_DIV, MATH_OP_MOD,
        OP_ASSIGNMENT,

        // Separators
        SEP_SEMICOLON, SEP_COMMA, SEP_DOT, SEP_COLON, SEP_OPEN_PAREN, SEP_CLOSE_PAREN, 
        SEP_OPEN_BRACE, SEP_CLOSE_BRACE, SEP_OPEN_BRACKET, SEP_CLOSE_BRACKET,

        // Keywords
        KEYWORD_LET, KEYWORD_FUNCTION, KEYWORD_RETURN,

        // Literals
        LITERAL_NUMBER, LITERAL_STRING, LITERAL_IDENTIFIER,

        // Special
        SPECIAL_EOF 
    }
}
