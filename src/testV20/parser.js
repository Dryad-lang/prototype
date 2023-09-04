"use strict";

const { Interface } = require("readline");

/*

	Dryad Language Parser


	Rules:

	proram -> statement*
	statement -> if | while | do | for | func | var | return | import | export | assign | expression

	body -> "{" statement* "}" 
	| statement
	the body is a block that can have many statements or just one statement basically an container for statements

	if -> "if" "(" expression ")" body ("else" body)?

	while -> "while" "(" expression ")" body

	do -> "do" body "while" "(" expression ")" ";"

	for -> "for" "(" expression? ";" expression? ";" expression? ")" body

	func -> "function" id "(" id* ")" body 

	func_call -> id "(" expression* | argument_list? ")"

	argumet_list -> expression ("," expression)*

	var -> "var" id ("=" expression)? ";" > global scope

	let -> "let" id ("=" expression)? ";" > local scope

	return -> "return" expression? ";"

	import -> "import" id ("as" id)? ";"

	export -> "export" id {"," id}*? ";" 

	assign -> id ("=" | "+=" | "-=" | "*=" | "/=" | "%=" | "&=" | "|=" | "^=" | "<<=" | ">>=") expression ";"

	unary -> ("+" | "-" | "!" | "~" | "--" | "++") expression

	binary -> expression ("+" | "-" | "*" | "/" | "%" | "&" | "|" | "^" | "<<" | ">>" | "&&" | "||" | "==" | "!=" | "<" | ">" | "<=" | ">=") expression 

	expression -> unary | binary | func_call | id | number | string | "(" expression ")"

	The parser will use chain of responsability pattern to parse the tokens
	this will make the parser more flexible and easy to maintain

	how it will work:

	class parser will have a method parse that will receive a list of tokens
	and will return a list of statements

	each statement will extend a base class statement that is the handler for the chain of responsability
	when the parse method is called it will call the parse method of the first statement in the chain
	and this statement will call the parse method of the next statement in the chain and so on an cascade way
	until the last statement in the chain is reached


	// For the recursive functions use Tail Call Optimization (TCO) to avoid stack overflow


	Ast Structure:

	{
		type: "type",
		value: "value",
		children: [
			{
				type: "type",
				value: "value",
				children: [] ... > recursive structure
			}
		]
	}


	// Associate nodes 
	The associate nodes is a list of nodes that are associated with a specific node

	// If statement
	IF_NODE -> "if" "(" CONDITION_NODE ")" BODY_NODE ("else" BODY_NODE)?
	CONDITION_NODE -> EXPRESSION_NODE
	BODY_NODE -> STATEMENT_NODE | BLOCK_NODE

	// While statement
	WHILE_NODE -> "while" "(" CONDITION_NODE ")" BODY_NODE
	CONDITION_NODE -> EXPRESSION_NODE
	BODY_NODE -> STATEMENT_NODE | BLOCK_NODE

	// Do statement
	DO_NODE -> "do" BODY_NODE "while" "(" CONDITION_NODE ")" ";"
	BODY_NODE -> STATEMENT_NODE | BLOCK_NODE
	CONDITION_NODE -> EXPRESSION_NODE

	// For statement
	FOR_NODE -> "for" "(" EXPRESSION_NODE? ";" EXPRESSION_NODE? ";" EXPRESSION_NODE? ")" BODY_NODE
	EXPRESSION_NODE -> EXPRESSION_NODE
	BODY_NODE -> STATEMENT_NODE | BLOCK_NODE

	// Function statement
	FUNC_NODE -> "function" id "(" id* ")" BODY_NODE
	BODY_NODE -> STATEMENT_NODE | BLOCK_NODE

	// Function call statement
	FUNC_CALL_NODE -> id "(" EXPRESSION_NODE* | ARGUMENT_LIST_NODE? ")"
	ARGUMENT_LIST_NODE -> EXPRESSION_NODE ("," EXPRESSION_NODE)*

	// Var statement
	VAR_NODE -> "var" id ("=" EXPRESSION_NODE)? ";"
	EXPRESSION_NODE -> EXPRESSION_NODE


	// Let statement
	LET_NODE -> "let" id ("=" EXPRESSION_NODE)? ";"
	EXPRESSION_NODE -> EXPRESSION_NODE


	// Return statement
	RETURN_NODE -> "return" EXPRESSION_NODE? ";"
	EXPRESSION_NODE -> EXPRESSION_NODE


	// Import statement
	IMPORT_NODE -> "import" id ("as" id)? ";"
	EXPRESSION_NODE -> EXPRESSION_NODE

	// Export statement
	EXPORT_NODE -> "export" id {"," id}*? ";"
	EXPRESSION_NODE -> EXPRESSION_NODE

	// Assign statement
	ASSIGN_NODE -> id ("=" | "+=" | "-=" | "*=" | "/=" | "%=" | "&=" | "|=" | "^=" | "<<=" | ">>=") EXPRESSION_NODE ";"
	EXPRESSION_NODE -> EXPRESSION_NODE | FUNC_CALL_NODE | id | number | string | "(" EXPRESSION_NODE ")"

	// Unary statement
	UNARY_NODE -> ("+" | "-" | "!" | "~" | "--" | "++") EXPRESSION_NODE
	EXPRESSION_NODE -> EXPRESSION_NODE | FUNC_CALL_NODE | id | number | string | "(" EXPRESSION_NODE ")"

	// Binary statement
	BINARY_NODE -> EXPRESSION_NODE ("+" | "-" | "*" | "/" | "%" | "&" | "|" | "^" | "<<" | ">>" | "&&" | "||" | "==" | "!=" | "<" | ">" | "<=" | ">=") EXPRESSION_NODE
	EXPRESSION_NODE -> EXPRESSION_NODE | FUNC_CALL_NODE | id | number | string | "(" EXPRESSION_NODE ")"

	// Expression statement
	EXPRESSION_NODE -> EXPRESSION_NODE | FUNC_CALL_NODE | id | number | string | "(" EXPRESSION_NODE ")"
	
	// Block statement / Body statement
	BODY_NODE -> "{" STATEMENT_NODE* "}"

	// Statement statement
	STATEMENT_NODE -> IF_NODE | WHILE_NODE | DO_NODE | FOR_NODE | FUNC_NODE | FUNC_CALL_NODE | VAR_NODE | LET_NODE | RETURN_NODE | IMPORT_NODE | EXPORT_NODE | ASSIGN_NODE | UNARY_NODE | BINARY_NODE | EXPRESSION_NODE | BLOCK_NODE

	// Program statement
	PROGRAM_NODE -> STATEMENT_NODE*
*/ 

