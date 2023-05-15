/*
*************************************************************************************************************************************

                                                        Dryad Programin Language
                                                        vT0.10beta Prototype
                                                        by Pedro Jesus
                                                        2023

*************************************************************************************************************************************
*/ 

// TOKEN TYPES
const PLUS_OP                               = "PLUS_OP"
const MINUS_OP                              = "MINUS_OP"
const DIV_OP                                = "DIV_OP"
const MULT_OP                               = "MULT_OP"

const ASSIGNMENT_OP                         = "ASSIGNMENT_OP"

const COMMA_OP                              = "COMMA_OP"
const SEMICOLON_OP                          = "SEMICOLON_OP"
const OPEN_PARENTHESIS_OP                   = "OPEN_PARENTHESIS_OP"
const CLOSE_PARENTHESIS_OP                  = "CLOSE_PARENTHESIS_OP"
const OPEN_BRACES_OP                        = "OPEN_BRACES_OP"
const CLOSE_BRACES_OP                       = "CLOSE_BRACES_OP"

const LET_KEYWORD                           = "LET_KEYWORD"
const FN_KEYWORD                            = "FN_KEYWORD"
const RETURN_KEYWORD                        = "RETURN_KEYWORD"

const EOF                                   = "EOF"

const NUMBER                                = "NUMBER"
const STRING                                = "STRING"
const IDENTIFIER                            = "IDENTIFIER"

// GLOBAL CLASSES
class Token{
    constructor(type, value, pos){
        this.type = type;
        this.value = value;
        this.pos = pos;
    }
}

class Ast{
    constructor(){
        this.root = null;
        this.errors = [];
    }
}

class AstNode{
    constructor(type, value, pos){
        this.type = type;
        this.value = value;
        this.pos = pos;
        this.body = [];
    }
}

// BUILT-IN FUNCTIONS
let built_in_functions = {
    "print": 
        function(args){
            console.log(args[0]);
        },
    "input":
        function(args){
            return prompt(args[0]);
        },
    "len":
        function(args){
            console.log(args[0].length);
        }
}

// TOKENIZER
function tokenizer(code){
    let tokens = [];
    let pos = 0;
    let currentChar = code[pos];


    function advance(){
        pos++;
        currentChar = code[pos];
    }

    function addToken(type, value){
        tokens.push(new Token(type, value, pos));
    }

    function isNumber(char){
        return char >= '0' && char <= '9';
    }

    function isLetter(char){
        return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z') || char === '_';
    }

    function isWhiteSpace(char){
        return char === ' ' || char === '\t' || char === '\n';
    }

    function makeIdentifier(){
        let identifier = '';

        if(isLetter(currentChar)){
            identifier += currentChar;
            advance();
        }else{
            console.log('Error: Invalid identifier');
            return;
        }

        while(isLetter(currentChar) || isNumber(currentChar)){
            identifier += currentChar;
            advance();
        }

        if(identifier === 'let'){
            addToken(LET_KEYWORD, identifier);
        }else if(identifier === 'fn'){
            addToken(FN_KEYWORD, identifier);
        }else if(identifier === 'return'){
            addToken(RETURN_KEYWORD, identifier);
        }else{
            addToken(IDENTIFIER, identifier);
        }
    }

    function makeNumber(){
        let number = '';
        while(isNumber(currentChar)){
            number += currentChar;
            advance();
        }

        addToken(NUMBER, number);
    }

    function makeString(){
        let string = '';
        advance();
        while(currentChar !== '"'){
            string += currentChar;
            advance();
        }
        advance();
        addToken(STRING, string);
    }

    while(currentChar !== (null || undefined)){
        if(isWhiteSpace(currentChar)){
            advance();
        }else if(isNumber(currentChar)){
            makeNumber();
        }else if(isLetter(currentChar)){
            makeIdentifier();
        }else if(currentChar === '"'){
            makeString();
        }else if(currentChar === '+'){
            addToken(PLUS_OP, currentChar);
            advance();
        }else if(currentChar === '-'){
            addToken(MINUS_OP, currentChar);
            advance();
        }else if(currentChar === '/'){
            addToken(DIV_OP, currentChar);
            advance();
        }else if(currentChar === '*'){
            addToken(MULT_OP, currentChar);
            advance();
        }else if(currentChar === '='){
            addToken(ASSIGNMENT_OP, currentChar);
            advance();
        }else if(currentChar === ','){
            addToken(COMMA_OP, currentChar);
            advance();
        }else if(currentChar === ';'){
            addToken(SEMICOLON_OP, currentChar);
            advance();
        }else if(currentChar === '('){
            addToken(OPEN_PARENTHESIS_OP, currentChar);
            advance();
        }else if(currentChar === ')'){
            addToken(CLOSE_PARENTHESIS_OP, currentChar);
            advance();
        }else if(currentChar === '{'){
            addToken(OPEN_BRACES_OP, currentChar);
            advance();
        }else if(currentChar === '}'){
            addToken(CLOSE_BRACES_OP, currentChar);
            advance();
        }else if(currentChar === '\n' || currentChar === '\r'){
            advance();
        }else if(currentChar === '\0'){
            break;
        }else{
            throw new Error(`Unexpected character: ${currentChar} at position: ${pos} ascii value:  ${currentChar.charCodeAt(0)}`);
        }
    }

    addToken(EOF, null);

    return tokens;
}

