// Tokenizer.h

#include <iostream>
#include <string>
#include <vector>
#include <regex>

// // Tokenize input
// std::regex integer("^\\d+$");                      // 1, 2, 3, 4, 5, 6, 7, 8, 9, 0
// std::regex floating("^\\d+\\.\\d+$");              // 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 0.0
// std::regex string("^\".*\"$");                     // "Hello World"
// std::regex identifier("^[a-zA-Z_][a-zA-Z0-9_]*$"); // hello, world, hello_world, helloWorld

// std::regex plus("^\\+$");         // +
// std::regex minus("^\\-$");        // -
// std::regex multiply("^\\*$");     // *
// std::regex divide("^\\/$");       // /
// std::regex assign("^\\=$");       // =
// std::regex equal("^\\==$");       // ==
// std::regex not_equal("^\\!\\=$"); // !=

// std::regex if_("^if$");            // if
// std::regex else_("^else$");        // else
// std::regex while_("^while$");      // while
// std::regex for_("^for$");          // for
// std::regex function("^function$"); // function
// std::regex return_("^return$");    // return
// std::regex true_("^true$");        // true
// std::regex false_("^false$");      // false
// std::regex empty("^empty$");       // empty -> null

// std::regex left_parenthesis("^\\($");  // (
// std::regex right_parenthesis("^\\)$"); // )
// std::regex left_brace("^\\{$");        // {
// std::regex right_brace("^\\}$");       // }
// std::regex left_bracket("^\\[$");      // [
// std::regex right_bracket("^\\]$");     // ]
// std::regex comma("^\\,$");             // ,
// std::regex semicolon("^\\;$");         // ;
// std::regex colon("^\\:$");             // :

// std::regex less("^\\<$");             // <
// std::regex less_equal("^\\<\\=$");    // <=
// std::regex greater("^\\>$");          // >
// std::regex greater_equal("^\\>\\=$"); // >=

// std::regex comment("^\\/\\/.*$"); // // comment
// std::regex whitespace("^\\s+$");  // whitespace
// std::regex newline("^\\n+$");     // newline

// LEXMES
// Structue of the LEXME Array
struct LEXME
{
    std::string type;
    std::regex rule;
};

// LEXME Array
LEXME lexmes[] = {
    {"integer", std::regex("^\\d+$")},
    {"floating", std::regex("^\\d+\\.\\d+$")},
    {"string", std::regex("^\".*\"$")},
    {"identifier", std::regex("^[a-zA-Z_][a-zA-Z0-9_]*$")},

    {"plus", std::regex("^\\+$")},
    {"minus", std::regex("^\\-$")},
    {"multiply", std::regex("^\\*$")},
    {"divide", std::regex("^\\/$")},
    {"assign", std::regex("^\\=$")},
    {"equal", std::regex("^\\==$")},
    {"not_equal", std::regex("^\\!\\=$")},

    {"if", std::regex("^if$")},
    {"else", std::regex("^else$")},
    {"while", std::regex("^while$")},
    {"for", std::regex("^for$")},
    {"function", std::regex("^function$")},
    {"return", std::regex("^return$")},
    {"true", std::regex("^true$")},
    {"false", std::regex("^false$")},
    {"empty", std::regex("^empty$")},

    {"left_parenthesis", std::regex("^\\($")},
    {"right_parenthesis", std::regex("^\\)$")},
    {"left_brace", std::regex("^\\{$")},
    {"right_brace", std::regex("^\\}$")},
    {"left_bracket", std::regex("^\\[$")},
    {"right_bracket", std::regex("^\\]$")},
    {"comma", std::regex("^\\,$")},
    {"semicolon", std::regex("^\\;$")},
    {"colon", std::regex("^\\:$")},

    {"less", std::regex("^\\<$")},
    {"less_equal", std::regex("^\\<\\=$")},
    {"greater", std::regex("^\\>$")},
    {"greater_equal", std::regex("^\\>\\=$")},

    {"comment", std::regex("^\\/\\/.*$")},
    {"whitespace", std::regex("^\\s+$")},
    {"newline", std::regex("^\\n+$")}
};

struct Token
{
    std::string type;
    std::string value;
};

class Tokenizer
{
public:
    // Vector of tokens
    std::vector<Token> tokens;
    std::string input;
    std::vector<std::string> lines;

    bool test_regex(std::regex regex, std::string value)
    {
        return std::regex_match(value, regex);
    };

