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

*/ 

// Imports
const { TokenStack } = require('./stack');
// token: { type: "type", value: "value", line: "line" }
// TODO: Implement the parser

// Ast node
class AstNode {
	constructor(type, value, children = []) {
		this.type = type;
		this.value = value;
		this.children = children;
	}
}

// Ast tree
class AstTree {
	constructor() {
		this.root = null;
	}

	addNode(node) {
		if (this.root === null) this.root = node;
		else this.root.children.push(node);
	}
}

// Parser tools for parsing the tokens
// this static class will have methods for parsing the tokens and will be used by the statements
// inject the parser tools in the statements with injection of dependencies
class ParserTools {
	constructor() {}

	// Expect a token of a specific type
	static expect(tokens, type) {
		if (tokens.peek().type === type) return tokens.next();
		else throw new Error(`Expected ${type} but got ${tokens.peek().type}`);
	}

	// Expect a token of a specific type and value
	static expectValue(tokens, type, value) {
		if (tokens.peek().type === type && tokens.peek().value === value) return tokens.next();
		else throw new Error(`Expected ${type} ${value} but got ${tokens.peek().type} ${tokens.peek().value}`);
	}

	// Accept a token of a specific type
	static accept(tokens, type) {
		if (tokens.peek().type === type) return tokens.next();
		else return null;
	}

	// Accept a token of a specific type and value
	static acceptValue(tokens, type, value) {
		if (tokens.peek().type === type && tokens.peek().value === value) return tokens.next();
		else return null;
	}

	// Error
	static error(tokens, message) {
		let errorMessage = `Error: ${message} at line ${tokens.peek().line}`;
		throw new Error(errorMessage);
	}

	// Check if the token is of a specific type
	static check(tokens, type) {
		return tokens.peek().type === type;
	}

	// Check if the token is of a specific type and value
	static checkValue(tokens, type, value) {
		return tokens.peek().type === type && tokens.peek().value === value;
	}
}

// Base class for the chain of responsability
class StatementHandler {
	constructor(next) {
		this.next = next;
	}
	
	rule() {
		return "statement";
	}

	parse(tokens) {
		return this.next.parse(tokens);
	}
}