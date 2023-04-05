/*
************************************************************************************************

    Dryad Lang testV7

************************************************************************************************


Test project structure:

    main.js


    // TestV7 Operations for testing:

    - Variable declaration and usage
    - Variable assingment

    - function declaration

    - recognition of code blocks into a body -> For function or other

    - binary expression -> Math etc.

    - internal functions

************************************************************************************************

    lang gramar and parsing structure

************************************************************************************************

    - Scanner/Tokenizer
    - Parser - AST
    - Program representation generation
    - Interpreter - Run the representation


************************************************************************************************

    Scanner/Tokenizer

************************************************************************************************

    - Tokenizer
    -> Recive a raw code as imput
    -> Return a list of tokens
    
    :> let a = 1;

    :< 
    [
        {type: 'let', value: 'let', class: "AssingmentKeyword"},
        {type: 'identifier', value: 'a', class: "Identifier"},
        {type: 'operator', value: '=', class: "AssingmentOperator"},
        {type: 'number', value: '1', class: "Number"},
        {type: 'operator', value: ';', class: "EndOfStatement"}
        {type: 'EOF', value: ' ', class: "EndOfTheProgram"}
    ]

    KeyWords

    let, fn, return, 

    Operators

    = + - / *
    , ; ( ) { }

    Types

    number, string, boolean, identifier

    Special

    EOF

    Explaination:

    - The tokens are a list of objects
    - Each object has a type, value and class
    - The class is the parsing type of the token


************************************************************************************************

    Parser - AST

************************************************************************************************

    - Parser
    -> Recive a list of tokens as imput
    -> Return a list of AST nodes


    :> let a = 1;

    {
        ast: [
            {
                type: 'AssingmentStatement',
                value: 'let',
                class: "AssingmentKeyword",
                childreen: [
                    {
                        type: 'Identifier',
                        value: 'a',
                        class: "Identifier",
                        childreen: [
                            {
                                type: 'Number',
                                value: '1',
                                class: "Number",
                                childreen: []
                            }
                        ]
                    }
                ]
        ],
        errors: [],
    }


    Explaination:

    - The program representation is a cleaner and run ready representation of the program
    in this process the the program representation do:

    - Assing the class for nodes like: BinaryExpression / And assing value
    - Assing the value for nodes like: Number / And assing class
    - Assing variable for literals(values that is on code and not depend on the runtime result like numbers and strings etc.)
    - Assing functions for program
    - Assing the program body
    - Update the priority

    - The priority is the order of the node in the body of the parent node

************************************************************************************************

    Program representation execution

************************************************************************************************

    - Program representation execution
    -> Recive a program representation as imput
    -> Return the program output

    Program representation - IN RUNTIME -

    :<
    {
        variables: {
            a: 1, <- Assing values for literals
            b: 1,
            c: 2; <- Make the calculus and assing values for non literals variables
        },
        functions: {
            ... Load build-in functions
            ... Make code functions ready to be called
        }, 
        program: [
            ... Execute the program 
        ],
        errors: [],
        warnings: [],
        interpret_total_time: date
    }

    Explaination:

    - The program representation execution is the process that execute the program representation
    in this process the the program representation execution do:

    - Assing the value for non literals variables
    - Load functions build in or done on code
    - Execute the program

************************************************************************************************
*/ 

/*
    KeyWords

    let, fn, return, 

    Operators

    = + - / *
    , ; ( ) { }

    Types

    number, string, boolean, identifier

    Special

    EOF
*/ 

// Types dictionary
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

// Scanner / Tokenizer

class Token{
    constructor(type, value, pos){
        this.type = type;
        this.value = value;
        this.pos = pos;
    }
}

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
        // [_a-z _A-Z ]
        return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z') || char === '_';
    }

    function isWhiteSpace(char){
        return char === ' ' || char === '\t' || char === '\n';
    }

    function makeIdentifier(){
        let identifier = '';
        // Identifier: _a-z _A-Z + 0-9 Identifier can have number but not the firs character
        
        // Fist char is [_a-z _A-Z ]
        if(isLetter(currentChar)){
            identifier += currentChar;
            advance();
        }else{
            console.log('Error: Invalid identifier');
            return;
        }

        // The rest of the chars are [_a-z _A-Z 0-9]
        while(isLetter(currentChar) || isNumber(currentChar)){
            identifier += currentChar;
            advance();
        }


        // Keywords
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
        }else{
            throw new Error(`Unexpected character: ${currentChar} at position: ${pos}`);
        }
    }

    addToken(EOF, null);

    return tokens;
}

