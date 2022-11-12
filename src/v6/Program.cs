using System.Collections.Generic;
using System;

namespace v6
{
    internal class Program
    {
        static void Main(string[] args)
        {
            Lexer lexer = new Lexer("1 + 2 * 3");

            while (lexer.Token != Token.EOF)
            {
                Console.WriteLine(lexer.Token);
                lexer.NextToken();
            }

            Console.WriteLine($"Hello World!");
            Console.ReadLine();
        }
    }
}