// Imports
const { TokenStack } = require('./stack');
// token: { type: "type", value: "value", line: "line" }
// TODO: Implement the parser

let defaultLexemeList = [
    // Keywords
    {name:"LX_IF", rx:'if'},
    {name:"LX_ELSE", rx:'else'},
    {name:"LX_WHILE", rx:'while'},
    {name:"LX_DO", rx:'do'},
    {name:"LX_FOR", rx:'for'},
    {name:"LX_FUNC", rx:'function'},
    {name:"LX_VAR", rx:'var'},
    {name:"LX_RETURN", rx:'return'},
    {name:"LX_IMPORT", rx:'import'},
    {name:"LX_EXPORT", rx:'export'},
    {name:"LX_AS", rx:'as'},

    // Constants
    {name:"LX_ID", rx:'[a-zA-Z_][a-zA-Z0-9_]*'},
    {name:"LX_NUMBER", rx:'[0-9]+(\\.[0-9]*)?'},
    {name:"LX_STRING", rx:'"(\\\\"|[^"])*"|' + "'(\\\\'|[^'])*'"},

    // Punctuation
    {name:"LX_LPAREN", rx:'\\('},
    {name:"LX_RPAREN", rx:'\\)'},
    {name:"LX_LCURLY", rx:'\\{'},
    {name:"LX_RCURLY", rx:'\\}'},
    {name:"LX_LBRACKET", rx:'\\['},
    {name:"LX_RBRACKET", rx:'\\]'},
    {name:"LX_SEMICOLON", rx:';'},
    {name:"LX_COLON", rx:':'},
    {name:"LX_COMMA", rx:','},
    {name:"LX_DOT", rx:'\\.'},

    // Logical
    {name:"LX_LAND", rx:'&&'},
    {name:"LX_LOR", rx:'\\|\\|'},

    // Special assign
    {name:"LX_PLUSSET", rx:'\\+='},
    {name:"LX_MINUSSET", rx:'-='},
    {name:"LX_MULTSET", rx:'\\*='},
    {name:"LX_DIVSET", rx:'/='},
    {name:"LX_MODULOSET", rx:'%='},
    {name:"LX_ANDSET", rx:'&='},
    {name:"LX_ORSET", rx:'\\|='},
    {name:"LX_XORSET", rx:'\\^='},
    {name:"LX_LSHIFTSET", rx:'<<='},
    {name:"LX_RSHIFTSET", rx:'>>='},

    // Binary
    {name:"LX_AND", rx:'&'},
    {name:"LX_OR", rx:'\\|'},
    {name:"LX_XOR", rx:'\\^'},
    {name:"LX_NOT", rx:'~'},
    {name:"LX_LSHIFT", rx:'<<'},
    {name:"LX_RSHIFT", rx:'>>'},

    // Comparison
    {name:"LX_EQ", rx:'=='},
    {name:"LX_NEQ", rx:'!='},
    {name:"LX_LE", rx:'<='},
    {name:"LX_GE", rx:'>='},
    {name:"LX_LT", rx:'<'},
    {name:"LX_GT", rx:'>'},

    // Logical not
    {name:"LX_LNOT", rx:'!'},

    // Assignment
    {name:"LX_ASSIGN", rx:'='},

    // Operators
    {name:"LX_INC", rx:'\\+\\+'},
    {name:"LX_DEC", rx:'--'},
    {name:"LX_POW", rx:'\\*\\*'},
    {name:"LX_PLUS", rx:'\\+'},
    {name:"LX_MINUS", rx:'-'},
    {name:"LX_MULT", rx:'\\*'},
    {name:"LX_DIV", rx:'/'},
    {name:"LX_MODULO", rx:'%'}
];

