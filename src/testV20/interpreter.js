// "use strict";

// var interpreter = (function () {
//     var _scopeStack = []; // Stack of scopes
//     var _this;	
//     var _super; 
//     var _funcs = {

// 		// Math functions
// 		  LX_PLUS: function(c) { return (interpretExpr(c[0]) + interpretExpr(c[1])); },
// 		  LX_MINUS: function(c) { return (interpretExpr(c[0]) - interpretExpr(c[1])); },
// 		  LX_POW: function(c) { return (Math.pow(interpretExpr(c[0]), interpretExpr(c[1]))); },
// 		  LX_MULT: function(c) { return (interpretExpr(c[0]) * interpretExpr(c[1])); },
// 		  LX_DIV: function(c) { return (interpretExpr(c[0]) / interpretExpr(c[1])); },
// 		  LX_MODULO: function(c) { return (interpretExpr(c[0]) % interpretExpr(c[1])); },
// 		  LX_INC: function(c) { return (setValue(c[0].val, getValue(c[0].val) + 1)); },
// 		  LX_DEC: function(c) { return (setValue(c[0].val, getValue(c[0].val) - 1)); },

// 		// Bitwise functions
// 		  LX_OR: function(c) { return (interpretExpr(c[0]) | interpretExpr(c[1])); },
// 		  LX_XOR: function(c) { return (interpretExpr(c[0]) ^ interpretExpr(c[1])); },
// 		  LX_AND: function(c) { return (interpretExpr(c[0]) & interpretExpr(c[1])); },
// 		  LX_NOT: function(c) { return (~interpretExpr(c[0])); },
// 		  LX_LSHIFT: function(c) { return (interpretExpr(c[0]) << interpretExpr(c[1])); },
// 		  LX_RSHIFT: function(c) { return (interpretExpr(c[0]) >> interpretExpr(c[1])); },

// 		// Boolean functions / comparisons
// 		  LX_EQ: function(c) { return (interpretExpr(c[0]) == interpretExpr(c[1])); },
// 		  LX_NEQ: function(c) { return (interpretExpr(c[0]) != interpretExpr(c[1])); },
// 		  LX_LT: function(c) { return (interpretExpr(c[0]) < interpretExpr(c[1])); },
// 		  LX_LE: function(c) { return (interpretExpr(c[0]) <= interpretExpr(c[1])); },
// 		  LX_GT: function(c) { return (interpretExpr(c[0]) > interpretExpr(c[1])); },
// 		  LX_GE: function(c) { return (interpretExpr(c[0]) >= interpretExpr(c[1])); },

// 		// Assignment functions
// 		  LX_ASSIGN: function(c) { return (setValue(c[0].val, interpretExpr(c[1]))); },
// 		  LX_PLUSSET: function(c) { return (setValue(c[0].val, getValue(c[0].val) + interpretExpr(c[1]))); },
// 		  LX_MINUSSET: function(c) { return (setValue(c[0].val, getValue(c[0].val) - interpretExpr(c[1]))); },
// 		  LX_MULTSET: function(c) { return (setValue(c[0].val, getValue(c[0].val) * interpretExpr(c[1]))); },
// 		  LX_DIVSET: function(c) { return (setValue(c[0].val, getValue(c[0].val) / interpretExpr(c[1]))); },
// 		  LX_MODULOSET: function(c) { return (setValue(c[0].val, getValue(c[0].val) % interpretExpr(c[1]))); },
// 		  LX_ANDSET: function(c) { return (setValue(c[0].val, getValue(c[0].val) & interpretExpr(c[1]))); },
// 		  LX_ORSET: function(c) { return (setValue(c[0].val, getValue(c[0].val) | interpretExpr(c[1]))); },
// 		  LX_XORSET: function(c) { return (setValue(c[0].val, getValue(c[0].val) ^ interpretExpr(c[1]))); },
// 		  LX_LSHIFTSET: function(c) { return (setValue(c[0].val, getValue(c[0].val) << interpretExpr(c[1]))); },
// 		  LX_RSHIFTSET: function(c) { return (setValue(c[0].val, getValue(c[0].val) >> interpretExpr(c[1]))); },


// 		  LX_LNOT: function(c) { return (0 + !interpretExpr(c[0])); },
// 		  LX_LOR: function(c) {
// 		      var val = interpretExpr(c[0]);
// 		      return (val ? val : interpretExpr(c[1]));
// 		  },
// 		  LX_LAND: function(c) {
// 		      var val = interpretExpr(c[0]);
// 		      return (!val ? val : interpretExpr(c[1]));
// 		  },

