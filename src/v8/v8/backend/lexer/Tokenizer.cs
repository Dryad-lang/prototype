using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using v8.backend.analyzer;
using v8.backend.Errors;
using v8.backend.lexer.types;
using v8.backend.lexer;
using System.Text.RegularExpressions;

namespace v8.backend.lexer.types
{

    public enum Types
    {
        MathOP_PLUS,
        MathOP_MINUS,
        MathOP_MULT,
        MathOP_DIV,
        MathOP_MOD,
        MathOP_POW,
        OP_INC,
        OP_DEC,
        OP_ASSIGN,
        OP_ASSIGN_PLUS,
        OP_ASSIGN_MINUS,
        OP_ASSIGN_MULT,
        OP_ASSIGN_DIV,
        OP_ASSIGN_MOD,
        OP_ASSIGN_POW,
        OP_EQUAL,
        OP_NOT_EQUAL,
        OP_GREATER,
        OP_LESS,
        OP_GREATER_EQUAL,
        OP_LESS_EQUAL,
        OP_AND,
        OP_OR,
        OP_NOT,
        IF_KW,
        ELSE_KW,
        FOR_KW,
        WHILE_KW,
        DO_KW,
        RETURN_KW,
        USING_KW,
        FUNCTION_KW,
        CLASS_KW,
        NEW_KW,
        THIS_KW,
        STATIC_KW,
        PUBLIC_KW,
        PRIVATE_KW,
        TRY_KW,
        CATCH_KW,
        THROW_KW,
        IN_KW,
        INTERFACE_KW,
        INT_KW,
        TRUE_KW,
        FALSE_KW,
        FLOAT_KW,
        DOUBLE_KW,
        CHAR_KW,
        STRING_KW,
        BOOL_KW,
        VOID_KW,
        NAN_KW,
        IDENTIFIER,
        NEWLINE,
        EOF,
        ERROR,
        NULL_TYPE,
        INTEGER_TYPE,
        STRING_TYPE,
        BOOLEAN_TYPE,
        FLOAT_TYPE,
        DOUBLE_TYPE,
        CHARACTER_TYPE,
        VOID_TYPE,
        NOTANUMBER_TYPE,
        R_PAREN,
        L_PAREN,
        L_CURLY,
        R_CURLY,
        L_BRACKET,
        R_BRACKET,
        SEMICOLON,
        COMMA,
        COLON,
        DOT
    }
}

namespace v8.backend.lexer
{
    public class TokenDictionary
    {
        public Dictionary <string, Types> tokenDictionary = new Dictionary<string, Types>();

        public TokenDictionary()
        {
            tokenDictionary.Add("/", Types.MathOP_DIV);
            tokenDictionary.Add("*", Types.MathOP_MULT);
            tokenDictionary.Add("+", Types.MathOP_PLUS);
            tokenDictionary.Add("-", Types.MathOP_MINUS);
            tokenDictionary.Add("%", Types.MathOP_MOD);
            tokenDictionary.Add("^", Types.MathOP_POW);
            tokenDictionary.Add("++", Types.OP_INC);
            tokenDictionary.Add("--", Types.OP_DEC);
            tokenDictionary.Add("=", Types.OP_ASSIGN);
            tokenDictionary.Add("+=", Types.OP_ASSIGN_PLUS);
            tokenDictionary.Add("-=", Types.OP_ASSIGN_MINUS);
            tokenDictionary.Add("*=", Types.OP_ASSIGN_MULT);
            tokenDictionary.Add("/=", Types.OP_ASSIGN_DIV);
            tokenDictionary.Add("%=", Types.OP_ASSIGN_MOD);
            tokenDictionary.Add("^=", Types.OP_ASSIGN_POW);
            tokenDictionary.Add("==", Types.OP_EQUAL);
            tokenDictionary.Add("!=", Types.OP_NOT_EQUAL);
            tokenDictionary.Add(">", Types.OP_GREATER);
            tokenDictionary.Add("<", Types.OP_LESS);
            tokenDictionary.Add(">=", Types.OP_GREATER_EQUAL);
            tokenDictionary.Add("<=", Types.OP_LESS_EQUAL);
            tokenDictionary.Add("&&", Types.OP_AND);
            tokenDictionary.Add("||", Types.OP_OR);
            tokenDictionary.Add("!", Types.OP_NOT);
            tokenDictionary.Add("if", Types.IF_KW);
            tokenDictionary.Add("else", Types.ELSE_KW);
            tokenDictionary.Add("for", Types.FOR_KW);
            tokenDictionary.Add("while", Types.WHILE_KW);
            tokenDictionary.Add("do", Types.DO_KW);
            tokenDictionary.Add("return", Types.RETURN_KW);
            tokenDictionary.Add("using", Types.USING_KW);
            tokenDictionary.Add("function", Types.FUNCTION_KW);
            tokenDictionary.Add("class", Types.CLASS_KW);
            tokenDictionary.Add("new", Types.NEW_KW);
            tokenDictionary.Add("this", Types.THIS_KW);
            tokenDictionary.Add("static", Types.STATIC_KW);
            tokenDictionary.Add("public", Types.PUBLIC_KW);
            tokenDictionary.Add("private", Types.PRIVATE_KW);
            tokenDictionary.Add("try", Types.TRY_KW);
            tokenDictionary.Add("catch", Types.CATCH_KW);
            tokenDictionary.Add("throw", Types.THROW_KW);
            tokenDictionary.Add("in", Types.IN_KW);
            tokenDictionary.Add("interface", Types.INTERFACE_KW);
            tokenDictionary.Add("int", Types.INT_KW);
            tokenDictionary.Add("true", Types.TRUE_KW);
            tokenDictionary.Add("false", Types.FALSE_KW);
            tokenDictionary.Add("float", Types.FLOAT_KW);
            tokenDictionary.Add("double", Types.DOUBLE_KW);
            tokenDictionary.Add("char", Types.CHAR_KW);
            tokenDictionary.Add("string", Types.STRING_KW);
            tokenDictionary.Add("bool", Types.BOOL_KW);
            tokenDictionary.Add("void", Types.VOID_KW);
            tokenDictionary.Add("(", Types.L_PAREN);
            tokenDictionary.Add(")", Types.R_PAREN);
            tokenDictionary.Add("{", Types.L_CURLY);
            tokenDictionary.Add("}", Types.R_CURLY);
            tokenDictionary.Add("[", Types.L_BRACKET);
            tokenDictionary.Add("]", Types.R_BRACKET);
            tokenDictionary.Add(";", Types.SEMICOLON);
            tokenDictionary.Add(",", Types.COMMA);
            tokenDictionary.Add(":", Types.COLON);
            tokenDictionary.Add(".", Types.DOT);
        }