// Ast node
class AstNode {
	constructor(type, value, children = []) {
		this.type = type;
		this.value = value;
		this.children = children;
	}
}

// Base statement class for the chain of responsability
/*
The statement chain works for parsing the tokens in the stack.

ParseCall -> CallChain
			ParseCall -> CallChain 

This way the Statement chain until no more tokens are left in the stack or no more rules matches,
recusively calling the next statement in the chain.

If the method need an specific Statement to parse the tokens it will call the method parseCall of the specific statement
otherwise it will call the entire chain of responsability for parsing the tokens from root to the end of the chain. 

Each statement can call another statement and recursively calling for generate the ast tree.
But if the statement reach the end without match any rule it will return null and stop the chain of responsability, throwing an error.
If this have an error whitout end the chain of responsability will throw an error, but still try to parse the tokens with the next statement in the chain.

ParseCall -> CallChain
			(Case match return ast node) || (Case no match try the next)
			ParseCall -> CallChain 
						ParseCall -> CallChain (Case reach the end of the chain return null and throw an error)
*/ 

// NODES BUILDERS
/*
Class for return node tamplates for the ast tree

-> AstNode(type, value, children = []) <- AstNode constructor

Parameters:
type: [obj] { type: "type", value: "value"} <- Like { type: "LX_ID", value: "foo" }
*/ 

class NodesBuilder {
	// If statement
	static ifNode(condition, body, elseBody = null) {
		return new AstNode("IF_NODE", null, [condition, body, elseBody]);
	}

	// While statement
	static whileNode(condition, body) {
		return new AstNode("WHILE_NODE", null, [condition, body]);
	}

	// Do statement
	static doNode(body, condition) {
		return new AstNode("DO_NODE", null, [body, condition]);
	}

	// For statement
	static forNode(init = null, condition = null, increment = null, body) {
		return new AstNode("FOR_NODE", null, [init, condition, increment, body]);
	}

	// Function statement
	static functionNode(name, args, body) {
		return new AstNode("FUNC_NODE", name, [args, body]);
	}

	// Function call statement
	static functionCallNode(name, args) {
		return new AstNode("FUNC_CALL_NODE", name, args);
	}

	// Argument list statement
	static argumentListNode(args) {
		return new AstNode("ARGUMENT_LIST_NODE", null, args);
	}

	// Var statement
	static varNode(name, value = null) {
		return new AstNode("VAR_NODE", name, value);
	}