// 		  LX_BLOCK: function(c) {
// 		      var val;
// 		      pushScope();
// 		      for (var i in c)
// 			  val = interpretExpr(c[i]);
// 		      popScope();
// 		      return (val);
// 		  },
// 		  LX_FUNCALL: function(c) {
// 		      var f = getValue(c[0].val);
// 		      var val;

// 		      if (!f || typeof f != "function" && (typeof f != "object" || !f.name || f.name != "LX_FUNC")) {
// 			  console.error("Runtime warning: " + c[0].val + " is not a function");
// 			  return (null);
// 		      }

// 		      if (typeof f == "object") {
// 			  var args = f.children[0].children;
// 			  if (c.length - 1 < args.length)
// 			      console.warn("Runtime warning: too few arguments provided to function " + c[0].val);
// 			  else if (c.length - 1 > args.length)
// 			      console.warn("Runtime warning: too many arguments provided to function " + c[0].val);
// 			  pushScope();
// 			  for (var i = 0; i < args.length; i++)
// 			      _this[args[i].val] = i + 1 < c.length ? interpretExpr(c[i + 1]) : null;
// 			  val = interpretExpr(f.children[1]);
// 			  popScope();
// 		      } else {
// 			  var args = [];
// 			  if (c.length - 1 < f.length)
// 			      console.warn("Runtime warning: too few arguments provided to function " + c[0].val);
// 			  else if (c.length - 1 > f.length)
// 			      console.warn("Runtime warning: too many arguments provided to function " + c[0].val);
// 			  for (var i = 0; i < f.length; i++)
// 			      args.push(i + 1 < c.length ? interpretExpr(c[i + 1]) : null);
// 			  val = f.apply(null, args);
// 		      }
// 		      return (val);
// 		  },
// 		  LX_IF: function(c) {
// 		      if (interpretExpr(c[0]))
// 			  return (interpretExpr(c[1]));
// 		      return (c.length == 2 ? null : interpretExpr(c[2]));
// 		  },
// 		  LX_WHILE: function(c) {
// 		      var val = null;
// 		      pushScope();
// 		      while (interpretExpr(c[0]))
// 			  val = interpretExpr(c[1]);
// 		      popScope();
// 		      return (val);
// 		  },
// 		  LX_DO: function(c) {
// 		      var val = null;
// 		      pushScope();
// 		      do
// 			  val = interpretExpr(c[0]);
// 		      while (interpretExpr(c[1]));
// 		      popScope();
// 		      return (val);
// 		  },
// 		  LX_FOR: function(c) {
// 		      var val = null;
// 		      pushScope();
// 		      for (interpretExpr(c[0]); interpretExpr(c[1]); interpretExpr(c[2]))
// 			  val = interpretExpr(c[3]);
// 		      popScope();
// 		      return (val);
// 		  }
// 		 }

// 	// Interpret an expression
//     function interpreter(ast, externals) {
// 		if (!ast)
// 			return (null);

// 		// Initialize the interpreter
// 		pushScope();

// 		// Define external functions
// 		defineBuiltins(externals);

// 		// Interpret the AST
// 		return (interpretExpr(ast));
//     }

// 	// Define built-in functions
//     function defineBuiltins(externals) {

// 	// Built-in functions this basically just defines the global functions that are built into the language
// 	_this.cos = Math.cos;
// 	_this.acos = Math.acos;
// 	_this.sin = Math.sin;
// 	_this.asin = Math.asin;
// 	_this.tan = Math.tan;
// 	_this.atan = Math.atan;
// 	_this.atan2 = Math.atan2;
// 	_this.sqrt = Math.sqrt;
// 	_this.cbrt = Math.cbrt;
// 	_this.exp = Math.exp;
// 	_this.log = Math.log;
// 	_this.log10 = Math.log10;
// 	_this.log2 = Math.log2;
// 	_this.random = Math.random;
// 	_this.PI = Math.PI;
// 	_this.E = Math.E;
	
// 	// Console functions
// 	_this.ConsoleWrite = function(x) {process.stdout.write(x);};
// 	_this.ConsoleWriteLine = function(x) {process.stdout.write(x + "\n");};
// 	_this.ConsoleRead = function() {return (process.stdin.read());};
// 	_this.ConsoleReadLine = function() {return (process.stdin.read().split("\n")[0]);};
// 	_this.ConsoleReadKey = function() {return (process.stdin.read(1));};
// 	_this.ConsoleError = function(x) {process.stderr.write(x);};

