using v8.backend.Errors;
using v8.backend.lexer;
using v8.backend.lexer.types;
using System.Collections.Generic;
using v8.backend.parser;

namespace v8
{
    public class Program
    {
        static void Main(string[] args)
        {
            try
            {
                Tokenizer tok = new("1+(1 * 1)", "file.dyd");

                List<Token> tokens = tok.Tokenize();

                foreach (Token token in tokens)
                {
                    System.Console.WriteLine(token.type);
                }

                System.Console.WriteLine("=====================================");

                MathParser parser = new MathParser(tokens);

                MathTree tree = parser.Parse();

                tree.Print();

                System.Console.WriteLine("=====================================");

                MathInterpreter mathI = new MathInterpreter(tree);

                System.Console.WriteLine(mathI.Evaluate());
            }
            catch (Exception e)
            {
                System.Console.WriteLine(e.ToString());
            }
        }

    }

}