	// Let statement
	static letNode(name, value = null) {
		return new AstNode("LET_NODE", name, value);
	}

	// Return statement
	static returnNode(value = null) {
		return new AstNode("RETURN_NODE", null, value);
	}

	// Import statement
	static importNode(name, asName = null) {
		return new AstNode("IMPORT_NODE", name, asName);
	}

	// Export statement
	static exportNode(names) {
		return new AstNode("EXPORT_NODE", null, names);
	}

	// Assign statement
	static assignNode(name, operator, value) {
		return new AstNode("ASSIGN_NODE", operator, [name, value]);
	}

	// Unary statement
	static unaryNode(operator, value) {
		return new AstNode("UNARY_NODE", operator, value);
	}

	// Binary statement
	static binaryNode(operator, left, right) {
		return new AstNode("BINARY_NODE", operator, [left, right]);
	}

	// Item statement
	static itemNode(value) {
		return new AstNode("ITEM_NODE", null, value);
	}

	// Expression statement
	static expressionNode(value) {
		return new AstNode("EXPRESSION_NODE", null, value);
	}

	// Block statement
	static blockNode(statements) {
		return new AstNode("BLOCK_NODE", null, statements);
	}

	// Program statement
	static programNode(statements) {
		return new AstNode("PROGRAM_NODE", null, statements);
	}
}



/*

Statement class:

Parameters:
next: Statement (next statement in the chain of responsability)
stack: TokenStack (stack of tokens to parse)
root: Statement (root statement of the chain of responsability) <- Used to call the entire chain of responsability for recursive parsing

Methods:

next(): Statement (return the next statement in the chain of responsability)
parse: Parse the tokens in the stack and return an ast node or null if no rule matches
	<- If not match pass for the next statement in the chain of responsability
rule: Here is where the magic happens, here is where the statement will be parsed and return an ast node or null if no rule matches
	<- If match return node else return null
parseRoot: Call the entire chain of responsability for parsing the tokens using the root
*/

/*
Methods parser chain will have two main paramethers

Next -> That will be the link for the next element in the chain 
Prev -> The prev will be the same but oposite

This way the Chain can make an solid link making an big memory saving process

{
    Next: [Statement, obj] -> link to next // Case end = null
    Prev: [Statement, obj] -> Link to previous // Case first = null
}

null -> Stmnt -> Stmnt -> Stmnt -> null

This help with the recursivity and memory efficience just passing the element position reference 
and not passing the entire object itself

null -> Stmnt -> Stmnt -> ...
        -> Need an call (So if need to parse again recursively from the beggining we dont pass another 
            instance just use the reference of the already instantied one, saving memory and the speed)
        null -> Stmnt -> Stmnt -> ...
*/ 

class Statement {
	constructor(next, stack, prev = null) {
		this.next = next;
		this.stack = stack;
		this.prev = prev;
	}

	next() {
		return this.next;
	}

	prev() {
		return this.prev;
	}

	callRoot(stack) {
		let root = this;
		while(root.prev != null) root = root.prev;
		return root.parse(stack);
	}

	callStatement(statement, stack) {
		let root = this;
		while(root.prev != null) root = root.prev;
		while(root != null && root != statement) root = root.next;
		if(root != null) return root.parse(stack);
		throw new Error("Statement not found");
	}

	callNext(stack) {
		if(this.next != null) return this.next.parse(stack);
		return null;
	}

	parse(stack) {
		// If rules return something return the node else pass for the next statement in the chain
		let node = this.rule();
		if(node != null) return node;
		if(this.next != null) return this.next.parse(stack);
	}

	rule() {
		throw new Error("Not implemented");
	}
}

/*
Parse tools: (static methods)

expect: Check if next token in the stack match the type and value
	<- If match return the token else return null
consume: Consume the next token in the stack
	<- If have tokens in the stack return the token else return null
accept: Check if next token in the stack match the type and value
	<- If match return the token else return null
*/ 

class ParseTools {
	static expect(stack, type, value) {
		if(stack.peek().type == type && stack.peek().value == value) return stack.pop();
		return null;
	}

	static consume(stack) {
		if(stack.size() > 0) return stack.pop();
		return null;
	}

