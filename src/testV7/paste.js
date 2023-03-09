// Program code generation

/*
This get ast and simplify for interpreter creating pre compiled objects

like:

let a = 1;

ast:

{
    "type": "program",
    "value": "",
    "pos": 12,
    "body": [
        {
            "type": "VariableAssigment",
            "value": "let",
            "pos": 12,
            "body": [
                {
                    "type": "IDENTIFIER",
                    "value": "a",
                    "pos": 14,
                    "body": [
                        {
                            "type": "STRING",
                            "value": "String",
                            "pos": 25,
                            "body": []
                        }
                    ]
                }
            ]
        }
    ]
}

simplified:

[
    {
        "type": "VariableAssigment",
        "obj": {
            "name": "a",
            "value": "String"
        }
    }
]

This way the code just get so much simplifyed for interpreter
runs the code.
*/

// Abstact class for generators
class VariableAssigment{
    constructor(name, value){
        this.type = "variable_assingment";
        this.name = name;
        this.value = value;
    }
}

class FunctionDefinition{
    constructor(name, args, body){
        this.type = "function_definition";
        this.name = name;
        this.args = args;
        this.body = body;
    }
}

class FunctionCall{
    constructor(name, args){
        this.type = "function_call";
        this.name = name;
        this.args = args;
    }
}

class ReturnStatement{
    constructor(value){
        this.type = "return_statement";
        this.value = value;
    }
}

class MathExpression{
    constructor(value){
        this.type = "math_expression";
        this.value = value;
    }
}

class StringLiteral{
    constructor(value){
        this.type = "string_literal";
        this.value = value;
    }
}

// Generator

class Generator{
    constructor(ast){
        this.ast = ast;
        this.currentNode = null;
    }

    generate(){
        throw new Error('Not implemented');
    }

    // Generate math expression
    /*
    Math expression strucuture:

    1 + 1;

    Expression
        Term
            Factor
                Literal
                Literal

    {
                    "type": "IDENTIFIER",
                    "value": "a",
                    "pos": 14,
                    "body": [
                        {
                            "type": "PLUS_OP",       
                            "value": "+",
                            "pos": 19,
                            "body": [
                                {
                                    "type": "NUMBER",
                                    "value": "1",    
                                    "pos": 18,       
                                    "body": []       
                                },
                                {
                                    "type": "NUMBER",
                                    "value": "1",    
                                    "pos": 22,       
                                    "body": []       
                                }
                            ]
                        }
    ]

    Simplifyed code
    [
        {
            "type": "VariableAssigment",
            "obj": {
                "name": "a",
                "value": [
                    {
                        "type": "PLUS_OP",
                        "value": "1",
                        "pos": 18,
                        "body": [
                            {
                                "type": "NUMBER",
                                "value": "1",
                                "pos": 18,
                                "body": []
                            },
                            {
                                "type": "NUMBER",
                                "value": "1",
                                "pos": 22,
                                "body": []
                            }
                        ]
                    }
                ]
            }
        }
    ]

    */
    // generateMathExpression(){
    //     let node = new MathExpression(this.currentNode.value);
    //     console.log("--------------------------------------------------------")
    //     confirm.log(node)
    //     return node;
    // }

    // Generate Variable assigment
    /*
    Variable assigment strucuture:

    let a = 1;

    VariableAssigment
        Identifier
        Expression
            Term
                Factor
                    Literal
                    
    */
/*
        // console.log("--------------------------------------------------------")
        // console.log(node)
        // console.log("--------------------------------------------------------")
        // console.log()
        if(node.value[0].body == STRING){
            node.value = new StringLiteral(node.value[0].value);
        }else{
            node.value = new MathExpression(node.value[0].);
        }
        new VariableAssigment(this.currentNode.value, this.currentNode.body);
*/    

