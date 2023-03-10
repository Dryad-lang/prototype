/*

LANG - DRYAD


Operators:

+ - * /
> < = 
! && || ==
<= >= !=

Keywords

if
else
true
false
fn
return

Separators

{ } ( ) ;

Literals

String
Number
Boolean
Identifyer

Comments

#

*/ 


// TOKENS TYPES

// Literals
const NUMBER = "NUMBER";
const STRING = "STRING";
const IDENTIFIER = "IDENTIFIER";
const BOOLEAN = "BOOLEAN";

// Keywords
const TRUE = "TRUE";
const FALSE = "FALSE";
const IF = "IF";
const ELSE = "ELSE";
const FN = "FN";
const RETURN = "RETURN";

// Operators
const OPERATOR = "OPERATOR";

// Separators
const BRACE_OPEN = "BRACE_OPEN";
const BRACE_CLOSE = "BRACE_CLOSE";
const PAREN_OPEN = "PAREN_OPEN";
const PAREN_CLOSE = "PAREN_CLOSE";
const SEMICOLON = "SEMICOLON";

// Special
const EOF = "EOF";



// Tokenizer
function tokenizer(rawcode){
    this.rawcode = rawcode;
    this.tokens = [];
    this.current = 0;

    function advance(){
        this.current++;
        this.column++;
    }

    function addToken(type, value){

        this.tokens.push({
            type,
            value
        });

    }

    function isDigit(char){
        return char >= '0' && char <= '9';
    }

    function isAlpha(char){
        return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z') || char == '_';
    }

    function isAlphaNumeric(char){
        return isDigit(char) || isAlpha(char);
    }

    function isWhitespace(char){
        return char == ' ' || char == '\t' || char == '\r' || char == '\n';
    }

    function isOperator(char){
        return char == '+' || char == '-' || char == '*' || char == '/' || char == '>' || char == '<' || char == '=' || char == '!' || char == '&' || char == '|';
    }

    function peekNext(){
        return this.rawcode[this.current + 1];
    }

    function makeNumber(){
        let value = '';
        while(isDigit(this.rawcode[this.current])){
            value += this.rawcode[this.current];
            advance();
        }
        addToken(NUMBER, value);
    }

    function makeString(){
        let value = '';
        while(this.rawcode[this.current] != '"'){
            value += this.rawcode[this.current];
            advance();
        }
        advance();
        addToken(STRING, value);
    }

    function makeIdentifier(){
        let value = '';
        while(isAlphaNumeric(this.rawcode[this.current])){
            value += this.rawcode[this.current];
            advance();
        }

        switch(value){
            case 'true':
                addToken(TRUE, value);
                break;
            case 'false':
                addToken(FALSE, value);
                break;
            case 'if':
                addToken(IF, value);
                break;
            case 'else':
                addToken(ELSE, value);
                break;
            case 'fn':
                addToken(FN, value);
                break;
            case 'return':
                addToken(RETURN, value);
                break;
            default:
                addToken(IDENTIFIER, value);
                break;
        }
    }

    function makeOperator(){
        let operators = [
            '==', '!=', '>=', '<=', '&&', '||',
            '+', '-', '*', '/', '>', '<', '=', '!', '&', '|'
        ]
        let value = '';
        while(isOperator(this.rawcode[this.current])){
            value += this.rawcode[this.current];
            advance();
        }

        if(operators.includes(value)){
            addToken(OPERATOR, value);
        }else{
            console.error(`Unexpected operator: ${value}`);
        }
    }

    function makeTokens(){
        while(this.current < this.rawcode.length){
            let char = this.rawcode[this.current];

            if(isWhitespace(char)){
                advance();
                continue;
            }

            if(isDigit(char)){
                makeNumber();
                continue;
            }

            if(char == '"'){
                advance();
                makeString();
                continue;
            }

            if(isAlpha(char)){
                makeIdentifier();
                continue;
            }

            if(isOperator(char)){
                makeOperator();
                continue;
            }

            switch(char){
                case '{':
                    addToken(BRACE_OPEN, char);
                    break;
                case '}':
                    addToken(BRACE_CLOSE, char);
                    break;
                case '(':
                    addToken(PAREN_OPEN, char);
                    break;
                case ')':
                    addToken(PAREN_CLOSE, char);
                    break;
                case ';':
                    addToken(SEMICOLON, char);
                    break;
                default:
                    console.error(`Unexpected character: ${char}`);
                    break;
            }

            advance();
        }

        addToken(EOF, null);
    }

    makeTokens();

    return this.tokens;
}

// Test

const code = `
    if (a != true) {
        print("Hello World!");
    }
    fn function(a, b) {
        return a + b;
    }
`;

const tokens = tokenizer(code);

// console.log(tokens);

// Parser

class Ast{
    constructor(root){
        this.root = root;
    }
}

class Node{
    constructor(type, value){
        this.type = type;
        this.value = value;
        this.children = [];
    }
}

/*

raw:
    if (a != true) {
        print("Hello World!");
    }

Ast:

    ifstatement
        condition
            binaryexp
                !=
                    identifyer
                        a
                    booleanliteral
                        true

        body
            functioncall
                identifyer
                    print
            args
                stringliteral
                    Hello World!

raw:
    if(true){
        print("Hello World!");
    }else{
        print("Goodbye World!");
    }

Ast:

    ifstatement
        condition
            booleanliteral
                true
        body
            functioncall
                identifyer
                    print
            args
                stringliteral
                    Hello World!
        else
            functioncall
                identifyer
                    print
            args    
                stringliteral
                    Goodbye World!


raw:
    fn function(a, b) {
        return a + b;
    }

Ast:

    functiondefinition
        name
            function
        args
            identifyer
                a
            identifyer
                b
        body
            return
                binaryexp
                    +
                        identifyer
                            a
                        identifyer
                            b


raw:
    a = 1 + 2;

Ast:

    assignment
        a
        binaryexp
            +
                numliteral
                    1
                numliteral
                    2


raw:

    a = sum(1, 2);

Ast:

    assignment
        a
        functioncall
            sum
        args
            numliteral
                1
            numliteral
                2


raw:

    a = sum(1, 2) + 3;

Ast:

    assignment
        a
        binaryexp
            +
                functioncall
                    sum
                args
                    numliteral
                        1
                    numliteral
                        2
                numliteral
                    3


raw:

a = 1 * (2 + 2);

Ast:

    assignment
        a
        binaryexp
            *
                numliteral
                    1
                binaryexp
                    +
                        numliteral
                            2
                        numliteral
                            2



Base grammar:

    program -> statement*

    statement -> ifstatement | returnstatement | assignment | functiondefinition | functioncall

    ifstatement -> if ( expression ) { statement* }

    returnstatement -> return expression ;

    assignment -> identifier = expression[exp/functioncall/] ;
*/

// Parsing types

const binaryexp = 'binaryexp';
const functioncall = 'functioncall';
const functiondefinition = 'functiondefinition';
const ifstatement = 'ifstatement';
const returnstatement = 'returnstatement';
const assignment = 'assignment';
const booleanliteral = 'booleanliteral';
const numliteral = 'numliteral';
const stringliteral = 'stringliteral';
const identifier = 'identifier';

// Parsing functions

function parse(tokens){
    let ast = null;
    let current = 0;

    function advance(){
        current++;
    }

    function peekNext(){
        return tokens[current + 1];
    }
    
    function peek(){
        return tokens[current];
    }

    function eat(type){
        if(peek().type == type){
            advance();
            return true;
        }
        return false;
    }

}