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
const FUNCTION_KEYWORD                      = "FUNCTION_KEYWORD" // Function keyword
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
            addToken(LET_KEYWORD, identifier);
        }else if(identifier === 'fn'){
            addToken(FUNCTION_KEYWORD, identifier);
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

class Ast{
    constructor(){
        this.root = null;
    }
}

class Node{
    constructor(type, value, priority, _class){
        this.type = type;
        this.value = value;
        this.priority = priority;
        this.body = [];
        this.class = _class;
    }
}

/*
[
  Token { type: 'LET_KEYWORD', value: 'let', pos: 3 },
  Token { type: 'IDENTIFIER', value: 'a', pos: 5 },
  Token { type: 'ASSIGNMENT_OP', value: '=', pos: 6 },
  Token { type: 'NUMBER', value: '1', pos: 9 },
  Token { type: 'PLUS_OP', value: '+', pos: 10 },
  Token { type: 'NUMBER', value: '2', pos: 13 },
  Token { type: 'SEMICOLON_OP', value: ';', pos: 13 },
  Token { type: 'EOF', value: null, pos: 14 }
]

Tokens imput
*/
class Parser{
    constructor(tokens){
        this.tokens = tokens;
        this.priority = 0;
        this.ast = new Ast();
    }

    /*
    Math expressions
    Functions
    Variables
    Literals
    */ 
}