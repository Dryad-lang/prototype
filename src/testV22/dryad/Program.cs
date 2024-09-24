using dryad.lexer;
using dryad.parser;

namespace dryad
{
    internal class Program
    {
        static void Main(string[] args)
        {
            string text = @"1 + 1";
            LexerLister lexer = new LexerLister();
            List<Token> t = lexer.Tokenize(text);
            foreach (Token token in t)
            {
                Console.WriteLine(token.lexeme + " " + token.type);
            }

            Parser parser = new Parser(t);
            Console.WriteLine(parser.Parse());
            Console.WriteLine("Parsing complete. No errors found.");
        }
    }
}