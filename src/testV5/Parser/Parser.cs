using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using testV5.Lexer;
using testV5.Parser;

namespace testV5.Parser
{
    public class Parser
    {
        private List<Token> tokens;
        private int _current = 0;
        private int _previous = 0;

        public Parser(List<Token> tokens)
        {
            this.tokens = tokens;
        }

        // Functional methods

        private bool Match(params TokenTypes[] types)
        {
            foreach (TokenTypes type in types)
            {
                if (Check(type))
                {
                    Advance();
                    return true;
                }
            }

            return false;
        }

        private bool Check(TokenTypes type)
        {
            if (IsAtEnd())
            {
                return false;
            }

            return Peek().Type == type;
        }

        private Token Advance()
        {
            if (!IsAtEnd())
            {
                _current++;
            }

            return Previous();
        }

        private bool IsAtEnd()
        {
            return Peek().Type == TokenTypes.EOF;
        }

        private Token Peek()
        {
            return tokens[_current];
        }

        private Token Previous()
        {
            return tokens[_previous];
        }

        private Token Consume(TokenTypes type, string message)
        {
            if (Check(type))
            {
                return Advance();
            }

            throw new Exception(message);
        }

        // Parsing methods

        

    }
}
