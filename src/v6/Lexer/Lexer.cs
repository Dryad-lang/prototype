using System.Collections.Generic;
using System;
using System.Text;

namespace v6
{
    public class TokenType
    {
        //  \0   public readonly string EOF = "EOF";
        public readonly string INT = "INT";
        // 0 - 9          
        public readonly string FLOAT = "FLOAT";
        // 0 - 9 . 0 - 9
        public readonly string MATH_OP_ADD = "MATH_OP_ADD";
        // +
        public readonly string MATH_OP_SUB = "MATH_OP_SUB";
        // -
        public readonly string MATH_OP_MUL = "MATH_OP_MUL";
        // *
        public readonly string MATH_OP_DIV = "MATH_OP_DIV";
        // /
        public readonly string LPAREN = "LPAREN";
        // (
        public readonly string RPAREN = "RPAREN";
        // )
        public readonly string LBRACE = "LBRACE";
        // {
        public readonly string RBRACE = "RBRACE";
        // }
        public readonly string SEMI = "SEMI";
        // ;
        public readonly string COMMA = "COMMA";
        // ,
        public readonly string ASSIGN = "ASSIGN";
        // =
        public readonly string PLUS_ASSIGN = "PLUS_ASSIGN";
        // +=
        public readonly string MINUS_ASSIGN = "MINUS_ASSIGN";
        // -=
        public readonly string MUL_ASSIGN = "MUL_ASSIGN";
        // *=
        public readonly string DIV_ASSIGN = "DIV_ASSIGN";
        // /=
        public readonly string MOD_ASSIGN = "MOD_ASSIGN";
        // %=
        public readonly string EQUAL = "EQUAL";
        // ==
        public readonly string NOT_EQUAL = "NOT_EQUAL";
        // !=
        public readonly string LESS_THAN = "LESS_THAN";
        // <
        public readonly string GREATER_THAN = "GREATER_THAN";
        // >
        public readonly string LESS_THAN_EQUAL = "LESS_THAN_EQUAL";
        // <=
        public readonly string GREATER_THAN_EQUAL = "GREATER_THAN_EQUAL";
        // >=
        public readonly string IDENT = "IDENT";
        // a-z A-Z _
        public readonly string STRING = "STRING";
        // " "
        public readonly string COMMENT = "COMMENT";
        // //
        public readonly string COMMENT_MULTI = "COMMENT_MULTI";
        // /**/
        public readonly string IF = "IF";
        // if (true)
        public readonly string ELSE = "ELSE";
        // else
        public readonly string WHILE = "WHILE";
        // while (true)
        public readonly string FOR = "FOR";
        // for (int i = 0; i < 10; i++)
        public readonly string BREAK = "BREAK";
        // break;
        public readonly string CONTINUE = "CONTINUE";
        // continue;
        public readonly string RETURN = "RETURN";
        // return 0;
        public readonly string FUNC = "FUNC";
        // int func(int a, int b) { return a + b; }
        public readonly string CLASS = "CLASS";
        // class Person { }
        public readonly string NEW = "NEW";
        // new Person();
        public readonly string TRUE = "TRUE";
        // true
        public readonly string FALSE = "FALSE";
        // false
        public readonly string NULL = "NULL";
        // null
        public readonly string AND = "AND";
        // &&
        public readonly string OR = "OR";
        // ||
        public readonly string NOT = "NOT";
        // !
        public readonly string DOT = "DOT";
        // .
    }

    public class Token
    {
        public string type;
        public string value;
        public int line;
        public int column;

        public Token(string type, string value, int line, int column)
        {
            this.type = type;
            this.value = value;
            this.line = line;
            this.column = column;
        }
    }

    public class TokenDictionary
    {
        public Dictionary<string, string> tokenDictionary = new Dictionary<string, string>();

