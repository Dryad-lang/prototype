// hello world cpp

#include <iostream>
#include <string>
#include <vector>
#include <regex>

#include "tokenizer.h"

int main() {
    std::string input = "var a = 1 + 2;";

    std::vector<Token> tokens = tokenize(input);

    for (Token token : tokens) {
        std::cout << token.name << " " << token.value << std::endl;
    }

    std::cin.get();
    return 0;
}