    generateVariableAssigment(){
        let node = this.currentNode.body[0];
        let values = null;

        if(node.body[0].type == "STRING"){
            values = new StringLiteral(node.body[0].value);
        }else{
            values = new MathExpression(node.body[0].body);
        }

        // Get identifyer
        let name = node.value;

        // Create variable assigment
        let variableAssigment = new VariableAssigment(name, values);
        
        return variableAssigment;
    }

    // Generate Function definition
    /*
    Function strucuture:

    fn func(val1, val2){
        return val1 + val2;
    }

    FunctionDefinition
        Identifier
    Args
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
    generateFunctionDefinition(){
        let node = new FunctionDefinition(this.currentNode.value, this.currentNode.args, this.currentNode.body);
        return node;
    }

    // Generate Function call
    /*
    Function call strucuture:

    func(a, b);

    FunctionCall
        Identifier
        Args
            Identifier
            Identifier

    */

    generateFunctionCall(){
        let node = new FunctionCall(this.currentNode.value, this.currentNode.args);
        return node;
    }

    // Generate Return statement
    /*
    Return statement strucuture:

    return val1 + val2;

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
    generateReturnStatement(){
        let node = new ReturnStatement(this.currentNode.body);
        return node;
    }

    // Generate program
    /*
    Program strucuture:

    let a = 1;

    Program
        VariableAssigment
            Identifier
                Literal

    */

    generateProgram(){
        let node = [];
        for(let i = 0; i < this.ast.body.length; i++){
            this.currentNode = this.ast.body[i];
            if(this.currentNode.type === 'VariableAssigment'){
                node.push(this.generateVariableAssigment());
            }else if(this.currentNode.type === 'FunctionDefinition'){
                node.push(this.generateFunctionDefinition());
            }else if(this.currentNode.type === 'FunctionCall'){
                node.push(this.generateFunctionCall());
            }else if(this.currentNode.type === 'ReturnStatement'){
                node.push(this.generateReturnStatement());
            }
        }
        return node;
    }

}

