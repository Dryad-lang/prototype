const ohm = require('ohm-js');

const grammar = ohm.grammar(`
Basic {
    Expr = Term "+" Expr   -- add
         | Term "-" Expr   -- sub
         | Term
    Term = Factor "*" Term -- mul
         | Factor "/" Term -- div
         | Factor
    Factor = "(" Expr ")"  -- parens
           | number
    number = digit+
}  
`);

module.exports = grammar.createLexer();
