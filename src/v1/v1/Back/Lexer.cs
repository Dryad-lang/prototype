using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace v1.Back
{
    public class Token
    {
        private string _type = "";
        private string _value = "";

        public string Type
        {
            get { return _type; }
        }

        public string Value
        {
            get { return _value; }
        }

        public Token(string type, string value)
        {
            _type = type;
            _value = value;
        }


    }

    public class TokenTypes
    {
        public readonly string FLOAT_DIGITS = ",.";
        public readonly string INT_DIGITS = "0123456789";
        // Types
        public readonly string TInt = "INT";
        public readonly string TFloat = "FLOAT";
        public readonly string TPlus = "MATH_PLUS";
        public readonly string TMinus = "MATH_MINUS";
        public readonly string TMultiply = "MATH_MULTIPLY";
        public readonly string TDivide = "MATH_DIVIDE";
        public readonly string TLParen = "L_PAREN";
        public readonly string TRParen = "R_PAREN";
        public readonly string TNewline = "NEWLINE";
    }

    public class Error
    {
        private string _message = "";
        private char _current;
        private int _pos = 0;
        private int _line = 0;
        private int _col = 0;

        public string Message
        {
            get { return _message; }
        }

        public char Current
        {
            get { return _current; }
        }

        public int Pos
        {
            get { return _pos; }
        }

        public int Line
        {
            get { return _line; }
        }

        public int Col
        {
            get { return _col; }
        }

        public Error SetMessage(string message)
        {
            this._message = message;
            return this;
        }

        public Error SetCurrent(char current)
        {
            this._current = current;
            return this;
        }

        public Error SetPos(int pos)
        {
            this._pos = pos;
            return this;
        }

        public Error SetLine(int line)
        {
            this._line = line;
            return this;
        }

        public Error SetCol(int col)
        {
            this._col = col;
            return this;
        }

        public string GetError()
        {
            string error = $"{_message} : [{_current}] <- at line {_line} in pos {_pos} : col {_col}";
            return error;
        }
    }


    public class Tokenizer
    {
        private string text { get; set; }
        private int pos { get; set; }
        private int line { get; set; }
        private int col { get; set; }
        private char current { get; set; }
        public List<Token> tokens { get; set; }
        public TokenTypes types = new();

        public Tokenizer(string text)
        {
            tokens = new List<Token>();
            this.text = text;
            this.pos = 0;
            this.line = 1;
            this.col = 1;
            this.current = text[pos];
        }

        public void Next()
        {
            if (pos < text.Length - 1)
            {
                pos++;
                current = text[pos];
                col++;
            }
            else
            {
                current = '\0';
            }
        }

        public void SkipComment()
        {
            while (current != '\0' && current != '\n')
            {
                Next();
            }
        }

        public void SkipWhitespace()
        {
            while (current != '\0' && current.ToString().ToCharArray().All(c => c == ' ' || c == '\t'))
            {
                Next();
            }
        }

        public Token MakeNumber(string value)
        {
            const string DIGITS = "0123456789";
            string _value = "";
            string result = "";
            int coma = 0;

            //Finds dots and replaces them with commas if exists
            _value = value.Replace(".", ",");

            foreach (char c in value)
            {
                if (DIGITS.Contains(c.ToString()))
                {
                    result += c;
                }
                else if (c == '.' || c == ',')
                {
                    coma++;
                    if (coma > 1)
                    {
                        Error error = new Error()
                            .SetPos(pos)
                            .SetCol(col)
                            .SetMessage("Invalid number: More than one coma invalid float!")
                            .SetCurrent(c);
                        throw new Exception(error.GetError());
                    }
                    result += c;
                }
                else
                {
                    Error error = new Error()
                        .SetPos(pos)
                        .SetCol(col)
                        .SetMessage("Invalid number")
                        .SetCurrent(current);
                    throw new Exception(error.GetError());
                }
            }
            if (coma > 0)
            {
                return new Token(types.TFloat, result);
            }
            else
            {
                return new Token(types.TInt, result);
            }
        }

        public void RunTokens()
        {
            while (current != '\0')
            {
                if (current == ' ' || current == '\t' || current == '\n')
                {
                    SkipWhitespace();
                    continue;
                }
                else if (current == '\n')
                {
                    line++;
                    col = 1;
                }

                else if (current == '#')
                {
                    SkipComment();
                    continue;
                }

                else if (current == '+')
                {
                    tokens.Add(new Token(types.TPlus, "+"));
                    Next();
                    continue;
                }

                else if (current == '-')
                {
                    tokens.Add(new Token(types.TMinus, "-"));
                    Next();
                    continue;
                }

                else if (current == '*')
                {
                    tokens.Add(new Token(types.TMultiply, "*"));
                    Next();
                    continue;
                }

                else if (current == '/')
                {
                    tokens.Add(new Token(types.TDivide, "/"));
                    Next();
                    continue;
                }

                else if (current == '(')
                {
                    tokens.Add(new Token(types.TLParen, "("));
                    Next();
                    continue;
                }

                else if (current == ')')
                {
                    tokens.Add(new Token(types.TRParen, ")"));
                    Next();
                    continue;
                }

                else if (current == '\n')
                {
                    tokens.Add(new Token(types.TNewline, "\n"));
                    Console.WriteLine("Newline");
                    Next();
                    continue;
                }

                else if (types.INT_DIGITS.Contains(current))
                {
                    string value = "";
                    while (types.INT_DIGITS.Contains(current) || types.FLOAT_DIGITS.Contains(current))
                    {
                        value += current;
                        Next();
                    }
                    tokens.Add(MakeNumber(value));
                    continue;
                }

                else
                {
                    Error error = new Error()
                        .SetPos(pos)
                        .SetCol(col)
                        .SetMessage("Illegal char")
                        .SetCurrent(current);
                    throw new Exception(error.GetError());
                }
            }
            tokens.Add(new Token("EOF", "\0"));
        }
    }

    public class Lexer
    {
        private Tokenizer tokenizer = new(" ");

        public Lexer AddRawText(string rawText)
        {
            if (!string.IsNullOrEmpty(rawText))
            {
                tokenizer = new Tokenizer(rawText);
                return this;
            }
            else
            {
                return this;
            }
        }
        public List<Token> Tokenize()
        {
            tokenizer.RunTokens();
            return tokenizer.tokens;
        }

    }
}