/*
GENERATOR EXAMPLE:

IMPUT CODE:

let a = 1;
let b = 2;

fn func(val1, val2){
    let ret = val1 + val2;
    return ret; 
}

func(a, b);


ast:

{
    "type": "program",
    "value": "",
    "pos": 12,
    "body": [
        {
            "type": "VariableAssigment",     
            "value": "let",
            "pos": 12,
            "body": [
                {
                    "type": "IDENTIFIER",    
                    "value": "a",
                    "pos": 14,
                    "body": [
                        {
                            "type": "NUMBER",
                            "value": "1",    
                            "pos": 18,       
                            "body": []       
                        }
                    ]
                }
            ]
        },
        {
            "type": "VariableAssigment",
            "value": "let",
            "pos": 31,
            "body": [
                {
                    "type": "IDENTIFIER",
                    "value": "b",
                    "pos": 33,
                    "body": [
                        {
                            "type": "NUMBER",
                            "value": "2",
                            "pos": 37,
                            "body": []
                        }
                    ]
                }
            ]
        },
        {
            "type": "FunctionDefinition",
            "value": "fn",
            "pos": 50,
            "body": [
                {
                    "type": "IDENTIFIER",
                    "value": "func",
                    "pos": 55,
                    "body": []
                },
                {
                    "type": "FunctionArgs",
                    "value": "val1",
                    "pos": 60,
                    "body": [
                        {
                            "type": "IDENTIFIER",
                            "value": "val1",
                            "pos": 60,
                            "body": []
                        },
                        {
                            "type": "IDENTIFIER",
                            "value": "val2",
                            "pos": 66,
                            "body": []
                        }
                    ]
                },
                {
                    "type": "FunctionBody",
                    "value": "{",
                    "pos": 67,
                    "body": [
                        {
                            "type": "VariableAssigment",
                            "value": "let",
                            "pos": 84,
                            "body": [
                                {
                                    "type": "IDENTIFIER",
                                    "value": "ret",
                                    "pos": 88,
                                    "body": [
                                        {
                                            "type": "PLUS_OP",
                                            "value": "+",
                                            "pos": 96,
                                            "body": [
                                                {
                                                    "type": "IDENTIFIER",
                                                    "value": "val1",
                                                    "pos": 95,
                                                    "body": []
                                                },
                                                {
                                                    "type": "IDENTIFIER",
                                                    "value": "val2",
                                                    "pos": 102,
                                                    "body": []
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "ReturnStatement",
                            "value": "return",
                            "pos": 122,
                            "body": [
                                {
                                    "type": "IDENTIFIER",
                                    "value": "ret",
                                    "pos": 126,
                                    "body": []
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "type": "FunctionCall",
            "value": "func",
            "pos": 152,
            "body": [
                {
                    "type": "IDENTIFIER",
                    "value": "func",
                    "pos": 152,
                    "body": []
                },
                {
                    "type": "FunctionArgs",
                    "value": "a",
                    "pos": 154,
                    "body": [
                        {
                            "type": "IDENTIFIER",
                            "value": "a",
                            "pos": 154,
                            "body": []
                        },
                        {
                            "type": "IDENTIFIER",
                            "value": "b",
                            "pos": 157,
                            "body": []
                        }
                    ]
                }
            ]
        }
    ]
}

// SIMPLIFYED CODE:

[
    {
        "type": "variable_assingment",
        "name": "a",
        "value": "1"
    },
    {
        "type": "variable_assingment",
        "name": "b",
        "value": "2"
    },
    {
        "type": "function_definition",
        "name": "fn",
        "body": [
            {
                "type": "IDENTIFIER",
                "value": "func",
                "pos": 55,
                "body": []
            },
            {
                "type": "FunctionArgs",
                "value": "val1",
                "pos": 60,
                "body": [
                    {
                        "type": "IDENTIFIER",
                        "value": "val1",
                        "pos": 60,
                        "body": []
                    },
                    {
                        "type": "IDENTIFIER",
                        "value": "val2",
                        "pos": 66,
                        "body": []
                    }
                ]
            },
            {
                "type": "FunctionBody",
                "value": "{",
                "pos": 67,
                "body": [
                    {
                        "type": "VariableAssigment",
                        "value": "let",
                        "pos": 84,
                        "body": [
                            {
                                "type": "IDENTIFIER",
                                "value": "ret",
                                "pos": 88,
                                "body": [
                                    {
                                        "type": "PLUS_OP",
                                        "value": "+",
                                        "pos": 96,
                                        "body": [
                                            {
                                                "type": "IDENTIFIER",
                                                "value": "val1",
                                                "pos": 95,
                                                "body": []
                                            },
                                            {
                                                "type": "IDENTIFIER",
                                                "value": "val2",
                                                "pos": 102,
                                                "body": []
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "ReturnStatement",
                        "value": "return",
                        "pos": 122,
                        "body": [
                            {
                                "type": "IDENTIFIER",
                                "value": "ret",
                                "pos": 126,
                                "body": []
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        "type": "function_call",
        "name": "func"
    }
]

*/ 

// Test

// console.log("Generated code >---------------------------------------------------------")
let generator = new Generator(ast);
let generated = generator.generateProgram();

console.log(
    JSON.stringify(generated, null, 4)
);



// Interpreter

