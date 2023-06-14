/*

PKG.JSON FILES MANAGER

this file is used to create and manage the package files for the language.


Structure of the pkg.json file:
{
    "name": "name of the project",
    "version": "version of the project",
    "externals": [
        {
            "name": "name of the external function",
            "path": "path to the external function"
        },
        ...
    ],
    "description": "description of the project",
    "author": "author of the project",
    "license": "license of the project"
}

*/

var fs = require("fs");
var path = require("path");



function pkgFactory(name, version, description, author, license) {
    var pkg_base = {
        "name": "",
        "version": "",
        "externals": [],
        "description": "",
        "author": "",
        "license": ""
    };

    pkg_base.name = name;
    pkg_base.version = version;
    pkg_base.description = description;
    pkg_base.author = author;
    pkg_base.license = license;

    return (pkg_base);
}

function pkgAddExternal(pkg, name, path) {
    var external = {
        "name": "",
        "path": ""
    };

    external.name = name;
    external.path = path;

    pkg.externals.push(external);

    return (pkg);
}

function pkgRemoveExternal(pkg, name) {
    for (var i = 0; i < pkg.externals.length; i++) {
        if (pkg.externals[i].name == name) {
            pkg.externals.splice(i, 1);
            return (pkg);
        }
    }
    return (pkg);
}

function pkgSave(pkg, path) {
    try {
        fs.writeFileSync(path + "pkg.json", JSON.stringify(pkg, null, 4));
    } catch (err) {
        console.log(err);
    }
}

function pkgLoad(){
    try {
        var pkg = JSON.parse(fs.readFileSync("./pkg.json", "utf8"));
        return (pkg);
    } catch (err) {
        console.log(err);
    }
}

function pkgGetExternals(pkg) {
    var externals = [];
    for (var i = 0; i < pkg.externals.length; i++) {
        externals.push(pkg.externals[i]);
    }

    return (externals);
}

function makeExternalsFolder(){
    try {
        fs.mkdirSync("./externals");
    } catch (err) {
        console.log(err);
    }
}

function pkgGetExternal(pkg, name) {
    for (var i = 0; i < pkg.externals.length; i++) {
        if (pkg.externals[i].name == name) {
            return (pkg.externals[i]);
        }
    }
    return (null);
}


// Test get externals
// var pkg = pkgFactory("test", "0.0.1", "test", "test", "test");
// pkg = pkgLoad();
// console.log(pkgGetExternals(pkg));

// Test make externals folder
// makeExternalsFolder();

// Test get external
// var pkg = pkgFactory("test", "0.0.1", "test", "test", "test");
// pkg = pkgLoad();
// console.log(pkgGetExternal(pkg, "test"));

// // Test add external
// var pkg = pkgFactory("test", "0.0.1", "test", "test", "test");
// pkg = pkgAddExternal(pkg, "test", "test");
// pkgSave(pkg, "./");

// Test remove external
// var pkg = pkgFactory("test", "0.0.1", "test", "test", "test");
// pkg = pkgLoad();
// pkg = pkgRemoveExternal(pkg, "test");
// pkgSave(pkg, "./");


module.exports = {
    pkgAddExternal: pkgAddExternal,
    pkgFactory: pkgFactory,
    pkgGetExternal: pkgGetExternal,
    pkgGetExternals: pkgGetExternals,
    pkgLoad: pkgLoad,
    pkgRemoveExternal: pkgRemoveExternal,
    pkgSave: pkgSave
};