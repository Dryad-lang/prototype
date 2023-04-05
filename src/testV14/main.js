/*
——————————————————————————————————————————————————————————————————————

    Dryad

——————————————————————————————————————————————————————————————————————

Types:

NUMBER_LITERAL
STRING_LITERAL
IDENTIFYER_LITERAL

Delimiters:

( ) { } 
, ; 

Keywords:

if else while for return

Oprators:

+ - * / %
= == != > < >= <=

——————————————————————————————————————————————————————————————————————
*/

// Tokens
const NUMBER_LITERAL = 'NUMBER_LITERAL';
const STRING_LITERAL = 'STRING_LITERAL';
const IDENTIFYER_LITERAL = 'IDENTIFYER_LITERAL';

// Delimiters
const LEFT_PAREN = 'LEFT_PAREN';
const RIGHT_PAREN = 'RIGHT_PAREN';
const LEFT_BRACE = 'LEFT_BRACE';
const RIGHT_BRACE = 'RIGHT_BRACE';
const COMMA = 'COMMA';
const SEMICOLON = 'SEMICOLON';

// Keywords
const IF = 'IF';
const WHILE = 'WHILE';
const FOR = 'FOR';
const FN = 'FN';

// Operators
const PLUS = 'PLUS';
const MINUS = 'MINUS';
const STAR = 'STAR';
const SLASH = 'SLASH';
const PERCENT = 'PERCENT';
const EQUAL = 'EQUAL';
const EQUAL_EQUAL = 'EQUAL_EQUAL';
const BANG_EQUAL = 'BANG_EQUAL';
const GREATER = 'GREATER';
const GREATER_EQUAL = 'GREATER_EQUAL';
const LESS = 'LESS';
const LESS_EQUAL = 'LESS_EQUAL';

// Others
const EOF = 'EOF';
const PROGRAM = 'PROGRAM';

// Keywords
const KEYWORDS = {
    'if': IF,
    'while': WHILE,
    'for': FOR,
    'fn': FN
};

// Tokenizer
function tokenizer(input){
    let current = 0;
    let tokens = [];

    while(current < input.length){
        let char = input[current];

        if(char === '('){
            tokens.push({
                type: LEFT_PAREN,
                value: '('
            });
            current++;
            continue;
        }

        if(char === ')'){
            tokens.push({
                type: RIGHT_PAREN,
                value: ')'
            });
            current++;
            continue;
        }

        if(char === '{'){
            tokens.push({
                type: LEFT_BRACE,
                value: '{'
            });
            current++;
            continue;
        }

        if(char === '}'){
            tokens.push({
                type: RIGHT_BRACE,
                value: '}'
            });
            current++;
            continue;
        }

        if(char === ','){
            tokens.push({
                type: COMMA,
                value: ','
            });
            current++;
            continue;
        }

        if(char === ';'){
            tokens.push({
                type: SEMICOLON,
                value: ';'
            });
            current++;
            continue;
        }

        if(char === '+'){
            tokens.push({
                type: PLUS,
                value: '+'
            });
            current++;
            continue;
        }

        if(char === '-'){
            tokens.push({
                type: MINUS,
                value: '-'
            });
            current++;
            continue;
        }

        if(char === '*'){
            tokens.push({
                type: STAR,
                value: '*'
            });
            current++;
            continue;
        }

        if(char === '/'){
            tokens.push({
                type: SLASH,
                value: '/'
            });
            current++;
            continue;
        }

        if(char === '%'){
            tokens.push({
                type: PERCENT,
                value: '%'
            });
            current++;
            continue;
        }

        if(char === '!'){
            if(input[++current] === '='){
                tokens.push({
                    type: BANG_EQUAL,
                    value: '!='
                });
                current++;
                continue;
            }else{
                tokens.push({
                    type: 'BANG',
                    value: '!'
                });
                current++;
                continue;
            }
        }

        if(char === '='){
            if(input[++current] === '='){
                tokens.push({
                    type: EQUAL_EQUAL,
                    value: '=='
                });
                current++;
                continue;
            }else{
                tokens.push({
                    type: EQUAL,
                    value: '='
                });
                current++;
                continue;
            }
        }

        if(char === '>'){
            if(input[++current] === '='){
                tokens.push({
                    type: GREATER_EQUAL,
                    value: '>='
                });
                current++;
                continue;
            }else{
                tokens.push({
                    type: GREATER,
                    value: '>'
                });
                current++;
                continue;
            }
        }

        if(char === '<'){
            if(input[++current] === '='){
                tokens.push({
                    type: LESS_EQUAL,
                    value: '<='
                });
                current++;
                continue;
            }else{
                tokens.push({
                    type: LESS,
                    value: '<'
                });
                current++;
                continue;
            }
        }

        let WHITESPACE = /\s/;
        if(WHITESPACE.test(char)){
            current++;
            continue;
        }

        let NUMBERS = /[0-9]/;
        if(NUMBERS.test(char)){
            let value = '';

            while(NUMBERS.test(char)){
                value += char;
                char = input[++current];
            }

            tokens.push({
                type: NUMBER_LITERAL,
                value
            });
            continue;
        }

        if(char === '"'){
            let value = '';

            char = input[++current];
            while(char !== '"'){
                value += char;
                char = input[++current];
            }

            tokens.push({
                type: STRING_LITERAL,
                value
            });
            current++;
            continue;
        }

        let LETTERS = /[a-z]/i;
        if(LETTERS.test(char)){
            let value = '';

            while(LETTERS.test(char)){
                value += char;
                char = input[++current];
            }

            tokens.push({
                type: KEYWORDS[value] || IDENTIFYER_LITERAL,
                value
            });
            continue;
        }

        throw new TypeError('I dont know what this character is: ' + char);
    }

    return tokens;
}