// 		/*
// 		External functions must be defined as follows:
// 		"funcName": function(x) { ... }

// 		{
// 			"funcName": function(x) { ... },
// 			...
// 		}
// 		*/ 

// 		// External functions
// 		if (externals) {
// 			for (var i in externals) {
// 				_this[i] = externals[i];
// 			}
// 		}
//     }

// 	// Interpret an expression
//     function interpretExpr(ast) {

// 		// If the ast is number or string, return it
// 		if (["LX_NUMBER", "LX_STRING"].indexOf(ast.name) != -1)
// 			return (ast.val);
			
// 		// If the ast is an identifier, return its value
// 		if (ast.name == "LX_ID")
// 			return (getValue(ast.val));
		
// 		// If the ast is a function call, call it
// 		if (ast.name == "LX_FUNC")
// 			return (ast);

// 		// If the ast is a function definition, define it
// 		if (_funcs[ast.name])
// 			return (_funcs[ast.name](ast.children));

// 		// Return null if the ast is null
// 		return (null);
//     }

//     function setValue(name, val) {
// 		for (var i = _scopeStack.length - 1; i >= 0; i--) {// Search for the variable in the scope stack
// 			if (_scopeStack[i][name] != undefined) { // If the variable is found, set it
// 			_scopeStack[i][name] = val; // Set the variable
// 			return (val); // Return the value
// 			}
// 		}
// 		_this[name] = val; // If the variable is not found, set it in the global scope
// 		return (val); // Return the value
//     }

//     function getValue(name) { // Get the value of a variable
// 		for (var i = _scopeStack.length - 1; i >= 0; i--) { // Search for the variable in the scope stack
// 			if (_scopeStack[i][name] != undefined) // If the variable is found, return it
// 			return (_scopeStack[i][name]); // Return the value
// 		}
// 		return (undefined); // If the variable is not found, return undefined
//     }
 
//     function pushScope() { // Push a new scope onto the scope stack
// 		_scopeStack.push({}); // Push a new scope
// 		_this = _scopeStack[_scopeStack.length - 1]; // Set the current scope to the new scope
// 		_super = _scopeStack[_scopeStack.length - 2]; // Set the super scope to the previous scope
//     }

//     function popScope() { // Pop the current scope off the scope stack
// 		_scopeStack.pop(); // Pop the current scope
// 		_this = _super; // Set the current scope to the previous scope
// 		_super = _scopeStack[_scopeStack.length - 2]; // Set the super scope to the previous scope
//     }

//     return (interpreter); // Return the interpreter
// } ());

// New

"use strict";

