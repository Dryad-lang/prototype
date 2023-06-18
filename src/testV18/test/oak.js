/*
-----------------------------------------------------

OAK Package Manager

-----------------------------------------------------

main file

commands:

    oak init 
    1- project name
    2- project description
    3- project version
    4- project author
    5- project license
    6- project repository
        - create project/oak.json file
        - create project/src folder
        - create project/src/main.dyd file
        - create project/oak_modules folder
        - create project/oak_modules/externals folder
        - create project/oak_modules/oakdata folder


        tree:

        project
        ├── oak.json
        ├── oak_modules
        │   ├── externals
        │   └── oakdata
        └── src
            └── main.dyd

    
        oak.json:

        {
            "name": "project",
            "description": "project description",
            "version": "0.0.1",
            "author": "project author",
            "license": "project license",
            "repository": "project repository",
            "main": "src/main.dyd,
            "externals": [
                "dependency1",
                "dependency2",
                ...
            ]
        }


*/ 

// Dependencies
var fs = require("fs");
var path = require("path");
var child_process = require("child_process");
var readline = require("readline");


// Init
function initProject(currpath, name, description, version, author, license, repository) {
    // Create project folder
    fs.mkdirSync(currpath + "/" + name);

    // Create oak.json file
    var oakjson = {
        "name": name,
        "description": description,
        "version": version,
        "author": author,
        "license": license,
        "repository": repository,
        "main": "src/main.dyd",
        "externals": []
    }

    // Create src folder
    fs.mkdirSync(currpath + "/" + name + "/src");

    // Create main.dyd file
    fs.writeFileSync(currpath + "/" + name + "/src/main.dyd", "");

    // Create oak_modules folder
    fs.mkdirSync(currpath + "/" + name + "/oak_modules");

    // Create oak_modules/externals folder
    fs.mkdirSync(currpath + "/" + name + "/oak_modules/externals");

    // Create oak_modules/oakdata folder
    fs.mkdirSync(currpath + "/" + name + "/oak_modules/oakdata");

    // Create oak.json file
    fs.writeFileSync(currpath + "/" + name + "/oak.json", JSON.stringify(oakjson, null, 4));
}

   /*

    externals functions files are js files in the folder oak_modules/extenals/

    externals
    ├── file.js
    └── file2.js
    ...

    externals files is in the form:

    ext = [
        {
            "name": "name",
            "run": function(c) {
                ...
            }
        },
        ...
    ]

    module.exports = ext;

    so this way we loop through all externals files in the externals folder and each data 
    in each file is added to the externals array
    and add to an object  in the folowing format:

    	External functions must be defined as follows:
		"funcName": function(x) { ... }

		{
			"funcName1": function(x) { ... },
            "funcName2": function(x) { ... },
			...
		}
    */ 

// Sync externals
function syncExternals(currpath) {
    var externalsFolder = currpath + "/oak_modules/externals";
    var externalsFiles = fs.readdirSync(externalsFolder);
    var externals = [];

    for (var i = 0; i < externalsFiles.length; i++) {
        var filename = externalsFiles[i];

        if (path.extname(filename) == ".js") {
            var name = path.basename(filename, ".js");
            externals.push(name);
        }
    }

    console.log(externals);
    var oakjson = require(currpath + "/oak.json");
    oakjson["externals"] = externals;
    fs.writeFileSync(currpath + "/oak.json", JSON.stringify(oakjson, null, 4));
    return externals;
} 


// Load externals
function loadExternals(currpath){
    //  Load externals
    var externalsFolder = currpath + "/oak_modules/externals";
    var oakjson = require(currpath + "/oak.json");
    var externals = oakjson["externals"];
    var ext = {};


    for (var i = 0; i < externals.length; i++) {
        var filename = externals[i] + ".js";
        var extpath = externalsFolder + "/" + filename;
        var extdata = require(extpath);

        /*
        final output need to be in the form:
        {
            "name": function(c) { ... },
            "name2": function(c) { ... },
            ...
        }
        */

        for (var j = 0; j < extdata.length; j++) {
            var name = extdata[j]["name"];
            var func = extdata[j]["run"];
            ext[name] = func;
        }
    }

    console.log(ext);

}

var commands = {
    "init": {
        "help": "Create a new project",
        "args": ["name", "description", "version", "author", "license", "repository"],
        "run": function(x, y) {
        // Ask for project name
        var rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question("Project name: ", function(name) {
            rl.question("Project description: ", function(description) {
                rl.question("Project version: ", function(version) {
                    rl.question("Project author: ", function(author) {
                        rl.question("Project license: ", function(license) {
                            rl.question("Project repository: ", function(repository) {
                                rl.close();

                                // Create project
                                initProject(process.cwd(), name, description, version, author, license, repository);
                            });
                        });
                    });
                });
            });
        });    
    }},
    "syncext": {
        "help": "Sync externals",
        "args": [],
        "run": function() {
            syncExternals(process.cwd());
        }
    },
    "loadext": {
        "help": "Load externals",
        "args": [],
        "run": function() {
            loadExternals(process.cwd());
        }
    }
}

// Main
function main() {
    if (process.argv.length < 3) {
        console.log("Usage: node " + process.argv[1].split("/").pop() + " command");
        process.exit();
    }

    var command = process.argv[2];
    if (command in commands) {
        commands[command].run();
    } else {
        console.log("Error: command not found");
    }
}

main();