// Test
// console.log(tokenizer(`
// let a = 1;
// let b = 2;
// fn a(v, b){
//     return v + b;
// }
// a(1, 2);
// `));

// Parser

/*
Parsing examples


Variable assing:

let a = 1;

{
    ast: [
        {
            type: 'let',
            value: 'let',
            body: [
                {
                    type: 'identifier',
                    value: 'a',
                    body: [
                        {
                            type: 'Number',
                            value: '1',
                            body: []
                        }
                    ]
                }
            ]
        }
    ],
    errors: []
}

a = 1;

{
    ast: [
        {
            type: 'identifier',
            value: 'a',
            body: [
                {
                    type: 'Number',
                    value: '1',
                    body: []
                }
            ]
        }
    ],
    errors: []
}

Function declaration:

fn add(a, b){
    return a + b;
}

{
    ast: [
        {
            type: 'fn',
            value: 'fn',
            args: [
                {
                    type: 'identifier',
                    value: 'a',
                    body: []
                },
                {
                    type: 'identifier',
                    value: 'b',
                    body: []
                }
            ]
            body: [
                {
                    type: 'return',
                    value: 'return',
                    body: [
                        {
                            type: 'math_op_plus',
                            value: '+',
                            body: [
                                {
                                    type: 'identifier',
                                    value: 'a',
                                    body: []
                                },
                                {
                                    type: 'identifier',
                                    value: 'b',
                                    body: []
                                }
                            ]
                        }
                    ]
                },
                {
                    type: 'EndStatement',
                    value: ';',
                    body: []
                }
            ]
        }
    ],
    errors: []
}

function call

add(1, 2);

{
    ast: [
        {
            type: 'identifier',
            value: 'add',
            body: [
                {
                    type: 'Number',
                    value: '1',
                    body: []
                },
                {
                    type: 'Number',
                    value: '2',
                    body: []
                }
            ]
        },
        {
            type: 'EndStatement',
            value: ';',
            body: []
        }
    ],
    errors: []
}


math expression

1 + 2;

{
    ast: [
        {
            type: 'math_op_plus',
            value: '+',
            body: [
                {
                    type: 'Number',
                    value: '1',
                    body: []
                },
                {
                    type: 'Number',
                    value: '2',
                    body: []
                }
            ]
        },
        {
            type: 'EndStatement',
            value: ';',
            body: []
        }
    ],
    errors: []
}

1 * (2 + 2);

{
    ast: [
        {
            type: 'math_op_mult',
            value: '*',
            body: [
                {
                    type: 'Number',
                    value: '1',
                    body: []
                },
                {
                    type: 'math_op_plus',
                    value: '+',
                    body: [
                        {
                            type: 'Number',
                            value: '2',
                            body: []
                        },
                        {
                            type: 'Number',
                            value: '2',
                            body: []
                        }
                    ]
                }
            ]
        },
        {
            type: 'EndStatement',
            value: ';',
            body: []
        }
    ],
    errors: []
}
 
*/

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

    /*
    Parse assing statement

    strucuture

    let a = 1;

    LetStatement
        Identifier
            Identifier/Literal
    */ 

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

    /*
    
    Parse Assingment statement

    strucuture

    a = 1;

    AssingmentStatement

    
    Identifier
        Identifier/Literal

    {
        type: 'Identifier',
        value: 'a',
        body: [
            {
                type: 'Number',
                value: '1',
                body: []
            }
        ]
    }

    */

    // node.body.push(parseIdentifierLiteral()); <- This is literal dont this dont fit fot assingment purpose 
    // need to implement a new one
    /*
    The literal or expression is inside of the Identifier

    a = 1;
    Identifier
        -> literal

        
    */ 

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

    /*

    Parse identifier

    strucuture

    let a = 1;

    LetStatement
        Identifier
            Identifier/Literal
    */ 

    function parseIdentifierLiteral(){
        let node = new AstNode('Identifier', currentToken.value, currentToken.pos);
        eat(IDENTIFIER);
        return node;
    }


    /*

    Parse String literal

    strucuture

    "Hello world";

    StringLiteral
        String
    */ 

    function parseStringLiteral(){
        let node = new AstNode('StringLiteral', currentToken.value, currentToken.pos);
        eat(STRING);
        return node;
    }

    /*

    Parse Number Literal

    strucuture

    1;

    NumberLiteral
        Number

    */ 

    function parseNumberLiteral(){
        let node = new AstNode('NumberLiteral', currentToken.value, currentToken.pos);
        eat(NUMBER);
        return node;
    }


    /*

    Parse expression

    strucuture

    let a = 1 + 2 * 3;

    LetStatement
        Identifier
            Identifier/Literal
    */ 

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

    /*

    Parse term

    strucuture

    let a = 1 + 2 * 3;

    LetStatement
        Identifier
            Identifier/Literal
    */ 

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

    /*

    Parse factor

    strucuture

    let a = 1 + 2 * 3;

    LetStatement
        Identifier
            Identifier/Literal
    */ 

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

    /*
    Parse call statement

    strucuture

    a(1, 2, 3);

    CallStatement
        Identifier
            Identifier/Literal

    */

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

    /*
    
    Parse function definition

    strucuture

    function a(a, b, c){
        return a + b + c;
    }

    FunctionDefinition
        Identifier
    Args
        Identifier
        Identifier
        Identifier
    Body
        ReturnStatement
            Expression
                Term
                    Factor
                        Identifier
                    Factor
                        Identifier
                    Factor
                        Identifier


    */

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

    /*
    
    Parse function args

    strucuture

    function a(a, b, c){
        return a + b + c;
    }

    FunctionDefinition
        Identifier
    Args
        Identifier
        Identifier
        Identifier
    Body
        ReturnStatement
            Expression
                Term
                    Factor
                        Identifier
                    Factor
                        Identifier
                    Factor
                        Identifier


    */

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

    /*
    
    Parse function body

    strucuture

    function a(a, b, c){
        return a + b + c;
    }

    FunctionDefinition
        Identifier
    Args
        Identifier
        Identifier
        Identifier
    Body
        ReturnStatement
            Expression
                Term
                    Factor
                        Identifier
                    Factor
                        Identifier
                    Factor
                        Identifier

                        
    */

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

    /*
    
    Parse return statement

    strucuture

    function a(a, b, c){
        return a + b + c;
    }

    FunctionDefinition
        Identifier
    Args
        Identifier
        Identifier
        Identifier
    Body
        ReturnStatement
            Expression
                Term
                    Factor
                        Identifier
                    Factor
                        Identifier
                    Factor
                        Identifier
    
                        
    */

    function parseReturnStatement(){
        let node = new AstNode("ReturnStatement", currentToken.value, currentToken.pos);
        eat(RETURN_KEYWORD);
        node.body.push(parseExpression());
        eat(SEMICOLON_OP);
        return node;
    }

    /*
    
    Parse statement

    strucuture

    function a(a, b, c){
        return a + b + c;
    }

    FunctionDefinition
        Identifier
    Args
        Identifier
        Identifier
        Identifier
    Body
        ReturnStatement
            Expression
                Term
                    Factor
                        Identifier
                    Factor
                        Identifier
                    Factor
                        Identifier
    */

    function parseFunction(){
        let node = null;
        if(currentToken.type === FN_KEYWORD){
            node = parseFunctionDefinition();
        }else if(currentToken.type === IDENTIFIER){
            node = parseCallStatement();
        }
        return node;    
    }

    /*
    Parse identifier

    strucuture

    a = 1;
    a(a, b);

    Identifier
        Args <- If Starting to pass args the Identifier is an function
            Identifier
            Identifier

    Identifier
        Assingment <- If starting to assing values the Identifier is an variable
            Expression/Literal

    */

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
            // See if is an function call or identifier operations
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