// PARSER
function parse(tokens){
    let ast = new Ast();
    let pos = 0;
    let currentToken = tokens[pos];
    let errors = [];

    function advance(){
        pos++;
        if(pos < tokens.length){
            currentToken = tokens[pos];
        }
    }

    function eat(type){
        if(currentToken.type === type){
            advance();
        }else{
            throw new Error(`Unexpected token type: ${currentToken.type} at position: ${currentToken.pos} code:\n` + tokens);
        }
    }

    function peekNextToken(){
        if(pos + 1 < tokens.length){
            return tokens[pos + 1];
        }
        return null;
    }

    function parseLetStatement(){
        // VariableAssigment
        let node = new AstNode("VariableAssigment", currentToken.value, currentToken.pos);
        eat(LET_KEYWORD);

        node.body.push(parseIdentifierLiteral());
        eat(ASSIGNMENT_OP);
        // See if is an expression or a string literal
        // node.body[0].body.push(parseExpression());

        if(currentToken.type === STRING){
            node.body[0].body.push(parseStringLiteral());

        }else{
            node.body[0].body.push(parseExpression());
        }
        eat(SEMICOLON_OP);
        
        return node;
    }

    function parseAssingmentStatement(){
        // VariableAssigment
        let node = new AstNode("VariableAssigment", currentToken.value, currentToken.pos);
        node.body.push(parseIdentifierLiteral());
        eat(ASSIGNMENT_OP);
        // let expression = parseExpression();
        // See if is an expression or a string literal
        if(currentToken.type === STRING){
            node.body[0].body.push(parseStringLiteral());
        }else{
            node.body[0].body.push(parseExpression());
        }
        eat(SEMICOLON_OP);
        return node;
    }

    function parseIdentifierLiteral(){
        let node = new AstNode('Identifier', currentToken.value, currentToken.pos);
        eat(IDENTIFIER);
        return node;
    }

    function parseStringLiteral(){
        let node = new AstNode('StringLiteral', currentToken.value, currentToken.pos);
        eat(STRING);
        return node;
    }

    function parseNumberLiteral(){
        let node = new AstNode('NumberLiteral', currentToken.value, currentToken.pos);
        eat(NUMBER);
        return node;
    }

    function parseExpression(){
        let node = parseTerm();
        while(currentToken.type === PLUS_OP || currentToken.type === MINUS_OP){
            let nodeOp = null;
            if(currentToken.type === PLUS_OP){
                nodeOp = new AstNode("MathExpression", currentToken.value, currentToken.pos);
                eat(PLUS_OP);
            }else if(currentToken.type === MINUS_OP){
                nodeOp = new AstNode("MathExpression", currentToken.value, currentToken.pos);
                eat(MINUS_OP);
            }
            nodeOp.body.push(node);
            nodeOp.body.push(parseTerm());
            node = nodeOp;
        }
        return node;
    }

    function parseTerm(){
        let node = parseFactor();
        while(currentToken.type === MULT_OP || currentToken.type === DIV_OP){
            let nodeOp = null;
            if(currentToken.type === MULT_OP){
                nodeOp = new AstNode("MathExpression", currentToken.value, currentToken.pos);
                eat(MULT_OP);
            }else if(currentToken.type === DIV_OP){
                nodeOp = new AstNode("MathExpression", currentToken.value, currentToken.pos);
                eat(DIV_OP);
            }
            nodeOp.body.push(node);
            nodeOp.body.push(parseFactor());
            node = nodeOp;
        }
        return node;
    }

    function parseFactor(){
        let node = null;
        if(currentToken.type === NUMBER){
            node = new AstNode('NumberLiteral', currentToken.value, currentToken.pos);
            eat(NUMBER);
        }else if(currentToken.type === IDENTIFIER){
            node = parseIdentifierLiteral();
        }else if(currentToken.type === OPEN_PARENTHESIS_OP){
            eat(OPEN_PARENTHESIS_OP);
            node = parseExpression();
            eat(CLOSE_PARENTHESIS_OP);
        }
        return node;
    }


    function parseCallStatement(){
        // Function call statement
        let node = new AstNode("FunctionCall", currentToken.value, currentToken.pos);
        node.body.push(parseIdentifierLiteral());
        eat(OPEN_PARENTHESIS_OP);
        node.body.push(parseArgs());
        eat(CLOSE_PARENTHESIS_OP);
        eat(SEMICOLON_OP);
        return node;
    }

    function parseFunctionDefinition(){
        let node = new AstNode("FunctionDefinition", currentToken.value, currentToken.pos);
        eat(FN_KEYWORD);
        node.body.push(parseIdentifierLiteral());
        eat(OPEN_PARENTHESIS_OP);
        node.body.push(parseArgs());
        eat(CLOSE_PARENTHESIS_OP);
        node.body.push(parseFunctionBody());
        return node;
    }

    function parseArgs(){
        let node = new AstNode('FunctionArgs', currentToken.value, currentToken.pos);
        while(currentToken.type !== CLOSE_PARENTHESIS_OP){
            node.body.push(parseIdentifierLiteral());
            if(currentToken.type === COMMA_OP){
                eat(COMMA_OP);
            }
        }
        return node;
    }

    function parseFunctionBody(){
        let node = new AstNode('FunctionBody', currentToken.value, currentToken.pos);
        eat(OPEN_BRACES_OP);
        while(currentToken.type !== CLOSE_BRACES_OP){
            // Undeterminant function body error
            if(currentToken.type === EOF){
                throw new Error(`Undeterminant function body at ${currentToken.pos}`);
            }

            node.body.push(parseStatement());
        }
        eat(CLOSE_BRACES_OP);
        return node;
    }

    function parseReturnStatement(){
        let node = new AstNode("ReturnStatement", currentToken.value, currentToken.pos);
        eat(RETURN_KEYWORD);
        node.body.push(parseExpression());
        eat(SEMICOLON_OP);
        return node;
    }

    function parseFunction(){
        let node = null;
        if(currentToken.type === FN_KEYWORD){
            node = parseFunctionDefinition();
        }else if(currentToken.type === IDENTIFIER){
            node = parseCallStatement();
        }
        return node;    
    }

    function parseChoiceIdentifier(){
        let nextToken = peekNextToken();

        if(nextToken.type === OPEN_PARENTHESIS_OP){
            return parseFunction();
        }else if(nextToken.type === ASSIGNMENT_OP){
            return parseAssingmentStatement();
        }else{
            throw new Error(`Undeterminant identifier at ${currentToken.pos}`);
        }
    }


    function parseStatement(){
        let node = null;
        if(currentToken.type === LET_KEYWORD){
            node = parseLetStatement();
        }else if(currentToken.type === RETURN_KEYWORD){
            node = parseReturnStatement();
        }else if(currentToken.type === FN_KEYWORD){
            node = parseFunctionDefinition();
        }else if(currentToken.type === IDENTIFIER){
            node = parseChoiceIdentifier();
        }
        return node;
    }

    function parseProgram(){
        let node = new AstNode('program', "", currentToken.pos);
        while(currentToken.type !== EOF){
            node.body.push(parseStatement());
        }
        return node;
    }

    return parseProgram();
}

