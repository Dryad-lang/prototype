using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using testV5.Lexer;

namespace testV5.Parser
{
    public abstract class Expression
    {
        public class ArrayVariable
        {
            public string Name { get; set; }
            public List<Expression> Indexes { get; set; }

            public ArrayVariable(string name, List<Expression> indexes)
            {
                Name = name;
                Indexes = indexes;
            }
        }

        public class Binary : Expression
        {
            public Expression Left { get; set; }
            public Expression Right { get; set; }
            public TokenTypes Operator { get; set; }

            public Binary(Expression left, TokenTypes op, Expression right)
            {
                Left = left;
                Operator = op;
                Right = right;
            }
        }

        public class Call : Expression
        {
            public Expression Callee { get; set; }
            public Token Paren { get; set; }
            public List<Expression> Arguments { get; set; }

            public Call(Expression callee, Token paren, List<Expression> arguments)
            {
                Callee = callee;
                Paren = paren;
                Arguments = arguments;
            }
        }

        public class Unary : Expression
        {
            public Expression Right { get; set; }
            public TokenTypes Operator { get; set; }

            public Unary(TokenTypes op, Expression right)
            {
                Operator = op;
                Right = right;
            }
        }

        public class Variable : Expression
        {
            public Token Name { get; set; }

            public Variable(Token name)
            {
                Name = name;
            }
        }

        public class Literal : Expression
        {
            public object Value { get; set; }

            public Literal(object value)
            {
                Value = value;
            }
        }

        public class Grouping : Expression
        {
            public Expression Expression { get; set; }

            public Grouping(Expression expression)
            {
                Expression = expression;
            }
        }
    }
}
