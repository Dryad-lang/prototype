/*
    * Dryad intepreter test


    -----------------------
    |  Dryad interpreter  |
    -----------------------


    literals

    - number
    - string
    - identifyer

    operators

    - + - * / =

    statements

    - print "hello world"

    - print 1 + 2

    - let <identifyer> = value;

    - <identifyer> = value;
*/



// Types

const NUMBER            = 'NUMBER'; //0-9
const STRING            = 'STRING'; //"*"
const IDENTIFIER        = 'IDENTIFIER';//<ID>

// Operators

const PLUS              = 'PLUS';   //+
const MINUS             = 'MINUS';  //-
const MULTIPLY          = 'MULTIPLY';//*
const DIVIDE            = 'DIVIDE'; ///
const ASSIGN            = 'ASSIGN'; //=

// Keywords

const PRINT             = 'PRINT';  //PRINT
const LET               = 'LET';    //LET

// Special

const EOF               = 'EOF';
const PROGRAM           = 'PROGRAM'; //PROGRAM

// Separators

const LINEEND           = 'LINEEND';    //;
const LEFT_PAREN        = 'LEFT_PAREN'; //(
const RIGHT_PAREN       = 'RIGHT_PAREN';//)


// Token

class Token {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}


// Lexer

/*
tokenizer:

[
    { type: 'NUMBER', value: 1 },
    { type: 'PLUS', value: '+' },
    { type: 'NUMBER', value: 2 },
    { type: 'EOF', value: null }
]
*/ 

function tokenizer(imput){
    let current = 0;
    let tokens = [];

    function isDigit(char){
        return char >= '0' && char <= '9';
    }

    function isAlpha(char){
        return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z');
    }

    function makeString(){
        let value = '';

        current++;

        while(imput[current] !== '"'){
            value += imput[current];
            current++;
        }

        current++;

        return new Token(STRING, value);
    }

    function makeNumber(){
        let value = '';

        while(isDigit(imput[current])){
            value += imput[current];
            current++;
        }

        return new Token(NUMBER, value);
    }

    function makeIdentifier(){
        let value = '';

        while(isAlpha(imput[current])){
            value += imput[current];
            current++;
        }

        if(value === 'print'){
            return new Token(PRINT, value);
        }
        else if(value === 'let'){
            return new Token(LET, value);
        }
        else{
            return new Token(IDENTIFIER, value);
        }
    }



    while(current < imput.length){
        let char = imput[current];

        if(char === '\n' || char === '\r'){
            current++;
            continue;
        }

        if(char === ' '){
            current++;
            continue;
        }

        if(char === '"'){
            tokens.push(makeString());
            continue;
        }

        if(isDigit(char)){
            tokens.push(makeNumber());
            continue;
        }

        if(isAlpha(char)){
            tokens.push(makeIdentifier());
            continue;
        }

        if(char === '+'){
            tokens.push(new Token(PLUS, char));
            current++;
            continue;
        }

        if(char === '-'){
            tokens.push(new Token(MINUS, char));
            current++;
            continue;
        }

        if(char === '*'){
            tokens.push(new Token(MULTIPLY, char));
            current++;
            continue;
        }

        if(char === '/'){
            tokens.push(new Token(DIVIDE, char));
            current++;
            continue;
        }

        if(char === '='){
            tokens.push(new Token(ASSIGN, char));
            current++;
            continue;
        }

        if(char === ';'){
            tokens.push(new Token(LINEEND, char));
            current++;
            continue;
        }

        if(char === '('){
            tokens.push(new Token(LEFT_PAREN, char));
            current++;
            continue;
        }

        if(char === ')'){
            tokens.push(new Token(RIGHT_PAREN, char));
            current++;
            continue;
        }

        throw new Error('Unknown character: ' + char);
    }

    tokens.push(new Token(EOF, null));

    return tokens;
}


// Test

// let imput = `
//     print "hello world"
//     print 1 + 2
// `

// let tokens = tokenizer(imput);
// console.log(tokens);


// Parser