/*
Interpreter reads the simplifyed code and run 

code:

let a = 1;

tokens:

[
  Token { type: 'LET_KEYWORD', value: 'let', pos: 12 },
  Token { type: 'IDENTIFIER', value: 'a', pos: 14 },   
  Token { type: 'ASSIGNMENT_OP', value: '=', pos: 15 },
  Token { type: 'NUMBER', value: '1', pos: 18 },       
  Token { type: 'SEMICOLON_OP', value: ';', pos: 18 }, 
  Token { type: 'EOF', value: null, pos: 28 }
]

ast:

{
    "type": "program",
    "value": "",
    "pos": 12,
    "body": [
        {
            "type": "VariableAssigment",        
            "value": "let",
            "pos": 12,
            "body": [
                {
                    "type": "IDENTIFIER",       
                    "value": "a",
                    "pos": 14,
                    "body": [
                        {
                            "type": "NUMBER",   
                            "value": "1",       
                            "pos": 18,
                            "body": []
                        }
                    ]
                }
            ]
        }
    ]
}

simplifyed code:

[
    {
        "type": "variable_assingment",
        "name": "a",
        "value": "1"
    }
]


... Interprets
*/



// Intepreter


const built_in_functions = {
    "print": async function(args){
        console.log(args);
    }
}

class Interpreter{

    constructor(simplifyed_code){
        this.simplifyed_code = simplifyed_code;
        this.variables = [];
        this.functions = [];
    }

    // Functionals 

    setVariable(var_name, var_value){
        this.variables[var_name] = var_value;
    }

    getVariable(var_name){
        return this.variables[var_name];
    }

    setFunction(func_name, func_body){
        this.functions[func_name] = func_body;
    }

    getFunction(func_name){
        return this.functions[func_name];
    }

    
}



// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Pre-Interpret

/*
The Pre-interpret is responisble to group the ast node into organizated groups

This process group the nodes in classes and subclasses for make the Interpretation process
easier

In other words this make the job of classify each group of nodes inside the ast and return
a new ast with the nodes grouped 

- MathExpression
- FunctionCall
- FunctionDefinition
- VariableAssigment
- ReturnStatement


Groups:

    - MathExpression
    {
        "type": "MathExpression",
        "value": "+ - * /",
        "pos": 14,
        "left-body": []
        "right-body": []
    }

    - FunctionCall
    {
        "type": "FunctionCall",
        "value": "functionName",
        "pos": 0,
        "body": []
    }

    - FunctionDefinition
    {
        "type": "FunctionDefinition",
        "value": "functionName",
        "pos": 0,
        "body": []
    }

    - VariableAssigment
    {
        "type": "VariableAssigment",
        "value": "let",
        "pos": 0,
        "body": []
    }

    - ReturnStatement
    {
        "type": "ReturnStatement",
        "value": "return",
        "pos": 0,
        "body": []
    }

    - Literal
    {
        "type": "Literal",
        "data_type": "STRING NUMBER",
        "value": "1",
        "pos": 0,
        "body": []
    }

    - Identifier
    {
        "type": "Identifier",
        "value": "a",
        "pos": 0,
        "body": []
    }

Ex:

Raw ast:

{
    "type": "program",
    "value": "",
    "pos": 12,
    "body": [
        {
            "type": "VariableAssigment",
            "value": "let",
            "pos": 12,
            "body": [
                {
                    "type": "IDENTIFIER",
                    "value": "a",
                    "pos": 14,
                    "body": [
                        {
                            "type": "MULT_OP",
                            "value": "*",
                            "pos": 27,
                            "body": [
                                {
                                    "type": "PLUS_OP",
                                    "value": "+",
                                    "pos": 21,
                                    "body": [
                                        {
                                            "type": "NUMBER",
                                            "value": "1",
                                            "pos": 20,
                                            "body": []
                                        },
                                        {
                                            "type": "NUMBER",
                                            "value": "1",
                                            "pos": 24,
                                            "body": []
                                        }
                                    ]
                                },
                                {
                                    "type": "PLUS_OP",
                                    "value": "+",
                                    "pos": 33,
                                    "body": [
                                        {
                                            "type": "NUMBER",
                                            "value": "2",
                                            "pos": 32,
                                            "body": []
                                        },
                                        {
                                            "type": "NUMBER",
                                            "value": "2",
                                            "pos": 36,
                                            "body": []
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}

Pre-Interpret ast:

{
    "type": "program",
    "value": "",
    "pos": 12,
    "body": [
        {
            "type": "VariableAssigment",
            "value": "let",
            "pos": 12,
            "body": [
                {
                    "type": "Identifier",
                    "value": "a",
                    "pos": 14,
                    "body": [
                        {
                            "type": "MathExpression",
                            "value": "*",
                            "pos": 27,
                            "left-body":[
                                {
                                    "type": "MathExpression",
                                    "value": "+",
                                    "pos": 21,
                                    "left-body":[
                                        {
                                            "type": "Literal",
                                            "data_type": "NUMBER",
                                            "value": "1",
                                            "pos": 20,
                                            "body": []
                                        }
                                    ]
                                    "right-body":[
                                        {
                                            "type": "Literal",
                                            "data_type": "NUMBER",
                                            "value": "1",
                                            "pos": 24,
                                            "body": []
                                        }
                                    ]
                                }
                            ],
                            "right-body":[
                                {
                                    "type": "MathExpression",
                                    "value": "+",
                                    "pos": 33,
                                    "left-body":[
                                        {
                                            "type": "Literal",
                                            "data_type": "NUMBER",
                                            "value": "2",
                                            "pos": 32,
                                            "body": []
                                        }
                                    ]
                                    "right-body":[
                                        {
                                            "type": "Literal",
                                            "data_type": "NUMBER",
                                            "value": "2",
                                            "pos": 36,
                                            "body": []
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}

*/