        public TokenDictionary()
        {
            tokenDictionary.Add("int", "INT");
            tokenDictionary.Add("float", "FLOAT");
            tokenDictionary.Add("+", "MATH_OP_ADD");
            tokenDictionary.Add("-", "MATH_OP_SUB");
            tokenDictionary.Add("*", "MATH_OP_MUL");
            tokenDictionary.Add("/", "MATH_OP_DIV");
            tokenDictionary.Add("(", "LPAREN");
            tokenDictionary.Add(")", "RPAREN");
            tokenDictionary.Add("{", "LBRACE");
            tokenDictionary.Add("}", "RBRACE");
            tokenDictionary.Add(";", "SEMI");
            tokenDictionary.Add(",", "COMMA");
            tokenDictionary.Add("=", "ASSIGN");
            tokenDictionary.Add("+=", "PLUS_ASSIGN");
            tokenDictionary.Add("-=", "MINUS_ASSIGN");
            tokenDictionary.Add("*=", "MUL_ASSIGN");
            tokenDictionary.Add("/=", "DIV_ASSIGN");
            tokenDictionary.Add("%=", "MOD_ASSIGN");
            tokenDictionary.Add("==", "EQUAL");
            tokenDictionary.Add("!=", "NOT_EQUAL");
            tokenDictionary.Add("<", "LESS_THAN");
            tokenDictionary.Add(">", "GREATER_THAN");
            tokenDictionary.Add("<=", "LESS_THAN_EQUAL");
            tokenDictionary.Add(">=", "GREATER_THAN_EQUAL");
            tokenDictionary.Add("if", "IF");
            tokenDictionary.Add("else", "ELSE");
            tokenDictionary.Add("while", "WHILE");
            tokenDictionary.Add("for", "FOR");
            tokenDictionary.Add("break", "BREAK");
            tokenDictionary.Add("continue", "CONTINUE");
            tokenDictionary.Add("return", "RETURN");
            tokenDictionary.Add("func", "FUNC");
            tokenDictionary.Add("class", "CLASS");
            tokenDictionary.Add("new", "NEW");
            tokenDictionary.Add("true", "TRUE");
            tokenDictionary.Add("false", "FALSE");
            tokenDictionary.Add("null", "NULL");
            tokenDictionary.Add("&&", "AND");
            tokenDictionary.Add("||", "OR");
            tokenDictionary.Add("!", "NOT");
            tokenDictionary.Add(".", "DOT");
        }

        public string GetToken(string key)
        {
            return tokenDictionary[key];
        }
    }

    public class Lexer
    {
        private string source;
        private int index;
        private int line;
        private int column;
        public char currentChar;
        public string? currentToken;

        private TokenDictionary tokenDictionary = new TokenDictionary();
        

        public Lexer(string source)
        {
            if (source == null)
            {
                throw new ArgumentNullException(nameof(source));
            }

            this.source = source;
            index = 0;
            line = 1;
            column = 0;
        }

        public void Advance()
        {
            index++;
            column++;
            if (index >= source.Length)
            {
                currentChar = '\0';
            }
            else
            {
                currentChar = source[index];
            }
        }

        public void SkipWhitespace()
        {
            while (currentChar != '\0' && char.IsWhiteSpace(currentChar))
            {
                if (currentChar == ' ' || currentChar == '\t')
                {
                    Advance();
                }
            }
        }                

        public char Peek()
        {
            int peekIndex = index + 1;
            if (peekIndex >= source.Length)
            {
                return '\0';
            }
            else
            {
                return source[peekIndex];
            }
        }

        public void Jump(int count)
        {
            for (int i = 0; i < count; i++)
            {
                Advance();
            }
        }

        public void SkipComment()
        {
            // Skip single line comment
            if (currentChar == '/' && Peek() == '/')
            {
                while (currentChar != '\0' && currentChar != ' ' && currentChar != '\t' && currentChar != '\r' && currentChar != '\n')
                {
                    Advance();
                }
            }

            // Skip multi line comment
            if (currentChar == '/' && Peek() == '*')
            {
                while (currentChar != '\0' && (currentChar != '*' || Peek() != '/'))
                {
                    Advance();
                }
                Advance();
                Advance();
            }
        }



        
    }
}