/*

imput:

print "hello world";
print 1 + 2;

parser:

{
    type: 'Program',
    body: [
        {
            type: 'PrintStatement',
            value: {}
            childreen: [
                {
                    type: 'StringLiteral',
                    value: 'hello world'
                    childreen: []
                }
            ]
        },<- ; end line separator
        {
            type: 'PrintStatement',
            value: {}
            childreen: [
                {
                    type: 'PlusOperator',
                    value: '+'
                    childreen: [
                        {
                            type: 'NumberLiteral',
                            value: 1
                            childreen: []
                        },
                        {
                            type: 'NumberLiteral',
                            value: 2
                            childreen: []
                        }
                    ]
                }
            ]
        },
        {
            type: 'ProgramEnd',
            value: {}
            childreen: []
        }
    ]
}
*/

// Program

class AstNode{
    constructor(type, value, childreen){
        this.type = type;
        this.value = value;
        this.childreen = childreen;
    }
}

// Parsing nodes

/*
class Expression extends AstNode

Left Right Self
    1 + 2

    Tree

      +
     / \
    1   2

    Structure

    {
        type: 'PlusOperator',
        value: '+'
        childreen: [
            {
                type: 'NumberLiteral',
                value: 1
                childreen: []
            },
            {
                type: 'NumberLiteral',
                value: 2
                childreen: []
            }
        ]
    }

    1 * (1 + 2)

    Tree

             *
            / \
           1   +
              / \
             1   2

    Structure

    {
        type: 'MultiplyOperator',
        value: '*'
        childreen: [
            {
                type: 'NumberLiteral',
                value: 1
                childreen: []
            },
            {
                type: 'PlusOperator',
                value: '+'
                childreen: [
                    {
                        type: 'NumberLiteral',
                        value: 1
                        childreen: []
                    },
                    {
                        type: 'NumberLiteral',
                        value: 2
                        childreen: []
                    }
                ]
            }
        ]
    }
*/
class Expression extends AstNode{
    constructor(type, value, childreen){
        super(type, value, childreen);
    }
}

class parseBinaryExpression extends Expression{
    constructor(type, value, childreen){
        super(type, value, childreen);
    }
}

// Statements
/*
class Statement extends AstNode

    print 1 + 2;

    Tree

    print
          +
         / \
        1   2

    Structure

    {
        type: 'PrintStatement',
        value: {}
        childreen: [
            {
                type: 'PlusOperator',
                value: '+'
                childreen: [
                    {
                        type: 'NumberLiteral',
                        value: 1
                        childreen: []
                    },
                    {
                        type: 'NumberLiteral',
                        value: 2
                        childreen: []
                    }
                ]
            }
        ]
    }

    print "hello world";

    Tree

    print
        "hello world"

    Structure

    {
        type: 'PrintStatement',
        value: {}
        childreen: [
            {
                type: 'StringLiteral',
                value: 'hello world'
                childreen: []
            }
        ]
    }
*/

class Statement extends AstNode{
    constructor(type, value, childreen){
        super(type, value, childreen);
    }
}

// Program

class Program extends AstNode{
    constructor(type, value, childreen){
        super(type, value, childreen);
    }
}

// Ast

class Ast{
    constructor(
        root
    ){
        this.root = null;
    }
}

// Parser

class Parser{
    constructor(tokens){
        this.tokens = tokens;
        this.current = 0;
        this.ast = null;
    }


    // Util methods

    getCurrentToken(){
        return this.tokens[this.current];
    }

    getNextToken(){
        return this.tokens[this.current + 1];
    }

    getNextNextToken(){
        return this.tokens[this.current + 2];
    }

    eat(type){
        if(this.getCurrentToken().type === type){
            this.current++;
            return true;
        }
        return false;
    }

    eatAndReturn(type){
        if(this.getCurrentToken().type === type){
            let token = this.getCurrentToken();
            this.current++;
            return token;
        }
        return null;
    }

    // Parser methods

    parse(){
        let ast = new Ast();

        ast.root = this.program();

        return ast;
    }

    program(){
        let root = new Program('Program', {}, []);

        while(this.getCurrentToken().type !== EOF){
            root.childreen.push(this.statement());
        }

        return root;
    }

