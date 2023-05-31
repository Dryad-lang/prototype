class errorStack {
    constructor() {
        this.stack = [];
    }

    // Push an error
    push(error) {
        this.stack.push(error);
    }

    // Pop an error
    pop() {
        return this.stack.pop();
    }

    // Peek at the top of the stack
    peek() {
        return this.stack[this.stack.length - 1];
    }

    // Get the stack
    getStack() {
        return this.stack;
    }

    // Thow all the errors
    throwAll() {
        for (let i = 0; i < this.stack.length; i++) {
            throw this.stack[i];
        }
    }
}

class error {
    constructor() {
        this.message = '';
        this.line = 1;
        this.column = 1;
        this.token = null;
    }

    // Set the message
    setMessage(message) {
        this.message = message;
    }

    // Set the line
    setLine(line) {
        this.line = line;
    }

    // Set the column
    setColumn(column) {
        this.column = column;
    }

    // Set the token
    setToken(token) {
        this.token = token;
    }

    // Get the message
    getMessage() {
        return this.message;
    }


    // Show error
    /*
    Error:

    - <current time> - <current date>
    - <message>
    - Line: <line> / Column: <column> / Char: <char> 
    
    */ 

    showError() {
        let error_message = `Error:\n\n- ${this.message}\n- Line: ${this.line} / Column: ${this.column} / Char: ${this.token}\n`;
        console.log(error_message);
    }

    // Throw error
    throwError() {
        throw this;
    }
}


// Error manager class

class ErrorManager {
    constructor() {
        this.error_stack = new errorStack();
    }

    // Push an error
    push(error) {
        this.error_stack.push(error);
    }

    // Pop an error
    pop() {
        return this.error_stack.pop();
    }

    // Peek at the top of the stack
    peek() {
        return this.error_stack.peek();
    }

    // Get the stack
    getStack() {
        return this.error_stack.getStack();
    }

    // Throw all the errors
    throwAll() {
        this.error_stack.throwAll();
    }
}

// Error manager instance
const error_manager = new ErrorManager();

// Export the error manager
module.exports = error_manager;