// // Test
// let input = `
//     fn a(a, b)
// `;

// let tokens = tokenizer(input);
// console.log(tokens);
/*
[
  { type: 'FN', value: 'fn' },
  { type: 'IDENTIFYER_LITERAL', value: 'a' },
  { type: 'LEFT_PAREN', value: '(' },
  { type: 'IDENTIFYER_LITERAL', value: 'a' },
  { type: 'COMMA', value: ',' },
  { type: 'IDENTIFYER_LITERAL', value: 'b' },
  { type: 'RIGHT_PAREN', value: ')' }
]

If
    Condition
    Body

While
    Condition
    Body

For
    Init
    Condition
    Update
    Body

Function
    Literal
        Name
    Params
    Body

Call
    Literal
        Name
    Params

Binary
    Left
    Operator

Unary
    Operator
    Right

Grouping
    Expression

Literal
    Value

Variable
    Literal
        Name
    Value

Assign
    Literal
        Name
    Expression

Logical
    Left
    Operator
*/ 

// AST
class AST{
    constructor(){}
}

class Node{
    constructor(
        type,
        body,
        children
    ){
        this.type = type;
        this.body = body;
        this.children = children;
    }
}


// Parser
function parser(tokens){
    let current = 0;

    function walk(){
        let token = tokens[current];

        if(token.type === NUMBER_LITERAL){
            current++;
            return new Node(
                NUMBER_LITERAL,
                token.value
            );
        }

        if(token.type === STRING_LITERAL){
            current++;
            return new Node(
                STRING_LITERAL,
                token.value
            );
        }

        if(token.type === IDENTIFYER_LITERAL){
            current++;
            return new Node(
                IDENTIFYER_LITERAL,
                token.value
            );
        }

        if(token.type === LEFT_PAREN){
            token = tokens[++current];
            let node = new Node(
                CALL_EXPRESSION,
                token.value
            );

            token = tokens[++current];

            while(token.type !== RIGHT_PAREN){
                node.children.push(walk());
                token = tokens[current];
            }

            current++;
            return node;
        }

        if(token.type === LEFT_BRACE){
            let node = new Node(
                BLOCK_STATEMENT,
                token.value
            );

            token = tokens[++current];

            while(token.type !== RIGHT_BRACE){
                node.children.push(walk());
                token = tokens[current];
            }

            current++;
            return node;
        }

        throw new TypeError(token.type);
    }

    let ast = new AST();
    ast.root = new Node(
        PROGRAM,
        'Program',
        []
    );

    while(current < tokens.length){
        ast.root.children.push(walk());
    }

    return ast;
}

// Test
let input = `
    fn a(a, b)
`;

let tokens = tokenizer(input);

let ast = parser(tokens);
console.log(ast);