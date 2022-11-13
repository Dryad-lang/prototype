using System.Collections.Generic;
using System;
using System.Linq;
using System.Text;
using System.IO;

namespace v6
{
    internal class Program
    {
        public string ReadFile(string path)
        {
            string text = File.ReadAllText(path);
            return text;
        }

        static void Main(string[] args)
        {
            string code = new Program().ReadFile("file.dyd");
            Lexer lexer = new Lexer(code);

            List<Token> tokens = new List<Token>();

            try
            {
                tokens = lexer.MakeTokens();
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }

            foreach (Token token in tokens)
            {
                Console.WriteLine(token.value + " " + token.type);
            }

            Console.ReadLine();
        }
    }
}