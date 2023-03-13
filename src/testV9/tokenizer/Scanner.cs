using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace testV9.tokenizer
{
    public enum TokenTypes
    {
        // Literals
        StringLiteral, NumberLiteral,

        // Identifiers
        Identifier,

        // Operators
        Plus, Minus, Divide,
        Multiply,

        // Delimiters
        LeftParen, RightParen,
        Semicolon,

        // End of file
        EOF
    }

    public class Token
    {
        public TokenTypes Type { get; set; }
        public string Literal { get; set; }

        public Token(TokenTypes type, string literal)
        {
            Type = type;
            Literal = literal;
        }
    }

    public class Scanner
    {
        private List<Token> tokens = new List<Token>();
        private string source;
        private string currentToken = "";
        private int index = 0;

        public Scanner(string source)
        {
            this.source = source;
        }

        public void AddToken(TokenTypes type, string value)
        {
            tokens.Add(new Token(type, value));
        }

        public void Advance()
        {
            index++;
        }

        public char Peek()
        {
            if (index >= source.Length)
                return '\0';

            return source[index];
        }

        public char PeekNext()
        {
            if (index + 1 >= source.Length)
                return '\0';

            return source[index + 1];
        }

        public bool IsAtEnd()
        {
            return index >= source.Length;
        }


        public void MakeString()
        {
            while (Peek() != '"' && !IsAtEnd())
            {
                if (Peek() == '\n')
                    throw new Exception("Unterminated string.");

                Advance();
            }

            if (IsAtEnd())
                throw new Exception("Unterminated string.");

            Advance();

            var value = source.Substring(index - 1, index - 1);
            AddToken(TokenTypes.StringLiteral, value);
        }

        public void MakeNumber()
        {
            while (char.IsDigit(Peek()))
                Advance();

            if (Peek() == '.' && char.IsDigit(PeekNext()))
            {
                Advance();

                while (char.IsDigit(Peek()))
                    Advance();
            }

            var value = source.Substring(index - 1, index - 1);
            AddToken(TokenTypes.NumberLiteral, value);
        }

        public void MakeIdentifier()
        {
            while (char.IsLetterOrDigit(Peek()))
                Advance();

            var value = source.Substring(index - 1, index - 1);
            AddToken(TokenTypes.Identifier, value);
        }


        public void ScanToken()
        {
            var c = Peek();

            switch (c)
            {
                case '(':
                    AddToken(TokenTypes.LeftParen, "(");
                    break;
                case ')':
                    AddToken(TokenTypes.RightParen, ")");
                    break;
                case ';':
                    AddToken(TokenTypes.Semicolon, ";");
                    break;
                case '+':
                    AddToken(TokenTypes.Plus, "+");
                    break;
                case '-':
                    AddToken(TokenTypes.Minus, "-");
                    break;
                case '*':
                    AddToken(TokenTypes.Multiply, "*");
                    break;
                case '/':
                    AddToken(TokenTypes.Divide, "/");
                    break;
                case '"':
                    MakeString();
                    break;
                case ' ':
                case '\r':
                case '\t':
                    break;
                case '\n':
                    break;
                default:
                    if (char.IsDigit(c))
                        MakeNumber();
                    else if (char.IsLetter(c))
                        MakeIdentifier();
                    else
                        throw new Exception("Unexpected character.");
                    break;
            }

            Advance();
        }
    }

}
