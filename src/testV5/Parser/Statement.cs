using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using testV5.Lexer;
using testV5.Parser;

namespace testV5.Parser
{
    public class Statement
    {
        public class Block : Statement
        {
            public List<Statement> Statements { get; set; }

            public Block(List<Statement> statements)
            {
                Statements = statements;
            }
        }

        public class Expression : Statement
        {
            public Expression.Expression Expr { get; set; }

            public Expression(Expression.Expression expr)
            {
                Expr = expr;
            }
        }

        public class Function : Statement
        {
            public Token Name { get; set; }
            public List<Token> Parameters { get; set; }
            public List<Statement> Body { get; set; }

            public Function(Token name, List<Token> parameters, List<Statement> body)
            {
                Name = name;
                Parameters = parameters;
                Body = body;
            }
        }

        public class If : Statement
        {
            public Expression.Expression Condition { get; set; }
            public Statement ThenBranch { get; set; }
            public Statement ElseBranch { get; set; }

            public If(Expression.Expression condition, Statement thenBranch, Statement elseBranch)
            {
                Condition = condition;
                ThenBranch = thenBranch;
                ElseBranch = elseBranch;
            }
        }

        public class Else : Statement
        {
            public Statement ElseBranch { get; set; }

            public Else(Statement elseBranch)
            {
                ElseBranch = elseBranch;
            }
        }

        public class Return : Statement
        {
            public Token Keyword { get; set; }
            public Expression.Expression Value { get; set; }

            public Return(Token keyword, Expression.Expression value)
            {
                Keyword = keyword;
                Value = value;
            }
        }

        public class Let : Statement
        {
            public Token Name { get; set; }
            public Expression.Expression Initializer { get; set; }

            public Let(Token name, Expression.Expression initializer)
            {
                Name = name;
                Initializer = initializer;
            }
        }

        public class While : Statement
        {
            public Expression.Expression Condition { get; set; }
            public Statement Body { get; set; }

            public While(Expression.Expression condition, Statement body)
            {
                Condition = condition;
                Body = body;
            }
        }

        public class For : Statement
        {
            public Token Name { get; set; }
            public Expression.Expression Initializer { get; set; }
            public Expression.Expression Condition { get; set; }
            public Expression.Expression Increment { get; set; }
            public Statement Body { get; set; }

            public For(Token name, Expression.Expression initializer, Expression.Expression condition, Expression.Expression increment, Statement body)
            {
                Name = name;
                Initializer = initializer;
                Condition = condition;
                Increment = increment;
                Body = body;
            }
        }

        public class Assign : Statement
        {
            public Expression.Expression Name { get; set; }
            public Expression.Expression Value { get; set; }

            public Assign(Expression.Expression name, Expression.Expression value)
            {
                Name = name;
                Value = value;
            }
        }

        public class ArrayAssign : Statement
        {
            public Expression.ArrayVariable Name { get; set; }
            public Expression.Expression Value { get; set; }

            public ArrayAssign(Expression.ArrayVariable name, Expression.Expression value)
            {
                Name = name;
                Value = value;
            }
        }

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

        public class Using : Statement
        {
            public Token Name { get; set; }

            public Using(Token name)
            {
                Name = name;
            }
        }
    }
}
