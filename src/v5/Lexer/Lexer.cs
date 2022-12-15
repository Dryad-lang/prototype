using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace v5.Lexical
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
        private string _text = "";
        private int _pos;
        private int _line;
        private int _column;
        private char _currentChar;

        private TokenType _tokenType = new TokenType();

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

        private void SkipLineComment()
        {
            /*
            ALGORITHM:
            Skip a line comment by advancing the current position until we reach a newline character and 
            then advancing the current position one more time.
            */
            while (_currentChar != '\0' && _currentChar != '\r' && _currentChar != '\n')
            {
                Advance();
            }
            Advance();
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

        // MakeNumber

        private Token MakeNumber(string imput)
        {
            /*
            ALGORITHM:
            Make a number token from a string containing digits.
            If the string contains a dot, then it is a float. 
            Otherwise, it is an integer.
            If the number contains more than one dot then it is an sintax error.
            if ther is just number after dot then add zero before
            exemple:
            1. = 1.0 || .1 = 0.1
            if contains a comma then replace to a dot.
            */
            int dotCount = 0;
            string number = "";

            //Replace comma to dot
            imput = imput.Replace(',', '.');

            for (int i = 0; i < imput.Length; i++)
            {
                if (imput[i] == '.')
                {
                    dotCount++;
                    if (dotCount > 1)
                    {
                        Error("SyntaxError", "Invalid number format");
                    }
                    number += ".";
                }
                else if (imput[i] == ',')
                {
                    number += ".";
                }
                else if (_tokenType.INT_DIGITS.Contains(imput[i]))
                {
                    number += imput[i];
                }
                else
                {
                    Error("SyntaxError", "Invalid number format");
                }
            }

            if (dotCount == 0)
            {
                return new Token(number, _tokenType.INT, _line, _column);
            }
            else
            {
                return new Token(number, _tokenType.FLOAT, _line, _column);
            }
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
                    Advance();
                    continue;
                }

                if (_currentChar == '#')
                {
                    SkipLineComment();
                    continue;
                }

                if (_currentChar == '\n' || _currentChar == '\r')
                {
                    Advance();
                    _line++;
                    _column = 0;
                    return new Token(" ", _tokenType.NEWLINE, _line, _column);
                }

                if (_tokenType.INT_DIGITS.Contains(_currentChar))
                {
                    string number = "";
                    while (_tokenType.INT_DIGITS.Contains(_currentChar) || _tokenType.FLOAT_DIGITS.Contains(_currentChar))
                    {
                        number += _currentChar;
                        Advance();
                    }
                    return MakeNumber(number);
                }

                if (_currentChar == '(')
                {
                    Advance();
                    return new Token("(", _tokenType.LPAREN, _line, _column);
                }

                if (_currentChar == ')')
                {
                    Advance();
                    return new Token(")", _tokenType.RPAREN, _line, _column);
                }

                if (_currentChar == '+')
                {
                    Advance();
                    return new Token("+", _tokenType.OP_ADD, _line, _column);
                }

                if (_currentChar == '-')
                {
                    Advance();
                    return new Token("-", _tokenType.OP_SUB, _line, _column);
                }

                if (_currentChar == '*')
                {
                    Advance();
                    return new Token("*", _tokenType.OP_MUL, _line, _column);
                }

                if (_currentChar == '/')
                {
                    Advance();
                    return new Token("/", _tokenType.OP_DIV, _line, _column);
                }
                
                // if (_currentChar == '%')
                // {
                //     Advance();
                //     return new Token("%", _tokenType.OP_MOD, _line, _column);
                // }

                // if (_currentChar == '^')
                // {
                //     Advance();
                //     return new Token("^", _tokenType.OP_POW, _line, _column);
                // }

                Error("InvalidCharacter", "Invalid character: " + _currentChar);
            }
            return new Token(" ", _tokenType.EOF, _line, _column);
        }

        // Lex

        public List<Token> Lex(string text)
        {
            /*
            ALGORITHM:
            This method is responsible for returning a list of tokens.
            */
            _text = text;
            _pos = 0;
            _currentChar = _text[_pos];
            _line = 1;
            _column = 0;
            
            List<Token> tokens = new List<Token>();
            Token token = GetNextToken();

            if (text == null)
            {
                Error("InvalidInput", "Input is null");
            }
            else
            {
                while (token.Type != _tokenType.EOF)
                {
                    tokens.Add(token);
                    token = GetNextToken();
                }
                tokens.Add(token);
                return tokens;
            }
            return null;
        }
    }
}