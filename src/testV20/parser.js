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

	// Test statement
	static testNode(value) {
		return new AstNode("TEST_NODE", null, value);
	}
}

class Parser {
	constructor(tokens){
		this.tokens = tokens;
		this.current = 0;
		this.opeators = [
			{ type: "LX_PLUS", precedence: 1, associativity: "left" },
			{ type: "LX_MINUS", precedence: 1, associativity: "left" },
			{ type: "LX_MULT", precedence: 2, associativity: "left" },
			{ type: "LX_DIV", precedence: 2, associativity: "left" },
			{ type: "LX_MODULO", precedence: 2, associativity: "left" },
			{ type: "LX_AND", precedence: 3, associativity: "left" },
			{ type: "LX_OR", precedence: 3, associativity: "left" },
			{ type: "LX_XOR", precedence: 3, associativity: "left" },
			{ type: "LX_LSHIFT", precedence: 4, associativity: "left" },
			{ type: "LX_RSHIFT", precedence: 4, associativity: "left" },
			{ type: "LX_EQ", precedence: 5, associativity: "left" },
			{ type: "LX_NEQ", precedence: 5, associativity: "left" },
			{ type: "LX_LE", precedence: 5, associativity: "left" },
			{ type: "LX_GE", precedence: 5, associativity: "left" },
			{ type: "LX_LT", precedence: 5, associativity: "left" },
			{ type: "LX_GT", precedence: 5, associativity: "left" },
			{ type: "LX_LNOT", precedence: 6, associativity: "left" }
		];
		this._err = []; // Error list
		this._ERRFLAG = false; // Error flag
	}

	// Get the current token
	get currentToken() {
		return this.tokens[this.current];
	}

	// Get the next token
	get nextToken() {
		return this.tokens[this.current + 1];
	}

	// Accept the current token
	accept(type) {
		if (this.currentToken.type == type) this.current++; return true;
		return false;
	}

	// Expect the next token
	expect(type) {
		if (this.nextToken.type == type) this.current++; return true;
		return false;
	}

	// Error
	error(message) {
		_ERRFLAG = true;
		_err.push(message);
		throw new Error(message);
	}

	// Parse the program
	parse() {
		let statements = [];
		while (!this.isAtEnd()) {
			statements.push(this.statement());
		}
		return NodesBuilder.programNode(statements);
	}

	// Is at end
	isAtEnd() {
		return this.current >= this.tokens.length;
	}

	// Block statement
	block() {
		if (this.accept("LX_LCURLY")) {
			let statements = [];
			while (!this.accept("LX_RCURLY")) {
				// statements.push(this.statement());
			}
			// return NodesBuilder.blockNode(statements);
		}
		return this.statement();
	}

	// Statement statement
	statement() {
		// if (this.accept("LX_LCURLY")) return this.block();
		
		// Expression statement
		if (this.accept("LX_LPAREN")) return this.expression();
	}

	// Literals
	literal() {
		if (this.accept("LX_NUMBER")) return NodesBuilder.itemNode(this.currentToken.value);
		if (this.accept("LX_STRING")) return NodesBuilder.itemNode(this.currentToken.value);
		if (this.accept("LX_ID")) return NodesBuilder.itemNode(this.currentToken.value);
	}

	// Expressions
	expression() {
		// TODO: Implement the expressions after the expressions are implemented
		// What is an expression? An expression is a statement that returns a value running a function or an operation
		// Expressions can be unary, binary, function call, variable, number, string, etc

		// This will be the default expressions parser for be called in the statements
		// expression -> unary | binary | func_call | id | number | string | "(" expression ")"

		// Unary statement
		if (this.accept("LX_LNOT")) return this.unary();
		if (this.accept("LX_NOT")) return this.unary();
		if (this.accept("LX_INC")) return this.unary();
		if (this.accept("LX_DEC")) return this.unary();

		// Binary statement
		if (this.accept("LX_PLUS")) return this.binary();
		if (this.accept("LX_MINUS")) return this.binary();
		if (this.accept("LX_MULT")) return this.binary();
		if (this.accept("LX_DIV")) return this.binary();
		if (this.accept("LX_MODULO")) return this.binary();
		if (this.accept("LX_AND")) return this.binary();
		if (this.accept("LX_OR")) return this.binary();
		if (this.accept("LX_XOR")) return this.binary();
		if (this.accept("LX_LSHIFT")) return this.binary();
		if (this.accept("LX_RSHIFT")) return this.binary();
		if (this.accept("LX_EQ")) return this.binary();
		if (this.accept("LX_NEQ")) return this.binary();
		if (this.accept("LX_LE")) return this.binary();
		if (this.accept("LX_GE")) return this.binary();
		if (this.accept("LX_LT")) return this.binary();
		if (this.accept("LX_GT")) return this.binary();

		// Item statement
		if (this.accept("LX_ID")) return this.item();
		if (this.accept("LX_NUMBER")) return this.item();
		if (this.accept("LX_STRING")) return this.item();

		// Function call statement
		if (this.accept("LX_LPAREN")) return this.functionCall();

		// Expression statement
		if (this.accept("LX_LPAREN")) return this.expression();

		// Error
		this.error("Unexpected token");

		// Return null
		return null;
	}

