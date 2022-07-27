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
                        throw new Exception("Invalid number: More than one coma invalid float!");
                    }
                    result += c;
                }
                else
                {
                    throw new Exception("Invalid number");
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
                if(current == ' ' || current == '\t' || current == '\n')
                {
                    SkipWhitespace();
                    continue;
                }

                if(current == '\n')
                {
                    line++;
                    col = 1;
                }
                
                if(current == '#')
                {
                    SkipComment();
                    continue;
                }

                if(current == '+')
                {
                    tokens.Add(new Token(types.TPlus, "+"));
                    Next();
                    continue;
                }

                if (current == '-')
                {
                    tokens.Add(new Token(types.TMinus, "-"));
                    Next();
                    continue;
                }

                if (current == '*')
                {
                    tokens.Add(new Token(types.TMultiply, "*"));
                    Next();
                    continue;
                }

                if (current == '/')
                {
                    tokens.Add(new Token(types.TDivide, "/"));
                    Next();
                    continue;
                }

                if (current == '(')
                {
                    tokens.Add(new Token(types.TLParen, "("));
                    Next();
                    continue;
                }

                if (current == ')')
                {
                    tokens.Add(new Token(types.TRParen, ")"));
                    Next();
                    continue;
                }

                if (types.INT_DIGITS.Contains(current))
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
            }
            tokens.Add(new Token("EOF", ""));
        }
    }

    public class Lexer
    {
        private Tokenizer tokenizer = new(" ");

        public Lexer AddRawText(string rawText)
        {
            this.tokenizer = new Tokenizer(rawText);
            return this;
        }

        public List<Token> Tokenize()
        {
            tokenizer.RunTokens();
            return tokenizer.tokens;
        }

    }
}