    statement(){
        if(this.getCurrentToken().type === PRINT){
            return this.printStatement();
        }
        if(this.getCurrentToken().type === LET){
            return this.letStatement();
        }
        if(this.getCurrentToken().type === IDENTIFIER){
            return this.assignmentStatement();
        }

        return this.expressionStatement();
    }

    printStatement(){
        let root = new Statement('PrintStatement', {}, []);

        this.eat(PRINT);

        root.childreen.push(this.expression());

        return root;
    }

    letStatement(){
        let root = new Statement('LetStatement', {}, []);

        this.eat(LET);

        root.childreen.push(this.identifier());

        this.eat(ASSIGN);

        root.childreen.push(this.expression());

        return root;
    }

    assignmentStatement(){
        let root = new Statement('AssignmentStatement', {}, []);

        root.childreen.push(this.identifier());

        this.eat(ASSIGN);

        root.childreen.push(this.expression());

        return root;
    }

    expressionStatement(){
        let root = new Statement('ExpressionStatement', {}, []);

        root.childreen.push(this.expression());

        return root;
    }

        /*
    Expressions
        1 + 2
        1 - 2
        1 * 2
        1 / 2
        2*(1 + 2)
        2*(1 - 2)
        2*(1 * 2)
        2*(1 / 2)

    Tree

    1 + 2

        +
         / \
        1   2

    2 * (1 + 2)
    
         *
        / \
       2   +
          / \
         1   2

    Terms:
        1 + 2
        1 - 2

    Factors:
        1 * 2
        1 / 2

    Operations:

    1 + 2 PLUS
    1 - 2 MINUS
    1 * 2 MULTIPLY
    1 / 2 DIVIDE
    */

    expression(){
        return this.term();
    }

    term(){
        let root = this.factor();

        while(this.getCurrentToken().type === PLUS || this.getCurrentToken().type === MINUS){
            let token = this.eatAndReturn(this.getCurrentToken().type);
            if(token.type === PLUS){
                root = new parseBinaryExpression('PlusOperator', token.value, [root, this.factor()]);
            }

            if(token.type === MINUS){
                root = new parseBinaryExpression('MinusOperator', token.value, [root, this.factor()]);
            }
        }

        return root;
    }

    factor(){
        let root = this.primary();

        while(this.getCurrentToken().type === MULTIPLY || this.getCurrentToken().type === DIVIDE){
            let token = this.eatAndReturn(this.getCurrentToken().type);

            // root = new parseBinaryExpression(token.value, {}, [root, this.primary()]);

            if(token.type === MULTIPLY){
                root = new parseBinaryExpression('MultiplyOperator', token.value, [root, this.primary()]);
            }

            if(token.type === DIVIDE){
                root = new parseBinaryExpression('DivideOperator', token.value, [root, this.primary()]);
            }
        }

        return root;
    }

    primary(){
        if(this.getCurrentToken().type === NUMBER){
            return this.numberLiteral();
        }
        if(this.getCurrentToken().type === STRING){
            return this.stringLiteral();
        }
        if(this.getCurrentToken().type === IDENTIFIER){
            return this.identifier();
        }
        if(this.getCurrentToken().type === LEFT_PAREN){
            return this.parenExpression();
        }
    }

    numberLiteral(){
        let token = this.eatAndReturn(NUMBER);

        return new AstNode('NumberLiteral', token.value, []);
    }

    stringLiteral(){
        let token = this.eatAndReturn(STRING);

        return new AstNode('StringLiteral', token.value, []);
    }

    identifier(){
        let token = this.eatAndReturn(IDENTIFIER);

        return new AstNode('Identifier', token.value, []);
    }

    parenExpression(){
        this.eat(LEFT_PAREN);

        let root = this.expression();

        this.eat(RIGHT_PAREN);

        return root;
    }

    parseBinaryExpression(operator, value, childreen){
        return new AstNode(operator, value, childreen);
    }
}

    // expressions operations: - + / *

// Test

// let imput = `
//     let a = 1 + 2
//     let b = 2 * (1 + 2)
//     print b
// `
// let tokens = tokenizer(imput);

