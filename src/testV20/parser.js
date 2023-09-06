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
}

class Parser {
	constructor(tokens){
		this.tokens = tokens;
		this.current = 0;
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

	// Expect the current token
	expect(type) {
		if (this.currentToken.type != type) throw new Error("Unexpected token '" + this.currentToken.value + "' at line " + this.currentToken.line);
		return true;
	}

	// Error
	error(message) {
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

	// Parse a statement
	statement() {
		if (this.accept("LX_IF")) return this.ifStatement();
		if (this.accept("LX_WHILE")) return this.whileStatement();
		if (this.accept("LX_DO")) return this.doStatement();
		if (this.accept("LX_FOR")) return this.forStatement();
		if (this.accept("LX_FUNC")) return this.functionStatement();
		if (this.accept("LX_VAR")) return this.varStatement();
		if (this.accept("LX_LET")) return this.letStatement();
		if (this.accept("LX_RETURN")) return this.returnStatement();
		if (this.accept("LX_IMPORT")) return this.importStatement();
		if (this.accept("LX_EXPORT")) return this.exportStatement();
		if (this.accept("LX_LCURLY")) return this.blockStatement();
		if (this.accept("LX_ID")) return this.expressionStatement();
		this.error("Unexpected token '" + this.currentToken.value + "' at line " + this.currentToken.line);
	}

	// Parse an if statement
	ifStatement() {
		this.expect("LX_LPAREN");
		let condition = this.expression();
		this.expect("LX_RPAREN");
		let body = this.statement();
		let elseBody = null;
		if (this.accept("LX_ELSE")) elseBody = this.statement();
		return NodesBuilder.ifNode(condition, body, elseBody);
	}

	// Parse a while statement
	whileStatement() {
		this.expect("LX_LPAREN");
		let condition = this.expression();
		this.expect("LX_RPAREN");
		let body = this.statement();
		return NodesBuilder.whileNode(condition, body);
	}

	// Parse a do statement
	doStatement() {
		let body = this.statement();
		this.expect("LX_WHILE");
		this.expect("LX_LPAREN");
		let condition = this.expression();
		this.expect("LX_RPAREN");
		this.expect("LX_SEMICOLON");
		return NodesBuilder.doNode(body, condition);
	}

	// Parse a for statement
	forStatement() {
		this.expect("LX_LPAREN");
		let init = null;
		if (!this.accept("LX_SEMICOLON")) {
			init = this.expression();
			this.expect("LX_SEMICOLON");
		}
		let condition = null;
		if (!this.accept("LX_SEMICOLON")) {
			condition = this.expression();
			this.expect("LX_SEMICOLON");
		}
		let increment = null;
		if (!this.accept("LX_RPAREN")) {
			increment = this.expression();
			this.expect("LX_RPAREN");
		}
		let body = this.statement();
		return NodesBuilder.forNode(init, condition, increment, body);
	}

	// Parse a function statement
	functionStatement() {
		let name = this.currentToken.value;
		this.expect("LX_ID");
		this.expect("LX_LPAREN");
		let args = [];
		while (!this.accept("LX_RPAREN")) {
			args.push(this.currentToken.value);
			this.expect("LX_ID");
			if (!this.accept("LX_RPAREN")) this.expect("LX_COMMA");
		}
		let body = this.statement();
		return NodesBuilder.functionNode(name, args, body);
	}

	// Parse a function call statement
	functionCallStatement() {
		let name = this.currentToken.value;
		this.expect("LX_ID");
		this.expect("LX_LPAREN");
		let args = [];
		while (!this.accept("LX_RPAREN")) {
			args.push(this.expression());
			if (!this.accept("LX_RPAREN")) this.expect("LX_COMMA");
		}
		return NodesBuilder.functionCallNode(name, args);
	}

	// Parse an argument list statement
	argumentListStatement() {
		let args = [];
		while (!this.accept("LX_RPAREN")) {
			args.push(this.expression());
			if (!this.accept("LX_RPAREN")) this.expect("LX_COMMA");
		}
		return NodesBuilder.argumentListNode(args);
	}

	// Parse a var statement
	varStatement() {
		let name = this.currentToken.value;
		this.expect("LX_ID");
		let value = null;
		if (this.accept("LX_ASSIGN")) value = this.expression();
		this.expect("LX_SEMICOLON");
		return NodesBuilder.varNode(name, value);
	}

	// Parse a let statement
	letStatement() {
		let name = this.currentToken.value;
		this.expect("LX_ID");
		let value = null;
		if (this.accept("LX_ASSIGN")) value = this.expression();
		this.expect("LX_SEMICOLON");
		return NodesBuilder.letNode(name, value);
	}

	// Parse a return statement
	returnStatement() {
		let value = null;
		if (!this.accept("LX_SEMICOLON")) value = this.expression();
		this.expect("LX_SEMICOLON");
		return NodesBuilder.returnNode(value);
	}

	// Parse an import statement
	importStatement() {
		let name = this.currentToken.value;
		this.expect("LX_ID");
		let asName = null;
		if (this.accept("LX_AS")) asName = this.currentToken.value;
		this.expect("LX_SEMICOLON");
		return NodesBuilder.importNode(name, asName);
	}

	// Parse an export statement
	exportStatement() {
		let names = [];
		while (!this.accept("LX_SEMICOLON")) {
			names.push(this.currentToken.value);
			this.expect("LX_ID");
			if (!this.accept("LX_SEMICOLON")) this.expect("LX_COMMA");
		}
		return NodesBuilder.exportNode(names);
	}

	// Parse an assign statement
	assignStatement(name) {
		let operator = this.currentToken.value;
		this.expect("LX_ASSIGN");
		let value = this.expression();
		this.expect("LX_SEMICOLON");
		return NodesBuilder.assignNode(name, operator, value);
	}

	// Parse an unary statement
	unaryStatement(operator) {
		let value = this.expression();
		this.expect("LX_SEMICOLON");
		return NodesBuilder.unaryNode(operator, value);
	}

	// Parse a binary statement
	binaryStatement(operator) {
		let left = this.expression();
		let right = this.expression();
		this.expect("LX_SEMICOLON");
		return NodesBuilder.binaryNode(operator, left, right);
	}

	// Parse an item statement
	itemStatement() {
		let value = this.expression();
		this.expect("LX_SEMICOLON");
		return NodesBuilder.itemNode(value);
	}

	// Parse an expression statement
	expressionStatement() {
		let value = this.expression();
		this.expect("LX_SEMICOLON");
		return NodesBuilder.expressionNode(value);
	}

	// Parse a block statement
	blockStatement() {
		let statements = [];
		while (!this.accept("LX_RCURLY")) {
			statements.push(this.statement());
		}
		return NodesBuilder.blockNode(statements);
	}

	// Parse an expression
	expression() {
		if (this.accept("LX_ID")) return this.functionCallStatement();
		if (this.accept("LX_LPAREN")) return this.argumentListStatement();
		if (this.accept("LX_ID")) return NodesBuilder.itemNode(this.currentToken.value);
		if (this.accept("LX_NUMBER")) return NodesBuilder.itemNode(parseFloat(this.currentToken.value));
		if (this.accept("LX_STRING")) return NodesBuilder.itemNode(this.currentToken.value);
		if (this.accept("LX_LNOT")) return this.unaryStatement(this.currentToken.value);
		if (this.accept("LX_PLUS")) return this.unaryStatement(this.currentToken.value);
		if (this.accept("LX_MINUS")) return this.unaryStatement(this.currentToken.value);
		if (this.accept("LX_INC")) return this.unaryStatement(this.currentToken.value);
		if (this.accept("LX_DEC")) return this.unaryStatement(this.currentToken.value);
		if (this.accept("LX_AND")) return this.binaryStatement(this.currentToken.value);
		if (this.accept("LX_OR")) return this.binaryStatement(this.currentToken.value);
		if (this.accept("LX_XOR")) return this.binaryStatement(this.currentToken.value);
		if (this.accept("LX_LSHIFT")) return this.binaryStatement(this.currentToken.value);
		if (this.accept("LX_RSHIFT")) return this.binaryStatement(this.currentToken.value);
		if (this.accept("LX_EQ")) return this.binaryStatement(this.currentToken.value);
		if (this.accept("LX_NEQ")) return this.binaryStatement(this.currentToken.value);
		if (this.accept("LX_LE")) return this.binaryStatement(this.currentToken.value);
		if (this.accept("LX_GE")) return this.binaryStatement(this.currentToken.value);
		if (this.accept("LX_LT")) return this.binaryStatement(this.currentToken.value);
		if (this.accept("LX_GT")) return this.binaryStatement(this.currentToken.value);
		if (this.accept("LX_LNOT")) return this.unaryStatement(this.currentToken.value);
		if (this.accept("LX_PLUS")) return this.binaryStatement(this.currentToken.value);
		if (this.accept("LX_MINUS")) return this.binaryStatement(this.currentToken.value);
		if (this.accept("LX_MULT")) return this.binaryStatement(this.currentToken.value);
		if (this.accept("LX_DIV")) return this.binaryStatement(this.currentToken.value);
		if (this.accept("LX_MODULO")) return this.binaryStatement(this.currentToken.value);
		this.error("Unexpected token '" + this.currentToken.value + "' at line " + this.currentToken.line);
	}

	// Check if the parser is at the end
	isAtEnd() {
		return this.current >= this.tokens.length;
	}
}

// Test
let tokens = [

];

let parser = new Parser(tokens);
let ast = parser.parse();
console.log(ast);