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