	static accept(stack, type, value) {
		if(stack.peek().type == type && stack.peek().value == value) return stack.peek();
		return null;
	}

	static acceptType(stack, type) {
		if(stack.peek().type == type) return stack.peek();
		return null;
	}
}


// Body statement class
// body -> "{" statement* "}"
// | statement
// the body is a block that can have many statements or just one statement basically an container for statements

class BodyStatement extends Statement {
	constructor(next, stack, prev = null) {
		super(next, stack, prev);
	}

	rule() {
		/*
		Get > "{" statement* "}"
		| statement <- Run callRoot for parse the statement
		<- If have some statement in the stack add to the children of the body node else just return an empty body node
		*/ 
		let node = null;
		if(ParseTools.accept(this.stack, "LX_LCURLY", "{") != null) {
			this.stack.shift();
			let statements = [];
			while(ParseTools.accept(this.stack, "LX_RCURLY", "}") == null) {
				let statement = this.callRoot(this.stack);
				if(statement != null) statements.push(statement);
			}
			this.stack.shift();
			node = NodesBuilder.blockNode(statements);
		} else {
			node = this.callRoot(this.stack);
		}
		return node;
	}
}

// Line statement class
// line -> statement ";"
// The line statement is a statement followed by a semicolon

class LineStatement extends Statement {
	constructor(next, stack, prev = null) {
		super(next, stack, prev);
	}

	rule() {
		/*
		Get > statement ";"
		<- If have some statement in the stack add to the children of the body node else just return an empty body node
		*/
		let node = null;
		let statement = this.callRoot(this.stack);
		if(statement != null) {
			this.stack.shift();
			if(ParseTools.accept(this.stack, "LX_SEMICOLON", ";") != null) {
				this.stack.shift();
				node = statement;
			}
			else throw new Error("Expected semicolon");
		}
		return node;
	}
}

// Expression statement class
// expression -> unary | binary | func_call | id | number | string | "(" expression ")"
// The expression statement can be an unary, binary, function call, id, number, string or an expression inside parentheses

/*
    // Constants
    {name:"LX_ID", rx:'[a-zA-Z_][a-zA-Z0-9_]*'},
    {name:"LX_NUMBER", rx:'[0-9]+(\\.[0-9]*)?'},
    {name:"LX_STRING", rx:'"(\\\\"|[^"])*"|' + "'(\\\\'|[^'])*'"},

    // Logical
    {name:"LX_LAND", rx:'&&'},
    {name:"LX_LOR", rx:'\\|\\|'},

    // Special assign
    {name:"LX_PLUSSET", rx:'\\+='},
    {name:"LX_MINUSSET", rx:'-='},
    {name:"LX_MULTSET", rx:'\\*='},
    {name:"LX_DIVSET", rx:'/='},
    {name:"LX_MODULOSET", rx:'%='},
    {name:"LX_ANDSET", rx:'&='},
    {name:"LX_ORSET", rx:'\\|='},
    {name:"LX_XORSET", rx:'\\^='},
    {name:"LX_LSHIFTSET", rx:'<<='},
    {name:"LX_RSHIFTSET", rx:'>>='},

    // Binary
    {name:"LX_AND", rx:'&'},
    {name:"LX_OR", rx:'\\|'},
    {name:"LX_XOR", rx:'\\^'},
    {name:"LX_NOT", rx:'~'},
    {name:"LX_LSHIFT", rx:'<<'},
    {name:"LX_RSHIFT", rx:'>>'},

    // Comparison
    {name:"LX_EQ", rx:'=='},
    {name:"LX_NEQ", rx:'!='},
    {name:"LX_LE", rx:'<='},
    {name:"LX_GE", rx:'>='},
    {name:"LX_LT", rx:'<'},
    {name:"LX_GT", rx:'>'},

    // Logical not
    {name:"LX_LNOT", rx:'!'},

    // Assignment
    {name:"LX_ASSIGN", rx:'='},

    // Operators
    {name:"LX_INC", rx:'\\+\\+'},
    {name:"LX_DEC", rx:'--'},
    {name:"LX_POW", rx:'\\*\\*'},
    {name:"LX_PLUS", rx:'\\+'},
    {name:"LX_MINUS", rx:'-'},
    {name:"LX_MULT", rx:'\\*'},
    {name:"LX_DIV", rx:'/'},
    {name:"LX_MODULO", rx:'%'}
*/ 

		/*
		Get > unary | binary | func_call | id | number | string | "(" expression ")"
		<- If match return the expression node else return null

		binary: expression ("+" | "-" | "*" | "/" | "%" | "&" | "|" | "^" | "<<" | ">>" | "&&" | "||" | "==" | "!=" | "<" | ">" | "<=" | ">=") expression
		| item operator item
		{
			type: "BINARY_NODE",
			value: "operator",
			children: [
				{
					type: "EXPRESSION_NODE",
					value: "left",
					children: []
				},
				{
					type: "EXPRESSION_NODE",
					value: "right",
					children: []
				}
		}

		unary: ("!" | "~" | "--" | "++") expression
		| operator item

		{
			type: "UNARY_NODE",
			value: "operator",
			children: [
				{
					type: "EXPRESSION_NODE",
					value: "value",
					children: []
				}
		}

		assign: id ("=" | "+=" | "-=" | "*=" | "/=" | "%=" | "&=" | "|=" | "^=" | "<<=" | ">>=") expression
		| operator item

		{
			type: "ASSIGN_NODE",
			value: "operator",
			children: [
				{
					type: "EXPRESSION_NODE",
					value: "name",
					children: []
				},
			]
		}

		func_call: id "(" expression* | argument_list? ")"
		| item "(" expression* | argument_list? ")"

		{
			type: "FUNC_CALL_NODE",
			value: "name",
			children: [
				{
					type: "ARGUMENT_LIST_NODE",
					value: null,
					children: [
						{
							type: "EXPRESSION_NODE",
							value: "argument",
							children: []
						}
					]
				}
			]
		}
		argument_list: expression ("," expression)*
		| item ("," expression)*

		{
			type: "ARGUMENT_LIST_NODE",
			value: null,
			children: [
				{
					type: "EXPRESSION_NODE",
					value: "argument",
					children: []
				}
				...?
			]
		}

		item: id | number | string | "(" expression ")"
		| id | number | string | "(" item ")"

		{
			type: "LITERAL_(type)_NODE",
			value: "value",
			children: []
		}

		

		*/