class Interpreter {
    constructor() {
        this._scopeStack = [];
        this._funcs = {};
        this._this;
        this._super;
        this._funcs = {
            // Math functions
            LX_PLUS: (c) => this._interpretExpr(c[0]) + this._interpretExpr(c[1]),
            LX_MINUS: (c) => this._interpretExpr(c[0]) - this._interpretExpr(c[1]),
            LX_POW: (c) => Math.pow(this._interpretExpr(c[0]), this._interpretExpr(c[1])),
            LX_MULT: (c) => this._interpretExpr(c[0]) * this._interpretExpr(c[1]),
            LX_DIV: (c) => this._interpretExpr(c[0]) / this._interpretExpr(c[1]),
            LX_MODULO: (c) => this._interpretExpr(c[0]) % this._interpretExpr(c[1]),
            LX_INC: (c) => this._setValue(c[0].val, this._getValue(c[0].val) + 1),
            LX_DEC: (c) => this._setValue(c[0].val, this._getValue(c[0].val) - 1),

            // Bitwise functions
            LX_OR: (c) => this._interpretExpr(c[0]) | this._interpretExpr(c[1]),
            LX_XOR: (c) => this._interpretExpr(c[0]) ^ this._interpretExpr(c[1]),
            LX_AND: (c) => this._interpretExpr(c[0]) & this._interpretExpr(c[1]),
            LX_NOT: (c) => ~this._interpretExpr(c[0]),
            LX_LSHIFT: (c) => this._interpretExpr(c[0]) << this._interpretExpr(c[1]),
            LX_RSHIFT: (c) => this._interpretExpr(c[0]) >> this._interpretExpr(c[1]),

            // Boolean functions / comparisons
            LX_EQ: (c) => this._interpretExpr(c[0]) == this._interpretExpr(c[1]),
            LX_NEQ: (c) => this._interpretExpr(c[0]) != this._interpretExpr(c[1]),
            LX_LT: (c) => this._interpretExpr(c[0]) < this._interpretExpr(c[1]),
            LX_LE: (c) => this._interpretExpr(c[0]) <= this._interpretExpr(c[1]),
            LX_GT: (c) => this._interpretExpr(c[0]) > this._interpretExpr(c[1]),
            LX_GE: (c) => this._interpretExpr(c[0]) >= this._interpretExpr(c[1]),
            LX_LNOT: (c) => 0 + !this._interpretExpr(c[0]),
            LX_LOR: (c) => {
                const val = this._interpretExpr(c[0]);
                return val ? val : this._interpretExpr(c[1]);
            },
            LX_LAND: (c) => {
                const val = this._interpretExpr(c[0]);
                return !val ? val : this._interpretExpr(c[1]);
            },

            // Block
            LX_BLOCK: (c) => {
                let val;
                this._pushScope();
                for (const i in c) {
                    val = this._interpretExpr(c[i]);
                }
                this._popScope();
                return val;
            },

            // Function call
            LX_FUNCALL: (c) => {
                const f = this._getValue(c[0].val);// Get the function
                let val; // Value to return

                if (!f || typeof f !== "function" && (typeof f !== "object" || !f.name || f.name !== "LX_FUNC")) { 
                    // If the function is not a function or function definition
                    console.error(`Runtime warning: ${c[0].val} is not a function`);
                    return null;
                }

                if (typeof f === "object") {// If the function is a function definition
                    const args = f.children[0].children; // Get the arguments
                    if (c.length - 1 < args.length) {
                        console.warn(`Runtime warning: too few arguments provided to function ${c[0].val}`);
                    } else if (c.length - 1 > args.length) {
                        console.warn(`Runtime warning: too many arguments provided to function ${c[0].val}`);
                    }
                    this._pushScope();
                    for (let i = 0; i < args.length; i++) {
                        this._this[args[i].val] = i + 1 < c.length ? this._interpretExpr(c[i + 1]) : null;
                    }
                    val = this._interpretExpr(f.children[1]);
                    this._popScope();
                } else {
                    const args = [];
                    if (c.length - 1 < f.length) {
                        console.warn(`Runtime warning: too few arguments provided to function ${c[0].val}`);
                    } else if (c.length - 1 > f.length) {
                        console.warn(`Runtime warning: too many arguments provided to function ${c[0].val}`);
                    }
                    for (let i = 0; i < f.length; i++) {
                        args.push(i + 1 < c.length ? this._interpretExpr(c[i + 1]) : null);
                    }
                    val = f.apply(null, args);
                }
                return val;
            },

            // If
            LX_IF: (c) => {
                if (this._interpretExpr(c[0])) 
                    return this._interpretExpr(c[1]);
                return c.length === 2 ? null : this._interpretExpr(c[2]);
            },

            // While
            LX_WHILE: (c) => {
                let val = null;
                this._pushScope();
                while (this._interpretExpr(c[0])) {
                    val = this._interpretExpr(c[1]);
                }
                this._popScope();
                return val;
            },

            // Do
            LX_DO: (c) => {
                let val = null;
                this._pushScope();
                do {
                    val = this._interpretExpr(c[0]);
                } while (this._interpretExpr(c[1]));
                this._popScope();
                return val;
            },

            // For
            LX_FOR: (c) => {
                let val = null;
                this._pushScope();
                for (this._interpretExpr(c[0]); this._interpretExpr(c[1]); this._interpretExpr(c[2])) {
                    val = this._interpretExpr(c[3]);
                }
                this._popScope();
                return val;
            },

            // Assignment
            LX_ASSIGN: (c) => this._setValue(c[0].val, this._interpretExpr(c[1])),
            LX_PLUSSET: (c) => this._setValue(c[0].val, this._getValue(c[0].val) + this._interpretExpr(c[1])),
            LX_MINUSSET: (c) => this._setValue(c[0].val, this._getValue(c[0].val) - this._interpretExpr(c[1])),
            LX_MULTSET: (c) => this._setValue(c[0].val, this._getValue(c[0].val) * this._interpretExpr(c[1])),
            LX_DIVSET: (c) => this._setValue(c[0].val, this._getValue(c[0].val) / this._interpretExpr(c[1])),
            LX_MODULOSET: (c) => this._setValue(c[0].val, this._getValue(c[0].val) % this._interpretExpr(c[1])),
            LX_ANDSET: (c) => this._setValue(c[0].val, this._getValue(c[0].val) & this._interpretExpr(c[1])),
            LX_ORSET: (c) => this._setValue(c[0].val, this._getValue(c[0].val) | this._interpretExpr(c[1])),
            LX_XORSET: (c) => this._setValue(c[0].val, this._getValue(c[0].val) ^ this._interpretExpr(c[1])),
            LX_LSHIFTSET: (c) => this._setValue(c[0].val, this._getValue(c[0].val) << this._interpretExpr(c[1])),
            LX_RSHIFTSET: (c) => this._setValue(c[0].val, this._getValue(c[0].val) >> this._interpretExpr(c[1]))
        };
    }

