using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using testV6.Lexer;

/*
program      -> statement*
statement    -> assignment | expression

assignment   -> IDENTIFIER "=" expression
expression   -> term (("+" | "-") term)*
term         -> factor (("*" | "/") factor)*
factor       -> unary | binary | NUMBER | IDENTIFIER | function_call
unary        -> ("-" | "+") factor
binary       -> "(" expression ")"

function_decl -> "function" IDENTIFIER "(" parameters ")" "{" statement* "}"
parameters   -> IDENTIFIER ("," IDENTIFIER)*
function_call -> IDENTIFIER "(" arguments ")"
arguments    -> expression ("," expression)*

IDENTIFIER -> [a-zA-Z]+
NUMBER     -> [0-9]+

*/ 

namespace testV6.Parser
{
    public abstract class Expression
    {

        public class Binary : Expression
        {
            public Expression Left { get; set; }
            public Token Operator { get; set; }
            public Expression Right { get; set; }

            public Binary(Expression left, Token op, Expression right)
            {
                this.Left = left;
                this.Operator = op;
                this.Right = right;
            }
        }

        public class Grouping : Expression
        {
            public Expression Expression { get; set; }

            public Grouping(Expression expression)
            {
                this.Expression = expression;
            }
        }

        public class Literal : Expression
        {
            public object Value { get; set; }

            public Literal(object value)
            {
                this.Value = value;
            }
        }

        public class Unary : Expression
        {
            public Token Operator { get; set; }
            public Expression Right { get; set; }

            public Unary(Token op, Expression right)
            {
                this.Operator = op;
                this.Right = right;
            }
        }

        public class Variable : Expression
        {
            public Token Name { get; set; }

            public Variable(Token name)
            {
                this.Name = name;
            }
        }

        public class Assign : Expression
        {
            public Token Name { get; set; }
            public Expression Value { get; set; }

            public Assign(Token name, Expression value)
            {
                this.Name = name;
                this.Value = value;
            }
        }

        public class Call : Expression
        {
            public Expression Callee { get; set; }
            public Token Paren { get; set; }
            public List<Expression> Arguments { get; set; }

            public Call(Expression callee, Token paren, List<Expression> arguments)
            {
                this.Callee = callee;
                this.Paren = paren;
                this.Arguments = arguments;
            }
        }
    }
}
