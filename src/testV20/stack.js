// Class stack
class Stack{
	constructor() {
		this.stack = [];
	}

	push(value) {
		this.stack.push(value);
	}

	pop() {
		return this.stack.pop();
	}

	peek() {
		return this.stack[this.stack.length - 1];
	}

	empty() {
		return this.stack.length == 0;
	}
}


// Class token stack
class TokenStack extends Stack{
    constructor(token_list = []) {
        super();
        this.token_list = token_list;
        this.index = 0;
    }

    advance() {
        this.index++;
    }

    size() {
        return this.token_list.length;
    }

    peek() {
        return this.token_list[this.index];
    }

    empty() {
        return this.index >= this.token_list.length;
    }

    push(token) {
        this.token_list.push(token);
    }

    reverse() {
        this.token_list.reverse();
    }

    pop() {
        return this.token_list.pop();
    }

    shift() {
        return this.token_list.shift();
    }
}

module.exports = {
    Stack,
    TokenStack
}