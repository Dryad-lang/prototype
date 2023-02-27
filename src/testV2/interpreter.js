const { BinaryExpression, NumberLiteral } = require('./ast');

function interpret(node) {
  if (node instanceof BinaryExpression) {
    const left = interpret(node.left);
    const right = interpret(node.right);
    switch (node.operator) {
      case '+': return left + right;
      case '-': return left - right;
      case '*': return left * right;
      case '/': return left / right;
      default: throw new Error(`Unknown operator ${node.operator}`);
    }
  } else if (node instanceof NumberLiteral) {
    return parseInt(node.value, 10);
  } else {
    throw new Error(`Unknown AST node ${node.constructor.name}`);
  }
}

module.exports = {
  interpret,
};
