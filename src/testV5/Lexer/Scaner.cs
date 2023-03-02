using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace testV5.Lexer
{
    public class Scanner
    {
        private readonly string source;
        private readonly List<Token> tokens = new List<Token>();

        private int start = 0;
        private int current = 0;
        private int line = 1;

        private static readonly Dictionary<string, TokenTypes> keywords = new Dictionary<string, TokenTypes>
        {
            { "and", TokenTypes.AND },
            { "or", TokenTypes.OR },
            { "not", TokenTypes.NOT },
            { "let", TokenTypes.LET },
            { "function", TokenTypes.FUNCTION },
            { "if", TokenTypes.IF },
            { "else", TokenTypes.ELSE },
            { "while", TokenTypes.WHILE },
            { "for", TokenTypes.FOR },
            { "return", TokenTypes.RETURN },
            { "true", TokenTypes.TRUE },
            { "false", TokenTypes.FALSE },
            { "null", TokenTypes.NULL },
            { "using", TokenTypes.USING }
        };

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

            tokens.Add(new Token(TokenTypes.EOF, "", new Object(), line));
            return tokens;
        }

        private void ScanToken()
        {
            char c = Advance();

            switch (c)
            {
                case '(': AddToken(TokenTypes.LEFT_PAREN); break;
                case ')': AddToken(TokenTypes.RIGHT_PAREN); break;
                case '{': AddToken(TokenTypes.LEFT_BRACE); break;
                case '}': AddToken(TokenTypes.RIGHT_BRACE); break;
                case ',': AddToken(TokenTypes.COMMA); break;
                case '.': AddToken(TokenTypes.DOT); break;
                case '-': AddToken(TokenTypes.MINUS); break;
                case '+': AddToken(TokenTypes.PLUS); break;
                case ';': AddToken(TokenTypes.SEMICOLON); break;
                case '/': AddToken(TokenTypes.SLASH); break;
                case '*': AddToken(TokenTypes.STAR); break;
                case '!': AddToken(Match('=') ? TokenTypes.BANG_EQUAL : TokenTypes.BANG); break;
                case '=': AddToken(Match('=') ? TokenTypes.EQUAL_EQUAL : TokenTypes.EQUAL); break;
                case '>': AddToken(Match('=') ? TokenTypes.GREATER_EQUAL : TokenTypes.GREATER); break;
                case '<': AddToken(Match('=') ? TokenTypes.LESS_EQUAL : TokenTypes.LESS); break;
                case ' ':
                case '\r':
                case '\t':
                    // Ignore whitespace.
                    break;

                case '\n':
                    line++;
                    break;

                case '"': ScanString(); break;

                default:
                    if (IsDigit(c))
                    {
                        ScanNumber();
                    }
                    else if (IsAlpha(c))
                    {
                        ScanIdentifier();
                    }
                    else
                    {
                        // TODO: Error handling.
                    }
                    break;
            }
        }

        private bool IsAtEnd()
        {
            return current >= source.Length;
        }

        private char Advance()
        {
            current++;
            return source[current - 1];
        }

        private void AddToken(TokenTypes type, object literal = null)
        {
            string lexeme = source.Substring(start, current - start);
            tokens.Add(new Token(type, lexeme, literal, line));
        }

        private bool Match(char expected)
        {
            if (IsAtEnd()) return false;
            if (source[current] != expected) return false;

            current++;
            return true;
        }

        private char Peek()
        {
            if (IsAtEnd()) return '\0';
            return source[current];
        }

        private char PeekNext()
        {
            if (current + 1 >= source.Length) return '\0';
            return source[current + 1];
        }

        private void ScanString()
        {
            while (Peek() != '"' && !IsAtEnd())
            {
                if (Peek() == '\n') line++;
                Advance();
            }

            // Unterminated string.
            if (IsAtEnd())
            {
                throw new Exception($"Unterminated string on line {line}.");
            }

            // The closing ".
            Advance();

            // Trim the surrounding quotes.
            string value = source.Substring(start + 1, current - start - 2);
            AddToken(TokenTypes.STRING, value);
        }

        private void ScanNumber()
        {
            while (IsDigit(Peek())) Advance();

            // Look for a fractional part.
            if (Peek() == '.' && IsDigit(PeekNext()))
            {
                // Consume the "."
                Advance();

                while (IsDigit(Peek())) Advance();
            }

            AddToken(TokenTypes.NUMBER, Double.Parse(source.Substring(start, current - start)));
        }

        private void ScanIdentifier()
        {
            while (IsAlphaNumeric(Peek())) Advance();

            // See if the identifier is a reserved word.
            string text = source.Substring(start, current - start);

            if (keywords.ContainsKey(text))
            {
                AddToken(keywords[text]);
            }
            else
            {
                AddToken(TokenTypes.IDENTIFIER);
            }
        }

        private bool IsDigit(char c)
        {
            return c >= '0' && c <= '9';
        }

        private bool IsAlpha(char c)
        {
            return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c == '_';
        }

        private bool IsAlphaNumeric(char c)
        {
            return IsAlpha(c) || IsDigit(c);
        }
    }
}