class ExpressionStatement extends Statement {
	constructor(next, stack, prev = null) {
		super(next, stack, prev);
		this.unaryOperators = ["LX_PLUS", "LX_MINUS", "LX_LNOT", "LX_NOT", "LX_INC", "LX_DEC"];
		this.binaryOperators = ["LX_PLUS", "LX_MINUS", "LX_MULT", "LX_DIV", "LX_MODULO", "LX_AND","LX_OR", "LX_XOR", "LX_LSHIFT", "LX_RSHIFT", "LX_LAND", "LX_LOR", "LX_EQ", "LX_NEQ", "LX_LE","LX_GE", "LX_LT", "LX_GT"];
		this.assignOperators = ["LX_ASSIGN", "LX_PLUSSET", "LX_MINUSSET", "LX_MULTSET", "LX_DIVSET",
		"LX_MODULOSET", "LX_ANDSET", "LX_ORSET", "LX_XORSET", "LX_LSHIFTSET", "LX_RSHIFTSET"];
		this.unaryOperatorsMap = {
			"LX_PLUS": "+",
			"LX_MINUS": "-",
			"LX_LNOT": "!",
			"LX_NOT": "~",
			"LX_INC": "++",
			"LX_DEC": "--"
		};
		this.binaryOperatorsMap = {
			"LX_PLUS": "+",
			"LX_MINUS": "-",
			"LX_MULT": "*",
			"LX_DIV": "/",
			"LX_MODULO": "%",
			"LX_AND": "&",
			"LX_OR": "|",
			"LX_XOR": "^",
			"LX_LSHIFT": "<<",
			"LX_RSHIFT": ">>",
			"LX_LAND": "&&",
			"LX_LOR": "||",
			"LX_EQ": "==",
			"LX_NEQ": "!=",
			"LX_LE": "<=",
			"LX_GE": ">=",
			"LX_LT": "<",
			"LX_GT": ">"
		};
		this.assignOperatorsMap = {
			"LX_ASSIGN": "=",
			"LX_PLUSSET": "+=",
			"LX_MINUSSET": "-=",
			"LX_MULTSET": "*=",
			"LX_DIVSET": "/=",
			"LX_MODULOSET": "%=",
			"LX_ANDSET": "&=",
			"LX_ORSET": "|=",
			"LX_XORSET": "^=",
			"LX_LSHIFTSET": "<<=",
			"LX_RSHIFTSET": ">>="
		};
	}