        public Types GetTokenType(string token)
        {
            if (tokenDictionary.ContainsKey(token))
            {
                return tokenDictionary[token];
            }
            else
            {
                return Types.ERROR;
            }
        }

        public bool IsKeyword(string token)
        {
            // Keyword list
            string [] keywords = { "if", "else", "for", "while", "do", "return", "using", "function", "class", "new", "this", "static", "public", "private", "try", "catch", "throw", "in", "interface", "int", "true", "false", "float", "double", "char", "string", "bool", "void" };

            // Check if token is in keyword list
            if (keywords.Contains(token))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public bool IsOperator(string token)
        {
            // Operator list
            string[] operators = { "/", "*", "+", "-", "%", "^", "++", "--", "=", "+=", "-=", "*=", "/=", "%=", "^=", "==", "!=", ">", "<", ">=", "<=", "&&", "||", "!" };

            // Check if token is in operator list
            if (operators.Contains(token))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public bool IsPunctuation(string token)
        {
            // Punctuation list
            string[] punctuation = { "(", ")", "{", "}", "[", "]", ";", ",", ":", "." };

            // Check if token is in punctuation list
            if (punctuation.Contains(token))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public bool IsIdentifier(string token)
        {
            // Check if token is a valid identifier
            if (Regex.IsMatch(token, @"^[a-zA-Z_][a-zA-Z0-9_]*$"))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public bool IsNumber(string token)
        {
            // Check if token is a valid number Validate with int, double & float Ex: 1.1, 1, 0, -1 etc
            if (Regex.IsMatch(token, @"^[-]?[0-9]*\.?[0-9]+$"))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public bool IsString(string token)
        {
            // Check if token is a valid string Ex: "Hello World", "Hello", "World" etc
            if (Regex.IsMatch(token, "\"(\\\\.|[^\"])*\""))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public bool IsChar(string token)
        {
            // Check if token is a valid char Ex: 'a', 'b', 'c' etc
            if (Regex.IsMatch(token, @"^'([^\r\n\\]|\\[\\'" + "\"nrt])'$"))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public bool IsComment(string token)
        {
            // Check if token is a valid comment Ex: # comment
            if (Regex.IsMatch(token, @"^#.*$"))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public bool IsWhiteSpace(string token)
        {
            // Check if token is a valid whitespace Ex: " ", "\t", "\r", "\n" etc
            if (Regex.IsMatch(token, @"^\s+$"))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public bool IsEndOfFile(string token)
        {
            // Check if token is a valid end of file Ex: \0
            if (Regex.IsMatch(token, @"\0"))
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }

    public class Tokenizer
    {

    }
}
