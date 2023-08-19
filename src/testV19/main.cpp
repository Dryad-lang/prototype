// hello world cpp

#include <iostream>
#include <string>

int main()
{
    // Assing: =, ==, !=, <, >, <=, >=
    // Stream: <<, >>
    while (true)
    {
        std::cout << "Enter your name: ";
        std::string name;
        std::cin >> name;
        if (name == "quit")
        {
            break;
        }
        std::cout << "Hello " << name << std::endl;
    }
}