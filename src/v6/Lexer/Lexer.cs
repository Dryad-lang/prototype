using System.Collections.Generic;
using System;
using System.Text;

namespace v6
{
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
            tokenDictionary.Add("\"", "STRING");
            tokenDictionary.Add("//", "COMMENT");
            tokenDictionary.Add("/*", "COMMENT_MULTI");
            tokenDictionary.Add("abcdefghijklmnopqrstuvwxyz", "COMMENT_MULTI");
        }

        public string GetToken(string key)
        {
            return tokenDictionary[key];
        }

        public bool ContainsKey(string key)
        {
            return tokenDictionary.ContainsKey(key);
        }

        public bool ContainsValue(string value)
        {
            return tokenDictionary.ContainsValue(value);
        }

        public string GetValueType(string value)
        {
            foreach (KeyValuePair<string, string> entry in tokenDictionary)
            {
                if (entry.Value == value)
                {
                    return entry.Key;
                }
            }
            return null;
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
        private types types = new types();

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

        public void SkipLine()
        {
            while (currentChar != '\0' && currentChar != '\n')
            {
                Advance();
            }
            Advance();
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

        public Token MakeString()
        {
            StringBuilder sb = new StringBuilder();
            sb.Append(currentChar);
            Advance();
            while (currentChar != '\0' && currentChar != '"')
            {
                sb.Append(currentChar);
                Advance();
            }
            sb.Append(currentChar);
            Advance();
            return new Token(sb.ToString(), "STRING", line, column);
        }

        public Token MakeNumber()
        {
            StringBuilder sb = new StringBuilder();
            int dotCount = 0;
            while (currentChar != '\0' && (char.IsDigit(currentChar) || currentChar == '.'))
            {
                if (currentChar == '.')
                {
                    dotCount++;
                }
                sb.Append(currentChar);
                Advance();
            }
            if (dotCount > 1)
            {
                throw new Exception("Invalid number");
            }
            else if (dotCount == 1)
            {
                return new Token(sb.ToString(), "FLOAT", line, column);
            }
            else
            {
                return new Token(sb.ToString(), "INT", line, column);
            }
        }

        public Token MakeIdentifier()
        {
            StringBuilder sb = new StringBuilder();
            while (currentChar != '\0' && (char.IsLetterOrDigit(currentChar) || currentChar == '_'))
            {
                sb.Append(currentChar);
                Advance();
            }
            string token = sb.ToString();
            if (tokenDictionary.ContainsKey(token))
            {
                return new Token(token, tokenDictionary.GetToken(token), line, column);
            }
            else
            {
                return new Token(token, "IDENTIFIER", line, column);
            }
        }
    }
}