// INTERPRETER
class Interpreter{
    constructor(ast){
        this.ast = ast.body;
        this.variables = [];
        this.parse_num = 0;
        this.functions = [];
    }

    getVariable(name){
        let variable = this.variables.find(variable => variable.name === name);
        return variable;
    }

    setVariable(name, value){
        let variable = this.getVariable(name);
        if(variable){
            variable.value = value;
        }else{
            this.variables.push({
                name,
                value
            });
        }
    }

    getFunction(name){
        let func = this.functions.find(func => func.name === name);
        return func;
    }

    setFunction(name, args, body){
        let func = this.getFunction(name);
        if(func){
            func.args = args;
            func.body = body;
        }else{
            this.functions.push({
                name,
                args,
                body
            });
        }
    }

    interpret(){
        this.ast.forEach(node => {
            this.interpretNode(node);
        });
    }

    interpretNode(node){
        this.parse_num++;

        switch(node.type){
            case 'MathExpression':
                return this.interpretMathExpression(node);
            case 'FunctionCall':
                return this.interpretFunctionCall(node);
            case 'FunctionDefinition':
                return this.interpretFunctionDefinition(node);
            case 'VariableAssigment':
                return this.interpretVariableAssigment(node);
            case 'ReturnStatement':
                return this.interpretReturnStatement(node);
            case 'StringLiteral':
                return this.interpretLiteral(node);
            case 'NumberLiteral':
                return this.interpretLiteral(node);
            case 'Identifier':
                return this.interpretIdentifier(node);
            default:
                throw new Error(`Unknown node type ${node.type}`);
        }
    }

