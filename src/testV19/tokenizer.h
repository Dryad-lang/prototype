#include <iostream>
#include <vector>
#include <regex>
#include <map>

struct Lexeme {
    std::string name;
    std::regex rx;
};

struct Token{
    std::string name;
    std::string value;
};


std::map<std::string, std::regex> lexeme_map = {
    // Keywords
    {"LX_IF", std::regex("if(?![a-zA-Z0-9_])")},
    {"LX_ELSE", std::regex("else(?![a-zA-Z0-9_])")},
    {"LX_WHILE", std::regex("while(?![a-zA-Z0-9_])")},
    {"LX_DO", std::regex("do(?![a-zA-Z0-9_])")},
    {"LX_FOR", std::regex("for(?![a-zA-Z0-9_])")},
    {"LX_FUNC", std::regex("function(?![a-zA-Z0-9_])")},
    {"LX_VAR", std::regex("var(?![a-zA-Z0-9_])")},
    {"LX_TRUE", std::regex("true(?![a-zA-Z0-9_])")},
    {"LX_FALSE", std::regex("false(?![a-zA-Z0-9_])")},
    {"LX_EMPTY", std::regex("empty(?![a-zA-Z0-9_])")},
    {"LX_RETURN", std::regex("return(?![a-zA-Z0-9_])")},
    {"LX_IMPORT", std::regex("import(?![a-zA-Z0-9_])")},
    {"LX_EXPORT", std::regex("export(?![a-zA-Z0-9_])")},
    {"LX_AS", std::regex("as(?![a-zA-Z0-9_])")},
    {"LX_FROM", std::regex("from(?![a-zA-Z0-9_])")},

    // Constants
    {"LX_ID", std::regex("[a-zA-Z_][a-zA-Z0-9_]*")},
    {"LX_NUMBER", std::regex("[0-9]+(\\.[0-9]*)?")},
    {"LX_STRING", std::regex("\"(\\\\\"|[^\"])*\"|'(\\\\'|[^'])*'")},

    // Punctuation
    {"LX_LPAREN", std::regex("\\(")},
    {"LX_RPAREN", std::regex("\\)")},
    {"LX_LCURLY", std::regex("\\{")},
    {"LX_RCURLY", std::regex("\\}")},
    {"LX_LBRACKET", std::regex("\\[")},
    {"LX_RBRACKET", std::regex("\\]")},
    {"LX_SEMICOLON", std::regex(";")},
    {"LX_COLON", std::regex(":")},
    {"LX_COMMA", std::regex(",")},
    {"LX_DOT", std::regex("\\.")},

    // Logical
    {"LX_LAND", std::regex("&&")},
    {"LX_LOR", std::regex("\\|\\|")},

    // Special assign
    {"LX_PLUSSET", std::regex("\\+=")},
    {"LX_MINUSSET", std::regex("-=")},
    {"LX_MULTSET", std::regex("\\*=")},
    {"LX_DIVSET", std::regex("/=")},
    {"LX_MODULOSET", std::regex("%=")},
    {"LX_ANDSET", std::regex("&=")},
    {"LX_ORSET", std::regex("\\|=")},
    {"LX_XORSET", std::regex("\\^=")},
    {"LX_LSHIFTSET", std::regex("<<=")},
    {"LX_RSHIFTSET", std::regex(">>=")},

    // Binary
    {"LX_AND", std::regex("&")},
    {"LX_OR", std::regex("\\|")},
    {"LX_XOR", std::regex("\\^")},
    {"LX_NOT", std::regex("~")},
    {"LX_LSHIFT", std::regex("<<")},
    {"LX_RSHIFT", std::regex(">>")},

    // Comparison
    {"LX_EQ", std::regex("==")},
    {"LX_NEQ", std::regex("!=")},
    {"LX_LE", std::regex("<=")},
    {"LX_GE", std::regex(">=")},
    {"LX_LT", std::regex("<")},
    {"LX_GT", std::regex(">")},

    // Logical not
    {"LX_LNOT", std::regex("!")},

    // Assignment
    {"LX_ASSIGN", std::regex("=")},

    // Operators
    {"LX_INC", std::regex("\\+\\+")},
    {"LX_DEC", std::regex("--")},
    {"LX_POW", std::regex("\\*\\*")},
    {"LX_PLUS", std::regex("\\+")},
    {"LX_MINUS", std::regex("-")},
    {"LX_MULT", std::regex("\\*")},
    {"LX_DIV", std::regex("/")},
    {"LX_MODULO", std::regex("%")}

    // ... (other lexemes)
};

std::vector<Token> tokenize(const std::string& input) {
    std::vector<Token> tokens;
    std::smatch match;
    
    size_t pos = 0;
    while (pos < input.length()) {
        bool matched = false;
        for (const auto& lexeme : lexeme_map) {
            if (std::regex_search(input.cbegin() + pos, input.cend(), match, lexeme.second, std::regex_constants::match_continuous)) {
                if (lexeme.first == "LX_ID" && std::any_of(lexeme_map.begin(), lexeme_map.end(), [&match](const std::pair<std::string, std::regex>& entry) {
                    return entry.first != "LX_ID" && std::regex_match(match[0].str(), entry.second);
                })) {
                    auto it = std::find_if(lexeme_map.begin(), lexeme_map.end(), [&match](const std::pair<std::string, std::regex>& entry) {
                        return entry.first != "LX_ID" && std::regex_match(match[0].str(), entry.second);
                    });
                    tokens.push_back({it->first, match[0]});

                } else {
                    tokens.push_back({lexeme.first, match[0]});
                }
                pos += match[0].length();
                matched = true;
                break;
            }
        }
        
        if (!matched) {
            // Handle unrecognized token or error
            // For example, you can throw an exception or handle it as needed.
            // Here, let's just skip the unrecognized character.
            if (!std::isspace(input[pos])) {
                std::cout << "Unrecognized token: " << input[pos] << std::endl;
            }
            ++pos;
        }
    }
    
    return tokens;
}