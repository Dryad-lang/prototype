using v5.Lexical;
using System.Collections.Generic;
using System.IO;

namespace v5
{
    internal class Program
    {
        //Read file and return a string
        private static string ReadFile(string path)
        {
            string text = File.ReadAllText(path);
            return text;
        }

        private static void Main(string[] args)
        {
            string text = ReadFile("test.dyd");
            Lexer lexer = new Lexer();
            List<Token> tokens = lexer.Lex(text);

            foreach (Token token in tokens)
            {
                System.Console.WriteLine(token.Value + " " + token.Type);
            }

            System.Console.ReadLine();
        }
    }
}