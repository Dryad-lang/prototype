using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace v5.Lexer
{
    public class TokenType
    {
        public readonly string EOF = "EOF";
        public readonly string INT = "INT";
        public readonly string FLOAT = "FLOAT";
        public readonly string OP_ADD = "OP_ADD";
        public readonly string OP_SUB = "OP_SUB";
        public readonly string OP_MUL = "OP_MUL";
        public readonly string OP_DIV = "OP_DIV";
        public readonly string OP_MOD = "OP_MOD";
        public readonly string OP_POW = "OP_POW";
        public readonly string INT_DIGITS = "0123456789";
        public readonly string FLOAT_DIGITS = ".,";
        public readonly string LPAREN = "LPAREN";
        public readonly string RPAREN = "RPAREN";
        public readonly string NEWLINE = "NEWLINE";
    }

    public class Token
    {
        public string Value { get; set; }
        public string Type { get; set; }
        public int Line { get; set; }
        public int Column { get; set; }
        public Token(string value, string type, int line, int column)
        {
            Value = value;
            Type = type;
            Line = line;
            Column = column;
        }
    }


    public class Lexer
    {
        private string _text;
        private int _pos;
        private int _line;
        private int _column;
        private char _currentChar;

        private TokenType _tokenType = new TokenType();


        public Lexer(string text)
        {
            _text = text;
            _pos = 0;
            _line = 1;
            _column = 0;
            _currentChar = _text[_pos];
        }

        private void Advance()
        {
            /*
            ALGORITHM:
            Advance the current position in the input and set the current character variable.
            If the current character is \0, then we have reached the end of the input.
            */
            _pos++;
            if (_pos > _text.Length - 1)
            {
                _currentChar = '\0';
            }
            else
            {
                _currentChar = _text[_pos];
            }
        }

        private char PeekNextChar()
        {
            /*
            ALGORITHM:
            Return the next character in the input without advancing the current position.
            */
            int peekPos = _pos + 1;
            if (peekPos > _text.Length - 1)
            {
                return '\0';
            }
            else
            {
                return _text[peekPos];
            }
        }

        private void SkipWhitespace()
        {
            /*
            ALGORITHM:
            Skip all whitespace characters in the input.
            Verify if the curent char is not EOF
            */
            while (_currentChar != '\0' && char.IsWhiteSpace(_currentChar))
            {
                if (_currentChar == ' ' || _currentChar == '\t')
                {
                    Advance();
                }
            }
        }

        private void SkipLineComment()
        {
            /*
            ALGORITHM:
            Skip all characters until we reach a newline character.
            */
            while (_currentChar != '\0' && _currentChar != ' ' && _currentChar != '\t')
            {
                Advance();
            }
        }

        private void Error(string errortype, string message)
        {
            /*
            ALGORITHM:
            Trow a new error message.
            */
            string error = errortype + " at line " + _line + " and column " + _column + ": " + message;
            throw new Exception(error);
        }
        // Lexer

        private Token GetNextToken()
        {
            /*
            ALGORITHM:
            Lexical analyzer (also known as scanner or tokenizer)
            This method is responsible for breaking a sentence apart into tokens.
            One token at a time.
            */
            while (_currentChar != '\0')
            {
                if (char.IsWhiteSpace(_currentChar))
                {
                    SkipWhitespace();
                    continue;
                }

                if (_currentChar == '#')
                {
                    SkipLineComment();
                    continue;
                }

                if (_currentChar == '\r')
                {
                    Advance();
                    continue;
                }

                if (_currentChar == '\n')
                {
                    Advance();
                    _line++;
                    _column = 0;
                    return new Token(" ", _tokenType.NEWLINE, _line, _column);
                }
                
                Error("InvalidCharacter", "Invalid character: " + _currentChar);
            }
            return new Token(" ", _tokenType.EOF, _line, _column);
        }
    }
}