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
        private int start = 0;
        private int current = 0;
        private int line = 1;

        public Scanner(string source)
        {
            this.source = source;
        }

        public List<Token> ScanTokens()
        {
            while (!IsAtEnd())
            {
                start = current;
                ScanToken();
            }

            tokens.Add(new Token(TokenTypes.EOF, ""));
            return tokens;
        }

        public bool IsAtEnd()
        {
            return current >= source.Length;
        }

        // Peek
        public char Peek()
        {
            if (IsAtEnd()) return '\0';
            return source[current];
        }

        // PeekNext
        public char PeekNext()
        {
            if (current + 1 >= source.Length) return '\0';
            return source[current + 1];
        }

        public void Advance()
        {
            current++;
        }

        // Add Token
        public void AddToken(TokenTypes type)
        {
            AddToken(type, null);
        }

        // Current char
        public char CurrentChar()
        {
            return source[current];
        }

        public void AddToken(TokenTypes type, string literal)
        {
            string text = source.Substring(start, current - start);
            tokens.Add(new Token(type, literal));
        }

        private void MakeString()
        {
            while (Peek() != '"' && !IsAtEnd())
            {
                if (Peek() == '\n') line++;
                Advance();
            }

            if (IsAtEnd())
            {
                Console.WriteLine("Unterminated string.");
                return;
            }

            Advance();

            string value = source.Substring(start + 1, current - start - 2);
            AddToken(TokenTypes.StringLiteral, value);
        }

        private void MakeNumber()
        {
            while (char.IsDigit(Peek())) Advance();

            if (Peek() == '.' && char.IsDigit(PeekNext()))
            {
                Advance();

                while (char.IsDigit(Peek())) Advance();
            }

            AddToken(TokenTypes.NumberLiteral, source.Substring(start, current - start));
        }

        private void MakeIdentifier()
        {
            while (char.IsLetterOrDigit(Peek())) Advance();

            string text = source.Substring(start, current - start);

            TokenTypes type;

            if (!Enum.TryParse(text, true, out type))
            {
                type = TokenTypes.Identifier;
            }

            AddToken(type);
        }


        private void ScanToken()
        {
            
            char c = CurrentChar();
            switch (c)
            {
                case '(': AddToken(TokenTypes.LeftParen); break;
                case ')': AddToken(TokenTypes.RightParen); break;
                case ';': AddToken(TokenTypes.Semicolon); break;
                case '+': AddToken(TokenTypes.Plus); break;
                case '-': AddToken(TokenTypes.Minus); break;
                case '*': AddToken(TokenTypes.Multiply); break;
                case '/': AddToken(TokenTypes.Divide); break;
                case '"': MakeString(); break;
                case ' ':
                case '\r':
                case '\t':
                    break;
                case '\n':
                    line++;
                    break;
                default:
                    if (char.IsDigit(c))
                    {
                        MakeNumber();
                    }
                    else if (char.IsLetter(c))
                    {
                        MakeIdentifier();
                    }
                    else
                    {
                        Console.WriteLine("Unexpected character.");
                    }
                    break;
            }
            Advance();
        }
    }
}
