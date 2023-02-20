using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace v9.lexer
{
    public enum TokenType
    {
        // Keywords
        IMPORTS,
        IF,
        ELSE,
        WHILE,
        FOR,
        BREAK,
        CONTINUE,
        RETURN,
        VAR,
        FUNCTION,
        CLASS,
        THIS,
        SUPER,
        NULL,
        TRUE,
        FALSE,
        // Literals
        IDENTIFIER,
        STRING,
        INT,
        FLOAT,
        // Operators
        PLUS,
        MINUS,
        MULTIPLY,
        DIVIDE,
        MODULUS,
        EXPONENT,
        ARE_EQUAL,
        NOT_EQUAL,
        GREATER,
        GREATER_EQUAL,
        LESS,
        LESS_EQUAL,
        AND,
        AND_AND,
        OR,
        OR_OR,
        NOT,
        INCREMENT,
        DECREMENT,
        // Assignment
        ASSIGN,
        PLUS_ASSIGN,
        MINUS_ASSIGN,
        MULTIPLY_ASSIGN,
        DIVIDE_ASSIGN,
        MODULUS_ASSIGN,
        // Delimiters
        LEFT_PAREN,
        RIGHT_PAREN,
        LEFT_BRACE,
        RIGHT_BRACE,
        LEFT_BRACKET,
        RIGHT_BRACKET,
        COMMA,
        DOT,
        SEMICOLON,
        // Special
        EOF,
        ERROR
    }

    public class Token
    {
        public TokenType Type { get; set; }
        public string Value { get; set; }
        public Position Position { get; set; } 
        public int PosStart { get; set; }
        public int PosEnd { get; set; }

        public Token(TokenType type, string value, Position position, int posStart, int posEnd)
        {
            this.Type = type;
            this.Value = value;
            this.Position = position;
            this.PosStart = posStart;
            this.PosEnd = posEnd;
        }
    }

    public class Keywords
    {
        Dictionary<string, TokenType> keywords;

        public Keywords()
        {
            this.keywords = new Dictionary<string, TokenType>();
            this.keywords.Add("imports", TokenType.IMPORTS);
            this.keywords.Add("if", TokenType.IF);
            this.keywords.Add("else", TokenType.ELSE);
            this.keywords.Add("while", TokenType.WHILE);
            this.keywords.Add("for", TokenType.FOR);
            this.keywords.Add("break", TokenType.BREAK);
            this.keywords.Add("continue", TokenType.CONTINUE);
            this.keywords.Add("return", TokenType.RETURN);
            this.keywords.Add("var", TokenType.VAR);
            this.keywords.Add("function", TokenType.FUNCTION);
            this.keywords.Add("class", TokenType.CLASS);
            this.keywords.Add("this", TokenType.THIS);
            this.keywords.Add("super", TokenType.SUPER);
            this.keywords.Add("null", TokenType.NULL);
            this.keywords.Add("true", TokenType.TRUE);
            this.keywords.Add("false", TokenType.FALSE);
        }

        public TokenType GetKeywordType(string keyword)
        {
            if (this.keywords.ContainsKey(keyword))
            {
                return this.keywords[keyword];
            }
            else
            {
                return TokenType.IDENTIFIER;
            }
        }

        public bool IsKeyword(string keyword)
        {
            return this.keywords.ContainsKey(keyword);
        }
    }

    public class Operators
    {
        Dictionary<string, TokenType> operators;

        public Operators()
        {
            this.operators = new Dictionary<string, TokenType>();
            this.operators.Add("+", TokenType.PLUS);
            this.operators.Add("-", TokenType.MINUS);
            this.operators.Add("*", TokenType.MULTIPLY);
            this.operators.Add("/", TokenType.DIVIDE);
            this.operators.Add("%", TokenType.MODULUS);
            this.operators.Add("^", TokenType.EXPONENT);
            this.operators.Add("==", TokenType.ARE_EQUAL);
            this.operators.Add("!=", TokenType.NOT_EQUAL);
            this.operators.Add(">", TokenType.GREATER);
            this.operators.Add(">=", TokenType.GREATER_EQUAL);
            this.operators.Add("<", TokenType.LESS);
            this.operators.Add("<=", TokenType.LESS_EQUAL);
            this.operators.Add("&&", TokenType.AND_AND);
            this.operators.Add("||", TokenType.OR_OR);
            this.operators.Add("!", TokenType.NOT);
            this.operators.Add("++", TokenType.INCREMENT);
            this.operators.Add("--", TokenType.DECREMENT);
            this.operators.Add("=", TokenType.ASSIGN);
            this.operators.Add("+=", TokenType.PLUS_ASSIGN);
            this.operators.Add("-=", TokenType.MINUS_ASSIGN);
            this.operators.Add("*=", TokenType.MULTIPLY_ASSIGN);
            this.operators.Add("/=", TokenType.DIVIDE_ASSIGN);
            this.operators.Add("%=", TokenType.MODULUS_ASSIGN);
        }

        public TokenType GetOperatorType(string op)
        {
            if (this.operators.ContainsKey(op))
            {
                return this.operators[op];
            }
            else
            {
                return TokenType.ERROR;
            }
        }

        public bool IsOperator(string op)
        {
            return this.operators.ContainsKey(op);
        }
    }

    public class Delimiters
    {
        Dictionary<string, TokenType> delimiters;

        public Delimiters()
        {
            this.delimiters = new Dictionary<string, TokenType>();
            this.delimiters.Add("(", TokenType.LEFT_PAREN);
            this.delimiters.Add(")", TokenType.RIGHT_PAREN);
            this.delimiters.Add("{", TokenType.LEFT_BRACE);
            this.delimiters.Add("}", TokenType.RIGHT_BRACE);
            this.delimiters.Add("[", TokenType.LEFT_BRACKET);
            this.delimiters.Add("]", TokenType.RIGHT_BRACKET);
            this.delimiters.Add(",", TokenType.COMMA);
            this.delimiters.Add(".", TokenType.DOT);
            this.delimiters.Add(";", TokenType.SEMICOLON);
        }

        public TokenType GetDelimiterType(string delimiter)
        {
            if (this.delimiters.ContainsKey(delimiter))
            {
                return this.delimiters[delimiter];
            }
            else
            {
                return TokenType.ERROR;
            }
        }

        public bool IsDelimiter(string delimiter)
        {
            return this.delimiters.ContainsKey(delimiter);
        }
    }
}