// Test

// Compile start time
let start = new Date().getTime();

// let tokens = 
//     tokenizer(`
//         a(a, b);
//     `);

// let tokens = 
//     tokenizer(`
//         let a = "Hello World";

//         fn vprint(arg){
//             print(arg);
//         }

//         vprint(a);
        
//     `);

// let tokens = 
//     tokenizer(`
//         a(a, b);
//     `);

// let tokens =
//     tokenizer(`
//         let a = 1;
//         let b = 1;
//         let c = a + b;
//         `)
        
// let tokens =
//         tokenizer(`
//             let a = 1;
//             let b = 1;
//             `)

// let tokens = 
//     tokenizer(`
//         let a = 1;
//         let b = 2;
//         let c = a + b;
//         `)

// let tokens = 
//     tokenizer(`
//         let a = "Hello World";
//         print(a);
//         `)

// let tokens =
//     tokenizer(`
//         a = "Hello World";
//         `)

// let tokens =
//     tokenizer(`
//         let a = 1;
//         print(a);
//         `)

// let tokens =
//     tokenizer(`
//         let a = "String";
//         `)

// let tokens =
//     tokenizer(`
//         let a = 1;
//         let b = 2;

//         fn func(){
//             let c = a + b;
//             print(c);
//         }

//         func();
//         `)

