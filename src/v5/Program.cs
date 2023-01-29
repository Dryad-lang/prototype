using v5.Lexical;
using v5.Parsing;
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
            try
            {
                Lexer lexer = new Lexer();
                List<Token> tokens;
                string text = ReadFile("test.dyd");
                if(text == null || text == "")
                {
                    throw new System.Exception("Empty file");
                }
                else 
                {
                    tokens = lexer.Lex(text);
                }
                foreach (Token token in tokens)
                {
                    System.Console.WriteLine(token.Value + " " + token.Type);
                }

                System.Console.WriteLine("----------------------------------------");

                Parser parser = new Parser();
                Ast ast = parser.Parse(tokens);

                AstPrinter astPrinter = new AstPrinter();
                Console.WriteLine(astPrinter.Print(ast));

                System.Console.WriteLine("----------------------------------------");

                Interpreter interpreter = new Interpreter();
                float result = interpreter.Interpret(ast);
                System.Console.WriteLine(result);
            }
            catch(Exception e)
            {
                Console.WriteLine(e.ToString());
            }

            System.Console.ReadLine();
        }
    }
}