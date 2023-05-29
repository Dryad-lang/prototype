const Mocha = require('mocha');
const mocha = new Mocha();

mocha.addFile('./tests/tokenizer.test.js');

mocha.run((failures) => {
    process.exitCode = failures ? 1 : 0;
});