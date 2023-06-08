/*
---------------------------------------------------------------------------------------------------------------------

    Dryad programing language
    2023,

---------------------------------------------------------------------------------------------------------------------


    Main file


*/

/*

TOKENIZER

*/ 

var lexeme_list = [
    // Keywords
    {name:"LX_IF", rx:'if(?![a-zA-Z0-9_])'},
    {name:"LX_ELSE", rx:'else(?![a-zA-Z0-9_])'},
    {name:"LX_WHILE", rx:'while(?![a-zA-Z0-9_])'},
    {name:"LX_DO", rx:'do(?![a-zA-Z0-9_])'},
    {name:"LX_FOR", rx:'for(?![a-zA-Z0-9_])'},
    {name:"LX_FUNC", rx:'function(?![a-zA-Z0-9_])'},
    {name:"LX_VAR", rx:'var(?![a-zA-Z0-9_])'},
    {name:"LX_RETURN", rx:'return(?![a-zA-Z0-9_])'},

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

function lexer(stream) {
    var lexemes = [];
    var line = 0;

    while (stream) {        
	var match = null;
    
	if ((match = stream.match(/^[ \t\v\f]+/))) {
	} else if ((match = stream.match(/^[\r\n]+/))) {
	    lexemes.push({name:"LX_NEWLINE", line:line});
	    line += match[0].length;
	}
	for (var i = 0; !match && i < lexeme_list.length; i++) {
	    if ((match = stream.match(RegExp("^(" + lexeme_list[i].rx + ")"))))
		lexemes.push({name:lexeme_list[i].name, val:match[0], line:line});
	}
	if (match)
	    stream = stream.substring(match[0].length);
	else if ((match = stream.match(/^\S+/))) {
	    console.error("Unknown lexeme: " + match[0]);
	    stream = stream.substring(match[0].length);
	} else
	    break;
    }
    return (lexemes);
}

// Test
// let input = `
// var a = 1;
// var b = 2;
// var c = a + b;
// console.log(c);
// `
// let test = lexer(input);
// console.log(test);


/*

PARSER

*/

var parser = (function () {
    var _err;
    var _lex;
    var _curr;
    var _ast;
    var _precedence = [{lx:"LX_LOR"},
		       {lx:"LX_LAND"},
		       {lx:"LX_OR"},
		       {lx:"LX_XOR"},
		       {lx:"LX_AND"},
		       {lx:["LX_EQ", "LX_NEQ"]},
		       {lx:["LX_LE", "LX_LT", "LX_GE", "LX_GT"]},
		       {lx:["LX_LSHIFT", "LX_RSHIFT"]},
		       {lx:["LX_PLUS", "LX_MINUS"]},
		       {lx:["LX_MULT", "LX_DIV", "LX_MODULO"]},
		       {lx:"LX_POW", func:ruleUnary}];

    function parser(lexemes) {
	var tmp;

	_err = false;
	_lex = lexemes;
	shift();
	_ast = {name:"LX_BLOCK", children:[]};
	while ((tmp = ruleBlock()))
	    _ast.children.push(tmp);
	if (_curr)
	    error("Unexpected symbol at the end of expression: " + _curr.name);
	return (_err ? null : _ast);
    }

    /* block: "{" instruction+ "}"
     */
    function ruleBlock() {
	var node;

	if (accept("LX_LCURLY")) {
	    shift();
	    node = {name:"LX_BLOCK", children:[]};
	    do {
		node.children.push(ruleBlock());
	    } while (!accept("LX_RCURLY") && !_err);
	    shift();
	}
	else
	    node = ruleIf() || ruleWhile() || ruleDoWhile() || ruleFor() || ruleInstruction();
	return (node);
    }

    /* for: "for" "(" assign; assign; assign ")" block
     */
    function ruleFor() {
	var node = false;
	var def = {name:"LX_NUMBER", val:1};

	if (accept("LX_FOR")) {
	    node = {name:_curr.name, children:[]};
	    shift();
	    if (!expect("LX_LPAREN"))
		return (false);
	    shift();
	    node.children.push(ruleAssign() || def);
	    if (!expect("LX_SEMICOLON"))
		return (false);
	    shift();
	    node.children.push(ruleAssign() || def);
	    if (!expect("LX_SEMICOLON"))
		return (false);
	    shift();
	    node.children.push(ruleAssign() || def);
	    if (!expect("LX_RPAREN"))
		return (false);
	    shift();
	    node.children.push(ruleBlock());
	}
	return (node);
    }

    /* dowhile: "do" block "while" "(" assign ")";
     */
    function ruleDoWhile() {
	var node = false;

	if (accept("LX_DO")) {
	    node = {name:_curr.name, children:[]};
	    shift();
	    node.children.push(ruleBlock());
	    if (!expect("LX_WHILE") || !shift() || !expect("LX_LPAREN") || !shift())
		return (false);
	    node.children.push(ruleAssign());
	    if (!expect("LX_RPAREN") || !shift() || !expect("LX_SEMICOLON") || !shift())
		return (false);
	}
	return (node);
    }

    /* while: "while" "(" assign ")" block
     */
    function ruleWhile() {
	var node = false;

	if (accept("LX_WHILE")) {
	    node = {name:_curr.name, children:[]};
	    shift();
	    if (!expect("LX_LPAREN"))
		return (false);
	    shift();
	    node.children.push(ruleAssign());
	    if (!expect("LX_RPAREN"))
		return (false);
	    shift();
	    node.children.push(ruleBlock());
	}
	return (node);
    }

    /* if: "if" "(" assign ")" block ("else" block)?
     */
    function ruleIf() {
	var node = false;

	if (accept("LX_IF")) {
	    node = {name:_curr.name, children:[]};
	    shift();
	    if (!expect("LX_LPAREN"))
		return (false);
	    shift();
	    node.children.push(ruleAssign());
	    if (!expect("LX_RPAREN"))
		return (false);
	    shift();
	    node.children.push(ruleBlock());
	    if (accept("LX_ELSE")) {
		shift();
		node.children.push(ruleBlock());
	    }
	}
	return (node);
    }

    /* instruction: assign ";"
     */
    function ruleInstruction() {
	var node = ruleAssign();

	if (!node || !expect("LX_SEMICOLON"))
	    return (false);
	shift();
	return (node);
    }

    /* assign: (id "=")? plusMinus
     */
    function ruleAssign() {
	var parent;
	var node;
	var tmp;

	if (accept("LX_ID") &&
	    ["ASSIGN", "PLUSSET", "MINUSSET", "MULTSET", "DIVSET", "MODULOSET", "ANDSET",
	     "ORSET", "XORSET", "LSHIFTSET", "RSHIFTSET"].indexOf(_lex[0].name.substr(3)) >= 0) {
	    node = {name:_lex[0].name, children:[]};
	    node.children.push({name:_curr.name, val:_curr.val});
	    shift();
	    shift();
	    if (!(tmp = operatorPipeline(0)))
		return (false);
	    node.children.push(tmp);
	} else if (!(node = operatorPipeline(0)))
	    return (false);
	return (node);
    }

    /* Operator pipeline that handles operator precedence
       via multiple recursions with changing arguments
     */
    function operatorPipeline(id) {
	var state = _precedence[id]
	var node;
	var parent;
	var tmp;

	node = state.func ? state.func() : operatorPipeline(id + 1);
	while (accept(state.lx)) {
	    parent = {name:_curr.name, children:[node]};
	    shift();
	    if (!(tmp = (state.func ? state.func() : operatorPipeline(id + 1))))
		return (false);
	    parent.children.push(tmp);
	    node = parent;
	}
	return (node);
    }

    /* unary: [+-!] base
            | (--|++) id
     */
    function ruleUnary() {
	var node;
	var tmp;

	if (accept("LX_MINUS")) {
	    node = {name:_curr.name, children:[]};
	    node.children.push({name:"LX_NUMBER", val:0});
	    shift();
	    if (!(tmp = ruleBase()))
		return (false);
	    node.children.push(tmp);
	} else if (accept(["LX_LNOT", "LX_NOT"])) {
	    node = {name:_curr.name, children:[]};
	    shift();
	    if (!(tmp = ruleBase()))
		return (false);
	    node.children.push(tmp);
	} else if (accept(["LX_INC", "LX_DEC"])) {
	    node = {name:_curr.name, children:[]};
	    shift();
	    if (!expect("LX_ID"))
		return (false);
	    node.children.push({name:_curr.name, val:_curr.val});
	    shift();
	} else {
	    if (accept("LX_PLUS"))
		shift();
	    if (!(node = ruleBase()))
		return (false);
	}
	return (node);
    }

    /* base: number
           | id
           | "(" expression ")"
     */
    function ruleBase() {
	var node = false;
	var tmp;

	if ((tmp = ruleFuncCall()) || (tmp = ruleFunc()))
	    node = tmp;
	else if (accept("LX_STRING")) {
	    node = {name:_curr.name, val:_curr.val.substr(1, _curr.val.length - 2)};
	    shift();
	}
	else if (accept("LX_NUMBER")) {
	    node = {name:_curr.name, val:parseFloat(_curr.val)};
	    shift();
	} else if (accept("LX_ID")) {
	    node = {name:_curr.name, val:_curr.val};
	    shift();
	} else if (accept("LX_LPAREN")) {
	    shift();
	    node = ruleAssign();
	    if (expect("LX_RPAREN"))
		shift();
	} else
	    return (false);
	return (node);
    }

    /* func: "function" "(" id? (, id)* ")" block
     */
    function ruleFunc() {
	var node = false;
	var args = {name:"LX_ARGS", children:[]};

	if (accept("LX_FUNC")) {
	    node = {name:_curr.name, children:[]};
	    shift();
	    if (!expect("LX_LPAREN") || !shift())
		return (false);
	    if (expect("LX_ID")) {
		args.children.push({name:_curr.name, val:_curr.val});
		shift();
		while (accept("LX_COMMA") && shift()) {
		    if (!expect("LX_ID"))
			return (false);
		    args.children.push({name:_curr.name, val:_curr.val});
		    shift();
		}
	    }
	    node.children.push(args);
	    if (!expect("LX_RPAREN") || !shift())
		return (false);
	    node.children.push(ruleBlock());
	}
	return (node);
    }

    /* funcCall: id "(" assign? ("," assign ")") ")"
     */
    function ruleFuncCall() {
	var node = null;
	var tmp;

	if (accept("LX_ID") && _lex[0].name == "LX_LPAREN") {
	    node = {name:"LX_FUNCALL", children:[{name:_curr.name, val:_curr.val}]};
	    shift();
	    shift();
	    if ((tmp = ruleAssign())) {
		node.children.push(tmp);
		while (accept("LX_COMMA") && shift()) {
		    if (!(tmp = ruleAssign()))
			return (false);
		    node.children.push(tmp);
		}
	    }
	    if (!expect("LX_RPAREN") || !shift())
		return (false);
	}
	return (node);
    }

    function accept(lx) {
	if (!_curr)
	    return (false);
	if (typeof lx == "string") {
	    if (_curr.name == lx)
		return (true);
	} else {
	    for (var i in lx) {
		if (_curr.name == lx[i])
		    return (true);
	    }
	}
	return (false);
    }

    function expect(lx) {
	if (accept(lx))
	    return (true);
	if (_curr)
	    error("Expected symbol \"" + lx + "\" but got \"" + _curr.name + "\"");
	else
	    error("Expected symbol \"" + lx + "\"");
	return (false);
    }

    function shift() {
	do
	    _curr = _lex.shift();
	while (_curr && _curr.name == "LX_NEWLINE");
	return (true);
    }

    function error(msg) {
	if (_curr)
	    console.error("Error at line " + _curr.line + ": " + msg);
	else
	    console.error("Error: " + msg);
	_err = true;
    }

    return (parser);
} ());


/*

    INTERPRETER

*/

var interpreter = (function () {
    var _scopeStack = [];
    var _this;
    var _super;
    var _funcs = {LX_PLUS: function(c) { return (interpretExpr(c[0]) + interpretExpr(c[1])); },
		  LX_MINUS: function(c) { return (interpretExpr(c[0]) - interpretExpr(c[1])); },
		  LX_POW: function(c) { return (Math.pow(interpretExpr(c[0]), interpretExpr(c[1]))); },
		  LX_MULT: function(c) { return (interpretExpr(c[0]) * interpretExpr(c[1])); },
		  LX_DIV: function(c) { return (interpretExpr(c[0]) / interpretExpr(c[1])); },
		  LX_MODULO: function(c) { return (interpretExpr(c[0]) % interpretExpr(c[1])); },
		  LX_INC: function(c) { return (setValue(c[0].val, getValue(c[0].val) + 1)); },
		  LX_DEC: function(c) { return (setValue(c[0].val, getValue(c[0].val) - 1)); },

		  LX_OR: function(c) { return (interpretExpr(c[0]) | interpretExpr(c[1])); },
		  LX_XOR: function(c) { return (interpretExpr(c[0]) ^ interpretExpr(c[1])); },
		  LX_AND: function(c) { return (interpretExpr(c[0]) & interpretExpr(c[1])); },
		  LX_NOT: function(c) { return (~interpretExpr(c[0])); },
		  LX_LSHIFT: function(c) { return (interpretExpr(c[0]) << interpretExpr(c[1])); },
		  LX_RSHIFT: function(c) { return (interpretExpr(c[0]) >> interpretExpr(c[1])); },

		  LX_EQ: function(c) { return (interpretExpr(c[0]) == interpretExpr(c[1])); },
		  LX_NEQ: function(c) { return (interpretExpr(c[0]) != interpretExpr(c[1])); },
		  LX_LT: function(c) { return (interpretExpr(c[0]) < interpretExpr(c[1])); },
		  LX_LE: function(c) { return (interpretExpr(c[0]) <= interpretExpr(c[1])); },
		  LX_GT: function(c) { return (interpretExpr(c[0]) > interpretExpr(c[1])); },
		  LX_GE: function(c) { return (interpretExpr(c[0]) >= interpretExpr(c[1])); },

		  LX_ASSIGN: function(c) { return (setValue(c[0].val, interpretExpr(c[1]))); },
		  LX_PLUSSET: function(c) { return (setValue(c[0].val, getValue(c[0].val) + interpretExpr(c[1]))); },
		  LX_MINUSSET: function(c) { return (setValue(c[0].val, getValue(c[0].val) - interpretExpr(c[1]))); },
		  LX_MULTSET: function(c) { return (setValue(c[0].val, getValue(c[0].val) * interpretExpr(c[1]))); },
		  LX_DIVSET: function(c) { return (setValue(c[0].val, getValue(c[0].val) / interpretExpr(c[1]))); },
		  LX_MODULOSET: function(c) { return (setValue(c[0].val, getValue(c[0].val) % interpretExpr(c[1]))); },
		  LX_ANDSET: function(c) { return (setValue(c[0].val, getValue(c[0].val) & interpretExpr(c[1]))); },
		  LX_ORSET: function(c) { return (setValue(c[0].val, getValue(c[0].val) | interpretExpr(c[1]))); },
		  LX_XORSET: function(c) { return (setValue(c[0].val, getValue(c[0].val) ^ interpretExpr(c[1]))); },
		  LX_LSHIFTSET: function(c) { return (setValue(c[0].val, getValue(c[0].val) << interpretExpr(c[1]))); },
		  LX_RSHIFTSET: function(c) { return (setValue(c[0].val, getValue(c[0].val) >> interpretExpr(c[1]))); },

		  LX_LNOT: function(c) { return (0 + !interpretExpr(c[0])); },
		  LX_LOR: function(c) {
		      var val = interpretExpr(c[0]);
		      return (val ? val : interpretExpr(c[1]));
		  },
		  LX_LAND: function(c) {
		      var val = interpretExpr(c[0]);
		      return (!val ? val : interpretExpr(c[1]));
		  },

		  LX_BLOCK: function(c) {
		      var val;
		      pushScope();
		      for (var i in c)
			  val = interpretExpr(c[i]);
		      popScope();
		      return (val);
		  },
		  LX_FUNCALL: function(c) {
		      var f = getValue(c[0].val);
		      var val;

		      if (!f || typeof f != "function" && (typeof f != "object" || !f.name || f.name != "LX_FUNC")) {
			  console.error("Runtime warning: " + c[0].val + " is not a function");
			  return (null);
		      }

		      if (typeof f == "object") {
			  var args = f.children[0].children;
			  if (c.length - 1 < args.length)
			      console.warn("Runtime warning: too few arguments provided to function " + c[0].val);
			  else if (c.length - 1 > args.length)
			      console.warn("Runtime warning: too many arguments provided to function " + c[0].val);
			  pushScope();
			  for (var i = 0; i < args.length; i++)
			      _this[args[i].val] = i + 1 < c.length ? interpretExpr(c[i + 1]) : null;
			  val = interpretExpr(f.children[1]);
			  popScope();
		      } else {
			  var args = [];
			  if (c.length - 1 < f.length)
			      console.warn("Runtime warning: too few arguments provided to function " + c[0].val);
			  else if (c.length - 1 > f.length)
			      console.warn("Runtime warning: too many arguments provided to function " + c[0].val);
			  for (var i = 0; i < f.length; i++)
			      args.push(i + 1 < c.length ? interpretExpr(c[i + 1]) : null);
			  val = f.apply(null, args);
		      }
		      return (val);
		  },

		  LX_IF: function(c) {
		      if (interpretExpr(c[0]))
			  return (interpretExpr(c[1]));
		      return (c.length == 2 ? null : interpretExpr(c[2]));
		  },
		  LX_WHILE: function(c) {
		      var val = null;
		      pushScope();
		      while (interpretExpr(c[0]))
			  val = interpretExpr(c[1]);
		      popScope();
		      return (val);
		  },
		  LX_DO: function(c) {
		      var val = null;
		      pushScope();
		      do
			  val = interpretExpr(c[0]);
		      while (interpretExpr(c[1]));
		      popScope();
		      return (val);
		  },
		  LX_FOR: function(c) {
		      var val = null;
		      pushScope();
		      for (interpretExpr(c[0]); interpretExpr(c[1]); interpretExpr(c[2]))
			  val = interpretExpr(c[3]);
		      popScope();
		      return (val);
		  }
		 }

    function interpreter(ast) {
	if (!ast)
	    return (null);
	pushScope();
	defineBuiltins();
	return (interpretExpr(ast));
    }

    function defineBuiltins() {
	_this.cos = Math.cos;
	_this.acos = Math.acos;
	_this.sin = Math.sin;
	_this.asin = Math.asin;
	_this.tan = Math.tan;
	_this.atan = Math.atan;
	_this.atan2 = Math.atan2;
	_this.sqrt = Math.sqrt;
	_this.cbrt = Math.cbrt;
	_this.exp = Math.exp;
	_this.log = Math.log;
	_this.log10 = Math.log10;
	_this.log2 = Math.log2;
	_this.random = Math.random;
	_this.PI = Math.PI;
	_this.E = Math.E;
	_this.cout = function(x) {process.stdout.write(x);};
	_this.cerr = function(x) {process.stderr.write(x);};
    }

    function interpretExpr(ast) {
	if (["LX_NUMBER", "LX_STRING"].indexOf(ast.name) != -1)
	    return (ast.val);
	if (ast.name == "LX_ID")
	    return (getValue(ast.val));
	if (ast.name == "LX_FUNC")
	    return (ast);
	if (_funcs[ast.name])
	    return (_funcs[ast.name](ast.children));
	return (null);
    }

    function setValue(name, val) {
	for (var i = _scopeStack.length - 1; i >= 0; i--) {
	    if (_scopeStack[i][name] != undefined) {
		_scopeStack[i][name] = val;
		return (val);
	    }
	}
	_this[name] = val;
	return (val);
    }

    function getValue(name) {
	for (var i = _scopeStack.length - 1; i >= 0; i--) {
	    if (_scopeStack[i][name] != undefined)
		return (_scopeStack[i][name]);
	}
	return (undefined);
    }

    function pushScope() {
	_scopeStack.push({});
	_this = _scopeStack[_scopeStack.length - 1];
	_super = _scopeStack[_scopeStack.length - 2];
    }

    function popScope() {
	_scopeStack.pop();
	_this = _super;
	_super = _scopeStack[_scopeStack.length - 2];
    }

    return (interpreter);
} ());

