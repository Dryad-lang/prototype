using dryad.lexer;

namespace dryad
{
    internal class Program
    {
        static void Main(string[] args)
        {
            string text = @"";
            LexerLister lexer = new LexerLister();
            List<Token> t = lexer.Tokenize(text);
            foreach (Token token in t)
            {
                Console.WriteLine(token.lexeme + " " + token.type);
            }
        }
    }
}