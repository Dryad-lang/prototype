using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace v9.lexer
{
    public class Position
    {
        public int line;
        public int column;
        public int index;

        public Position(int line, int column, int index)
        {
            this.line = line;
            this.column = column;
            this.index = index;
        }

        public override string ToString()
        {
            return $"Line: {this.line}, Column: {this.column}, Index: {this.index}";
        }
    }

public static class ASCII
{
    public const string LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    public const string DIGITS = "0123456789";
    public const string LETTERS_DIGITS = LETTERS + DIGITS;
    public const string OPERATORS = "+-*/%^=<>!&|";
    public const string DELIMITERS = "(){}[],;";
    public const string WHITESPACE = " ";
    public const string NEWLINE = "\r\n";
    public const string EOF = "\0";
}


    public class Lexer
    {
        private string source;
        private List<Token> tokens;
        private int index;
        private int line;
        private int column;
        private int tokenStartIndex;
        private char CurrentChar;

        public Lexer(string source)
        {
            this.source = source;
            this.tokens = new List<Token>();
            this.index = 0;
            this.line = 1;
            this.column = 1;
        }

        public void Advance()
        {
            this.index++;
            this.column++;
            if (this.index < this.source.Length)
            {
                this.CurrentChar = this.source[this.index];
            }
            else
            {
                this.CurrentChar = '\0';
            }
        }

        public void AddToken(TokenType type)
        {
            string text = this.source.Substring(this.tokenStartIndex, this.index - this.tokenStartIndex);
            this.tokens.Add(new Token(type, text, new Position(this.line, this.column, this.tokenStartIndex), tokenStartIndex, index));
        }

        public char PeekNext()
        {
            if (this.index + 1 < this.source.Length)
            {
                return this.source[this.index + 1];
            }
            else
            {
                return '\0';
            }
        }

        public void SkipWhitespace()
        {
            while (ASCII.WHITESPACE.Contains(this.CurrentChar) || ASCII.NEWLINE.Contains(this.CurrentChar))
            {
                this.Advance();
            }
        }

        public void SkipComment()
        {
            while (this.CurrentChar != '\r' && this.CurrentChar != '\n' && this.CurrentChar != '\0')
            {
                this.Advance();
            }
        }

        public void SkipNewline()
        {
            while (ASCII.NEWLINE.Contains(this.CurrentChar))
            {
                this.Advance();
            }
        }

        public void MakeString()
        {
            while (this.CurrentChar != '"' && this.CurrentChar != '\0')
            {
                this.Advance();
            }

            if (this.CurrentChar == '\0')
            {
                throw new Exception("Unterminated string");
            }

            this.Advance();
            this.AddToken(TokenType.STRING);
        }

        public void MakeNumber()
        {
            int dots = 0;

            while (ASCII.DIGITS.Contains(this.CurrentChar) || this.CurrentChar == '.')
            {
                if (this.CurrentChar == '.')
                {
                    dots++;
                }
                this.Advance();
            }

            if (dots == 0)
            {
                this.AddToken(TokenType.INT);
            }
            else if (dots == 1)
            {
                this.AddToken(TokenType.FLOAT);
            }
            else
            {
                throw new Exception("Invalid number");
            }
        }

        public void MakeIdentifier()
        {
            while (ASCII.LETTERS_DIGITS.Contains(this.CurrentChar))
            {
                this.Advance();
            }

            string text = this.source.Substring(this.tokenStartIndex, this.index - this.tokenStartIndex);

            Keywords keywords = new();
            if (keywords.IsKeyword(text))
            {
                this.AddToken(keywords.GetKeywordType(text));
            }
            else
            {
                this.AddToken(TokenType.IDENTIFIER);
            }
        }

        public void MakeOperator()
        {
            string op = "";
            Operators operators = new();

            while (ASCII.OPERATORS.Contains(this.CurrentChar))
            {
                op += this.CurrentChar;
                this.Advance();
            }

            if (operators.IsOperator(op))
            {
                this.AddToken(operators.GetOperatorType(op));
            }
            else
            {
                throw new Exception("Invalid operator");
            }
        }

        public void MakeSeparator()
        {
            Delimiters delimiters = new();

            if (delimiters.IsDelimiter(this.CurrentChar.ToString()))
            {
                this.AddToken(delimiters.GetDelimiterType(this.CurrentChar.ToString()));
                this.Advance();
            }
            else
            {
                throw new Exception("Invalid delimiter");
            }
        }

        public void Get()
        {
            if (this.index < this.source.Length)
            {
                this.CurrentChar = this.source[this.index];
                this.tokenStartIndex = (this.index);

                if (ASCII.WHITESPACE.Contains(this.CurrentChar))
                {
                    this.SkipWhitespace();
                    this.Get();
                }
                else if (ASCII.NEWLINE.Contains(this.CurrentChar))
                {
                    this.SkipNewline();
                    this.Get();
                }
                else if (this.CurrentChar == '#')
                {
                    this.SkipComment();
                    this.Get();
                }
                else if (ASCII.DIGITS.Contains(this.CurrentChar))
                {
                    this.MakeNumber();
                    this.Get();
                }
                else if (ASCII.LETTERS.Contains(this.CurrentChar))
                {
                    this.MakeIdentifier();
                    this.Get();
                }
                else if (ASCII.OPERATORS.Contains(this.CurrentChar))
                {
                    this.MakeOperator();
                    this.Get();
                }
                else if (ASCII.DELIMITERS.Contains(this.CurrentChar))
                {
                    this.MakeSeparator();
                    this.Get();
                }
                else if (this.CurrentChar == '"')
                {
                    this.Advance();
                    this.MakeString();
                    this.Get();
                }
                else
                {
                    throw new Exception("Invalid character");
                }
            }
            else
            {
                this.tokens.Add(new Token(TokenType.EOF, "", new Position(this.line, this.column, this.index), this.index, this.index));
            }
        }

        public List<Token> GetTokens()
        {
            this.Get();
            return this.tokens;
        }

    }
}
