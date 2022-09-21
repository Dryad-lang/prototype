using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using v2.objects;

namespace v2.tools
{
    public class Tokenizer
    {
        private char current;
        private string rawtext;
        private Info info = new();
        private List<Token> tokens = new();
        private DefautTypes defautTypes = new();
        private NumericValues numericValues = new();

        public Tokenizer(string textInput)
        {
            info.SetLine(-1);
            info.SetColum(1);
            info.SetPosition(0);
            rawtext = textInput;
        }

        public List<Token> Tokenize()
        {
            if (string.IsNullOrEmpty(rawtext))
            {
                return tokens;
            }
            while (info.position < rawtext.Length)
            {
                current = rawtext[info.position];
                if (current == ' ' || current == '\t')
                {
                    info.SetColum(info.colum + 1);
                    info.SetPosition(info.position + 1);
                }
                else if (current == '\n' || current == '\r')
                {
                    info.IncrementLine();
                    info.SetColum(1);
                    info.SetPosition(info.position + 1);
                    tokens.Add(new Token(defautTypes.TNewline, "\\n\\r"));
                }
                else if (current == '+')
                {
                    info.SetColum(info.colum + 1);
                    info.SetPosition(info.position + 1);
                    tokens.Add(new Token(defautTypes.TPlus, current.ToString()));
                }
                else if (current == '-')
                {
                    info.SetColum(info.colum + 1);
                    info.SetPosition(info.position + 1);
                    tokens.Add(new Token(defautTypes.TMinus, current.ToString()));
                }
                else if (current == '*')
                {
                    info.SetColum(info.colum + 1);
                    info.SetPosition(info.position + 1);
                    tokens.Add(new Token(defautTypes.TMultiply, current.ToString()));
                }
                else if (current == '/')
                {
                    info.SetColum(info.colum + 1);
                    info.SetPosition(info.position + 1);
                    tokens.Add(new Token(defautTypes.TDivide, current.ToString()));
                }
                else if (current == '(')
                {
                    info.SetColum(info.colum + 1);
                    info.SetPosition(info.position + 1);
                    tokens.Add(new Token(defautTypes.TLParen, current.ToString()));
                }
                else if (current == ')')
                {
                    info.SetColum(info.colum + 1);
                    info.SetPosition(info.position + 1);
                    tokens.Add(new Token(defautTypes.TRParen, current.ToString()));
                }
                else if (defautTypes.FLOAT_DIGITS.Contains(current) || defautTypes.INT_DIGITS.Contains(current))
                {
                    string number = "";
                    while (defautTypes.FLOAT_DIGITS.Contains(current) || defautTypes.INT_DIGITS.Contains(current))
                    {
                        number += current;
                        info.SetColum(info.colum + 1);
                        info.SetPosition(info.position + 1);
                        if (info.position < rawtext.Length)
                        {
                            current = rawtext[info.position];
                        }
                        else
                        {
                            break;
                        }
                    }
                    tokens.Add(numericValues.NumberFormat(number, info));
                }
                else if (current == '\0')
                {
                    tokens.Add(new Token(defautTypes.TEOF, current.ToString()));
                    break;
                }
                else
                {
                    ErrorHandler errorHandler = new();
                    errorHandler.SetErrorType("SyntaxError").SetErrorMessage($"Unexpected character »{current}«").SetInfo(info).ThrowError();
                    Console.WriteLine(info.line);
                    break;
                }
            }
            return tokens;
        }
    }
}