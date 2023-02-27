const { parse } = require('./parser');
const { interpret } = require('./interpreter');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter an expression: ', (input) => {
  const ast = parse(input);
  const result = interpret(ast);
  console.log(`Result: ${result}`);
  rl.close();
});