	// Unary statement
	unary() {
		// operator = ( "!" | "~" | "--" | "++")
		// unary -> operator expression
		// get the operator token and check if the next token is an expression(Default expressions)

		let operator = this.currentToken;
		if (this.accept("LX_LNOT")) return NodesBuilder.unaryNode(operator, this.expression());
		if (this.accept("LX_NOT")) return NodesBuilder.unaryNode(operator, this.expression());
		if (this.accept("LX_INC")) return NodesBuilder.unaryNode(operator, this.expression());
		if (this.accept("LX_DEC")) return NodesBuilder.unaryNode(operator, this.expression());
	}

	// Binary statement
	binary() {
		// operator = ( "+" | "-" | "*" | "/" | "%" | "&" | "|" | "^" | "<<" | ">>" | "&&" | "||" | "==" | "!=" | "<" | ">" | "<=" | ">=")
		// binary -> expression operator expression
		// get the operator token and check if the next token is an expression(Default expressions)

		let operator = this.currentToken;
		if (this.accept("LX_PLUS")) return NodesBuilder.binaryNode(operator, this.expression(), this.expression());
		if (this.accept("LX_MINUS")) return NodesBuilder.binaryNode(operator, this.expression(), this.expression());
		if (this.accept("LX_MULT")) return NodesBuilder.binaryNode(operator, this.expression(), this.expression());
		if (this.accept("LX_DIV")) return NodesBuilder.binaryNode(operator, this.expression(), this.expression());
		if (this.accept("LX_MODULO")) return NodesBuilder.binaryNode(operator, this.expression(), this.expression());
		if (this.accept("LX_AND")) return NodesBuilder.binaryNode(operator, this.expression(), this.expression());
		if (this.accept("LX_OR")) return NodesBuilder.binaryNode(operator, this.expression(), this.expression());
		if (this.accept("LX_XOR")) return NodesBuilder.binaryNode(operator, this.expression(), this.expression());
		if (this.accept("LX_LSHIFT")) return NodesBuilder.binaryNode(operator, this.expression(), this.expression());
		if (this.accept("LX_RSHIFT")) return NodesBuilder.binaryNode(operator, this.expression(), this.expression());
		if (this.accept("LX_EQ")) return NodesBuilder.binaryNode(operator, this.expression(), this.expression());
		if (this.accept("LX_NEQ")) return NodesBuilder.binaryNode(operator, this.expression(), this.expression());
		if (this.accept("LX_LE")) return NodesBuilder.binaryNode(operator, this.expression(), this.expression());
		if (this.accept("LX_GE")) return NodesBuilder.binaryNode(operator, this.expression(), this.expression());
		if (this.accept("LX_LT")) return NodesBuilder.binaryNode(operator, this.expression(), this.expression());
		if (this.accept("LX_GT")) return NodesBuilder.binaryNode(operator, this.expression(), this.expression());
	}

	// Item statement
	item() {
		// item -> id | number | string
		// get the item token and check if the next token is an expression(Default expressions)

		if (this.accept("LX_ID")) return NodesBuilder.itemNode(this.currentToken.value);
		if (this.accept("LX_NUMBER")) return NodesBuilder.itemNode(this.currentToken.value);
		if (this.accept("LX_STRING")) return NodesBuilder.itemNode(this.currentToken.value);
	}

	// Function call statement
	functionCall() {
		// func_call -> id "(" expression* | argument_list? ")"
		// get the id token and check if the next token is an expression(Default expressions)

		let name = this.currentToken;
		if (this.accept("LX_ID")) return NodesBuilder.functionCallNode(name, this.expression());
	}

	// Argument list statement
	argumentList() {
		// argument_list -> expression ("," expression)*
		// get the expression token and check if the next token is an expression(Default expressions)

		let args = [];
		while (this.accept("LX_COMMA")) {
			args.push(this.expression());
		}
		return NodesBuilder.argumentListNode(args);
	}
	
	// Var statement
	var() {
		// var -> "var" id ("=" expression)? ";"
		// get the id token and check if the next token is an expression(Default expressions)

		let name = this.currentToken;
		if (this.accept("LX_VAR")) return NodesBuilder.varNode(name, this.expression());
	}
}

// Test
let tokens = [
	{ type: "LX_PAREN", value: "(", line: 1 },
	{ type: "LX_NUMBER", value: "10", line: 1 },
	{ type: "LX_PLUS", value: "+", line: 1 },
	{ type: "LX_NUMBER", value: "20", line: 1 },
	{ type: "LX_PAREN", value: ")", line: 1 },
];

let parser = new Parser(tokens);
let ast = parser.parse();
console.log(JSON.stringify(ast, null, 4));