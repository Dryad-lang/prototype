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

    :<
    [
        {
            type: 'let',
            value: 'let',
            class: "AssingmentKeyword",
            priority: 0,
            body: [
                {
                    type: 'identifier',
                    value: 'a',
                    class: "Identifier",
                    priority: 1,
                    body: [
                        {
                            type: 'operator',
                            value: '=',
                            class: "AssingmentOperator",
                            priority: 2,
                            body: [
                                {
                                    type: 'number',
                                    value: '1',
                                    class: "Number",
                                    priority: 3,
                                    body: []
                                }
                            }
                        }
                    ]
                }
            ]
        },
        {
            type: 'operator',
            value: ';',
            class: "EndOfStatement",
            priority: 4,
            body: []
        },
        {
            type: 'EOF',
            value: ' ',
            class: "EndOfTheProgram",
            priority: 5,
            body: []
        }
    ]

    Explaination:

    - The AST is a list of nodes
    - Each node has a type, value, class, priority and body
    - The body is a list of nodes
    - The priority is the order of the node in the body of the parent node
    - The priority is used to order the nodes in the body of the parent node
    - The class is the parsing type of the token

************************************************************************************************

    Program representation generation

************************************************************************************************

    - Program representation generation
    -> Recive a list of AST nodes as imput
    -> Return a list of program representation nodes


    :> 
    let a = 1;
    let b = 1;
    let c = a + b,

    AST
    :<
    [
        {
            type: 'let',
            value: 'let',
            class: "AssingmentKeyword",
            priority: 0,
            body: [
                {
                    type: 'identifier',
                    value: 'a',
                    class: "Identifier",
                    priority: 1,
                    body: [
                        {
                            type: 'operator',
                            value: '=',
                            class: "AssingmentOperator",
                            priority: 2,
                            body: [
                                {
                                    type: 'number',
                                    value: '1',
                                    class: "Number",
                                    priority: 3,
                                    body: []
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            type: 'let',
            value: 'let',
            class: "AssingmentKeyword",
            priority: 4,
            body: [
                {
                    type: 'identifier',
                    value: 'b',
                    class: "Identifier",
                    priority: 5,
                    body: [
                        {
                            type: 'operator',
                            value: '=',
                            class: "AssingmentOperator",
                            priority: 6,
                            body: [
                                {
                                    type: 'number',
                                    value: '1',
                                    class: "Number",
                                    priority: 7,
                                    body: []
                                }
                            ]
                        }
                    ]
                }
            ]
        }
        {
            type: 'let',
            value: 'let',
            class: "AssingmentKeyword",
            priority: 8,
            body: [
                {
                    type: 'identifier',
                    value: 'c',
                    class: "Identifier",
                    priority: 9,
                    body: [
                        {
                            type: 'operator',
                            value: '=',
                            class: "AssingmentOperator",
                            priority: 10,
                            body: [
                                {
                                    type: 'operator',
                                    value: '+',
                                    class: "MathOperator",
                                    priority: 11,
                                    body: [
                                        {
                                            type: 'identifier',
                                            value: 'a',
                                            class: "Identifier",
                                            priority: 12,
                                            body: []
                                        },
                                        {
                                            type: 'identifier',
                                            value: 'b',
                                            class: "Identifier",
                                            priority: 13,
                                            body: []
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
        {
            type: 'operator',
            value: ';',
            class: "EndOfStatement",
            priority: 14,
            body: []
        },
        {
            type: 'EOF',
            value: ' ',
            class: "EndOfTheProgram",
            priority: 15,
            body: []
        }
    ]

    Program representation

    :<
    {
        variables: {
            a: 1, <- Assing values for literals
            b: 1,
            c: null; <- But not for expressions
        },
        functions: {},
        program: [
            {
                type: 'let',
                value: 'let',
                class: "AssingmentKeyword",
                priority: 0,
                body: [
                    {
                        type: 'identifier',
                        value: 'a',
                        class: "Identifier",
                        priority: 1,
                        body: [
                            {
                                type: 'Number',
                                value: 1,
                                class: "Number",
                                priority: 2,
                                body: []
                            }
                        ]
                    }
                ]
            },
            {
                type: 'let',
                value: 'let',
                class: "AssingmentKeyword",
                priority: 3,
                body: [
                    {
                        type: 'identifier',
                        value: 'b',
                        class: "Identifier",
                        priority: 4,
                        body: [
                            {
                                type: 'Number',
                                value: 1,
                                class: "Number",
                                priority: 5,
                                body: []
                            }
                        ]
                    }
                ]
            },
            {
                type: 'let',
                value: 'let',
                class: "AssingmentKeyword",
                priority: 6,
                body: [
                    {
                        type: 'identifier',
                        value: 'c',
                        class: "Identifier",
                        priority: 7,
                        body: [
                            {
                                type: 'BinaryExpression',
                                value: null,
                                class: "Expression",
                                priority: 8,
                                body: [],
                                left: [
                                    {
                                        type: 'identifier',
                                        value: 'a',
                                        class: "Identifier",
                                        priority: 9,
                                        body: []
                                    }
                                ],
                                right: [
                                    {
                                        type: 'identifier',
                                        value: 'b',
                                        class: "Identifier",
                                        priority: 10,
                                        body: []
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                type: 'operator',
                value: ';',
                class: "EndOfStatement",
                priority: 11,
                body: []
            },
            {
                type: 'EOF',
                value: ' ',
                class: "EndOfTheProgram",
                priority: 12,
                body: []
            }
        ]
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
        ]
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
const PLUS_OP                               = { type: 'operator', value: '+'}
const MINUS_OP                              = { type: 'operator', value: '-'}
const DIV_OP                                = { type: 'operator', value: '/'}
const MULT_OP                               = { type: 'operator', value: '*'}

const ASSIGNMENT_OP                         = { type: 'operator', value: '='}

const COMMA_OP                              = { type: 'operator', value: ','}
const SEMICOLON_OP                          = { type: 'operator', value: ';'}
const OPEN_PARENTHESIS_OP                   = { type: 'operator', value: '('}
const CLOSE_PARENTHESIS_OP                  = { type: 'operator', value: ')'}
const OPEN_BRACES_OP                        = { type: 'operator', value: '{'}
const CLOSE_BRACES_OP                       = { type: 'operator', value: '}'}

const LET_KEYWORD                           = { type: 'let', value: 'let'}
const FN_KEYWORD                            = { type: 'fn', value: 'fn'}
const RETURN_KEYWORD                        = { type: 'return', value: 'return'}

const EOF                                   = { type: 'EOF', value: ' '}

const NUMBER                                = { type: 'Number', value: null}
const STRING                                = { type: 'String', value: null}
const IDENTIFIER                            = { type: 'Identifier', value: null}


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
        return char >= 'a' && char <= 'z' || char >= 'A' && char <= 'Z';
    }

    function isWhiteSpace(char){
        return char === ' ' || char === '\t' || char === '\n';
    }

    function makeIdentifier(){
        let identifier = '';
        while(isLetter(currentChar)){
            identifier += currentChar;
            advance();
        }

        // Keywords
        if(identifier === 'let'){
            addToken(LET_KEYWORD.type, LET_KEYWORD.value);
        }else if(identifier === 'fn'){
            addToken(FN_KEYWORD.type, FN_KEYWORD.value);
        }else if(identifier === 'return'){
            addToken(RETURN_KEYWORD.type, RETURN_KEYWORD.value);
        }else{
            addToken(IDENTIFIER.type, identifier);
        }
    }

    function makeNumber(){
        let number = '';
        while(isNumber(currentChar)){
            number += currentChar;
            advance();
        }

        addToken(NUMBER.type, number);
    }

    function makeString(){
        let string = '';
        advance();
        while(currentChar !== '"'){
            string += currentChar;
            advance();
        }
        advance();
        addToken(STRING.type, string);
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
            addToken(PLUS_OP.type, PLUS_OP.value);
            advance();
        }else if(currentChar === '-'){
            addToken(MINUS_OP.type, MINUS_OP.value);
            advance();
        }else if(currentChar === '/'){
            addToken(DIV_OP.type, DIV_OP.value);
            advance();
        }else if(currentChar === '*'){
            addToken(MULT_OP.type, MULT_OP.value);
            advance();
        }else if(currentChar === '='){
            addToken(ASSIGNMENT_OP.type, ASSIGNMENT_OP.value);
            advance();
        }else if(currentChar === ','){
            addToken(COMMA_OP.type, COMMA_OP.value);
            advance();
        }else if(currentChar === ';'){
            addToken(SEMICOLON_OP.type, SEMICOLON_OP.value);
            advance();
        }else if(currentChar === '('){
            addToken(OPEN_PARENTHESIS_OP.type, OPEN_PARENTHESIS_OP.value);
            advance();
        }else if(currentChar === ')'){
            addToken(CLOSE_PARENTHESIS_OP.type, CLOSE_PARENTHESIS_OP.value);
            advance();
        }else if(currentChar === '{'){
            addToken(OPEN_BRACES_OP.type, OPEN_BRACES_OP.value);
            advance();
        }else if(currentChar === '}'){
            addToken(CLOSE_BRACES_OP.type, CLOSE_BRACES_OP.value);
            advance();
        }else{
            throw new Error(`Unexpected character: ${currentChar} at position: ${pos}`);
        }
    }

    addToken(EOF.type, EOF.value);
    return tokens;
}

// Test
// console.log(tokenizer('let a = 1 + 2;'));

// Parser



/*

    - Parser
    -> Recive a list of tokens as imput
    -> Return a list of AST nodes


    :> let a = 1;

    :<
    [
        {
            type: 'let',
            value: 'let',
            class: "AssingmentKeyword",
            priority: 0,
            body: [
                {
                    type: 'identifier',
                    value: 'a',
                    class: "Identifier",
                    priority: 1,
                    body: [
                        {
                            type: 'operator',
                            value: '=',
                            class: "AssingmentOperator",
                            priority: 2,
                            body: [
                                {
                                    type: 'number',
                                    value: '1',
                                    class: "Number",
                                    priority: 3,
                                    body: []
                                }
                            }
                        }
                    ]
                }
            ]
        },
        {
            type: 'operator',
            value: ';',
            class: "EndOfStatement",
            priority: 4,
            body: []
        },
        {
            type: 'EOF',
            value: ' ',
            class: "EndOfTheProgram",
            priority: 5,
            body: []
        }
    ]

*/

class Node{
    constructor(type, value, pos){
        this.type = type;
        this.value = value;
        this.pos = pos;
        this.body = [];
        this.class = "";
    }
}

function parser(tokens){
    let pos = 0;
    let currentToken = tokens[pos];
    let ast = [];

    function advance(){
        pos++;
        currentToken = tokens[pos];
    }

    function eat(type){
        if(currentToken.type === type){
            advance();
        }else{
            throw new Error(`Unexpected token: ${currentToken.type} at position: ${currentToken.pos}`);
        }
    }

    function addNode(node){
        ast.push(node);
    }

    // Math exp
    // expr // term // factor
    function expr(){
        let node = term();
        while(currentToken.type === PLUS_OP.type || currentToken.type === MINUS_OP.type){
            let token = currentToken;
            if(token.type === PLUS_OP.type){
                eat(PLUS_OP.type);
            }else if(token.type === MINUS_OP.type){
                eat(MINUS_OP.type);
            }
            node = new Node(token.type, token.value, token.pos);
            node.body.push(term());
        }
        return node;
    }

    function term(){
        let node = factor();
        while(currentToken.type === MULT_OP.type || currentToken.type === DIV_OP.type){
            let token = currentToken;
            if(token.type === MULT_OP.type){
                eat(MULT_OP.type);
            }else if(token.type === DIV_OP.type){
                eat(DIV_OP.type);
            }
            node = new Node(token.type, token.value, token.pos);
            node.body.push(factor());
        }
        return node;
    }

    function factor(){
        let token = currentToken;
        if(token.type === NUMBER.type){
            eat(NUMBER.type);
            return new Node(token.type, token.value, token.pos);
        }else if(token.type === IDENTIFIER.type){
            eat(IDENTIFIER.type);
            return new Node(token.type, token.value, token.pos);
        }else if(token.type === OPEN_PARENTHESIS_OP.type){
            eat(OPEN_PARENTHESIS_OP.type);
            let node = expr();
            eat(CLOSE_PARENTHESIS_OP.type);
            return node;
        }
    }


    // Variable declaration
    function variableDeclaration(){
        let node = new Node(LET_KEYWORD.type, LET_KEYWORD.value, LET_KEYWORD.pos);
        eat(LET_KEYWORD.type);
        node.body.push(new Node(IDENTIFIER.type, currentToken.value, currentToken.pos));
        eat(IDENTIFIER.type);
        eat(ASSIGNMENT_OP.type);
        node.body.push(expr());
        eat(SEMICOLON_OP.type);
        return node;
    }

    // Variable usage

    function variableUsage(){
        let node = new Node(IDENTIFIER.type, currentToken.value, currentToken.pos);
        eat(IDENTIFIER.type);
        return node;
    }

    // Variable assingment

    function variableAssingment(){
        let node = variableUsage();
        eat(ASSIGNMENT_OP.type);
        node.body.push(expr());
        eat(SEMICOLON_OP.type);
        return node;
    }

    // Function declaration

    function functionDeclaration(){
        let node = new Node(FUNCTION_KEYWORD.type, FUNCTION_KEYWORD.value, FUNCTION_KEYWORD.pos);
        eat(FUNCTION_KEYWORD.type);
        node.body.push(new Node(IDENTIFIER.type, currentToken.value, currentToken.pos));
        eat(IDENTIFIER.type);
        eat(OPEN_PARENTHESIS_OP.type);
        node.body.push(functionParameters());
        eat(CLOSE_PARENTHESIS_OP.type);
        eat(OPEN_BRACES_OP.type);
        node.body.push(functionBody());
        eat(CLOSE_BRACES_OP.type);
        return node;
    }

    // Function parameters

    function functionParameters(){
        let node = new Node(PARAMETERS.type, PARAMETERS.value, PARAMETERS.pos);
        while(currentToken.type !== CLOSE_PARENTHESIS_OP.type){
            node.body.push(new Node(IDENTIFIER.type, currentToken.value, currentToken.pos));
            eat(IDENTIFIER.type);
            if(currentToken.type === COMMA_OP.type){
                eat(COMMA_OP.type);
            }
        }
        return node;
    }

    // Function body

    function functionBody(){
        let node = new Node(BODY.type, BODY.value, BODY.pos);
        while(currentToken.type !== CLOSE_BRACES_OP.type){
            node.body.push(statement());
        }
        return node;
    }

    // Function call

    function functionCall(){
        let node = new Node(IDENTIFIER.type, currentToken.value, currentToken.pos);
        eat(IDENTIFIER.type);
        eat(OPEN_PARENTHESIS_OP.type);
        node.body.push(functionArguments());
        eat(CLOSE_PARENTHESIS_OP.type);
        eat(SEMICOLON_OP.type);
        return node;
    }

    // Function arguments

    function functionArguments(){
        let node = new Node(ARGUMENTS.type, ARGUMENTS.value, ARGUMENTS.pos);
        while(currentToken.type !== CLOSE_PARENTHESIS_OP.type){
            node.body.push(expr());
            if(currentToken.type === COMMA_OP.type){
                eat(COMMA_OP.type);
            }
        }
        return node;
    }

    // Function return

    function functionReturn(){
        let node = new Node(RETURN_KEYWORD.type, RETURN_KEYWORD.value, RETURN_KEYWORD.pos);
        eat(RETURN_KEYWORD.type);
        node.body.push(expr());
        eat(SEMICOLON_OP.type);
        return node;
    }

    // Literals

    function stringLiteral() {
        let node = new Node(STRING.type, currentToken.value, currentToken.pos);
        eat(STRING.type);
        return node;
    }

    function numberLiteral() {
        let node = new Node(NUMBER.type, currentToken.value, currentToken.pos);
        eat(NUMBER.type);
        return node;
    }

    // Statements

    function statement(){
        if(currentToken.type === LET_KEYWORD.type){
            return variableDeclaration();
        }else if(currentToken.type === FUNCTION_KEYWORD.type){
            return functionDeclaration();
        }else if(currentToken.type === IDENTIFIER.type){
            if(peek().type === ASSIGNMENT_OP.type){
                return variableAssingment();
            }else if(peek().type === OPEN_PARENTHESIS_OP.type){
                return functionCall();
            }else{
                return variableUsage();
            }
        }else if(currentToken.type === RETURN_KEYWORD.type){
            return functionReturn();
        }else if(currentToken.type === STRING.type){
            return stringLiteral();
        }else if(currentToken.type === NUMBER.type){
            return numberLiteral();
        }else if(currentToken.type === SEMICOLON_OP.type){
            eat(SEMICOLON_OP.type);
        }
    }

    // Parse

    function parser(){
        while(currentToken.type !== EOF.type){
            ast.push(
                statement()
            )
        }
        return node;
    }

    return parser();
}

// Test

let tokens = tokenizer(`
    let a = 5;
`)

let ast = parser(tokens)

console.log(
    JSON.stringify(ast, null, 2)
);
