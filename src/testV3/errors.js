// Errors

let errorTypeList = [
    {type: "UNEXPECTED CHAR", message: "Unexpected char", code: "000001"}
]

/*
Make errors more explicity

ex:

var i = 0;
^^^

*/

function showLine(code, posStart, posEnd, line){
    let lines = code.split("\n");
    let lineStart = posStart - lines[line - 1].length;
    let lineEnd = posEnd - lines[line - 1].length;
    let lineCode = lines[line - 1];
    let lineError = "";
    for (let i = 1; i < lineCode.length; i++) {
        if (i >= lineStart && i <= lineEnd) {
            lineError += "^";
        } else {
            lineError += " ";
        }
    }
    return lineCode + "\n" + lineError;
}

// Test
// console.log(showLine("var i = 0;\nvar j = 1;", 0, 13, 2));

class Error {
    constructor(type, message, code, posStart, posEnd, line, lineCode){
        this.type = type;
        this.message = message;
        this.code = code;
        this.posStart = posStart;
        this.posEnd = posEnd;
        this.line = line;
        this.lineCode = lineCode;
    }
}

class ErrorTraceback{
    constructor(errorList){
        this.errorList = errorList;
    }

    addError(error){
        this.errorList.push(error);
    }

    getErrors(){
        return this.errorList;
    }

    printErrors(){
        for (let i = 0; i < this.errorList.length; i++) {
            let error = this.errorList[i];
            console.log(`Error: ${error.type} - ${error.message} - ${error.code} - ${error.line}`);
            console.log(showLine(error.lineCode, error.posStart, error.posEnd, error.line));
        }
    }
}