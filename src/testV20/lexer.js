let defaultLexemeList = [
    // Keywords
    {name:"LX_IF", rx:'if'},
    {name:"LX_ELSE", rx:'else'},
    {name:"LX_WHILE", rx:'while'},
    {name:"LX_DO", rx:'do'},
    {name:"LX_FOR", rx:'for'},
    {name:"LX_FUNC", rx:'function'},
    {name:"LX_VAR", rx:'var'},
    {name:"LX_RETURN", rx:'return'},
    {name:"LX_IMPORT", rx:'import'},
    {name:"LX_EXPORT", rx:'export'},
    {name:"LX_AS", rx:'as'},

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

const { TokenStack } = require('./stack');

// Class content info will store the stream and the line of the stream and the lexeme list
// It will be used to pass the stream and the line to the next handler in the chain of responsability
// making the architecture more flexible and reducing the number of parameters in the handle method
class ContentInfo {
    constructor(stream, line) {
        this.stream = stream;
        this.line = line;
        this.lexemeList = defaultLexemeList;
    }
    
    setStream(stream) {
        this.stream = stream;
    }

    setLine(line) {
        this.line = line;
    }

    setLexemeList(lexemeList) {
        this.lexemeList = lexemeList;
    }

    updateContentInfo(stream, line, lexemeList = this.lexemeList) {
        this.setStream(stream);
        this.setLine(line);
        this.setLexemeList(lexemeList);
    }
}

// Rule handler class is the base class for the chain of responsability of tokenizer
class RuleHandler {
    constructor(nextHandler, contentInfo) {
        this.nextHandler = nextHandler;
        this.contentInfo = contentInfo;
    }

    // Error method will throw an error with the message and the token
    error(message, token) {
        throw new Error(message + " at line " + token.line);
    }

    // handleRule method will try to match the lexeme in the stream
    // if it matches it will return the matched text
    // if it doesn't match it will call the handleRule method of the next handler
    handleRule(contentInfo) {
        throw new Error("Not implemented");
    }

    // handle method will try to match the lexeme in the stream
    // if it matches it will return the matched text
    // if it doesn't match it call the handle method of the next handler
    // if there is no next handler it will call the error method
    handle(contentInfo) {
        throw new Error("Not implemented");
    }
}

// Whitespace handler will handle the whitespace lexeme and remove it from the stream and pass
// the stream to the next handler in the chain of responsability
class WhitespaceHandler extends RuleHandler {
    constructor(nextHandler, contentInfo) {
        super(nextHandler, contentInfo);
    }

    handleRule(contentInfo) {
        const match = contentInfo.stream.match(/^[ \t\v\f]+/);
        return match ? match[0] : null;
    }

    handle(contentInfo) {
        const matchedText = this.handleRule(contentInfo);
        if (matchedText) {
            contentInfo.updateContentInfo(contentInfo.stream.substring(matchedText.length), contentInfo.line);
            return contentInfo;
        }
        return this.nextHandler.handle(contentInfo);
    }
}

// New line handler will handle the new line lexeme and remove it from the stream, increment the line and pass
// the stream to the next handler in the chain of responsability
class NewLineHandler extends RuleHandler {
    constructor(nextHandler, contentInfo) {
        super(nextHandler, contentInfo);
    }

    handleRule(contentInfo) {
        const match = contentInfo.stream.match(/^[\r\n]+/);
        if (match) {
            contentInfo.line += match[0].length;
            return match[0];
        }
        return null;
    }

    handle(contentInfo) {
        const matchedText = this.handleRule(contentInfo);
        if (matchedText) {
            contentInfo.updateContentInfo(contentInfo.stream.substring(matchedText.length), contentInfo.line);
            return contentInfo;
        }
        return this.nextHandler.handle(contentInfo);
    }
}

// Lexeme handler will handle the lexeme and remove it from the stream, and return the lexeme as a token {name, val, line} with the
// updated content info {contentInfo, token}
class LexemeHandler extends RuleHandler {
    constructor(nextHandler, contentInfo) {
        super(nextHandler, contentInfo);
    }

    handleRule(contentInfo) {
        for (let lexeme of contentInfo.lexemeList) {
            const match = contentInfo.stream.match(RegExp("^(" + lexeme.rx + ")"));
            if (match) {
                return {token: { name: lexeme.name, val: match[0], line: contentInfo.line }, contentInfo: {stream: contentInfo.stream.substring(match[0].length), line: contentInfo.line}};
            }
        }
        return null;
    }

    handle(contentInfo) {
        const {token, contentInfo: newContentInfo} = this.handleRule(contentInfo);
        if (token) {
            return {token, contentInfo: newContentInfo};
        }
        return this.nextHandler.handle(contentInfo);
    }
}

// Unknown lexeme if reached will throw an error with the unknown lexeme
class UnknownLexemeHandler extends RuleHandler {
    constructor(nextHandler, contentInfo) {
        super(nextHandler, contentInfo);
    }

    handleRule(contentInfo) {
        const match = contentInfo.stream.match(/^\S+/);
        if (match) {
            console.error("Unknown lexeme: " + match[0]);
            return match[0];
        }
        return null;
    }

    handle(contentInfo) {
        const matchedText = this.handleRule(contentInfo);
        if (matchedText) {
            this.error("Unknown lexeme: " + matchedText, {line: contentInfo.line});
        }
        return this.nextHandler.handle(contentInfo);
    }
}

// Tokenizer class will tokenize the stream and return a list of tokens
class Tokenizer {
    constructor(lexemeList) {
        this.lexemeList = lexemeList;
        this.tokenStack = new TokenStack();
        this.handler_list = [
            new WhitespaceHandler(null, null),
            new NewLineHandler(null, null),
            new LexemeHandler(null, null),
            new UnknownLexemeHandler(null, null)
        ];
        this.baseHandler = this.handler_list[0];
    }

    // setup method will setup the chain of responsability
    setup() {
        for (let i = 0; i < this.handler_list.length - 1; i++) {
            this.handler_list[i].nextHandler = this.handler_list[i + 1];
        }
    }

    initialize() {
        this.setup();
        this.tokenStack = new TokenStack();
    }

    lex(stream) {
        this.initialize();
        let _currentContentInfo = new ContentInfo(stream, 0); // Initialize the content info
        while (!_currentContentInfo.stream == '') {
            const {token, contentInfo} = this.baseHandler.handle(_currentContentInfo);
            if (token) {
                this.tokenStack.push(token);
                _currentContentInfo.updateContentInfo(contentInfo.stream, contentInfo.line);
            }
        }
        this.tokenStack.push({name: "LX_EOF", val: "EOF", line: _currentContentInfo.line});
        return this.tokenStack;
    }
}

module.exports = {
    Tokenizer, defaultLexemeList
}