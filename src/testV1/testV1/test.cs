using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Irony.Parsing;

namespace testV1
    
{
    public class SimpleLanguageGrammar : Grammar
    {
        public SimpleLanguageGrammar() : base(caseSensitive: false)
        {
            var number = new NumberLiteral("number");

            var expr = new NonTerminal("expr");
            var term = new NonTerminal("term");
            var factor = new NonTerminal("factor");

            var addExpr = new NonTerminal("addExpr");
            addExpr.Rule = expr + "+" + term;

            expr.Rule = addExpr | term;
            term.Rule = factor | term + "*" + factor | term + "/" + factor;
            factor.Rule = number | "(" + expr + ")";

            // Adicione a ação semântica à produção correspondente à regra de adição
            addExpr.
            };

            this.Root = expr;
        }
    }

}