// // console.log(tokens);

// let parser = new Parser(tokens);

// let ast = parser.parse();

// console.log(
//     JSON.stringify(ast, null, 2)
// );


// Interpreter

/*

AST example:

{
  "root": {
    "type": "Program",
    "value": {},
    "childreen": [
      {
        "type": "LetStatement",
        "value": {},
        "childreen": [
          {
            "type": "Identifier",
            "value": "a",
            "childreen": []
          },
          {
            "type": "+",
            "value": {},
            "childreen": [
              {
                "type": "NumberLiteral",
                "value": "1",
                "childreen": []
              },
              {
                "type": "NumberLiteral",
                "value": "2",
                "childreen": []
              }
            ]
          }
        ]
      },
      {
        "type": "PrintStatement",
        "value": {},
        "childreen": [
          {
            "type": "Identifier",
            "value": "a",
            "childreen": []
          }
        ]
      }
    ]
  }
}
*/
class Interpreter{
    constructor(ast){
        this.ast = ast;
        this.variables = {};
        this.result_program = {};
    }

    // Utils functions

    getVariableValue(variableName){
        return this.variables[variableName];
    }

    setVariableValue(variableName, value){
        this.variables[variableName] = value;
    }

    setProgram(
        programName,
        variables    
    ){
        this.result_program[programName] = programValue;
    }


    
    // Interpreter functions


    interpret(){
        this.visit(this.ast.root);
    }

    visit(node){
        if(node.type === 'Program'){
            return this.visitProgram(node);
        }
        if(node.type === 'LetStatement'){
            return this.visitLetStatement(node);
        }
        if(node.type === 'PrintStatement'){
            return this.visitPrintStatement(node);
        }
        if(node.type === 'NumberLiteral'){
            return this.visitNumberLiteral(node);
        }
        if(node.type === 'StringLiteral'){
            return this.visitStringLiteral(node);
        }
        if(node.type === 'Identifier'){
            return this.visitIdentifier(node);
        }
        if(node.type === 'PlusOperator'){
            return this.visitPlusOperator(node);
        }
        if(node.type === 'MinusOperator'){
            return this.visitMinusOperator(node);
        }
        if(node.type === 'MultiplyOperator'){
            return this.visitMultiplyOperator(node);
        }
        if(node.type === 'DivideOperator'){
            return this.visitDivideOperator(node);
        }
    }

    visitProgram(node){
        node.childreen.forEach(child => {
            this.visit(child);
        });
    }

    visitLetStatement(node){
        let variableName = node.childreen[0].value;
        let variableValue = this.visit(node.childreen[1]);

        this.setVariableValue(variableName, variableValue);
    }

    visitPrintStatement(node){
        let variableName = node.childreen[0].value;
        let variableValue = this.getVariableValue(variableName);

        console.log(variableValue);
    }

    visitNumberLiteral(node){
        return node.value;
    }

    visitStringLiteral(node){
        return node.value;
    }

    visitIdentifier(node){
        return this.getVariableValue(node.value);
    }

    visitPlusOperator(node){
        // Convert to float representation
        return parseFloat(this.visit(node.childreen[0])) + parseFloat(this.visit(node.childreen[1]));
    }

    visitMinusOperator(node){
        // Convert to float representation
        return parseFloat(this.visit(node.childreen[0])) - parseFloat(this.visit(node.childreen[1]));
    }

    visitMultiplyOperator(node){
        // Convert to float representation
        return parseFloat(this.visit(node.childreen[0])) * parseFloat(this.visit(node.childreen[1]));
    }

    visitDivideOperator(node){
        // Convert to float representation
        return parseFloat(this.visit(node.childreen[0])) / parseFloat(this.visit(node.childreen[1]));
    }
}

// Test

let imput = `
    let va = 10
    let vb = 20
    let vc = va + vb
    print vc
`

let tokens = tokenizer(imput);

// console.log(tokens);

let parser = new Parser(tokens);

let ast = parser.parse();

console.log(
    JSON.stringify(ast, null, 2)
);

let interpreter = new Interpreter(ast);

interpreter.interpret();

console.log(interpreter.variables);