using System.Collections.Generic;
using System;

namespace v6
{
    internal class Program
    {
        static void Main(string[] args)
        {
            Lexer lexer = new Lexer("1 + 2 * 3");

            List<Token> tokens = lexer.Tokenize();

            foreach (Token token in tokens)
            {
                Console.WriteLine(token.type + " " + token.value);
            }

            Console.ReadLine();
        }
    }
}