    interpretMathExpression(node){
        let left = this.peekNextNodeBody(node, 'left');
        let right = this.peekNextNodeBody(node, 'right');

        let leftValue = this.interpretNode(left);
        let rightValue = this.interpretNode(right);

        leftValue = Number(leftValue);
        rightValue = Number(rightValue);

        switch(node.value){
            case '+':
                return leftValue + rightValue;
            case '-':
                return leftValue - rightValue;
            case '*':
                return leftValue * rightValue;
            case '/':
                return leftValue / rightValue;
            default:
                throw new Error(`Unknown math expression ${node.value}`);
        }
    }

    interpretLiteral(node){
        return node.value;
    }

    peekNextNodeBody(node, direction){
        if(direction === 'right'){
            return node.body[1];
        }else if(direction === 'left'){
            return node.body[0];
        }
    }

    peekNextNodeBodySelect(node, index){
        return node.body[index];
    }

    interpretVariableAssigment(node){
        let identifier = this.peekNextNodeBody(node, "left");
        let body = this.peekNextNodeBody(identifier, "left");
        let value = this.interpretNode(body);             
        
        this.setVariable(identifier.value, value);
    }

    interpretIdentifier(node){
        let variable = this.getVariable(node.value);
        return variable.value;
    }

    interpretFunctionCall(node){
        let identifier = this.peekNextNodeBodySelect(node, 0);
        let args = this.peekNextNodeBodySelect(node, 1);

        let argsValues = [];

        args.body.forEach(arg => {
            argsValues.push(
                this.interpretNode(arg)
            );
        });

        if(built_in_functions[identifier.value]){
            built_in_functions[identifier.value](argsValues);
        }else{
            let func = this.getFunction(identifier.value);
            let body = func.body;
            let argsNames = func.args;

            argsNames.forEach((argName, index) => {
                this.setVariable(argName, argsValues[index]);
            });

            body.body.forEach(node => {
                this.interpretNode(node);
            });
        }
    }