/*

    - MathExpression
    {
        "type": "MathExpression",
        "value": "+ - * /",
        "pos": 14,
        "left-body": []
        "right-body": []
    }

    - FunctionCall
    {
        "type": "FunctionCall",
        "value": "functionName",
        "pos": 0,
        "body": []
    }

    - FunctionDefinition
    {
        "type": "FunctionDefinition",
        "value": "functionName",
        "pos": 0,
        "body": []
    }

    - VariableAssigment
    {
        "type": "VariableAssigment",
        "value": "let",
        "pos": 0,
        "body": []
    }

    - ReturnStatement
    {
        "type": "ReturnStatement",
        "value": "return",
        "pos": 0,
        "body": []
    }

    - Literal
    {
        "type": "Literal",
        "data_type": "STRING NUMBER",
        "value": "1",
        "pos": 0,
        "body": []
    }

    - Identifier
    {
        "type": "Identifier",
        "value": "a",
        "pos": 0,
        "body": []
    }
*/ 

class MathExpression{
    constructor(value, pos, left_body, right_body){
        this.type = "MathExpression";
        this.value = value;
        this.pos = pos;
        this.left_body = left_body;
        this.right_body = right_body;
    }
}

class FunctionCall{
    constructor(value, pos, body){
        this.type = "FunctionCall";
        this.value = value;
        this.pos = pos;
        this.body = body;
    }
}

class FunctionDefinition{
    constructor(value, pos, body){
        this.type = "FunctionDefinition";
        this.value = value;
        this.pos = pos;
        this.body = body;
    }
}

class VariableAssigment{
    constructor(value, pos, body){
        this.type = "VariableAssigment";
        this.value = value;
        this.pos = pos;
        this.body = body;
    }
}

class ReturnStatement{
    constructor(value, pos, body){
        this.type = "ReturnStatement";
        this.value = value;
        this.pos = pos;
        this.body = body;
    }
}

class Literal{
    constructor(data_type, value, pos, body){
        this.type = "Literal";
        this.data_type = data_type;
        this.value = value;
        this.pos = pos;
        this.body = body;
    }
}

class Identifier{
    constructor(value, pos, body){
        this.type = "Identifier";
        this.value = value;
        this.pos = pos;
        this.body = body;
    }
}

class Program{
    constructor(value, pos, body){
        this.type = "Program";
        this.value = value;
        this.pos = pos;
        this.body = body;
    }
}