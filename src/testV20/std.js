// Std functions for default use on Dryad language interpreter
// Make an clean and complelty root functions for Dryad language

// Imports
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Stdin
function readStdin() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise((resolve, reject) => {
        rl.question('', (answer) => {
            resolve(answer);
            rl.close();
        });
    });
}

// Stdout
function writeStdout(text) {
    process.stdout.write(text);
}

// Stderr
function writeStderr(text) {
    process.stderr.write(text);
}

// Tests