    interpretReturnStatement(node){
        let body = this.peekNextNodeBody(node, "left");
        let value = this.interpretNode(body);       

        return value;
    }

    interpretFunctionDefinition(node){
        let identifier = this.peekNextNodeBody(node, "left");
        let args = this.peekNextNodeBody(node, "right");
        let body = this.peekNextNodeBodySelect(node, 2);

        let argsNames = [];

        args.body.forEach(arg => {
            argsNames.push(arg.value);
        });

        this.setFunction(identifier.value, argsNames, body);
    }
}   

// MAIN


// Read imput from console NODE.JS
let fs = require("fs");

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

let commands = {
    "run":
        function(args){
            try{
                let filename = args[0];

                if(!filename.endsWith(".dyd")){
                    throw new Error("Invalid file type");
                }

                let code = fs.readFileSync(filename, "utf-8");


                let tokens = tokenizer(code);
                let ast = parse(tokens);
                let interpreter = new Interpreter(ast);
                interpreter.interpret();

            }
            catch(err){
                console.log(err);
            }
        },
    "debug":
        function(args){
            try{
                let filename = args[0];

                if(!filename.endsWith(".dyd")){
                    throw new Error("Invalid file type");
                }

                let debugTimeStart;
                let debugTimeEnd;

                debugTimeStart = new Date().getTime();


                let code = fs.readFileSync(filename, "utf-8");


                let tokens = tokenizer(code);
                let ast = parse(tokens);
                let interpreter = new Interpreter(ast);
                interpreter.interpret();

                debugTimeEnd = new Date().getTime();

                console.log(`Tokenizer time: ${debugTimeEnd - debugTimeStart}ms`);
                console.log("--------------------------------------------------------------------------")
                console.log(interpreter.variables);
                console.log(interpreter.functions);
                console.log("--------------------------------------------------------------------------")
            }
            catch(err){
                console.log(err);
            }
        },
        "debug-detail":
        function(args){
            try{
                let filename = args[0];

                if(!filename.endsWith(".dyd")){
                    throw new Error("Invalid file type");
                }

                let debugTimeStart;
                let debugTimeEnd;

                debugTimeStart = new Date().getTime();


                let code = fs.readFileSync(filename, "utf-8");


                let tokens = tokenizer(code);
                let ast = parse(tokens);
                let interpreter = new Interpreter(ast);
                interpreter.interpret();

                debugTimeEnd = new Date().getTime();

                console.log(`Tokenizer time: ${debugTimeEnd - debugTimeStart}ms`);
                console.log("--------------------------------------------------------------------------")
                console.log(JSON.stringify(interpreter.variables, null, 4));
                console.log(JSON.stringify(interpreter.functions, null, 4));
                console.log("--------------------------------------------------------------------------")
            }
            catch(err){
                console.log(err);
            }
        },
    "help":
        function(args){
            console.log("----------------------------------------------------------------")
            console.log("Dryad vT0.10beta Prototype\nby Pedro Jesus\n2023");
            console.log("----------------------------------------------------------------")
            console.log("run <filename.dyd> - Run a Dryad program");
            console.log("debug <filename.dyd> - Debug a Dryad program");
            console.log("debug-detail <filename.dyd> - Debug a Dryad program with variables and functions details");
            console.log("info - Show Dryad info");
            console.log("exit - Exit Dryad");
            console.log("clear - Clear console");
            console.log("----------------------------------------------------------------")
        },
    "info": 
        function(args){
            console.log("Dryad vT0.10beta Prototype\nby Pedro Jesus\n2023");
        },
    "exit":
        function(args){
            process.exit();
        },
    "clear":
        function(args){
            console.clear();
        }
}

function main(){
    readline.question('> ', (input) => {
        let args = input.split(" ");
        let command = args[0];
        args.shift();
        if(commands[command]){
            commands[command](args);
        }else{
            console.log("Unknown command");
        }
        main();
    });
}

main();