    interpret(ast, externals) {
        if (!ast) {
            return null;
        }

        // Initialize the scope stack
        this._pushScope();

        this._defineBuiltins();

        if (externals) {
            this._defineExternals(externals);
        }

        const result = this._interpretExpr(ast);

        this._popScope();

        return result;
    }

    _defineBuiltins() {
        // Define built-in functions and constants
        let builtins = [
            // Math functions
            {name: "cos", func: Math.cos},
            {name: "acos", func: Math.acos},
            {name: "sin", func: Math.sin},
            {name: "asin", func: Math.asin},
            {name: "tan", func: Math.tan},
            {name: "atan", func: Math.atan},
            {name: "atan2", func: Math.atan2},
            {name: "sqrt", func: Math.sqrt},
            {name: "cbrt", func: Math.cbrt},
            {name: "exp", func: Math.exp},
            {name: "log", func: Math.log},
            {name: "log10", func: Math.log10},
            {name: "log2", func: Math.log2},
            {name: "random", func: Math.random},
            {name: "PI", func: Math.PI},
            {name: "E", func: Math.E},

            // Stdout functions
            {name: "ConsoleWrite", func: (x) => process.stdout.write(x)},
            {name: "ConsoleWriteLine", func: (x) => process.stdout.write(x + "\n")},


        ];

        for (const builtin of builtins) {
            this._this[builtin.name] = builtin.func;
        }
    }

    _defineExternals(externals) {
        // Define external functions
        for (const external of externals) {
            this._this[external.name] = external.func;
        }
    }

    _interpretExpr(ast) {
        // Interpret the expression
        if (["LX_NUMBER", "LX_STRING"].includes(ast.name)) {
            return ast.val;
        } else if (ast.name === "LX_ID") {
            return this._getValue(ast.val);
        } else if (ast.name === "LX_FUNC") {
            return ast; // Not clear what to return for function calls
        } else if (this._funcs[ast.name]) {
            return this._funcs[ast.name](ast.children);
        }

        return null;
    }



    _setValue(name, val) {
        for (let i = this._scopeStack.length - 1; i >= 0; i--) {
            if (this._scopeStack[i][name] !== undefined) {
                this._scopeStack[i][name] = val;
                return val;
            }
        }

        this._this[name] = val;
        return val;
    }

    _getValue(name) {
        // Get the value of a variable or function
        for (let i = this._scopeStack.length - 1; i >= 0; i--) {
            if (this._scopeStack[i][name] !== undefined) {
                return this._scopeStack[i][name];
            }
        }
        return undefined;
    }

    _pushScope() {
        // Push a new scope onto the scope stack
        /*
        Here's what the scope stack looks like:
        [
            { // Scope 0
                a: 1,
                b: 2,
                c: 3
            },
            { // Scope 1
                a: 4,
                b: 5,
                c: 6
            },
        ]
        */ 
        this._scopeStack.push({});
        this._this = this._scopeStack[this._scopeStack.length - 1];
        this._super = this._scopeStack[this._scopeStack.length - 2];
    }

    _popScope() {
        // Pop the current scope off the scope stack
        this._scopeStack.pop();
        this._this = this._scopeStack[this._scopeStack.length - 1];
        this._super = this._scopeStack[this._scopeStack.length - 2];
    }
}

const lx = require("./lexer.js");
const pr = require("./parser.js");

const lexer = new lx();
const parser = new pr();
const interpreter = new Interpreter();

// const ast = parser.parse(lexer.lex("1 + 2 * 3;"));
let tokens = lexer.lex(`
    add = function(a, b) {
        a + b;
    };
    ConsoleWriteLine(add(1, 2));
`);

let ast = parser.parse(tokens);
console.log(interpreter.interpret(ast));
// console.log(interpreter.interpret(ast));