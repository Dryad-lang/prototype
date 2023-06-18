/*
	External functions must be defined as follows:
	"funcName": function(x) { ... }

	{
		"funcName": function(x) { ... },
		...
	}

*/ 
// Imports
var fs = require("fs");
var path = require("path");

// External functions
var externals = {};

// Load external functions
/*
Externals can only be loaded if the project directory is initialized.
*/ 