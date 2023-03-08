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
        // Identifyer: _a-z _A-Z + 0-9 identifyer can have number but not the firs character
        
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

function parse(tokenns){
    let ast = new Ast();
    let pos = 0;
    let currentToken = tokenns[pos];
    let errors = [];

    function advance(){
        pos++;
        if(pos < tokenns.length){
            currentToken = tokenns[pos];
        }
    }

    function eat(type){
        if(currentToken.type === type){
            advance();
        }else{
            throw new Error(`Unexpected token type: ${currentToken.type} at position: ${currentToken.pos} code:\n` + tokenns);
        }
    }

    function peekNextToken(){
        if(pos + 1 < tokenns.length){
            return tokenns[pos + 1];
        }
        return null;
    }

    /*
    Parse assing statement

    strucuture

    let a = 1;

    LetStatement
        Identifier
            Identifyer/Literal
    */ 

    function parseLetStatement(){
        // VariableAssigment
        let node = new AstNode("VariableAssigment", currentToken.value, currentToken.pos);
        eat(LET_KEYWORD);
        node.body.push(parseIdentifierLiteral());
        eat(ASSIGNMENT_OP);
        node.body.push(parseExpression());
        eat(SEMICOLON_OP);
        return node;
    }

    /*
    
    Parse Assingment statement

    strucuture

    a = 1;

    AssingmentStatement

    
    Identifier
        Identifyer/Literal

    {
        type: 'Identifyer',
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
    The literal or expression is inside of the identifyer

    a = 1;
    identifyer
        -> literal
    */ 

    function parseAssingmentStatement(){
        // VariableAssigment
        let node = new AstNode("VariableAssigment", currentToken.value, currentToken.pos);
        node.body.push(parseIdentifierLiteral());
        eat(ASSIGNMENT_OP);
        let expression = parseExpression();
        node.body[0].body.push(expression);
        eat(SEMICOLON_OP);
        return node;
    }

    /*

    Parse identifier

    strucuture

    let a = 1;

    LetStatement
        Identifier
            Identifyer/Literal
    */ 

    function parseIdentifierLiteral(){
        console.log(currentToken)
        let node = new AstNode(IDENTIFIER, currentToken.value, currentToken.pos);
        eat(IDENTIFIER);
        return node;
    }

    /*

    Parse expression

    strucuture

    let a = 1 + 2 * 3;

    LetStatement
        Identifier
            Identifyer/Literal
    */ 

    function parseExpression(){
        let node = parseTerm();
        while(currentToken.type === PLUS_OP || currentToken.type === MINUS_OP){
            let nodeOp = null;
            if(currentToken.type === PLUS_OP){
                nodeOp = new AstNode(PLUS_OP, currentToken.value, currentToken.pos);
                eat(PLUS_OP);
            }else if(currentToken.type === MINUS_OP){
                nodeOp = new AstNode(MINUS_OP, currentToken.value, currentToken.pos);
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
            Identifyer/Literal
    */ 

    function parseTerm(){
        let node = parseFactor();
        while(currentToken.type === MULT_OP || currentToken.type === DIV_OP){
            let nodeOp = null;
            if(currentToken.type === MULT_OP){
                nodeOp = new AstNode(MULT_OP, currentToken.value, currentToken.pos);
                eat(MULT_OP);
            }else if(currentToken.type === DIV_OP){
                nodeOp = new AstNode(DIV_OP, currentToken.value, currentToken.pos);
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
            Identifyer/Literal
    */ 

    function parseFactor(){
        let node = null;
        if(currentToken.type === NUMBER){
            node = new AstNode(NUMBER, currentToken.value, currentToken.pos);
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
            Identifyer/Literal

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
        Args <- If Starting to pass args the identifyer is an function
            Identifier
            Identifier

    Identifyer
        Assingment <- If starting to assing values the identifyer is an variable
            Expression/Literal

    */

    function parseChoiceIdentifier(){
        console.log("Choice identifyer")
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

// let tokens = 
//     tokenizer(`
//         a(a, b);
//     `);

let tokens = 
    tokenizer(`
        let a = 1;
        let b = 2;

        fn func(val1, val2){
            return val1 + val2;
        }

        func(a, b);
    `);

// let tokens = 
//     tokenizer(`
//         a(a, b);
//     `);

// let tokens =
//     tokenizer(`
//         let a = 1;
//         `)
        
// let tokens =
//     tokenizer(`
//         a = 1;
//         `)

let ast = parse(tokens);

console.log(
    JSON.stringify(ast, null, 4)
);


// Interpreter