    void test_chain()
    {
        // Test and output regex
        std::cout << "Regex: " << std::endl;
        std::cout << "integer: " << test_regex(lexmes[0].rule, "123") << std::endl;
        std::cout << "floating: " << test_regex(lexmes[1].rule, "123.123") << std::endl;
        std::cout << "string: " << test_regex(lexmes[2].rule, "\"Hello World\"") << std::endl;
        std::cout << "identifier: " << test_regex(lexmes[3].rule, "hello") << std::endl;

        std::cout << "plus: " << test_regex(lexmes[4].rule, "+") << std::endl;
        std::cout << "minus: " << test_regex(lexmes[5].rule, "-") << std::endl;
        std::cout << "multiply: " << test_regex(lexmes[6].rule, "*") << std::endl;
        std::cout << "divide: " << test_regex(lexmes[7].rule, "/") << std::endl;
        std::cout << "assign: " << test_regex(lexmes[8].rule, "=") << std::endl;
        std::cout << "equal: " << test_regex(lexmes[9].rule, "==") << std::endl;
        std::cout << "not_equal: " << test_regex(lexmes[10].rule, "!=") << std::endl;

        std::cout << "if: " << test_regex(lexmes[11].rule, "if") << std::endl;
        std::cout << "else: " << test_regex(lexmes[12].rule, "else") << std::endl;
        std::cout << "while: " << test_regex(lexmes[13].rule, "while") << std::endl;
        std::cout << "for: " << test_regex(lexmes[14].rule, "for") << std::endl;
        std::cout << "function: " << test_regex(lexmes[15].rule, "function") << std::endl;
        std::cout << "return: " << test_regex(lexmes[16].rule, "return") << std::endl;
        std::cout << "true: " << test_regex(lexmes[17].rule, "true") << std::endl;
        std::cout << "false: " << test_regex(lexmes[18].rule, "false") << std::endl;
        std::cout << "empty: " << test_regex(lexmes[19].rule, "empty") << std::endl;

        std::cout << "left_parenthesis: " << test_regex(lexmes[20].rule, "(") << std::endl;
        std::cout << "right_parenthesis: " << test_regex(lexmes[21].rule, ")") << std::endl;
        std::cout << "left_brace: " << test_regex(lexmes[22].rule, "{") << std::endl;
        std::cout << "right_brace: " << test_regex(lexmes[23].rule, "}") << std::endl;
        std::cout << "left_bracket: " << test_regex(lexmes[24].rule, "[") << std::endl;
        std::cout << "right_bracket: " << test_regex(lexmes[25].rule, "]") << std::endl;
        std::cout << "comma: " << test_regex(lexmes[26].rule, ",") << std::endl;
        std::cout << "semicolon: " << test_regex(lexmes[27].rule, ";") << std::endl;
        std::cout << "colon: " << test_regex(lexmes[28].rule, ":") << std::endl;

        std::cout << "less: " << test_regex(lexmes[29].rule, "<") << std::endl;
        std::cout << "less_equal: " << test_regex(lexmes[30].rule, "<=") << std::endl;
        std::cout << "greater: " << test_regex(lexmes[31].rule, ">") << std::endl;
        std::cout << "greater_equal: " << test_regex(lexmes[32].rule, ">=") << std::endl;

        std::cout << "comment: " << test_regex(lexmes[33].rule, "// comment") << std::endl;
        std::cout << "whitespace: " << test_regex(lexmes[34].rule, " ") << std::endl;
        std::cout << "newline: " << test_regex(lexmes[35].rule, "\n") << std::endl;
    }

    // Tokenize function
    void tokenize()
    {
        tokens.clear();
        split_lines();
        Token tokenobj;

        // Loop through lines
        for (int i = 0; i < lines.size(); i++)
        {
            // Loop through lexmes
            for (int j = 0; j < sizeof(lexmes) / sizeof(lexmes[0]); j++)
            {
                // If lexme matches
                if (test_regex(lexmes[j].rule, lines[i]))
                {
                    // Add token to tokens
                    tokenobj.type = lexmes[j].type;
                    tokenobj.value = lines[i];
                    tokens.push_back(tokenobj);
                }
            }
        }

        // Output tokens
        std::cout << "Tokens: " << std::endl;
    }

private:
    // Split input into lines
    void split_lines()
    {
        // Clear previous lines
        lines.clear();

        // Split input into lines
        std::string line = "";
        for (int i = 0; i < input.length(); i++)
        {
            if (input[i] == '\n' || i == input.length() - 1)
            {
                lines.push_back(line);
                line = "";
            }
            else
            {
                line += input[i];
            }
        }
        lines.push_back(line);
    }
};

int main()
{
    Tokenizer tokenizer;

    // Test regex
    tokenizer.test_chain();

    // Tokenize input
    tokenizer.input = "123\n123.123\n\"Hello World\"\nhello\n+\n-\n*\n/\n=\n==\n!=\nif\nelse\nwhile\nfor\nfunction\nreturn\ntrue\nfalse\nempty\n(\n)\n{\n}\n[\n]\n,\n;\n:\n<\n<=\n>\n>=\n// comment\n \n\n";
    tokenizer.tokenize();

    // Output tokens
    for (int i = 0; i < tokenizer.tokens.size(); i++)
    {
        std::cout << tokenizer.tokens[i].type << " " << tokenizer.tokens[i].value << std::endl;
    }

    // Wait for input
    std::cin.get();
    return 0;
}