	/*
	Parse Expression
	order > unary | binary | func_call | id | number | string | "(" expression ")"
	<- If match return the expression node else return null
	*/
	rule() {
		let node = null;
		let unary = this.unaryExpression(this.stack);
		if(unary.node != null) return unary.node;
		let binary = this.binaryExpression(this.stack);
		if(binary.node != null) return binary.node;
		let assign = this.assignExpression(this.stack);
		if(assign.node != null) return assign.node;
		let funcCall = this.funcCallExpression(this.stack);
		if(funcCall.node != null) return funcCall.node;
		let item = this.itemExpression(this.stack);
		if(item.node != null) return item.node;
		return node;
	} 


	/*
	Get > id | number | string | "(" expression ")"
	the item can be an id, number, string or any literal the item represent basic values
	<- If match return the expression node else return null
	*/
	itemExpression(stack) {
		let node = null;
		if(ParseTools.acceptType(stack, "LX_ID") != null) return NodesBuilder.itemNode(ParseTools.consume(stack));
		if(ParseTools.acceptType(stack, "LX_NUMBER") != null) return NodesBuilder.itemNode(ParseTools.consume(stack));
		if(ParseTools.acceptType(stack, "LX_STRING") != null) return NodesBuilder.itemNode(ParseTools.consume(stack));
		return { node: null, stack: stack };
	}

	/*
	Get > item operator item
	<- If match return the binary node else return null
	*/ 
	binaryExpression(stack) {
		let node = null;
		let left = this.itemExpression(stack);
		if(left.node != null) {
			stack.shift();
			let operator = ParseTools.accept(stack, "LX_PLUS", "+") || 
							ParseTools.accept(stack, "LX_MINUS", "-") || 
							ParseTools.accept(stack, "LX_MULT", "*") || 
							ParseTools.accept(stack, "LX_DIV", "/") || 
							ParseTools.accept(stack, "LX_MODULO", "%") || 
							ParseTools.accept(stack, "LX_AND", "&") || 
							ParseTools.accept(stack, "LX_OR", "|") || 
							ParseTools.accept(stack, "LX_XOR", "^") || 
							ParseTools.accept(stack, "LX_LSHIFT", "<<") || 
							ParseTools.accept(stack, "LX_RSHIFT", ">>") || 
							ParseTools.accept(stack, "LX_LAND", "&&") || 
							ParseTools.accept(stack, "LX_LOR", "||") || 
							ParseTools.accept(stack, "LX_EQ", "==") || 
							ParseTools.accept(stack, "LX_NEQ", "!=") || 
							ParseTools.accept(stack, "LX_LE", "<=") || 
							arseTools.accept(stack, "LX_GE", ">=") || 
							ParseTools.accept(stack, "LX_LT", "<") || 
							ParseTools.accept(stack, "LX_GT", ">");
			if(operator != null) {
				stack.shift();
				let right = this.itemExpression(stack);
				if(right.node != null) {
					stack.shift();
					node = NodesBuilder.binaryNode(operator.value, left.node, right.node);
				}
			}
		}
		return { node: node, stack: stack };
	}

	/*
	Get > operator item
	<- If match return the unary node else return null
	*/
	unaryExpression(stack) {
		let node = null;
		let operator = ParseTools.accept(stack, "LX_PLUS", "+") || 
						ParseTools.accept(stack, "LX_MINUS", "-") || 
						ParseTools.accept(stack, "LX_LNOT", "!") || 
						ParseTools.accept(stack, "LX_NOT", "~") || 
						ParseTools.accept(stack, "LX_INC", "++") || 
						ParseTools.accept(stack, "LX_DEC", "--");
		if(operator != null) {
			stack.shift();
			let item = this.itemExpression(stack);
			if(item.node != null) {
				stack.shift();
				node = NodesBuilder.unaryNode(operator.value, item.node);
			}
		}
		return { node: node, stack: stack };
	}

}

// Test
let stack = new TokenStack();