// console.log(
//     tokens
// )

let ast = parse(tokens);

// console.log(
//     JSON.stringify(ast, null, 4)
// );


// Interpreter

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
        },
    "do": 
        function(args){
            while(args[0] > args[1]){
                args[0] -= args[1];
                console.log(args[0])
            }
            return args[0];
        }

}

class Interpreter{
    constructor(ast){
        this.ast = ast.body;
        this.variables = [];
        this.parse_num = 0;
        this.functions = [];
    }
    /*
    AST:

    {
        "type": "program",
        "value": "",
        "pos": 0,
        "body": [
            {
                "type": "type",
                "value": "value",
                "pos": 0,
                "body": [
                    ...
                ]
            },
            ...
        ]
    }
    */ 

    // Functional methods

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


    // Interpreter methods
    /*
    - MathExpression
    - FunctionCall
    - FunctionDefinition
    - VariableAssigment
    - ReturnStatement
    */ 
    interpret(){
        this.ast.forEach(node => {
            this.interpretNode(node);
        });
    }

    interpretNode(node){
        this.parse_num++;

//DEBUG
        // console.log("Variables");
        // console.log(this.variables);
        // console.log(
        //     `Parse ${this.parse_num}: ${node.type}`
        // );
        // console.log(
        //     JSON.stringify(node, null, 4)
        // )

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

    /*
    Example:
    (1 + 1) * (2 + 2)

    Tree

            *
        /     \
       +       +
     /  \   /   \
    1   1  2     2

    Structure

    {
        "type": "MathExpression",
        "value": "*",
        "pos": 27,
        "body": [
            {
                "type": "MathExpression",
                "value": "+",
                "pos": 21,
                "body": [
                    {
                        "type": "NumberLiteral",
                        "value": "1",
                        "pos": 20,
                        "body": []
                    },
                    {
                        "type": "NumberLiteral",
                        "value": "1",
                        "pos": 24,
                        "body": []
                    }
                ]
            },
            {
                "type": "MathExpression",
                "value": "+",
                "pos": 33,
                "body": [
                    {
                        "type": "NumberLiteral",
                        "value": "2",
                        "pos": 32,
                        "body": []
                    },
                    {
                        "type": "NumberLiteral",
                        "value": "2",
                        "pos": 36,
                        "body": []
                    }
                ]
            }
        ]
    }

    */ 

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

        // If identifier.value is in Built In Functions
        if(built_in_functions[identifier.value]){
            built_in_functions[identifier.value](argsValues);
        }else{
            let func = this.getFunction(identifier.value);
            let body = func.body;
            let argsNames = func.args;

            argsNames.forEach((argName, index) => {
                this.setVariable(argName, argsValues[index]);
            });

            // Do interpret each in body
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

// let interpreter = new Interpreter(ast);

// interpreter.interpret();

// // Compile end time
// let end = new Date().getTime();

// // Compile time
// let time = end - start;

// // console.log(
// //     `Compiled in ${time}ms`
// // )

// console.log(
//     interpreter.variables
// )

// console.log(
//     interpreter.functions
// )