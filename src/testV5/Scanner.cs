using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

/*

    public enum TokenTypes
    {
        // Operators
        OP_ADD, OP_MUL, OP_DIV, OP_SUB,
        OP_ASG,
        
        // Seprators
        COMA, LPAREN, RPAREN, RBRACK, LBRACK,
        
        // Literals
        NUMBER, IDENTIFYER, STRING,

        // Keywords
        FUNCTION, LET, RETURN,
        
        // SPECIAL
        EOF
    }
*/ 

namespace testV5
{
    public class Scanner
    {
        List<Token> tokens = new();
        string source;
        int index = 1;
        int line = 1;
        string currentToken = "";

        // Keywords dictionary
        Dictionary<string, TokenTypes> keywords = new()
        {
            { "fn", TokenTypes.FUNCTION },
            { "let", TokenTypes.LET },
            { "return", TokenTypes.RETURN }
        };

        public Scanner(string source)
        {
            this.source = source;
        }

        private bool IsAtEnd()
        {
            return index >= source.Length;
        }


        private void AddToken(TokenTypes type)
        {
            tokens.Add(new Token(type, currentToken));
        }

        private void AddToken(TokenTypes type, string literal)
        {
            tokens.Add(new Token(type, literal));
        }

        private char Advance()
        {
            index++;
            return source[index - 1];
        }

        private void MakeString()
        {
            StringBuilder sb = new StringBuilder();

            while (source[index] != '"' && !IsAtEnd())
            {
                if (source[index] == '\n')
                {
                    line++;
                }
                sb.Append(source[index]);
                index++;
            }

            if (IsAtEnd())
            {
                Console.WriteLine("Error: Unterminated string");
                return;
            }

            // Consume the closing "
            index++;
        }

        private void MakeNumber()
        {
            while (char.IsDigit(source[index]))
            {
                index++;
            }

            // Look for a fractional part
            if (source[index] == '.' && char.IsDigit(source[index + 1]))
            {
                // Consume the "."
                index++;

                while (char.IsDigit(source[index]))
                {
                    index++;
                }
            }

            AddToken(TokenTypes.NUMBER, source.Substring(index, index - 1));
        }

        private void MakeIdentifyer()
        {
            while (char.IsLetterOrDigit(source[index]))
            {
                index++;
            }

            string text = source.Substring(index, index - 1);

            if (keywords.ContainsKey(text))
            {
                AddToken(keywords[text]);
            }
            else
            {
                AddToken(TokenTypes.IDENTIFYER);
            }
        }

        public List<Token> ScanTokens()
        {
            while (!IsAtEnd())
            {
                index++;
                char c = source[index - 1];
                switch (c)
                {
                    case ' ':
                    case '\r':
                    case '\t':
                        break;
                    case '(':
                        AddToken(TokenTypes.LPAREN);
                        break;
                    case ')':
                        AddToken(TokenTypes.RPAREN);
                        break;
                    case '{':
                        AddToken(TokenTypes.LBRACK);
                        break;
                    case '}':
                        AddToken(TokenTypes.RBRACK);
                        break;
                    case ',':
                        AddToken(TokenTypes.COMA);
                        break;
                    case '-':
                        AddToken(TokenTypes.OP_SUB);
                        break;
                    case '+':
                        AddToken(TokenTypes.OP_ADD);
                        break;
                    case '*':
                        AddToken(TokenTypes.OP_MUL);
                        break;
                    case '/':
                        AddToken(TokenTypes.OP_DIV);
                        break;
                    case '=':
                        AddToken(TokenTypes.OP_ASG);
                        break;
                    case '"':
                        MakeString();
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
                            MakeIdentifyer();
                        }
                        else
                        {
                            Console.WriteLine("Error: Unrecognized character");
                        }
                        break;
                }
            }
            return tokens;
        }
    }
}
