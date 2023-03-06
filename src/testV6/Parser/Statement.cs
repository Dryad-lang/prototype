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
    public abstract class Statement
    {
        public class Expression : Statement
        {
            public Expression.Expression Expr { get; set; }

            public Expression(Expression.Expression expr)
            {
                this.Expr = expr;
            }
        }

        public class Function : Statement
        {
            public Token Name { get; set; }
            public List<Token> Parameters { get; set; }
            public List<Statement> Body { get; set; }

            public Function(Token name, List<Token> parameters, List<Statement> body)
            {
                this.Name = name;
                this.Parameters = parameters;
                this.Body = body;
            }
        }

        public class Let : Statement
        {
            public Token Name { get; set; }
            public Expression.Expression Value { get; set; }

            public Let(Token name, Expression.Expression value)
            {
                this.Name = name;
                this.Value = value;
            }
        }

        public class Return : Statement
        {
            public Token Keyword { get; set; }
            public Expression.Expression Value { get; set; }

            public Return(Token keyword, Expression.Expression value)
            {
                this.Keyword = keyword;
                this.Value = value;
            }
        }
    }
}
