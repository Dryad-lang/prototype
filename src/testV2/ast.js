class BinaryExpression {
    constructor(operator, left, right) {
      this.operator = operator;
      this.left = left;
      this.right = right;
    }
  }
  
  class NumberLiteral {
    constructor(value) {
      this.value = value;
    }
  }

    module.exports = {
        BinaryExpression,
        NumberLiteral,
    };
  