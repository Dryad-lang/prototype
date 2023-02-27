const fs = require('fs');
const ohm = require('ohm-js');
const grammar = ohm.grammar(fs.readFileSync('./parser.ohm'));
const { BinaryExpression, NumberLiteral } = require('./ast');

function parse(input) {
  const match = grammar.match(input);
  if (match.succeeded()) {
    return ast(match);
  } else {
    throw new Error(match.message);
  }
}

function ast(match) {
  const astBuilder = grammar.createSemantics().addOperation('ast', {
    Expr_add: (left, _, right) => new BinaryExpression('+', left.ast(), right.ast()),
    Expr_sub: (left, _, right) => new BinaryExpression('-', left.ast(), right.ast()),
    Term_mul: (left, _, right) => new BinaryExpression('*', left.ast(), right.ast()),
    Term_div: (left, _, right) => new BinaryExpression('/', left.ast(), right.ast()),
    Factor_parens: (_, expr, __) => expr.ast(),
    number: (value) => new NumberLiteral(value.sourceString),
  });
  return astBuilder(match).ast();
}

module.exports = {
  parse,
};
